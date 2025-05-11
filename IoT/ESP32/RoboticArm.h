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

  public:
    Joint(int pin, int minA = 0, int maxA = 0, int defaultA = 90) {
      this -> pin = pin;
      this -> minAngle = minA;
      this -> maxAngle = maxA;
      this -> currentAngle = defaultA;
    }

    void moveTo(int angle) {
      angle = constrain(angle, minAngle, maxAngle);
      currentAngle = angle;
      servo.write(angle);
    }

    void attach() {
      servo.setPeriodHertz(50);     // ???
      servo.attach(pin);
      moveTo(currentAngle);
    }

    void center() {
      moveTo((minAngle + maxAngle) / 2);
    }

    void debugSweep(int delayTime = 15) {
      for (int angle = minAngle; angle <= maxAngle; angle++) {
        moveTo(angle);
        delay(delayTime);
      }

      for (int angle = maxAngle; angle >= minAngle; angle--) {
        moveTo(angle);
        delay(delayTime);
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
      servo1(4, 0, 180, 90),
      servo2(16, 0, 180, 90),
      servo3(17, 0, 180, 90),
      servo4(5, 0, 180, 90),
      servo5(18, 0, 180, 90),
      servo6(19, 0, 180, 90) {}

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
};

#endif