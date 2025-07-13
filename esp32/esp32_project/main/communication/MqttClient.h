#ifndef MQTT_CLIENT_H
#define MQTT_CLIENT_H
#include <WiFiClient.h>
#include <WiFi.h>
#include <PubSubClient.h>
#include <ArduinoJson.h>
#include "../config.h"
#include "../sensors/sensor_data.h" // Include the centralized SensorData definition



class MQTTClient {
    public:
        MQTTClient(); // Constructor
        void begin(const char* mqttServer); // Initialize MQTT client
        void loop(); // Handle MQTT client tasks
        bool isConnected(); // Check if MQTT client is connected
        void publish(const SensorData& data); // Publish sensor data
        void publishAlert(const char* message); // Publish alert messages
        void attemptReconnect(); // Public method to trigger reconnection
    
    private:
        void connect();  // Instead of reconnect()
        void callback(char* topic, uint8_t* payload, unsigned int length); // Callback for MQTT messages
        
        
        WiFiClient espClient; // ESP32 WiFi client
        PubSubClient client; // MQTT client
        String deviceId; // Unique device ID
        bool connected; // Connection status
        unsigned long lastReconnectAttempt; // Timestamp of last reconnection attempt
    
        String createTopic(const char* suffix); // Helper to create MQTT topic
        String createSensorJson(const SensorData& data); // Helper to serialize sensor data
    };
#endif