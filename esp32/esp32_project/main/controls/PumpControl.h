#ifndef PUMP_CONTROL_H
#define PUMP_CONTROL_H
#pragma once
#include <Arduino.h>
#include "../config.h"

class PumpControl {
private:
    uint8_t pin;
    bool isRunning;
    unsigned long startTime;
    unsigned long totalRuntime;
    unsigned long dailyRuntime;
    unsigned long lastRuntimeReset;

    void updateRuntime();
    bool checkSafetyConditions();

public:
    PumpControl(uint8_t pin);
    void begin();
    bool setPumpState(bool state);
    bool getStatus();
    unsigned long getTotalRuntime();
    unsigned long getDailyRuntime();
    void resetDailyRuntime();
    void emergencyStop();
};

#endif