#include "storage/DataQueue.h"
#include "ArduinoJson.h" // Include ArduinoJson for JSON handling
#include "DataQueue.h"

const char* DataQueue::QUEUE_FILE = "/data_queue.json";

DataQueue::DataQueue() : 
    initialized(false),
    queueSize(0) {}



bool DataQueue::begin() {
    if(!SPIFFS.begin(true)){
        ESP_LOGE(TAG, "SPIFFS Mount Failed");
        return false;
    }
    if (!SPIFFS.begin(true)) {
        Serial.println("Failed to mount SPIFFS");
        return false;
    }
    
    initialized = true;
    updateQueueSize();
    return true;
}

bool DataQueue::enqueue(const SensorData& data) {
    if (!initialized || isFull()) {
        return false;
    }

    // Use DynamicJsonDocument instead of JsonDocument
    DynamicJsonDocument doc(200);

    String currentQueue = readFromFile();
    if (currentQueue.length() > 0) {
        DeserializationError error = deserializeJson(doc, currentQueue);
        if (error) {
            // Log or handle the deserialization error
            return false;
        }
    }

    JsonArray array = doc.is<JsonArray>() ? doc.as<JsonArray>() : doc.to<JsonArray>();

    JsonObject entry = array.createNestedObject();
    entry["temp"] = data.temperature;
    entry["water"] = data.waterLevel;
    entry["purity"] = data.waterPurity;
    entry["power"] = data.powerConsumption;
    entry["pump"] = data.pumpStatus;
    entry["time"] = data.lastUpdate;

    String output;
    serializeJson(doc, output);

    if (writeToFile(output)) {
        queueSize++;
        return true;
    }

    return false;
}

bool DataQueue::dequeue(SensorData& data) {
    if (!initialized || isEmpty()) {
        return false;
    }
    
    StaticJsonDocument<2048> doc;
    String currentQueue = readFromFile();
    
    DeserializationError error = deserializeJson(doc, currentQueue);
    if (error) {
        Serial.println("Failed to parse queue");
        return false;
    }
    
    JsonArray array = doc.as<JsonArray>();
    if (array.size() == 0) {
        return false;
    }
    
    // Get the first entry
    JsonObject entry = array[0];
    data.temperature = entry["temp"];
    data.waterLevel = entry["water"];
    data.waterPurity = entry["purity"];
    data.powerConsumption = entry["power"];
    data.pumpStatus = entry["pump"];
    data.lastUpdate = entry["time"];
    
    // Remove the first entry
    array.remove(0);
    
    String output;
    serializeJson(doc, output);
    
    if (writeToFile(output)) {
        queueSize--;
        return true;
    }
    
    return false;
}

bool DataQueue::writeToFile(const String& data) {
    File file = SPIFFS.open(QUEUE_FILE, "w");
    if (!file) {
        return false;
    }
    
    size_t written = file.print(data);
    file.close();
    
    return written == data.length();
}

String DataQueue::readFromFile() {
    if (!SPIFFS.exists(QUEUE_FILE)) {
        return "[]";
    }
    
    File file = SPIFFS.open(QUEUE_FILE, "r");
    if (!file) {
        return "[]";
    }
    
    String data = file.readString();
    file.close();
    
    return data.length() > 0 ? data : "[]";
}

void DataQueue::updateQueueSize() {
    // Allocate memory for the JSON document
    DynamicJsonDocument doc(2048);

    // Read JSON data from the file
    String jsonData = readFromFile();
    if (jsonData.isEmpty()) {
        Serial.println("Error: JSON data is empty.");
        return;
    }

    // Deserialize the JSON data
    DeserializationError error = deserializeJson(doc, jsonData);
    if (error) {
        Serial.printf("Error: Failed to parse JSON - %s\n", error.c_str());
        return;
    }

    // Ensure the root is a JSON array
    if (!doc.is<JsonArray>()) {
        Serial.println("Error: JSON root is not an array.");
        return;
    }

    // Update the queue size
    queueSize = doc.as<JsonArray>().size();
    Serial.printf("Queue size updated successfully: %d\n", queueSize);
}

void DataQueue::clear() {
    writeToFile("[]");
    queueSize = 0;
}

size_t DataQueue::size() {
    return queueSize;
}

bool DataQueue::isEmpty() {
    return queueSize == 0;
}

bool DataQueue::isFull() {
    return queueSize >= MAX_QUEUE_SIZE;
}