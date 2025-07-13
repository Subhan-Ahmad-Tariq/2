import jwt from 'jsonwebtoken';
import Device from '../models/Device';

export class MQTTAuth {
  static async authenticateDevice(clientId: string, username: string, password: Buffer) {
    try {
      // Verify device credentials
      const device = await Device.findOne({ serialNumber: clientId });
      if (!device) {
        console.error(`Device not found: ${clientId}`);
        return false;
      }

      // Verify device token
      const isValid = await this.verifyDeviceToken(password.toString(), device);
      if (!isValid) {
        console.error(`Invalid token for device: ${clientId}`);
        return false;
      }

      return true;
    } catch (error) {
      console.error('MQTT Authentication error:', error);
      return false;
    }
  }

  private static async verifyDeviceToken(token: string, device: any) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      if (typeof decoded === 'string') {
        // Handle the case where decoded is a string
      } else {
        return decoded.deviceId === device._id.toString();
      }
    } catch (error) {
      return false;
    }
  }
}