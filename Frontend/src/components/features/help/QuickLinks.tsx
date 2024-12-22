import React from 'react';
import { motion } from 'framer-motion';
import { FiLifeBuoy, FiBook, FiMail } from 'react-icons/fi';

interface QuickLink {
  icon: React.ElementType;
  text: string;
  link: string;
}

const quickLinks: QuickLink[] = [
  { icon: FiLifeBuoy, text: "24/7 Support", link: "#" },
  { icon: FiBook, text: "Documentation", link: "#" },
  { icon: FiMail, text: "Contact Us", link: "#" }
];

const QuickLinks: React.FC = () => (
  <div className="flex justify-center gap-8 mb-8">
    {quickLinks.map((link, index) => (
      <motion.a
        key={index}
        href={link.link}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + index * 0.1 }}
        className="flex items-center gap-2 text-gray-400 hover:text-code-green transition-colors duration-300"
      >
        <link.icon className="h-5 w-5" />
        <span>{link.text}</span>
      </motion.a>
    ))}
  </div>
);

export default QuickLinks;
