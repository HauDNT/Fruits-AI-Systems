import numpy as np
import cv2
from PIL import Image
import time
import os
import sys

OUTPUT_DIR_SAVE_IMG = "/home/dell/Pictures/Fruit Recognition"
WEBCAM_RESOLUTION_X = 1280
WEBCAM_RESOLUTION_Y = 720

def initialize_webcam(webcam_index, webcam_name):
    print(f"Khởi tạo Webcam {webcam_name}...", flush=True)
    
    for index in [webcam_index, webcam_index + 1, webcam_index + 2, webcam_index + 3]:
        try:
            webcam = cv2.VideoCapture(index, cv2.CAP_V4L2)
            if webcam.isOpened():
                print(f"{webcam_name} mở thành công tại /dev/video{index}", flush=True)
                webcam.set(cv2.CAP_PROP_FOURCC, cv2.VideoWriter_fourcc(*'MJPG'))
                webcam.set(cv2.CAP_PROP_FRAME_WIDTH, WEBCAM_RESOLUTION_X)
                webcam.set(cv2.CAP_PROP_FRAME_HEIGHT, WEBCAM_RESOLUTION_Y)

                actual_width = webcam.get(cv2.CAP_PROP_FRAME_WIDTH)
                actual_height = webcam.get(cv2.CAP_PROP_FRAME_HEIGHT)
                print(f"Độ phân giải {webcam_name}: {int(actual_width)}x{int(actual_height)}", flush=True)

                for _ in range(10):
                    webcam.read()
                return webcam
            webcam.release()
        except Exception as e:
            print(f"Lỗi khi thử /dev/video{index} cho {webcam_name}: {e}", flush=True)
    print(f"Không thể mở {webcam_name}.", flush=True)
    return None

def capture_webcam_image(webcam, webcam_name):
    try:
        for _ in range(10):
            webcam.read()
            
        ret, frame = webcam.read()
        
        if not ret or frame is None or frame.size == 0:
            print(f"Không thể chụp từ {webcam_name}.", flush=True)
            return None
        else:
            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            print(f"Kích thước frame {webcam_name}: {frame.shape}", flush=True)
            return image
    except Exception as e:
        print(f"Lỗi khi chụp {webcam_name}: {e}", flush=True)
        return None
    
def save_image(webcam_image, webcam_name, label):
    if not os.path.exists(OUTPUT_DIR_SAVE_IMG):
        os.makedirs(OUTPUT_DIR_SAVE_IMG, exist_ok=True)
        print(f"Đã tạo thư mục: {OUTPUT_DIR_SAVE_IMG}")
        
    timestamp = time.strftime('%Y%m%d_%H%M%S')
    image_path = os.path.join(OUTPUT_DIR_SAVE_IMG, f"{webcam_name}_{timestamp}_{label}.jpg")
    Image.fromarray(webcam_image).save(image_path)
    
    print(f"Đã lưu ảnh {webcam_name}: {image_path}", flush=True)
    return image_path


def delete_image(image_path):
    try:
        if not os.path.isfile(image_path):
            print(f"File không tồn tại: {image_path}")
            return False
        os.remove(image_path)
        print(f"Đã xóa file: {image_path}")
        return True
    except Exception as error:
        print(f"Lỗi khi xóa file {image_path}: {error}")
        return False