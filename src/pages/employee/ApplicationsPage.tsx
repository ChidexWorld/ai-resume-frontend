import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Filter,
  Search,
  Calendar,
  MapPin,
  Briefcase,
  Clock,
  Eye,
  MessageSquare,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowRight,
  Building,
  Star
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { employeeService, type JobApplication } from '../../services/employeeService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const ApplicationsPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<JobApplication | null>(null);

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications', statusFilter],
    queryFn: () => employeeService.getApplications({
      status: statusFilter === 'all' ? undefined : statusFilter,
      limit: 100
    })
  });

  const filteredApplications = applications || [];

  const handleWithdrawApplication = async (applicationId: number) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await employeeService.withdrawApplication(applicationId);
        toast.success('Application withdrawn successfully');
        // Refetch applications
      } catch (error) {
        toast.error('Failed to withdraw application');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800';
      case 'interviewed':
        return 'bg-indigo-100 text-indigo-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'reviewing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'shortlisted':
        return <Star className="w-4 h-4" />;
      case 'interviewed':
        return <MessageSquare className="w-4 h-4" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'withdrawn':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Your application is under review';
      case 'reviewing':
        return 'Application is being reviewed by the employer';
      case 'shortlisted':
        return 'Congratulations! You\'ve been shortlisted';
      case 'interviewed':
        return 'Interview scheduled - prepare for your meeting!';
      case 'accepted':
        return 'Congratulations! Your application was accepted';
      case 'rejected':
        return 'Unfortunately, your application was not selected';
      case 'withdrawn':
        return 'Application withdrawn';
      default:
        return 'Application status unknown';
    }
  };

  const applicationStats = [
    {
      label: 'Total Applications',
      value: applications?.length || 0,
      color: 'blue'
    },
    {
      label: 'Pending Review',
      value: applications?.filter(app => app.status === 'pending' || app.status === 'reviewing').length || 0,
      color: 'yellow'
    },
    {
      label: 'Shortlisted',
      value: applications?.filter(app => app.status === 'shortlisted' || app.status === 'interviewed').length || 0,
      color: 'purple'
    },
    {
      label: 'Accepted',
      value: applications?.filter(app => app.status === 'accepted').length || 0,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Track the status of your job applications
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {applicationStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 p-4"
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
            <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Applications</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewed">Interviewed</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300">
            Showing {filteredApplications.length} applications
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading applications...</p>
          </div>
        ) : filteredApplications.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onViewDetails={() => setSelectedApplication(application)}
                onWithdraw={() => handleWithdrawApplication(application.id)}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                getStatusMessage={getStatusMessage}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {statusFilter === 'all' ? 'No applications yet' : `No ${statusFilter} applications`}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {statusFilter === 'all'
                ? 'Start applying to jobs that match your skills and interests'
                : `You don't have any ${statusFilter} applications at the moment`
              }
            </p>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto">
              <ArrowRight className="w-4 h-4" />
              Browse Jobs
            </button>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <ApplicationDetailModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onWithdraw={() => {
            handleWithdrawApplication(selectedApplication.id);
            setSelectedApplication(null);
          }}
          getStatusColor={getStatusColor}
          getStatusIcon={getStatusIcon}
          getStatusMessage={getStatusMessage}
        />
      )}
    </div>
  );
};

// Application Card Component
interface ApplicationCardProps {
  application: JobApplication;
  onViewDetails: () => void;
  onWithdraw: () => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusMessage: (status: string) => string;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onViewDetails,
  onWithdraw,
  getStatusColor,
  getStatusIcon,
  getStatusMessage
}) => {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{application.job_title}</h3>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
              {getStatusIcon(application.status)}
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-3">{application.company_name}</p>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Applied {format(new Date(application.applied_at), 'MMM d, yyyy')}
            </div>
            {application.match_score && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4" />
                {application.match_score}% match
              </div>
            )}
            {(application.interview_scheduled || application.interview_scheduled_at) && (
              <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-medium">
                <Calendar className="w-4 h-4" />
                Interview: {format(new Date(application.interview_scheduled || application.interview_scheduled_at!), 'MMM d, h:mm a')}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
            {getStatusMessage(application.status)}
          </p>

          {/* Match Details */}
          {application.match_details && (
            <div className="grid grid-cols-2 gap-3 mb-3">
              {application.match_details.skills_score !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${application.match_details.skills_score}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    Skills: {application.match_details.skills_score}%
                  </span>
                </div>
              )}
              {application.match_details.experience_score !== undefined && (
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${application.match_details.experience_score}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    Exp: {application.match_details.experience_score}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Matching Skills */}
          {application.match_details?.matching_skills && application.match_details.matching_skills.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">Matching Skills:</p>
              <div className="flex flex-wrap gap-1">
                {application.match_details.matching_skills.slice(0, 5).map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {application.match_details.matching_skills.length > 5 && (
                  <span className="px-2 py-0.5 text-green-700 dark:text-green-400 text-xs">
                    +{application.match_details.matching_skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {application.match_details?.missing_skills && application.match_details.missing_skills.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-medium text-orange-700 dark:text-orange-400 mb-1">Skills to Develop:</p>
              <div className="flex flex-wrap gap-1">
                {application.match_details.missing_skills.slice(0, 5).map((skill, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {application.match_details.missing_skills.length > 5 && (
                  <span className="px-2 py-0.5 text-orange-700 dark:text-orange-400 text-xs">
                    +{application.match_details.missing_skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Employer Notes */}
          {application.notes && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 mb-3">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                <strong>Employer Notes:</strong> {application.notes}
              </p>
            </div>
          )}

          {/* AI Recommendation */}
          {application.recommendation && (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 mb-3">
              <p className="text-sm text-purple-900 dark:text-purple-300">
                <strong>AI Insight:</strong> {application.recommendation}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={onViewDetails}
            className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>

          {(application.status === 'pending' || application.status === 'reviewing') && (
            <button
              onClick={onWithdraw}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              <XCircle className="w-4 h-4" />
              Withdraw
            </button>
          )}

          {application.status === 'shortlisted' && (
            <button className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
              <MessageSquare className="w-4 h-4" />
              Message
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Application Detail Modal Component
interface ApplicationDetailModalProps {
  application: JobApplication;
  onClose: () => void;
  onWithdraw: () => void;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusMessage: (status: string) => string;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  application,
  onClose,
  onWithdraw,
  getStatusColor,
  getStatusIcon,
  getStatusMessage
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{application.job_title}</h2>
              <p className="text-gray-600 dark:text-gray-300">{application.company_name}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                {getStatusIcon(application.status)}
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Application Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Applied Date:</span>
                  <p className="font-medium">{format(new Date(application.applied_at), 'EEEE, MMMM d, yyyy')}</p>
                </div>
                {application.match_score && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Match Score:</span>
                    <p className="font-medium">{application.match_score}%</p>
                  </div>
                )}
                {application.resume_id && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Resume:</span>
                    <p className="font-medium">Resume #{application.resume_id}</p>
                  </div>
                )}
                {application.voice_analysis_id && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Voice Analysis:</span>
                    <p className="font-medium">Analysis #{application.voice_analysis_id}</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Status Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Current Status:</span>
                  <p className="font-medium">{getStatusMessage(application.status)}</p>
                </div>
                {application.reviewed_at && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Reviewed Date:</span>
                    <p className="font-medium">{format(new Date(application.reviewed_at), 'MMMM d, yyyy')}</p>
                  </div>
                )}
                {application.interview_scheduled_at && (
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Interview Scheduled:</span>
                    <p className="font-medium">{format(new Date(application.interview_scheduled_at), 'EEEE, MMMM d, yyyy \'at\' h:mm a')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {application.cover_letter && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {application.cover_letter}
                </p>
              </div>
            </div>
          )}

          {application.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Employer Notes</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800 leading-relaxed">
                  {application.notes}
                </p>
              </div>
            </div>
          )}

          {application.job_details && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Information</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 leading-relaxed">
                  {application.job_details.description}
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {(application.status === 'pending' || application.status === 'reviewing') && (
              <button
                onClick={onWithdraw}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle className="w-4 h-4" />
                Withdraw Application
              </button>
            )}

            {application.status === 'shortlisted' && (
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <MessageSquare className="w-4 h-4" />
                Contact Employer
              </button>
            )}

            <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              <Download className="w-4 h-4" />
              Download Application
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};