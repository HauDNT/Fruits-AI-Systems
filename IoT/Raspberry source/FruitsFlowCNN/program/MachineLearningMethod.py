import asyncio
import aiohttp
import Webcams
import FruitRecognitionCNNModel
import requests

def process_recognition(webcam, webcam_name, interpreter, labels):
    image = Webcams.capture_webcam_image(webcam, webcam_name)
    if image is not None:
        label, confidence = FruitRecognitionCNNModel.model_run_inference(interpreter, image, labels)
        return image, label, confidence
    return None, None, None

def hot_download_model(model_url, local_path):
    try:
        response = requests.get(model_url, timeout=10)
        if response.status_code == 200:
            with open(local_path, 'wb') as f:
                f.write(response.content)
            print(f"✅ Tải mô hình thành công: {local_path}")
            return True
        else:
            print(f"❌ HTTP {response.status_code} khi tải mô hình")
            return False
    except Exception as e:
        print(f"🔥 Lỗi khi tải mô hình: {e}")
        return False
