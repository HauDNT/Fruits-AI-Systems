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

    // Biến cho chuyển động mượt không dùng delay
    bool isMoving = false;
    int targetAngle = 90;
    unsigned long lastMoveTime = 0;
    int moveStep = 1;
    unsigned long moveInterval = 5; // ms

  public:
    Joint(int pin, int minA = 0, int maxA = 180, int defaultA = 90) {
      this->pin = pin;
      this->minAngle = minA;
      this->maxAngle = maxA;
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
      servo.setPeriodHertz(50);  // Tần số servo thường là 50Hz
      servo.attach(pin);
      servo.write(currentAngle); // Đặt ban đầu
    }

    void center() {
      moveTo((minAngle + maxAngle) / 2);
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
};

class RobotArm {
  public:
    Joint servo1;
    Joint servo2;
    Joint servo3;
    Joint servo4;
    Joint servo5;
    Joint servo6;

    RobotArm():
      servo1(4, 0, 180, 30),
      servo2(16, 0, 180, 90),
      servo3(17, 0, 180, 60),
      servo4(5, 0, 180, 90),
      servo5(18, 0, 180, 80),
      servo6(19, 0, 180, 80) {}

    void attachAll() {
      servo1.attach();
      servo2.attach();
      servo3.attach();
      servo4.attach();
      servo5.attach();
      servo6.attach();
    }

    void centerAll() {
      servo1.center();
      servo2.center();
      servo3.center();
      servo4.center();
      servo5.center();
      servo6.center();
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
};

#endif