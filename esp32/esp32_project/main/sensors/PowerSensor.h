#ifndef POWER_SENSOR_H
#define POWER_SENSOR_H
#pragma once
#include <Arduino.h>
#include "../config.h"

class PowerSensor {
private:
    uint8_t pin;
    float lastValidReading;
    uint8_t errorCount;
    
    float calculatePower(float voltage);
    bool isReadingValid(float reading);
    float totalEnergy = 0;  // kWh
    uint32_t lastUpdate = 0;
public:
    PowerSensor(uint8_t pin);
    void begin();
    float readPowerConsumption();
    float getLastValidReading();
    float getEnergyKWh() { return totalEnergy; }
    void resetEnergy() { totalEnergy = 0; lastUpdate = millis(); }
};

#endif