import mongoose, { Schema, Document, Types } from "mongoose";
import { IUser } from "./User";
import { IProject } from "./Project";

// Interface for Proposal document
export interface IProposal extends Document {
  project: Types.ObjectId | IProject;
  freelancer: Types.ObjectId | IUser;
  coverLetter: string;
  bidAmount: number;
  estimatedDuration: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  attachments?: string[];
  milestones?: {
    description: string;
    amount: number;
    dueDate: Date;
  }[];
}

// Interface for creating a new proposal
export interface IProposalInput {
  coverLetter: string;
  bidAmount: number;
  estimatedDuration: string;
  attachments?: string[];
  milestones?: {
    description: string;
    amount: number;
    dueDate: Date;
  }[];
}

// Schema definition
const ProposalSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    freelancer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
    },
    estimatedDuration: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "withdrawn"],
      default: "pending",
    },
    attachments: [{
      type: String,
    }],
    milestones: [{
      description: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
      dueDate: {
        type: Date,
        required: true,
      },
    }],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ProposalSchema.index({ project: 1, freelancer: 1 }, { unique: true });
ProposalSchema.index({ status: 1 });
ProposalSchema.index({ freelancer: 1 });
ProposalSchema.index({ project: 1 });

export const Proposal = mongoose.model<IProposal>("Proposal", ProposalSchema);