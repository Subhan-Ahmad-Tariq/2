#include "WaterFlowSensor.h"
#include "freertos/FreeRTOS.h"  // Needed for critical sections

// Constructor with proper mutex initialization
WaterFlowSensor::WaterFlowSensor(uint8_t pin, float calibrationFactor) :
    pin(pin),
    calibrationFactor(calibrationFactor),
    mux(portMUX_INITIALIZER_UNLOCKED)  // Initialize the mutex
{
    pulseCount = 0;
    lastPulseTime = 0;
    totalVolume = 0;
}

void IRAM_ATTR WaterFlowSensor::pulseISR(void* arg) {
    WaterFlowSensor* sensor = static_cast<WaterFlowSensor*>(arg);
    uint32_t now = micros();
    
    // Debounce check using constant
    if (now - sensor->lastPulseTime > FLOW_SENSOR_DEBOUNCE_US) { 
        sensor->pulseCount++;
        sensor->lastPulseTime = now;
    }
}

void WaterFlowSensor::update() {
    static uint32_t lastUpdate = 0;
    uint32_t now = millis();
    
    if (now - lastUpdate >= FLOW_UPDATE_INTERVAL_MS) {
        // Critical section for normal code
        portENTER_CRITICAL(&mux);
        uint32_t pulses = pulseCount;
        pulseCount = 0; // Reset after reading
        portEXIT_CRITICAL(&mux);
        
        // Calculate flow rate (L/min)
        float flowRate = (pulses / calibrationFactor) * 60.0f;
        
        // Update total volume (thread-safe atomic operation)
        totalVolume += flowRate / 60.0f; // Add liters for this second
        
        lastUpdate = now;
    }
}

float WaterFlowSensor::getFlowRate() const {
    uint32_t pulses;
    
    // Critical section to safely read pulseCount
    portENTER_CRITICAL(&mux);
    pulses = pulseCount;
    portEXIT_CRITICAL(&mux);
    
    return (pulses / calibrationFactor) * 60.0f; // L/min
}

float WaterFlowSensor::getTotalVolume() const {
    // No critical section needed for totalVolume as it's only written in update()
    return totalVolume + (getFlowRate() / 60.0f); // Add partial second
}