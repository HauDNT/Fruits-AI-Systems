#ifndef ROBOTIC_ARM_H
#define ROBOTIC_ARM_H

#include <Arduino.h>
#include <ESP32Servo.h>

class Joint
{
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
  unsigned long moveInterval = 20; // ms

public:
  Joint(int pin, int minA = 0, int maxA = 180, int defaultA = 90)
  {
    this->pin = pin;
    this->minAngle = minA;
    this->maxAngle = maxA;
    this->defaultAngle = defaultA;
    this->currentAngle = defaultA;
  }

  void moveTo(int angle)
  {
    angle = constrain(angle, minAngle, maxAngle);
    if (angle == currentAngle)
    {
      return;
    }

    targetAngle = angle;
    moveStep = (targetAngle > currentAngle) ? 1 : -1;
    isMoving = true;
    lastMoveTime = millis();
  }

  void attach()
  {
    servo.setPeriodHertz(50);
    servo.attach(pin);
    servo.write(currentAngle);
  }

  void center()
  {
    moveTo(defaultAngle);
  }

  void update()
  {
    if (!isMoving)
      return;

    if (millis() - lastMoveTime >= moveInterval)
    {
      currentAngle += moveStep;
      servo.write(currentAngle);
      lastMoveTime = millis();

      if (currentAngle == targetAngle)
      {
        isMoving = false;
      }
    }
  }

  int getCurrentAngle()
  {
    return currentAngle;
  }

  bool isServoMoving()
  {
    return isMoving;
  }

  int getPin() { return pin; }
};

class RobotArm
{
private:
  enum State
  {
    IDLE,
    PICKUP,
    MOVE_TO_BIN,
    DELAY,
    RETURN_DEFAULT
  };
  State currentState = IDLE;
  String currentFruitClass = "";
  int currentStep = 0;
  unsigned long delayStartTime = 0;
  const unsigned long delayDuration = 1000;

  void pickUpObject()
  {
    if (currentStep == 0)
    {
      servo4.moveTo(160);
      currentStep++;
    }
    else if (currentStep == 1 && !servo4.isServoMoving())
    {
      servo6.moveTo(100);
      currentStep++;
    }
    else if (currentStep == 2 && !servo6.isServoMoving())
    {
      servo3.moveTo(75);
      currentStep++;
    }
    else if (currentStep == 3 && !servo3.isServoMoving())
    {
      servo1.moveTo(100);
      currentStep++;
    }
    else if (currentStep == 4 && !servo1.isServoMoving())
    {
      servo4.moveTo(180);
      currentStep++;
    }
    else if (currentStep == 5 && !servo4.isServoMoving())
    {
      servo3.moveTo(15);
      currentStep++;
    }
    else if (currentStep == 6 && !servo3.isServoMoving())
    {
      currentStep = 0;
      currentState = MOVE_TO_BIN;
    }
  }

  void moveToAppleRipe()
  {
    if (currentStep == 0)
    {
      servo6.moveTo(0);
      currentStep++;
    }
    else if (currentStep == 1 && !servo6.isServoMoving())
    {
      delayStartTime = millis();
      currentStep++;
      currentState = DELAY;
    }
    else if (currentStep == 2 && currentState == MOVE_TO_BIN)
    {
      servo3.moveTo(80);
      currentStep++;
    }
    else if (currentStep == 3 && !servo3.isServoMoving())
    {
      servo4.moveTo(170);
      currentStep++;
    }
    else if (currentStep == 4 && !servo4.isServoMoving())
    {
      servo1.moveTo(30);
      currentStep++;
    }
    else if (currentStep == 5 && !servo1.isServoMoving())
    {
      servo2.moveTo(45);
      currentStep++;
    }
    else if (currentStep == 6 && !servo2.isServoMoving())
    {
      servo2.moveTo(135);
      currentStep++;
    }
    else if (currentStep == 7 && !servo2.isServoMoving())
    {
      currentStep = 0;
      currentState = RETURN_DEFAULT;
    }
  }

  void moveToAppleRot()
  {
    if (currentStep == 0)
    {
      servo6.moveTo(25);
      currentStep++;
    }
    else if (currentStep == 1 && !servo6.isServoMoving())
    {
      delayStartTime = millis();
      currentStep++;
      currentState = DELAY;
    }
    else if (currentStep == 2 && currentState == MOVE_TO_BIN)
    {
      servo3.moveTo(70);
      currentStep++;
    }
    else if (currentStep == 3 && !servo3.isServoMoving())
    {
      servo1.moveTo(30);
      currentStep++;
    }
    else if (currentStep == 4 && !servo1.isServoMoving())
    {
      servo2.moveTo(45);
      currentStep++;
    }
    else if (currentStep == 5 && !servo2.isServoMoving())
    {
      servo2.moveTo(135);
      currentStep++;
    }
    else if (currentStep == 6 && !servo2.isServoMoving())
    {
      currentStep = 0;
      currentState = RETURN_DEFAULT;
    }
  }

  void moveToPearRipe()
  {
    if (currentStep == 0)
    {
      servo6.moveTo(45);
      currentStep++;
    }
    else if (currentStep == 1 && !servo6.isServoMoving())
    {
      delayStartTime = millis();
      currentStep++;
      currentState = DELAY;
    }
    else if (currentStep == 2 && currentState == MOVE_TO_BIN)
    {
      servo5.moveTo(95);
      currentStep++;
    }
    else if (currentStep == 3 && !servo5.isServoMoving())
    {
      servo4.moveTo(170);
      currentStep++;
    }
    else if (currentStep == 4 && !servo4.isServoMoving())
    {
      servo3.moveTo(50);
      currentStep++;
    }
    else if (currentStep == 5 && !servo3.isServoMoving())
    {
      servo1.moveTo(30);
      currentStep++;
    }
    else if (currentStep == 6 && !servo1.isServoMoving())
    {
      servo2.moveTo(45);
      currentStep++;
    }
    else if (currentStep == 7 && !servo2.isServoMoving())
    {
      servo2.moveTo(135);
      currentStep++;
    }
    else if (currentStep == 8 && !servo2.isServoMoving())
    {
      currentStep = 0;
      currentState = RETURN_DEFAULT;
    }
  }

  void moveToPearRot()
  {
    if (currentStep == 0)
    {
      servo6.moveTo(70);
      currentStep++;
    }
    else if (currentStep == 1 && !servo6.isServoMoving())
    {
      delayStartTime = millis();
      currentStep++;
      currentState = DELAY;
    }
    else if (currentStep == 2 && currentState == MOVE_TO_BIN)
    {
      servo3.moveTo(60);
      currentStep++;
    }
    else if (currentStep == 3 && !servo3.isServoMoving())
    {
      servo1.moveTo(30);
      currentStep++;
    }
    else if (currentStep == 4 && !servo1.isServoMoving())
    {
      servo2.moveTo(45);
      currentStep++;
    }
    else if (currentStep == 5 && !servo2.isServoMoving())
    {
      servo2.moveTo(135);
      currentStep++;
    }
    else if (currentStep == 6 && !servo2.isServoMoving())
    {
      currentStep = 0;
      currentState = RETURN_DEFAULT;
    }
  }

  void moveToGrapesRipe()
  {
    if (currentStep == 0)
    {
      servo6.moveTo(180);
      currentStep++;
    }
    else if (currentStep == 1 && !servo6.isServoMoving())
    {
      delayStartTime = millis();
      currentStep++;
      currentState = DELAY;
    }
    else if (currentStep == 2 && currentState == MOVE_TO_BIN)
    {
      servo4.moveTo(140);
      currentStep++;
    }
    else if (currentStep == 3 && !servo4.isServoMoving())
    {
      servo3.moveTo(45);
      currentStep++;
    }
    else if (currentStep == 4 && !servo3.isServoMoving())
    {
      servo1.moveTo(30);
      currentStep++;
    }
    else if (currentStep == 5 && !servo1.isServoMoving())
    {
      servo2.moveTo(45);
      currentStep++;
    }
    else if (currentStep == 6 && !servo2.isServoMoving())
    {
      servo2.moveTo(135);
      currentStep++;
    }
    else if (currentStep == 7 && !servo2.isServoMoving())
    {
      currentStep = 0;
      currentState = RETURN_DEFAULT;
    }
  }

  void moveToGrapesRot()
  {
    if (currentStep == 0)
    {
      servo6.moveTo(180);
      currentStep++;
    }
    else if (currentStep == 1 && !servo6.isServoMoving())
    {
      delayStartTime = millis();
      currentStep++;
      currentState = DELAY;
    }
    else if (currentStep == 2 && currentState == MOVE_TO_BIN)
    {
      servo3.moveTo(100);
      currentStep++;
    }
    else if (currentStep == 3 && !servo3.isServoMoving())
    {
      servo1.moveTo(30);
      currentStep++;
    }
    else if (currentStep == 4 && !servo1.isServoMoving())
    {
      servo2.moveTo(45);
      currentStep++;
    }
    else if (currentStep == 5 && !servo2.isServoMoving())
    {
      servo2.moveTo(135);
      currentStep++;
    }
    else if (currentStep == 6 && !servo2.isServoMoving())
    {
      currentStep = 0;
      currentState = RETURN_DEFAULT;
    }
  }

  void handleDelay()
  {
    if (millis() - delayStartTime >= delayDuration)
    {
      currentState = MOVE_TO_BIN;
    }
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
        servo2(16, 0, 180, 85),
        servo3(17, 0, 180, 30),
        servo4(5, 0, 180, 160),
        servo5(18, 0, 180, 80),
        servo6(19, 0, 180, 60) {}

  void attachAll()
  {
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

  void centerAllSmooth()
  {
    Joint *joints[] = {&servo6, &servo5, &servo4, &servo3, &servo2, &servo1};
    const int numJoints = sizeof(joints) / sizeof(joints[0]);

    for (int i = 0; i < numJoints; ++i)
    {
      joints[i]->center();
      while (joints[i]->isServoMoving())
      {
        joints[i]->update();
        delay(5);
      }
    }
  }

  void updateAll()
  {
    servo1.update();
    servo2.update();
    servo3.update();
    servo4.update();
    servo5.update();
    servo6.update();

    // Cập nhật trạng thái điều khiển robot
    if (currentState == PICKUP)
    {
      pickUpObject();
    }
    else if (currentState == MOVE_TO_BIN)
    {
      if (currentFruitClass == "Apple Ripe")
        moveToAppleRipe();
      else if (currentFruitClass == "Apple Rot")
        moveToAppleRot();
      else if (currentFruitClass == "Pear Ripe")
        moveToPearRipe();
      else if (currentFruitClass == "Pear Rot")
        moveToPearRot();
      else if (currentFruitClass == "Grapes Ripe")
        moveToGrapesRipe();
      else if (currentFruitClass == "Grapes Rot")
        moveToGrapesRot();
    }
    else if (currentState == DELAY)
    {
      handleDelay();
    }
    else if (currentState == RETURN_DEFAULT)
    {
      returnToDefault();
    }
  }

  void roboticArmMoveToClassifyFruit(String fruitClass)
  {
    if (currentState != IDLE)
    {
      Serial.println("Robot arm busy, cannot classify: " + fruitClass);
      return;
    }

    currentFruitClass = fruitClass;
    currentState = PICKUP;
    currentStep = 0;
  }

  bool isBusy()
  {
    return currentState != IDLE;
  }

  void returnToDefault()
  {
    if (currentStep == 0)
    {
      servo2.moveTo(85);
      currentStep++;
    }
    else if (currentStep == 1 && !servo2.isServoMoving())
    {
      servo3.moveTo(30);
      currentStep++;
    }
    else if (currentStep == 2 && !servo3.isServoMoving())
    {
      servo4.moveTo(160);
      currentStep++;
    }
    else if (currentStep == 3 && !servo4.isServoMoving())
    {
      servo5.moveTo(80);
      currentStep++;
    }
    else if (currentStep == 4 && !servo5.isServoMoving())
    {
      servo6.moveTo(60);
      currentStep++;
    }
    else if (currentStep == 5 && !servo6.isServoMoving())
    {
      currentStep = 0;
      currentState = IDLE;
    }
  }
};

#endif