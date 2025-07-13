#ifndef WATER_FLOW_SENSOR_H
#define WATER_FLOW_SENSOR_H

#include <Arduino.h>
#include <atomic>

class WaterFlowSensor {
public:
    /**
     * @param pin The interrupt-capable GPIO pin
     * @param calibrationFactor Pulses per liter (YF-S201 default: 7.5)
     */
    WaterFlowSensor(uint8_t pin, float calibrationFactor = 7.5f);
    
    void begin();
    void update(); // Call regularly in main loop
    
    // Getters
    float getFlowRate() const;         // Liters per minute
    float getTotalVolume() const;      // Lifetime liters
    uint32_t getPulseCount() const;    // Raw pulse count
    
    void resetTotalVolume();

private:
    const uint8_t pin;
    const float calibrationFactor;
    
    // Atomic for thread-safe ISR access
    std::atomic<uint32_t> pulseCount{0};
    std::atomic<uint32_t> lastPulseTime{0};
    
    // Volume tracking
    std::atomic<float> totalVolume{0};
    mutable portMUX_TYPE mux = portMUX_INITIALIZER_UNLOCKED;
    
    static void IRAM_ATTR pulseISR(void* arg);
};

#endif // WATER_FLOW_SENSOR_H