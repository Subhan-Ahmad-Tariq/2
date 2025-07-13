#ifndef TEMPERATURE_SENSOR_H
#define TEMPERATURE_SENSOR_H
#pragma once
#include <DHT.h>
#include "../config.h"

class TemperatureSensor {
private:
    DHT dht;
    uint8_t pin;
    float lastValidReading;
    uint8_t errorCount;

public:
    TemperatureSensor(uint8_t pin);
    void begin();
    float readTemperature();
    bool isReadingValid(float reading);
    float getLastValidReading();
};

#endif