import React from 'react';
import { motion } from 'framer-motion';
import { FiCopy, FiCheck } from 'react-icons/fi';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="absolute right-4 top-4">
        <button
          onClick={handleCopy}
          className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors duration-200"
        >
          {copied ? (
            <FiCheck className="h-4 w-4 text-code-green" />
          ) : (
            <FiCopy className="h-4 w-4 text-gray-400 group-hover:text-white" />
          )}
        </button>
      </div>
      <pre className="p-4 bg-gray-800/30 rounded-xl overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
};

interface DocContentProps {
  title: string;
  description?: string;
  content: React.ReactNode;
}

const DocContent: React.FC<DocContentProps> = ({ title, description, content }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex-1 overflow-y-auto px-8 py-6"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4">{title}</h1>
        {description && (
          <p className="text-gray-400 text-lg mb-8">{description}</p>
        )}
        <div className="prose prose-invert max-w-none">
          {content}
        </div>
      </div>
    </motion.div>
  );
};

export { DocContent, CodeBlock };
