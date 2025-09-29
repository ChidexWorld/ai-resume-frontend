import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Award,
  Target,
  BookOpen,
  ChevronRight,
  Activity,
  BarChart3,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Star,
  Building2,
  Loader2,
  FileText,
  Calendar
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { employeeService } from '../../services/employeeService';

interface SkillsAnalysisData {
  detected_industry: string;
  total_skills_found: number;
  industry_skill_coverage: {
    matching_skills: string[];
    missing_skills: string[];
    coverage_percentage: number;
  };
  skills_by_category: {
    [category: string]: string[];
  };
  experience_level: string;
  total_experience_years: number;
  recommendations: {
    skills_to_develop: string[];
    career_level: string;
    industry_focus: string;
  };
}

export const SkillsAnalysisPage: React.FC = () => {
  const { data: analysisData, isLoading, error } = useQuery<SkillsAnalysisData>({
    queryKey: ['skills-analysis'],
    queryFn: () => employeeService.getSkillsAnalysis()
  });

  const { data: resumesData } = useQuery({
    queryKey: ['resumes'],
    queryFn: () => employeeService.getResumes()
  });

  // Find the most recent analyzed resume
  const latestAnalyzedResume = resumesData?.filter(resume => resume.is_analyzed)
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())[0];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Analyzing your skills...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Analysis Error</h3>
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : 'Failed to load skills analysis. Please ensure you have an analyzed resume uploaded.'}
        </p>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
        <BookOpen className="w-8 h-8 text-blue-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-blue-800 mb-2">No Analysis Available</h3>
        <p className="text-blue-600">
          Upload and analyze a resume first to see your skills analysis.
        </p>
      </div>
    );
  }

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-100';
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getExperienceLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'entry': return 'text-blue-600 bg-blue-100';
      case 'mid': return 'text-purple-600 bg-purple-100';
      case 'senior': return 'text-green-600 bg-green-100';
      case 'executive': return 'text-indigo-600 bg-indigo-100';
      default: return 'text-gray-600 dark:text-gray-300 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Activity className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Skills Analysis</h1>
        </div>
        <p className="text-primary-100">
          Comprehensive analysis of your skills and career development opportunities
        </p>
      </div>

      {/* Analyzed Resume Info */}
      {latestAnalyzedResume ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="font-medium text-blue-900">Analysis Based On</h3>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm font-medium text-blue-800">
                  {latestAnalyzedResume.original_filename}
                </p>
                <div className="flex items-center gap-3 text-xs text-blue-600 mt-1">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Analyzed {new Date(latestAnalyzedResume.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>{latestAnalyzedResume.status}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
              Latest Resume
            </div>
          </div>
        </motion.div>
      ) : resumesData && resumesData.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <h3 className="font-medium text-yellow-900">Resume Analysis Pending</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Skills analysis will be available once your resume has been processed and analyzed.
              </p>
            </div>
          </div>
        </motion.div>
      ) : null}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Industry</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize">
            {analysisData.detected_industry}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Skills Found</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {analysisData.total_skills_found}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Coverage</span>
          </div>
          <div className={`text-2xl font-bold ${getCoverageColor(analysisData.industry_skill_coverage.coverage_percentage).split(' ')[0]}`}>
            {analysisData.industry_skill_coverage.coverage_percentage}%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
            <span className="text-sm font-medium text-gray-600">Experience</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {analysisData.total_experience_years}y
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExperienceLevelColor(analysisData.experience_level)}`}>
              {analysisData.experience_level}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Skills Coverage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Target className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Industry Skill Coverage</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Matching Skills */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-medium text-gray-900">Skills You Have</h3>
              <span className="text-sm text-gray-500">
                ({analysisData.industry_skill_coverage.matching_skills.length})
              </span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analysisData.industry_skill_coverage.matching_skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-green-50 rounded-lg"
                >
                  <Star className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800">{skill}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              <h3 className="font-medium text-gray-900">Skills to Develop</h3>
              <span className="text-sm text-gray-500">
                ({analysisData.industry_skill_coverage.missing_skills.length})
              </span>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {analysisData.industry_skill_coverage.missing_skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg"
                >
                  <Target className="w-4 h-4 text-orange-600" />
                  <span className="text-sm text-orange-800">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Skills by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Award className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Your Skills by Category</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(analysisData.skills_by_category).map(([category, skills]) => (
            <div key={category} className="space-y-3">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 capitalize flex items-center gap-2">
                <ChevronRight className="w-4 h-4 text-primary-600" />
                {category.replace('_', ' ')}
                <span className="text-sm text-gray-500">({skills.length})</span>
              </h3>
              <div className="space-y-1">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="text-sm text-gray-700 bg-gray-50 dark:bg-gray-900 px-3 py-1 rounded-lg"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <Lightbulb className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900">Recommendations</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-3">Priority Skills to Develop</h3>
            <div className="space-y-2">
              {analysisData.recommendations.skills_to_develop.map((skill, index) => (
                <div key={index} className="text-sm text-blue-800 bg-blue-200/50 px-2 py-1 rounded">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
            <h3 className="font-medium text-purple-900 mb-3">Career Level</h3>
            <div className="text-2xl font-bold text-purple-800 capitalize">
              {analysisData.recommendations.career_level}
            </div>
            <p className="text-sm text-purple-700 mt-2">
              {analysisData.total_experience_years} years of experience
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
            <h3 className="font-medium text-green-900 mb-3">Industry Focus</h3>
            <div className="text-xl font-bold text-green-800 capitalize">
              {analysisData.recommendations.industry_focus}
            </div>
            <p className="text-sm text-green-700 mt-2">
              {analysisData.industry_skill_coverage.coverage_percentage}% skill coverage
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SkillsAnalysisPage;