import time
import asyncio
import logging
import json
from typing import Dict
import VL53L0X
import FruitRecognitionCNNModel
import Webcams
import MachineLearningMethod
import RaspberryConfig
from API import ApiRaspberryCall
from ResultAnalyzer import ResultAnalyzer

MAX_DISTANCE = 89
MIN_DISTANCE = 80
LIMIT_DISTANCE_RECORD = 3
MAX_SENSOR_RETRIES = 3

# ---------------------------- Cấu hình và Máy học ---------------------------------
# Cập nhật cấu hình mới nhất cho Raspberry từ Server
asyncio.run(RaspberryConfig.load_remote_config_from_server_and_update())

# Lấy cấu hình
raspberry_config = RaspberryConfig.load_raspberry_config_in_memory()

# Parse nhãn cho mô hình máy học
labels = json.loads(raspberry_config["labels"])

# Tải mô hình học máy
interpreter = FruitRecognitionCNNModel.load_cnn_model()

# ----------------------------- Các thành phân khác --------------------------------
# Logger
logger = logging.getLogger(__name__)

# Bộ phân tích kết quả
analyzer = ResultAnalyzer(standard_threshold=0.7)

# VL53L0X
vl53Sensor = VL53L0X.initialize_vl53l0x()

# Webcams
WEBCAMS_NAME = ["Webcam 1", "Webcam 2"]
webcam_1 = Webcams.initialize_webcam(0, WEBCAMS_NAME[0])
webcam_2 = Webcams.initialize_webcam(2, WEBCAMS_NAME[1])

# API Caller
apiCaller = ApiRaspberryCall(
    base_url=raspberry_config["api_endpoint"],
    headers={"Authorization": raspberry_config["raspAccessToken"]},
    timeout=10
)

if not vl53Sensor:
    print("Không thể khởi tạo cảm biến VL53L0X. Huỷ chương trình", flush=True)
    exit(1)

if not webcam_1 and not webcam_2:
    print("Không thể khởi tạo bất kỳ webcam nào. Huỷ chương trình", flush=True)
    exit(1)

async def main_loop():
    lastDistanceRecorded = time.time()

    try:
        while True:
            if not Webcams.is_webcam_active(webcam_1) or not Webcams.is_webcam_active(webcam_2):
                logger.error("Webcam bị ngắt kết nối. Huỷ chương trình")
                print("Webcam bị ngắt kết nối. Huỷ chương trình", flush=True)
                break
            
            currentTime = time.time()
            
            if currentTime - lastDistanceRecorded < LIMIT_DISTANCE_RECORD:
                await asyncio.sleep(0.1)
                continue
            
            distance = None
            for attempt in range(MAX_SENSOR_RETRIES):
                try:
                    distance = VL53L0X.vl53l0x_get_distance(vl53Sensor)
                    if distance is not None:
                        break
                    logger.warning(f"Attempt {attempt + 1}: VL53L0X returned None")
                except Exception as e:
                    logger.error(f"Attempt {attempt + 1}: VL53L0X error - {e}")
                await asyncio.sleep(0.1)
            
            if distance is None:
                logger.error("Không thể lấy khoảng cách từ VL53L0X sau nhiều lần thử")
                print("Không thể lấy khoảng cách từ VL53L0X. Bỏ qua vòng lặp...", flush=True)
                await asyncio.sleep(0.5)
                continue
            
            if MIN_DISTANCE < distance < MAX_DISTANCE:
                print(f"----> Distance: {distance}", flush=True)
                logger.info("Bắt đầu nhận diện")
                print("-----Bắt đầu nhận diện-----", flush=True)
                
                try:
                    print("1. Chụp ảnh vật thể và chạy suy luận: ", flush=True)
                    imageWebcam1, firstResult_label, firstResult_confidence = MachineLearningMethod.process_recognition(webcam_1, WEBCAMS_NAME[0], interpreter, labels)
                    imageWebcam2, secondResult_label, secondResult_confidence = MachineLearningMethod.process_recognition(webcam_2, WEBCAMS_NAME[1], interpreter, labels)
                    logger.info("Chụp ảnh hoàn tất")
                    print("==> Chụp vật thể hoàn tất!", flush=True)
                    
                    print("2. Lưu ảnh vào bộ nhớ tạm thời: ", flush=True)
                    webcam1_image_path = Webcams.save_image(imageWebcam1, WEBCAMS_NAME[0], firstResult_label) if imageWebcam1 is not None else None
                    webcam2_image_path = Webcams.save_image(imageWebcam2, WEBCAMS_NAME[1], secondResult_label) if imageWebcam2 is not None else None
                    logger.info("Hoàn tất lưu ảnh")
                    print("==> Hoàn tất lưu ảnh", flush=True)
                    
                    print("3. Lọc kết quả: ", flush=True)
                    final_result = analyzer.analyze_results([
                        {
                            "label": firstResult_label,
                            "confidence": firstResult_confidence,
                            "webcam_name": WEBCAMS_NAME[0],
                            "image_path": webcam1_image_path
                        },
                        {
                            "label": secondResult_label,
                            "confidence": secondResult_confidence,
                            "webcam_name": WEBCAMS_NAME[1],
                            "image_path": webcam2_image_path
                        }
                    ])
                    
                    print("4. Gửi kết quả đến Server: ", flush=True)
                    fieldsData = {
                        "confidence_level": f"{final_result['confidence']:.10f}",
                        "result": final_result['label'],
                        "areaId": f"{raspberry_config['areaId']}"
                    }
                    
                    try:
                        response = await apiCaller.POST(
                                endpoint="/fruit-classification/create-classify",
                                fields=fieldsData,
                                image_path=final_result['image_path'],
                                image_field_name="classify_image"
                        )
                        
                        message = response.get("message", "Không có message từ server")
                        
                        print(f"Kết quả từ server - Webcam 1: {message}", flush=True)
                        logger.info("Hoàn tất gửi API")
                    except Exception as error:
                        logger.error(f"Lỗi khi gửi kết quả phân loại: {error}")
                        print(f"Lỗi khi gửi kết quả phân loại: {error}", flush=True)
                    finally:
                        print("4. Xoá ảnh trong bộ nhớ", flush=True)
                        if webcam1_image_path:
                            Webcams.delete_image(webcam1_image_path)
                        if webcam2_image_path:
                            Webcams.delete_image(webcam2_image_path)
                        logger.info("Xoá ảnh thành công")
                        print("==> Xoá ảnh thành công", flush=True)
                    
                    print(f">>> Kết thúc phiên! <<<", flush=True)
                    print(f"Sẵn sàng nhận diện...", flush=True)
                except Exception as error:
                    logger.error(f"Lỗi khi nhận diện trái cây: {error}")
                    print(f"Lỗi khi nhận diện trái cây: {error}", flush=True)
                
                lastDistanceRecorded = currentTime
            else:
                await asyncio.sleep(0.1)
    finally:
        logger.info("Dọn dẹp tài nguyên")
        print("Dọn dẹp tài nguyên...", flush=True)
        if webcam_1:
            webcam_1.release()
        if webcam_2:
            webcam_2.release()
        if vl53Sensor:
            try:
                vl53Sensor.stop_ranging()  # Ensure sensor cleanup
            except Exception as e:
                logger.error(f"Lỗi khi dừng cảm biến VL53L0X: {e}")
        print("Đã dừng cả hai webcam và cảm biến.", flush=True)

# Chạy chương trình bất đồng bộ
if __name__ == "__main__":
    asyncio.run(main_loop())