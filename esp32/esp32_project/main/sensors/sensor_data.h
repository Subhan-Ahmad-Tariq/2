#include <cstdint>  // Add this line
#ifndef SENSOR_DATA_H
#define SENSOR_DATA_H
#pragma once
struct SensorData {
    float temperature;
    float tdsValue;         // in ppm
    float waterLevel;       // percentage
    float powerConsumption; // in watts
    float waterFlow;        // in L/min
    float totalWaterUsed;   // in liters
    bool pumpStatus;
    uint32_t lastUpdate;    // timestamp
    
};
#endif