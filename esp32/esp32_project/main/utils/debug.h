#ifndef DEBUG_H
#define DEBUG_H
#pragma once
#include <Arduino.h>
#include "../config.h"

// Debug levels
#define DEBUG_NONE      0
#define DEBUG_ERROR     1
#define DEBUG_WARNING   2
#define DEBUG_INFO      3
#define DEBUG_VERBOSE   4

// Set current debug level
#ifndef DEBUG_LEVEL
#define DEBUG_LEVEL DEBUG_INFO
#endif

class Debug {
private:
    static bool serialInitialized;
    static unsigned long startTime;
    
    static void ensureSerialBegin();
    static String getTimestamp();
    static String getMemoryStats();

public:
    static void begin();
    
    // Debug print functions
    static void error(const String& message);
    static void warning(const String& message);
    static void info(const String& message);
    static void verbose(const String& message);
    
    // Sensor data debug
    static void printSensorData(const SensorData& data);
    static void printDeviceConfig(const DeviceConfig& config);
    
    // System diagnostics
    static void printSystemStats();
    static void printWiFiStats();
    static void printBLEStats();
    
    // Memory management
    static void checkHeap();
    static void dumpStack();
};

// Macro definitions for conditional compilation
#if DEBUG_LEVEL >= DEBUG_ERROR
    #define DEBUG_E(x) Debug::error(x)
#else
    #define DEBUG_E(x)
#endif

#if DEBUG_LEVEL >= DEBUG_WARNING
    #define DEBUG_W(x) Debug::warning(x)
#else
    #define DEBUG_W(x)
#endif

#if DEBUG_LEVEL >= DEBUG_INFO
    #define DEBUG_I(x) Debug::info(x)
#else
    #define DEBUG_I(x)
#endif

#if DEBUG_LEVEL >= DEBUG_VERBOSE
    #define DEBUG_V(x) Debug::verbose(x)
#else
    #define DEBUG_V(x)
#endif

#endif