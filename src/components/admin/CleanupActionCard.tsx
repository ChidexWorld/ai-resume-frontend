import React, { useState } from 'react';
import { Trash2, Clock, AlertTriangle, Loader2 } from 'lucide-react';

interface CleanupActionCardProps {
  type: 'inactive_users' | 'old_files' | 'failed_analyses';
  title: string;
  description: string;
  icon: React.ElementType;
  color: 'red' | 'orange' | 'yellow';
  onCleanup: (type: 'inactive_users' | 'old_files' | 'failed_analyses', days: number) => Promise<void>;
  isLoading?: boolean;
}

export const CleanupActionCard: React.FC<CleanupActionCardProps> = ({
  type,
  title,
  description,
  icon: Icon,
  color,
  onCleanup,
  isLoading = false,
}) => {
  const [daysThreshold, setDaysThreshold] = useState(30);
  const [showConfirm, setShowConfirm] = useState(false);

  const colorClasses = {
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      button: 'bg-red-600 hover:bg-red-700',
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'text-orange-600 dark:text-orange-400',
      button: 'bg-orange-600 hover:bg-orange-700',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      icon: 'text-yellow-600 dark:text-yellow-400',
      button: 'bg-yellow-600 hover:bg-yellow-700',
    },
  };

  const handleCleanup = async () => {
    await onCleanup(type, daysThreshold);
    setShowConfirm(false);
  };

  return (
    <div
      className={`${colorClasses[color].bg} ${colorClasses[color].border} border rounded-xl p-6`}
    >
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-white dark:bg-gray-800`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].icon}`} />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {description}
          </p>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <input
                type="number"
                min="7"
                max="365"
                value={daysThreshold}
                onChange={(e) => setDaysThreshold(Number(e.target.value))}
                className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100 text-sm"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">days old</span>
            </div>

            {!showConfirm ? (
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isLoading}
                className={`px-4 py-2 ${colorClasses[color].button} text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2`}
              >
                <Trash2 className="w-4 h-4" />
                Cleanup
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCleanup}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cleaning...
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4" />
                      Confirm
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isLoading}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
