// Documentation Types
export interface DocSection {
  title: string;
  items: DocItem[];
}

export interface DocItem {
  title: string;
  path: string;
  content: React.ReactNode;
}

export interface DocPage {
  title: string;
  description?: string;
  content: React.ReactNode;
}

// Project Types
export interface ProjectMatch {
  projectId: string;
  matchScore: number; // 0-100
  matchFactors: {
    skillMatch: number;
    experienceMatch: number;
    rateMatch: number;
    availabilityMatch: number;
  };
  recommendations: {
    title: string;
    reason: string;
  }[];
}

// User Types
export interface UserRegistration {
  name: string;
  email: string;
  password: string;
  accountType: 'freelancer' | 'client';
}

// Payment Types
export interface PaymentProcess {
  initiateEscrow: (amount: number) => Promise<string>;
  releasePayment: (escrowId: string) => Promise<void>;
  refundPayment: (escrowId: string, reason: string) => Promise<void>;
  getTransactionHistory: () => Promise<Transaction[]>;
  calculateFees: (amount: number) => {
    platformFee: number;
    processingFee: number;
    totalFee: number;
    netAmount: number;
  };
}

export interface Transaction {
  id: string;
  type: 'escrow' | 'release' | 'refund';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
}
