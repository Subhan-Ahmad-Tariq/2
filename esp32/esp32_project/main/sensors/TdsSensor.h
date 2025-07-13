#ifndef TDS_SENSOR_H
#define TDS_SENSOR_H

#include "../config.h"
#pragma once
#include <Arduino.h>

class TdsSensor {
private:
    uint8_t pin;
    float lastValidReading;
    uint8_t errorCount;
    
    // TDS calibration parameters
    const float tdsFactor = 0.5;  // Conversion factor
    const float temperatureCoefficient = 0.02;  // 2% per °C
    
public:
    TdsSensor(uint8_t pin);
    void begin();
    float readTDS(float temperature);  // Temperature compensation
    float calculatePurity(float tdsValue);
    bool isReadingValid(float reading);
    float getLastValidReading();
};
#endif // TDS_SENSOR_H  // Add this at end