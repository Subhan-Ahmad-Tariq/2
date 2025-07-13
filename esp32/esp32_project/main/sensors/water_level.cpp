#include "WaterLevelSensor.h"

WaterLevelSensor::WaterLevelSensor(uint8_t trig, uint8_t echo) :
    trigPin(trig),
    echoPin(echo),
    lastValidReading(0),
    errorCount(0),
    tankHeight(100.0) {}  // Default 100cm

void WaterLevelSensor::begin() {
    pinMode(trigPin, OUTPUT);
    pinMode(echoPin, INPUT);
    
    // Load saved height from persistent storage
    preferences.begin("tank_config", true);  // Read-only mode
    tankHeight = preferences.getFloat("height", 100.0);  // Default 100cm
    preferences.end();
}

// New method to dynamically set height
void WaterLevelSensor::setTankHeight(float height) {
    if (height > 0) {
        tankHeight = height;
        preferences.begin("tank_config", false);
        preferences.putFloat("height", height);
        preferences.end();
    }
}
// Rest remains the same but uses member tankHeight
float WaterLevelSensor::calculatePercentage(float distance) {
    float percentage = 100 * (1 - (distance / tankHeight));  // Now uses member variable
    return constrain(percentage, 0, 100);
}

bool WaterLevelSensor::isReadingValid(float distance) {
    return distance > 0 && distance <= tankHeight;  // Uses member variable
}

// Keep all other methods identical...
float WaterLevelSensor::readWaterLevel() {
    digitalWrite(trigPin, LOW);
    delayMicroseconds(2);
    
    digitalWrite(trigPin, HIGH);
    delayMicroseconds(WATER_LEVEL_PULSE_US);
    digitalWrite(trigPin, LOW);
    
    long duration = pulseIn(echoPin, HIGH, WATER_LEVEL_TIMEOUT_US);
    // Calculate distance in cm
    float distance = duration * 0.034 / 2;
    
    if (isReadingValid(distance)) {
        float percentage = calculatePercentage(distance);
        lastValidReading = percentage;
        errorCount = 0;
        return percentage;
    }
    
    errorCount++;
    if (errorCount >= SENSOR_ERROR_RETRIES) {
        Serial.println("Water level sensor error");
    }
    
    return lastValidReading;
}

float WaterLevelSensor::getLastValidReading() {
    return lastValidReading;
}