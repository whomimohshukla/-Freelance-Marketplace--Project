import mongoose, { Document, Schema } from 'mongoose';

export interface IProposal extends Document {
  project: mongoose.Types.ObjectId;
  freelancer: mongoose.Types.ObjectId;
  coverLetter: string;
  price: number;
  timeframe: number; // in days
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  attachments?: string[];
  createdAt: Date;
}

const ProposalSchema = new Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coverLetter: {
    type: String,
    required: [true, 'Please add a cover letter'],
    maxlength: [2000, 'Cover letter cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add your price']
  },
  timeframe: {
    type: Number,
    required: [true, 'Please add estimated timeframe in days']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  attachments: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent multiple proposals from same freelancer
ProposalSchema.index({ project: 1, freelancer: 1 }, { unique: true });

export const Proposal = mongoose.model<IProposal>('Proposal', ProposalSchema);
