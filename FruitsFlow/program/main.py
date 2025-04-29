import time
from typing import Dict
import VL53L0X
import FruitRecognitionCNNModel
import Webcams
from API import ApiRaspberryCall

MAX_DISTANCE = 85
MIN_DISTANCE = 50
LIMIT_DISTANCE_RECORD = 3.5

# VL53L0X sensor
lastDistanceRecorded = time.time()
vl53Sensor = VL53L0X.initialize_vl53l0x()

# Model
interpreter, labels = FruitRecognitionCNNModel.load_model_and_labels()

# Webcams
WEBCAMS_NAME = ["Webcam 1", "Webcam 2"]
webcam_1 = Webcams.initialize_webcam(0, WEBCAMS_NAME[0])
webcam_2 = Webcams.initialize_webcam(2, WEBCAMS_NAME[1])

# Init API Caller
apiCaller = ApiRaspberryCall(
    headers={"Authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoidXNlcm5hbWUxIiwiaWF0IjoxNzQ1MTQ4MTA4LCJleHAiOjE3NDUyMzQ1MDh9.EGGt0ZUUJGZRzu8J1nzDDVUP3Y8tZ4lVECgDuYKsZ3U"},
    timeout=10
)

while True:
    if not webcam_1 and not webcam_2:
        print("Không thể khởi tạo bất kỳ webcam nào. Huỷ chương trình", flush=True)
        break
    
    currentTime = time.time()
    distance = VL53L0X.vl53l0x_get_distance(vl53Sensor)
    
    if currentTime - lastDistanceRecorded >= LIMIT_DISTANCE_RECORD and MIN_DISTANCE < distance < MAX_DISTANCE:
        print("-----Bắt đầu nhận diện-----", flush=True)
        
        try:
            print("1. Chụp ảnh vật thể: ", flush=True)
            imageWebcam1, imageWebcam2 = (None, None)
            imageWebcam1 = Webcams.capture_webcam_image(webcam_1, WEBCAMS_NAME[0])
            imageWebcam2 = Webcams.capture_webcam_image(webcam_2, WEBCAMS_NAME[1])
            
            print("==> Chụp vật thể hoàn tất!", flush=True)
            
            print("2. Chạy suy luận: ", flush=True)
            if imageWebcam1 is not None:
                firstResult_idx, firstResult_label, firstResult_confidence = FruitRecognitionCNNModel.model_run_inference(interpreter, imageWebcam1, labels)
            if imageWebcam2 is not None:
                secondResult_idx, secondResult_label, secondResult_confidence = FruitRecognitionCNNModel.model_run_inference(interpreter, imageWebcam2, labels)
            
            print("==> Hoàn tất nhận diện", flush=True)
            
            print("3. Lưu ảnh vào bộ nhớ tạm thời: ", flush=True)
            webcam1_image_path = Webcams.save_image(imageWebcam1, WEBCAMS_NAME[0], firstResult_label)
            webcam2_image_path = Webcams.save_image(imageWebcam2, WEBCAMS_NAME[1], secondResult_label)
            
            print("==> Hoàn tất lưu ảnh", flush=True)
            
            print("4. Gửi API đến Server: ", flush=True)
            fieldsData1: Dict[str, str] = {
                "confidence_level": f"{firstResult_confidence:.10f}",
                "fruitId": 9,
                "typeId": 22,
                "areaId": 4,
                "batchId": 1
            }

            fieldsData2: Dict[str, str] = {
                "confidence_level": f"{secondResult_confidence:.10f}",
                "fruitId": 9,
                "typeId": 22,
                "areaId": 4,
                "batchId": 1
            }
            
            try:
                callApiTurn1 = apiCaller.POST(
                    endpoint = "/fruit-classification/create-classify",
                    fields = fieldsData1,
                    image_path = webcam1_image_path,
                    image_field_name = "classify_image"
                )
                
                callApiTurn2 = apiCaller.POST(
                    endpoint = "/fruit-classification/create-classify",
                    fields = fieldsData2,
                    image_path = webcam2_image_path,
                    image_field_name = "classify_image"
                )
                
                # Lấy message từ phản hồi
                message1 = callApiTurn1.get("message", "Không có message từ server")
                message2 = callApiTurn2.get("message", "Không có message từ server")
                    
                print(f"Kết quả từ server - Webcam 1: {message1}", flush=True)
                print(f"Kết quả từ server - Webcam 2: {message2}", flush=True)
            except Exception as error:
                print(f"Lỗi khi gửi kết quả phân loại: {error}", flush=True)
            
            print("==> Hoàn tất gửi API", flush=True)
            
            print("5. Xoá ảnh trong bộ nhớ")
            if webcam1_image_path: 
                Webcams.delete_image(webcam1_image_path)
            if webcam2_image_path:
                Webcams.delete_image(webcam2_image_path)
            print("==> Xoá ảnh thành công")
            
            print(f">>> Kết thúc phiên! <<<", flush=True)
            print(f"Sẵn sàng nhận diện...", flush=True)
        except Exception as error:
            print(f"Lỗi khi nhận diện trái cây: {error}", flush=True)
        
        lastDistanceRecorded = currentTime
    time.sleep(0.05)
    
print("Dọn dẹp tài nguyên...", flush=True)
if webcam_1:
    webcam_1.release()
if webcam_2:
    webcam_2.release()
print("Đã dừng cả hai webcam.", flush=True)