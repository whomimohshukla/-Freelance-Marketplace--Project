import {
  FiHelpCircle,
  FiDollarSign,
  FiShield,
  FiUser,
  FiSettings,
  FiAlertCircle,
} from 'react-icons/fi';

export interface Category {
  title: string;
  description: string;
  icon: React.ElementType;
  articles: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const categories: Category[] = [
  {
    title: "Getting Started",
    description: "New to our platform? Start here for the basics",
    icon: FiHelpCircle,
    articles: [
      "How to create an account",
      "Complete your profile",
      "Find your first project",
      "Platform guidelines"
    ]
  },
  {
    title: "Payments & Billing",
    description: "Everything about payments and transactions",
    icon: FiDollarSign,
    articles: [
      "Payment methods",
      "Withdrawal options",
      "Transaction fees",
      "Payment protection"
    ]
  },
  {
    title: "Account Security",
    description: "Keep your account safe and secure",
    icon: FiShield,
    articles: [
      "Two-factor authentication",
      "Password guidelines",
      "Account recovery",
      "Security best practices"
    ]
  },
  {
    title: "Profile Management",
    description: "Manage and optimize your profile",
    icon: FiUser,
    articles: [
      "Update profile information",
      "Portfolio management",
      "Skill verification",
      "Profile visibility"
    ]
  },
  {
    title: "Project Management",
    description: "Handle projects efficiently",
    icon: FiSettings,
    articles: [
      "Project milestones",
      "Time tracking",
      "File sharing",
      "Client communication"
    ]
  },
  {
    title: "Dispute Resolution",
    description: "Handle conflicts and issues",
    icon: FiAlertCircle,
    articles: [
      "Dispute process",
      "Mediation services",
      "Refund policy",
      "Terms of service"
    ]
  }
];

export const popularFAQs: FAQItem[] = [
  {
    question: "How do I get paid for my work?",
    answer: "Payments are processed through our secure payment system. Once a milestone is completed and approved, the payment is released to your account within 24-48 hours.",
    category: "Payments"
  },
  {
    question: "What are the platform fees?",
    answer: "We charge a 5% platform fee on all projects. This covers payment processing, platform maintenance, and support services.",
    category: "Payments"
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team 24/7 through the help desk, live chat, or email at support@skillbridge.com",
    category: "Support"
  }
];
