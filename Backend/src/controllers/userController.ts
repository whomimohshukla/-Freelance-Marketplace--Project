import { Request, Response, NextFunction, RequestHandler } from "express";
import { User, IUser, IUserInput, IAuthResponse } from "../models/User";
import { OTP } from "../models/OTP";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { emailService } from "../utils/emailService";
import { config } from "../config/env";
import { ErrorResponse } from "../utils/errorResponse";

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
      id: user._id,
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
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(200)
      .json(response);
  } catch (error) {
    res.status(500).json({ message: "error while logging in", error: error });
  }
};

// get user

export const getMe = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  try {
    // User should already be available from auth middleware
    if (!req.user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Get fresh user data with selected fields
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

interface UpdateProfileFields {
  firstName?: string;
  lastName?: string;
  email?: string;
  skills?: string[];
  hourlyRate?: number;
  bio?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  portfolio?: string[];
  profileImage?: string;
  [key: string]: any; // Index signature
}

export const updateProfile = async (
  req: Request & { user?: IUser },
  res: Response,
  next: NextFunction
) => {
  try {
    const fieldsToUpdate: UpdateProfileFields = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      skills: req.body.skills,
      hourlyRate: req.body.hourlyRate,
      bio: req.body.bio,
      location: req.body.location,
      socialLinks: req.body.socialLinks,
      portfolio: req.body.portfolio,
      profileImage: req.body.profileImage,
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach((key) => {
      if (fieldsToUpdate[key] === undefined) {
        delete fieldsToUpdate[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      { $set: fieldsToUpdate },
      {
        new: true,
        runValidators: true,
        select: "-password",
      }
    );

    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new ErrorResponse("Please provide an email", 400));
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse("No user found with this email", 404));
    }

    // Generate reset token
    const resetToken = jwt.sign({ id: user._id }, config.jwtSecret, {
      expiresIn: "1h",
    });

    // Send reset email
    const emailSent = await emailService.sendPasswordResetEmail(
      email,
      resetToken
    );

    if (!emailSent) {
      return next(new ErrorResponse("Email could not be sent", 500));
    }

    res.status(200).json({
      success: true,
      message: "Password reset link sent to email",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { token } = req.query;
    const { password } = req.body;

    console.log({
      token,
      password,
    });

    if (!token || !password) {
      return next(
        new ErrorResponse("Please provide both token and new password", 400)
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token as string, config.jwtSecret) as { id: string };
    } catch (error) {
      return next(new ErrorResponse("Invalid or expired reset token", 400));
    }

    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse("User not found", 404));
    }

    // Validate password
    if (password.length < 6) {
      return next(
        new ErrorResponse("Password must be at least 6 characters", 400)
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    // Send success response
    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });

    // Send password change notification email
    await emailService.sendEmail({
      to: user.email,
      subject: "Security Alert: Password Changed Successfully",
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h2 style="color: #2c3e50; margin: 0;">Password Changed Successfully</h2>
                <p style="color: #7f8c8d; margin-top: 5px;">Security Update for Your Account</p>
            </div>
            
            <div style="background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <p style="color: #34495e; margin-bottom: 15px;">Hello ${
                  user.firstName
                },</p>
                
                <p style="color: #34495e; line-height: 1.6;">The password for your account was successfully changed on ${new Date().toLocaleString()}.</p>
                
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p style="color: #e74c3c; margin: 0;">
                        <strong>⚠️ If you didn't make this change:</strong>
                    </p>
                    <ul style="color: #34495e; margin: 10px 0;">
                        <li>Please contact our support team immediately</li>
                        <li>Review your account for any unauthorized changes</li>
                        <li>Consider enabling two-factor authentication</li>
                    </ul>
                </div>

                <p style="color: #34495e; margin-top: 20px;">For security reasons, you may want to:</p>
                <ul style="color: #34495e;">
                    <li>Review your recent account activity</li>
                    <li>Update passwords on other accounts if they were similar</li>
                    <li>Ensure your email account is secure</li>
                </ul>
            </div>
            
            <div style="margin-top: 30px; text-align: center; color: #7f8c8d; font-size: 12px;">
                <p>This is an automated security alert from SkillBridge.</p>
                <p>If you need assistance, please contact our support team.</p>
                <p style="margin-top: 15px;">${new Date().getFullYear()} SkillBridge. All rights reserved.</p>
            </div>
        </div>
      `,
    });

    // Send password change notification email
  } catch (error) {
    next(error);
  }
};

// Export the controller functions
export const userController = {
  sendOTP: sendOTP as RequestHandler,
  resendOTP: resendOTP as RequestHandler,
  signup: signup as RequestHandler,
  login: login as RequestHandler,
  forgotPassword: forgotPassword as RequestHandler,
  resetPassword: resetPassword as RequestHandler,
  updateProfile: updateProfile as RequestHandler,
  getMe: getMe as RequestHandler,
};
