#ifndef ERROR_HANDLER_H
#define ERROR_HANDLER_H
#pragma once
#include <Arduino.h>

enum class ErrorCode {
    NONE = 0,
    SENSOR_READ_ERROR = 1,
    PUMP_ERROR = 2,
    STORAGE_ERROR = 4,
    COMMUNICATION_ERROR = 5,
    CONFIGURATION_ERROR = 6
};

enum class ErrorSeverity {
    INFO,
    WARNING,
    ERROR,
    CRITICAL
};

struct ErrorEvent {
    ErrorCode code;
    ErrorSeverity severity;
    String message;
    unsigned long timestamp;
};

class ErrorHandler {
private:
    static const int MAX_ERROR_HISTORY = 10;
    ErrorEvent errorHistory[MAX_ERROR_HISTORY];
    int errorCount;
    
    void shiftErrorHistory();
    void handleCriticalError(ErrorEvent& error);

public:
    ErrorHandler();
    void logError(ErrorCode code, ErrorSeverity severity, const String& message);
    void clearErrors();
    ErrorEvent getLastError();
    ErrorEvent* getErrorHistory(int& count);
    bool hasCriticalError();
    void performEmergencyStop();
};

#endif