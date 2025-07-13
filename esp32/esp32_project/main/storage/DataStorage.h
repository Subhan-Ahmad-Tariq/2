#ifndef DATA_STORAGE_H
#define DATA_STORAGE_H

#include <EEPROM.h>
#include "../config.h"
#include "../utils/error_handler.h"

class DataStorage {
public:
    enum class StorageError {
        NONE,
        INIT_FAILED,
        WRITE_FAILED,
        READ_FAILED,
        CORRUPT_DATA,
        OUT_OF_SPACE
    };

    DataStorage();
    
    StorageError begin();
    StorageError saveConfig(const DeviceConfig& config);
    StorageError loadConfig(DeviceConfig& config);
    StorageError resetConfig();
    
    const char* getErrorString(StorageError error);
    bool isInitialized() const { return initialized; }

private:
    static const int CONFIG_ADDRESS = 0;
    static const int CONFIG_SIZE = sizeof(DeviceConfig);
    static const uint8_t CONFIG_MAGIC_BYTE = 0xAA;
    
    bool initialized;
    StorageError lastError;
    
    bool verifyConfig(const DeviceConfig& config);
    StorageError writeToEEPROM(int address, const uint8_t* data, size_t size);
    StorageError readFromEEPROM(int address, uint8_t* data, size_t size);
};

#endif