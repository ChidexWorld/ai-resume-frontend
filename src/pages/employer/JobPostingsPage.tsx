import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Plus,
  Eye,
  Edit,
  Trash2,
  Users,
  MapPin,
  DollarSign,
  Clock,
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  TrendingUp
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { employerService, type JobPosting } from '../../services/employerService';
import { JobCreateModal } from '../../components/employer/JobCreateModal';
import { ApplicationReviewModal } from '../../components/employer/ApplicationReviewModal';
import { JobEditModal } from '../../components/employer/JobEditModal';
import { JobDetailsModal } from '../../components/employer/JobDetailsModal';
import toast from 'react-hot-toast';

export const JobPostingsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedJobForApplications, setSelectedJobForApplications] = useState<JobPosting | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState<JobPosting | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedJobForDetails, setSelectedJobForDetails] = useState<JobPosting | null>(null);

  const { data: jobPostings, isLoading, refetch } = useQuery({
    queryKey: ['job-postings', statusFilter],
    queryFn: () => employerService.getJobPostings({
      status_filter: statusFilter === 'all' ? undefined : statusFilter,
      limit: 100
    })
  });

  const filteredJobs = jobPostings?.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Calculate stats from job data
  const totalJobs = jobPostings?.length || 0;
  const activeJobs = jobPostings?.filter(job => job.status === 'active').length || 0;
  const totalApplications = jobPostings?.reduce((total, job) => total + (job.applications_count || 0), 0) || 0;
  const averageApplications = totalJobs > 0 ? Math.round(totalApplications / totalJobs) : 0;

  const handleDeleteJob = async (jobId: number) => {
    console.log('handleDeleteJob called with jobId:', jobId);
    if (window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      try {
        console.log('Calling employerService.deleteJobPosting...');
        await employerService.deleteJobPosting(jobId);
        console.log('Delete successful');
        toast.success('Job posting deleted successfully');
        refetch();
      } catch (error: any) {
        let errorMessage = 'Failed to delete job posting';

        if (error?.response?.data?.detail) {
          errorMessage = error.response.data.detail;
        } else if (error?.response?.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        console.error('Job deletion error:', error);
        toast.error(errorMessage);
      }
    }
  };

  const handleEditJob = (job: JobPosting) => {
    setSelectedJobForEdit(job);
    setShowEditModal(true);
  };


  const handleViewApplications = (job: JobPosting) => {
    setSelectedJobForApplications(job);
    setShowApplicationsModal(true);
  };

  const handleViewDetails = (job: JobPosting) => {
    setSelectedJobForDetails(job);
    setShowDetailsModal(true);
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
    <div className="space-y-4 md:space-y-6 p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Job Postings</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Manage your job listings and track applications
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm md:text-base w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Post New Job
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <Briefcase className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Total Jobs</p>
              {isLoading ? (
                <div className="w-8 h-6 md:w-12 md:h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-xl md:text-2xl font-bold text-gray-900">{totalJobs}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
              <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Active Jobs</p>
              {isLoading ? (
                <div className="w-8 h-6 md:w-12 md:h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-xl md:text-2xl font-bold text-gray-900">{activeJobs}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <Users className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Total Applications</p>
              {isLoading ? (
                <div className="w-8 h-6 md:w-12 md:h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-xl md:text-2xl font-bold text-gray-900">{totalApplications}</p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0">
              <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
            </div>
            <div className="ml-3 min-w-0 flex-1">
              <p className="text-xs md:text-sm font-medium text-gray-500 truncate">Avg. Applications</p>
              {isLoading ? (
                <div className="w-8 h-6 md:w-12 md:h-8 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-xl md:text-2xl font-bold text-gray-900">{averageApplications}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search jobs by title, description, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading job postings...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onView={() => handleViewDetails(job)}
                onEdit={() => handleEditJob(job)}
                onDelete={() => handleDeleteJob(job.id)}
                onViewApplications={() => handleViewApplications(job)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No jobs found' : 'No job postings yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all'
                ? 'Try adjusting your search criteria'
                : 'Get started by creating your first job posting'}
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto"
              >
                <Plus className="w-4 h-4" />
                Post Your First Job
              </button>
            )}
          </div>
        )}
      </div>


      {/* Job Create Modal */}
      <JobCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      {/* Applications Review Modal */}
      <ApplicationReviewModal
        isOpen={showApplicationsModal}
        onClose={() => {
          setShowApplicationsModal(false);
          setSelectedJobForApplications(null);
        }}
        jobId={selectedJobForApplications?.id || 0}
        jobTitle={selectedJobForApplications?.title || ''}
      />

      {/* Job Edit Modal */}
      <JobEditModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedJobForEdit(null);
        }}
        job={selectedJobForEdit}
      />

      {/* Job Details Modal */}
      <JobDetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setSelectedJobForDetails(null);
        }}
        job={selectedJobForDetails}
        onViewApplications={() => {
          setShowDetailsModal(false);
          if (selectedJobForDetails) {
            handleViewApplications(selectedJobForDetails);
          }
          setSelectedJobForDetails(null);
        }}
      />

    </div>
  );
};

// Job Card Component
interface JobCardProps {
  job: JobPosting;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onViewApplications: () => void;
}

const JobCard: React.FC<JobCardProps> = ({
  job,
  onView,
  onEdit,
  onDelete,
  onViewApplications
}) => {
  const [showActions, setShowActions] = useState(false);

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
    <div className="p-4 md:p-6 hover:bg-gray-50 transition-colors border-b border-gray-200 last:border-b-0">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
              {getStatusIcon(job.status)}
              {job.status}
            </div>
            {job.is_urgent && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                Urgent
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-4 text-sm leading-relaxed" style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            wordBreak: 'break-word'
          }}>{job.description}</p>

          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
              {job.remote_allowed && <span className="text-blue-600 ml-1">(Remote OK)</span>}
            </div>

            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.job_type} • {job.experience_level}
            </div>

            {(job.salary_min || job.salary_max) && (
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" />
                {job.salary_min && job.salary_max
                  ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                  : job.salary_min
                  ? `${job.salary_min.toLocaleString()}+`
                  : `Up to ${job.salary_max?.toLocaleString()}`
                } {job.currency}
              </div>
            )}

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              Posted {format(new Date(job.created_at), 'MMM d, yyyy')}
            </div>
          </div>

          {job.required_skills && job.required_skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {job.required_skills.slice(0, 5).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
                {job.required_skills.length > 5 && (
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    +{job.required_skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm">
            <button
              onClick={onViewApplications}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              <Users className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">View Applications</span>
              <span className="sm:hidden">Apps</span>
              ({job.applications_count})
            </button>
          </div>
        </div>

        <div className="relative ml-2 md:ml-4 flex-shrink-0">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showActions && (
            <div className="absolute right-0 top-10 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
              <button
                onClick={() => {
                  onView();
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>

              <button
                onClick={() => {
                  onEdit();
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Job
              </button>

              {job.status === 'active' && (
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                  <Pause className="w-4 h-4" />
                  Pause Job
                </button>
              )}

              {job.status === 'paused' && (
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                  <Play className="w-4 h-4" />
                  Activate Job
                </button>
              )}

              <hr className="my-2" />

              <button
                onClick={() => {
                  onDelete();
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete Job
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Job Detail Modal Component
interface JobDetailModalProps {
  job: JobPosting;
  onClose: () => void;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <p className="text-gray-600">{job.location}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Job Type:</span>
                  <p className="font-medium">{job.job_type}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Experience Level:</span>
                  <p className="font-medium">{job.experience_level}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Department:</span>
                  <p className="font-medium">{job.department || 'Not specified'}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Remote Work:</span>
                  <p className="font-medium">{job.remote_allowed ? 'Allowed' : 'Not allowed'}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Compensation</h3>
              <div className="space-y-3">
                {(job.salary_min || job.salary_max) && (
                  <div>
                    <span className="text-sm text-gray-600">Salary Range:</span>
                    <p className="font-medium">
                      {job.salary_min && job.salary_max
                        ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
                        : job.salary_min
                        ? `${job.salary_min.toLocaleString()}+`
                        : `Up to ${job.salary_max?.toLocaleString()}`
                      } {job.currency}
                    </p>
                  </div>
                )}
                <div>
                  <span className="text-sm text-gray-600">Posted:</span>
                  <p className="font-medium">{format(new Date(job.created_at), 'MMMM d, yyyy')}</p>
                </div>
                {job.expires_at && (
                  <div>
                    <span className="text-sm text-gray-600">Expires:</span>
                    <p className="font-medium">{format(new Date(job.expires_at), 'MMMM d, yyyy')}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {job.required_skills && job.required_skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.preferred_skills && job.preferred_skills.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Preferred Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.preferred_skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
};