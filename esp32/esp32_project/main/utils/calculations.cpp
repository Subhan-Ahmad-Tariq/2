#include "calculations.h"

float Calculations::calculateVolume(float waterLevel) {
    // Convert percentage to actual volume
    return (waterLevel / 100.0) * TANK_CAPACITY;
}

float Calculations::calculateFillTime(float currentLevel, float targetLevel, float flowRate) {
    if (flowRate <= 0 || currentLevel >= targetLevel) {
        return 0;
    }
    
    float volumeNeeded = calculateVolume(targetLevel) - calculateVolume(currentLevel);
    return volumeNeeded / flowRate; // Returns time in seconds
}

float Calculations::calculateDailyUsage(float readings[], int count) {
    if (count < 2) return 0;
    
    float total = 0;
    for (int i = 1; i < count; i++) {
        float difference = readings[i-1] - readings[i];
        if (difference > 0) { // Only count decreases in water level
            total += calculateVolume(difference);
        }
    }
    return total;
}

float Calculations::calculatePowerEfficiency(float powerUsage, float waterPumped) {
    if (waterPumped <= 0) return 0;
    return powerUsage / waterPumped; // Watts per liter
}

float Calculations::estimateDailyCost(float powerUsage, float costPerKWH) {
    return (powerUsage * 24 / 1000) * costPerKWH; // Convert to kWh and multiply by rate
}

bool Calculations::isValidTemperature(float temp) {
    return temp >= MIN_TEMP_THRESHOLD && temp <= MAX_TEMP_THRESHOLD;
}

bool Calculations::isValidWaterLevel(float level) {
    return level >= 0 && level <= 100;
}

bool Calculations::isValidPurity(float purity) {
    return purity >= 0 && purity <= 100;
}

bool Calculations::isValidPower(float power) {
    return power >= 0 && power <= MAX_POWER_THRESHOLD;
}

bool Calculations::checkLowWaterAlert(float level) {
    return level < MIN_WATER_LEVEL;
}

bool Calculations::checkHighTempAlert(float temp) {
    return temp > MAX_TEMP_THRESHOLD;
}

bool Calculations::checkLowPurityAlert(float purity) {
    return purity < MIN_WATER_PURITY;
}

bool Calculations::checkHighPowerAlert(float power) {
    return power > MAX_POWER_THRESHOLD;
}