// src/models/Review.ts
import mongoose, { Schema, Document, Types, Model } from 'mongoose';
import { IUser } from './User';
import { IProject } from './Project';

// Interface for Review metrics
interface IReviewMetrics {
  communication: number;
  quality: number;
  expertise: number;
  professionalism: number;
  deadlineAdherence?: number;  // For client reviewing freelancer
  paymentPromptness?: number;  // For freelancer reviewing client
}

// Interface for Review document
export interface IReview extends Document {
  project: Types.ObjectId | IProject;
  reviewer: Types.ObjectId | IUser;
  reviewee: Types.ObjectId | IUser;
  rating: number;
  comment: string;
  type: "client-to-freelancer" | "freelancer-to-client";
  metrics: IReviewMetrics;
  isPublic: boolean;
  response?: string;  // Allows reviewee to respond to the review
  createdAt: Date;
  updatedAt: Date;
}

// Interface for Review statistics
interface IReviewStats {
  _id: null;
  averageRating: number;
  totalReviews: number;
  averageMetrics: {
    communication: number;
    quality: number;
    expertise: number;
    professionalism: number;
  };
}

// Interface for Review model static methods
interface IReviewModel extends Model<IReview> {
  calculateAverageRating(userId: string): Promise<IReviewStats | null>;
}

// Interface for creating a new review
export interface IReviewInput {
  project: string;  // Project ID
  rating: number;
  comment: string;
  metrics: {
    communication: number;
    quality: number;
    expertise: number;
    professionalism: number;
    deadlineAdherence?: number;
    paymentPromptness?: number;
  };
  isPublic?: boolean;
}

// Schema definition
const ReviewSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project is required'],
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer is required'],
    },
    reviewee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewee is required'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      minlength: [10, 'Review comment must be at least 10 characters'],
      maxlength: [1000, 'Review comment cannot exceed 1000 characters'],
    },
    type: {
      type: String,
      enum: ['client-to-freelancer', 'freelancer-to-client'],
      required: true,
    },
    metrics: {
      communication: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      quality: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      expertise: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      professionalism: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
      },
      deadlineAdherence: {
        type: Number,
        min: 1,
        max: 5,
      },
      paymentPromptness: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    response: {
      type: String,
      maxlength: [500, 'Response cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
ReviewSchema.index({ project: 1 });
ReviewSchema.index({ reviewer: 1 });
ReviewSchema.index({ reviewee: 1 });
ReviewSchema.index({ rating: 1 });
ReviewSchema.index({ type: 1 });

// Compound indexes
ReviewSchema.index({ reviewee: 1, type: 1 });
ReviewSchema.index({ project: 1, type: 1 });

// Methods to calculate average rating
ReviewSchema.statics.calculateAverageRating = async function(
  this: Model<IReview>,
  userId: string
): Promise<IReviewStats | null> {
  const stats = await this.aggregate([
    {
      $match: { reviewee: new mongoose.Types.ObjectId(userId) }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        averageMetrics: {
          $avg: {
            communication: '$metrics.communication',
            quality: '$metrics.quality',
            expertise: '$metrics.expertise',
            professionalism: '$metrics.professionalism'
          }
        }
      }
    }
  ]);

  return stats.length > 0 ? stats[0] : null;
};

// Prevent duplicate reviews
// ReviewSchema.index(
//   { project: 1, reviewer: 1, type: 1 },
//   { unique: true, message: 'You have already reviewed this project' }
// );

// Middleware to validate review type based on user roles
ReviewSchema.pre('save', async function(next) {
  try {
    const project = await mongoose.model('Project').findById(this.project);
    if (!project) {
      throw new Error('Project not found');
    }

    const reviewer = await mongoose.model('User').findById(this.reviewer);
    if (!reviewer) {
      throw new Error('Reviewer not found');
    }

    // Validate review type based on user role
    if (reviewer.role === 'client' && this.type !== 'client-to-freelancer') {
      throw new Error('Clients can only create client-to-freelancer reviews');
    }
    if (reviewer.role === 'freelancer' && this.type !== 'freelancer-to-client') {
      throw new Error('Freelancers can only create freelancer-to-client reviews');
    }

    next();
  } catch (error) {
    // next(error);
  }
});

// Update user's average rating after review is saved
ReviewSchema.post('save', async function() {
  const stats = await (this.constructor as any).calculateAverageRating(this.reviewee);
  if (stats) {
    await mongoose.model('User').findByIdAndUpdate(this.reviewee, {
      rating: stats.averageRating,
      totalReviews: stats.totalReviews
    });
  }
});

export const Review = mongoose.model<IReview, IReviewModel>('Review', ReviewSchema);