import React from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  Heart,
  Send,
  Eye,
  Building,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import type { JobRecommendation } from '../../services/employeeService';

interface JobRecommendationCardProps {
  job: JobRecommendation;
  onApply: () => void;
  onSave: () => void;
  onViewDetails: () => void;
  isSaved: boolean;
}

export const JobRecommendationCard: React.FC<JobRecommendationCardProps> = ({
  job,
  onApply,
  onSave,
  onViewDetails,
  isSaved
}) => {
  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-blue-600 bg-blue-100';
    if (score >= 50) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatSalary = (min?: number, max?: number, currency: string = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `From ${currency} ${min.toLocaleString()}`;
    if (max) return `Up to ${currency} ${max.toLocaleString()}`;
    return 'Salary not specified';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{job.job.title}</h3>
            {job.match_score && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(job.match_score)}`}>
                {job.match_score}% match
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building className="w-4 h-4" />
            <span>{job.job.department || 'Department not specified'}</span>
            <span>•</span>
            <MapPin className="w-4 h-4" />
            <span>{job.job.location}</span>
            {job.job.remote_allowed && (
              <>
                <span>•</span>
                <span className="text-green-600">Remote OK</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={onSave}
          className={`p-2 rounded-lg transition-colors ${
            isSaved
              ? 'text-red-600 hover:bg-red-50'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span className="capitalize">{job.job.job_type ? job.job.job_type.replace('_', ' ') : 'Not specified'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span className="capitalize">{job.job.experience_level}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{job.job.salary_range || 'Salary not specified'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(job.job.created_at), 'MMM d, yyyy')}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-2">
          {job.job.description}
        </p>
      </div>

      {/* Skills */}
      {job.job.required_skills && job.job.required_skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {job.job.required_skills.slice(0, 5).map((skill, index) => (
              <span
                key={`${job.job.id}-skill-${index}`}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.job.required_skills.length > 5 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{job.job.required_skills.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Match Details */}
      {job.match_details && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-600 space-y-1">
            {job.match_details.strengths && job.match_details.strengths.length > 0 && (
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span>{job.match_details.strengths[0]}</span>
              </div>
            )}
            {job.match_details.concerns && job.match_details.concerns.length > 0 && (
              <div className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-yellow-600" />
                <span>{job.match_details.concerns[0]}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onApply}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex-1"
        >
          <Send className="w-4 h-4" />
          Apply Now
        </button>
        <button
          onClick={onViewDetails}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Details
        </button>
      </div>
    </motion.div>
  );
};