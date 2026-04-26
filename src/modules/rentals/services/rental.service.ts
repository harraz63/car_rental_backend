import Rental, { IRental } from '../models/rental.model';
import Car from '../../cars/models/car.model';
import { CarStatus, RentalStatus } from '../../../types';
import { AppError } from '../../../utils/appError';

const calculateTotalPrice = (
  dailyPrice: number,
  startDate: Date,
  endDate: Date
): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.ceil((endDate.getTime() - startDate.getTime()) / msPerDay);
  return parseFloat((days * dailyPrice).toFixed(2));
};

export const requestRental = async (
  userId: string,
  carId: string,
  startDate: Date,
  endDate: Date
): Promise<IRental> => {
  const car = await Car.findById(carId);
  if (!car) throw new AppError('Car not found.', 404);
  if (car.status !== CarStatus.APPROVED) {
    throw new AppError('This car is not available for rental.', 400);
  }

  // Check for overlapping approved rentals
  const overlap = await Rental.findOne({
    carId,
    status: RentalStatus.APPROVED,
    $or: [
      { startDate: { $lte: endDate }, endDate: { $gte: startDate } },
    ],
  });

  if (overlap) {
    throw new AppError(
      'This car is already booked for the selected dates. Please choose different dates.',
      409
    );
  }

  const totalPrice = calculateTotalPrice(car.dailyPrice, startDate, endDate);

  const rental = await Rental.create({
    userId,
    carId,
    startDate,
    endDate,
    totalPrice,
    status: RentalStatus.PENDING,
  });

  return rental.populate([
    { path: 'carId', select: 'brand model year dailyPrice location images' },
    { path: 'userId', select: 'name email' },
  ]);
};

export const getMyRentals = async (userId: string): Promise<IRental[]> => {
  return Rental.find({ userId })
    .populate('carId', 'brand model year dailyPrice location images')
    .sort({ createdAt: -1 });
};

export const getPendingRentals = async (): Promise<IRental[]> => {
  return Rental.find({ status: RentalStatus.PENDING })
    .populate('carId', 'brand model year dailyPrice location')
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
};

export const approveRental = async (rentalId: string): Promise<IRental> => {
  const rental = await Rental.findById(rentalId);
  if (!rental) throw new AppError('Rental request not found.', 404);
  if (rental.status === RentalStatus.APPROVED) {
    throw new AppError('Rental is already approved.', 400);
  }

  rental.status = RentalStatus.APPROVED;
  rental.rejectionReason = undefined;
  await rental.save();
  return rental;
};

export const rejectRental = async (
  rentalId: string,
  reason?: string
): Promise<IRental> => {
  const rental = await Rental.findById(rentalId);
  if (!rental) throw new AppError('Rental request not found.', 404);
  if (rental.status === RentalStatus.REJECTED) {
    throw new AppError('Rental is already rejected.', 400);
  }

  rental.status = RentalStatus.REJECTED;
  if (reason) rental.rejectionReason = reason;
  await rental.save();
  return rental;
};
