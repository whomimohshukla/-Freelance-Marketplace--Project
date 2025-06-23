import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { forgotPassword } from '../../api/auth';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const { data } = await forgotPassword(email);
      if (data.success) {
        setMessage('Password reset link sent! Check your inbox.');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* subtle decorative backgrounds reused from Login */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#00f5c410,transparent_50%)]" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:64px] bg-opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/95 to-gray-900/50" />
      </div>

      <div className="relative max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-800/50"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Forgot Password</h2>
            <p className="text-gray-400 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-code-green focus:border-transparent transition-all duration-200"
                placeholder="name@company.com"
              />
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 rounded-xl text-black font-semibold bg-code-green hover:bg-code-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-code-green focus:ring-offset-gray-900 transition-all duration-200"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            {message && <p className="text-green-500 text-sm text-center mt-2">{message}</p>}
            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
          </form>

          <div className="mt-6 text-center">
            <Link to="/login" className="text-sm text-code-green hover:text-code-green/90 transition-colors">
              Back to sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPassword;
