import React from 'react';
import { motion } from 'framer-motion';

const FullPageLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="mb-8 flex items-center gap-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-8 w-8 text-code-green"
        >
          <path d="M12 2 2 7l10 5 10-5-10-5Zm0 7L2 14l10 5 10-5-10-5Z" />
        </svg>
        <span className="text-2xl font-bold tracking-wide">SkillBridge</span>
      </motion.div>

      {/* Spinner */}
      <motion.div
        className="relative h-14 w-14"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-[6px] border-code-green/40 border-t-code-green animate-spin" />
        <div className="absolute inset-2 rounded-full border-[6px] border-code-green/20 border-b-code-green animate-spin-reverse" />
      </motion.div>

      <style>{`
        @keyframes spin-reverse { to { transform: rotate(-360deg); } }
        .animate-spin-reverse { animation: spin-reverse 1.6s linear infinite; }
      `}</style>
    </div>
  );
};

export default FullPageLoader;
