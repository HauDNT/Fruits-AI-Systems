#include "Wifi_Config.h"
#include "MQTT_Config.h"
#include "RoboticArm.h"

RobotArm robot_arm;

bool isControlClassifyRobotic = false;
unsigned long timeToMoveAtTheEndConvey = 9000;

// Hàng đợi xử lý tuần tự kết quả phân loại
struct Node {
  String fruitClass;
  unsigned long timestamp;
  Node* next;
};

Node* front = nullptr;
Node* rear = nullptr;
const int MAX_QUEUE_SIZE = 10;
int queueSize = 0;

void enqueueResult(String newResult) {
  if (newResult == "" || queueSize >= MAX_QUEUE_SIZE || ESP.getFreeHeap() < 2000) {
    Serial.println("Không thể thêm kết quả vào hàng đợi: Invalid result, tràn bộ nhớ (" + String(ESP.getFreeHeap()) + " bytes)");
    return;
  }

  Node* newNode = new Node;
  if (newNode == nullptr) {
    Serial.println("Cấp phát vùng nhớ cho node mới thất bại!");
    return;
  }

  newNode->fruitClass = newResult;
  newNode->timestamp = millis();
  newNode->next = nullptr;

  if (rear == nullptr) {
    front = rear = newNode;
  } else {
    rear->next = newNode;
    rear = newNode;
  }
  queueSize++;
  Serial.println("-> Enqueued: " + newResult + ", kích thước hàng đợi: " + String(queueSize) + ", heap còn trống: " + String(ESP.getFreeHeap()));
}

void dequeueResult() {
  if (front == nullptr) {
    return;
  }

  Node* temp = front;
  front = front->next;

  if (front == nullptr) {
    rear = nullptr;
  }

  delete temp;
  queueSize--;
  Serial.println("-> Dequeued, kích thước hàng đợi: " + String(queueSize) + ", heap còn trống: " + String(ESP.getFreeHeap()));
}

String getFrontResultInQueue() {
  if (front != nullptr) {
    return front -> fruitClass;
  }
  return "";
}

unsigned long getFrontTimestamp() {
  if (front != nullptr) {
    return front->timestamp;
  }
  return 0;
}

// --------------------------------------- Chương trình chính --------------------------------------------
void setup() {
  Serial.begin(115200);
  delay(1000);
  Serial.println("Bắt đầu khởi tạo chương trình...");
  Serial.println("Khởi tạo vùng nhớ heap: " + String(ESP.getFreeHeap()));

  connectWiFi();
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("Kết nối Wifi thất bại!");
    return;
  }
  Serial.println("WiFi IP: " + WiFi.localIP().toString());

  robot_arm.attachAll();
  robot_arm.centerAllSmooth();

  client.setServer(mqtt_server, 1883);
  client.setCallback(callback);

  Serial.println("Chương trình đã sẵn sàng!");
}

void loop() {
  static unsigned long lastReconnectAttempt = 0;

  robot_arm.updateAll();

  if (!client.connected()) {
    unsigned long mqtt_connect_current_time = millis();
    if (mqtt_connect_current_time - lastReconnectAttempt > 5000) {
      lastReconnectAttempt = mqtt_connect_current_time;
      connectMQTT();
    }
  } else {
    client.loop();
  }

  if (mqttFruitResult != "") {
    enqueueResult(mqttFruitResult);
    mqttFruitResult = "";
  }

  String frontResult = getFrontResultInQueue();
  if (frontResult != "" && 
      millis() - getFrontTimestamp() >= timeToMoveAtTheEndConvey &&
      !robot_arm.servo1.isServoMoving() &&
      !robot_arm.servo2.isServoMoving() &&
      !robot_arm.servo3.isServoMoving() &&
      !robot_arm.servo4.isServoMoving() &&
      !robot_arm.servo5.isServoMoving() &&
      !robot_arm.servo6.isServoMoving()) {
    Serial.println("Cánh tay bắt đầu phân loại cho: " + frontResult);
    robot_arm.roboticArmMoveToClassifyFruit(frontResult); 
    dequeueResult();
  }
}
