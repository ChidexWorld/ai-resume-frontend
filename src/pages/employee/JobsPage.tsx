import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Star,
  Heart,
  Send,
  Eye,
  TrendingUp,
  Users,
  Building,
  Calendar,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { employeeService, type JobPosting, type JobRecommendation } from '../../services/employeeService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const JobsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'recommendations' | 'search'>('recommendations');
  const [searchFilters, setSearchFilters] = useState({
    q: '',
    location: '',
    job_type: '',
    experience_level: '',
    remote_allowed: false,
    min_salary: 0,
    skills: '',
    limit: 20
  });
  const [selectedJob, setSelectedJob] = useState<JobPosting | JobRecommendation | null>(null);
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  // Get job recommendations
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['job-recommendations'],
    queryFn: () => employeeService.getJobRecommendations({ limit: 20 })
  });

  // Search jobs
  const { data: searchResults, isLoading: searchLoading, refetch } = useQuery({
    queryKey: ['job-search', searchFilters],
    queryFn: () => employeeService.searchJobs(searchFilters),
    enabled: false
  });

  const handleSearch = () => {
    refetch();
  };

  const handleApplyToJob = (jobId: number) => {
    toast.success('Opening application form...');
    // This would open an application modal
  };

  const handleSaveJob = (jobId: number) => {
    if (savedJobs.includes(jobId)) {
      setSavedJobs(prev => prev.filter(id => id !== jobId));
      toast.success('Job removed from saved');
    } else {
      setSavedJobs(prev => [...prev, jobId]);
      toast.success('Job saved successfully');
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const formatSalary = (min?: number, max?: number, currency = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`;
    if (min) return `${min.toLocaleString()}+ ${currency}`;
    return `Up to ${max?.toLocaleString()} ${currency}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
          <p className="text-gray-600 mt-1">
            Discover opportunities that match your skills and career goals
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">
            {recommendations?.length || 0} recommendations available
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('recommendations')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'recommendations'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            AI Recommendations
          </div>
        </button>
        <button
          onClick={() => setActiveTab('search')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'search'
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Job Search
          </div>
        </button>
      </div>

      {/* Recommendations Tab */}
      {activeTab === 'recommendations' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {recommendationsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : recommendations && recommendations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.map((job) => (
                <JobRecommendationCard
                  key={job.id}
                  job={job}
                  onApply={() => handleApplyToJob(job.id)}
                  onSave={() => handleSaveJob(job.id)}
                  onViewDetails={() => setSelectedJob(job)}
                  isSaved={savedJobs.includes(job.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No recommendations yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload and analyze your resume to get personalized job recommendations
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto">
                <ArrowRight className="w-4 h-4" />
                Upload Resume
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Search Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title or Keywords
                </label>
                <input
                  type="text"
                  value={searchFilters.q}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, q: e.target.value }))}
                  placeholder="Software Engineer, Product Manager, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={searchFilters.location}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="City, State, or Remote"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  value={searchFilters.job_type}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, job_type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any Type</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={searchFilters.experience_level}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, experience_level: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Any Level</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary
                </label>
                <input
                  type="number"
                  value={searchFilters.min_salary}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, min_salary: parseInt(e.target.value) || 0 }))}
                  placeholder="50000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="remote_allowed"
                  checked={searchFilters.remote_allowed}
                  onChange={(e) => setSearchFilters(prev => ({ ...prev, remote_allowed: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remote_allowed" className="ml-2 text-sm text-gray-700">
                  Remote work allowed
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSearch}
                disabled={searchLoading}
                className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                {searchLoading ? 'Searching...' : 'Search Jobs'}
              </button>
            </div>
          </div>

          {/* Search Results */}
          {searchResults && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold">
                  Search Results ({searchResults.length} jobs found)
                </h3>
              </div>

              <div className="divide-y divide-gray-200">
                {searchResults.map((job) => (
                  <JobSearchCard
                    key={job.id}
                    job={job}
                    onApply={() => handleApplyToJob(job.id)}
                    onSave={() => handleSaveJob(job.id)}
                    onViewDetails={() => setSelectedJob(job)}
                    isSaved={savedJobs.includes(job.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={() => {
            handleApplyToJob(selectedJob.id);
            setSelectedJob(null);
          }}
          onSave={() => handleSaveJob(selectedJob.id)}
          isSaved={savedJobs.includes(selectedJob.id)}
        />
      )}
    </div>
  );
};

// Job Recommendation Card Component
interface JobRecommendationCardProps {
  job: JobRecommendation;
  onApply: () => void;
  onSave: () => void;
  onViewDetails: () => void;
  isSaved: boolean;
}

const JobRecommendationCard: React.FC<JobRecommendationCardProps> = ({
  job,
  onApply,
  onSave,
  onViewDetails,
  isSaved
}) => {
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
          <p className="text-gray-600 text-sm">{job.company_name}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchScoreColor(job.match_score)}`}>
            {job.match_score}% match
          </span>
          <button
            onClick={onSave}
            className={`p-2 rounded-lg transition-colors ${
              isSaved ? 'text-red-600 bg-red-50' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {job.location}
            {job.remote_allowed && <span className="text-blue-600 ml-1">(Remote OK)</span>}
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="w-4 h-4" />
            {job.job_type}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {job.experience_level}
          </div>
        </div>

        {(job.salary_min || job.salary_max) && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            {job.salary_min && job.salary_max
              ? `${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
              : job.salary_min
              ? `${job.salary_min.toLocaleString()}+`
              : `Up to ${job.salary_max?.toLocaleString()}`
            } {job.currency}
          </div>
        )}

        <p className="text-sm text-gray-700 line-clamp-2">{job.description}</p>

        {job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {job.required_skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {job.required_skills.length > 4 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{job.required_skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onApply}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Send className="w-4 h-4" />
          Apply Now
        </button>
        <button
          onClick={onViewDetails}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Eye className="w-4 h-4" />
          Details
        </button>
      </div>
    </motion.div>
  );
};

// Job Search Card Component
interface JobSearchCardProps {
  job: JobPosting;
  onApply: () => void;
  onSave: () => void;
  onViewDetails: () => void;
  isSaved: boolean;
}

const JobSearchCard: React.FC<JobSearchCardProps> = ({
  job,
  onApply,
  onSave,
  onViewDetails,
  isSaved
}) => {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <button
              onClick={onSave}
              className={`p-1 rounded transition-colors ${
                isSaved ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          <p className="text-gray-600 mb-3">{job.company_name}</p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {job.location}
              {job.remote_allowed && <span className="text-blue-600 ml-1">(Remote)</span>}
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              {job.job_type}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {job.experience_level}
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
          </div>

          <p className="text-sm text-gray-700 mb-3 line-clamp-2">{job.description}</p>

          {job.required_skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
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
          )}

          <p className="text-xs text-gray-500">
            Posted {format(new Date(job.created_at), 'MMM d, yyyy')}
          </p>
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <button
            onClick={onApply}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
          >
            <Send className="w-4 h-4" />
            Apply
          </button>
          <button
            onClick={onViewDetails}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
        </div>
      </div>
    </div>
  );
};

// Job Detail Modal Component
interface JobDetailModalProps {
  job: JobPosting | JobRecommendation;
  onClose: () => void;
  onApply: () => void;
  onSave: () => void;
  isSaved: boolean;
}

const JobDetailModal: React.FC<JobDetailModalProps> = ({
  job,
  onClose,
  onApply,
  onSave,
  isSaved
}) => {
  const isRecommendation = 'match_score' in job;

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
              <p className="text-gray-600">{job.company_name}</p>
            </div>
            <div className="flex items-center gap-2">
              {isRecommendation && (
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {job.match_score}% match
                </span>
              )}
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
          <div>
            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
            <p className="text-gray-700 leading-relaxed">{job.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Job Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Location:</span>
                  <p className="font-medium">
                    {job.location}
                    {job.remote_allowed && <span className="text-blue-600 ml-2">(Remote OK)</span>}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Job Type:</span>
                  <p className="font-medium">{job.job_type}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Experience Level:</span>
                  <p className="font-medium">{job.experience_level}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Posted:</span>
                  <p className="font-medium">{format(new Date(job.created_at), 'MMMM d, yyyy')}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Compensation</h3>
              <div className="space-y-3">
                {(job.salary_min || job.salary_max) ? (
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
                ) : (
                  <p className="text-gray-600">Salary information not provided</p>
                )}
              </div>
            </div>
          </div>

          {job.required_skills.length > 0 && (
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

          {job.preferred_skills.length > 0 && (
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

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onApply}
              className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Send className="w-4 h-4" />
              Apply Now
            </button>
            <button
              onClick={onSave}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                isSaved
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save Job'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};