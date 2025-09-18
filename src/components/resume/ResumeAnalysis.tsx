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
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">{resume.original_filename}</h2>
              <p className="text-blue-100">{formatFileSize(resume.file_size)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-white">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Content Type</p>
            <p className="font-medium">{resume.content_type}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Uploaded</p>
            <p className="font-medium">{formatDate(resume.created_at)}</p>
          </div>
          {resume.analyzed_at && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Analyzed</p>
              <p className="font-medium">{formatDate(resume.analyzed_at)}</p>
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
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resume.analysis_results.contact_info.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{resume.analysis_results.contact_info.email}</span>
                    </div>
                  )}
                  {resume.analysis_results.contact_info.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{resume.analysis_results.contact_info.phone}</span>
                    </div>
                  )}
                  {resume.analysis_results.contact_info.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{resume.analysis_results.contact_info.location}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Professional Summary */}
            {resume.analysis_results.professional_summary && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Professional Summary
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {resume.analysis_results.professional_summary}
                </p>
                <div className="mt-3 flex items-center gap-4">
                  {resume.analysis_results.experience_level && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {resume.analysis_results.experience_level}
                    </span>
                  )}
                  {resume.analysis_results.total_experience_years && (
                    <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {resume.analysis_results.total_experience_years} years experience
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Skills */}
            {resume.analysis_results.skills && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <Award className="w-5 h-5 text-purple-600" />
                  Skills
                </h3>
                <div className="space-y-3">
                  {Object.entries(resume.analysis_results.skills).map(([category, skills]) => (
                    <div key={category}>
                      <h4 className="text-sm font-medium text-gray-700 mb-2 capitalize">
                        {category.replace('_', ' ')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(skills) ? skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                          >
                            {skill}
                          </span>
                        )) : (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
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
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {resume.analysis_results.experience.map((exp: any, index: number) => (
                    <div key={index} className="border-l-2 border-orange-200 pl-4">
                      <h4 className="font-medium text-gray-800">
                        {exp.position || exp.title || 'Position'}
                      </h4>
                      <p className="text-sm text-orange-600 font-medium">
                        {exp.company || 'Company'}
                      </p>
                      {exp.duration && (
                        <p className="text-xs text-gray-500">{exp.duration}</p>
                      )}
                      {exp.description && (
                        <p className="text-sm text-gray-600 mt-1">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.analysis_results.education && resume.analysis_results.education.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  Education
                </h3>
                <div className="space-y-3">
                  {resume.analysis_results.education.map((edu: any, index: number) => (
                    <div key={index} className="border-l-2 border-indigo-200 pl-4">
                      <h4 className="font-medium text-gray-800">
                        {edu.degree || 'Degree'}
                      </h4>
                      <p className="text-sm text-indigo-600 font-medium">
                        {edu.institution || 'Institution'}
                      </p>
                      {edu.year && (
                        <p className="text-xs text-gray-500">{edu.year}</p>
                      )}
                      {edu.field && (
                        <p className="text-sm text-gray-600">{edu.field}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {resume.analysis_results.certifications && resume.analysis_results.certifications.length > 0 && (
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-3">
                  <Award className="w-5 h-5 text-yellow-600" />
                  Certifications
                </h3>
                <div className="flex flex-wrap gap-2">
                  {resume.analysis_results.certifications.map((cert: any, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full"
                    >
                      {typeof cert === 'string' ? cert : cert.name || 'Certification'}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ) : resume.analysis_status === 'processing' ? (
          <div className="text-center py-8">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Analyzing your resume...</p>
            <p className="text-sm text-gray-500 mt-1">This may take a few moments</p>
          </div>
        ) : resume.analysis_status === 'failed' ? (
          <div className="text-center py-8">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600">Analysis failed</p>
            <p className="text-sm text-gray-500 mt-1">Please try uploading again</p>
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="w-8 h-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Waiting for analysis to begin...</p>
          </div>
        )}

        {/* Extracted Text Preview */}
        {resume.extracted_text && (
          <div className="mt-6 border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Extracted Text</h3>
            <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
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