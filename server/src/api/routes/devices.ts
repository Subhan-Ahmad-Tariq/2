import express, { Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { DeviceService } from "../../services/DeviceService";

const router = express.Router();
const deviceService = new DeviceService();

// ✅ Reusable error response helper
const errorResponse = (res: Response, status: number, message: string): void => {
  res.status(status).json({ success: false, message });
};

// **GET all devices**
router.get(
  "/",
  asyncHandler(async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const devices = await deviceService.getAllDevices();
      void res.json({ success: true, devices }); // ✅ Fix: Use 'void'
    } catch (error) {
      next(error);
    }
  })
);

// **GET device by ID**
router.get(
  "/:deviceId",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deviceId } = req.params;
      const deviceData = await deviceService.getDeviceData(deviceId);
      if (!deviceData) {
        return void errorResponse(res, 404, "Device not found"); // ✅ Fix: Use 'void'
      }
      void res.json({ success: true, deviceData });
    } catch (error) {
      next(error);
    }
  })
);

// **UPDATE device settings**
router.put(
  "/:deviceId/settings",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { deviceId } = req.params;
      const settings = req.body;

      if (!settings || Object.keys(settings).length === 0) {
        return void errorResponse(res, 400, "Invalid settings data"); // ✅ Fix: Use 'void'
      }

      const updatedDevice = await deviceService.updateDeviceSettings(deviceId, settings);
      void res.json({ success: true, updatedDevice });
    } catch (error) {
      next(error);
    }
  })
);

// **POST route to add a new device**
router.post(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, status } = req.body;
      if (!name || !status) {
        return void errorResponse(res, 400, "Name and status are required"); // ✅ Fix: Use 'void'
      }
      const newDevice = await deviceService.addDevice(name, status);
      void res.status(201).json({ success: true, newDevice });
    } catch (error) {
      next(error);
    }
  })
);

export default router;
