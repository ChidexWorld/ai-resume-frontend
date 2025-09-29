import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  FileText,
  Mic,
  Send,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Star,
  TrendingUp,
  Plus,
  ChevronRight
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService, type Resume, type VoiceAnalysis, type JobPosting } from '../../services/employeeService';
import { ResumeSelectionModal } from '../resume/ResumeSelectionModal';
import toast from 'react-hot-toast';

interface JobApplicationModalProps {
  job: JobPosting;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [selectedVoiceAnalysisId, setSelectedVoiceAnalysisId] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [showResumeSelection, setShowResumeSelection] = useState(false);
  const queryClient = useQueryClient();

  // Get user's resumes
  const { data: resumes } = useQuery({
    queryKey: ['resumes'],
    queryFn: employeeService.getResumes,
    enabled: isOpen
  });

  // Get user's voice analyses
  const { data: voiceAnalyses } = useQuery({
    queryKey: ['voice-analyses'],
    queryFn: employeeService.getVoiceAnalyses,
    enabled: isOpen
  });

  // Get job match analysis if resume is selected
  const { data: matchAnalysis, isLoading: matchLoading } = useQuery({
    queryKey: ['job-match', job.id, selectedResumeId],
    queryFn: () => employeeService.analyzeJobMatch(job.id, selectedResumeId || undefined),
    enabled: isOpen && selectedResumeId !== null
  });

  // Application mutation
  const applicationMutation = useMutation({
    mutationFn: (data: {
      resume_id?: number;
      voice_analysis_id?: number;
      cover_letter?: string;
    }) => employeeService.applyToJob(job.id, data),
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      onSuccess?.();
      onClose();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || 'Failed to submit application';
      toast.error(message);
    }
  });

  const analyzedResumes = resumes?.filter(r => r.analysis_status === 'analyzed') || [];
  const completedVoiceAnalyses = voiceAnalyses?.filter(va => va.analysis_status === 'completed') || [];

  const handleResumeSelect = (resume: Resume) => {
    setSelectedResume(resume);
    setSelectedResumeId(resume.id);
    setShowResumeSelection(false);
  };

  const handleSubmit = () => {
    if (!selectedResumeId && !selectedVoiceAnalysisId) {
      toast.error('Please select at least a resume or voice analysis');
      return;
    }

    applicationMutation.mutate({
      resume_id: selectedResumeId || undefined,
      voice_analysis_id: selectedVoiceAnalysisId || undefined,
      cover_letter: coverLetter.trim() || undefined
    });
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Apply to Job</h2>
            <p className="text-sm text-gray-600 mt-1">{job.title} at {job.company_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Job Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium text-gray-900">{job.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{job.location}</p>
                <p className="text-sm text-green-600 font-medium mt-1">{job.salary_range}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {job.job_type}
                </span>
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                  {job.experience_level}
                </span>
                {job.remote_allowed && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                    Remote OK
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Resume Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Select Resume</h3>
              <span className="text-sm text-gray-500">(Required)</span>
            </div>

            <div className="space-y-3">
              {selectedResume ? (
                // Show selected resume
                <div className="border border-blue-500 bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 mb-1">
                          {selectedResume.original_filename}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          {selectedResume.analysis_results?.experience_level && (
                            <span className="capitalize">{selectedResume.analysis_results.experience_level}</span>
                          )}
                          {selectedResume.analysis_results?.total_experience_years !== undefined && (
                            <span>{selectedResume.analysis_results.total_experience_years} years exp</span>
                          )}
                        </div>
                        {selectedResume.analysis_results?.contact_info?.email && (
                          <p className="text-sm text-gray-600">{selectedResume.analysis_results.contact_info.email}</p>
                        )}
                        {selectedResume.analysis_results?.skills && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {Object.values(selectedResume.analysis_results.skills)
                              .flat()
                              .slice(0, 4)
                              .map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                                >
                                  {skill}
                                </span>
                              ))}
                            {Object.values(selectedResume.analysis_results.skills).flat().length > 4 && (
                              <span className="text-xs text-gray-500 px-2 py-1">
                                +{Object.values(selectedResume.analysis_results.skills).flat().length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-1" />
                  </div>
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blue-200">
                    <button
                      onClick={() => setShowResumeSelection(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Choose Different Resume
                    </button>
                  </div>
                </div>
              ) : (
                // Show selection button
                <button
                  onClick={() => setShowResumeSelection(true)}
                  className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 transition-colors text-center group"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-3 bg-gray-100 group-hover:bg-blue-100 rounded-lg transition-colors">
                      <Plus className="w-6 h-6 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
                        Choose Resume from {analyzedResumes.length} analyzed resume{analyzedResumes.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500 group-hover:text-blue-600">
                        Select the resume you want to use for this application
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                  </div>
                </button>
              )}

              {analyzedResumes.length === 0 && (
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">No analyzed resumes found</p>
                    <p className="text-xs text-gray-600">Please upload and analyze a resume first.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Match Analysis */}
          {selectedResumeId && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <h3 className="text-lg font-medium text-gray-900">Job Match Analysis</h3>
              </div>

              {matchLoading ? (
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-primary-600 mr-2" />
                  <span className="text-sm text-gray-600">Analyzing job match...</span>
                </div>
              ) : matchAnalysis ? (
                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Overall Match Score</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      getMatchScoreColor(matchAnalysis.match_analysis.overall_score)
                    }`}>
                      {matchAnalysis.match_analysis.overall_score}%
                    </span>
                  </div>

                  {matchAnalysis.match_analysis.strengths.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-green-700 mb-2">Your Strengths</h4>
                      <div className="flex flex-wrap gap-1">
                        {matchAnalysis.match_analysis.strengths.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchAnalysis.match_analysis.gaps.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-orange-700 mb-2">Areas to Improve</h4>
                      <div className="flex flex-wrap gap-1">
                        {matchAnalysis.match_analysis.gaps.slice(0, 5).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <p className="text-sm text-gray-600">Unable to analyze job match at this time.</p>
                </div>
              )}
            </div>
          )}

          {/* Voice Analysis Selection (Optional) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900">Voice Analysis</h3>
              <span className="text-sm text-gray-500">(Optional)</span>
            </div>

            {completedVoiceAnalyses.length > 0 ? (
              <div className="space-y-2">
                <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300">
                  <input
                    type="radio"
                    name="voice"
                    value=""
                    checked={selectedVoiceAnalysisId === null}
                    onChange={() => setSelectedVoiceAnalysisId(null)}
                    className="sr-only"
                  />
                  <span className="text-sm text-gray-600">No voice analysis</span>
                  {selectedVoiceAnalysisId === null && (
                    <CheckCircle className="w-5 h-5 text-primary-600 ml-auto" />
                  )}
                </label>

                {completedVoiceAnalyses.map((voiceAnalysis) => (
                  <label
                    key={voiceAnalysis.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVoiceAnalysisId === voiceAnalysis.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="voice"
                      value={voiceAnalysis.id}
                      checked={selectedVoiceAnalysisId === voiceAnalysis.id}
                      onChange={() => setSelectedVoiceAnalysisId(voiceAnalysis.id)}
                      className="sr-only"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {voiceAnalysis.original_filename}
                        </p>
                        <div className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium text-gray-700">
                            {Math.round(voiceAnalysis.overall_communication_score || 0)}%
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Duration: {Math.round(voiceAnalysis.duration_seconds || 0)}s •
                        Created: {new Date(voiceAnalysis.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedVoiceAnalysisId === voiceAnalysis.id && (
                      <CheckCircle className="w-5 h-5 text-primary-600 ml-3" />
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <Mic className="w-5 h-5 text-gray-400" />
                <p className="text-sm text-gray-600">No voice analyses available. This is optional.</p>
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div className="space-y-3">
            <h3 className="text-lg font-medium text-gray-900">Cover Letter</h3>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Write a brief cover letter explaining why you're interested in this position..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <p className="text-xs text-gray-500">
              Optional: A cover letter can help you stand out from other applicants.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={applicationMutation.isPending || !selectedResumeId}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {applicationMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {applicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>

        {/* Resume Selection Modal */}
        <ResumeSelectionModal
          isOpen={showResumeSelection}
          onClose={() => setShowResumeSelection(false)}
          resumes={resumes || []}
          selectedResumeId={selectedResumeId}
          onSelectResume={handleResumeSelect}
          title="Choose Resume for Application"
        />
      </motion.div>
    </div>
  );
};