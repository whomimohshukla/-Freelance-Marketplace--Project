import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiFileText,
  FiAlertCircle,
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import projectApi, { Project, DashboardStats } from '../api/projectApi';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const response = await projectApi.getClientDashboard();
      if (response.success) {
        setStats(response.stats);
        setRecentProjects(response.recentProjects || []);
      }
    } catch (error: any) {
      console.error('Dashboard error:', error);
      toast.error(error.response?.data?.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'In Progress': 'text-blue-400 bg-blue-400/10',
      'Completed': 'text-green-400 bg-green-400/10',
      'Open': 'text-yellow-400 bg-yellow-400/10',
      'Draft': 'text-gray-400 bg-gray-400/10',
      'Cancelled': 'text-red-400 bg-red-400/10',
    };
    return colors[status] || 'text-gray-400 bg-gray-400/10';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-code-green"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Client Dashboard</h1>
          <p className="text-gray-400">Manage your projects and track progress</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-code-green/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-code-green/10 rounded-lg">
                <FiBriefcase className="w-6 h-6 text-code-green" />
              </div>
              <span className="text-2xl font-bold text-white">{stats?.totalProjects || 0}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Projects</h3>
          </motion.div>

          {/* Active Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FiClock className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats?.activeProjects || 0}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Active Projects</h3>
          </motion.div>

          {/* Completed Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-green-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <FiCheckCircle className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">{stats?.completedProjects || 0}</span>
            </div>
            <h3 className="text-gray-400 text-sm">Completed Projects</h3>
          </motion.div>

          {/* Total Spent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-yellow-500/50 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <FiDollarSign className="w-6 h-6 text-yellow-400" />
              </div>
              <span className="text-2xl font-bold text-white">
                {formatCurrency(stats?.totalSpent || 0)}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm">Total Spent</h3>
          </motion.div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <FiUsers className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-semibold">Total Proposals</h3>
            </div>
            <p className="text-3xl font-bold text-white">{stats?.totalProposals || 0}</p>
            {stats?.pendingProposals && stats.pendingProposals > 0 && (
              <p className="text-sm text-yellow-400 mt-2">
                {stats.pendingProposals} pending review
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <FiTrendingUp className="w-5 h-5 text-code-green" />
              <h3 className="text-white font-semibold">Avg Project Value</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(stats?.averageProjectValue || 0)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <FiAlertCircle className="w-5 h-5 text-orange-400" />
              <h3 className="text-white font-semibold">Pending Payments</h3>
            </div>
            <p className="text-3xl font-bold text-white">
              {formatCurrency(stats?.pendingPayments || 0)}
            </p>
          </motion.div>
        </div>

        {/* Recent Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <FiFileText className="w-6 h-6 text-code-green" />
              Recent Projects
            </h2>
            <button
              onClick={() => navigate('/client/projects')}
              className="px-4 py-2 bg-code-green/10 text-code-green rounded-lg hover:bg-code-green/20 transition-colors"
            >
              View All
            </button>
          </div>

          {recentProjects.length === 0 ? (
            <div className="text-center py-12">
              <FiBriefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No projects yet</p>
              <button
                onClick={() => navigate('/projects/create')}
                className="mt-4 px-6 py-3 bg-code-green text-gray-900 rounded-lg hover:bg-code-green/90 transition-colors font-semibold"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => navigate(`/projects/${project._id}`)}
                  className="bg-gray-700/30 border border-gray-600 rounded-lg p-4 hover:border-code-green/50 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-1">{project.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-400">
                      <FiDollarSign className="w-4 h-4" />
                      <span>
                        {formatCurrency(project.budget.minAmount)} -{' '}
                        {formatCurrency(project.budget.maxAmount)}
                      </span>
                    </div>

                    {project.selectedFreelancer && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <FiUsers className="w-4 h-4" />
                        <span>
                          {project.selectedFreelancer.firstName}{' '}
                          {project.selectedFreelancer.lastName}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-gray-400">
                      <FiClock className="w-4 h-4" />
                      <span>{project.duration}</span>
                    </div>
                  </div>

                  {project.progress && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-400">Progress</span>
                        <span className="text-code-green font-medium">
                          {project.progress.percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-600 rounded-full h-2">
                        <div
                          className="bg-code-green h-2 rounded-full transition-all"
                          style={{ width: `${project.progress.percentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ClientDashboard;
