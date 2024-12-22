import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCreditCard, FiLock, FiDollarSign, FiCheckCircle, FiClock, FiAlertCircle, FiShield } from 'react-icons/fi';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  expiryDate?: string;
  bankName?: string;
  cardType?: string;
  icon?: string;
}

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  recipient: string;
  recipientAvatar: string;
}

const SecurePayments = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);

  // Mock payment methods
  const paymentMethods: PaymentMethod[] = [
    {
      id: '1',
      type: 'card',
      last4: '4242',
      expiryDate: '12/24',
      cardType: 'Visa',
      icon: '💳'
    },
    {
      id: '2',
      type: 'card',
      last4: '8888',
      expiryDate: '03/25',
      cardType: 'Mastercard',
      icon: '💳'
    },
    {
      id: '3',
      type: 'bank',
      last4: '1234',
      bankName: 'Chase Bank',
      icon: '🏦'
    }
  ];

  // Mock transactions
  const transactions: Transaction[] = [
    {
      id: '1',
      date: '2024-01-20',
      amount: 500,
      status: 'completed',
      description: 'Website Development - Milestone 1',
      recipient: 'Alice Johnson',
      recipientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
    },
    {
      id: '2',
      date: '2024-01-15',
      amount: 750,
      status: 'pending',
      description: 'Mobile App Design',
      recipient: 'Bob Smith',
      recipientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
    },
    {
      id: '3',
      date: '2024-01-10',
      amount: 250,
      status: 'failed',
      description: 'Logo Design Project',
      recipient: 'Carol White',
      recipientAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol'
    }
  ];

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual payment processing
    console.log('Processing payment:', { amount, selectedPaymentMethod, note });
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Secure Payments
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Send and receive payments securely with our encrypted payment system.
              All transactions are protected by industry-leading security measures.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Amount Input Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <FiDollarSign className="mr-2" />
                  Payment Amount
                </h2>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400 text-xl" />
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-4 bg-gray-900/50 text-white text-2xl rounded-xl border border-gray-700/50 focus:border-code-green focus:ring-1 focus:ring-code-green focus:outline-none"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-gray-400 mb-2">Payment Note</label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add a note about this payment..."
                    className="w-full px-4 py-3 bg-gray-900/50 text-white rounded-xl border border-gray-700/50 focus:border-code-green focus:ring-1 focus:ring-code-green focus:outline-none resize-none"
                    rows={3}
                  />
                </div>
              </motion.div>

              {/* Payment Methods */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <FiCreditCard className="mr-2" />
                    Payment Method
                  </h2>
                  <button
                    onClick={() => setShowAddCard(true)}
                    className="text-code-green hover:text-code-green/80 transition-colors"
                  >
                    + Add New
                  </button>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((method) => (
                    <motion.div
                      key={method.id}
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setSelectedPaymentMethod(method)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedPaymentMethod?.id === method.id
                          ? 'border-code-green bg-gray-700/30'
                          : 'border-gray-700/50 hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {method.type === 'card' 
                              ? `${method.cardType} ending in ${method.last4}`
                              : `${method.bankName} (${method.last4})`
                            }
                          </p>
                          {method.type === 'card' && (
                            <p className="text-gray-400 text-sm">
                              Expires {method.expiryDate}
                            </p>
                          )}
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPaymentMethod?.id === method.id
                            ? 'border-code-green bg-code-green'
                            : 'border-gray-600'
                        }`} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={handlePayment}
                disabled={!selectedPaymentMethod || !amount}
                className="w-full px-6 py-4 bg-code-green text-gray-900 font-medium rounded-xl hover:bg-code-green/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pay Now
              </motion.button>
            </div>

            {/* Right Side */}
            <div className="space-y-6">
              {/* Transaction History */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
              >
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                  <FiClock className="mr-2" />
                  Recent Transactions
                </h2>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="p-4 rounded-xl bg-gray-900/50 border border-gray-700/50 hover:border-gray-600 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={transaction.recipientAvatar}
                          alt={transaction.recipient}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-white font-medium">
                                ${transaction.amount.toFixed(2)}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {transaction.description}
                              </p>
                            </div>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                transaction.status === 'completed'
                                  ? 'bg-green-900/50 text-green-400'
                                  : transaction.status === 'pending'
                                  ? 'bg-yellow-900/50 text-yellow-400'
                                  : 'bg-red-900/50 text-red-400'
                              }`}
                            >
                              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center mt-2 text-sm">
                            <p className="text-gray-400">
                              To: {transaction.recipient}
                            </p>
                            <p className="text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
              >
                <h3 className="text-white font-medium mb-4 flex items-center">
                  <FiShield className="mr-2" />
                  Security Guarantee
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start space-x-3">
                    <FiLock className="text-code-green mt-1" />
                    <p className="text-gray-400">
                      End-to-end encryption for all transactions
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiCheckCircle className="text-code-green mt-1" />
                    <p className="text-gray-400">
                      Fraud detection and prevention
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <FiAlertCircle className="text-code-green mt-1" />
                    <p className="text-gray-400">
                      24/7 fraud monitoring and alerts
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Card Modal */}
      <AnimatePresence>
        {showAddCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setShowAddCard(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-2xl p-6 w-full max-w-md mx-4"
            >
              <h2 className="text-xl font-bold text-white mb-4">Add Payment Method</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-400 mb-2">Card Number</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-xl border border-gray-700 focus:border-code-green focus:ring-1 focus:ring-code-green focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-xl border border-gray-700 focus:border-code-green focus:ring-1 focus:ring-code-green focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-2 bg-gray-900 text-white rounded-xl border border-gray-700 focus:border-code-green focus:ring-1 focus:ring-code-green focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Name on Card</label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-2 bg-gray-900 text-white rounded-xl border border-gray-700 focus:border-code-green focus:ring-1 focus:ring-code-green focus:outline-none"
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddCard(false)}
                    className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-code-green text-gray-900 rounded-xl hover:bg-code-green/90 transition-colors"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SecurePayments;
