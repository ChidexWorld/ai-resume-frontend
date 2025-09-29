import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  MapPin,
  Mail,
  Phone,
  Calendar,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  ArrowRight
} from 'lucide-react';
import type { Resume } from '../../types';

interface ResumeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumes: Resume[];
  selectedResumeId: number | null;
  onSelectResume: (resume: Resume) => void;
  title?: string;
}

export const ResumeSelectionModal: React.FC<ResumeSelectionModalProps> = ({
  isOpen,
  onClose,
  resumes,
  selectedResumeId,
  onSelectResume,
  title = "Select Resume"
}) => {
  const [viewingResume, setViewingResume] = useState<Resume | null>(null);

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'analyzed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const analyzedResumes = resumes.filter(resume => resume.analysis_status === 'analyzed');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <p className="text-sm text-gray-600 mt-1">
              Choose from your analyzed resumes
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-140px)]">
          {/* Resume List */}
          <div className="w-1/2 p-6 border-r border-gray-200 overflow-y-auto">
            <div className="space-y-4">
              {analyzedResumes.length > 0 ? (
                analyzedResumes.map((resume) => (
                  <motion.div
                    key={resume.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                      selectedResumeId === resume.id
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => onSelectResume(resume)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                          <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate mb-1">
                            {resume.original_filename}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                            {getStatusIcon(resume.analysis_status)}
                            <span className="capitalize">{resume.analysis_status}</span>
                            <span>•</span>
                            <span>{formatFileSize(resume.file_size)}</span>
                          </div>
                          <p className="text-xs text-gray-500">
                            Uploaded: {formatDate(resume.created_at)}
                            {resume.analyzed_at && (
                              <span> • Analyzed: {formatDate(resume.analyzed_at)}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewingResume(resume);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Preview Resume"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {selectedResumeId === resume.id && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>

                    {/* Resume Analysis Preview */}
                    {resume.is_analyzed && resume.analysis_results && (
                      <div className="space-y-2 pt-2 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          {resume.analysis_results.experience_level && (
                            <div>
                              <span className="text-gray-500">Experience:</span>
                              <span className="ml-1 font-medium text-gray-700 capitalize">
                                {resume.analysis_results.experience_level}
                              </span>
                            </div>
                          )}
                          {resume.analysis_results.total_experience_years !== undefined && (
                            <div>
                              <span className="text-gray-500">Years:</span>
                              <span className="ml-1 font-medium text-gray-700">
                                {resume.analysis_results.total_experience_years}
                              </span>
                            </div>
                          )}
                        </div>

                        {resume.analysis_results.contact_info?.email && (
                          <div className="flex items-center gap-1 text-xs text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span className="truncate">{resume.analysis_results.contact_info.email}</span>
                          </div>
                        )}

                        {resume.analysis_results.skills && Object.keys(resume.analysis_results.skills).length > 0 && (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Top Skills:</p>
                            <div className="flex flex-wrap gap-1">
                              {Object.values(resume.analysis_results.skills)
                                .flat()
                                .slice(0, 3)
                                .map((skill, index) => (
                                  <span
                                    key={index}
                                    className="px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded"
                                  >
                                    {skill}
                                  </span>
                                ))}
                              {Object.values(resume.analysis_results.skills).flat().length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{Object.values(resume.analysis_results.skills).flat().length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">No Analyzed Resumes</h3>
                  <p className="text-gray-600 mb-4">
                    You need to upload and analyze a resume first.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Resume Preview/Detail */}
          <div className="w-1/2 p-6 overflow-y-auto bg-gray-50">
            {viewingResume ? (
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Resume Preview</h3>
                  <button
                    onClick={() => setViewingResume(null)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Resume Details */}
                <div className="bg-white rounded-lg p-4 space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{viewingResume.original_filename}</h4>
                    <p className="text-sm text-gray-600">
                      {formatFileSize(viewingResume.file_size)} • Uploaded {formatDate(viewingResume.created_at)}
                    </p>
                  </div>

                  {viewingResume.is_analyzed && viewingResume.analysis_results && (
                    <>
                      {/* Contact Info */}
                      {viewingResume.analysis_results.contact_info && (
                        <div>
                          <h5 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <User className="w-4 h-4 text-blue-600" />
                            Contact Information
                          </h5>
                          <div className="space-y-1 text-sm text-gray-600">
                            {viewingResume.analysis_results.contact_info.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-3 h-3 text-gray-400" />
                                <span>{viewingResume.analysis_results.contact_info.email}</span>
                              </div>
                            )}
                            {viewingResume.analysis_results.contact_info.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span>{viewingResume.analysis_results.contact_info.phone}</span>
                              </div>
                            )}
                            {viewingResume.analysis_results.contact_info.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-gray-400" />
                                <span>{viewingResume.analysis_results.contact_info.location}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Professional Summary */}
                      {viewingResume.analysis_results.professional_summary && (
                        <div>
                          <h5 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            Professional Summary
                          </h5>
                          <p className="text-sm text-gray-600 leading-relaxed mb-2">
                            {viewingResume.analysis_results.professional_summary}
                          </p>
                          <div className="flex items-center gap-3">
                            {viewingResume.analysis_results.experience_level && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {viewingResume.analysis_results.experience_level}
                              </span>
                            )}
                            {viewingResume.analysis_results.total_experience_years !== undefined && (
                              <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                                <Calendar className="w-3 h-3" />
                                {viewingResume.analysis_results.total_experience_years} years experience
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Skills */}
                      {viewingResume.analysis_results.skills && (
                        <div>
                          <h5 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Award className="w-4 h-4 text-purple-600" />
                            Skills
                          </h5>
                          <div className="space-y-2">
                            {Object.entries(viewingResume.analysis_results.skills).map(([category, skills]) => (
                              <div key={category}>
                                <h6 className="text-xs font-medium text-gray-600 mb-1 capitalize">
                                  {category.replace('_', ' ')}
                                </h6>
                                <div className="flex flex-wrap gap-1">
                                  {(Array.isArray(skills) ? skills : [skills]).slice(0, 6).map((skill, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recent Experience */}
                      {viewingResume.analysis_results.experience && viewingResume.analysis_results.experience.length > 0 && (
                        <div>
                          <h5 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <Briefcase className="w-4 h-4 text-orange-600" />
                            Recent Experience
                          </h5>
                          <div className="space-y-2">
                            {viewingResume.analysis_results.experience.slice(0, 2).map((exp: any, index: number) => (
                              <div key={index} className="border-l-2 border-orange-200 pl-3">
                                <h6 className="text-sm font-medium text-gray-800">
                                  {exp.position || exp.title || 'Position'}
                                </h6>
                                <p className="text-xs text-orange-600 font-medium">
                                  {exp.company || 'Company'}
                                </p>
                                {exp.duration && (
                                  <p className="text-xs text-gray-500">{exp.duration}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Education */}
                      {viewingResume.analysis_results.education && viewingResume.analysis_results.education.length > 0 && (
                        <div>
                          <h5 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                            <GraduationCap className="w-4 h-4 text-indigo-600" />
                            Education
                          </h5>
                          <div className="space-y-2">
                            {viewingResume.analysis_results.education.slice(0, 2).map((edu: any, index: number) => (
                              <div key={index} className="border-l-2 border-indigo-200 pl-3">
                                <h6 className="text-sm font-medium text-gray-800">
                                  {edu.degree || 'Degree'}
                                </h6>
                                <p className="text-xs text-indigo-600 font-medium">
                                  {edu.institution || 'Institution'}
                                </p>
                                {edu.year && (
                                  <p className="text-xs text-gray-500">{edu.year}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ) : selectedResumeId ? (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Resume Selected</h3>
                  <p className="text-gray-600 mb-4">
                    {analyzedResumes.find(r => r.id === selectedResumeId)?.original_filename}
                  </p>
                  <p className="text-sm text-gray-500">
                    Click on a resume to the left to preview it, or use the eye icon for detailed view.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">Choose a Resume</h3>
                <p className="text-gray-600">
                  Select a resume from the list to see its details here.
                </p>
              </div>
            )}
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
            onClick={onClose}
            disabled={!selectedResumeId}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Use Selected Resume
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResumeSelectionModal;