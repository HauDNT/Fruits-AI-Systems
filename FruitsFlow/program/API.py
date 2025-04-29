import requests
import aiohttp
import logging
import os
from typing import Dict, Optional

logging.basicConfig(
    level = logging.INFO,
    format = '%(asctime)s - %(levelname)s - %(message)s',
    filename= 'api.log'
)

logger = logging.getLogger(__name__)

class ApiRaspberryCall:
    def __init__(
        self, 
        base_url: str = "http://192.168.59.138:8080",
        headers: Optional[Dict[str, str]] = None, 
        timeout: int = 10
    ):
        self.base_url = base_url.rstrip('/')
        self.headers = headers or {}
        self.timeout = timeout

    async def POST(
        self,
        endpoint: str,
        fields: Dict[str, str],
        image_path: Optional[str] = None,
        image_field_name: str = "image"
    ) -> Dict:
        data = aiohttp.FormData()
        
        for key, value in fields.items():
            data.add_field(key, str(value))
        
        
        
        
        file_handler = None
        
        if image_path:
            if not os.path.isfile(image_path):
                logger.error(f"File ảnh không tồn tại: {image_path}")
                return {"error": f"File ảnh không tồn tại: {image_path}"}
            
            mime_type = "image/jpeg" if image_path.lower().endswith(".jpg") or image_path.lower().endswith(".jpeg") else "image/png"
            file_handler = open(image_path, "rb")
            
            data.add_field(
                image_field_name,
                file_handler,
                filename=os.path.basename(image_path),
                content_type=mime_type
            )

        requestUrl = f"{self.base_url}{endpoint}"
        
        try:
            logger.info(f"Gửi request tới {requestUrl} với fields: {fields} và file: {image_path if image_path else 'None'}")
            
            # response = requests.post(
            #     requestUrl,
            #     data=data,
            #     files=files if files else None,
            #     headers=self.headers,
            #     timeout=self.timeout
            # )
            # return self.handle_response(response)
        
            async with aiohttp.ClientSession() as session:
                async with session.post(
                    requestUrl,
                    data=data,
                    headers=self.headers,
                    timeout=self.timeout
                ) as response:
                    # Xử lý phản hồi
                    return await self.handle_response_async(response)
        
        except requests.exceptions.Timeout:
            logger.error(f"Request timeout sau {self.timeout} giây: {requestUrl}")
            return {"error": "Request timeout"}
        except requests.exceptions.ConnectionError:
            logger.error(f"Lỗi kết nối tới server: {requestUrl}")
            return {"error": "Lỗi kết nối tới server"}
        except Exception as e:
            logger.error(f"Lỗi không xác định: {str(e)}")
            return {"error": f"Lỗi không xác định: {str(e)}"}
        finally:
            # Đóng file ảnh nếu có
            if file_handler:
                file_handler.close()

    async def handle_response_async(self, response: requests.Response) -> Dict:
        try:
            response.raise_for_status()
            logger.info(f"Phản hồi thành công: {response.status_code}")
            return await response.json()
        except aiohttp.ClientResponseError as e:
            logger.error(f"Lỗi HTTP {response.status_code}: {str(e)}")
            return {"error": f"Lỗi HTTP {response.status_code}: {str(e)}"}
        except ValueError:
            logger.error("Phản hồi không phải JSON hợp lệ")
            return {"error": "Phản hồi không phải JSON hợp lệ"}
