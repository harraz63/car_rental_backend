import Joi from 'joi';
import { Transmission, FuelType } from '../../../types';

// Re-export enums for use in other validation files
export { Transmission, FuelType };

const currentYear = new Date().getFullYear();

export const createCarSchema = Joi.object({
  brand: Joi.string().trim().required().messages({
    'any.required': 'Brand is required',
  }),
  model: Joi.string().trim().required().messages({
    'any.required': 'Model is required',
  }),
  year: Joi.number()
    .integer()
    .min(1990)
    .max(currentYear + 1)
    .required()
    .messages({
      'number.min': 'Year must be 1990 or later',
      'number.max': `Year cannot exceed ${currentYear + 1}`,
      'any.required': 'Year is required',
    }),
  color: Joi.string().trim().optional(),
  dailyPrice: Joi.number().positive().required().messages({
    'number.positive': 'Daily price must be greater than 0',
    'any.required': 'Daily price is required',
  }),
  location: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  numberOfSeats: Joi.number().integer().min(1).max(20).optional(),
  engine: Joi.string().trim().optional(),
  transmission: Joi.string()
    .valid(...Object.values(Transmission))
    .required()
    .messages({
      'any.only': `Transmission must be one of: ${Object.values(Transmission).join(', ')}`,
      'any.required': 'Transmission type is required',
    }),
  fuelType: Joi.string()
    .valid(...Object.values(FuelType))
    .required()
    .messages({
      'any.only': `Fuel type must be one of: ${Object.values(FuelType).join(', ')}`,
      'any.required': 'Fuel type is required',
    }),
  images: Joi.array().items(Joi.string().uri()).min(1).required().messages({
    'array.min': 'At least one image URL is required',
    'any.required': 'Images are required',
  }),
});

export const updateCarSchema = Joi.object({
  brand: Joi.string().trim().optional(),
  model: Joi.string().trim().optional(),
  year: Joi.number().integer().min(1990).max(currentYear + 1).optional(),
  color: Joi.string().trim().optional(),
  dailyPrice: Joi.number().positive().optional(),
  location: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  numberOfSeats: Joi.number().integer().min(1).max(20).optional(),
  engine: Joi.string().trim().optional(),
  transmission: Joi.string().valid(...Object.values(Transmission)).optional(),
  fuelType: Joi.string().valid(...Object.values(FuelType)).optional(),
  images: Joi.array().items(Joi.string().uri()).min(1).optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

export const rejectCarSchema = Joi.object({
  reason: Joi.string().trim().optional(),
});
