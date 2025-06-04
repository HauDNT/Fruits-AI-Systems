import time
import numpy as np
from tensorflow.lite.python.interpreter import Interpreter
from ai_edge_litert.interpreter import Interpreter
from PIL import Image

CNN_MODEL_PATH = "/home/dell/Workspace/FruitsFlow/models/default_model.tflite"
INPUT_SIZE = (224, 224)

def load_cnn_model(cnn_model_path = CNN_MODEL_PATH):
    try:        
        interpreter = Interpreter(model_path=cnn_model_path)
        interpreter.allocate_tensors()
        
        print("--> Tải mô hình thành công!", flush=True)
        return interpreter
    except Exception as error:
        print(f"Lỗi khi tải mô hình CNN: {error}", flush=True)
        return None

def preprocess_image_for_cnn(sourceImage, input_size):
    image = Image.fromarray(sourceImage)
    image = image.resize(input_size, Image.Resampling.LANCZOS)
    image_np_arr = np.array(image, dtype=np.float32) / 255.0
    image_np_arr = np.expand_dims(image_np_arr, axis=0)

    return image_np_arr
    
def model_run_inference(interpreter, image, labels):
    try:
        # Tiền xử lý ảnh đầu vào thô
        image_input_data = preprocess_image_for_cnn(image, INPUT_SIZE)
        
        # Lấy thông tin mô tả dữ liệu đầu vào - ra
        input_details = interpreter.get_input_details()
        output_details = interpreter.get_output_details()
        
        # Đặt dữ liệu đầu vào
        interpreter.set_tensor(input_details[0]['index'], image_input_data)
        
        # Chạy suy luận
        interpreter.invoke()
        
        # Lấy kết quả đầu ra
        output_data = interpreter.get_tensor(output_details[0]['index'])
        
        # Lấy nhãn dự đoán và chỉ số
        predicted_class_idx = np.argmax(output_data[0])
        predicted_label = labels[predicted_class_idx]
        predicted_confidence = output_data[0][predicted_class_idx]
        
        print(f"\t + Dự đoán: {predicted_label} | Chỉ số: {predicted_class_idx} | Độ tin cậy: {predicted_confidence}", flush=True)
        
        return predicted_label, predicted_confidence
    except Exception as error:
        print(f"Lỗi khi chạy nhận diện với mô hình CNN: {error}", flush=True)
        return None
    