#include "MQTT_Config.h"

const char* mqtt_server = "192.168.59.65";
const int mqtt_port = 1883;
WiFiClient espClient;
PubSubClient client(espClient);

void connectMQTT() {
  int retryCount = 0;
  while (!client.connected() && retryCount < 5) {
    Serial.print("Connecting to MQTT...");

    if (client.connect("ESP32-Controller")) {
      Serial.println("Connected to Raspberry MQTT Broker!");
      client.subscribe("fruit/result");
      return;
    } else {
      Serial.print("Failed, rc=");
      Serial.print(client.state());
      Serial.println(" Retrying in 5 seconds...");

      delay(5000);
      retryCount++;
    }
  }

  if (retryCount >= 5) {
    Serial.println("MQTT Connection failed! Restarting ESP32...");
    // ESP.restart();  // Tự động reset nếu không kết nối được
  }
}

void callback(char* topic, byte* payload, unsigned int length) {
  Serial.print("Message received: ");
  String message;

  for (int i = 0; i < length; i++) {
    message += (char)payload[i];
  }

  Serial.println(message);

  // if (message.indexOf("Object detected: ") >= 0) {
  //   String colorName = message.substring(17);
  //   Serial.println("-> Color: " + colorName);
  //   // controlServoToClassifyColor(colorName);
  // }
}

void mqttLoop() {
  if (!client.connected()) {
    connectMQTT();
  }

  client.loop();
}
