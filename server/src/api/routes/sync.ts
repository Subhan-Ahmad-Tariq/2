// src/api/routes/sync.ts

import express from 'express';
import { syncData } from '../../services/SyncService'; // Ensure this matches the actual service file

const router = express.Router();

// Test Route to Check API
router.get('/', (req, res) => {
  res.json({ message: "✅ Sync API is working!" });
});

// Sync data route
router.post('/', async (req, res) => {
  try {
    const data = req.body;
    if (!data) {
      return res.status(400).json({ message: "❌ No data provided!" });
    }

    const result = await syncData(data); // Call the syncData function
    res.json({ message: "✅ Data synced successfully!", result });
  } catch (error) {
    console.error("❌ Sync Error:", error);
    res.status(500).json({ message: "❌ Server error", error: (error as Error).message });
  }
});

export default router;
