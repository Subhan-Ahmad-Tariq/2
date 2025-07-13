#ifndef TEST_H
#define TEST_H

#include <Arduino.h>
#include "../config.h"
#include "debug.h"
#include "../sensors/sensor_data.h"
#pragma once
class Test {
private:
    static int testsRun;
    static int testsPassed;
    static String currentTest;
    
    static void printResult(bool passed, const String& message);

public:
    static void begin(const String& testName);
    static void end();
    
    // Assertion methods
    static void assertTrue(bool condition, const String& message);
    static void assertFalse(bool condition, const String& message);
    static void assertEqual(int expected, int actual, const String& message);
    static void assertEqual(float expected, float actual, float tolerance, const String& message);
    static void assertNotEqual(int expected, int actual, const String& message);
    
    // Sensor tests
    static void testTemperatureSensor();
    static void testWaterLevelSensor();
    static void testPowerSensor();
    
    // Control tests
    static void testPumpControl();
    
    // Storage tests
    static void testDataStorage();
    static void testDataQueue();
    
    // Run all tests
    static void runAllTests();
};

#endif