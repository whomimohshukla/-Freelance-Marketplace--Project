import express from 'express';
import { userController } from '../controllers/userController';

const router = express.Router();

// Route to send OTP
router.post('/send-otp', userController.sendOTP);

// Route to verify OTP and complete signup
router.post('/signup', userController.signup);

export default router;
