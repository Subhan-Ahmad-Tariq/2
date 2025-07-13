set(EXTRA_COMPONENT_DIRS 
    "$ENV{IDF_PATH}/components/bt/host/nimble")
set(CONFIG_ESP32_WIFI_BT_COEXIST y CACHE INTERNAL "")
set(CONFIG_ESP_COEX_SW_COEXIST_ENABLE y CACHE INTERNAL "")
idf_component_register(
    SRCS 
        "main.cpp"
        "communication/bluetooth.cpp"
        "communication/mqtt.cpp"
        "communication/wifi.cpp"
        "controls/pump.cpp"
        "sensors/power.cpp"
        "sensors/temperature.cpp"
        "sensors/TdsSensor.cpp"
        "sensors/water_level.cpp"
        "sensors/WaterFlowSensor.cpp"
        "storage/data.cpp"
        "storage/queue.cpp"
        "utils/calculations.cpp"
        "utils/debug.cpp"
        "utils/error_handler.cpp"
        "utils/test.cpp"
    INCLUDE_DIRS 
        "."
        "communication" 
        "sensors" 
        "controls"
        "storage"
        "utils"
        "C:/2/esp-idf/components/bt/include/esp32/include"  # Use forward slashes
    REQUIRES 
        arduino
        bt
        ESP32Servo
        pubsubclient
        ArduinoJson
        DHT
        cjson
        esp_insights
        esp_rainmaker
        efuse
        esp_event
        esp_wifi
        nvs_flash  # Add this
        driver     # Needed for PWM
)
set(SOURCES 
    "main.cpp" 
    "bluetooth.cpp" 
    "mqtt.cpp"
)
set(ARDUINO_LIBRARIES "EEPROM,Preferences")
set(ARDUINO_LIBRARIES "Preferences")
set(ARDUINO_LIBRARIES "Preferences,EEPROM")
