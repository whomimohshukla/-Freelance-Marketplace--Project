import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface FAQSectionProps {
  faqs: FAQItem[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [selectedFAQ, setSelectedFAQ] = useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto mb-16">
      <h2 className="text-2xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
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
              <div className="px-6 py-4 text-gray-300 bg-gray-800/30 border-t border-gray-700/50">
                {faq.answer}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
