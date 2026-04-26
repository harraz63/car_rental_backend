import { Router } from 'express';
import * as rentalController from '../controllers/rental.controller';
import { authenticate } from '../../../middlewares/auth.middleware';
import { authorize } from '../../../middlewares/role.middleware';
import { validate } from '../../../middlewares/validate.middleware';
import { createRentalSchema, rejectRentalSchema } from '../validation/rental.validation';
import { UserRole } from '../../../types';

const router = Router();

// USER routes
router.post('/', authenticate, authorize(UserRole.USER), validate(createRentalSchema), rentalController.requestRental);
router.get('/my', authenticate, authorize(UserRole.USER), rentalController.getMyRentals);

// ADMIN routes
router.get('/pending', authenticate, authorize(UserRole.ADMIN), rentalController.getPendingRentals);
router.patch('/:id/approve', authenticate, authorize(UserRole.ADMIN), rentalController.approveRental);
router.patch('/:id/reject', authenticate, authorize(UserRole.ADMIN), validate(rejectRentalSchema), rentalController.rejectRental);

export default router;
