#include "WiFiManager.h"
#include <WiFi.h>
#include <esp_wifi.h> // if using ESP-IDF specific functions


bool wifi_is_connected() {
    return WiFi.status() == WL_CONNECTED;
}
// Constructor
WiFiManager::WiFiManager() :
    apMode(false),
    apStartTime(0) {}

void WiFiManager::begin() {
    preferences.begin("wifi-config", false);
    
    // Try to connect using saved credentials
    if (!connectToSavedNetwork()) {
        startAP();
    }
}

bool WiFiManager::connectToSavedNetwork() {
    if (loadCredentials()) {
        return connect(ssid.c_str(), password.c_str());
    }
    return false;
}

bool WiFiManager::connect(const char* ssid, const char* password) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    
    unsigned long startAttemptTime = millis();
    
    while (WiFi.status() != WL_CONNECTED && 
           millis() - startAttemptTime < WIFI_TIMEOUT) {
        delay(100);
    }
    
    if (WiFi.status() == WL_CONNECTED) {
        saveCredentials(ssid, password);
        if (apMode) {
            stopAP();
        }
        return true;
    }
    
    return false;
}

bool WiFiManager::hasTimedOut() {
    return millis() - apStartTime > AP_TIMEOUT;
}

void WiFiManager::startAP() {
    WiFi.mode(WIFI_AP);
    String apSSID = String(DEVICE_NAME) + "_" + String((uint32_t)ESP.getEfuseMac(), HEX);
    WiFi.softAP(apSSID.c_str());
    
    dnsServer.start(53, "*", WiFi.softAPIP());
    apMode = true;
    apStartTime = millis();
    
    Serial.println("AP Mode started: " + apSSID);
    Serial.println("IP: " + WiFi.softAPIP().toString());
}

void WiFiManager::stopAP() {
    dnsServer.stop();
    WiFi.softAPdisconnect(true);
    apMode = false;
}

void WiFiManager::saveCredentials(const char* ssid, const char* password) {
    preferences.putString("ssid", ssid);
    preferences.putString("password", password);
}

bool WiFiManager::loadCredentials() {
    ssid = preferences.getString("ssid", "");
    password = preferences.getString("password", "");
    return ssid.length() > 0;
}

void WiFiManager::disconnect() {
    WiFi.disconnect();
}

void WiFiManager::reset() {
    preferences.clear();
    disconnect();
    ESP.restart();
}

void WiFiManager::handleClient() {
    if (apMode) {
        dnsServer.processNextRequest();
        
        // Check AP timeout
        if (millis() - apStartTime > AP_TIMEOUT) {
            ESP.restart(); // Restart device if no configuration received
        }
    }
}

bool WiFiManager::isConnected() const {
    return WiFi.status() == WL_CONNECTED;
}

bool WiFiManager::isAPMode() const {
    return apMode;
}

String WiFiManager::getIP() const {
    return apMode ? WiFi.softAPIP().toString() : WiFi.localIP().toString();
}

int WiFiManager::getRSSI() const {
    return WiFi.RSSI();
}