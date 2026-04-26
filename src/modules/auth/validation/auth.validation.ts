import Joi from 'joi';
import { Transmission, FuelType } from '../../cars/validation/car.validation';

const currentYear = new Date().getFullYear();

// ─── Reusable car sub-schema (same rules as createCarSchema) ─────────────────
const carSubSchema = Joi.object({
  brand: Joi.string().trim().required().messages({ 'any.required': 'car.brand is required' }),
  model: Joi.string().trim().required().messages({ 'any.required': 'car.model is required' }),
  year: Joi.number().integer().min(1990).max(currentYear + 1).required().messages({
    'number.min': 'car.year must be 1990 or later',
    'number.max': `car.year cannot exceed ${currentYear + 1}`,
    'any.required': 'car.year is required',
  }),
  color: Joi.string().trim().optional(),
  dailyPrice: Joi.number().positive().required().messages({
    'number.positive': 'car.dailyPrice must be greater than 0',
    'any.required': 'car.dailyPrice is required',
  }),
  location: Joi.string().trim().optional(),
  description: Joi.string().trim().optional(),
  numberOfSeats: Joi.number().integer().min(1).max(20).optional(),
  engine: Joi.string().trim().optional(),
  transmission: Joi.string()
    .valid(...Object.values(Transmission))
    .required()
    .messages({
      'any.only': `car.transmission must be one of: ${Object.values(Transmission).join(', ')}`,
      'any.required': 'car.transmission is required',
    }),
  fuelType: Joi.string()
    .valid(...Object.values(FuelType))
    .required()
    .messages({
      'any.only': `car.fuelType must be one of: ${Object.values(FuelType).join(', ')}`,
      'any.required': 'car.fuelType is required',
    }),
  images: Joi.array().items(Joi.string().uri()).min(1).required().messages({
    'array.min': 'car.images must contain at least one URL',
    'any.required': 'car.images is required',
  }),
});

// ─── Signup schemas ───────────────────────────────────────────────────────────
export const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 50 characters',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
});

// Owner signup requires all user fields + a nested car object
export const signupOwnerSchema = signupSchema.keys({
  car: carSubSchema.required().messages({
    'any.required': 'car object is required when signing up as an owner',
    'object.base': 'car must be a valid object',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required',
  }),
});
