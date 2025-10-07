import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Zap,
  Loader2,
  CheckCircle,
  AlertCircle,
  Settings,
  Target,
} from 'lucide-react';
import { matchingService } from '../../services/matchingService';
import { employerService } from '../../services/employerService';
import toast from 'react-hot-toast';

interface BulkMatchGeneratorProps {
  onClose?: () => void;
}

export const BulkMatchGenerator: React.FC<BulkMatchGeneratorProps> = ({ onClose }) => {
  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);
  const [minMatchScore, setMinMatchScore] = useState<number>(50);
  const [autoRecommend, setAutoRecommend] = useState<boolean>(true);
  const queryClient = useQueryClient();

  // Fetch employer's jobs
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: employerService.getJobs,
  });

  // Bulk match generation mutation
  const bulkMatchMutation = useMutation({
    mutationFn: matchingService.generateBulkMatches,
    onSuccess: (data) => {
      toast.success(
        `Successfully generated ${data.total_matches_generated} matches across ${data.jobs_processed} jobs!`
      );
      queryClient.invalidateQueries({ queryKey: ['matching-stats'] });
      queryClient.invalidateQueries({ queryKey: ['employee-matches'] });
      if (onClose) onClose();
    },
    onError: (error: any) => {
      const message = error?.response?.data?.detail || 'Failed to generate matches';
      toast.error(message);
    },
  });

  const handleGenerateMatches = () => {
    if (selectedJobIds.length === 0) {
      toast.error('Please select at least one job');
      return;
    }

    bulkMatchMutation.mutate({
      job_ids: selectedJobIds,
      min_match_score: minMatchScore,
      auto_recommend: autoRecommend,
    });
  };

  const handleSelectAll = () => {
    if (jobs && selectedJobIds.length === jobs.length) {
      setSelectedJobIds([]);
    } else if (jobs) {
      setSelectedJobIds(jobs.map((job: any) => job.id));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 max-w-2xl w-full mx-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Bulk Match Generation
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Generate AI-powered candidate matches for multiple jobs
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Job Selection */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Select Jobs ({selectedJobIds.length} selected)
            </label>
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {selectedJobIds.length === jobs?.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {jobsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
            </div>
          ) : jobs && jobs.length > 0 ? (
            <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg">
              {jobs.map((job: any) => (
                <label
                  key={job.id}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                >
                  <input
                    type="checkbox"
                    checked={selectedJobIds.includes(job.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedJobIds([...selectedJobIds, job.id]);
                      } else {
                        setSelectedJobIds(selectedJobIds.filter((id) => id !== job.id));
                      }
                    }}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-white truncate">
                      {job.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {job.location} • {job.employment_type}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No jobs available
            </div>
          )}
        </div>

        {/* Minimum Match Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Minimum Match Score: {minMatchScore}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={minMatchScore}
            onChange={(e) => setMinMatchScore(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Auto Recommend */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="autoRecommend"
            checked={autoRecommend}
            onChange={(e) => setAutoRecommend(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="autoRecommend" className="text-sm text-gray-700 dark:text-gray-300">
            Automatically mark high-quality matches as recommended
          </label>
        </div>

        {/* Status Messages */}
        {bulkMatchMutation.isSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                Matches Generated Successfully!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                {bulkMatchMutation.data?.total_matches_generated} matches created across{' '}
                {bulkMatchMutation.data?.jobs_processed} jobs
              </p>
            </div>
          </motion.div>
        )}

        {bulkMatchMutation.isError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Generation Failed
              </p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                {bulkMatchMutation.error?.response?.data?.detail ||
                  'Failed to generate matches. Please try again.'}
              </p>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {onClose && (
            <button
              onClick={onClose}
              disabled={bulkMatchMutation.isPending}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleGenerateMatches}
            disabled={bulkMatchMutation.isPending || selectedJobIds.length === 0}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {bulkMatchMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Matches...
              </>
            ) : (
              <>
                <Target className="w-4 h-4" />
                Generate Matches
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BulkMatchGenerator;
