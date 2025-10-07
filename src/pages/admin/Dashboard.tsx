import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  FileText,
  Briefcase,
  Target,
  TrendingUp,
  Shield,
  Activity,
  AlertTriangle,
  BarChart3,
  Eye,
  Settings,
  Database,
  Loader2,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import {
  useGetSystemStats,
  useGetUsers,
  useGetContentForModeration,
  useGetAnalyticsTrends,
} from '../../hooks/useAdmin';
import { StatsCard, ContentModerationCard } from '../../components/admin';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();

  // API Queries
  const { data: systemStats, isLoading: statsLoading } = useGetSystemStats();
  const { data: users, isLoading: usersLoading } = useGetUsers({ limit: 10 });
  const { data: contentModeration, isLoading: moderationLoading } =
    useGetContentForModeration({
      content_type: 'resumes',
      flagged_only: false,
      limit: 5,
    });
  const { data: analyticsTrends, isLoading: trendsLoading } =
    useGetAnalyticsTrends({ days: 7 });

  const stats = [
    {
      icon: Users,
      label: 'Total Users',
      value: statsLoading ? '...' : (systemStats?.total_users || 0).toString(),
      change: `+${systemStats?.new_users_this_week || 0} this week`,
      changeType: 'positive' as const,
      color: 'blue' as const,
    },
    {
      icon: Briefcase,
      label: 'Job Postings',
      value: statsLoading ? '...' : (systemStats?.total_job_postings || 0).toString(),
      change: `${systemStats?.active_job_postings || 0} active`,
      changeType: 'neutral' as const,
      color: 'green' as const,
    },
    {
      icon: FileText,
      label: 'Resumes',
      value: statsLoading ? '...' : (systemStats?.total_resumes || 0).toString(),
      change: `${systemStats?.analyzed_resumes || 0} analyzed`,
      changeType: 'neutral' as const,
      color: 'purple' as const,
    },
    {
      icon: Target,
      label: 'Applications',
      value: statsLoading ? '...' : (systemStats?.total_applications || 0).toString(),
      change: `${systemStats?.pending_applications || 0} pending`,
      changeType: 'neutral' as const,
      color: 'orange' as const,
    },
  ];

  const systemHealth = [
    {
      metric: 'Total Matches',
      value: systemStats?.total_matches?.toString() || '0',
      status: 'healthy',
      icon: Activity,
    },
    {
      metric: 'High Score Matches',
      value: systemStats?.high_score_matches?.toString() || '0',
      status: 'healthy',
      icon: TrendingUp,
    },
    {
      metric: 'Voice Analyses',
      value: `${systemStats?.completed_voice_analyses || 0}/${systemStats?.total_voice_analyses || 0}`,
      status:
        systemStats?.completed_voice_analyses === systemStats?.total_voice_analyses
          ? 'healthy'
          : 'warning',
      icon: Database,
    },
    {
      metric: 'Match Score Avg',
      value: `${systemStats?.average_match_score || 0}%`,
      status: (systemStats?.average_match_score || 0) >= 75 ? 'healthy' : 'warning',
      icon: Target,
    },
  ];

  // Generate recent activities from real user data
  const recentActivities =
    users?.slice(0, 4).map((userResponse, index) => ({
      id: userResponse.user.id,
      type:
        userResponse.user.user_type === 'employee'
          ? 'employee_activity'
          : 'employer_activity',
      description:
        userResponse.user.user_type === 'employee'
          ? `Employee: ${userResponse.activity_summary.resume_count || 0} resumes, ${
              userResponse.activity_summary.application_count || 0
            } applications`
          : `Employer: ${userResponse.activity_summary.job_posting_count || 0} jobs, ${
              userResponse.activity_summary.received_applications || 0
            } applications`,
      user: `${userResponse.user.first_name} ${userResponse.user.last_name} (${userResponse.user.email})`,
      timestamp: new Date(userResponse.user.created_at).toLocaleDateString(),
      icon: userResponse.user.user_type === 'employee' ? Users : Briefcase,
      color: userResponse.user.user_type === 'employee' ? 'blue' : 'green',
      status: userResponse.account_status,
    })) || [];

  // Generate content moderation queue from real data
  const contentModerationQueue =
    contentModeration?.items?.slice(0, 3).map((item) => ({
      id: item.id,
      type: contentModeration.content_type,
      content: item.title || `${contentModeration.content_type} #${item.id}`,
      status: item.status || 'pending',
      flagged_by: 'System',
      priority: (item.status === 'failed' ? 'high' : 'medium') as 'high' | 'medium' | 'low',
      created_at: item.created_at,
    })) || [];

  const handleApprove = (id: number) => {
    toast.success(`Item #${id} approved`);
  };

  const handleReject = (id: number) => {
    toast.error(`Item #${id} rejected`);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard 🛡️</h1>
            <p className="mt-2 text-indigo-100">
              System overview and management portal. Welcome, {user?.first_name}!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
              <Shield className="w-8 h-8 text-white mb-2" />
              <p className="text-sm">System Status</p>
              <p className="text-2xl font-bold">99.9%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatsCard
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            color={stat.color}
            delay={index * 0.1}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Health */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              System Health
            </h2>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {systemHealth.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
                      item.status === 'healthy'
                        ? 'bg-green-100 dark:bg-green-900/30'
                        : item.status === 'warning'
                        ? 'bg-yellow-100 dark:bg-yellow-900/30'
                        : 'bg-red-100 dark:bg-red-900/30'
                    }`}
                  >
                    <item.icon
                      className={`w-4 h-4 ${
                        item.status === 'healthy'
                          ? 'text-green-600 dark:text-green-400'
                          : item.status === 'warning'
                          ? 'text-yellow-600 dark:text-yellow-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                      {item.metric}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                    {item.value}
                  </p>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      item.status === 'healthy'
                        ? 'bg-green-500'
                        : item.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Recent Activity
            </h2>
            <Eye className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {usersLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  Loading activities...
                </span>
              </div>
            ) : recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <div
                    className={`p-2 rounded-lg ${
                      activity.color === 'blue'
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : 'bg-green-100 dark:bg-green-900/30'
                    }`}
                  >
                    <activity.icon
                      className={`w-4 h-4 ${
                        activity.color === 'blue'
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-green-600 dark:text-green-400'
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-gray-100 text-sm">
                      {activity.description}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {activity.user}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Joined: {activity.timestamp}
                    </p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        activity.status === 'active'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No recent user activity</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Content Moderation & Analytics */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Content Moderation Queue */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Moderation Queue
            </h2>
            <AlertTriangle className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {moderationLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                <span className="ml-2 text-gray-500 dark:text-gray-400">
                  Loading content...
                </span>
              </div>
            ) : contentModerationQueue.length > 0 ? (
              contentModerationQueue.map((item) => (
                <ContentModerationCard
                  key={item.id}
                  item={item}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))
            ) : (
              <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No content requiring moderation</p>
                <p className="text-xs mt-1">All content is currently clean</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* System Analytics */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Analytics Overview
            </h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          {statsLoading || trendsLoading ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
              <span className="ml-2 text-gray-500 dark:text-gray-400">
                Loading analytics...
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Average Match Score
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {systemStats?.average_match_score?.toFixed(1) || 0}%
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Applications per Job
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {systemStats?.average_applications_per_job?.toFixed(1) || 0}
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  High Score Matches
                </p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {systemStats?.high_score_matches || 0}
                </p>
              </div>
              <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  Weekly Trend
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-100">
                  {systemStats?.new_resumes_this_week || 0} resumes,{' '}
                  {systemStats?.new_applications_this_week || 0} applications
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid md:grid-cols-4 gap-4"
      >
        <Link
          to="/admin/users"
          className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
        >
          <Users className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 mx-auto mb-2" />
          <p className="font-medium text-gray-600 dark:text-gray-300 group-hover:text-indigo-700 text-center">
            Manage Users
          </p>
        </Link>
        <Link
          to="/admin/analytics"
          className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
        >
          <BarChart3 className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 mx-auto mb-2" />
          <p className="font-medium text-gray-600 dark:text-gray-300 group-hover:text-indigo-700 text-center">
            View Analytics
          </p>
        </Link>
        <Link
          to="/admin/content"
          className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
        >
          <Settings className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 mx-auto mb-2" />
          <p className="font-medium text-gray-600 dark:text-gray-300 group-hover:text-indigo-700 text-center">
            Content Moderation
          </p>
        </Link>
        <Link
          to="/admin/settings"
          className="bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all group"
        >
          <Database className="w-8 h-8 text-gray-400 group-hover:text-indigo-600 mx-auto mb-2" />
          <p className="font-medium text-gray-600 dark:text-gray-300 group-hover:text-indigo-700 text-center">
            System Cleanup
          </p>
        </Link>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;