#include "debug.h"
#include <inttypes.h>
#include <WiFi.h>

bool Debug::serialInitialized = false;
unsigned long Debug::startTime = 0;

void Debug::begin() {
    if (!serialInitialized) {
        Serial.begin(115200);
        while (!Serial) delay(10);
        serialInitialized = true;
        startTime = millis();
    }
}

void Debug::ensureSerialBegin() {
    if (!serialInitialized) begin();
}

String Debug::getTimestamp() {
    unsigned long runtime = millis() - startTime;
    unsigned long seconds = runtime / 1000;
    unsigned long minutes = seconds / 60;
    unsigned long hours = minutes / 60;
    
    char timestamp[20];
    sprintf(timestamp, "[%02lu:%02lu:%02lu.%03lu]", 
        hours, minutes % 60, seconds % 60, runtime % 1000);
    return String(timestamp);
}

String Debug::getMemoryStats() {
    char stats[64];
    sprintf(stats, "Heap: %lu/%lu bytes", 
        ESP.getFreeHeap(), ESP.getHeapSize());
    return String(stats);
}

void Debug::error(const String& message) {
    ensureSerialBegin();
    Serial.printf("%s ERROR: %s\n", getTimestamp().c_str(), message.c_str());
}

void Debug::warning(const String& message) {
    ensureSerialBegin();
    Serial.printf("%s WARNING: %s\n", getTimestamp().c_str(), message.c_str());
}

void Debug::info(const String& message) {
    ensureSerialBegin();
    Serial.printf("%s INFO: %s\n", getTimestamp().c_str(), message.c_str());
}

void Debug::verbose(const String& message) {
    ensureSerialBegin();
    Serial.printf("%s VERBOSE: %s\n", getTimestamp().c_str(), message.c_str());
}

void Debug::printSensorData(const SensorData& data) {
    ensureSerialBegin();
    Serial.println("\n=== Sensor Data ===");
    Serial.printf("Temperature: %.2f°C\n", data.temperature);
    Serial.printf("Water Level: %.1f%%\n", data.waterLevel);
    Serial.printf("Water Purity: %.1f%%\n", data.waterPurity);
    Serial.printf("Power Usage: %.1fW\n", data.powerConsumption);
    Serial.printf("Pump Status: %s\n", data.pumpStatus ? "ON" : "OFF");
    Serial.printf("Last Update: %lu ms ago\n", millis() - data.lastUpdate);
    Serial.println("==================\n");
}

void Debug::printDeviceConfig(const DeviceConfig& config) {
    ensureSerialBegin();
    Serial.println("\n=== Device Config ===");
    Serial.printf("Auto Mode: %s\n", config.autoMode ? "ON" : "OFF");
    Serial.printf("Target Level: %.1f%%\n", config.targetWaterLevel);
    Serial.printf("Notifications: %s\n", config.notificationsEnabled ? "ON" : "OFF");
    Serial.println("===================\n");
}

void Debug::printSystemStats() {
    ensureSerialBegin();
    Serial.println("\n=== System Stats ===");
    Serial.printf("Uptime: %s\n", getTimestamp().c_str());
    Serial.printf("Free Heap: %lu bytes\n", ESP.getFreeHeap());
    Serial.printf("Heap Size: %lu bytes\n", ESP.getHeapSize());
    Serial.printf("PSRAM Size: %" PRIu32 " bytes", ESP.getPsramSize());
    Serial.printf("Flash Size: %lu bytes\n", ESP.getFlashChipSize());
    Serial.printf("CPU Freq: %lu MHz\n", ESP.getCpuFreqMHz());
    Serial.println("==================\n");
}

void Debug::printWiFiStats() {
    ensureSerialBegin();
    Serial.println("\n=== WiFi Stats ===");
    Serial.printf("Status: %s\n", WiFi.status() == WL_CONNECTED ? "Connected" : "Disconnected");
    if (WiFi.status() == WL_CONNECTED) {
        Serial.printf("SSID: %s\n", WiFi.SSID().c_str());
        Serial.printf("IP: %s\n", WiFi.localIP().toString().c_str());
        Serial.printf("RSSI: %d dBm\n", WiFi.RSSI());
    }
    Serial.println("=================\n");
}

void Debug::printBLEStats() {
    ensureSerialBegin();
    Serial.println("\n=== BLE Stats ===");
    // Add BLE-specific stats here
    Serial.println("================\n");
}

void Debug::checkHeap() {
    ensureSerialBegin();
    Serial.println(getMemoryStats());
}

void Debug::dumpStack() {
    ensureSerialBegin();
    // ESP32 stack dump
    Serial.println("\n=== Stack Dump ===");
    // Implementation depends on ESP32 SDK version
    Serial.println("=================\n");
}