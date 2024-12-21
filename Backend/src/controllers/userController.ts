import { Request, Response, NextFunction, RequestHandler } from "express";
import { User, IUser, IUserInput, IAuthResponse } from "../models/User";
import { OTP } from "../models/OTP";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { emailService } from "../utils/emailService";
import { config } from "../config/env";

// Generate and send OTP
const sendOTP = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      res.status(400).json({ message: "Email is required" });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`your otp is ${otp}`);
    // Save OTP to database
    await OTP.findOneAndDelete({ email }); // Delete any existing OTP
    await OTP.create({ email, otp });

    // Send OTP via email
    const emailSent = await emailService.sendOTPEmail(email, otp);

    if (!emailSent) {
      res.status(500).json({ message: "Failed to send OTP email" });
      return;
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    next(error);
  }
};

// Verify OTP and complete signup
const signup = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      role,
      skills,
      hourlyRate,
      otp,
    } = req.body;

    // Input validation
    if (!email || !password || !firstName || !lastName || !role || !otp) {
      res.status(400).json({
        message: "Missing required fields",
        required: ["email", "password", "firstName", "lastName", "role", "otp"],
      });
      return;
    }

    // Verify OTP
    const otpRecord = await OTP.findOne({ email });
    if (!otpRecord) {
      res.status(400).json({ message: "OTP expired or not found" });
      return;
    }

    if (otpRecord.otp !== otp) {
      res.status(400).json({ message: "Invalid OTP" });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare user data
    const userData: IUserInput = {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
      skills: skills || [],
      hourlyRate: hourlyRate || 0,
      status: "active",
    };

    // Create new user
    const user = await User.create(userData);

    // Delete OTP record
    await OTP.deleteOne({ email });

    // Send welcome email
    await emailService.sendWelcomeEmail(email, firstName);

    // Prepare response (excluding password)
    const userResponse = user.toObject();
    const { password: _, ...userWithoutPassword } = userResponse;

    res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create user",
    });
  }
};

// Resend OTP
const resendOTP = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("Resended OTP:", otp);
    // Delete any existing OTP and save new one
    await OTP.findOneAndDelete({ email });
    await OTP.create({ email, otp });

    // Send OTP via email
    const emailSent = await emailService.sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Error in resendOTP:", error);
    res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      // error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Define types for request bodies
interface LoginRequest {
  email: string;
  password: string;
}

// login controller functionality
const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginRequest;

    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide both email and password",
      });
    }

    // find the user by email if does not exist
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password) {
      res.status(404).json({ message: "Invalid credentials" });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({ message: "Invalid credentials" });
      return;
    }

    // if everything is valid return the user
    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    // generate the token
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpire,
    });

    // Create response without password
    const userResponse = user.toObject();
    delete userResponse.password;

    const response: IAuthResponse = {
      message: "User logged in successfully",
      success: true,
      token,
      user: userResponse,
    };

    // Send login notification email
    await emailService.sendLoginNotificationEmail(user.email, user.firstName);

    res
      .cookie("token", token, {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true, // Prevents JavaScript access to the cookie
        secure: process.env.NODE_ENV === "production", // Only send cookie over HTTPS in production
        sameSite: "strict", // Protect against CSRF
      })
      .status(200)
      .json(response);
  } catch (error) {
    res.status(500).json({ message: "error while logging in", error: error });
  }
};

// Export the controller functions
export const userController = {
  sendOTP: sendOTP as RequestHandler,
  resendOTP: resendOTP as RequestHandler,
  signup: signup as RequestHandler,
  login: login as RequestHandler,
};
