import mongoose, { Document, Schema } from 'mongoose';

// Define the Device interface to match the schema
export interface DeviceInterface extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    serialNumber: string;
    settings: {
        autoMode: boolean;
        targetWaterLevel: number;
        notifications: boolean;
        cleaningSchedule?: Date; // Optional
        pumpSchedule?: {
            day: number;
            time: string;
            duration: number;
        }[];
    };
    lastSync: Date;
    status: {
        online: boolean;
        temperature?: number; // Optional
        waterLevel?: number; // Optional
        waterPurity?: number; // Optional
        powerConsumption?: number; // Optional
        pumpActive: boolean;
        lastReading?: Date; // Optional
    };
}

// Define the schema
const DeviceSchema = new Schema<DeviceInterface>({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User ', // Ensure this references the correct User model
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    serialNumber: { 
        type: String, 
        required: true, 
        unique: true // Ensure serial numbers are unique
    },
    settings: {
        autoMode: { type: Boolean, default: true },
        targetWaterLevel: { type: Number, default: 80 },
        notifications: { type: Boolean, default: true },
        cleaningSchedule: { type: Date },
        pumpSchedule: [{
            day: { type: Number, required: true },
            time: { type: String, required: true },
            duration: { type: Number, required: true }
        }]
    },
    lastSync: { 
        type: Date, 
        default: Date.now 
    },
    status: {
        online: { type: Boolean, default: false },
        temperature: { type: Number },
        waterLevel: { type: Number },
        waterPurity: { type: Number },
        powerConsumption: { type: Number },
        pumpActive: { type: Boolean, default: false },
        lastReading: { type: Date }
    }
}, { timestamps: true });

// Create the model
const Device = mongoose.model<DeviceInterface>('Device', DeviceSchema);
export default Device;