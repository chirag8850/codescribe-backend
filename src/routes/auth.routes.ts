import express from 'express';
import { 
    signupController, loginController, 
    logoutController, generateOTPController,verifyOTPController,
} from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.post('/generate-otp', generateOTPController);
router.post('/verify-otp', verifyOTPController);

export default router;