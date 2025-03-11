const express = require("express");
const userRoutes = express.Router();
const useControllers = require("../controllers/user.controller");
const socialAuthController = require("../controllers/socialAuth.controller");
const authMiddleware = require("../middleware/auth.middleware");



//otp routes
userRoutes.post("/send-otp", useControllers.sendOTP);
userRoutes.post("/resend-otp", useControllers.resendOTP);
// Auth routes
userRoutes.post("/signup", useControllers.signup);
userRoutes.post("/login", useControllers.login);
userRoutes.post("/google-login", useControllers.googleLogin);

// Social Authentication Routes
userRoutes.post('/auth/github', socialAuthController.githubAuth);
userRoutes.post('/auth/linkedin', socialAuthController.linkedinAuth);
userRoutes.post('/auth/complete-registration', socialAuthController.completeSocialRegistration);

// Profile routes
userRoutes.get("/profile/:id?", authMiddleware, useControllers.getProfile);
userRoutes.put("/profile", authMiddleware, useControllers.updateProfile);
userRoutes.delete(
  "/delete-account",
  authMiddleware,
  useControllers.deleteAccount
);
userRoutes.put(
  "/change-password",
  authMiddleware,
  useControllers.changePassword
);

// 2FA routes
userRoutes.post("/setup-2fa", authMiddleware, useControllers.setup2FA);
userRoutes.post("/verify-2fa", authMiddleware, useControllers.verify2FA);
userRoutes.post("/disable-2fa", authMiddleware, useControllers.disable2FA);

// Password reset
userRoutes.post("/forgot-password", useControllers.forgotPassword);
userRoutes.post("/reset-password", useControllers.resetPassword);

// Session management
userRoutes.post("/logout", authMiddleware, useControllers.logout);

module.exports = userRoutes;
