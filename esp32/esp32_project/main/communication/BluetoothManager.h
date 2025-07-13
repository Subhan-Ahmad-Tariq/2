#ifndef BLUETOOTH_MANAGER_H
#define BLUETOOTH_MANAGER_H

#include "../config.h"
#include <string>
#include "nimble/nimble_port.h"
#include "host/ble_hs.h"
#include "services/gap/ble_svc_gap.h"
#include "esp_nimble_hci.h"
#include <ArduinoJson.h>
#include "../sensors/sensor_data.h"
#include "esp_efuse.h"
#include <Preferences.h>

// Callback type for command handling
typedef void (*CommandCallback)(const char* command);

class BluetoothManager {
private:
    // Add this near top of class:
    static constexpr const char* TAG = "BluetoothManager";
    // BLE State
    bool deviceConnected;
    std::string currentData;
    
    // UUID Configuration
    ble_uuid_any_t service_uuid;
    ble_uuid_any_t sensor_char_uuid;
    ble_uuid_any_t control_char_uuid;
    
    // Characteristic Handles
    uint16_t m_sensor_char_handle;
    uint16_t m_control_char_handle;
    
    // Callbacks
    CommandCallback commandCallback;
    Preferences preferences;
    
    // Tank Configuration
    float tankHeight;
    float tankDiameter;
    float tankCapacity;
    
    // BLE Event Handlers
    static int sensor_char_access(uint16_t, uint16_t, ble_gatt_access_ctxt*, void*);
    static int control_char_access(uint16_t, uint16_t, ble_gatt_access_ctxt*, void*);
    static int ble_gap_event_cb(ble_gap_event*, void*);
    
    // Internal Methods
    void sendNotification(const char* message);
    void handleTankDimensions(const char* command);
    void handleCostConfiguration(const char* command);

public:
    BluetoothManager();
    
    // Core BLE Operations
    void begin(CommandCallback callback);
    void startBLE();
    void stopBLE();
    bool isConnected() const { return deviceConnected; }
    
    // Data Handling
    void updateSensorData(const SensorData& data);
    void sendAlert(const char* message);
    void sendWaterCost(float totalLiters, float costPerLiter);
    void notifyConfig();  // Sends current config via BLE
    
    // Getters
    float getTankHeight() const { return tankHeight; }
    float getTankDiameter() const { return tankDiameter; }
    float getTankCapacity() const { return tankCapacity; }
    
    // Command Processing
    void handleCommand(const char* command);
};

extern BluetoothManager bluetoothManager;

#endif