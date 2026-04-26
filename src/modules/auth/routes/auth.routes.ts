import { Router } from 'express';
import { signupUser, signupOwner, login } from '../controllers/auth.controller';
import { validate } from '../../../middlewares/validate.middleware';
import { signupSchema, signupOwnerSchema, loginSchema } from '../validation/auth.validation';

const router = Router();

router.post('/signup-user', validate(signupSchema), signupUser);
router.post('/signup-owner', validate(signupOwnerSchema), signupOwner); // ← uses stricter schema
router.post('/login', validate(loginSchema), login);

export default router;
