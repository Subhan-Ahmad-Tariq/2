#include "PumpControl.h"

PumpControl::PumpControl(uint8_t pin) :
    pin(pin),
    isRunning(false),
    startTime(0),
    totalRuntime(0),
    dailyRuntime(0),
    lastRuntimeReset(0) {}

void PumpControl::begin() {
    pinMode(pin, OUTPUT);
    digitalWrite(pin, LOW);
}

bool PumpControl::setPumpState(bool state) {
    if (state && !checkSafetyConditions()) {
        return false;
    }

    if (state != isRunning) {
        if (state) {
            startTime = millis();
        } else {
            updateRuntime();
        }
        
        digitalWrite(pin, state ? HIGH : LOW);
        isRunning = state;
    }
    
    return true;
}

void PumpControl::updateRuntime() {
    if (isRunning && startTime > 0) {
        unsigned long runtime = millis() - startTime;
        totalRuntime += runtime;
        dailyRuntime += runtime;
    }
}

bool PumpControl::checkSafetyConditions() {
    // Check if pump has been running too long
    if (isRunning && (millis() - startTime) > MAX_PUMP_RUNTIME) {
        Serial.println("Maximum pump runtime exceeded");
        return false;
    }
    
    // Reset daily runtime at midnight
    if (millis() - lastRuntimeReset > 86400000) { // 24 hours
        resetDailyRuntime();
    }
    
    return true;
}

bool PumpControl::getStatus() {
    return isRunning;
}

unsigned long PumpControl::getTotalRuntime() {
    updateRuntime();
    return totalRuntime;
}

unsigned long PumpControl::getDailyRuntime() {
    updateRuntime();
    return dailyRuntime;
}

void PumpControl::resetDailyRuntime() {
    dailyRuntime = 0;
    lastRuntimeReset = millis();
}

void PumpControl::emergencyStop() {
    setPumpState(false);
    Serial.println("Emergency pump stop initiated");
}