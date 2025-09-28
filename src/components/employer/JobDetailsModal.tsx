import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Building,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  Calendar,
  Target,
  Brain,
  Zap
} from 'lucide-react';
import { format } from 'date-fns';
import { useMutation } from '@tanstack/react-query';
import { type JobPosting, employerService } from '../../services/employerService';
import { matchingService } from '../../services/matchingService';
import toast from 'react-hot-toast';

interface JobDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPosting | null;
  onViewApplications: () => void;
}

export const JobDetailsModal: React.FC<JobDetailsModalProps> = ({
  isOpen,
  onClose,
  job,
  onViewApplications
}) => {
  if (!job) return null;

  // AI Recommendations mutation
  const aiRecommendationsMutation = useMutation({
    mutationFn: () => matchingService.generateJobMatches(job.id),
    onSuccess: (data) => {
      toast.success(`Generated ${data.length} AI recommendations for this job!`);
    },
    onError: () => {
      toast.error('Failed to generate AI recommendations');
    }
  });

  // Auto Score Applications mutation
  const autoScoreMutation = useMutation({
    mutationFn: () => employerService.autoScoreApplications(job.id),
    onSuccess: () => {
      toast.success('Applications have been auto-scored successfully!');
    },
    onError: () => {
      toast.error('Failed to auto-score applications');
    }
  });

  const handleGetAIRecommendations = () => {
    aiRecommendationsMutation.mutate();
  };

  const handleAutoScore = () => {
    autoScoreMutation.mutate();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'closed':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'paused':
        return <Pause className="w-4 h-4" />;
      case 'closed':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                      {getStatusIcon(job.status)}
                      {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                    </div>
                    {job.is_urgent && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                        Urgent
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                      {job.remote_allowed && <span className="text-blue-600 ml-1">(Remote OK)</span>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.job_type.replace('_', ' ')} • {job.experience_level}
                    </div>
                    {job.department && (
                      <div className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {job.department}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-4"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-hidden">
              <div className="flex flex-col xl:flex-row gap-6 min-w-0">
                {/* Main Content */}
                <div className="flex-1 space-y-6 min-w-0">
                  {/* Job Description */}
                  <div className="w-full min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Description</h3>
                    <div className="bg-gray-50 rounded-lg p-4 w-full overflow-hidden">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words" style={{ wordBreak: 'break-word', overflowWrap: 'anywhere', maxWidth: '100%' }}>{job.description}</p>
                    </div>
                  </div>

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
                    {/* Required Skills */}
                    {job.required_skills && job.required_skills.length > 0 && (
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Required Skills</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 w-full overflow-hidden">
                          <div className="flex flex-wrap gap-2">
                            {job.required_skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium break-words"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Preferred Skills */}
                    {job.preferred_skills && job.preferred_skills.length > 0 && (
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Preferred Skills</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 w-full overflow-hidden">
                          <div className="flex flex-wrap gap-2">
                            {job.preferred_skills.map((skill, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium break-words"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Compensation */}
                    {(job.salary_min || job.salary_max) && (
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Compensation</h3>
                        <div className="bg-white border border-gray-200 rounded-lg p-4 w-full overflow-hidden">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                              <DollarSign className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-lg font-semibold text-gray-900 break-words">
                                {job.salary_min && job.salary_max
                                  ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                                  : job.salary_min
                                  ? `${job.salary_min.toLocaleString()}+`
                                  : `Up to ${job.salary_max?.toLocaleString()}`
                                } {job.currency}
                              </p>
                              <p className="text-sm text-gray-500">Annual salary</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Job Settings */}
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Job Settings</h3>
                      <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 w-full overflow-hidden">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Auto-matching</span>
                          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                            job.auto_match_enabled
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {job.auto_match_enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </div>

                        {job.minimum_match_score && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Min. Match Score</span>
                            <span className="text-sm font-medium text-gray-900 bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {job.minimum_match_score}%
                            </span>
                          </div>
                        )}

                        {job.max_applications && (
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Max Applications</span>
                            <span className="text-sm font-medium text-gray-900 bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              {job.max_applications}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="xl:w-80 space-y-6">
                  {/* Quick Stats */}
                  <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Job Statistics
                    </h3>
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{job.applications_count}</p>
                            <p className="text-sm text-gray-600">Applications Received</p>
                          </div>
                          <div className="p-3 bg-blue-100 rounded-lg">
                            <Users className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-lg font-semibold text-gray-900">
                              {format(new Date(job.created_at), 'MMM d, yyyy')}
                            </p>
                            <p className="text-sm text-gray-600">Date Posted</p>
                          </div>
                          <div className="p-3 bg-green-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-green-600" />
                          </div>
                        </div>
                      </div>

                      {job.expires_at && (
                        <div className="bg-white rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-lg font-semibold text-gray-900">
                                {format(new Date(job.expires_at), 'MMM d, yyyy')}
                              </p>
                              <p className="text-sm text-gray-600">Expires</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg">
                              <Target className="w-6 h-6 text-orange-600" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3">
                    <button
                      onClick={onViewApplications}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      <Users className="w-5 h-5" />
                      View Applications ({job.applications_count})
                    </button>

                    {/* AI Features */}
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <Brain className="w-4 h-4 text-purple-600" />
                        AI-Powered Features
                      </h4>
                      <div className="space-y-2">
                        <button
                          onClick={handleGetAIRecommendations}
                          disabled={aiRecommendationsMutation.isPending}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          <Brain className="w-4 h-4" />
                          {aiRecommendationsMutation.isPending ? 'Generating...' : 'Get AI Recommendations'}
                        </button>

                        <button
                          onClick={handleAutoScore}
                          disabled={autoScoreMutation.isPending || job.applications_count === 0}
                          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                          <Zap className="w-4 h-4" />
                          {autoScoreMutation.isPending ? 'Scoring...' : 'Auto-Score Applications'}
                        </button>
                      </div>

                      {job.applications_count === 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          Auto-scoring requires applications to be present
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};