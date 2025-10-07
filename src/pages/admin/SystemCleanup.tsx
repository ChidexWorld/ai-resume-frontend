import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trash2,
  Database,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  HardDrive,
  FileX,
  Users,
  Calendar,
  Loader2,
} from 'lucide-react';
import { useCleanupSystemData, useSystemHealthCheck } from '../../hooks/useAdmin';
import toast from 'react-hot-toast';

type CleanupType = 'inactive_users' | 'old_files' | 'failed_analyses';

export const SystemCleanup: React.FC = () => {
  const [selectedCleanupType, setSelectedCleanupType] = useState<CleanupType>('failed_analyses');
  const [daysThreshold, setDaysThreshold] = useState(30);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // API Hooks
  const cleanupMutation = useCleanupSystemData();
  const healthCheckMutation = useSystemHealthCheck();

  const cleanupOptions = [
    {
      type: 'inactive_users' as CleanupType,
      label: 'Inactive Users',
      description: 'Mark inactive users for review (non-destructive)',
      icon: Users,
      color: 'blue',
      warning: 'This will mark users who have been inactive for the specified period.',
    },
    {
      type: 'old_files' as CleanupType,
      label: 'Old Files',
      description: 'Clean up files from deleted resumes and voice analyses',
      icon: FileX,
      color: 'orange',
      warning: 'This will permanently delete files associated with deleted content.',
    },
    {
      type: 'failed_analyses' as CleanupType,
      label: 'Failed Analyses',
      description: 'Remove records of failed resume and voice analyses',
      icon: XCircle,
      color: 'red',
      warning: 'This will permanently delete failed analysis records from the database.',
    },
  ];

  const selectedOption = cleanupOptions.find((opt) => opt.type === selectedCleanupType)!;

  const handleCleanup = async () => {
    if (!confirmDialogOpen) {
      setConfirmDialogOpen(true);
      return;
    }

    try {
      await cleanupMutation.mutateAsync({
        cleanup_type: selectedCleanupType,
        days_threshold: daysThreshold,
      });
      setConfirmDialogOpen(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleHealthCheck = async () => {
    await healthCheckMutation.mutateAsync();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
              <Database className="w-8 h-8 text-red-600" />
              System Cleanup
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Maintain system health by removing unnecessary data
            </p>
          </div>
          <button
            onClick={handleHealthCheck}
            disabled={healthCheckMutation.isPending}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            {healthCheckMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Run Health Check
              </>
            )}
          </button>
        </div>
      </motion.div>

      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-lg"
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-200">
              Important Notice
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              System cleanup operations can be irreversible. Please review your selections carefully
              before proceeding. We recommend running a health check and reviewing system status first.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cleanup Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Select Cleanup Type
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {cleanupOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => setSelectedCleanupType(option.type)}
              className={`p-6 rounded-xl border-2 transition-all text-left ${
                selectedCleanupType === option.type
                  ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className={`p-3 rounded-lg inline-flex mb-3 ${
                option.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                option.color === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30' :
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                <option.icon className={`w-6 h-6 ${
                  option.color === 'blue' ? 'text-blue-600' :
                  option.color === 'orange' ? 'text-orange-600' :
                  'text-red-600'
                }`} />
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                {option.label}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {option.description}
              </p>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          Cleanup Configuration
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Days Threshold */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Age Threshold (Days)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="7"
                max="365"
                step="7"
                value={daysThreshold}
                onChange={(e) => setDaysThreshold(Number(e.target.value))}
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="7"
                  max="365"
                  value={daysThreshold}
                  onChange={(e) => setDaysThreshold(Number(e.target.value))}
                  className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">days</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Items older than {daysThreshold} days will be targeted
            </p>
          </div>

          {/* Selected Cleanup Type Info */}
          <div className={`p-4 rounded-lg border-l-4 ${
            selectedOption.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500' :
            selectedOption.color === 'orange' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500' :
            'bg-red-50 dark:bg-red-900/20 border-red-500'
          }`}>
            <div className="flex items-start gap-3">
              <selectedOption.icon className={`w-5 h-5 flex-shrink-0 ${
                selectedOption.color === 'blue' ? 'text-blue-600' :
                selectedOption.color === 'orange' ? 'text-orange-600' :
                'text-red-600'
              }`} />
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1">
                  {selectedOption.label}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {selectedOption.warning}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      {confirmDialogOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-red-200 dark:border-red-800"
        >
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                Confirm Cleanup Operation
              </h3>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                <p>You are about to perform the following cleanup:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Type: <strong>{selectedOption.label}</strong></li>
                  <li>Items older than: <strong>{daysThreshold} days</strong></li>
                  <li>{selectedOption.warning}</li>
                </ul>
                <p className="text-red-600 dark:text-red-400 font-medium mt-3">
                  This operation cannot be undone. Do you want to proceed?
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleCleanup}
                  disabled={cleanupMutation.isPending}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
                >
                  {cleanupMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Yes, Proceed
                    </>
                  )}
                </button>
                <button
                  onClick={() => setConfirmDialogOpen(false)}
                  disabled={cleanupMutation.isPending}
                  className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      {!confirmDialogOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-end gap-4"
        >
          <button
            onClick={() => {
              setDaysThreshold(30);
              setSelectedCleanupType('failed_analyses');
            }}
            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 flex items-center gap-2"
          >
            Reset to Defaults
          </button>
          <button
            onClick={handleCleanup}
            disabled={cleanupMutation.isPending}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 font-semibold"
          >
            <Trash2 className="w-4 h-4" />
            Start Cleanup
          </button>
        </motion.div>
      )}

      {/* System Info Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <HardDrive className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Storage Status</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">Healthy</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            System storage is operating normally
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Database Status</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">Optimized</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Database performance is optimal
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Last Cleanup</p>
              <p className="text-lg font-bold text-gray-800 dark:text-gray-100">7 days ago</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Regular maintenance recommended
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SystemCleanup;
