import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Eye,
  Calendar,
  Star,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Download,
  MessageSquare,
  TrendingUp,
  Clock,
  Award,
  Brain,
  Zap
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { employerService, type CandidateSearchResponse } from '../../services/employerService';
import { matchingService } from '../../services/matchingService';
import toast from 'react-hot-toast';

export const SearchPage: React.FC = () => {
  const [searchFilters, setSearchFilters] = useState({
    skills: '',
    experience_level: '',
    min_experience_years: 0,
    location: '',
    min_communication_score: 0,
    limit: 20
  });
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateSearchResponse | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);

  const { data: candidates, isLoading, refetch } = useQuery({
    queryKey: ['candidates', searchFilters],
    queryFn: () => employerService.searchCandidates(searchFilters),
    enabled: false // Only search when user triggers it
  });

  // Get job postings for AI recommendations
  const { data: jobPostings } = useQuery({
    queryKey: ['job-postings'],
    queryFn: () => employerService.getJobPostings({ limit: 100 })
  });

  // AI Recommendations mutation
  const aiRecommendationsMutation = useMutation({
    mutationFn: (jobId: number) => matchingService.generateJobMatches(jobId),
    onSuccess: (data, jobId) => {
      toast.success(`Generated ${data.length} AI recommendations for job ${jobId}!`);
      setSelectedJobId(jobId);
      setShowAIRecommendations(true);
    },
    onError: () => {
      toast.error('Failed to generate AI recommendations');
    }
  });

  // Bulk matching mutation
  const bulkMatchMutation = useMutation({
    mutationFn: (request: any) => matchingService.generateBulkMatches(request),
    onSuccess: (data) => {
      toast.success(`Generated ${data.total_matches_generated} matches for ${data.jobs_processed} jobs!`);
    },
    onError: () => {
      toast.error('Failed to generate bulk matches');
    }
  });

  // Get AI recommendations for selected job
  const { data: aiRecommendations, isLoading: loadingRecommendations } = useQuery({
    queryKey: ['ai-recommendations', selectedJobId],
    queryFn: () => selectedJobId ? matchingService.getEmployeeMatches({ job_id: selectedJobId }) : null,
    enabled: !!selectedJobId && showAIRecommendations
  });

  const handleSearch = () => {
    refetch();
  };

  const handleScheduleInterview = (candidate: CandidateSearchResponse) => {
    // This would open a modal or navigate to interview scheduling
    toast.success(`Opening interview scheduler for ${candidate.employee.first_name} ${candidate.employee.last_name}`);
  };

  const handleContactCandidate = (candidate: CandidateSearchResponse) => {
    toast.success(`Opening message composer for ${candidate.employee.first_name} ${candidate.employee.last_name}`);
  };

  const handleAutoScoreApplications = async (jobId: number) => {
    try {
      await employerService.autoScoreApplications(jobId);
      toast.success('Applications auto-scored successfully!');
    } catch (error) {
      toast.error('Failed to auto-score applications');
    }
  };

  const handleGetAIRecommendations = (jobId: number) => {
    aiRecommendationsMutation.mutate(jobId);
  };

  const handleBulkMatching = () => {
    bulkMatchMutation.mutate({
      min_match_score: 70,
      auto_recommend: true
    });
  };

  const getExperienceColor = (years: number) => {
    if (years >= 10) return 'text-purple-600 bg-purple-100';
    if (years >= 5) return 'text-blue-600 bg-blue-100';
    if (years >= 2) return 'text-green-600 bg-green-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getCommunicationColor = (score: number | undefined) => {
    if (!score) return 'text-gray-600 dark:text-gray-300 dark:text-gray-600 bg-gray-100';
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Talent Hunt</h1>
          <p className="text-gray-600 dark:text-gray-300 dark:text-gray-600 mt-1">
            Search candidates, get AI recommendations, and auto-score applications
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBulkMatching}
            disabled={bulkMatchMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
          >
            <Brain className="w-4 h-4" />
            {bulkMatchMutation.isPending ? 'Matching...' : 'Bulk AI Matching'}
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* AI Tools Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg shadow-sm border border-purple-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              AI-Powered Tools
            </h2>
            <p className="text-gray-600 dark:text-gray-300 dark:text-gray-600 text-sm mt-1">
              Get AI recommendations and auto-score applications for your job postings
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Job Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Job for AI Tools
            </label>
            <select
              value={selectedJobId || ''}
              onChange={(e) => setSelectedJobId(e.target.value ? parseInt(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a job posting...</option>
              {jobPostings?.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} ({job.applications_count} applications)
                </option>
              ))}
            </select>
          </div>

          {/* AI Action Buttons */}
          <div className="flex gap-2 items-end">
            <button
              onClick={() => selectedJobId && handleGetAIRecommendations(selectedJobId)}
              disabled={!selectedJobId}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <TrendingUp className="w-4 h-4" />
              Get AI Recommendations
            </button>

            <button
              onClick={() => selectedJobId && handleAutoScoreApplications(selectedJobId)}
              disabled={!selectedJobId}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <Award className="w-4 h-4" />
              Auto Score Applications
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: showFilters ? 'auto' : 0,
          opacity: showFilters ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skills (comma-separated)
              </label>
              <input
                type="text"
                value={searchFilters.skills}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="React, Python, Machine Learning"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Experience Level
              </label>
              <select
                value={searchFilters.experience_level}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, experience_level: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                Min Experience (years)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={searchFilters.min_experience_years}
                onChange={(e) => setSearchFilters(prev => ({
                  ...prev,
                  min_experience_years: parseInt(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
                placeholder="New York, Remote, etc."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Min Communication Score
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={searchFilters.min_communication_score}
                onChange={(e) => setSearchFilters(prev => ({
                  ...prev,
                  min_communication_score: parseInt(e.target.value) || 0
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Results Limit
              </label>
              <select
                value={searchFilters.limit}
                onChange={(e) => setSearchFilters(prev => ({
                  ...prev,
                  limit: parseInt(e.target.value)
                }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value={10}>10 results</option>
                <option value={20}>20 results</option>
                <option value={50}>50 results</option>
                <option value={100}>100 results</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {isLoading ? 'Searching...' : 'Search Candidates'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Results */}
      {candidates && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Search Results ({candidates.length} candidates)
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                Found {candidates.length} matching candidates
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {candidates.map((candidate) => (
              <motion.div
                key={candidate.employee.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-semibold text-lg">
                          {candidate.employee.first_name[0]}{candidate.employee.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {candidate.employee.first_name} {candidate.employee.last_name}
                        </h3>
                        <p className="text-gray-600">{candidate.employee.email}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(candidate.match_summary.experience_years)}`}>
                          {candidate.match_summary.experience_years} years exp
                        </span>
                      </div>

                      {candidate.match_summary.communication_score && (
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCommunicationColor(candidate.match_summary.communication_score)}`}>
                            {candidate.match_summary.communication_score}% communication
                          </span>
                        </div>
                      )}

                      {candidate.match_summary.ai_match_score && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                            {candidate.match_summary.ai_match_score}% AI match
                          </span>
                        </div>
                      )}

                      {candidate.resume_analysis.contact_info?.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {candidate.resume_analysis.contact_info.location}
                          </span>
                        </div>
                      )}
                    </div>

                    {candidate.match_summary.skills_match && candidate.match_summary.skills_match.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Matching Skills:</p>
                        <div className="flex flex-wrap gap-2">
                          {candidate.match_summary.skills_match.slice(0, 6).map((skill, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {candidate.match_summary.skills_match.length > 6 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 dark:text-gray-300 dark:text-gray-600 rounded-md text-xs font-medium">
                              +{candidate.match_summary.skills_match.length - 6} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {candidate.resume_analysis.summary && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 dark:text-gray-600 line-clamp-2">
                        {candidate.resume_analysis.summary}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => setSelectedCandidate(candidate)}
                      className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </button>

                    <button
                      onClick={() => handleScheduleInterview(candidate)}
                      className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      Schedule Interview
                    </button>

                    <button
                      onClick={() => handleContactCandidate(candidate)}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      Contact
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* AI Recommendations */}
      {showAIRecommendations && selectedJobId && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                AI Candidate Recommendations
                {jobPostings && (
                  <span className="text-sm font-normal text-gray-600">
                    for "{jobPostings.find(j => j.id === selectedJobId)?.title}"
                  </span>
                )}
              </h2>
              <button
                onClick={() => setShowAIRecommendations(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>

          {loadingRecommendations ? (
            <div className="p-12 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Getting AI recommendations...</p>
            </div>
          ) : aiRecommendations && aiRecommendations.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {aiRecommendations.map((candidate) => (
                <motion.div
                  key={candidate.employee.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-purple-50 transition-colors border-l-4 border-l-purple-500"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                    <span className="text-sm font-medium text-purple-600">AI Recommended</span>
                    {candidate.match_summary.ai_match_score && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                        {candidate.match_summary.ai_match_score}% match
                      </span>
                    )}
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-purple-600 font-semibold text-lg">
                            {candidate.employee.first_name[0]}{candidate.employee.last_name[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {candidate.employee.first_name} {candidate.employee.last_name}
                          </h3>
                          <p className="text-gray-600">{candidate.employee.email}</p>
                        </div>
                      </div>

                      {/* AI Matching Details */}
                      {candidate.match_summary.ai_matching_details && (
                        <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">AI Analysis:</h4>
                          {candidate.match_summary.strengths && candidate.match_summary.strengths.length > 0 && (
                            <div className="mb-2">
                              <span className="text-xs font-medium text-green-700">Strengths:</span>
                              <ul className="text-xs text-green-600 ml-2">
                                {candidate.match_summary.strengths.map((strength, index) => (
                                  <li key={index}>• {strength}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {candidate.match_summary.recommendations && candidate.match_summary.recommendations.length > 0 && (
                            <div>
                              <span className="text-xs font-medium text-blue-700">Recommendations:</span>
                              <ul className="text-xs text-blue-600 ml-2">
                                {candidate.match_summary.recommendations.map((rec, index) => (
                                  <li key={index}>• {rec}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-gray-400" />
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceColor(candidate.match_summary.experience_years)}`}>
                            {candidate.match_summary.experience_years} years exp
                          </span>
                        </div>

                        {candidate.match_summary.communication_score && (
                          <div className="flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400" />
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCommunicationColor(candidate.match_summary.communication_score)}`}>
                              {candidate.match_summary.communication_score}% communication
                            </span>
                          </div>
                        )}
                      </div>

                      {candidate.match_summary.skills_match && candidate.match_summary.skills_match.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Matching Skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {candidate.match_summary.skills_match.slice(0, 6).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={() => setSelectedCandidate(candidate)}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>

                      <button
                        onClick={() => handleScheduleInterview(candidate)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Calendar className="w-4 h-4" />
                        Schedule Interview
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <TrendingUp className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No AI recommendations found
              </h3>
              <p className="text-gray-600">
                No candidates match the AI criteria for this job posting.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!candidates && !isLoading && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Search for Candidates
          </h3>
          <p className="text-gray-600 dark:text-gray-300 dark:text-gray-600 mb-6">
            Use the filters above to search through our talent pool and find the perfect candidates for your roles.
          </p>
          <button
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors mx-auto"
          >
            <Search className="w-4 h-4" />
            Start Searching
          </button>
        </div>
      )}

      {/* Candidate Detail Modal would go here */}
      {selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCandidate.employee.first_name} {selectedCandidate.employee.last_name}
                </h2>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Info */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedCandidate.employee.email}</span>
                    </div>
                    {selectedCandidate.resume_analysis.contact_info?.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{selectedCandidate.resume_analysis.contact_info.phone}</span>
                      </div>
                    )}
                    {selectedCandidate.resume_analysis.contact_info?.location && (
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{selectedCandidate.resume_analysis.contact_info.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills & Experience */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Skills & Experience</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-gray-600">Experience Level:</span>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                        {selectedCandidate.resume_analysis.experience_level}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Total Experience:</span>
                      <span className="ml-2 font-medium">
                        {selectedCandidate.match_summary.experience_years} years
                      </span>
                    </div>
                    {selectedCandidate.match_summary.communication_score && (
                      <div>
                        <span className="text-sm text-gray-600">Communication Score:</span>
                        <span className="ml-2 font-medium text-green-600">
                          {selectedCandidate.match_summary.communication_score}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary */}
              {selectedCandidate.resume_analysis.summary && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Professional Summary</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedCandidate.resume_analysis.summary}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => handleScheduleInterview(selectedCandidate)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Interview
                </button>

                <button
                  onClick={() => handleContactCandidate(selectedCandidate)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Send Message
                </button>

                <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Download Resume
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};