import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  CheckCircle,
  XCircle,
  BarChart3,
  Award,
  Loader2,
} from 'lucide-react';
import { matchingService } from '../../services/matchingService';

export const MatchingStatsCard: React.FC = () => {
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['matching-stats'],
    queryFn: matchingService.getMatchingStats,
    retry: (failureCount, error: any) => {
      // Don't retry on 403 (forbidden)
      if (error?.response?.status === 403) return false;
      return failureCount < 2;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          {(error as any)?.response?.status === 403
            ? 'Matching statistics are only available for employee accounts.'
            : 'Unable to load matching statistics.'}
        </p>
      </div>
    );
  }

  if (!stats) return null;

  const statCards = [
    {
      title: 'Total Matches',
      value: stats.total_matches || 0,
      icon: Target,
      color: 'blue',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      textColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Pending',
      value: stats.pending_matches || 0,
      icon: BarChart3,
      color: 'yellow',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      textColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
      title: 'Accepted',
      value: stats.accepted_matches || 0,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-100 dark:bg-green-900',
      textColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Dismissed',
      value: stats.dismissed_matches || 0,
      icon: XCircle,
      color: 'red',
      bgColor: 'bg-red-100 dark:bg-red-900',
      textColor: 'text-red-600 dark:text-red-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Average Match Score & Top Skills */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Match Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Average Match Score
            </h3>
          </div>
          <div className="flex items-end gap-4">
            <div className="text-4xl sm:text-5xl font-bold text-purple-600 dark:text-purple-400">
              {Math.round(stats.average_match_score || 0)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              across all matches
            </div>
          </div>
          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-600 dark:bg-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${stats.average_match_score || 0}%` }}
            />
          </div>
        </motion.div>

        {/* Top Skills in Demand */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Award className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Top Skills in Demand
            </h3>
          </div>
          {stats.top_skills_demand && stats.top_skills_demand.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.top_skills_demand.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300 text-sm rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No skill data available</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MatchingStatsCard;
