#include "TemperatureSensor.h"

TemperatureSensor::TemperatureSensor(uint8_t pin) : 
    dht(pin, DHT22),
    pin(pin),
    lastValidReading(0),
    errorCount(0) {}

void TemperatureSensor::begin() {
    dht.begin();
    delay(2000); // Wait for sensor to stabilize
}

float TemperatureSensor::readTemperature() {
    float reading = dht.readTemperature();
    
    if (isReadingValid(reading)) {
        lastValidReading = reading;
        errorCount = 0;
        return reading;
    }
    
    errorCount++;
    if (errorCount >= SENSOR_ERROR_RETRIES) {
        Serial.println("Temperature sensor error");
    }
    
    return lastValidReading;
}

bool TemperatureSensor::isReadingValid(float reading) {
    return !isnan(reading) && 
           reading >= MIN_TEMP_THRESHOLD && 
           reading <= MAX_TEMP_THRESHOLD;
}

float TemperatureSensor::getLastValidReading() {
    return lastValidReading;
}