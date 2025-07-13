import DeviceModel from "../models/Device"; // Make sure this path is correct

export class DeviceService {
  // **Get all devices**
  async getAllDevices() {
    return await DeviceModel.find(); // Fetch all devices from the database
  }


    // Method to get device data by device ID
    async getDeviceData(deviceId: string) {
      return { id: deviceId, name: 'Device 1' };
    }
    
  
    // Method to update device settings
    async updateDeviceSettings(deviceId: string, settings: any) {
      console.log('Updating device settings for:', deviceId, settings);
      return { id: deviceId, ...settings };
    }
  
    // Method to record data for a device
    async recordData(deviceId: string, payload: any) {
      console.log('Recording data for device:', deviceId, payload);
      return { deviceId, payload };
    }
  
    // **Method to add a new device**
    async addDevice(name: string, status: string) {
      console.log('Adding new device:', { name, status });
      return { id: new Date().getTime().toString(), name, status }; // Dummy ID for now
    }
  }
  