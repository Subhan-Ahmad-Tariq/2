#include "PowerSensor.h"

PowerSensor::PowerSensor(uint8_t pin) :
    pin(pin),
    lastValidReading(0),
    errorCount(0) {}

void PowerSensor::begin() {
    pinMode(pin, INPUT);
}

float PowerSensor::readPowerConsumption() {
    float sum = 0;
    for(int i = 0; i < POWER_SAMPLE_COUNT; i++) {
        sum += analogRead(pin);
        delay(POWER_SAMPLE_DELAY_MS);
    }
    float average = sum / 20;
    
    // Convert analog reading to voltage
    float voltage = average * (3.3 / 4095.0);
    float power = calculatePower(voltage);
    
    if (isReadingValid(power)) {
        lastValidReading = power;
        errorCount = 0;
        
        // ACTUALLY USE the energy tracking (option 2)
        uint32_t now = millis();
        if (lastUpdate != 0) {
            float hours = (now - lastUpdate) / 3600000.0;
            totalEnergy += (power / 1000) * hours; // kWh
        }
        lastUpdate = now;
        
        return power;
    }
    
    errorCount++;
    if (errorCount >= SENSOR_ERROR_RETRIES) {
        Serial.println("Power sensor error");
    }
    
    return lastValidReading;
}

float PowerSensor::calculatePower(float voltage) {
    // Convert voltage to current using sensor's sensitivity
    // ACS712 30A sensor sensitivity is 66mV/A
    float current = (voltage - 2.5) / 0.066;
    
    // Calculate power (P = V * I)
    // Assuming 220V AC supply
    float power = abs(220.0 * current);
    
    return power;
}

bool PowerSensor::isReadingValid(float reading) {
    return reading >= 0 && reading <= MAX_POWER_THRESHOLD;
}

float PowerSensor::getLastValidReading() {
    return lastValidReading;
}