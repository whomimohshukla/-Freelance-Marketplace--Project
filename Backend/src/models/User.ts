// models/User.ts - User Model Schema
import mongoose, { Schema, Document } from "mongoose";

// Interface for User document with optional password
export interface IUser extends Document {
  email: string;
  password?: string; // Make password optional for response objects
  firstName: string;
  lastName: string;
  role: "client" | "freelancer";
  skills: string[];
  hourlyRate?: number;
  joinDate: Date;
  status: "active" | "inactive";
}

// Interface for creating a new user (password required)
export interface IUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "client" | "freelancer";
  skills?: string[];
  hourlyRate?: number;
  status?: "active" | "inactive";
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
      enum: ["client", "freelancer"], // Only these values allowed
      required: true,
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
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);
export const User = mongoose.model<IUser>("User", UserSchema);
