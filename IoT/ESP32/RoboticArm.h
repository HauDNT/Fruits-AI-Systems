#ifndef ROBOTIC_ARM_H
#define ROBOTIC_ARM_H

#include <Arduino.h>
#include <ESP32Servo.h>

class Joint {
private:
  Servo servo;
  int pin;
  int minAngle;
  int maxAngle;
  int currentAngle;
  int defaultAngle;

  bool isMoving = false;
  int targetAngle = 90;
  unsigned long lastMoveTime = 0;
  int moveStep = 1;
  unsigned long moveInterval = 13;  // ms

public:
  Joint(int pin, int minA = 0, int maxA = 180, int defaultA = 90) {
    this->pin = pin;
    this->minAngle = minA;
    this->maxAngle = maxA;
    this->defaultAngle = defaultA;
    this->currentAngle = defaultA;
  }

  void moveTo(int angle) {
    angle = constrain(angle, minAngle, maxAngle);
    if (angle == currentAngle) return;

    targetAngle = angle;
    moveStep = (targetAngle > currentAngle) ? 1 : -1;
    isMoving = true;
    lastMoveTime = millis();
  }

  void attach() {
    servo.setPeriodHertz(50);
    servo.attach(pin);
    servo.write(currentAngle);

    Serial.print("-> Servo tại chân ");
    Serial.print(pin);
    Serial.print(" bắt đầu vào góc ");
    Serial.print(currentAngle);
    Serial.println(" độ.");
  }

  void center() {
    moveTo(defaultAngle);
  }

  void debugSweep(int delayTime = 15) {
    for (int angle = minAngle; angle <= maxAngle; angle++) {
      servo.write(angle);
      delay(delayTime);
    }
    for (int angle = maxAngle; angle >= minAngle; angle--) {
      servo.write(angle);
      delay(delayTime);
    }
    currentAngle = (minAngle + maxAngle) / 2;
    servo.write(currentAngle);
  }

  void update() {
    if (!isMoving) return;

    if (millis() - lastMoveTime >= moveInterval) {
      currentAngle += moveStep;
      servo.write(currentAngle);
      lastMoveTime = millis();

      if (currentAngle == targetAngle) {
        isMoving = false;
      }
    }
  }

  int getCurrentAngle() {
    return currentAngle;
  }

  bool isServoMoving() {
    return isMoving;
  }
};

class RobotArm {
  void waitForAllJoints() {
    Joint* joints[] = { &servo1, &servo2, &servo3, &servo4, &servo5, &servo6 };
    const int numJoints = sizeof(joints) / sizeof(joints[0]);
    bool anyMoving;
    do {
      anyMoving = false;
      for (int i = 0; i < numJoints; ++i) {
        joints[i]->update();
        if (joints[i]->isServoMoving()) {
          anyMoving = true;
        }
      }
      delay(5);
    } while (anyMoving);
  }

public:
  Joint servo1;
  Joint servo2;
  Joint servo3;
  Joint servo4;
  Joint servo5;
  Joint servo6;

  RobotArm()
    : servo1(4, 0, 180, 30),
      servo2(16, 0, 180, 90),
      servo3(17, 0, 180, 60),
      servo4(5, 0, 180, 170),
      servo5(18, 0, 180, 80),
      servo6(19, 0, 180, 60) {}

  void attachAll() {
    servo6.attach();
    delay(500);
    servo5.attach();
    delay(500);
    servo4.attach();
    delay(500);
    servo4.attach();
    delay(500);
    servo3.attach();
    delay(500);
    servo2.attach();
    delay(500);
    servo2.attach();
    delay(500);
    servo1.attach();
  }

  void centerAllSmooth() {
    Joint* joints[] = { &servo6, &servo5, &servo4, &servo3, &servo2, &servo1 };
    const int numJoints = sizeof(joints) / sizeof(joints[0]);

    for (int i = 0; i < numJoints; ++i) {
      joints[i]->center();

      while (joints[i]->isServoMoving()) {
        joints[i]->update();
        delay(5);
      }
    }
  }

  void debugAll() {
    servo1.debugSweep();
    servo2.debugSweep();
    servo3.debugSweep();
    servo4.debugSweep();
    servo5.debugSweep();
    servo6.debugSweep();
  }

  void updateAll() {
    servo1.update();
    servo2.update();
    servo3.update();
    servo4.update();
    servo5.update();
    servo6.update();
  }

  // Các hàm di chuyển cánh tay để phân loại
  // 1 - Quay đến vị trí và gắp vật
  void pickUpObject() {
    servo6.moveTo(112); waitForAllJoints(); 
    servo5.moveTo(85); waitForAllJoints();  
    servo3.moveTo(75); waitForAllJoints();  
    servo1.moveTo(100); waitForAllJoints();
    servo3.moveTo(15); waitForAllJoints();
  }

// 2 - Di chuyển vật đến từng ô phân loại tương ứng với kết quả từ MQTT
  void moveToAppleRipe() {
    servo6.moveTo(0); waitForAllJoints();
    servo3.moveTo(60); waitForAllJoints();
    servo1.moveTo(30); waitForAllJoints(); 
    servo2.moveTo(10); waitForAllJoints(); 
    servo2.moveTo(180); waitForAllJoints(); 
  }

  void moveToAppleRot() {
    servo6.moveTo(25); waitForAllJoints(); 
    servo3.moveTo(60); waitForAllJoints();  
    servo1.moveTo(30); waitForAllJoints();  
    servo2.moveTo(10); waitForAllJoints(); 
    servo2.moveTo(180); waitForAllJoints(); 
  }

  void moveToPearRipe() {
    servo6.moveTo(45); waitForAllJoints(); 
    servo5.moveTo(95); waitForAllJoints(); 
    servo3.moveTo(40); waitForAllJoints(); 
    servo1.moveTo(30); waitForAllJoints(); 
    servo2.moveTo(10); waitForAllJoints(); 
    servo2.moveTo(180); waitForAllJoints(); 
  }

  void moveToPearRot() {
    servo6.moveTo(70); waitForAllJoints();  
    servo3.moveTo(60); waitForAllJoints();  
    servo1.moveTo(30); waitForAllJoints();  
    servo2.moveTo(10); waitForAllJoints(); 
    servo2.moveTo(180); waitForAllJoints(); 
  }

  void moveToGrapesRipe() {
    servo6.moveTo(180); waitForAllJoints(); 
    servo4.moveTo(160); waitForAllJoints(); 
    servo3.moveTo(45); waitForAllJoints();  
    servo1.moveTo(30); waitForAllJoints();  
    servo2.moveTo(10); waitForAllJoints(); 
    servo2.moveTo(180); waitForAllJoints(); 
  }

  void moveToGrapesRot() {
    servo6.moveTo(180); waitForAllJoints(); 
    servo3.moveTo(65); waitForAllJoints(); 
    servo1.moveTo(30); waitForAllJoints(); 
    servo2.moveTo(10); waitForAllJoints(); 
    servo2.moveTo(180); waitForAllJoints(); 
  }

  // 3 - Quay về vị trí mặc định
  void returnToDefault() {
    servo2.moveTo(90); waitForAllJoints();
    servo3.moveTo(60); waitForAllJoints();
    servo4.moveTo(170); waitForAllJoints();
    servo5.moveTo(80); waitForAllJoints();
    servo6.moveTo(60); waitForAllJoints();
  }

  // Hàm điều khiển cánh tay dựa trên kết quả
  void roboticArmMoveToClassifyFruit(String fruitClass) {
    pickUpObject();

    if (fruitClass == "Apple Ripe") {
      moveToAppleRipe();
    } else if (fruitClass == "Apple Rot") {
      moveToAppleRot();
    } else if (fruitClass == "Pear Ripe") {
      moveToPearRipe();
    } else if (fruitClass == "Pear Rot") {
      moveToPearRot();
    } else if (fruitClass == "Grapes Ripe") {
      moveToGrapesRipe();
    } else if (fruitClass == "Grapes Rot") {
      moveToGrapesRot();
    }

    returnToDefault();
  }
};

#endif