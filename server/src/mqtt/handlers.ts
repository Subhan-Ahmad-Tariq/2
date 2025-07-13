// src/mqtt/handlers.ts

import { DeviceService } from '../services/DeviceService';

export class MQTTHandler {
  constructor(private deviceService: DeviceService) {}

  async handleData(deviceId: string, payload: any) {
    try {
      await this.deviceService.recordData(deviceId, payload); // Ensure recordData exists
      console.log(`Data recorded for device ${deviceId}`);
    } catch (error) {
      console.error(`Error handling data for device ${deviceId}:`, error);
    }
  }

  async handleStatus(deviceId: string, payload: any) {
    try {
      await this.deviceService.updateDeviceSettings(deviceId, {
        status: {
          online: payload.online,
          lastReading: new Date()
        }
      });
      console.log(`Status updated for device ${deviceId}`);
    } catch (error) {
      console.error(`Error handling status for device ${deviceId}:`, error);
    }
  }

  async handleCommand(deviceId: string, payload: any) {
    try {
      // Handle device commands (pump control, cleaning cycle, etc.)
      console.log(`Command received for device ${deviceId}:`, payload);
      // Implement command handling logic here
    } catch (error) {
      console.error(`Error handling command for device ${deviceId}:`, error);
    }
  }
}