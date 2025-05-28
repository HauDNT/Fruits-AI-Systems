#include "MQTT_Config.h"
#include "RoboticArm.h"

extern RobotArm robot_arm;
const char* mqtt_server = "192.168.104.65";
const int mqtt_port = 1883;
WiFiClient espClient;
PubSubClient client(espClient);
String mqttFruitResult = "";

void connectMQTT() {
  int retryCount = 0;
  while (!client.connected() && retryCount < 5) {
    Serial.print("Connecting to MQTT...");

    if (client.connect("ESP32-Controller")) {
      Serial.println("Đã kết nối đến Raspberry MQTT Broker!");
      client.subscribe("fruit/result");
      return;
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Thử lại sau 5 giây...");

      delay(5000);
      retryCount++;
    }
  }

  if (retryCount >= 5) {
    Serial.println("MQTT kết nối thất bại! Khởi động lại ESP32...");
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  String message;

  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  int resultIndex = message.indexOf(':');
  if (resultIndex != -1) {
    String fruitResult = message.substring(resultIndex + 1);
    fruitResult.trim();
    Serial.println("Kết quả mới: " + fruitResult);

    mqttFruitResult = fruitResult;
  } else {
    Serial.println("Kết quả không phù hợp, không thể phân loại!");
  }
}

void mqttLoop() {
  if (!client.connected()) {
    connectMQTT();
  }

  client.loop();
}
