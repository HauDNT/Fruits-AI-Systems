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
        
    async def GET(self, endpoint: str, params: Optional[Dict[str, str]] = None) -> Dict:
        requestUrl = f"{self.base_url}{endpoint}"
        
        try:
            logger.info(f"Gửi GET tới {requestUrl} với params: {params}")
            
            async with aiohttp.ClientSession() as session:
                async with session.get(
                    requestUrl,
                    params=params,
                    headers=self.headers,
                    timeout=self.timeout
                ) as response:
                    return await self.handle_response_async(response)

        except aiohttp.ClientError as e:
            logger.error(f"Lỗi kết nối GET: {str(e)}")
            return {"error": str(e)}

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

    async def handle_response_async(self, response: aiohttp.ClientResponse) -> Dict:
        try:
            if response.status == 200:
                logger.info(f"Phản hồi thành công: {response.status}")
                return await response.json()
            else:
                logger.error(f"Lỗi HTTP {response.status}")
                return {"error": f"Lỗi HTTP {response.status}"}
        except aiohttp.ClientResponseError as e:
            logger.error(f"Lỗi HTTP {response.status}: {str(e)}")
            return {"error": f"Lỗi HTTP {response.status}: {str(e)}"}
        except Exception as e:
            logger.error(f"Phản hồi không phải JSON hợp lệ: {str(e)}")
            return {"error": f"Phản hồi không phải JSON hợp lệ: {str(e)}"}

