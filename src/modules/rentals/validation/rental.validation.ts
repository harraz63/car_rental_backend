import Joi from 'joi';

export const createRentalSchema = Joi.object({
  carId: Joi.string().hex().length(24).required().messages({
    'string.hex': 'Car ID must be a valid MongoDB ObjectId',
    'string.length': 'Car ID must be a valid MongoDB ObjectId',
    'any.required': 'Car ID is required',
  }),
  startDate: Joi.date().greater('now').required().messages({
    'date.greater': 'Start date must be in the future',
    'any.required': 'Start date is required',
  }),
  endDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
    'date.greater': 'End date must be after start date',
    'any.required': 'End date is required',
  }),
});

export const rejectRentalSchema = Joi.object({
  reason: Joi.string().trim().optional(),
});
