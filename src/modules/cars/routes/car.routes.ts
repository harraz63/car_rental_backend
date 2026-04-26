import { Router } from 'express';
import * as carController from '../controllers/car.controller';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/role.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { createCarSchema, updateCarSchema, rejectCarSchema } from '../validation/car.validation';
import { UserRole } from '../../../types';

const router = Router();

// USER: browse approved cars
router.get('/', authenticate, authorize(UserRole.USER, UserRole.ADMIN, UserRole.OWNER), carController.getApprovedCars);

// OWNER routes
router.post('/', authenticate, authorize(UserRole.OWNER), validate(createCarSchema), carController.createCar);
router.get('/my', authenticate, authorize(UserRole.OWNER), carController.getMyCars);

// ADMIN routes
router.get('/pending', authenticate, authorize(UserRole.ADMIN), carController.getPendingCars);
router.patch('/:id/approve', authenticate, authorize(UserRole.ADMIN), carController.approveCar);
router.patch('/:id/reject', authenticate, authorize(UserRole.ADMIN), validate(rejectCarSchema), carController.rejectCar);
router.patch('/:id', authenticate, authorize(UserRole.ADMIN), validate(updateCarSchema), carController.updateCar);
router.delete('/:id', authenticate, authorize(UserRole.ADMIN, UserRole.OWNER), carController.deleteCar);

export default router;
