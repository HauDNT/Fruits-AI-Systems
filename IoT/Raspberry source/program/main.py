import os
import time
import asyncio
import threading
import logging
import json
import MachineLearningMethod
import RaspberryConfig
from SocketClient import SocketClient
from RecognitionRunner import RecognitionRunner

# Cấu hình logger
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename='app.log'
)
logger = logging.getLogger(__name__)

# Cập nhật cấu hình mới nhất cho Raspberry từ Server
asyncio.run(RaspberryConfig.load_remote_config_from_server_and_update())

# Lấy cấu hình
raspberry_config = RaspberryConfig.load_raspberry_config_in_memory()

# Hàm cập nhật cấu hình động với Socket
def hot_update_config(recogRunner, loop, data=None):
    print(f"[RPI] Đã nhận cấu hình mới qua Socket! Tiến hành cập nhật...\n")
    
    try:
        if data:
            required_fields = ['labels', 'raspAccessToken', 'model_path', 'areaId']
            if not all(field in data for field in required_fields):
                raise ValueError(f"Dữ liệu cấu hình thiếu các trường: {required_fields}")
            config_data = data.copy()

            if isinstance(config_data['labels'], list):
                config_data['labels'] = json.dumps(config_data['labels'])
            
            # Tải mô hình nếu model_path có thay đổi
            if 'model_path' in config_data and config_data['model_path'] != raspberry_config.get('model_path'):
                print("[RPI] Đang tải mô hình mới...")
                
                model_url = f"{raspberry_config['api_endpoint']}{config_data['model_path']}"
                model_filename = config_data['model_path'].split('/')[-1]
                local_model_dir = '/home/dell/Workspace/FruitsFlow/models'
                os.makedirs(local_model_dir, exist_ok=True)
                local_model_path = os.path.join(local_model_dir, model_filename)

                hotDownloadModelSuccess = MachineLearningMethod.hot_download_model(model_url, local_model_path)
                
                if hotDownloadModelSuccess:
                    print("[RPI] Tải mô hình hoàn tất!")
                    
                    config_data['model_path'] = local_model_path
                    model_files = sorted(
                        filter(lambda x: "default.tflite" not in x, os.listdir(local_model_dir)),
                        key=lambda x: os.path.getmtime(os.path.join(local_model_dir, x))
                    )
                    while len(model_files) > 3:
                        file_to_delete = model_files.pop(0)
                        file_path = os.path.join(local_model_dir, file_to_delete)
                        os.remove(file_path)
                else:
                    logger.warning("Tải mô hình thất bại, giữ model_path hiện tại.")
                    config_data['model_path'] = raspberry_config.get('model_path', '')

            RaspberryConfig.save_raspberry_config_to_memory(config_data)
            print("[RPI] Cấu hình mới đã được lưu từ WebSocket.")
            recogRunner.request_restart()
        else:
            future = asyncio.run_coroutine_threadsafe(
                RaspberryConfig.load_remote_config_from_server_and_update(),
                loop
            )
            result = future.result()
            if result and "error" not in result:
                print("Cấu hình mới đã được áp dụng từ API.")
                recogRunner.request_restart()
            else:
                print("Lỗi khi tải cấu hình mới, không khởi động lại.")
    except Exception as e:
        logger.error(f"Lỗi khi xử lý cấu hình mới: {e}")
        print(f"Lỗi khi xử lý cấu hình mới: {e}")

if __name__ == "__main__":
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    runner = RecognitionRunner()
    
    socket_client = SocketClient(
        device_code=raspberry_config["device_code"],
        server_address=raspberry_config["api_endpoint"],
        on_classification_callback=lambda data: hot_update_config(runner, loop, data)
    )

    def start_thread_socket():
        socket_client.connect()
        socket_client.wait_forever()

    socket_thread = threading.Thread(target=start_thread_socket)
    socket_thread.daemon = True
    socket_thread.start()

    try:
        asyncio.run(runner.run())
    except KeyboardInterrupt:
        print("Dừng chương trình do người dùng.", flush=True)
        runner.stop()
        socket_client.disconnect()
        if runner.webcam_1:
            runner.webcam_1.release()
        if runner.webcam_2:
            runner.webcam_2.release()
        if runner.vl53Sensor:
            try:
                runner.vl53Sensor.stop_ranging()
            except Exception as e:
                logger.error(f"Lỗi khi dừng cảm biến VL53L0X: {e}")
        print("Đã dọn dẹp tài nguyên.", flush=True)