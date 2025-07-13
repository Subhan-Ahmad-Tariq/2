#include "DataStorage.h"
#include "../utils/debug.h"

DataStorage::DataStorage() : initialized(false), lastError(StorageError::NONE) {}

DataStorage::StorageError DataStorage::begin() {
    if (!EEPROM.begin(512)) {
        lastError = StorageError::INIT_FAILED;
        DEBUG_E("EEPROM initialization failed");
        ErrorHandler::logError(ErrorCode::STORAGE_ERROR, 
                             ErrorSeverity::ERROR,
                             "EEPROM init failed");
        return lastError;
    }
    
    initialized = true;
    return StorageError::NONE;
}

DataStorage::StorageError DataStorage::saveConfig(const DeviceConfig& config) {
    if (!initialized) {
        lastError = StorageError::INIT_FAILED;
        return lastError;
    }
    
    if (!verifyConfig(config)) {
        lastError = StorageError::CORRUPT_DATA;
        return lastError;
    }
    
    // Add magic byte for verification
    uint8_t magic = CONFIG_MAGIC_BYTE;
    StorageError err = writeToEEPROM(CONFIG_ADDRESS, &magic, 1);
    if (err != StorageError::NONE) {
        return err;
    }
    
    err = writeToEEPROM(CONFIG_ADDRESS + 1, 
                       reinterpret_cast<const uint8_t*>(&config), 
                       CONFIG_SIZE);
    
    if (err == StorageError::NONE) {
        DEBUG_I("Configuration saved successfully");
    } else {
        ErrorHandler::logError(ErrorCode::STORAGE_ERROR,
                             ErrorSeverity::ERROR,
                             "Failed to save config");
    }
    
    return err;
}

DataStorage::StorageError DataStorage::loadConfig(DeviceConfig& config) {
    if (!initialized) {
        lastError = StorageError::INIT_FAILED;
        return lastError;
    }
    
    // Check magic byte
    uint8_t magic;
    StorageError err = readFromEEPROM(CONFIG_ADDRESS, &magic, 1);
    if (err != StorageError::NONE || magic != CONFIG_MAGIC_BYTE) {
        lastError = (err != StorageError::NONE) ? err : StorageError::CORRUPT_DATA;
        return lastError;
    }
    
    err = readFromEEPROM(CONFIG_ADDRESS + 1,
                        reinterpret_cast<uint8_t*>(&config),
                        CONFIG_SIZE);
    
    if (err != StorageError::NONE || !verifyConfig(config)) {
        lastError = (err != StorageError::NONE) ? err : StorageError::CORRUPT_DATA;
        ErrorHandler::logError(ErrorCode::STORAGE_ERROR,
                             ErrorSeverity::WARNING,
                             "Loaded invalid config, using defaults");
        return lastError;
    }
    
    return StorageError::NONE;
}

bool DataStorage::verifyConfig(const DeviceConfig& config) {
    // Validate all config fields
    if (config.targetWaterLevel < 0 || config.targetWaterLevel > 100) {
        return false;
    }
    
    // Add more validation as needed
    return true;
}

DataStorage::StorageError DataStorage::writeToEEPROM(int address, const uint8_t* data, size_t size) {
    if (address + size > 512) {
        lastError = StorageError::OUT_OF_SPACE;
        return lastError;
    }
    
    for (size_t i = 0; i < size; i++) {
        EEPROM.write(address + i, data[i]);
    }
    
    if (!EEPROM.commit()) {
        lastError = StorageError::WRITE_FAILED;
        DEBUG_E("EEPROM commit failed");
        return lastError;
    }
    
    return StorageError::NONE;
}

DataStorage::StorageError DataStorage::readFromEEPROM(int address, uint8_t* data, size_t size) {
    if (address + size > 512) {
        lastError = StorageError::OUT_OF_SPACE;
        return lastError;
    }
    
    for (size_t i = 0; i < size; i++) {
        data[i] = EEPROM.read(address + i);
    }
    
    return StorageError::NONE;
}

const char* DataStorage::getErrorString(StorageError error) {
    switch(error) {
        case StorageError::NONE: return "No error";
        case StorageError::INIT_FAILED: return "EEPROM initialization failed";
        case StorageError::WRITE_FAILED: return "EEPROM write failed";
        case StorageError::READ_FAILED: return "EEPROM read failed";
        case StorageError::CORRUPT_DATA: return "Data corruption detected";
        case StorageError::OUT_OF_SPACE: return "EEPROM out of space";
        default: return "Unknown error";
    }
}