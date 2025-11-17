import express from 'express';
import { 
    signupController, loginPasswordController, 
    logoutController, generateOTPController,verifyOTPController,
    loginOTPController
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login/password', loginPasswordController);
router.post('/login/otp', loginOTPController);
router.post('/logout', logoutController);
router.post('/generate-otp', generateOTPController);
router.post('/verify-otp', verifyOTPController);

export default router;