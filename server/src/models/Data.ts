import mongoose from 'mongoose';

const DataSchema = new mongoose.Schema({
  deviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  readings: {
    temperature: Number,
    waterLevel: Number,
    waterPurity: Number,
    powerConsumption: Number
  },
  events: [{
    type: {
      type: String,
      enum: ['PUMP_ON', 'PUMP_OFF', 'CLEANING', 'ALERT'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    description: String
  }]
}, { timestamps: true });

// Index for efficient querying
DataSchema.index({ deviceId: 1, timestamp: -1 });

const Data = mongoose.model('Data', DataSchema);
export default Data;