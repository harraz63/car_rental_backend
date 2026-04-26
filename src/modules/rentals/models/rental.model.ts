import mongoose, { Document, Schema, Types } from 'mongoose';
import { RentalStatus } from '../../../types';

export interface IRental extends Document {
  userId: Types.ObjectId;
  carId: Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: RentalStatus;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const rentalSchema = new Schema<IRental>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    carId: {
      type: Schema.Types.ObjectId,
      ref: 'Car',
      required: [true, 'Car ID is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: [0, 'Total price cannot be negative'],
    },
    status: {
      type: String,
      enum: Object.values(RentalStatus),
      default: RentalStatus.PENDING,
    },
    rejectionReason: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

rentalSchema.index({ userId: 1 });
rentalSchema.index({ carId: 1 });
rentalSchema.index({ status: 1 });

const Rental = mongoose.model<IRental>('Rental', rentalSchema);

export default Rental;
