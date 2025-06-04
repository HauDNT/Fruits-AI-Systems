import time
import paho.mqtt.client as mqtt

MQTT_TOPIC_FRUITS_RESULT = "fruit/result"

class MQTT_Handler:
    def __init__(self, broker="localhost", port=1883, client_id="DV447CH5", keep_alive=60):
        """Khởi tạo MQTT client"""
        self.broker = broker
        self.port = port
        self.client_id = client_id
        self.keep_alive = keep_alive
        self.client = mqtt.Client(client_id=client_id, protocol=mqtt.MQTTv311)
        self.client.on_connect = self.connect_mqtt_callback
        self.client.on_disconnect = self.disconnect_mqtt_callback
        self.is_connected = False
        
    def connect_mqtt(self):
        """Kết nối với broker"""
        try:
            self.client.connect(self.broker, self.port, self.keep_alive)
            self.client.loop_start()
            print(f"[MQTT] Kết nối đến MQTT tại: {self.broker} : {self.port}")
        except Exception as e:
            print(f"[MQTT] Lỗi khi kết nối đên broker: {e}")
            self.is_connected = False
            
    def connect_mqtt_callback(self, client, data, flags, rc):
        """Callback khi kết nối MQTT Broker thành công"""
        if rc == 0:
            print("[MQTT] Đã kết nối đến MQTT broker")
            self.is_connected = True
            
            # Subcribe vào 1 topic thử nghiệm
            self.subscribe(MQTT_TOPIC_FRUITS_RESULT)
        else:
            print(f"[MQTT] Kết nối thất bại với mã lỗi: {rc}")
            self.is_connected = False
    
    def disconnect_mqtt_callback(self, client, data, rc):
        """Callback khi kết nối MQTT Broker thất bại"""
        print("[MQTT] Kết nối đến MQTT Broker thất bại")
        self.is_connected = False
        
        self.reconnect()
                 
    def publish(self, topic = MQTT_TOPIC_FRUITS_RESULT, message = ""):
        """Publish message tới topic"""
        if not self.client.is_connected():
            print("[MQTT] Không kết nối được đến broker, chờ kết nối lại...")
            self.reconnect()
        try:
            result = self.client.publish(topic, message)
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                print(f"[MQTT] Gửi message thành công: {message} -> {topic}")
            else:
                print(f"[MQTT] Gửi message thất bại: {result.rc}")
        except Exception as e:
            print(f"[MQTT] Lỗi khi publish message MQTT: {e}")

    def subscribe(self, topic):
        if self.is_connected:
            self.client.subscribe(topic)
            print(f"[MQTT] Đã subscribe vào {topic}")
        else:
            print(f"[MQTT] Không thể subscribe vào {topic}, chưa kết nối")
        
    def reconnect(self):
        """Kết nối lại với MQTT Broker"""
        max_reconnect_turns = 10
        turn = 1
        while not self.is_connected and turn <= max_reconnect_turns:
            print(f"[MQTT] Kết nối lại lần {turn}/{max_reconnect_turns}")
            
            try: 
                self.client.reconnect()
                time.sleep(1)
                
                if self.is_connected:
                    return
            except Exception as e:
                print(f"[MQTT] Kết nối lại thất bại: {e}")
            
            turn += 1
            time.sleep(5)
        print(f"[MQTT] Kết nối lại thất bại sau {max_reconnect_turns} lần thử.")

    def disconnect(self):
        """Ngắt kết nối MQTT Broker"""
        self.client.loop_stop()
        self.client.disconnect()
        self.is_connected = False
        
        print("[MQTT] Ngắt kết nối với MQTT Broker")
