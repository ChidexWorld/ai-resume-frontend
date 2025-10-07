import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employeeService, type Resume } from '../../services/employeeService';
import toast from 'react-hot-toast';

interface ResumeUploadProps {
  onUploadSuccess?: (resume: Resume) => void;
  onClose?: () => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  onUploadSuccess,
  onClose
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: employeeService.uploadResume,
    onSuccess: (resume) => {
      toast.success('Resume uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      if (onUploadSuccess) {
        onUploadSuccess(resume);
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || 'Failed to upload resume';
      toast.error(message);
    }
  });

  const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  const maxSize = 25 * 1024 * 1024; // 25MB

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a PDF, DOCX, or TXT file.');
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      alert('File size must be less than 25MB.');
      return;
    }

    setSelectedFile(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-200">Upload Resume</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Upload Area */}
      <div className="space-y-4">
        {!selectedFile ? (
          <motion.div
            className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-colors ${
              dragActive
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Upload className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              Drop your resume here or click to browse
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
              Supports PDF, DOCX, and TXT files up to 25MB
            </p>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileInput}
              className="hidden"
              id="resume-upload"
            />
            <label
              htmlFor="resume-upload"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm sm:text-base"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </label>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg flex-shrink-0">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-medium text-gray-800 dark:text-gray-200 truncate text-sm sm:text-base">{selectedFile.name}</h4>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                onClick={handleRemoveFile}
                className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors flex-shrink-0"
                disabled={uploadMutation.isPending}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Upload Status */}
        {uploadMutation.isError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 sm:p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-red-800 dark:text-red-300">Upload Failed</p>
              <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 break-words">
                {uploadMutation.error?.response?.data?.detail || 'Something went wrong. Please try again.'}
              </p>
            </div>
          </motion.div>
        )}

        {uploadMutation.isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4 flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-green-800 dark:text-green-300">Upload Successful</p>
              <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                Your resume has been uploaded and is being analyzed.
              </p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4">
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm sm:text-base"
              disabled={uploadMutation.isPending}
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploadMutation.isPending}
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
          >
            {uploadMutation.isPending ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeUpload;