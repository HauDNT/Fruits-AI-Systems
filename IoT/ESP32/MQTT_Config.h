#ifndef MQTT_CONFIG_H
#define MQTT_CONFIG_H

#include <WiFi.h>
#include <PubSubClient.h>

extern const char* mqtt_server;
extern const int mqtt_port;
extern WiFiClient espClient;
extern PubSubClient client;

void connectMQTT();
void callback(char* topic, byte* payload, unsigned int length);
void mqttLoop();

#endif
