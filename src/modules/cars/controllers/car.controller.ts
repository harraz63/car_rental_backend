import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/appError';
import * as carService from '../services/car.service';

export const createCar = asyncHandler(async (req: Request, res: Response) => {
  const car = await carService.createCar(req.body, req.user!.id);
  res.status(201).json({
    status: 'success',
    message: 'Car submitted for approval.',
    data: { car },
  });
});

export const getMyCars = asyncHandler(async (req: Request, res: Response) => {
  const cars = await carService.getOwnerCars(req.user!.id);
  res.status(200).json({
    status: 'success',
    results: cars.length,
    data: { cars },
  });
});

export const getApprovedCars = asyncHandler(async (_req: Request, res: Response) => {
  const cars = await carService.getApprovedCars();
  res.status(200).json({
    status: 'success',
    results: cars.length,
    data: { cars },
  });
});

export const getPendingCars = asyncHandler(async (_req: Request, res: Response) => {
  const cars = await carService.getPendingCars();
  res.status(200).json({
    status: 'success',
    results: cars.length,
    data: { cars },
  });
});

export const approveCar = asyncHandler(async (req: Request, res: Response) => {
  const car = await carService.approveCar(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Car approved successfully.',
    data: { car },
  });
});

export const rejectCar = asyncHandler(async (req: Request, res: Response) => {
  const car = await carService.rejectCar(req.params.id, req.body?.reason);
  res.status(200).json({
    status: 'success',
    message: 'Car rejected.',
    data: { car },
  });
});

export const updateCar = asyncHandler(async (req: Request, res: Response) => {
  const car = await carService.updateCarById(req.params.id, req.body);
  res.status(200).json({
    status: 'success',
    message: 'Car updated successfully.',
    data: { car },
  });
});

export const deleteCar = asyncHandler(async (req: Request, res: Response) => {
  await carService.deleteCarById(req.params.id);
  res.status(200).json({
    status: 'success',
    message: 'Car deleted successfully.',
    data: null,
  });
});
