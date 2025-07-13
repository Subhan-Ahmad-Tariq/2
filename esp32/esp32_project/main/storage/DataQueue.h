#ifndef DATA_QUEUE_H
#define DATA_QUEUE_H

#include <ArduinoJson.h>
#include <SPIFFS.h>
#include "../config.h"

class DataQueue {
private:
    static const char* QUEUE_FILE;
    static const size_t MAX_QUEUE_SIZE = 100;
    
    bool initialized;
    size_t queueSize;
    
    bool writeToFile(const String& data);
    String readFromFile();
    void updateQueueSize();

public:
    DataQueue();
    bool begin();
    bool enqueue(const SensorData& data);
    bool dequeue(SensorData& data);
    void clear();
    size_t size();
    bool isEmpty();
    bool isFull();
};

#endif