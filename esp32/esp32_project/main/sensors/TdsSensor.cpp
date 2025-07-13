#include "TdsSensor.h"

TdsSensor::TdsSensor(uint8_t pin) :
    pin(pin),
    lastValidReading(0),
    errorCount(0) {}

void TdsSensor::begin() {
    pinMode(pin, INPUT);
}

float TDSSensor::readTDS(float temperature) {
    float sum = 0;
    for(int i = 0; i < TDS_CALIBRATION_SAMPLES; i++) {
        sum += analogRead(pin);
        delay(TDS_SAMPLE_DELAY_MS);
    }
    float averageVoltage = (sum / 10) * (3.3 / 4095.0);

    // Temperature compensation
    float compensation = 1.0 + temperatureCoefficient * (temperature - 25.0);
    float compensatedVoltage = averageVoltage / compensation;

    // Convert voltage to TDS (ppm)
    float tdsValue = (133.42 * pow(compensatedVoltage, 3) - 
                     255.86 * pow(compensatedVoltage, 2) + 
                     857.39 * compensatedVoltage) * tdsFactor;

    if (isReadingValid(tdsValue)) {
        lastValidReading = tdsValue;
        errorCount = 0;
        return tdsValue;
    }
    
    errorCount++;
    if (errorCount >= 5) {  // SENSOR_ERROR_RETRIES
        Serial.println("TDS sensor error");
    }
    return lastValidReading;
}

float TdsSensor::calculatePurity(float tdsValue) {
    /* Water purity percentage based on TDS:
       0-50 ppm: 100-95% (Excellent)
       50-150 ppm: 95-85% (Good)
       150-250 ppm: 85-70% (Fair)
       250-350 ppm: 70-50% (Poor)
       >350 ppm: <50% (Unacceptable)
    */
    if (tdsValue <= 50) return 100 - (tdsValue * 0.1);
    else if (tdsValue <= 150) return 95 - ((tdsValue-50) * 0.1);
    else if (tdsValue <= 250) return 85 - ((tdsValue-150) * 0.15);
    else if (tdsValue <= 350) return 70 - ((tdsValue-250) * 0.2);
    else return 50 - ((tdsValue-350) * 0.1);  // Cap at 0% if needed
}

bool TDSSensor::isReadingValid(float reading) {
    return reading >= 0 && reading <= TDS_MAX_THRESHOLD;
}

float TdsSensor::getLastValidReading() {
    return lastValidReading;
}