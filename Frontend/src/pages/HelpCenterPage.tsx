import React from 'react';
import { Link } from 'react-router-dom';

const HelpCenterPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 pt-24 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Help Center</h1>
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-4">
          <p className="text-gray-400">How can we help you?</p>
          <ul className="space-y-2">
            <li><Link to="/resources/help" className="text-code-green hover:underline">Browse FAQs</Link></li>
            <li><Link to="/contact" className="text-code-green hover:underline">Contact Support</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterPage;
