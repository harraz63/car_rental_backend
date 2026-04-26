import { Request, Response } from 'express';
import { asyncHandler } from '../../../utils/appError';
import { registerUser, registerOwnerWithCar, loginUser } from '../services/auth.service';
import { UserRole } from '../../../types';

export const signupUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const result = await registerUser(name, email, password, UserRole.USER);

  res.status(201).json({
    status: 'success',
    message: 'User account created successfully.',
    data: result,
  });
});

export const signupOwner = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, car } = req.body;

  // car is guaranteed to exist here — validated by signupOwnerSchema before reaching this handler
  const result = await registerOwnerWithCar(name, email, password, car);

  res.status(201).json({
    status: 'success',
    message: 'Owner and car created successfully.',
    data: {
      user: result.user,
      car: result.car,
      token: result.token,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await loginUser(email, password);

  res.status(200).json({
    status: 'success',
    message: 'Logged in successfully.',
    data: result,
  });
});
