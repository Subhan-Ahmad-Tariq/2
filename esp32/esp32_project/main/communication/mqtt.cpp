#include "MqttClient.h"
#include "WifiManager.h" // Include WiFiManager for connectivity checks
#include "BluetoothManager.h" // Include BluetoothManager for fallback
#include "../config.h" // Include configuration constants
#include "PubSubClient.h"
#include "esp_log.h"
#include <Arduino.h>
#include <ArduinoJson.h> // Include ArduinoJson for JSON handling


extern BluetoothManager bluetoothManager; // Include BluetoothManager for fallback
extern WiFiManager wifiManager;  // Add this line

MQTTClient::MQTTClient() : 
    client(espClient),
    connected(false),
    lastReconnectAttempt(0) {
    // Generate unique device ID using ESP32's MAC address
    deviceId = "smarttank_" + String((uint32_t)ESP.getEfuseMac(), HEX);
}

void MQTTClient::begin(const char* mqttServer) {
    // Setup MQTT client
    client.setServer(mqttServer, 1883);

    // Use a lambda function to wrap the non-static member function
    client.setCallback([this](char* topic, uint8_t* payload, unsigned int length) {
        this->callback(topic, payload, length); // Call the private callback method
    });

    // Initial connection attempt
    reconnect();
}

void MQTTClient::callback(char* topic, uint8_t* payload, unsigned int length) {
    StaticJsonDocument<200> doc;
    deserializeJson(doc, payload, length);

    // Process commands here
    const char* command = doc["command"];
    if (command) {
        // Handle different commands
        Serial.printf("Received command: %s\n", command);
    }
}

void MQTTClient::attemptReconnect() {
    this->reconnect(); // Call the private reconnect method
}

void MQTTClient::connect() {
    if (!client.connected() && (millis() - lastReconnectAttempt > 5000)) {
        lastReconnectAttempt = millis();
        Serial.print("Attempting MQTT connection...");
        if (client.connect(deviceId.c_str())) {
            Serial.println("connected");
            connected = true;

            // Subscribe to command topic
            String commandTopic = createTopic("command");
            client.subscribe(commandTopic.c_str());

            // Publish online status
            String statusTopic = createTopic("status");
            client.publish(statusTopic.c_str(), "online", true);
        } else {
            Serial.print("failed, rc=");
            Serial.println(client.state());
            connected = false;

            // If WiFi has been down for too long, switch to BLE
            if (!wifiManager.isConnected() && wifiManager.hasTimedOut()) {
                Serial.println("WiFi unavailable, switching to BLE...");
                bluetoothManager.startBLE();
            }
        }
    }
}

String MQTTClient::createTopic(const char* suffix) {
    return "smarttank/" + deviceId + "/" + suffix;
}

String MQTTClient::createSensorJson(const SensorData& data) {
    StaticJsonDocument<300> doc; // Increased size to accommodate all fields
    
    // Add all sensor data fields
    doc["temperature"] = data.temperature;
    doc["tdsValue"] = data.tdsValue;
    doc["waterLevel"] = data.waterLevel;
    doc["powerConsumption"] = data.powerConsumption;
    doc["waterFlow"] = data.waterFlow;
    doc["totalWaterUsed"] = data.totalWaterUsed;
    doc["pumpStatus"] = data.pumpStatus;
    doc["timestamp"] = data.lastUpdate;

    String jsonString;
    serializeJson(doc, jsonString);
    return jsonString;
}

void MQTTClient::publish(const SensorData& data) {
    if (client.connected()) {
        String topic = createTopic("data");
        String payload = createSensorJson(data);
        client.publish(topic.c_str(), payload.c_str());
    }
}

void MQTTClient::publishAlert(const char* message) {
    if (client.connected()) {
        DynamicJsonDocument doc(100); // Use DynamicJsonDocument instead of JsonDocument
        doc["type"] = "alert";
        doc["message"] = message;
        doc["timestamp"] = millis();

        String jsonString;
        serializeJson(doc, jsonString);
        String topic = createTopic("alert");
        client.publish(topic.c_str(), jsonString.c_str());
    }
}

void MQTTClient::loop() {
    if (!client.connected()) {
        reconnect();
    }
    client.loop();
}

bool MQTTClient::isConnected() {
    return connected;
}