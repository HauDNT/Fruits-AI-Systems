import os
import json
import time
import asyncio
import logging
import VL53L0X
import FruitRecognitionSVMModel
import Webcams
import MachineLearningMethod
import RaspberryConfig
from API import ApiRaspberryCall
from ResultAnalyzer import ResultAnalyzer
from MQTT_Handler import MQTT_Handler

logger = logging.getLogger(__name__)

class RecognitionRunner:
    MAX_DISTANCE = 95
    MIN_DISTANCE = 75
    LIMIT_DISTANCE_RECORD = 3
    MAX_SENSOR_RETRIES = 3
    WEBCAMS_NAME = ["Webcam 1", "Webcam 2"]

    def __init__(self):
        self.should_restart = False
        self.running = True
        self.raspberry_config = None
        self.labels = None
        self.interpreter = None
        self.apiCaller = None
        self.vl53Sensor = None
        self.webcam_1 = None
        self.webcam_2 = None
        self.analyzer = ResultAnalyzer(standard_threshold=0.7)
        self.mqtt_handle = None

    async def _run_main_loop(self):
        # Khởi tạo tài nguyên (Cấu hình Raspberry, MQTT, mô hình học máy, API caller, cảm biến, webcams)
        self.raspberry_config = RaspberryConfig.load_raspberry_config_in_memory()
        self.labels = json.loads(self.raspberry_config["labels"])
        
        self.mqtt_handler = MQTT_Handler(broker="localhost", port=1883)
        self.mqtt_handler.connect_mqtt()
        
        model_path = self.raspberry_config.get("model_path")
        if not model_path or not os.path.exists(model_path):
            logger.error(f"Không tìm thấy mô hình tại {model_path}, sử dụng mô hình mặc định.")
            model_path = "/home/dell/Workspace/svm/models/default_model.tflite"
            
        self.interpreter = FruitRecognitionSVMModel.load_svm_model(model_path)
        if not self.interpreter:
            print(f"Lỗi: Không thể load mô hình từ đường dẫn: {model_path}")
            logger.error(f"Lỗi: Không thể load mô hình từ đường dẫn: {model_path}")
            return

        self.apiCaller = ApiRaspberryCall(
            base_url=self.raspberry_config["api_endpoint"],
            headers={"Authorization": self.raspberry_config["raspAccessToken"]},
            timeout=10
        )
        
        self.vl53Sensor = VL53L0X.initialize_vl53l0x()
        self.webcam_1 = Webcams.initialize_webcam(0, self.WEBCAMS_NAME[0])
        self.webcam_2 = Webcams.initialize_webcam(2, self.WEBCAMS_NAME[1])

        if not self.vl53Sensor:
            print("Không thể khởi tạo cảm biến VL53L0X. Huỷ chương trình", flush=True)
            return
        if not self.webcam_1 and not self.webcam_2:
            print("Không thể khởi tạo bất kỳ webcam nào. Huỷ chương trình", flush=True)
            return

        lastDistanceRecorded = time.time()
        try:
            while True:
                if not Webcams.is_webcam_active(self.webcam_1) or not Webcams.is_webcam_active(self.webcam_2):
                    logger.error("Webcam bị ngắt kết nối. Huỷ chương trình")
                    print("Webcam bị ngắt kết nối. Huỷ chương trình", flush=True)
                    break
                
                currentTime = time.time()
                
                if currentTime - lastDistanceRecorded < self.LIMIT_DISTANCE_RECORD:
                    await asyncio.sleep(0.1)
                    continue
                
                distance = None
                for attempt in range(self.MAX_SENSOR_RETRIES):
                    try:
                        distance = VL53L0X.vl53l0x_get_distance(self.vl53Sensor)
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
                
                if self.MIN_DISTANCE < distance < self.MAX_DISTANCE:
                    print(f"----> Distance: {distance}", flush=True)
                    logger.info("Bắt đầu nhận diện")
                    print("-----Bắt đầu nhận diện-----", flush=True)
                    
                    try:
                        print("1. Chụp ảnh vật thể và chạy suy luận: ", flush=True)
                        imageWebcam1, firstResult_label, firstResult_confidence = MachineLearningMethod.process_recognition(
                            self.webcam_1, self.WEBCAMS_NAME[0], self.interpreter, self.labels
                        )
                        imageWebcam2, secondResult_label, secondResult_confidence = MachineLearningMethod.process_recognition(
                            self.webcam_2, self.WEBCAMS_NAME[1], self.interpreter, self.labels
                        )
                        logger.info("Chụp ảnh hoàn tất")
                        print("==> Chụp vật thể hoàn tất!", flush=True)
                        
                        print("2. Lưu ảnh vào bộ nhớ tạm thời: ", flush=True)
                        webcam1_image_path = Webcams.save_image(imageWebcam1, self.WEBCAMS_NAME[0], firstResult_label) if imageWebcam1 is not None else None
                        webcam2_image_path = Webcams.save_image(imageWebcam2, self.WEBCAMS_NAME[1], secondResult_label) if imageWebcam2 is not None else None
                        logger.info("Hoàn tất lưu ảnh")
                        print("==> Hoàn tất lưu ảnh", flush=True)
                        
                        print("3. Lọc kết quả: ", flush=True)
                        final_result = self.analyzer.analyze_results([
                            {
                                "label": firstResult_label,
                                "confidence": firstResult_confidence,
                                "webcam_name": self.WEBCAMS_NAME[0],
                                "image_path": webcam1_image_path
                            },
                            {
                                "label": secondResult_label,
                                "confidence": secondResult_confidence,
                                "webcam_name": self.WEBCAMS_NAME[1],
                                "image_path": webcam2_image_path
                            }
                        ])
                        
                        print("4. Gửi kết quả đến Server: ", flush=True)
                        fieldsData = {
                            "confidence_level": f"{final_result['confidence']:.10f}",
                            "result": final_result['label'],
                            "areaId": f"{self.raspberry_config['areaId']}"
                        }
                        
                        try:
                            response = await self.apiCaller.POST(
                                endpoint="/fruit-classification/create-classify",
                                fields=fieldsData,
                                image_path=final_result['image_path'],
                                image_field_name="classify_image"
                            )
                            
                            message = response.get("message", "Không có message từ server")
                            print(f"Kết quả từ server: {message}", flush=True)
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
                        
                        print("5. Gửi kết quả qua MQTT cho ESP32: ", flush=True)
                        if self.mqtt_handler.is_connected:
                            self.mqtt_handler.publish(message=f"{self.raspberry_config.get('device_code')}:{final_result['label']}")
                        else:
                            print("MQTT không kết nối, không thể gửi kết quả tới ESP32", flush=True)
                        
                        print(">>> Kết thúc phiên! <<<", flush=True)
                        print("Sẵn sàng nhận diện...", flush=True)
                    except Exception as error:
                        logger.error(f"Lỗi khi nhận diện trái cây: {error}")
                        print(f"Lỗi khi nhận diện trái cây: {error}", flush=True)
                    
                    lastDistanceRecorded = currentTime
                else:
                    await asyncio.sleep(0.5)
        finally:
            logger.info("Dọn dẹp tài nguyên")
            print("Dọn dẹp tài nguyên...", flush=True)
            if self.webcam_1:
                self.webcam_1.release()
            if self.webcam_2:
                self.webcam_2.release()
            if self.vl53Sensor:
                try:
                    self.vl53Sensor.stop_ranging()
                except Exception as e:
                    logger.error(f"Lỗi khi dừng cảm biến VL53L0X: {e}")
            self.mqtt_handler.disconnect()
            print("Đã dừng MQTT, webcams và cảm biến.", flush=True)

    async def run(self):
        while self.running:
            self.should_restart = False  # Reset flag
            await self._run_main_loop()
            
            if not self.should_restart:
                break
            
            print("Khởi chạy lại với cấu hình mới", flush=True)

    def request_restart(self):
        self.should_restart = True
    
    def stop(self):
        self.running = False