#include "RoboticArm.h"

RobotArm robot_arm;

void setup() {
  Serial.begin(115200);
  robot_arm.attachAll();
  robot_arm.centerAll();
  Serial.println("Robot arm ready. Send command via Serial.");
}

void loop() {
  robot_arm.updateAll();

  if (Serial.available()) {
    String inputCommand = Serial.readStringUntil('\n');
    inputCommand.trim();

    int spaceIndex = inputCommand.indexOf(' ');
    if (spaceIndex == -1) {
      Serial.println("Invalid command format. Use: <servoX> <angle>");
      return;
    }

    String joint = inputCommand.substring(0, spaceIndex);
    int angle = inputCommand.substring(spaceIndex + 1).toInt();

    if (joint == "servo1") robot_arm.servo1.moveTo(angle);
    else if (joint == "servo2") robot_arm.servo2.moveTo(angle);
    else if (joint == "servo3") robot_arm.servo3.moveTo(angle);
    else if (joint == "servo4") robot_arm.servo4.moveTo(angle);
    else if (joint == "servo5") robot_arm.servo5.moveTo(angle);
    else if (joint == "servo6") robot_arm.servo6.moveTo(angle);
    else if (joint == "debug") robot_arm.debugAll();
    else Serial.println("Unknown command");
  }
}
