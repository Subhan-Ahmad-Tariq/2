import express from 'express';
import { auth } from '../middleware/auth';
import Data from '../../models/Data';
import Device from '../../models/Device';
import { validate, schemas } from '../middleware/validation';
import logger from '../../utils/logger';

const router = express.Router();

// Get data for a specific device
router.get('/device/:deviceId', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { startDate, endDate, limit = 100 } = req.query;

    // Verify user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify device belongs to user
    const device = await Device.findOne({
      _id: deviceId,
      userId: req.user.id, // Correctly placed
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Build query
    const query: any = { deviceId };
    if (startDate && endDate) {
      query.timestamp = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const data = await Data.find(query)
      .sort({ timestamp: -1 })
      .limit(Number(limit));

    res.json(data);
  } catch (error) {
    logger.error('Error fetching device data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// Get aggregated statistics
router.get('/stats/:deviceId', auth, async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { period = 'day' } = req.query;

    // Verify user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify device belongs to user
    const device = await Device.findOne({
      _id: deviceId,
      userId: req.user.id, // Correctly placed
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Calculate time range based on period
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      default: // day
        startDate.setDate(now.getDate() - 1);
    }

    // Aggregate data
    const stats = await Data.aggregate([
      {
        $match: {
          deviceId,
          timestamp: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: null,
          avgTemperature: { $avg: '$readings.temperature' },
          avgWaterLevel: { $avg: '$readings.waterLevel' },
          avgWaterPurity: { $avg: '$readings.waterPurity' },
          avgPowerConsumption: { $avg: '$readings.powerConsumption' },
          maxTemperature: { $max: '$readings.temperature' },
          minTemperature: { $min: '$readings.temperature' },
          maxWaterLevel: { $max: '$readings.waterLevel' },
          minWaterLevel: { $min: '$readings.waterLevel' }
        }
      }
    ]);

    res.json(stats[0] || {});
  } catch (error) {
    logger.error('Error fetching statistics:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
});

// Record new data
router.post('/record/:deviceId', auth, validate(schemas.data.record), async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { readings, events } = req.body;

    // Verify user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify device belongs to user
    const device = await Device.findOne({
      _id: deviceId,
      userId: req.user.id, // Correctly placed
    });

    if (!device) {
      return res.status(404).json({ message: 'Device not found' });
    }

    // Create new data record
    const newData = new Data({
      deviceId,
      readings,
      events
    });

    await newData.save();

    // Update device status
    await Device.findByIdAndUpdate(deviceId, {
      'status.lastReading': new Date(),
      'status.temperature': readings.temperature,
      'status.waterLevel': readings.waterLevel,
      'status.waterPurity': readings.waterPurity,
      'status.powerConsumption': readings.powerConsumption
    });

    res.status(201).json(newData);
  } catch (error) {
    logger.error('Error recording data:', error);
    res.status(500).json({ message: 'Error recording data' });
  }
});

// Delete data
router.delete('/:dataId', auth, async (req, res) => {
  try {
    const { dataId } = req.params;

    const data = await Data.findById(dataId);
    if (!data) {
      return res.status(404).json({ message: 'Data not found' });
    }

    // Verify user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Verify device belongs to user
    const device = await Device.findOne({
      _id: data.deviceId,
      userId: req.user.id, // Correctly placed
    });

    if (!device) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await data.remove();
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    logger.error('Error deleting data:', error);
    res.status(500).json({ message: 'Error deleting data' });
  }
});

export default router;