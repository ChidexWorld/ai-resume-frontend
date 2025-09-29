import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Building,
  Star,
  Send,
  Heart,
  Share2,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Eye,
  ExternalLink
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { employeeService, type JobPosting } from '../../services/employeeService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  // Get job details
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job-details', jobId],
    queryFn: () => employeeService.getJobDetails(parseInt(jobId!)),
    enabled: !!jobId
  });

  const handleApply = () => {
    if (job?.application_status) {
      toast.error('You have already applied to this job');
      return;
    }
    navigate(`/employee/jobs/${jobId}/apply`);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Job removed from saved' : 'Job saved successfully');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Check out this job: ${job?.title} at ${job?.company_name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Job link copied to clipboard');
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getApplicationStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'reviewing': return 'text-blue-600 bg-blue-100';
      case 'shortlisted': return 'text-purple-600 bg-purple-100';
      case 'interviewed': return 'text-indigo-600 bg-indigo-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 dark:text-gray-300 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-12 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Job Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          The job you're looking for doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => navigate('/employee/jobs')}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Details</h1>
          <p className="text-gray-600">View complete job information and requirements</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{job.title}</h2>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 mb-3">
                  <div className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    <span>{job.company_name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{job.location}</span>
                  </div>
                  {job.remote_allowed && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                      Remote OK
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {job.job_type.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {job.experience_level}
                  </span>
                  {job.is_urgent && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:text-gray-300 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  className={`p-2 rounded-lg transition-colors ${
                    isSaved
                      ? 'text-red-600 hover:bg-red-50'
                      : 'text-gray-400 hover:text-gray-600 dark:text-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                </button>
              </div>
            </div>

            {/* Application Status */}
            {job.application_status && (
              <div className="mb-4 p-3 border rounded-lg bg-blue-50 border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Application Status</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    getApplicationStatusColor(job.application_status)
                  }`}>
                    {job.application_status.charAt(0).toUpperCase() + job.application_status.slice(1)}
                  </span>
                </div>
                {job.applied_at && (
                  <p className="text-sm text-blue-700 mt-1">
                    Applied on {format(new Date(job.applied_at), 'MMM d, yyyy')}
                  </p>
                )}
              </div>
            )}

            {/* Key Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-200">
              <div className="text-center">
                <DollarSign className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Salary</p>
                <p className="font-medium text-gray-900">{job.salary_range}</p>
              </div>
              <div className="text-center">
                <Calendar className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Posted</p>
                <p className="font-medium text-gray-900">
                  {format(new Date(job.created_at), 'MMM d')}
                </p>
              </div>
              <div className="text-center">
                <Users className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Applicants</p>
                <p className="font-medium text-gray-900">{job.applications_count || 0}</p>
              </div>
              <div className="text-center">
                <Clock className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <p className="text-sm text-gray-600">Expires</p>
                <p className="font-medium text-gray-900">
                  {job.expires_at ? format(new Date(job.expires_at), 'MMM d') : 'Open'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Job Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Job Description</h3>
            <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-line">
              {job.description}
            </div>
          </motion.div>

          {/* Requirements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Requirements</h3>
            <div className="space-y-4">
              {/* Required Skills */}
              {job.required_skills && job.required_skills.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.required_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferred Skills */}
              {job.preferred_skills && job.preferred_skills.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Preferred Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.preferred_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Requirements */}
              {job.required_education && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Education</h4>
                  <p className="text-gray-700">{job.required_education}</p>
                </div>
              )}

              {job.required_experience && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Experience</h4>
                  <p className="text-gray-700">{job.required_experience}</p>
                </div>
              )}

              {job.communication_requirements && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Communication</h4>
                  <p className="text-gray-700">{job.communication_requirements}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Match Analysis */}
          {job.match_analysis && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">Job Match</h3>
              </div>

              <div className="text-center mb-4">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold ${
                  getMatchScoreColor(job.match_analysis.overall_score)
                }`}>
                  <Star className="w-5 h-5 fill-current" />
                  {job.match_analysis.overall_score}%
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Overall match score</p>
              </div>

              {job.match_analysis.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-green-700 mb-2">Your Strengths</h4>
                  <div className="space-y-1">
                    {job.match_analysis.strengths.slice(0, 3).map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {job.match_analysis.gaps.length > 0 && (
                <div>
                  <h4 className="font-medium text-orange-700 mb-2">Areas to Improve</h4>
                  <div className="space-y-1">
                    {job.match_analysis.gaps.slice(0, 3).map((skill, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-gray-700">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleApply}
                disabled={!!job.application_status}
                className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors ${
                  job.application_status
                    ? 'bg-gray-100 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {job.application_status ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Already Applied
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Apply Now
                  </>
                )}
              </button>

              <button
                onClick={() => navigate('/employee/jobs')}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors"
              >
                <Eye className="w-5 h-5" />
                Browse More Jobs
              </button>

              {job.company_name && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors">
                  <ExternalLink className="w-5 h-5" />
                  View Company
                </button>
              )}
            </div>
          </motion.div>

          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">About {job.company_name}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{job.company_name}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-700">{job.location}</span>
              </div>
              {job.department && (
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-700">{job.department}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
};