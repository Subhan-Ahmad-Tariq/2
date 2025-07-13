#include "BluetoothManager.h"
#include "esp_system.h"
#include "esp_efuse.h"
#include "host/ble_uuid.h"
#include <string.h>
#include "esp_err.h"
#include "nimble/nimble_port.h"
#include "nimble/nimble_port_freertos.h"
#include "host/ble_hs.h"
#include "host/util/util.h"
#include "services/gap/ble_svc_gap.h"
#include "services/gatt/ble_svc_gatt.h"
#include "esp_mac.h"
#include "esp_eth.h"

#define MIN(a,b) (((a) < (b)) ? (a) : (b))

// Global instance

// Constructor
BluetoothManager::BluetoothManager() : 
    deviceConnected(false),
    commandCallback(nullptr),
    m_sensor_char_handle(0),
    m_control_char_handle(0) {
    // Initialize UUIDs
    memset(&service_uuid, 0, sizeof(service_uuid));
    memset(&sensor_char_uuid, 0, sizeof(sensor_char_uuid));
    memset(&control_char_uuid, 0, sizeof(control_char_uuid));
}
{
    // Initialize persistent storage
    preferences.begin("tank_config", false); // false = read/write mode
    
    // Load saved tank height if exists
    tankHeight = preferences.getFloat("height", 100.0); // Default 100cm
    
    // Set up BLE callbacks
    ble_gap_event_listener_register(&ble_gap_event_listener, 
                                  ble_gap_event_cb, 
                                  this);
}
void BluetoothManager::begin(CommandCallback callback) {
    commandCallback = callback;

    // Initialize BLE stack
    ESP_ERROR_CHECK(esp_nimble_hci_init());
    nimble_port_init();
    
    // Set device name from MAC address
    uint8_t mac[6];
    ESP_ERROR_CHECK(esp_read_mac(mac, ESP_MAC_WIFI_STA));
    char name[20];
    snprintf(name, sizeof(name), "esp32_%02X%02X", mac[4], mac[5]);
    ble_svc_gap_device_name_set(name);

    // Define UUIDs
    ble_uuid128_t service_uuid128 = BLE_UUID128_INIT(
        0x4f, 0xaf, 0xc2, 0x01, 0x1f, 0xb5, 0x45, 0x9e,
        0x8f, 0xcc, 0xc5, 0xc9, 0xc3, 0x31, 0x91, 0x4b);
    
    ble_uuid128_t sensor_uuid128 = BLE_UUID128_INIT(
        0xbe, 0xb5, 0x48, 0x3e, 0x36, 0xe1, 0x46, 0x88,
        0xb7, 0xf5, 0xea, 0x07, 0x36, 0x1b, 0x26, 0xa8);
    
    ble_uuid128_t control_uuid128 = BLE_UUID128_INIT(
        0xbe, 0xb5, 0x48, 0x3f, 0x36, 0xe1, 0x46, 0x88,
        0xb7, 0xf5, 0xea, 0x07, 0x36, 0x1b, 0x26, 0xa8);

    // Convert to UUID any types
    service_uuid.u.type = BLE_UUID_TYPE_128;
    memcpy(service_uuid.u128.value, service_uuid128.value, 16);
    
    sensor_char_uuid.u.type = BLE_UUID_TYPE_128;
    memcpy(sensor_char_uuid.u128.value, sensor_uuid128.value, 16);
    
    control_char_uuid.u.type = BLE_UUID_TYPE_128;
    memcpy(control_char_uuid.u128.value, control_uuid128.value, 16);

    // Define GATT service structure with all fields initialized in correct order
    static ble_gatt_chr_def characteristic_defs[] = {
        {
            // Initialize in exact order of declaration
            .uuid = &sensor_char_uuid.u,
            .access_cb = BluetoothManager::sensor_char_access,
            .flags = BLE_GATT_CHR_F_READ | BLE_GATT_CHR_F_NOTIFY,
            .val_handle = &m_sensor_char_handle,
            .descriptors = NULL,
            .min_key_size = 0,
            .cpfd = NULL,
            .arg = this
        },
        {
            .uuid = &control_char_uuid.u,
            .access_cb = BluetoothManager::control_char_access,
            .flags = BLE_GATT_CHR_F_WRITE,
            .val_handle = &m_control_char_handle,
            .descriptors = NULL,
            .min_key_size = 0,
            .cpfd = NULL,
            .arg = this
        },
        { 0 } // Terminator
    };

    static ble_gatt_svc_def service_defs[] = {
        {
            .type = BLE_GATT_SVC_TYPE_PRIMARY,
            .uuid = &service_uuid.u,
            .includes = NULL,
            .characteristics = characteristic_defs
        },
        { 0 } // Terminator
    };

    // Register services
    ble_gatts_count_cfg(service_defs);
    ble_gatts_add_svcs(service_defs);

    // Start advertising
    startBLE();
}

int BluetoothManager::sensor_char_access(
    uint16_t conn_handle, 
    uint16_t attr_handle,
    struct ble_gatt_access_ctxt *ctxt, 
    void *arg
) {
    BluetoothManager* mgr = static_cast<BluetoothManager*>(arg);
    
    if (ctxt->op == BLE_ATT_ACCESS_OP_READ) {
        os_mbuf_append(ctxt->om, mgr->currentData.c_str(), mgr->currentData.length());
    }
    return 0;
}

// Add this right after it:
int BluetoothManager::control_char_access(
    uint16_t conn_handle,
    uint16_t attr_handle, 
    struct ble_gatt_access_ctxt *ctxt,
    void *arg
) {
    if (ctxt->op != BLE_ATT_ACCESS_OP_WRITE) {
        return 0; // Only handle write operations
    }

    BluetoothManager* mgr = static_cast<BluetoothManager*>(arg);
    char buf[100];
    int len = MIN(OS_MBUF_PKTLEN(ctxt->om), sizeof(buf)-1);
    ble_hs_mbuf_to_flat(ctxt->om, buf, len, NULL);
    buf[len] = '\0';

    ESP_LOGI(TAG, "Received BLE command: %s", buf);

    // Handle different command types
    if (strncmp(buf, "PUMP=", 5) == 0) {
        // Format: PUMP=ON or PUMP=OFF
        bool pumpState = (strcmp(buf+5, "ON") == 0);
        if (mgr->commandCallback) {
            mgr->commandCallback(buf);
        }
        ESP_LOGI(TAG, "Pump set to %s", pumpState ? "ON" : "OFF");
    }
    else if (strncmp(buf, "SET_TANK_DIMENSIONS:", 19) == 0) {
        // Format: SET_TANK_DIMENSIONS:height:diameter (both in cm)
        char* ptr = buf + 19;
        char* endPtr;
        float height = strtof(ptr, &endPtr);
        float diameter = strtof(endPtr + 1, NULL); // Skip colon

        if (height > 0 && diameter > 0) {
            mgr->config.tankHeight = height;
            mgr->config.tankDiameter = diameter;
            
            // Calculate capacity (πr²h/1000 for liters)
            float radius = diameter / 2.0f;
            mgr->config.tankCapacity = (3.14159f * radius * radius * height) / 1000.0f;
            
            mgr->dataStorage.saveConfig(mgr->config);
            ESP_LOGI(TAG, "Tank dimensions set: %.1fcm H, %.1fcm D", height, diameter);
        } else {
            ESP_LOGE(TAG, "Invalid tank dimensions");
        }
    }
    else if (strncmp(buf, "SET_COST:", 9) == 0) {
        // Format: SET_COST:water:0.002 or SET_COST:electricity:1.5
        char* type = strtok(buf + 9, ":");
        char* value = strtok(NULL, ":");
        
        if (type && value) {
            float costValue = atof(value);
            if (strcmp(type, "water") == 0) {
                mgr->config.waterCostPerLiter = costValue;
            } else if (strcmp(type, "electricity") == 0) {
                mgr->config.electricityCostPerUnit = costValue;
            }
            mgr->dataStorage.saveConfig(mgr->config);
            ESP_LOGI(TAG, "Cost config updated: %s = %.3f", type, costValue);
        }
    }
    else if (strcmp(buf, "GET_CONFIG") == 0) {
        // Immediately respond with current config
        char configStr[128];
        snprintf(configStr, sizeof(configStr),
            "CONFIG:HT%.1f:DT%.1f:CP%.1f:WP%.3f:EP%.3f",
            mgr->config.tankHeight,
            mgr->config.tankDiameter,
            mgr->config.tankCapacity,
            mgr->config.waterCostPerLiter,
            mgr->config.electricityCostPerUnit);
        
        mgr->currentData = configStr;
        ble_gattc_notify_custom(conn_handle, mgr->m_sensor_char_handle, 
            ble_hs_mbuf_from_flat(configStr, strlen(configStr)));
    }
    else {
        ESP_LOGW(TAG, "Unknown command: %s", buf);
        return BLE_ATT_ERR_UNLIKELY;
    }

    return 0;
}

void BluetoothManager::startBLE() {
    struct ble_gap_adv_params adv_params = {
        .conn_mode = BLE_GAP_CONN_MODE_UND,
        .disc_mode = BLE_GAP_DISC_MODE_GEN,
        .itvl_min = 0x20,
        .itvl_max = 0x30,
        .channel_map = 0,
        .filter_policy = 0,
        .high_duty_cycle = 0
    };

    ble_gap_adv_start(
        BLE_OWN_ADDR_PUBLIC,
        NULL,
        BLE_HS_FOREVER,
        &adv_params,
        BluetoothManager::ble_gap_event_cb,
        this
    );
}

void BluetoothManager::stopBLE() {
    ble_gap_adv_stop();
    nimble_port_stop();
    esp_nimble_hci_deinit();
}

// Called when data is received via BLE
static void ble_gap_event_cb(struct ble_gap_event *event, void *arg) {
    BluetoothManager* mgr = (BluetoothManager*)arg;
    
    if (event->type == BLE_GAP_EVENT_NOTIFY_RX) {
        // Extract the received command
        char command[128];
        int len = os_mbuf_copydata(event->notify_rx.om, 0, sizeof(command)-1, command);
        command[len] = '\0';
        
        // Route to command handler
        mgr->handleCommand(command);
    }
}

// In BluetoothManager.cpp

void BluetoothManager::updateSensorData(const SensorData& data) {
    if (!isConnected()) return;
    
    StaticJsonDocument<256> doc;
    doc["temp"] = data.temperature;
    doc["tds"] = data.tdsValue;
    doc["power"] = data.powerConsumption;
    doc["level"] = data.waterLevel;
    doc["flow"] = data.waterFlow;
    doc["pump"] = data.pumpStatus ? "ON" : "OFF";
    
    currentData.clear();
    serializeJson(doc, currentData);

    uint16_t svc_handle, chr_handle;
    if (ble_gatts_find_chr(&service_uuid.u, &sensor_char_uuid.u, &svc_handle, &chr_handle) == 0) {
        struct os_mbuf *om = ble_hs_mbuf_from_flat(currentData.c_str(), currentData.length());
        if (om) {
            ble_gattc_notify_custom(BLE_HS_CONN_HANDLE_NONE, chr_handle, om);
            os_mbuf_free_chain(om);  // Free the memory after sending
        }
    }
}

void BluetoothManager::handleCommand(const char* command) {
    if (command == nullptr || command[0] == '\0') {
        DEBUG_E("Received null or empty command");
        return;
    }

    // Tank height configuration
    if (strncmp(command, "SET_TANK_HEIGHT:", 16) == 0) {
        if (strlen(command) > 16) {  // Ensure there's data after the prefix
            handleTankHeightCommand(command);
        } else {
            DEBUG_E("Invalid tank height command format");
        }
    }
    // Cost configuration
    else if (strncmp(command, "SET_COST:", 9) == 0) {
        if (strlen(command) > 9) {
            handleCostCommand(command);
        } else {
            DEBUG_E("Invalid cost command format");
        }
    }
    else {
        DEBUG_E("Unknown command: " + String(command));
    }
}

// Your existing implementation (now properly connected)
void BluetoothManager::handleTankHeightCommand(const char* command) {
    float height = atof(command + 16); // Skip "SET_TANK_HEIGHT:"
    
    if (height >= 30.0) {  // Minimum safe height
        preferences.begin("tank_config", false);
        preferences.putFloat("height", height);
        preferences.end();
        
        // Confirm back to app
        char response[32];
        snprintf(response, sizeof(response), "HEIGHT_ACK:%.1f", height);
        sendBLEResponse(response);
    } else {
        sendBLEResponse("ERROR:MIN_HEIGHT_30CM");
    }
}

// Add this right after it:
void BluetoothManager::sendWaterCost(float totalLiters, float costPerLiter) {
    if (!isConnected()) return;
    
    StaticJsonDocument<128> doc;
    doc["type"] = "cost";
    doc["liters"] = totalLiters;
    doc["cost"] = totalLiters * costPerLiter;
    
    currentData.clear();
    serializeJson(doc, currentData);
    
    uint16_t svc_handle, chr_handle;
    if (ble_gatts_find_chr(&service_uuid.u, &sensor_char_uuid.u, &svc_handle, &chr_handle) == 0) {
        struct os_mbuf *om = ble_hs_mbuf_from_flat(currentData.c_str(), currentData.length());
        if (om) {
            ble_gattc_notify_custom(BLE_HS_CONN_HANDLE_NONE, chr_handle, om);
            os_mbuf_free_chain(om);  // Free the memory after sending
        }
    }
}

void BluetoothManager::sendAlert(const char* message) {
    if (!isConnected()) return;
    
    currentData = message;
    uint16_t svc_handle, chr_handle;
    if (ble_gatts_find_chr(&service_uuid.u, &sensor_char_uuid.u, &svc_handle, &chr_handle) == 0) {
        struct os_mbuf *om = ble_hs_mbuf_from_flat(currentData.c_str(), currentData.length());
        if (om) {
            ble_gattc_notify_custom(BLE_HS_CONN_HANDLE_NONE, chr_handle, om);
            os_mbuf_free_chain(om);  // Free the memory after sending
        }
    }
}