
import mongoose, { Schema, Document, Types } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

// Interface for Message document
export interface IMessage extends Document {
  sender: Types.ObjectId | IUser;
  receiver: Types.ObjectId | IUser;
  content: string;
  attachments?: string[];
  readAt?: Date;
  project?: Types.ObjectId | IProject;
  type: "text" | "file" | "system";
  createdAt: Date;
  updatedAt: Date;
}

// Interface for creating a new message
export interface IMessageInput {
  content: string;
  receiver: string; // User ID
  project?: string; // Project ID
  type: "text" | "file" | "system";
  attachments?: string[];
}

// Schema definition
const MessageSchema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    attachments: [{
      type: String,
    }],
    readAt: {
      type: Date,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
    },
    type: {
      type: String,
      enum: ["text", "file", "system"],
      default: "text",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
MessageSchema.index({ sender: 1, receiver: 1 });
MessageSchema.index({ project: 1 });
MessageSchema.index({ readAt: 1 });
MessageSchema.index({ createdAt: 1 });

// Compound index for conversation queries
MessageSchema.index({ sender: 1, receiver: 1, createdAt: -1 });

// Methods to handle message status
MessageSchema.methods.markAsRead = async function(): Promise<void> {
  this.readAt = new Date();
  await this.save();
};

// Static method to get conversation between two users
MessageSchema.statics.getConversation = async function(
  userOneId: string,
  userTwoId: string,
  limit: number = 50,
  page: number = 1
) {
  const skip = (page - 1) * limit;
  
  return this.find({
    $or: [
      { sender: userOneId, receiver: userTwoId },
      { sender: userTwoId, receiver: userOneId }
    ]
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'firstName lastName profileImage')
    .populate('receiver', 'firstName lastName profileImage');
};

// Static method to get unread messages count
MessageSchema.statics.getUnreadCount = async function(userId: string) {
  return this.countDocuments({
    receiver: userId,
    readAt: null
  });
};

export const Message = mongoose.model<IMessage>('Message', MessageSchema);