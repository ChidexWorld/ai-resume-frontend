import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  User,
  MapPin,
  Briefcase,
  Star,
  Mail,
  Phone,
  Download,
  MessageSquare,
  Clock,
  Target
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { employerService, type CandidateSearchResponse } from '../../services/employerService';

interface CandidateSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CandidateSearchModal: React.FC<CandidateSearchModalProps> = ({
  isOpen,
  onClose
}) => {
  const [searchParams, setSearchParams] = useState({
    skills: '',
    experience_level: '',
    min_experience_years: '',
    location: '',
    min_communication_score: ''
  });
  const [hasSearched, setHasSearched] = useState(false);

  const { data: candidates, isLoading, refetch } = useQuery({
    queryKey: ['candidate-search', searchParams],
    queryFn: () => {
      const params: any = {};
      if (searchParams.skills) params.skills = searchParams.skills;
      if (searchParams.experience_level) params.experience_level = searchParams.experience_level;
      if (searchParams.min_experience_years) params.min_experience_years = parseInt(searchParams.min_experience_years);
      if (searchParams.location) params.location = searchParams.location;
      if (searchParams.min_communication_score) params.min_communication_score = parseInt(searchParams.min_communication_score);

      return employerService.searchCandidates(params);
    },
    enabled: false
  });

  const handleSearch = () => {
    setHasSearched(true);
    refetch();
  };

  const handleInputChange = (field: string, value: string) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 bg-green-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    if (score >= 50) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Search Candidates</h2>
                  <p className="text-gray-600">Find the perfect candidates for your positions</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Search Form */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Criteria</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Skills (comma separated)
                    </label>
                    <input
                      type="text"
                      value={searchParams.skills}
                      onChange={(e) => handleInputChange('skills', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="React, Node.js, Python..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Experience Level
                    </label>
                    <select
                      value={searchParams.experience_level}
                      onChange={(e) => handleInputChange('experience_level', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Any level</option>
                      <option value="entry">Entry Level</option>
                      <option value="junior">Junior</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior</option>
                      <option value="lead">Lead</option>
                      <option value="principal">Principal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Experience (years)
                    </label>
                    <input
                      type="number"
                      value={searchParams.min_experience_years}
                      onChange={(e) => handleInputChange('min_experience_years', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={searchParams.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="New York, Remote..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min. Communication Score
                    </label>
                    <input
                      type="number"
                      value={searchParams.min_communication_score}
                      onChange={(e) => handleInputChange('min_communication_score', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="0-100"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleSearch}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Search className="w-4 h-4" />
                      {isLoading ? 'Searching...' : 'Search Candidates'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Search Results */}
              {hasSearched && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Search Results
                    </h3>
                    <span className="text-sm text-gray-600">
                      {candidates?.length || 0} candidates found
                    </span>
                  </div>

                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                      <p className="text-gray-500">Searching for candidates...</p>
                    </div>
                  ) : candidates && candidates.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {candidates.map((candidate) => (
                        <div
                          key={candidate.employee.id}
                          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-blue-300 transition-colors"
                        >
                          {/* Candidate Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {candidate.employee.first_name} {candidate.employee.last_name}
                                </h4>
                                <p className="text-sm text-gray-600">{candidate.employee.email}</p>
                              </div>
                            </div>
                            {candidate.match_summary.ai_match_score && (
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchScoreColor(candidate.match_summary.ai_match_score)}`}>
                                {candidate.match_summary.ai_match_score}% match
                              </div>
                            )}
                          </div>

                          {/* Resume Info */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-600">Experience Level</p>
                              <p className="font-medium">{candidate.resume_analysis.experience_level}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Experience</p>
                              <p className="font-medium">{candidate.match_summary.experience_years} years</p>
                            </div>
                          </div>

                          {/* Skills */}
                          {candidate.match_summary.skills_match && candidate.match_summary.skills_match.length > 0 && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600 mb-2">Matching Skills</p>
                              <div className="flex flex-wrap gap-2">
                                {candidate.match_summary.skills_match.slice(0, 5).map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {candidate.match_summary.skills_match.length > 5 && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">
                                    +{candidate.match_summary.skills_match.length - 5} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Communication Score */}
                          {candidate.match_summary.communication_score && (
                            <div className="mb-4">
                              <p className="text-sm text-gray-600">Communication Score</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full"
                                    style={{ width: `${candidate.match_summary.communication_score}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{candidate.match_summary.communication_score}/100</span>
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2 pt-4 border-t border-gray-200">
                            <button className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              <MessageSquare className="w-4 h-4" />
                              Contact
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                              <Download className="w-4 h-4" />
                              Resume
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-gray-500">No candidates found matching your criteria</p>
                      <p className="text-sm text-gray-400 mt-1">Try adjusting your search parameters</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};