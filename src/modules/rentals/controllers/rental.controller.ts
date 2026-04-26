import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/appError';
import * as rentalService from '../services/rental.service';

export const requestRental = asyncHandler(async (req: Request, res: Response) => {
  const { carId, startDate, endDate } = req.body;
  const rental = await rentalService.requestRental(
    req.user!.id,
    carId,
    new Date(startDate),
    new Date(endDate)
  );
  res.status(201).json({
    status: 'success',
    message: 'Rental request submitted. Awaiting admin approval.',
    data: { rental },
  });
});

export const getMyRentals = asyncHandler(async (req: Request, res: Response) => {
  const rentals = await rentalService.getMyRentals(req.user!.id);
  res.status(200).json({
    status: 'success',
    results: rentals.length,
    data: { rentals },
  });
});

export const getPendingRentals = asyncHandler(async (_req: Request, res: Response) => {
  const rentals = await rentalService.getPendingRentals();
  res.status(200).json({
    status: 'success',
    results: rentals.length,
    data: { rentals },
  });
});

export const approveRental = asyncHandler(async (req: Request, res: Response) => {
  const rental = await rentalService.approveRental(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Rental approved successfully.',
    data: { rental },
  });
});

export const rejectRental = asyncHandler(async (req: Request, res: Response) => {
  const rental = await rentalService.rejectRental(req.params.id, req.body?.reason);
  res.status(200).json({
    status: 'success',
    message: 'Rental rejected.',
    data: { rental },
  });
});
