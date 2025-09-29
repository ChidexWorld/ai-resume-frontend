import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  FileText,
  Mic,
  Send,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Star,
  TrendingUp,
  MapPin,
  Building,
  DollarSign,
  Calendar,
  Clock,
  Users,
  Briefcase
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService } from '../../services/employeeService';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export const JobApplicationPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedResumeId, setSelectedResumeId] = useState<number | null>(null);
  const [selectedVoiceAnalysisId, setSelectedVoiceAnalysisId] = useState<number | null>(null);
  const [coverLetter, setCoverLetter] = useState('');

  // Validate job ID
  const parsedJobId = jobId ? parseInt(jobId, 10) : null;
  const isValidJobId = parsedJobId !== null && !isNaN(parsedJobId) && parsedJobId > 0;

  // Redirect if invalid job ID
  React.useEffect(() => {
    if (jobId && !isValidJobId) {
      navigate('/employee/jobs');
    }
  }, [jobId, isValidJobId, navigate]);

  // Get job details
  const { data: job, isLoading: jobLoading, error: jobError } = useQuery({
    queryKey: ['job-details', parsedJobId],
    queryFn: () => employeeService.getJobDetails(parsedJobId!),
    enabled: isValidJobId,
    retry: (failureCount, error: any) => {
      // Don't retry for 404 errors (job not found)
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    }
  });

  // Get user's resumes
  const { data: resumes, isLoading: resumesLoading, error: resumesError } = useQuery({
    queryKey: ['resumes'],
    queryFn: employeeService.getResumes
  });

  // Get user's voice analyses
  const { data: voiceAnalyses, isLoading: voiceLoading, error: voiceError } = useQuery({
    queryKey: ['voice-analyses'],
    queryFn: employeeService.getVoiceAnalyses
  });

  // Filter analyzed resumes and completed voice analyses
  const analyzedResumes = resumes?.filter(r =>
    r.status === 'analyzed' || r.status === 'ANALYZED' || r.is_analyzed
  ) || [];
  const completedVoiceAnalyses = voiceAnalyses?.filter(va =>
    va.status === 'completed' || va.status === 'COMPLETED'
  ) || [];


  // Get job match analysis if resume is selected
  const { data: matchAnalysis, isLoading: matchLoading } = useQuery({
    queryKey: ['job-match', parsedJobId, selectedResumeId],
    queryFn: () => employeeService.analyzeJobMatch(parsedJobId!, selectedResumeId || undefined),
    enabled: isValidJobId && selectedResumeId !== null
  });

  // Application mutation
  const applicationMutation = useMutation({
    mutationFn: (data: {
      resume_id?: number;
      voice_analysis_id?: number;
      cover_letter?: string;
    }) => employeeService.applyToJob(parsedJobId!, data),
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      navigate('/employee/applications');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || 'Failed to submit application';
      toast.error(message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
    if (score >= 80) return 'text-green-600 bg-green-100 border-green-300';
    if (score >= 60) return 'text-blue-600 bg-blue-100 border-blue-300';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    return 'text-red-600 bg-red-100 border-red-300';
  };

  // Handle invalid job ID
  if (!isValidJobId) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">Invalid job ID</p>
          <button
            onClick={() => navigate('/employee/jobs')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  // Handle job fetch error
  if (jobError) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Error Loading Job</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {jobError instanceof Error && jobError.message.includes('404')
              ? 'Job not found or may have been removed.'
              : 'There was an error loading the job details. Please try again.'
            }
          </p>
          <button
            onClick={() => navigate('/employee/jobs')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (jobLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Job Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">The job you're trying to apply for doesn't exist.</p>
          <button
            onClick={() => navigate('/employee/jobs')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (job.application_status) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <CheckCircle className="w-16 h-16 text-green-500 mb-4 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Already Applied</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You have already applied to this position on {format(new Date(job.applied_at!), 'MMM d, yyyy')}.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Status: <span className="font-medium capitalize">{job.application_status}</span>
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/employee/applications')}
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              View Applications
            </button>
            <button
              onClick={() => navigate('/employee/jobs')}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Apply to Job</h1>
                <p className="text-sm text-gray-600">{job.title} at {job.company_name}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Application in progress</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Application Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Summary Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{job.title}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-3">
                    <div className="flex items-center gap-1">
                      <Building className="w-4 h-4" />
                      <span>{job.company_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      <span>{job.salary_range}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                      {job.job_type.replace('_', ' ')}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                      {job.experience_level}
                    </span>
                    {job.remote_allowed && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
                        Remote OK
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Resume Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Select Your Resume</h3>
                    <p className="text-sm text-gray-600">Choose the resume that best matches this position</p>
                  </div>
                </div>

                {analyzedResumes.length > 0 ? (
                  <div className="space-y-3">
                    {analyzedResumes.map((resume) => (
                      <label
                        key={resume.id}
                        className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedResumeId === resume.id
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="resume"
                          value={resume.id}
                          checked={selectedResumeId === resume.id}
                          onChange={() => setSelectedResumeId(resume.id)}
                          className="sr-only"
                        />
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">{resume.original_filename}</h4>
                              {selectedResumeId === resume.id && (
                                <CheckCircle className="w-5 h-5 text-primary-600" />
                              )}
                            </div>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span>{resume.experience_level}</span>
                              <span>{resume.total_experience_years} years experience</span>
                              <span>Uploaded {format(new Date(resume.created_at), 'MMM d, yyyy')}</span>
                            </div>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No analyzed resumes found</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">Upload and analyze a resume to apply for jobs</p>
                    <button
                      type="button"
                      onClick={() => navigate('/employee/resumes')}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Upload Resume →
                    </button>
                  </div>
                )}
              </motion.div>

              {/* Voice Analysis Selection */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Mic className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Voice Analysis</h3>
                    <p className="text-sm text-gray-600">Optional: Include voice analysis to showcase communication skills</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-all">
                    <input
                      type="radio"
                      name="voice"
                      value=""
                      checked={selectedVoiceAnalysisId === null}
                      onChange={() => setSelectedVoiceAnalysisId(null)}
                      className="sr-only"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">No voice analysis</span>
                      {selectedVoiceAnalysisId === null && (
                        <CheckCircle className="w-5 h-5 text-primary-600" />
                      )}
                    </div>
                  </label>

                  {completedVoiceAnalyses.map((voiceAnalysis) => (
                    <label
                      key={voiceAnalysis.id}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedVoiceAnalysisId === voiceAnalysis.id
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 hover:bg-gray-50'
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
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{voiceAnalysis.original_filename}</h4>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="text-sm font-medium text-gray-700">
                                {Math.round(voiceAnalysis.overall_communication_score)}%
                              </span>
                              {selectedVoiceAnalysisId === voiceAnalysis.id && (
                                <CheckCircle className="w-5 h-5 text-primary-600 ml-2" />
                              )}
                            </div>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>{Math.round(voiceAnalysis.duration_seconds)}s duration</span>
                            <span>Created {format(new Date(voiceAnalysis.created_at), 'MMM d, yyyy')}</span>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Cover Letter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Cover Letter</h3>
                  <p className="text-sm text-gray-600">Tell the employer why you're interested in this position</p>
                </div>

                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Dear Hiring Manager,

I am excited to apply for the [Position Title] role at [Company Name]. With my background in [relevant experience], I believe I would be a valuable addition to your team...

[Customize this message to highlight your relevant skills and experience for this specific role]

Best regards,
[Your Name]"
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Optional but recommended: A personalized cover letter can help you stand out
                </p>
              </motion.div>

              {/* Submit Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">Ready to apply?</h3>
                    <p className="text-sm text-gray-600">
                      {selectedResumeId ? 'Your application will be submitted with your selected resume' : 'Please select a resume to continue'}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={applicationMutation.isPending || !selectedResumeId}
                    className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {applicationMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    {applicationMutation.isPending ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </motion.div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Match Analysis */}
            {selectedResumeId && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-primary-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Job Match Analysis</h3>
                </div>

                {matchLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
                    <span className="ml-2 text-gray-600">Analyzing match...</span>
                  </div>
                ) : matchAnalysis ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold border-2 ${
                        getMatchScoreColor(matchAnalysis.match_analysis.overall_score)
                      }`}>
                        <Star className="w-5 h-5 fill-current" />
                        {matchAnalysis.match_analysis.overall_score}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Overall match score</p>
                    </div>

                    {matchAnalysis.match_analysis.strengths.length > 0 && (
                      <div>
                        <h4 className="font-medium text-green-700 mb-2 text-sm">Your Strengths</h4>
                        <div className="space-y-1">
                          {matchAnalysis.match_analysis.strengths.slice(0, 4).map((skill, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                              <span className="text-gray-700">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchAnalysis.match_analysis.gaps.length > 0 && (
                      <div>
                        <h4 className="font-medium text-orange-700 mb-2 text-sm">Areas to Highlight</h4>
                        <div className="space-y-1">
                          {matchAnalysis.match_analysis.gaps.slice(0, 4).map((skill, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <AlertTriangle className="w-3 h-3 text-orange-600" />
                              <span className="text-gray-700">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <AlertTriangle className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Unable to analyze job match</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Application Tips */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-blue-50 rounded-lg border border-blue-200 p-6"
            >
              <h3 className="font-semibold text-blue-900 mb-3">Application Tips</h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Choose your most relevant resume for this position</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Include a voice analysis to showcase communication skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Personalize your cover letter for this specific role</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Review the match analysis to highlight your strengths</span>
                </li>
              </ul>
            </motion.div>

            {/* Job Statistics */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Job Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Posted</span>
                  <span className="font-medium">{format(new Date(job.created_at), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Applications</span>
                  <span className="font-medium">{job.applications_count || 0}</span>
                </div>
                {job.expires_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Expires</span>
                    <span className="font-medium">{format(new Date(job.expires_at), 'MMM d, yyyy')}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};