import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Eye,
  Trash2,
  Download,
  Plus,
  AlertCircle,
  CheckCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService, type Resume } from '../../services/employeeService';
import ResumeUpload from './ResumeUpload';
import ResumeAnalysis from './ResumeAnalysis';
import toast from 'react-hot-toast';

export const ResumeManager: React.FC = () => {
  const [showUpload, setShowUpload] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'analysis'>('list');

  const queryClient = useQueryClient();

  const { data: resumes, isLoading, error } = useQuery({
    queryKey: ['resumes'],
    queryFn: employeeService.getResumes
  });

  const deleteMutation = useMutation({
    mutationFn: employeeService.deleteResume,
    onSuccess: () => {
      toast.success('Resume deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
    },
    onError: () => {
      toast.error('Failed to delete resume');
    }
  });

  const refetch = () => {
    queryClient.invalidateQueries({ queryKey: ['resumes'] });
  };

  const handleUploadSuccess = (resume: Resume) => {
    setShowUpload(false);
    refetch();
    setSelectedResume(resume);
    setViewMode('analysis');
  };

  const handleDelete = async (resumeId: number) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteMutation.mutateAsync(resumeId);
        refetch();
        if (selectedResume?.id === resumeId) {
          setSelectedResume(null);
          setViewMode('list');
        }
      } catch (error) {
        console.error('Failed to delete resume:', error);
      }
    }
  };

  const handleViewResume = (resume: Resume) => {
    setSelectedResume(resume);
    setViewMode('analysis');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analyzed':
        return 'text-green-600 bg-green-100';
      case 'processing':
        return 'text-blue-600 bg-blue-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzed':
        return <CheckCircle className="w-4 h-4" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (viewMode === 'analysis' && selectedResume) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewMode('list')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Resumes
          </button>
        </div>
        <ResumeAnalysis resume={selectedResume} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Resume Management</h1>
          <p className="text-gray-600 mt-1">
            Upload and manage your resumes with AI-powered analysis
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Upload Resume
        </button>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="max-w-lg w-full"
            >
              <ResumeUpload
                onUploadSuccess={handleUploadSuccess}
                onClose={() => setShowUpload(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <span className="ml-3 text-gray-600">Loading resumes...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Resumes</h3>
          <p className="text-red-600 mb-4">Failed to load your resumes. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : resumes && resumes.length > 0 ? (
        <div className="grid gap-6">
          {resumes.map((resume) => (
            <motion.div
              key={resume.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-800 truncate">
                      {resume.original_filename}
                    </h3>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm text-gray-500">
                        {formatFileSize(resume.file_size)}
                      </span>
                      <span className="text-sm text-gray-500">
                        Uploaded {formatDate(resume.created_at)}
                      </span>
                      {resume.analyzed_at && (
                        <span className="text-sm text-gray-500">
                          Analyzed {formatDate(resume.analyzed_at)}
                        </span>
                      )}
                    </div>
                    <div className="mt-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(resume.analysis_status)}`}>
                        {getStatusIcon(resume.analysis_status)}
                        {resume.analysis_status.charAt(0).toUpperCase() + resume.analysis_status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => handleViewResume(resume)}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Analysis"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(resume.id)}
                    disabled={deleteMutation.isPending}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete Resume"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Analysis Preview */}
              {resume.is_analyzed && resume.analysis_results && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {resume.analysis_results.experience_level && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Experience Level</p>
                        <p className="font-medium text-gray-800 capitalize">
                          {resume.analysis_results.experience_level}
                        </p>
                      </div>
                    )}
                    {resume.analysis_results.total_experience_years !== undefined && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total Experience</p>
                        <p className="font-medium text-gray-800">
                          {resume.analysis_results.total_experience_years} years
                        </p>
                      </div>
                    )}
                    {resume.analysis_results.skills && Object.keys(resume.analysis_results.skills).length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Skills Found</p>
                        <p className="font-medium text-gray-800">
                          {Object.values(resume.analysis_results.skills).flat().length} skills
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No Resumes Yet</h3>
            <p className="text-gray-600 mb-6">
              Upload your first resume to get started with AI-powered analysis
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Your First Resume
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeManager;