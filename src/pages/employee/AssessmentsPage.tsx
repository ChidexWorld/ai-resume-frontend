import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  Mic,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Check,
  Clock,
  TrendingUp,
  BarChart3,
  Volume2,
  FileText,
  Star,
  Target,
  Users,
  Zap,
  Brain,
  MessageSquare,
  Download
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { employeeService, type VoiceAnalysis } from '../../services/employeeService';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

export const AssessmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'voice' | 'skills' | 'results'>('voice');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const { data: voiceAnalyses, isLoading: voiceLoading } = useQuery({
    queryKey: ['voice-analyses'],
    queryFn: () => employeeService.getVoiceAnalyses()
  });

  const { data: assessments, isLoading: assessmentsLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => employeeService.getAssessments()
  });

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Start timer
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      // Auto stop after 5 minutes
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
          clearInterval(timer);
        }
      }, 300000);

    } catch (error) {
      toast.error('Failed to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const resetRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
  };

  const uploadVoiceAnalysis = async () => {
    if (!audioBlob) return;

    try {
      const file = new File([audioBlob], 'voice-sample.wav', { type: 'audio/wav' });
      await employeeService.uploadVoiceAnalysis(file);
      toast.success('Voice sample uploaded for analysis!');
      resetRecording();
      // Refetch voice analyses
    } catch (error) {
      toast.error('Failed to upload voice sample');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-blue-600 bg-blue-100';
    if (score >= 40) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const latestVoiceAnalysis = voiceAnalyses?.[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills Assessment</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Evaluate your communication skills and track your progress
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Award className="w-6 h-6 text-primary-600" />
          <span className="text-sm text-gray-600">
            {voiceAnalyses?.length || 0} assessments completed
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Volume2 className="w-5 h-5 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Overall Score</p>
              <p className="text-xl font-bold text-gray-900">
                {latestVoiceAnalysis?.overall_communication_score || '--'}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Fluency</p>
              <p className="text-xl font-bold text-gray-900">
                {latestVoiceAnalysis?.fluency_score || '--'}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-5 h-5 text-purple-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Clarity</p>
              <p className="text-xl font-bold text-gray-900">
                {latestVoiceAnalysis?.clarity_score || '--'}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-500">Confidence</p>
              <p className="text-xl font-bold text-gray-900">
                {latestVoiceAnalysis?.confidence_score || '--'}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        <button
          onClick={() => setActiveTab('voice')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'voice'
              ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Mic className="w-4 h-4" />
            Voice Assessment
          </div>
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'skills'
              ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Skills Tests
          </div>
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'results'
              ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-300 hover:text-gray-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Results & Progress
          </div>
        </button>
      </div>

      {/* Voice Assessment Tab */}
      {activeTab === 'voice' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Voice Recording Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Record Voice Sample</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Record a 2-3 minute voice sample to analyze your communication skills.
              You can talk about your career goals, experience, or answer sample interview questions.
            </p>

            <div className="flex flex-col items-center space-y-6">
              {/* Recording Controls */}
              <div className="flex items-center space-x-4">
                {!isRecording && !audioBlob && (
                  <button
                    onClick={startRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </button>
                )}

                {isRecording && (
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Pause className="w-5 h-5" />
                    Stop Recording
                  </button>
                )}

                {audioBlob && (
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={resetRecording}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Reset
                    </button>
                    <button
                      onClick={uploadVoiceAnalysis}
                      className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload for Analysis
                    </button>
                  </div>
                )}
              </div>

              {/* Recording Timer */}
              {isRecording && (
                <div className="flex items-center space-x-2 text-red-600">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="font-mono text-lg">{formatTime(recordingTime)}</span>
                </div>
              )}

              {/* Audio Playback */}
              {audioBlob && (
                <div className="w-full max-w-md">
                  <audio
                    controls
                    src={URL.createObjectURL(audioBlob)}
                    className="w-full"
                  />
                </div>
              )}
            </div>

            {/* Tips */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Recording Tips:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Speak clearly and at a natural pace</li>
                <li>• Find a quiet environment without background noise</li>
                <li>• Talk about your experience, skills, or career goals</li>
                <li>• Aim for 2-3 minutes of speaking time</li>
                <li>• Be natural and authentic in your speech</li>
              </ul>
            </div>
          </div>

          {/* File Upload Alternative */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Audio File</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Alternatively, you can upload an existing audio file (MP3, WAV, M4A)
            </p>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-300 mb-2">Drag and drop your audio file here, or</p>
              <button className="text-primary-600 hover:text-primary-700 font-medium">
                browse files
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Supported formats: MP3, WAV, M4A (max 50MB)
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Skills Tests Tab */}
      {activeTab === 'skills' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Available Skill Assessments</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'Communication Skills',
                  description: 'Assess your written and verbal communication abilities',
                  duration: '15 minutes',
                  icon: MessageSquare,
                  difficulty: 'Intermediate',
                  completed: false
                },
                {
                  title: 'Problem Solving',
                  description: 'Test your analytical and critical thinking skills',
                  duration: '20 minutes',
                  icon: Brain,
                  difficulty: 'Advanced',
                  completed: false
                },
                {
                  title: 'Leadership Assessment',
                  description: 'Evaluate your leadership and team management skills',
                  duration: '25 minutes',
                  icon: Users,
                  difficulty: 'Advanced',
                  completed: true
                },
                {
                  title: 'Technical Aptitude',
                  description: 'Test your technical knowledge and problem-solving',
                  duration: '30 minutes',
                  icon: Target,
                  difficulty: 'Expert',
                  completed: false
                }
              ].map((assessment, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary-100 rounded-lg">
                      <assessment.icon className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{assessment.title}</h3>
                      <p className="text-xs text-gray-500">{assessment.difficulty}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{assessment.description}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      {assessment.duration}
                    </div>
                    {assessment.completed ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <Check className="w-4 h-4" />
                        Completed
                      </div>
                    ) : (
                      <button className="px-3 py-1 bg-primary-600 text-white rounded text-sm hover:bg-primary-700 transition-colors">
                        Start
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Results Tab */}
      {activeTab === 'results' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Voice Analysis Results */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Voice Analysis History</h2>

            {voiceLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading analysis results...</p>
              </div>
            ) : voiceAnalyses && voiceAnalyses.length > 0 ? (
              <div className="space-y-4">
                {voiceAnalyses.map((analysis) => (
                  <VoiceAnalysisCard key={analysis.id} analysis={analysis} getScoreColor={getScoreColor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Mic className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No voice analyses yet</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Complete your first voice assessment to see detailed results and progress tracking
                </p>
                <button
                  onClick={() => setActiveTab('voice')}
                  className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Start Voice Assessment
                </button>
              </div>
            )}
          </div>

          {/* Progress Chart */}
          {voiceAnalyses && voiceAnalyses.length > 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-xl font-semibold mb-4">Progress Tracking</h2>
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-16 h-16 mx-auto mb-4" />
                <p>Progress chart visualization would be implemented here</p>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

// Voice Analysis Card Component
interface VoiceAnalysisCardProps {
  analysis: VoiceAnalysis;
  getScoreColor: (score: number) => string;
}

const VoiceAnalysisCard: React.FC<VoiceAnalysisCardProps> = ({ analysis, getScoreColor }) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">
            Voice Analysis #{analysis.id}
          </h3>
          <p className="text-sm text-gray-600">
            {format(new Date(analysis.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
          </p>
          <p className="text-xs text-gray-500">
            Duration: {analysis.duration_seconds}s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(analysis.overall_communication_score)}`}>
            {analysis.overall_communication_score}% Overall
          </span>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-600">Fluency</p>
          <p className="font-semibold">{analysis.fluency_score}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Clarity</p>
          <p className="font-semibold">{analysis.clarity_score}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Confidence</p>
          <p className="font-semibold">{analysis.confidence_score}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-600">Pace</p>
          <p className="font-semibold">{analysis.pace_score}%</p>
        </div>
      </div>

      {analysis.analysis_results && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-700">
            <strong>Key Insights:</strong> {analysis.analysis_results.summary || 'Analysis completed successfully'}
          </p>
        </div>
      )}
    </div>
  );
};