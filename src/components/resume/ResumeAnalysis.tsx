import React from 'react';
import { motion } from 'framer-motion';
import {
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
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import type { Resume } from '../../types';

interface ResumeAnalysisProps {
  resume: Resume;
}

export const ResumeAnalysis: React.FC<ResumeAnalysisProps> = ({ resume }) => {
  const getStatusIcon = () => {
    switch (resume.analysis_status) {
      case 'analyzed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (resume.analysis_status) {
      case 'analyzed':
        return 'Analysis Complete';
      case 'processing':
        return 'Processing...';
      case 'failed':
        return 'Analysis Failed';
      default:
        return 'Uploaded';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-white truncate">{resume.original_filename}</h2>
              <p className="text-sm text-blue-100">{formatFileSize(resume.file_size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Content Type</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{resume.content_type}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Uploaded</p>
            <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(resume.created_at)}</p>
          </div>
          {resume.analyzed_at && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Analyzed</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{formatDate(resume.analyzed_at)}</p>
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {resume.is_analyzed && resume.analysis_results ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Contact Information */}
            {resume.analysis_results.contact_info && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {resume.analysis_results.contact_info.name && (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100 break-words">{resume.analysis_results.contact_info.name}</span>
                    </div>
                  )}
                  {resume.analysis_results.contact_info.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-gray-100 break-all">{resume.analysis_results.contact_info.email}</span>
                    </div>
                  )}
                  {resume.analysis_results.contact_info.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{resume.analysis_results.contact_info.phone}</span>
                    </div>
                  )}
                  {resume.analysis_results.contact_info.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-900 dark:text-gray-100 break-words">{resume.analysis_results.contact_info.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Professional Summary */}
            {resume.analysis_results.professional_summary && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Professional Summary
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {resume.analysis_results.professional_summary}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4">
                  {resume.analysis_results.experience_level && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {resume.analysis_results.experience_level}
                    </span>
                  )}
                  {resume.analysis_results.total_experience_years !== undefined && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <Calendar className="w-3 h-3" />
                      {resume.analysis_results.total_experience_years} years experience
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {resume.analysis_results.skills && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  Skills
                </h3>
                <div className="space-y-3">
                  {Object.entries(resume.analysis_results.skills).map(([category, skills]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 capitalize">
                        {category.replace('_', ' ')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(skills) ? skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        )) : (
                          <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 text-xs rounded-full">
                            {skills}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Experience */}
            {resume.analysis_results.experience && resume.analysis_results.experience.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  Work Experience
                </h3>
                <div className="space-y-3">
                  {resume.analysis_results.experience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-2 border-orange-200 dark:border-orange-700 pl-3 sm:pl-4">
                      {typeof exp === 'string' ? (
                        <p className="text-sm text-gray-700 dark:text-gray-300 break-words">{exp}</p>
                      ) : (
                        <>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 break-words">
                            {exp.position || exp.title || 'Position'}
                          </h4>
                          <p className="text-sm text-orange-600 dark:text-orange-400 font-medium break-words">
                            {exp.company || 'Company'}
                          </p>
                          {exp.duration && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{exp.duration}</p>
                          )}
                          {exp.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 break-words">{exp.description}</p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.analysis_results.education && resume.analysis_results.education.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Education
                </h3>
                <div className="space-y-3">
                  {resume.analysis_results.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-2 border-indigo-200 dark:border-indigo-700 pl-3 sm:pl-4">
                      {typeof edu === 'string' ? (
                        <p className="text-sm text-gray-700 dark:text-gray-300 break-words">{edu}</p>
                      ) : (
                        <>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200 break-words">
                            {edu.degree || 'Degree'}
                          </h4>
                          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium break-words">
                            {edu.institution || 'Institution'}
                          </p>
                          {edu.year && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">{edu.year}</p>
                          )}
                          {edu.field && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 break-words">{edu.field}</p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resume.analysis_results.certifications && resume.analysis_results.certifications.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resume.analysis_results.certifications.map((cert: any, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm rounded-full break-words"
                    >
                      {typeof cert === 'string' ? cert : cert.name || 'Certification'}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages - separate from skills */}
            {resume.analysis_results.languages && resume.analysis_results.languages.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  <Award className="w-5 h-5 text-green-600" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resume.analysis_results.languages.map((lang: any, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm rounded-full"
                    >
                      {typeof lang === 'string' ? lang : lang.name || 'Language'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : resume.analysis_status === 'processing' ? (
          <div className="text-center py-8 px-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Analyzing your resume...</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">This may take a few moments</p>
          </div>
        ) : resume.analysis_status === 'failed' ? (
          <div className="text-center py-8 px-4">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Analysis failed</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Please try uploading again</p>
          </div>
        ) : (
          <div className="text-center py-8 px-4">
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Waiting for analysis to begin...</p>
          </div>
        )}

        {/* Extracted Text Preview */}
        {resume.extracted_text && (
          <div className="mt-6 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">Extracted Text</h3>
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 max-h-40 overflow-y-auto">
              <pre className="text-xs text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {resume.extracted_text.substring(0, 500)}
                {resume.extracted_text.length > 500 && '...'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalysis;