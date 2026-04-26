import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './modules/auth/routes/auth.routes';
import carRoutes from './modules/cars/routes/car.routes';
import rentalRoutes from './modules/rentals/routes/rental.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';

const app: Application = express();

// ─── Global Middlewares ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Car Rental API is running 🚗' });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cars', carRoutes);
app.use('/api/v1/rentals', rentalRoutes);

// ─── Error Handlers ───────────────────────────────────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
