import express from "express";
import { userController } from "../controllers/userController";

const router = express.Router();

// Route to send OTP
router.post("/send-otp", userController.sendOTP);

// Route to resend OTP
router.post("/resend-otp", userController.resendOTP);

// Route to verify OTP and complete signup
router.post("/signup", userController.signup);

// Route to login

router.post("/login", userController.login);

export default router;
