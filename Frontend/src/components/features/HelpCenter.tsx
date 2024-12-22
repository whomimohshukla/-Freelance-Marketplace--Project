import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiHelpCircle,
  FiMessageCircle,
  FiDollarSign,
  FiShield,
  FiUser,
  FiSettings,
  // FiCreditCard,
  FiAlertCircle,
  // FiCheckCircle,
  // FiClock,
  FiArrowRight,
  FiChevronDown,
  FiBook,
  FiLifeBuoy,
  FiMail
} from 'react-icons/fi';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  link: string;
}

interface CategoryProps {
  title: string;
  description: string;
  icon: React.ElementType;
  articles: Array<{
    title: string;
    link: string;
  }>;
}

const HelpCategory: React.FC<CategoryProps> = ({
  title,
  description,
  icon: Icon,
  articles
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="group cursor-pointer"
  >
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
      <div className="relative bg-gray-900/90 backdrop-blur-xl p-6 rounded-[11px] h-full hover:bg-gray-800/50 transition-all duration-300">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-lg bg-gray-800/50 group-hover:bg-code-green/20 transition-colors duration-300">
              <Icon className="h-6 w-6 text-code-green" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-code-green transition-colors duration-300">
              {title}
            </h3>
            <p className="text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
              {description}
            </p>
            <ul className="space-y-2">
              {articles.map((article, index) => (
                <li key={index}>
                  <Link 
                    to={article.link}
                    className="flex items-center text-gray-300 hover:text-code-green transition-colors duration-300"
                  >
                    <FiArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="text-sm">{article.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const quickLinks = [
  { icon: FiLifeBuoy, text: "24/7 Support", link: "/help" },
  { icon: FiBook, text: "Documentation", link: "/documentation" },
  { icon: FiMail, text: "Contact Us", link: "/contact" }
];

const categories = [
  {
    title: "Getting Started",
    description: "New to our platform? Start here for the basics",
    icon: FiHelpCircle,
    articles: [
      { title: "How to create an account", link: "/documentation/quick-start" },
      { title: "Complete your profile", link: "/documentation/profile-optimization" },
      { title: "Find your first project", link: "/documentation/finding-projects" },
      { title: "Platform guidelines", link: "/documentation/guidelines" }
    ]
  },
  {
    title: "Payments & Billing",
    description: "Everything about payments and transactions",
    icon: FiDollarSign,
    articles: [
      { title: "Payment methods", link: "/documentation/payment-methods" },
      { title: "Withdrawal options", link: "/documentation/payment-methods#withdrawal" },
      { title: "Transaction fees", link: "/documentation/billing" },
      { title: "Payment protection", link: "/documentation/payment-methods#protection" }
    ]
  },
  {
    title: "Account Security",
    description: "Keep your account safe and secure",
    icon: FiShield,
    articles: [
      { title: "Two-factor authentication", link: "/documentation/security#2fa" },
      { title: "Password guidelines", link: "/documentation/security#password" },
      { title: "Account recovery", link: "/documentation/security#recovery" },
      { title: "Security best practices", link: "/documentation/security#best-practices" }
    ]
  },
  {
    title: "Profile Management",
    description: "Manage and optimize your profile",
    icon: FiUser,
    articles: [
      { title: "Update profile information", link: "/documentation/profile-optimization" },
      { title: "Portfolio management", link: "/documentation/profile-optimization#portfolio" },
      { title: "Skill verification", link: "/documentation/profile-optimization#skills" },
      { title: "Profile visibility", link: "/documentation/profile-optimization#visibility" }
    ]
  },
  {
    title: "Project Management",
    description: "Handle projects efficiently",
    icon: FiSettings,
    articles: [
      { title: "Project milestones", link: "/documentation/project-management#milestones" },
      { title: "Time tracking", link: "/documentation/project-management#time-tracking" },
      { title: "File sharing", link: "/documentation/project-management#files" },
      { title: "Client communication", link: "/documentation/project-management#communication" }
    ]
  },
  {
    title: "Dispute Resolution",
    description: "Handle conflicts and issues",
    icon: FiAlertCircle,
    articles: [
      { title: "Dispute process", link: "/documentation/dispute-resolution#process" },
      { title: "Mediation services", link: "/documentation/dispute-resolution#mediation" },
      { title: "Refund policy", link: "/documentation/dispute-resolution#refunds" },
      { title: "Terms of service", link: "/documentation/terms-of-service" }
    ]
  }
];

const popularFAQs: FAQItem[] = [
  {
    question: "How do I get paid for my work?",
    answer: "Payments are processed through our secure payment system. Once a milestone is completed and approved, the payment is released to your account within 24-48 hours.",
    category: "Payments",
    link: "/documentation/payment-methods"
  },
  {
    question: "What are the platform fees?",
    answer: "We charge a 5% platform fee on all projects. This covers payment processing, platform maintenance, and support services.",
    category: "Payments",
    link: "/documentation/billing"
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team 24/7 through the help desk, live chat, or email at support@skillbridge.com",
    category: "Support",
    link: "/documentation/support"
  }
];

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      {/* Background Patterns */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-5"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] opacity-5"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            How can we help you?
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto mb-8"
          >
            Search our knowledge base or browse categories below
          </motion.p>

          {/* Quick Links */}
          <div className="flex justify-center gap-8 mb-8">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]"
              >
                <Link
                  to={link.link}
                  className="relative block bg-gray-900/90 backdrop-blur-xl p-6 rounded-[11px] hover:bg-gray-800/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-gray-800/50">
                      <link.icon className="h-6 w-6 text-code-green" />
                    </div>
                    <span className="text-white font-medium">{link.text}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto relative"
          >
            <div className="relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green/50 focus:border-transparent transition-all duration-300"
              />
            </div>
          </motion.div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {categories.map((category, index) => (
            <HelpCategory key={index} {...category} />
          ))}
        </div>

        {/* Popular FAQs */}
        <div className="max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {popularFAQs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700/50"
              >
                <button
                  onClick={() => setSelectedFAQ(selectedFAQ === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-300"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-white font-medium">{faq.question}</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-700/50 text-gray-300">
                      {faq.category}
                    </span>
                  </div>
                  <FiChevronDown
                    className={`h-5 w-5 text-gray-400 transform transition-transform duration-300 ${
                      selectedFAQ === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {selectedFAQ === index && (
                  <div className="px-6 py-4 bg-gray-800/30 border-t border-gray-700/50">
                    <p className="text-gray-300 mb-4">{faq.answer}</p>
                    <Link 
                      to={faq.link}
                      className="inline-flex items-center text-code-green hover:text-code-green/80 transition-colors duration-300"
                    >
                      <span>Read more in documentation</span>
                      <FiArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="text-center pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]"
          >
            <div className="relative bg-gray-900/90 backdrop-blur-xl p-8 rounded-[11px]">
              <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
              <p className="text-gray-400 mb-6">Our support team is available 24/7 to assist you</p>
              <Link 
                to="/contact"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-code-green text-gray-900 font-medium hover:bg-code-green/90 transition-colors duration-300"
              >
                <FiMessageCircle className="mr-2 h-5 w-5" />
                Contact Support
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
