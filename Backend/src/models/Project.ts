import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./User";

// Interface for Project document
export interface IProject extends Document {
  title: string;
  description: string;
  client: Types.ObjectId | IUser;
  category: string;
  skills: string[];
  budget: {
    minimum: number;
    maximum: number;
    type: "fixed" | "hourly";
  };
  deadline?: Date;
  status: "open" | "in-progress" | "completed" | "cancelled";
  attachments?: string[];
  assignedFreelancer?: Types.ObjectId | IUser;
  visibility: "public" | "private";
  complexity: "beginner" | "intermediate" | "expert";
  estimatedDuration: string;
}

// Interface for creating a new project
export interface IProjectInput {
  title: string;
  description: string;
  category: string;
  skills: string[];
  budget: {
    minimum: number;
    maximum: number;
    type: "fixed" | "hourly";
  };
  deadline?: Date;
  visibility: "public" | "private";
  complexity: "beginner" | "intermediate" | "expert";
  estimatedDuration: string;
  attachments?: string[];
}

// Schema definition
const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    skills: [
      {
        type: String,
        required: true,
      },
    ],
    budget: {
      minimum: {
        type: Number,
        required: true,
      },
      maximum: {
        type: Number,
        required: true,
      },
      type: {
        type: String,
        enum: ["fixed", "hourly"],
        required: true,
      },
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["open", "in-progress", "completed", "cancelled"],
      default: "open",
    },
    attachments: [
      {
        type: String,
      },
    ],
    assignedFreelancer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    complexity: {
      type: String,
      enum: ["beginner", "intermediate", "expert"],
      required: true,
    },
    estimatedDuration: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ProjectSchema.index({ title: "text", description: "text" });
ProjectSchema.index({ status: 1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ client: 1 });
ProjectSchema.index({ assignedFreelancer: 1 });

export const Project = mongoose.model<IProject>("Project", ProjectSchema);
