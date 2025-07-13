#ifndef CALCULATIONS_H
#define CALCULATIONS_H

#include <Arduino.h>
#include "../config.h"
#pragma once
class Calculations {
public:
    // Water volume calculations
    static float calculateVolume(float waterLevel);
    static float calculateFillTime(float currentLevel, float targetLevel, float flowRate);
    static float calculateDailyUsage(float readings[], int count);
    
    // Power calculations
    static float calculatePowerEfficiency(float powerUsage, float waterPumped);
    static float estimateDailyCost(float powerUsage, float costPerKWH);
    
    // Sensor data validation
    static bool isValidTemperature(float temp);
    static bool isValidWaterLevel(float level);
    static bool isValidPurity(float purity);
    static bool isValidPower(float power);
    
    // Alert thresholds
    static bool checkLowWaterAlert(float level);
    static bool checkHighTempAlert(float temp);
    static bool checkLowPurityAlert(float purity);
    static bool checkHighPowerAlert(float power);
};

#endif