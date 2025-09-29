import React from 'react';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Heart,
  Send,
  Eye,
  Building,
  Calendar,
  TrendingUp,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import type { JobPosting } from '../../services/employeeService';

interface JobSearchCardProps {
  job: JobPosting;
  onApply: () => void;
  onSave: () => void;
  onViewDetails: () => void;
  isSaved: boolean;
}

export const JobSearchCard: React.FC<JobSearchCardProps> = ({
  job,
  onApply,
  onSave,
  onViewDetails,
  isSaved
}) => {
  const formatSalary = (min?: number, max?: number, currency: string = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `From ${currency} ${min.toLocaleString()}`;
    if (max) return `Up to ${currency} ${max.toLocaleString()}`;
    return 'Salary not specified';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'closed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Building className="w-4 h-4" />
            <span>{job.company_name}</span>
            <span>•</span>
            <MapPin className="w-4 h-4" />
            <span>{job.location}</span>
            {job.remote_allowed && (
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

      {/* Job Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Briefcase className="w-4 h-4" />
          <span className="capitalize">{job.job_type ? job.job_type.replace('_', ' ') : 'Not specified'}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span className="capitalize">{job.experience_level}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="w-4 h-4" />
          <span>{formatSalary(job.salary_min, job.salary_max, job.currency)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{format(new Date(job.created_at), 'MMM d')}</span>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-sm text-gray-700 line-clamp-2">
          {job.description}
        </p>
      </div>

      {/* Skills */}
      {job.required_skills && job.required_skills.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {job.required_skills.slice(0, 6).map((skill, index) => (
              <span
                key={`${job.id}-skill-${index}`}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md"
              >
                {skill}
              </span>
            ))}
            {job.required_skills.length > 6 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                +{job.required_skills.length - 6} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Additional Info */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center gap-4">
          <span>Posted {format(new Date(job.created_at), 'MMM d, yyyy')}</span>
          {job.expires_at && (
            <span>Expires {format(new Date(job.expires_at), 'MMM d, yyyy')}</span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          <span>Be among the first applicants</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onApply}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Send className="w-4 h-4" />
          Apply Now
        </button>
        <button
          onClick={onViewDetails}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Eye className="w-4 h-4" />
          View Details
        </button>
      </div>
    </div>
  );
};