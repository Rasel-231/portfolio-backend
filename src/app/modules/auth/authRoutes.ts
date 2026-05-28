import express from 'express';

import { AuthValidation } from './authVaidation';
import { AuthController } from './authController';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';


const router = express.Router();

router.post('/login', validateRequest(AuthValidation.loginValidationSchema as any), AuthController.loginUser);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/logout', AuthController.logoutUser);
router.get('/profile', auth(), AuthController.profile);

router.post(
    '/change-password',
    auth('ADMIN', 'USER', 'AI_CHAT_AGENT'),
    validateRequest(AuthValidation.changePasswordValidationSchema as any),
    AuthController.changePassword
);

export const AuthRoutes = router;