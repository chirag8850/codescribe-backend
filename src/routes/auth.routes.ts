import express from 'express';
import { 
    signupController, loginPasswordController, 
    logoutController, generateOTPController,verifyOTPController,
    loginOTPController, refreshTokenController
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login/password', loginPasswordController);
router.post('/login/otp', loginOTPController);
router.post('/logout', logoutController);
router.post('/generate-otp', generateOTPController);
router.post('/verify-otp', verifyOTPController);
router.post('/refresh-token', refreshTokenController);

export default router;