#ifndef WATER_LEVEL_SENSOR_H
#define WATER_LEVEL_SENSOR_H
#pragma once
#include <Arduino.h>
#include "../config.h"
#include <Preferences.h>

class WaterLevelSensor {
private:
    uint8_t trigPin;
    uint8_t echoPin;
    float lastValidReading;
    uint8_t errorCount;
    float tankHeight;  // Now a member variable instead of #define
    Preferences preferences;
public:
    WaterLevelSensor(uint8_t trig, uint8_t echo);
    void begin();
    void setTankHeight(float height);  // New method
    float readWaterLevel();
    float getLastValidReading();
    bool isReadingValid(float distance);
private:
    float calculatePercentage(float distance);
};


#endif