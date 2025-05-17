#ifndef WIFI_CONFIG_H
#define WIFI_CONFIG_H

#include <WiFi.h>

const char *ssid = "Wifi";
const char *password = "haudnt@2003";

void connectWiFi() {
  WiFi.begin(ssid, password);
  Serial.println("Connecting to wifi...");

  unsigned long startTime = millis();
  const unsigned long timeout = 10000;  // 10 giây

  while (WiFi.status() != WL_CONNECTED && millis() - startTime < timeout) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to " + String(ssid) + " success!");
  } else {
    Serial.println("\nWiFi connection failed after timeout!");
  }
}

#endif