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
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService, type JobPosting, type JobRecommendation } from '../../services/employeeService';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { JobRecommendationCard, JobSearchCard } from '../../components/jobs';

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'recommendations' | 'search'>('recommendations');

  const [recommendationFilters, setRecommendationFilters] = useState({
    limit: 20,
    min_score: 70
  });
  const [searchFilters, setSearchFilters] = useState({
    q: '',
    location: '',
    job_type: '',
    experience_level: '',
    remote_allowed: false,
    min_salary: 0,
    skills: '',
    department: '',
    limit: 20
  });
  const [savedJobs, setSavedJobs] = useState<number[]>([]);

  // Get job recommendations
  const { data: recommendations, isLoading: recommendationsLoading, error: recommendationsError } = useQuery({
    queryKey: ['job-recommendations', recommendationFilters],
    queryFn: () => employeeService.getJobRecommendations(recommendationFilters),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    cacheTime: 10 * 60 * 1000 // 10 minutes in memory
  });

  // Search jobs - manual search with initial load
  const [hasSearched, setHasSearched] = useState(false);

  // Check if all search filters are empty (for initial load)
  const areFiltersEmpty = () => {
    return !searchFilters.q &&
           !searchFilters.location &&
           !searchFilters.job_type &&
           !searchFilters.experience_level &&
           !searchFilters.remote_allowed &&
           searchFilters.min_salary === 0 &&
           !searchFilters.skills &&
           !searchFilters.department;
  };

  const { data: searchResults, isLoading: searchLoading, error: searchError, refetch } = useQuery({
    queryKey: ['job-search', searchFilters],
    queryFn: () => employeeService.searchJobs(searchFilters),
    enabled: activeTab === 'search' && (hasSearched || areFiltersEmpty()),
    staleTime: 2 * 60 * 1000, // 2 minutes cache
    cacheTime: 5 * 60 * 1000 // 5 minutes in memory
  });

  const handleSearch = () => {
    setHasSearched(true);
    refetch();
  };

  const handleApplyToJob = (job: JobPosting | JobRecommendation['job']) => {
    navigate(`/employee/jobs/${job.id}/apply`);
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
    return 'text-gray-600 dark:text-gray-300 bg-gray-100';
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Job Opportunities</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Discover opportunities that match your skills and career goals
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 dark:text-gray-300">
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
              ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-gray-100'
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
              ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:text-gray-100'
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
          {/* AI Recommendations Filter */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700">Filter Recommendations</span>
                </div>


                <div className="flex items-center gap-3">
                  <label className="text-sm text-gray-600 dark:text-gray-300">Minimum Match Score:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={recommendationFilters.min_score}
                      onChange={(e) => setRecommendationFilters(prev => ({
                        ...prev,
                        min_score: parseInt(e.target.value)
                      }))}
                      className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <span className="text-sm font-medium text-primary-600 min-w-[3rem]">
                      {recommendationFilters.min_score}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[50, 70, 85, 95].map(score => (
                    <button
                      key={score}
                      onClick={() => setRecommendationFilters(prev => ({
                        ...prev,
                        min_score: score
                      }))}
                      className={`px-2 py-1 text-xs rounded ${
                        recommendationFilters.min_score === score
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 dark:text-gray-300 hover:bg-gray-200'
                      } transition-colors`}
                    >
                      {score}%
                    </button>
                  ))}
                </div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {recommendationsLoading ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Loading...
                  </span>
                ) : (
                  `${recommendations?.length || 0} recommendations`
                )}
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              🤖 AI-powered matching with advanced analysis for the best recommendations
            </div>
          </div>

          {recommendationsLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
                      <div className="flex gap-2 mb-3">
                        <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                        <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                      </div>
                    </div>
                    <div className="h-8 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-18"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : recommendations && recommendations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {recommendations.map((job, index) => (
                <JobRecommendationCard
                  key={job.job.id || job.match_id || index}
                  job={job}
                  onApply={() => handleApplyToJob(job.job)}
                  onSave={() => handleSaveJob(job.job.id)}
                  onViewDetails={() => navigate(`/employee/jobs/${job.job.id}`)}
                  isSaved={savedJobs.includes(job.job.id)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No recommendations yet
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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

            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {searchLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching jobs...
                  </span>
                ) : (
                  searchResults ? `${searchResults.total_count || 0} jobs found` : 'Ready to search'
                )}
              </div>
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
          {searchLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Searching for jobs...</p>
            </div>
          ) : searchResults ? (
            searchResults.jobs && searchResults.jobs.length > 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">
                      Job Search Results
                    </h3>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {searchResults.jobs.length} of {searchResults.total_count} jobs
                      {searchResults.has_more && " (scroll for more)"}
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {searchResults.jobs.map((job) => (
                    <JobSearchCard
                      key={job.id}
                      job={job}
                      onApply={() => handleApplyToJob(job)}
                      onSave={() => handleSaveJob(job.id)}
                      onViewDetails={() => navigate(`/employee/jobs/${job.id}`)}
                      isSaved={savedJobs.includes(job.id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Try adjusting your search criteria or keywords
                </p>
                <button
                  onClick={() => setSearchFilters({
                    q: '',
                    location: '',
                    job_type: '',
                    experience_level: '',
                    remote_allowed: false,
                    min_salary: 0,
                    skills: '',
                    department: '',
                    limit: 20
                  })}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {hasSearched || !areFiltersEmpty() ? 'No jobs found' : 'Ready to search for jobs'}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {hasSearched || !areFiltersEmpty() ?
                  'Try adjusting your search criteria or clearing filters to see more results.' :
                  'Use the search filters above and click "Search Jobs" to find opportunities that match your preferences.'
                }
              </p>
              {(hasSearched || !areFiltersEmpty()) && (
                <button
                  onClick={() => {
                    setSearchFilters({
                      q: '',
                      location: '',
                      job_type: '',
                      experience_level: '',
                      remote_allowed: false,
                      min_salary: 0,
                      skills: '',
                      department: '',
                      limit: 20
                    });
                    setHasSearched(false);
                  }}
                  className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </motion.div>
      )}

    </div>
    );
};
