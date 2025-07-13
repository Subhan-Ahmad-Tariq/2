// src/utils/monitoring.ts

import { collectDefaultMetrics, Gauge, register } from 'prom-client';
import { Express, Request, Response, NextFunction } from 'express';

// Initialize metrics collection with a prefix
collectDefaultMetrics({ prefix: 'smart_tank_' });

// Custom metrics
const deviceConnectionGauge = new Gauge({
  name: 'device_connections_total',
  help: 'Number of connected devices',
});

const waterLevelGauge = new Gauge({
  name: 'water_level_percentage',
  help: 'Current water level in percentage',
  labelNames: ['device_id'],
});

// Middleware to log requests (optional)
export const requestLoggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`${req.method} ${req.path}`);
  next();
};

// Function to set up monitoring endpoints
export const setupMonitoring = (app: Express) => {
  // Metrics endpoint for Prometheus
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    const metrics = await register.metrics();
    res.send(metrics);
  });

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version,
    });
  });
};

// Export the metrics object for external use
export const metrics = {
  deviceConnectionGauge,
  waterLevelGauge,
};