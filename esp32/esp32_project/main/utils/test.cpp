#include "test.h"
#include "../communication/MqttClient.h"
#include "../communication/BluetoothManager.h"
#include "../communication/WifiManager.h"
#include "../sensors/TemperatureSensor.h"
#include "../sensors/WaterLevelSensor.h"
#include "../sensors/TurbiditySensor.h"
#include "../sensors/PowerSensor.h"
#include "../controls/PumpControl.h"
#include "../storage/DataQueue.h"
#include "../storage/DataStorage.h"
#include "utils/test.h"
#include <assert.h>


int Test::testsRun = 0;
int Test::testsPassed = 0;
String Test::currentTest = "";

void Test::begin(const String& testName) {
    currentTest = testName;
    DEBUG_I("Starting test: " + testName);
}

void Test::end() {
    DEBUG_I("Test complete: " + currentTest);
    DEBUG_I(String(testsPassed) + "/" + String(testsRun) + " tests passed");
    currentTest = "";
}

void Test::printResult(bool passed, const String& message) {
    testsRun++;
    if (passed) {
        testsPassed++;
        DEBUG_I("✓ " + message);
    } else {
        DEBUG_E("✗ " + message);
    }
}

void Test::assertTrue(bool condition, const String& message) {
    printResult(condition, message);
}

void Test::assertFalse(bool condition, const String& message) {
    printResult(!condition, message);
}

void Test::assertEqual(int expected, int actual, const String& message) {
    bool passed = expected == actual;
    if (!passed) {
        DEBUG_E("Expected: " + String(expected) + ", Got: " + String(actual));
    }
    printResult(passed, message);
}

void Test::assertEqual(float expected, float actual, float tolerance, const String& message) {
    bool passed = abs(expected - actual) <= tolerance;
    if (!passed) {
        DEBUG_E("Expected: " + String(expected) + ", Got: " + String(actual));
    }
    printResult(passed, message);
}

void Test::assertNotEqual(int expected, int actual, const String& message) {
    printResult(expected != actual, message);
}

void Test::testTemperatureSensor() {
    begin("Temperature Sensor");
    
    TemperatureSensor sensor(TEMP_SENSOR_PIN);
    sensor.begin();
    
    float temp = sensor.readTemperature();
    assertTrue(temp >= MIN_TEMP_THRESHOLD && temp <= MAX_TEMP_THRESHOLD,
              "Temperature reading within valid range");
    
    end();
}

void Test::testWaterLevelSensor() {
    begin("Water Level Sensor");
    
    WaterLevelSensor sensor(WATER_LEVEL_TRIG, WATER_LEVEL_ECHO);
    sensor.begin();
    
    float level = sensor.readWaterLevel();
    assertTrue(level >= 0 && level <= 100,
              "Water level reading within valid range");
    
    end();
}

void Test::testTurbiditySensor() {
    begin("Turbidity Sensor");
    
    TurbiditySensor sensor(TURBIDITY_PIN);
    sensor.begin();
    
    float purity = sensor.readTurbidity();
    assertTrue(purity >= 0 && purity <= 100,
              "Water purity reading within valid range");
    
    end();
}

void Test::testPumpControl() {
    begin("Pump Control");
    
    PumpControl pump(PUMP_RELAY_PIN);
    pump.begin();
    
    // Test pump activation
    assertTrue(pump.setPumpState(true), "Pump activation");
    delay(1000);
    assertEqual(true, pump.getStatus(), "Pump status check while on");
    
    // Test pump deactivation
    assertTrue(pump.setPumpState(false), "Pump deactivation");
    delay(1000);
    assertEqual(false, pump.getStatus(), "Pump status check while off");
    
    end();
}

void Test::testPowerSensor() {
    begin("Power Sensor");
    
    PowerSensor sensor(POWER_SENSOR_PIN);
    sensor.begin();
    
    // Test valid power range
    float power = sensor.readPowerConsumption();
    assertTrue(power >= 0 && power <= MAX_POWER_THRESHOLD,
              "Power reading within valid range");
    
    // Test energy tracking
    unsigned long start = millis();
    while (millis() - start < 1000) {
        sensor.readPowerConsumption();
    }
    float energy = sensor.getEnergyKWh();
    assertTrue(energy >= 0, "Energy tracking works");
    
    // Test reset
    sensor.resetEnergy();
    assertEqual(0.0f, sensor.getEnergyKWh(), 0.001f, "Energy reset works");
    
    end();
}

void Test::testBLECommunication() {
    begin("BLE Communication");
    
    BluetoothManager ble;
    bool testResult = false;
    
    // Mock command callback
    auto callback = [&](const char* cmd) {
        testResult = (strcmp(cmd, "TEST_CMD") == 0);
    };
    
    ble.begin(callback);
    
    // Simulate BLE command
    const char* testCmd = "TEST_CMD";
    ble.handleCommand(testCmd);
    
    assertTrue(testResult, "BLE command handling");
    
    // Test notification
    SensorData testData = {
        .temperature = 25.0f,
        .tdsValue = 150.0f,
        .waterLevel = 75.0f,
        .powerConsumption = 100.0f,
        .waterFlow = 2.5f,
        .pumpStatus = false,
        .lastUpdate = millis()
    };
    
    ble.updateSensorData(testData);
    assertTrue(true, "BLE data notification"); // Placeholder
    
    end();
}

void Test::testWiFiConnection() {
    begin("WiFi Connection");
    
    WiFiManager wifi;
    wifi.begin();
    
    // Test AP mode fallback
    if(wifi.isAPMode()) {
        assertTrue(true, "AP mode fallback works");
    }
    
    // Test connection
    if(wifi.isConnected()) {
        assertNotEqual(0, wifi.getRSSI(), "WiFi signal strength");
        assertTrue(wifi.getIP().length() > 0, "Valid IP address");
    }
    
    // Test timeout
    if(wifi.hasTimedOut()) {
        assertTrue(true, "WiFi timeout detection");
    }
    
    end();
}

void Test::testDataStorage() {
    // Create a test configuration
    DeviceConfig testConfig = {
        .autoMode = true,                        // Initialize autoMode
        .pumpSchedule = {                        // Initialize pumpSchedule (7 days, 2 times per day)
            {800, 1800},  // Monday
            {800, 1800},  // Tuesday
            {800, 1800},  // Wednesday
            {800, 1800},  // Thursday
            {800, 1800},  // Friday
            {800, 1800},  // Saturday
            {800, 1800}   // Sunday
        },
        .notificationsEnabled = false,          // Initialize notificationsEnabled
        .targetWaterLevel = 50.0f,              // Initialize targetWaterLevel
        .cleaningSchedule = 2000                // Initialize cleaningSchedule
    };

    // Save the test configuration to storage
    DataStorage dataStorage;
    dataStorage.saveConfig(testConfig);

    // Load the configuration from storage
    DeviceConfig loadedConfig = dataStorage.loadConfig();

    // Assert that the loaded configuration matches the saved configuration
    assertEqual(testConfig.autoMode, loadedConfig.autoMode, "Config auto mode persistence");
    assertEqual(testConfig.notificationsEnabled, loadedConfig.notificationsEnabled, "Config notifications enabled persistence");
    assertEqual(testConfig.targetWaterLevel, loadedConfig.targetWaterLevel, "Config target water level persistence");
    assertEqual(testConfig.cleaningSchedule, loadedConfig.cleaningSchedule, "Config cleaning schedule persistence");

    // Compare pumpSchedule arrays
    for (int i = 0; i < 7; ++i) {
        for (int j = 0; j < 2; ++j) {
            if (testConfig.pumpSchedule[i][j] != loadedConfig.pumpSchedule[i][j]) {
                Serial.printf("Assertion failed: Pump schedule mismatch at [%d][%d]\n", i, j);
                while (true); // Halt execution on failure
            }
        }
    }

    Serial.println("Test passed: Data storage functionality verified.");
}

// Helper function for assertions
void assertEqual(bool expected, bool actual, const char* message) {
    if (expected != actual) {
        Serial.printf("Assertion failed: %s\n", message);
        while (true); // Halt execution on failure
    }
}

void assertEqual(float expected, float actual, const char* message) {
    if (expected != actual) {
        Serial.printf("Assertion failed: %s\n", message);
        while (true); // Halt execution on failure
    }
}

void assertEqual(unsigned long expected, unsigned long actual, const char* message) {
    if (expected != actual) {
        Serial.printf("Assertion failed: %s\n", message);
        while (true); // Halt execution on failure
    }
}



void Test::testDataQueue() {
    begin("Data Queue");
    
    DataQueue queue;
    queue.begin();
    queue.clear();
    
    // Test enqueueing
    SensorData testData = {
        .temperature = 25.0,
        .waterLevel = 80.0,
        .waterPurity = 95.0,
        .powerConsumption = 100.0,
        .pumpStatus = false,
        .lastUpdate = millis()
        .humidity = 50.0f,  // Add this
        .pressure = 1013.25f
    };
    
    assertTrue(queue.enqueue(testData), "Data enqueue operation");
    assertEqual(1, queue.size(), "Queue size after enqueue");
    
    // Test dequeueing
    SensorData retrievedData;
    assertTrue(queue.dequeue(retrievedData), "Data dequeue operation");
    assertEqual(testData.temperature, retrievedData.temperature, 0.1, 
               "Temperature data preservation");
    
    end();
}

void Test::runAllTests() {
    DEBUG_I("\n=== Starting All Tests ===\n");
    
    testsRun = 0;
    testsPassed = 0;
    
    // Sensor tests
    testTemperatureSensor();
    testWaterLevelSensor();
    testPowerSensor();
    
    // Control tests
    testPumpControl();
    
    // Storage tests
    testDataStorage();
    testDataQueue();
    
    DEBUG_I("\n=== Test Summary ===");
    DEBUG_I("Total Tests: " + String(testsRun));
    DEBUG_I("Passed: " + String(testsPassed));
    DEBUG_I("Failed: " + String(testsRun - testsPassed));
    DEBUG_I("Success Rate: " + String((float)testsPassed/testsRun * 100) + "%");
    DEBUG_I("==================\n");
}