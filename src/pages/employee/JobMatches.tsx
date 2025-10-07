import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  TrendingUp,
  X,
  Eye,
  Building,
  CheckCircle,
  Loader2,
  AlertCircle,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { matchingService, type EmployeeMatch } from '../../services/matchingService';
import toast from 'react-hot-toast';

export const JobMatchesPage: React.FC = () => {
  const [minMatchScore, setMinMatchScore] = useState<number>(0);
  const [showDismissed, setShowDismissed] = useState(false);
  const queryClient = useQueryClient();

  // Fetch employee matches
  const { data: matches, isLoading, error } = useQuery({
    queryKey: ['employee-matches', { minMatchScore, showDismissed }],
    queryFn: () =>
      matchingService.getEmployeeMatches({
        min_match_score: minMatchScore,
        is_dismissed: showDismissed ? undefined : false,
      }),
    retry: (failureCount, error: any) => {
      // Don't retry on 403 (forbidden)
      if (error?.response?.status === 403) return false;
      return failureCount < 2;
    },
  });

  // Dismiss match mutation
  const dismissMutation = useMutation({
    mutationFn: matchingService.dismissMatch,
    onSuccess: () => {
      toast.success('Match dismissed successfully');
      queryClient.invalidateQueries({ queryKey: ['employee-matches'] });
    },
    onError: () => {
      toast.error('Failed to dismiss match');
    },
  });

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300';
    if (score >= 60) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-300';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-300';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Fair Match';
    return 'Low Match';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Job Matches
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            AI-powered job recommendations based on your resume and skills
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full sm:w-auto">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Match Score: {minMatchScore}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="10"
                  value={minMatchScore}
                  onChange={(e) => setMinMatchScore(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="showDismissed"
                  checked={showDismissed}
                  onChange={(e) => setShowDismissed(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="showDismissed"
                  className="text-sm text-gray-700 dark:text-gray-300"
                >
                  Show dismissed
                </label>
              </div>
            </div>
            <button
              onClick={() => queryClient.invalidateQueries({ queryKey: ['employee-matches'] })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading matches...</span>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 sm:p-6 text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">
              {(error as any)?.response?.status === 403 ? 'Access Denied' : 'Error Loading Matches'}
            </h3>
            <p className="text-red-600 dark:text-red-400">
              {(error as any)?.response?.status === 403
                ? 'This page is only accessible to employee accounts. Please login as an employee to view job matches.'
                : 'Failed to load your job matches. Please try again.'}
            </p>
          </div>
        ) : matches && matches.length > 0 ? (
          <div className="grid gap-4 sm:gap-6">
            {matches.map((match: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 sm:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Match Score Badge */}
                  <div className="flex-shrink-0">
                    <div
                      className={`w-full lg:w-24 h-24 rounded-lg flex flex-col items-center justify-center ${getMatchScoreColor(
                        match.match_summary?.overall_score || 0
                      )}`}
                    >
                      <div className="text-3xl font-bold">
                        {Math.round(match.match_summary?.overall_score || 0)}%
                      </div>
                      <div className="text-xs font-medium mt-1">
                        {getMatchScoreLabel(match.match_summary?.overall_score || 0)}
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white break-words">
                          {match.job_posting?.title || 'Job Position'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-2">
                          <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <Building className="w-4 h-4" />
                            {match.job_posting?.company_name || 'Company'}
                          </div>
                          {match.job_posting?.location && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <MapPin className="w-4 h-4" />
                              {match.job_posting.location}
                            </div>
                          )}
                          {match.job_posting?.employment_type && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <Clock className="w-4 h-4" />
                              {match.job_posting.employment_type}
                            </div>
                          )}
                          {match.job_posting?.salary_range && (
                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                              <DollarSign className="w-4 h-4" />
                              {match.job_posting.salary_range}
                            </div>
                          )}
                        </div>

                        {/* Match Details */}
                        {match.match_summary && (
                          <div className="mt-4 space-y-2">
                            {match.match_summary.matching_skills &&
                              match.match_summary.matching_skills.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                                    Matching Skills
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {match.match_summary.matching_skills.slice(0, 5).map((skill: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs rounded-full"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                    {match.match_summary.matching_skills.length > 5 && (
                                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                                        +{match.match_summary.matching_skills.length - 5} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                            {match.match_summary.missing_skills &&
                              match.match_summary.missing_skills.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase mb-1">
                                    Skills to Develop
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {match.match_summary.missing_skills.slice(0, 3).map((skill: string, idx: number) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-300 text-xs rounded-full"
                                      >
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <button
                          onClick={() => {
                            /* Navigate to job details */
                          }}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                          title="View Job"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        {!match.is_dismissed && (
                          <button
                            onClick={() => dismissMutation.mutate(match.id)}
                            disabled={dismissMutation.isPending}
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                            title="Dismiss Match"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
              <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                No Matches Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We couldn't find any job matches at the moment. Try adjusting your filters or check back later.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatchesPage;
