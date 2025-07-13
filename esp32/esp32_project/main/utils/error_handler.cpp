#include "error_handler.h"
#include <EEPROM.h>

ErrorHandler::ErrorHandler() : errorCount(0) {}

void ErrorHandler::logError(ErrorCode code, ErrorSeverity severity, const String& message) {
    ErrorEvent error = {
        .code = code,
        .severity = severity,
        .message = message,
        .timestamp = millis()
    };
    
    // Shift history if needed
    if (errorCount >= MAX_ERROR_HISTORY) {
        shiftErrorHistory();
    }
    
    // Add new error
    errorHistory[errorCount++] = error;
    
    // Log to Serial
    Serial.printf("[%lu] %s: %s\n", 
        error.timestamp,
        severity == ErrorSeverity::CRITICAL ? "CRITICAL" :
        severity == ErrorSeverity::ERROR ? "ERROR" :
        severity == ErrorSeverity::WARNING ? "WARNING" : "INFO",
        message.c_str()
    );
    
    // Handle critical errors
    if (severity == ErrorSeverity::CRITICAL) {
        handleCriticalError(error);
    }
}

void ErrorHandler::shiftErrorHistory() {
    for (int i = 0; i < MAX_ERROR_HISTORY - 1; i++) {
        errorHistory[i] = errorHistory[i + 1];
    }
    errorCount--;
}

void ErrorHandler::handleCriticalError(ErrorEvent& error) {
    // Implement emergency procedures based on error code
    switch (error.code) {
        case ErrorCode::PUMP_ERROR:
            performEmergencyStop();
            break;
            
        case ErrorCode::SENSOR_READ_ERROR:
            // Maybe switch to backup sensors or safe mode
            break;
            
        case ErrorCode::COMMUNICATION_ERROR:
            // Maybe attempt to restart communication
            break;
            
        default:
            // Generic critical error handling
            break;
    }
}

void ErrorHandler::clearErrors() {
    errorCount = 0;
}

ErrorEvent ErrorHandler::getLastError() {
    if (errorCount > 0) {
        return errorHistory[errorCount - 1];
    }
    return {ErrorCode::NONE, ErrorSeverity::INFO, "", 0};
}

ErrorEvent* ErrorHandler::getErrorHistory(int& count) {
    count = errorCount;
    return errorHistory;
}

bool ErrorHandler::hasCriticalError() {
    for (int i = 0; i < errorCount; i++) {
        if (errorHistory[i].severity == ErrorSeverity::CRITICAL) {
            return true;
        }
    }
    return false;
}

void ErrorHandler::performEmergencyStop() {
    // Implement emergency shutdown procedures
    // 1. Stop pump

    // 3. Save state
    // 4. Send emergency notification
    // 5. Wait for manual reset
    
    Serial.println("EMERGENCY STOP INITIATED");
    
    // This would typically call into other subsystems
    // But for now we'll just set a flag in EEPROM
    EEPROM.write(0, 0xFF); // Emergency stop flag
    EEPROM.commit();
}