import express from 'express';
import { signupController, loginController, logoutController, profileController } from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', signupController);
router.post('/login', loginController);
router.post('/logout', logoutController);
router.get('/profile', profileController);

export default router;