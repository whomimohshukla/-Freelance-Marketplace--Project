import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

interface HelpCategoryProps {
  title: string;
  description: string;
  icon: React.ElementType;
  articles: string[];
}

const HelpCategory: React.FC<HelpCategoryProps> = ({
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
                <li 
                  key={index} 
                  className="flex items-center text-gray-300 hover:text-code-green transition-colors duration-300"
                >
                  <FiArrowRight className="h-4 w-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="text-sm">{article}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default HelpCategory;
