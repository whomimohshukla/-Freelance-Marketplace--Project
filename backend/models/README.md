# Database Models for Freelancing Platform

## Core Models Structure

### 1. User Model
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['freelancer', 'client', 'admin'],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  profilePicture: String,
  joinedDate: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  }
});
```

### 2. Freelancer Profile Model
```javascript
// models/FreelancerProfile.js
const freelancerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  skills: [{
    name: String,
    yearsOfExperience: Number,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'expert']
    }
  }],
  hourlyRate: {
    amount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  availability: {
    status: {
      type: String,
      enum: ['available', 'partially-available', 'not-available']
    },
    hoursPerWeek: Number
  },
  portfolio: [{
    title: String,
    description: String,
    images: [String],
    link: String,
    technologies: [String]
  }],
  education: [{
    institution: String,
    degree: String,
    field: String,
    from: Date,
    to: Date
  }],
  workExperience: [{
    company: String,
    position: String,
    description: String,
    from: Date,
    to: Date,
    current: Boolean
  }],
  languages: [{
    name: String,
    proficiency: {
      type: String,
      enum: ['basic', 'intermediate', 'fluent', 'native']
    }
  }]
});
```

### 3. Client Profile Model
```javascript
// models/ClientProfile.js
const clientProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  company: {
    name: String,
    website: String,
    size: String,
    industry: String
  },
  projectsPosted: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  paymentMethods: [{
    type: {
      type: String,
      enum: ['credit_card', 'paypal', 'bank_transfer']
    },
    isDefault: Boolean,
    lastFour: String // For cards
  }]
});
```

### 4. Project Model
```javascript
// models/Project.js
const projectSchema = new mongoose.Schema({
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  skills: [{
    type: String,
    required: true
  }],
  budget: {
    type: {
      type: String,
      enum: ['fixed', 'hourly'],
      required: true
    },
    minAmount: Number,
    maxAmount: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  duration: {
    type: String,
    enum: ['less-than-1-month', '1-3-months', '3-6-months', 'more-than-6-months']
  },
  status: {
    type: String,
    enum: ['draft', 'open', 'in-progress', 'completed', 'cancelled'],
    default: 'draft'
  },
  proposals: [{
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    coverLetter: String,
    proposedAmount: Number,
    estimatedDuration: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected']
    },
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

### 5. Contract Model
```javascript
// models/Contract.js
const contractSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  terms: {
    amount: Number,
    paymentSchedule: {
      type: String,
      enum: ['milestone', 'weekly', 'monthly', 'on-completion']
    },
    milestones: [{
      description: String,
      amount: Number,
      dueDate: Date,
      status: {
        type: String,
        enum: ['pending', 'completed', 'paid']
      }
    }]
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'completed', 'terminated'],
    default: 'draft'
  },
  startDate: Date,
  endDate: Date
});
```

### 6. Message Model
```javascript
// models/Message.js
const messageSchema = new mongoose.Schema({
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    name: String,
    url: String,
    type: String
  }],
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: Date
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

### 7. Review Model
```javascript
// models/Review.js
const reviewSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  reviewerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: String,
  aspects: {
    communication: Number,
    quality: Number,
    expertise: Number,
    professionalism: Number,
    rehireability: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});
```

## Usage Examples

### Creating a New User
```javascript
const newUser = await User.create({
  email: 'user@example.com',
  password: hashedPassword,
  role: 'freelancer',
  name: 'John Doe'
});
```

### Creating a Freelancer Profile
```javascript
const freelancerProfile = await FreelancerProfile.create({
  userId: newUser._id,
  title: 'Full Stack Developer',
  skills: [
    { name: 'React', yearsOfExperience: 3, level: 'expert' },
    { name: 'Node.js', yearsOfExperience: 2, level: 'intermediate' }
  ],
  hourlyRate: {
    amount: 50,
    currency: 'USD'
  }
});
```

### Creating a Project
```javascript
const project = await Project.create({
  clientId: clientUser._id,
  title: 'E-commerce Website Development',
  description: 'Need a full-stack developer for building an e-commerce platform',
  category: 'Web Development',
  skills: ['React', 'Node.js', 'MongoDB'],
  budget: {
    type: 'fixed',
    minAmount: 5000,
    maxAmount: 7000,
    currency: 'USD'
  }
});
```

### Submitting a Proposal
```javascript
await Project.findByIdAndUpdate(projectId, {
  $push: {
    proposals: {
      freelancerId: freelancerUser._id,
      coverLetter: 'I am interested in your project...',
      proposedAmount: 6000,
      estimatedDuration: '2-months'
    }
  }
});
```

## Model Relationships
- User -> FreelancerProfile/ClientProfile (One-to-One)
- User -> Projects (One-to-Many)
- Project -> Proposals (One-to-Many)
- User -> Messages (One-to-Many)
- Project -> Reviews (One-to-Many)

Would you like me to:
1. Add more model examples?
2. Show how to implement specific queries?
3. Add validation methods?
4. Show how to handle file uploads?
