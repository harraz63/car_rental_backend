import Car from '../models/car.model';
import { CarStatus } from '../../../types';
import { AppError } from '../../../utils/appError';
import { ClientSession } from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CarDoc = any;

// Standard car creation (used by OWNER via POST /cars)
export const createCar = async (data: Record<string, unknown>, ownerId: string): Promise<CarDoc> => {
  return Car.create({ ...data, ownerId, status: CarStatus.PENDING });
};

// Transactional car creation (used during owner signup — session ensures atomicity)
export const createCarWithSession = async (
  data: Record<string, unknown>,
  ownerId: string,
  session: ClientSession
): Promise<CarDoc> => {
  const [car] = await Car.create([{ ...data, ownerId, status: CarStatus.PENDING }], { session });
  return car;
};

export const getOwnerCars = async (ownerId: string): Promise<CarDoc[]> => {
  return Car.find({ ownerId }).sort({ createdAt: -1 });
};

export const getApprovedCars = async (): Promise<CarDoc[]> => {
  return Car.find({ status: CarStatus.APPROVED })
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 });
};

export const getPendingCars = async (): Promise<CarDoc[]> => {
  return Car.find({ status: CarStatus.PENDING })
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 });
};

export const approveCar = async (carId: string): Promise<CarDoc> => {
  const car = await Car.findById(carId);
  if (!car) throw new AppError('Car not found.', 404);
  if (car.status === CarStatus.APPROVED) throw new AppError('Car is already approved.', 400);
  car.status = CarStatus.APPROVED;
  car.rejectionReason = undefined;
  await car.save();
  return car;
};

export const rejectCar = async (carId: string, reason?: string): Promise<CarDoc> => {
  const car = await Car.findById(carId);
  if (!car) throw new AppError('Car not found.', 404);
  if (car.status === CarStatus.REJECTED) throw new AppError('Car is already rejected.', 400);
  car.status = CarStatus.REJECTED;
  if (reason) car.rejectionReason = reason;
  await car.save();
  return car;
};

export const updateCarById = async (carId: string, data: Record<string, unknown>): Promise<CarDoc> => {
  const car = await Car.findByIdAndUpdate(carId, data, { new: true, runValidators: true });
  if (!car) throw new AppError('Car not found.', 404);
  return car;
};

export const deleteCarById = async (carId: string): Promise<void> => {
  const car = await Car.findByIdAndDelete(carId);
  if (!car) throw new AppError('Car not found.', 404);
};
