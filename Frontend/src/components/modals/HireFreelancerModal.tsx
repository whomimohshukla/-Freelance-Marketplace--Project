import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiDollarSign, FiCalendar, FiAlertCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import hireApi from '../../api/hireApi';

interface HireFreelancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  freelancerId: string;
  freelancerName: string;
  hourlyRate?: number;
}

const HireFreelancerModal = ({
  isOpen,
  onClose,
  freelancerId,
  freelancerName,
  hourlyRate,
}: HireFreelancerModalProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budgetType: 'Fixed' as 'Fixed' | 'Hourly' | 'Milestone-based',
    budgetAmount: hourlyRate ? hourlyRate * 40 : 1000,
    duration: '1-3 months' as string,
    startDate: '',
    skills: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.budgetAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      // Check both localStorage and sessionStorage for token
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (!token) {
        toast.error('Please login to hire freelancers');
        return;
      }

      const response = await hireApi.sendInvitation({
        freelancerId,
        title: formData.title,
        description: formData.description,
        budgetType: formData.budgetType,
        budgetAmount: Number(formData.budgetAmount),
        duration: formData.duration,
        startDate: formData.startDate || undefined,
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()) : [],
        message: formData.message,
      });

      if (response.success) {
        toast.success('Hire invitation sent successfully!');
        onClose();
        // Reset form
        setFormData({
          title: '',
          description: '',
          budgetType: 'Fixed',
          budgetAmount: hourlyRate ? hourlyRate * 40 : 1000,
          duration: '1-3 months',
          startDate: '',
          skills: '',
          message: '',
        });
      }
    } catch (error: any) {
      console.error('Hire invitation error:', error);
      toast.error(error.response?.data?.error || 'Failed to send hire invitation');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] border border-gray-700/50 pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Scrollable Content with Custom Scrollbar */}
              <div className="max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="sticky top-0 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 p-6 flex items-center justify-between z-10">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Hire {freelancerName}</h2>
                    <p className="text-gray-400 text-sm mt-1">Send a project invitation</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <FiX className="w-6 h-6 text-gray-400 hover:text-white" />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                  {/* Project Title */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Build a responsive e-commerce website"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-code-green focus:ring-2 focus:ring-code-green/20 transition-all"
                      required
                    />
                  </div>

                  {/* Project Description */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Project Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your project requirements, goals, and expectations..."
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-code-green focus:ring-2 focus:ring-code-green/20 transition-all resize-none"
                      required
                    />
                  </div>

                  {/* Budget Type and Amount */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Budget Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="budgetType"
                        value={formData.budgetType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-code-green focus:ring-2 focus:ring-code-green/20 transition-all"
                      >
                        <option value="Fixed">Fixed Price</option>
                        <option value="Hourly">Hourly Rate</option>
                        <option value="Milestone-based">Milestone Based</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Budget Amount (USD) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiDollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="number"
                          name="budgetAmount"
                          value={formData.budgetAmount}
                          onChange={handleChange}
                          min="1"
                          step="1"
                          placeholder="1000"
                          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-code-green focus:ring-2 focus:ring-code-green/20 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Duration and Start Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Project Duration <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="duration"
                        value={formData.duration}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-code-green focus:ring-2 focus:ring-code-green/20 transition-all"
                      >
                        <option value="Less than 1 month">Less than 1 month</option>
                        <option value="1-3 months">1-3 months</option>
                        <option value="3-6 months">3-6 months</option>
                        <option value="More than 6 months">More than 6 months</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">
                        Preferred Start Date
                      </label>
                      <div className="relative">
                        <FiCalendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                          type="date"
                          name="startDate"
                          value={formData.startDate}
                          onChange={handleChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-code-green focus:ring-2 focus:ring-code-green/20 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Skills Required */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Skills Required
                    </label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g., React, Node.js, MongoDB (comma-separated)"
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-code-green focus:ring-2 focus:ring-code-green/20 transition-all"
                    />
                  </div>

                  {/* Personal Message */}
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Message to Freelancer
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Add a personal message explaining why you'd like to work with this freelancer..."
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-code-green focus:ring-2 focus:ring-code-green/20 transition-all resize-none"
                    />
                  </div>

                  {/* Info Banner */}
                  <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <FiAlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-300">
                      <p className="font-medium text-blue-400 mb-1">How it works:</p>
                      <ul className="list-disc list-inside space-y-1 text-gray-400">
                        <li>Your invitation will be sent to {freelancerName}</li>
                        <li>They can accept, decline, or negotiate the terms</li>
                        <li>Once accepted, you can start working together</li>
                        <li>Payment will be held in escrow for security</li>
                      </ul>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-6 py-3 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-colors font-medium"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-3 bg-code-green text-gray-900 rounded-xl hover:bg-code-green/90 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Invitation'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HireFreelancerModal;
