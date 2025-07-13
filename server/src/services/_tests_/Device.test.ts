import Device, { DeviceInterface } from '../../models/Device'; // Ensure this path is correct
import mongoose from 'mongoose';

describe('Device Model', () => {
  beforeEach(async () => {
    await Device.deleteMany({});
  });

  it('should create a device with valid data', async () => {
    const validDevice = await Device.create({
      userId: new mongoose.Types.ObjectId(),
      name: 'Test Device',
      serialNumber: 'TEST001',
      settings: {
        autoMode: true,
        targetWaterLevel: 80,
        notifications: true,
        cleaningSchedule: undefined, // Optional
        pumpSchedule: [] // Optional
      },
      lastSync: new Date(),
      status: {
        online: false,
        pumpActive: false,
        temperature: undefined,
        waterLevel: undefined,
        waterPurity: undefined,
        powerConsumption: undefined,
        lastReading: undefined
      }
    });

    expect(validDevice.name).toBe('Test Device');
    expect(validDevice.serialNumber).toBe('TEST001');
    expect(validDevice.settings.autoMode).toBe(true);
  });

  it('should require userId', async () => {
    // Define the device without userId as a plain object
    const deviceWithoutUser_Id = {
      name: 'Test Device',
      serialNumber: 'TEST001',
      settings: {
        autoMode: true,
        targetWaterLevel: 80,
        notifications: true,
        cleaningSchedule: undefined,
        pumpSchedule: []
      },
      lastSync: new Date(),
      status: {
        online: false,
        pumpActive: false,
        temperature: undefined,
        waterLevel: undefined,
        waterPurity: undefined,
        powerConsumption: undefined,
        lastReading: undefined
      }
    };

    await expect(Device.create(deviceWithoutUser_Id))
      .rejects
      .toThrow(); // This should throw an error due to the missing userId
  });

  it('should enforce unique serial numbers', async () => {
    const device1 = await Device.create({
      userId: new mongoose.Types.ObjectId(),
      name: 'Device 1',
      serialNumber: 'TEST001',
      settings: {
        autoMode: true,
        targetWaterLevel: 80,
        notifications: true,
        cleaningSchedule: undefined, // Optional
        pumpSchedule: [] // Optional
      },
      lastSync: new Date(),
      status: {
        online: false,
        pumpActive: false,
        temperature: undefined,
        waterLevel: undefined,
        waterPurity: undefined,
        powerConsumption: undefined,
        lastReading: undefined
      }
    });

    await expect(Device.create({
      userId: new mongoose.Types.ObjectId(),
      name: 'Device 2',
      serialNumber: 'TEST001', // Attempting to create a device with the same serial number
      settings: {
        autoMode: true,
        targetWaterLevel: 80,
        notifications: true,
        cleaningSchedule: undefined, // Optional
        pumpSchedule: [] // Optional
      },
      lastSync: new Date(),
      status: {
        online: false,
        pumpActive: false,
        temperature: undefined,
        waterLevel: undefined,
        waterPurity: undefined,
        powerConsumption: undefined,
        lastReading: undefined
      }
    }))
    .rejects
    .toThrow(); // This should throw an error due to the unique constraint
  });
});