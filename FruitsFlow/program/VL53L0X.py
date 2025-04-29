import board
import busio
import adafruit_vl53l0x

def initialize_vl53l0x():
    try:
        vl53I2c = busio.I2C(board.SCL, board.SDA)
        vl53Sensor = adafruit_vl53l0x.VL53L0X(vl53I2c)
        print("--> Cảm biến VL53L0X đã sẵn sàng!", flush=True)
        
        return vl53Sensor
    except Exception as error:
        print(f"Lỗi khi khởi tạo cảm biến VL53L0X: {error}", flush=True)
        return None
    
def vl53l0x_get_distance(vl53Sensor):
    try:
        distance = vl53Sensor.range
        return distance
    except Exception as error:
        print(f"Lỗi khi lấy khoảng cách cảm biến VL53L0X: {error}", flush=True)
        return None