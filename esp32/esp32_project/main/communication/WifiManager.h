#ifndef WIFI_MANAGER_H
#define WIFI_MANAGER_H

#include "BluetoothManager.h"
#include "MqttClient.h"
#include <WiFi.h>
#include <Preferences.h>
#include <DNSServer.h>
#include "../config.h"

class WiFiManager {
private:
    static constexpr int WIFI_TIMEOUT = 30000; // 30 seconds
    static constexpr int AP_TIMEOUT = 60000;   // 60 seconds
    
    String ssid;
    String password;
    bool apMode;
    unsigned long apStartTime;
    Preferences preferences;
    DNSServer dnsServer;

    void startAP();
    void stopAP();
    bool connectToSavedNetwork();
    void saveCredentials(const char* ssid, const char* password);
    bool loadCredentials();

public:
    WiFiManager();
    void begin();
    bool connect(const char* ssid, const char* password);
    void disconnect();
    void reset();
    void handleClient();
    bool isConnected() const;
    bool isAPMode() const;
    bool hasTimedOut();
    String getIP() const;
    int getRSSI() const;
};

extern MQTTClient mqttClient;
extern BluetoothManager bluetoothManager;

#endif