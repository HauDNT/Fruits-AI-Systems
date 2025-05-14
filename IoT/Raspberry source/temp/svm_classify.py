import numpy as np
from picamera2 import Picamera2
from tensorflow.lite.python.interpreter import Interpreter
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D
from tensorflow.keras.models import Model
from PIL import Image
import time

# Đường dẫn đến mô hình .tflite
SVM_MODEL_PATH = "/home/dell/Workspace/fruits_svm/FruitsClassifi_SVM_27032025.tflite"
LABEL_PATH = "/home/dell/Workspace/fruits_svm/labels.txt"

# Kích thước đầu vào của mô hình (cho MobileNetV2)
INPUT_SIZE = (224, 224)

# Khởi tạo camera
picam2 = Picamera2()

# Tạo mô hình MobileNetV2 để trích xuất đặc trưng
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
x = base_model.output
x = GlobalAveragePooling2D()(x)
feature_model = Model(inputs=base_model.input, outputs=x)

# Đọc danh sách nhãn từ file
def load_labels(label_path):
    with open(label_path, "r") as f:
        labels = [line.strip() for line in f.readlines()]
    return labels

def load_model(model_path):
    """Tải mô hình .tflite"""
    interpreter = Interpreter(model_path=model_path)
    interpreter.allocate_tensors()
    return interpreter

def preprocess_image(image, input_size, feature_model):
    """Tiền xử lý ảnh cho mô hình"""
    # Chuyển ảnh về định dạng PIL
    img = Image.fromarray(image)
    
    # Resize về kích thước đầu vào của mô hình
    img = img.resize(input_size, Image.Resampling.LANCZOS)
    
    # Chuyển thành mảng numpy và chuẩn hóa (0-1)
    img_array = np.array(img, dtype=np.float32) / 255.0
    
    # Thêm chiều batch (1, height, width, channels)
    img_array = np.expand_dims(img_array, axis=0)
    
    # Trích xuất đặc trưng bằng MobileNetV2
    features = feature_model.predict(img_array)
    
    # Đảm bảo shape là (1, feature_dim)
    features = np.array(features, dtype=np.float32)
    return features

def run_inference(interpreter, input_data):
    """Chạy suy luận với mô hình"""
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    # In shape đầu vào mong đợi để kiểm tra
    print("Shape đầu vào mong đợi:", input_details[0]['shape'])
    print("Shape của input_data:", input_data.shape)

    # Đặt dữ liệu đầu vào
    interpreter.set_tensor(input_details[0]['index'], input_data)
    
    # Chạy suy luận
    interpreter.invoke()
    
    # Lấy kết quả đầu ra
    output_data = interpreter.get_tensor(output_details[0]['index'])
    return output_data

def main():
    # Tải mô hình và nhãn
    interpreter = load_model(SVM_MODEL_PATH)
    labels = load_labels(LABEL_PATH)
    print("Đã tải mô hình thành công.")

    try:
        # Cấu hình và khởi động camera
        config = picam2.create_still_configuration()
        picam2.configure(config)
        picam2.start()
        print("Camera đã sẵn sàng.")
        time.sleep(3)  # Đợi camera ổn định

        # Chụp ảnh từ camera
        image = picam2.capture_array()  # Lấy mảng numpy từ camera
        print("Đã chụp ảnh.")

        # Tiền xử lý ảnh
        input_data = preprocess_image(image, INPUT_SIZE, feature_model)

        # Chạy suy luận
        output = run_inference(interpreter, input_data)
        print("Kết quả dự đoán:", output)

        #Lấy nhãn dự đoán
        predicted_class_idx = np.argmax(output[0])

        # Lấy tên nhãn từ danh sách
        predicted_label = labels[predicted_class_idx]  
        print(f"Dự đoán: {predicted_label} (chỉ số: {predicted_class_idx})")

    finally:
        # Dừng camera
        picam2.stop()
        print("Đã dừng camera.")

if __name__ == "__main__":
    main()