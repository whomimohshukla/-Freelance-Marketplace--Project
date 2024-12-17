import { Request, Response } from "express";
import { User } from "../models/User";
import { OTP } from "../models/OTP";
import bcrypt from "bcryptjs";
import { emailService } from "../utils/emailService";

export const userController = {
  // Generate and send OTP
  sendOTP: async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      // Validate email
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP to database
      await OTP.findOneAndDelete({ email }); // Delete any existing OTP
      await OTP.create({ email, otp });

      // Send OTP via email
      const emailSent = await emailService.sendOTPEmail(email, otp);

      if (!emailSent) {
        return res.status(500).json({ message: "Failed to send OTP email" });
      }

      res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error in sendOTP:", error);
      res.status(500).json({ message: "Error sending OTP" });
    }
  },

  // Verify OTP and complete signup
  signup: async (req: Request, res: Response) => {
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
        return res.status(400).json({
          message: "Missing required fields",
          required: [
            "email",
            "password",
            "firstName",
            "lastName",
            "role",
            "otp",
          ],
        });
      }

      // Verify OTP
      const otpRecord = await OTP.findOne({ email });
      if (!otpRecord) {
        return res.status(400).json({ message: "OTP expired or not found" });
      }

      if (otpRecord.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user
      const user = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
        skills: skills || [],
        hourlyRate: hourlyRate || 0,
        status: "active",
      });

      // Delete OTP record
      await OTP.deleteOne({ email });

      // Send welcome email
      await emailService.sendEmail({
        to: email,
        subject: "Welcome to SkillBridge!",
        html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <h2>Welcome to SkillBridge!, ${firstName}!</h2>
                        <p>Your account has been successfully created.</p>
                        <p>You can now login and start using our platform.</p>
                        <p>Best regards,<br>The SkillBridge Team</p>
                    </div>
                `,
      });

      // Remove password from response
      const userResponse = user.toObject();

    //   if ("password" in userResponse) {
        
    //     delete userResponse.password;
    //   }

      res.status(201).json({
        message: "User created successfully",
        user: userResponse,
      });
    } catch (error) {
      console.error("Error in signup:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  },
};
