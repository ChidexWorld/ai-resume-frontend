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
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingStream, setRecordingStream] = useState<MediaStream | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'processing' | 'analyzing' | 'complete'>('idle');
  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const autoStopRef = React.useRef<NodeJS.Timeout | null>(null);

  const { data: voiceAnalyses, isLoading: voiceLoading } = useQuery({
    queryKey: ['voice-analyses'],
    queryFn: () => employeeService.getVoiceAnalyses()
  });

  const { data: assessments, isLoading: assessmentsLoading } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => employeeService.getAssessments()
  });

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (autoStopRef.current) clearTimeout(autoStopRef.current);
      if (recordingStream) {
        recordingStream.getTracks().forEach(track => track.stop());
      }
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [recordingStream, audioUrl]);

  const startRecording = async () => {
    console.log('🎤 Starting recording...');

    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error('Your browser does not support audio recording');
        console.error('getUserMedia not supported');
        return;
      }

      console.log('📱 Requesting microphone access...');

      // Request microphone access with simple settings
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      console.log('✅ Microphone access granted', stream);

      // Check MediaRecorder support
      if (!window.MediaRecorder) {
        toast.error('Your browser does not support MediaRecorder');
        console.error('MediaRecorder not supported');
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      // Try different mime types
      let options = {};
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        options = { mimeType: 'audio/webm' };
        console.log('🎵 Using audio/webm');
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        options = { mimeType: 'audio/ogg' };
        console.log('🎵 Using audio/ogg');
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options = { mimeType: 'audio/mp4' };
        console.log('🎵 Using audio/mp4');
      } else {
        console.log('🎵 Using default mime type');
      }

      // Create MediaRecorder
      const recorder = new MediaRecorder(stream, options);
      const chunks: BlobPart[] = [];

      console.log('📼 MediaRecorder created', recorder.mimeType);

      recorder.ondataavailable = (e) => {
        console.log('📦 Data available:', e.data.size, 'bytes');
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        console.log('⏹️ Recording stopped. Chunks:', chunks.length);

        if (chunks.length === 0) {
          console.error('❌ No audio data recorded');
          toast.error('No audio was recorded. Please try again.');
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        // Create blob
        const blob = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
        console.log('💾 Blob created:', blob.size, 'bytes, type:', blob.type);

        setAudioBlob(blob);

        // Create URL for playback
        const url = URL.createObjectURL(blob);
        console.log('🔗 Blob URL created:', url);
        setAudioUrl(url);

        // Stop all tracks
        stream.getTracks().forEach(track => {
          track.stop();
          console.log('🛑 Track stopped:', track.kind);
        });
        setRecordingStream(null);

        toast.success('Recording completed! You can now play it back.');
      };

      recorder.onerror = (e: Event) => {
        console.error('❌ Recording error:', e);
        toast.error('Recording error occurred');
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.onstart = () => {
        console.log('▶️ Recording started');
        toast.success('Recording started - speak now!');
      };

      // Start recording
      console.log('🚀 Starting recorder...');
      recorder.start(1000); // Collect data every second

      setMediaRecorder(recorder);
      setRecordingStream(stream);
      setIsRecording(true);

      // Reset and start timer
      let seconds = 0;
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        seconds += 1;
        setRecordingTime(seconds);
        console.log('⏱️ Recording time:', seconds, 's');
      }, 1000);

      // Auto stop after 5 minutes
      autoStopRef.current = setTimeout(() => {
        console.log('⏰ Auto-stop timeout reached');
        if (recorder.state === 'recording') {
          stopRecording();
          toast.success('Recording completed (5 minute limit)');
        }
      }, 300000);

    } catch (error: any) {
      console.error('❌ Microphone access error:', error);

      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        toast.error('Microphone permission denied. Please allow access and try again.');
      } else if (error.name === 'NotFoundError') {
        toast.error('No microphone found. Please connect a microphone.');
      } else {
        toast.error(`Failed to access microphone: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const stopRecording = () => {
    console.log('⏹️ Stopping recording...', {
      hasRecorder: !!mediaRecorder,
      recorderState: mediaRecorder?.state
    });

    if (mediaRecorder) {
      if (mediaRecorder.state === 'recording') {
        console.log('🛑 Calling recorder.stop()');
        mediaRecorder.stop();
        setIsRecording(false);
      } else {
        console.log('⚠️ Recorder not in recording state:', mediaRecorder.state);
        setIsRecording(false);
      }

      // Clear timers
      if (timerRef.current) {
        console.log('🔄 Clearing timer');
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (autoStopRef.current) {
        console.log('🔄 Clearing auto-stop timeout');
        clearTimeout(autoStopRef.current);
        autoStopRef.current = null;
      }
    } else {
      console.error('❌ No media recorder to stop');
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
  };

  const uploadVoiceAnalysis = async () => {
    if (!audioBlob) return;

    try {
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStatus('uploading');

      // Determine file extension based on blob type
      const fileExtension = audioBlob.type.includes('webm') ? 'webm' :
                           audioBlob.type.includes('mp4') ? 'm4a' : 'wav';

      const file = new File([audioBlob], `voice-sample.${fileExtension}`, { type: audioBlob.type });

      // Upload with progress tracking
      await employeeService.uploadVoiceAnalysis(file, (progress) => {
        setUploadProgress(progress);
        if (progress === 100) {
          setUploadStatus('processing');
        }
      });

      // Simula status updates (since backend doesn't send them yet)
      setUploadStatus('analyzing');
      setTimeout(() => {
        setUploadStatus('complete');
        toast.success('Voice analysis complete!');
        resetRecording();
        setIsUploading(false);
        setUploadStatus('idle');
        setUploadProgress(0);
        // Refetch voice analyses
        window.location.reload();
      }, 2000);

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error?.response?.data?.detail || 'Failed to upload voice sample');
      setIsUploading(false);
      setUploadStatus('idle');
      setUploadProgress(0);
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
              {/* Debug Info */}
              <div className="w-full max-w-md p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
                <p className="text-xs text-blue-800 dark:text-blue-200 mb-2">
                  <strong>Browser Support:</strong>
                </p>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
                  <li>• getUserMedia: {navigator.mediaDevices ? '✅ Supported' : '❌ Not supported'}</li>
                  <li>• MediaRecorder: {window.MediaRecorder ? '✅ Supported' : '❌ Not supported'}</li>
                  <li>• WebM: {window.MediaRecorder && MediaRecorder.isTypeSupported('audio/webm') ? '✅ Yes' : '❌ No'}</li>
                  <li>• MP4: {window.MediaRecorder && MediaRecorder.isTypeSupported('audio/mp4') ? '✅ Yes' : '❌ No'}</li>
                </ul>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                  Open browser console (F12) to see detailed logs
                </p>
              </div>

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

                {audioBlob && !isUploading && (
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
              {audioBlob && audioUrl && !isUploading && (
                <div className="w-full max-w-md">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    Preview your recording:
                  </p>
                  <audio
                    controls
                    src={audioUrl}
                    className="w-full"
                    preload="metadata"
                  >
                    Your browser does not support audio playback.
                  </audio>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Duration: {formatTime(recordingTime)}
                  </p>
                </div>
              )}

              {/* Upload Progress */}
              {isUploading && (
                <div className="w-full max-w-md space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {uploadStatus === 'uploading' && 'Uploading voice sample...'}
                      {uploadStatus === 'processing' && 'Processing audio...'}
                      {uploadStatus === 'analyzing' && 'Analyzing communication skills...'}
                      {uploadStatus === 'complete' && 'Analysis complete!'}
                    </span>
                    <span className="text-gray-500">
                      {uploadStatus === 'uploading' ? `${uploadProgress}%` : ''}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                      style={{
                        width: `${uploadStatus === 'uploading' ? uploadProgress : 100}%`
                      }}
                    >
                      {(uploadStatus === 'processing' || uploadStatus === 'analyzing') && (
                        <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                      )}
                    </div>
                  </div>

                  {/* Status Icon */}
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {uploadStatus === 'uploading' && (
                      <>
                        <Upload className="w-4 h-4 animate-pulse" />
                        <span>Uploading file...</span>
                      </>
                    )}
                    {uploadStatus === 'processing' && (
                      <>
                        <Volume2 className="w-4 h-4 animate-pulse" />
                        <span>Transcribing audio...</span>
                      </>
                    )}
                    {uploadStatus === 'analyzing' && (
                      <>
                        <Brain className="w-4 h-4 animate-pulse" />
                        <span>Analyzing speech patterns...</span>
                      </>
                    )}
                    {uploadStatus === 'complete' && (
                      <>
                        <Check className="w-4 h-4 text-green-600" />
                        <span className="text-green-600">Processing complete!</span>
                      </>
                    )}
                  </div>
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
  const overallScore = analysis.overall_communication_score || 0;
  const fluencyScore = analysis.fluency_score || 0;
  const clarityScore = analysis.clarity_score || 0;
  const confidenceScore = analysis.confidence_score || 0;
  const paceScore = analysis.pace_score || 0;

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            Voice Analysis #{analysis.id}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {format(new Date(analysis.created_at), 'MMMM d, yyyy \'at\' h:mm a')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Duration: {analysis.duration_seconds || 0}s
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(overallScore)}`}>
            {overallScore}% Overall
          </span>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Fluency</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{fluencyScore}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Clarity</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{clarityScore}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Confidence</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{confidenceScore}%</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 dark:text-gray-400">Pace</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">{paceScore}%</p>
        </div>
      </div>

      {analysis.analysis_results && (
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <strong>Key Insights:</strong> {analysis.analysis_results.summary || 'Analysis completed successfully'}
          </p>
        </div>
      )}
    </div>
  );
};