#include <cstdint>  // Add this line
#ifndef CONFIG_H
#define CONFIG_H

// ==================== NETWORK CONFIGURATION ====================
#define WIFI_SSID "PTCL-BB"
#define WIFI_PASSWORD "wifipassword"
#define MQTT_SERVER "192.168.10.12"
#define MQTT_PORT 1883
#define MQTT_USER "mqtt_user"
#define MQTT_PASSWORD "mqtt_password"

// ==================== HARDWARE PIN CONFIGURATION ====================
#define TEMP_SENSOR_PIN 4       // DHT22 data pin
#define WATER_LEVEL_TRIG 12     // Ultrasonic sensor trigger pin
#define WATER_LEVEL_ECHO 14     // Ultrasonic sensor echo pin
#define TDS_SENSOR_PIN 36       // Changed from TURBIDITY_PIN to TDS_SENSOR_PIN
#define PUMP_RELAY_PIN 26       // Pump relay control pin
#define POWER_SENSOR_PIN 39     // Power monitoring pin (ACS712)
#define FLOW_SENSOR_PIN 34          // GPIO pin
// ==================== TANK CONFIGURATION ====================
#define TANK_HEIGHT 100         // Tank height in cm
#define TANK_CAPACITY 1000      // Tank capacity in liters
#define TANK_DIAMETER 80        // Tank diameter in cm (for flow calculations)

// ==================== BLE CONFIGURATION ====================
constexpr char DEVICE_NAME[] = "SmartTank";
constexpr char SERVICE_UUID_STR[] = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
constexpr char SENSOR_CHAR_UUID_STR[] = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
constexpr char CONTROL_CHAR_UUID_STR[] = "beb5483f-36e1-4688-b7f5-ea07361b26a8";
constexpr uint16_t BLE_MTU_SIZE = 256;  // Maximum transmission unit size

// ==================== OPERATIONAL PARAMETERS ====================
#define SENSOR_READ_INTERVAL 2000     // Reduced from 5000ms for better responsiveness
#define MIN_WATER_LEVEL 20            // Minimum water level percentage
#define MAX_WATER_LEVEL 90            // Maximum water level percentage
#define MAX_TDS_THRESHOLD 500         // Changed from MIN_WATER_PURITY (now in ppm)
#define MAX_PUMP_RUNTIME 3600000      // Maximum pump runtime in ms (1 hour)
#define CLEANING_CYCLE_DURATION 300000 // Cleaning cycle duration in ms (5 minutes)
#define COST_CALCULATION_INTERVAL 2592000000 // 30 days in ms
// ==================== SENSOR CONSTANTS ====================
// TDS Sensor
#define TDS_MAX_THRESHOLD            1000    // Maximum expected TDS value in ppm
#define TDS_CALIBRATION_SAMPLES      10      // Number of samples for TDS reading
#define TDS_SAMPLE_DELAY_MS          10      // Delay between TDS samples

// Water Flow Sensor
#define FLOW_SENSOR_DEBOUNCE_US      10000   // Minimum time between pulses (10ms)
#define FLOW_UPDATE_INTERVAL_MS      1000    // Flow rate calculation interval
#define FLOW_CALIBRATION_FACTOR      7.5     // Default pulses per liter

// Power Sensor
#define POWER_SAMPLE_COUNT           20      // Number of power samples to average
#define POWER_SAMPLE_DELAY_MS        1       // Delay between power samples

// Water Level Sensor
#define WATER_LEVEL_TIMEOUT_US       23529   // ~4m max distance timeout (23529μs)
#define WATER_LEVEL_PULSE_US         10      // Trigger pulse duration
// ==================== SENSOR THRESHOLDS ====================
#define MAX_TEMP_THRESHOLD 40         // Maximum temperature in °C
#define MIN_TEMP_THRESHOLD 5          // Minimum temperature in °C
#define MAX_POWER_THRESHOLD 2000      // Maximum power consumption in watts
#define SENSOR_ERROR_RETRIES 3        // Number of retries for sensor readings
#define TDS_CALIBRATION_OFFSET 0      // TDS sensor calibration offset
#define POWER_CALIBRATION_FACTOR 0.066 // 66mV/A for ACS712 30A module
// ==================== DEVICE CONFIG STRUCTURE ====================
struct DeviceConfig {
    bool autoMode = true;
    float targetWaterLevel = 70.0;    // Default target level percentage
    float costPerLiter = 0.002f;      // Default water cost
    unsigned long pumpSchedule[7][2] = {
        {25200000, 61200000},  // Sunday (7AM, 5PM)
        {25200000, 61200000},  // Monday
        {25200000, 61200000},  // Tuesday
        {25200000, 61200000},  // Wednesday
        {25200000, 61200000},  // Thursday
        {25200000, 61200000},  // Friday
        {25200000, 61200000}   // Saturday
    };
    bool notificationsEnabled = true;
    unsigned long cleaningSchedule = 604800000; // Weekly cleaning (7 days)
};

// ==================== DATA STRUCTURES ====================
#include "sensors/sensor_data.h"

#endif // CONFIG_H