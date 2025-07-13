// src/utils/logger.ts

import winston from 'winston';
import config from 'config';

// Define the LogConfig interface
interface LogConfig {
    level: string;
    file: string;
}

// Get the logging configuration and assert its type
const logConfig: LogConfig = config.get('logging') as LogConfig;

const logger = winston.createLogger({
    level: logConfig.level,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: logConfig.file,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
        }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

export default logger;