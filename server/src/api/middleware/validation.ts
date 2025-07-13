import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    
    next();
  };
};

export const schemas = {
  auth: {
    register: Joi.object({
      name: Joi.string().required().min(2).max(50),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(6)
    }),
    login: Joi.object({
      email: Joi.string().required().email(),
      password: Joi.string().required()
    })
  },
  device: {
    create: Joi.object({
      name: Joi.string().required(),
      serialNumber: Joi.string().required(),
      settings: Joi.object({
        autoMode: Joi.boolean(),
        targetWaterLevel: Joi.number().min(0).max(100),
        notifications: Joi.boolean()
      })
    }),
    update: Joi.object({
      name: Joi.string(),
      settings: Joi.object({
        autoMode: Joi.boolean(),
        targetWaterLevel: Joi.number().min(0).max(100),
        notifications: Joi.boolean()
      })
    })
  },
  data: {  // Add this section
    record: Joi.object({
      readings: Joi.object({
        temperature: Joi.number().required(),
        waterLevel: Joi.number().required(),
        waterPurity: Joi.number().required(),
        powerConsumption: Joi.number().required()
      }).required(),
      events: Joi.array().items(Joi.object({
        type: Joi.string().required(),
        timestamp: Joi.date().required()
      })).optional()
    })
  }
};