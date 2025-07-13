#include <stdio.h>
#include "esp_wifi.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "esp_err.h"
#include "nvs_flash.h"
#include "esp_system.h"
#include <ArduinoJson.h>
#include <WiFi.h>
#include "config.h"
#include "communication/MqttClient.h"
#include "communication/BluetoothManager.h"
#include "communication/WifiManager.h"
#include "sensors/TemperatureSensor.h"
#include "sensors/WaterLevelSensor.h"
#include "sensors/TdsSensor.h"  // Changed from TurbiditySensor
#include "sensors/PowerSensor.h"
#include "sensors/WaterFlowSensor.h"  // Added new sensor
#include "controls/PumpControl.h"
#include "storage/DataQueue.h"
#include "storage/DataStorage.h"
#include "utils/calculations.h"
#include "utils/debug.h"
#include "utils/error_handler.h"
#include "utils/test.h"

static const char* TAG = "SMART_TANK";

// Global objects
TemperatureSensor tempSensor(TEMP_SENSOR_PIN);
WaterLevelSensor waterLevelSensor(WATER_LEVEL_TRIG, WATER_LEVEL_ECHO);
TdsSensor tdsSensor(TDS_SENSOR_PIN);  // Changed from TurbiditySensor
PowerSensor powerSensor(POWER_SENSOR_PIN);
WaterFlowSensor flowSensor(FLOW_SENSOR_PIN);  // Added
PumpControl pumpControl(PUMP_RELAY_PIN);
DataStorage dataStorage;
MQTTClient mqttClient;
BluetoothManager bluetoothManager;  // Added missing declaration

SensorData currentData;
DeviceConfig config;

// Network Task
void networkTask(void* pvParameters) {
    while (1) {
        wifi_ap_record_t ap_info;
        esp_err_t err = esp_wifi_sta_get_ap_info(&ap_info);

        if (err == ESP_OK) {
            if (!mqttClient.isConnected()) {
                ESP_LOGI(TAG, "WiFi connected, starting MQTT...");
                bluetoothManager.stopBLE();
                mqttClient.connect();
            }
        } else {
            ESP_LOGW(TAG, "WiFi disconnected, switching to BLE...");
            bluetoothManager.startBLE();
        }

        mqttClient.loop();
        vTaskDelay(pdMS_TO_TICKS(5000));
    }
}

void updateSensorData() {
    float temp = tempSensor.readTemperature();
    
    currentData = {
        .temperature = temp,
        .tdsValue = tdsSensor.readTDS(temp),  // Changed from waterPurity
        .waterLevel = waterLevelSensor.readWaterLevel(),
        .powerConsumption = powerSensor.readPowerConsumption(),
        .waterFlow = flowSensor.getFlowRate(),  // Added
        .pumpStatus = pumpControl.getStatus(),
        .lastUpdate = esp_log_timestamp()
    };

    // Calculate water cost monthly (example)
    static uint32_t lastCostCalc = 0;
    if (millis() - lastCostCalc > 2592000000) { // ~30 days
        bluetoothManager.sendWaterCost(
            flowSensor.getTotalVolume(),
            config.costPerLiter
        );
        flowSensor.resetTotalVolume();
        lastCostCalc = millis();
    }

    if (mqttClient.isConnected()) {
        mqttClient.publish(currentData);
    } else {
        bluetoothManager.updateSensorData(currentData);
    }
}

void handleCommands(const char* command) {
    StaticJsonDocument<256> doc;
    DeserializationError error = deserializeJson(doc, command);
    
    if (error) {
        ESP_LOGE(TAG, "Invalid command JSON");
        return;
    }

    const char* action = doc["action"];
    if (!action) return;

    if (strcmp(action, "pump") == 0) {
        bool status = doc["status"];
        pumpControl.setPumpState(status);
    } 
    else if (strcmp(action, "config") == 0) {
        config.autoMode = doc["autoMode"];
        config.targetWaterLevel = doc["targetLevel"];
        config.costPerLiter = doc["costPerLiter"];  // Added
        dataStorage.saveConfig(config);
    }

    // Acknowledge command
    if (mqttClient.isConnected()) {
        mqttClient.publishAlert("CMD_ACK: " + String(command));
    }
}

void checkAlerts() {
    if (currentData.waterLevel < MIN_WATER_LEVEL) {
        bluetoothManager.sendAlert("LOW_LEVEL:" + String(currentData.waterLevel));
    }
    if (currentData.temperature > MAX_TEMP_THRESHOLD) {
        bluetoothManager.sendAlert("HIGH_TEMP:" + String(currentData.temperature));
    }
    if (currentData.tdsValue > MAX_TDS_THRESHOLD) {  // Changed from purity check
        bluetoothManager.sendAlert("HIGH_TDS:" + String(currentData.tdsValue));
    }
}

void sensorTask(void* pvParameters) {
    while (1) {
        updateSensorData();
        checkAlerts();
        vTaskDelay(pdMS_TO_TICKS(SENSOR_READ_INTERVAL));
    }
}

void autoModeTask(void* pvParameters) {
    while (1) {
        if (config.autoMode) {
            bool shouldPump = currentData.waterLevel < config.targetWaterLevel;
            
            if (shouldPump != pumpControl.getStatus()) {
                pumpControl.setPumpState(shouldPump);
                ESP_LOGI(TAG, "Auto %s pump", shouldPump ? "starting" : "stopping");
            }
        }
        vTaskDelay(pdMS_TO_TICKS(1000));
    }
}

extern "C" void app_main() {
    ESP_LOGI(TAG, "Initializing Smart Tank...");

    // Initialize NVS
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
        ESP_ERROR_CHECK(nvs_flash_erase());
        ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    // Sensor Initialization
    tempSensor.begin();
    waterLevelSensor.begin();
    tdsSensor.begin();  // Changed from Turbidity
    powerSensor.begin();
    flowSensor.begin();  // Added

    // Control Initialization
    pumpControl.begin();

    // Communication
    bluetoothManager.begin(handleCommands);
    wifiManager.begin();  // Added missing WiFi init
    mqttClient.begin(MQTT_SERVER);

    // Load configuration
// Initialize Data Storage with enhanced error handling
DataStorage dataStorage;
DataStorage::StorageError storageErr = dataStorage.begin();
if (storageErr != DataStorage::StorageError::NONE) {
    ESP_LOGE(TAG, "Storage initialization failed: %s", 
            dataStorage.getErrorString(storageErr));
    // Critical failure - consider blinking LED or entering safe mode
    vTaskDelay(pdMS_TO_TICKS(5000));
    ESP_ERROR_CHECK(ESP_FAIL); // Halt if storage is critical
}

// Load configuration with fallback to defaults
DeviceConfig config;
storageErr = dataStorage.loadConfig(config);
if (storageErr != DataStorage::StorageError::NONE) {
    ESP_LOGW(TAG, "Using default config due to load error: %s", 
            dataStorage.getErrorString(storageErr));
    config = DeviceConfig(); // Initialize with defaults
    
    // Set safe defaults explicitly
    config.autoMode = true;
    config.targetWaterLevel = 70.0f;
    config.costPerLiter = 0.002f;
    config.notificationsEnabled = true;
    
    // Attempt to save defaults
    if (dataStorage.saveConfig(config) != DataStorage::StorageError::NONE) {
        ESP_LOGW(TAG, "Failed to save default config");
    }
}

// Verify critical configuration values
if (config.costPerLiter <= 0) {
    ESP_LOGW(TAG, "Invalid cost per liter (%.4f), using default", config.costPerLiter);
    config.costPerLiter = 0.002f;
}

    // Create tasks
    xTaskCreate(sensorTask, "SensorTask", 8192, NULL, 2, NULL);
    xTaskCreate(networkTask, "NetworkTask", 8192, NULL, 3, NULL);
    xTaskCreate(autoModeTask, "AutoModeTask", 4096, NULL, 1, NULL);

    ESP_LOGI(TAG, "System initialized");
}