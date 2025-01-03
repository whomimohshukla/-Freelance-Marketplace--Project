// models/User.ts - User Model Schema
import mongoose, { Schema, Document, Types } from "mongoose";
import crypto from "crypto";

// Interface for User document with optional password
export interface IUser extends Document {
  email: string;
  password?: string; // Make password optional for response objects
  firstName: string;
  lastName: string;
  role: "client" | "freelancer" | "admin";
  skills: string[];
  hourlyRate?: number;
  joinDate: Date;
  status: "active" | "inactive";
  portfolio?: string[];
  bio?: string;
  // reviews: Ref<Review>[];
  // projects: Ref<Project>[];
  // proposals: Ref<Proposal>[];
  isVerified: boolean;
  profileImage?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  generateResetPasswordToken(): string;
}

// Interface for authentication response
export interface IAuthResponse {
  user: Omit<IUser, "password">;
  token: string;
  success: boolean;
  message: string;
}

// Interface for creating a new user (password required)
export interface IUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "client" | "freelancer" | "admin";
  skills?: string[];
  hourlyRate?: number;
  status?: "active" | "inactive";
  portfolio?: string[];
  bio?: string;
  // reviews: Ref<Review>[];
  // projects: Ref<Project>[];
  // proposals: Ref<Proposal>[];
  projects?: Types.ObjectId[]; // Reference to Project model
  proposals?: Types.ObjectId[]; // Reference to Proposal model
  reviews?: Types.ObjectId[]; // Reference to Review model

  isVerified?: boolean;
  profileImage?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

// Schema definition
const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: true, // Field must be provided
      unique: true, // Must be unique in database
      lowercase: true, // Converts email to lowercase
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    firstName: {
      type: String,
      required: true,
      trim: true, // Removes whitespace
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["client", "freelancer", "admin"],
      required: [true, "Role is required"],
    },
    skills: [
      {
        type: String,
      },
    ],
    hourlyRate: {
      type: Number,
      default: 0,
    },
    joinDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    portfolio: [
      {
        type: String,
      },
    ],
    bio: {
      type: String,
      maxlength: [500, "Bio cannot be more than 500 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    profileImage: {
      type: String,
    },
    location: {
      type: String,
    },
    socialLinks: {
      linkedin: String,
      github: String,
      portfolio: String,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    projects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Project",
      },
    ],
    proposals: [
      {
        type: Schema.Types.ObjectId,
        ref: "Proposal",
      },
    ],
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Generate and hash password token
UserSchema.methods.generateResetPasswordToken = function(): string {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = new Date(Date.now() + 3600000); // 1 hour

  return resetToken;
};

export const User = mongoose.model<IUser>("User", UserSchema);
