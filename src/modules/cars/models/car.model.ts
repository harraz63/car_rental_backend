import mongoose, { Schema, Types } from 'mongoose';
import { CarStatus, Transmission, FuelType } from '../../../types';

export interface ICar {
  _id: Types.ObjectId;
  brand: string;
  model: string;
  year: number;
  color?: string;
  dailyPrice: number;
  location?: string;
  description?: string;
  numberOfSeats?: number;
  engine?: string;
  transmission: Transmission;
  fuelType: FuelType;
  images: string[];
  status: CarStatus;
  ownerId: Types.ObjectId;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const carSchema = new Schema(
  {
    brand: { type: String, required: [true, 'Brand is required'], trim: true },
    model: { type: String, required: [true, 'Model is required'], trim: true },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1990, 'Year must be 1990 or later'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the far future'],
    },
    color: { type: String, trim: true },
    dailyPrice: {
      type: Number,
      required: [true, 'Daily price is required'],
      min: [1, 'Daily price must be greater than 0'],
    },
    location: { type: String, trim: true },
    description: { type: String, trim: true },
    numberOfSeats: { type: Number, min: 1, max: 20 },
    engine: { type: String, trim: true },
    transmission: {
      type: String,
      enum: { values: Object.values(Transmission), message: 'Invalid transmission type' },
      required: [true, 'Transmission type is required'],
    },
    fuelType: {
      type: String,
      enum: { values: Object.values(FuelType), message: 'Invalid fuel type' },
      required: [true, 'Fuel type is required'],
    },
    images: {
      type: [String],
      required: [true, 'At least one image is required'],
      validate: {
        validator: (val: string[]) => val && val.length >= 1,
        message: 'At least one image URL is required',
      },
    },
    status: { type: String, enum: Object.values(CarStatus), default: CarStatus.PENDING },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rejectionReason: { type: String, trim: true },
  },
  { timestamps: true, versionKey: false }
);

carSchema.index({ status: 1 });
carSchema.index({ ownerId: 1 });
carSchema.index({ brand: 1, model: 1 });

const Car = mongoose.model('Car', carSchema);

export default Car;
