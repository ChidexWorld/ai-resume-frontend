import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Download,
  RefreshCw,
  Loader2,
  Users,
  Briefcase,
  FileText,
  Target,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useGetAnalyticsTrends, useGetSystemStats } from '../../hooks/useAdmin';

export const Analytics: React.FC = () => {
  const [days, setDays] = useState(30);

  // API Hooks
  const { data: trendsData, isLoading: trendsLoading, refetch, isFetching } = useGetAnalyticsTrends({ days });
  const { data: statsData, isLoading: statsLoading } = useGetSystemStats();

  // Handle export (mock implementation)
  const handleExport = () => {
    const data = {
      trends: trendsData,
      stats: statsData,
      generated_at: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics_report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Calculate growth percentages
  const calculateGrowth = (data: Array<{ count: number }>) => {
    if (!data || data.length < 2) return 0;
    const recent = data.slice(-7);
    const previous = data.slice(-14, -7);

    const recentSum = recent.reduce((sum, item) => sum + item.count, 0);
    const previousSum = previous.reduce((sum, item) => sum + item.count, 0);

    if (previousSum === 0) return 100;
    return ((recentSum - previousSum) / previousSum * 100).toFixed(1);
  };

  const registrationGrowth = trendsData?.trends.daily_registrations
    ? calculateGrowth(trendsData.trends.daily_registrations)
    : 0;

  const jobGrowth = trendsData?.trends.daily_job_postings
    ? calculateGrowth(trendsData.trends.daily_job_postings)
    : 0;

  const applicationGrowth = trendsData?.trends.daily_applications
    ? calculateGrowth(trendsData.trends.daily_applications)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
              Analytics & Reports
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive system analytics and performance metrics
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </motion.div>

      {/* Time Range Selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <Calendar className="w-5 h-5 text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300 font-medium">Time Period:</span>
          <div className="flex gap-2">
            {[7, 14, 30, 90, 180, 365].map((period) => (
              <button
                key={period}
                onClick={() => setDays(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  days === period
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {period}d
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Growth Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        {[
          { label: 'User Growth', value: registrationGrowth, icon: Users, color: 'blue' },
          { label: 'Job Growth', value: jobGrowth, icon: Briefcase, color: 'green' },
          { label: 'Application Growth', value: applicationGrowth, icon: FileText, color: 'purple' },
          { label: 'Match Success', value: statsData?.average_match_score || 0, icon: Target, color: 'orange' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'purple' ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'purple' ? 'text-purple-600' :
                  'text-orange-600'
                }`} />
              </div>
              <TrendingUp className={`w-5 h-5 ${Number(stat.value) >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
              {Number(stat.value) >= 0 ? '+' : ''}{stat.value}%
            </p>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      {trendsLoading || statsLoading ? (
        <div className="flex items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading analytics...</span>
        </div>
      ) : (
        <>
          {/* User Registrations Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              User Registrations Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trendsData?.trends.daily_registrations || []}>
                <defs>
                  <linearGradient id="colorRegistrations" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorRegistrations)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Job Postings & Applications Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-green-600" />
              Jobs & Applications Comparison
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                  data={trendsData?.trends.daily_job_postings || []}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  data={trendsData?.trends.daily_job_postings || []}
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Job Postings"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  data={trendsData?.trends.daily_applications || []}
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Applications"
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Match Success Rate Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
          >
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-600" />
              Match Success Rate
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendsData?.trends.daily_matches || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: '#9ca3af' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#f3f4f6'
                  }}
                />
                <Legend />
                <Bar dataKey="total_matches" fill="#6366f1" name="Total Matches" />
                <Bar dataKey="high_score_matches" fill="#10b981" name="High Score Matches" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Summary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* Overall Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Overall Statistics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Total Users</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100">
                    {statsData?.total_users || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Active Jobs</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100">
                    {statsData?.active_job_postings || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Total Applications</span>
                  <span className="font-bold text-gray-800 dark:text-gray-100">
                    {statsData?.total_applications || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">Average Match Score</span>
                  <span className="font-bold text-indigo-600">
                    {statsData?.average_match_score?.toFixed(1) || 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* This Week Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                This Week
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">New Users</span>
                  <span className="font-bold text-blue-600">
                    +{statsData?.new_users_this_week || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">New Resumes</span>
                  <span className="font-bold text-green-600">
                    +{statsData?.new_resumes_this_week || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">New Applications</span>
                  <span className="font-bold text-purple-600">
                    +{statsData?.new_applications_this_week || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-300">High Score Matches</span>
                  <span className="font-bold text-orange-600">
                    {statsData?.high_score_matches || 0}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default Analytics;
