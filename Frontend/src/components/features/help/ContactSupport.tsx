import React from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle } from 'react-icons/fi';

const ContactSupport: React.FC = () => (
  <div className="text-center pb-20">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl bg-gradient-to-r from-code-green/20 to-transparent p-[1px]"
    >
      <div className="relative bg-gray-900/90 backdrop-blur-xl p-8 rounded-[11px]">
        <h3 className="text-xl font-bold text-white mb-2">Still need help?</h3>
        <p className="text-gray-400 mb-6">Our support team is available 24/7 to assist you</p>
        <button className="inline-flex items-center px-6 py-3 rounded-lg bg-code-green text-gray-900 font-medium hover:bg-code-green/90 transition-colors duration-300">
          <FiMessageCircle className="mr-2 h-5 w-5" />
          Contact Support
        </button>
      </div>
    </motion.div>
  </div>
);

export default ContactSupport;
