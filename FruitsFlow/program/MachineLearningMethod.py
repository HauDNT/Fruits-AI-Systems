def process_recognition(webcam, webcam_name, interpreter, labels):
    image = Webcams.capture_webcam_image(webcam, webcam_name)
    if image is not None:
        idx, label, confidence = FruitRecognitionCNNModel.model_run_inference(interpreter, image, labels)
        return image, idx, label, confidence
    return None, None, None, None