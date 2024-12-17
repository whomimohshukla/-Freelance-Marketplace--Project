import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  client: mongoose.Types.ObjectId;
  budget: {
    min: number;
    max: number;
    type: 'fixed' | 'hourly';
  };
  category: string;
  skills: string[];
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  deadline?: Date;
  attachments?: string[];
  proposals: mongoose.Types.ObjectId[];
  freelancer?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [5000, 'Description cannot be more than 5000 characters']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  budget: {
    min: {
      type: Number,
      required: [true, 'Please add a minimum budget']
    },
    max: {
      type: Number,
      required: [true, 'Please add a maximum budget']
    },
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      required: true
    }
  },
  category: {
    type: String,
    required: [true, 'Please add a category']
  },
  skills: [{
    type: String,
    required: [true, 'Please add at least one required skill']
  }],
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  deadline: {
    type: Date
  },
  attachments: [{
    type: String
  }],
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal'
  }],
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for search
ProjectSchema.index({ title: 'text', description: 'text', skills: 'text' });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
