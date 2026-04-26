import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUser } from '../models/user.model';
import { UserRole, JwtPayload } from '../../../types';
import { AppError } from '../../../utils/appError';
import { createCarWithSession } from '../../cars/services/car.service';

const signToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  role: UserRole
): Promise<{ user: Partial<IUser>; token: string }> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const user = await User.create({ name, email, password, role });

  const payload: JwtPayload = { id: user._id.toString(), role: user.role, email: user.email };
  const token = signToken(payload);

  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

// ─── Owner signup with mandatory car — wrapped in a DB transaction ────────────
export const registerOwnerWithCar = async (
  name: string,
  email: string,
  password: string,
  carData: Record<string, unknown>
): Promise<{ user: Partial<IUser>; car: Record<string, unknown>; token: string }> => {
  // Duplicate email check before opening a session (avoids unnecessary transactions)
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('An account with this email already exists.', 409);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Create OWNER user inside the transaction
    const [user] = await User.create([{ name, email, password, role: UserRole.OWNER }], { session });

    // 2. Create Car linked to owner inside the same transaction
    //    Delegates to Car Service — no logic duplication
    const car = await createCarWithSession(carData, user._id.toString(), session);

    // 3. Both succeeded → commit
    await session.commitTransaction();

    const payload: JwtPayload = { id: user._id.toString(), role: user.role, email: user.email };
    const token = signToken(payload);

    return {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role },
      car: {
        _id: car._id,
        brand: car.brand,
        model: car.model,
        year: car.year,
        dailyPrice: car.dailyPrice,
        status: car.status,
      },
      token,
    };
  } catch (err) {
    // Either step failed → rollback everything
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const loginUser = async (
  email: string,
  password: string
): Promise<{ user: Partial<IUser>; token: string }> => {
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password.', 401);
  }

  const payload: JwtPayload = { id: user._id.toString(), role: user.role, email: user.email };
  const token = signToken(payload);

  return {
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};
