import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiCode,
  FiDollarSign,
  FiUsers,
  FiStar,
  FiTrendingUp,
  FiShield,
  FiBook,
  FiAward,
  FiMessageSquare,
  FiTarget,
  FiArrowRight
} from 'react-icons/fi';

interface GuideCardProps {
  title: string;
  description: string;
  icon: React.ElementType;
  category: string;
  readTime: string;
  path: string;
}

const GuideCard: React.FC<GuideCardProps> = ({
  title,
  description,
  icon: Icon,
  category,
  readTime,
  path
}) => (
  <Link to={path}>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]">
        <div className="relative bg-gray-900/90 backdrop-blur-xl p-6 rounded-[11px] h-full">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="p-3 rounded-lg bg-gray-800/50 group-hover:bg-code-green/20 transition-colors duration-300">
                <Icon className="h-6 w-6 text-code-green" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-code-green">{category}</span>
                <span className="text-sm text-gray-400">{readTime}</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-code-green transition-colors duration-300">
                {title}
              </h3>
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

const guides = [
  {
    title: "Getting Started with Freelancing",
    description: "Essential guide for new freelancers on our platform",
    icon: FiStar,
    category: "Beginner",
    readTime: "5 min read",
    path: "/resources/guides/getting-started"
  },
  {
    title: "Creating a Winning Profile",
    description: "Stand out with a professional freelancer profile",
    icon: FiAward,
    category: "Profile",
    readTime: "8 min read",
    path: "/resources/guides/profile-creation"
  },
  {
    title: "Finding the Right Projects",
    description: "How to search and apply for projects that match your skills",
    icon: FiTarget,
    category: "Projects",
    readTime: "6 min read",
    path: "/resources/guides/finding-projects"
  },
  {
    title: "Proposal Writing Guide",
    description: "Write proposals that win clients and projects",
    icon: FiTrendingUp,
    category: "Skills",
    readTime: "10 min read",
    path: "/resources/guides/proposal-writing"
  },
  {
    title: "Setting Your Rates",
    description: "How to price your services competitively",
    icon: FiDollarSign,
    category: "Business",
    readTime: "7 min read",
    path: "/resources/guides/pricing-guide"
  },
  {
    title: "Client Communication",
    description: "Best practices for professional client interactions",
    icon: FiMessageSquare,
    category: "Communication",
    readTime: "6 min read",
    path: "/resources/guides/client-communication"
  },
  {
    title: "Project Management Tips",
    description: "Deliver projects successfully and on time",
    icon: FiCode,
    category: "Management",
    readTime: "8 min read",
    path: "/resources/guides/project-management"
  },
  {
    title: "Building Long-term Relationships",
    description: "Turn one-time clients into recurring business",
    icon: FiUsers,
    category: "Growth",
    readTime: "5 min read",
    path: "/resources/guides/client-relationships"
  }
];

const GuideComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = ['all', ...Array.from(new Set(guides.map(guide => guide.category)))];

  const filteredGuides = selectedCategory === 'all'
    ? guides
    : guides.filter(guide => guide.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-900 pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold text-white mb-4"
          >
            Freelancer Resources & Guides
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Everything you need to know to succeed as a freelancer on our platform
          </motion.p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                selectedCategory === category
                  ? 'bg-code-green text-gray-900'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-code-green/20 hover:text-code-green'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredGuides.map((guide) => (
            <GuideCard key={guide.path} {...guide} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block"
          >
            <Link
              to="/become-freelancer"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-code-green text-gray-900 font-medium hover:bg-code-green/90 transition-colors duration-300"
            >
              Start Your Freelancing Journey
              <FiArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default GuideComponent;
