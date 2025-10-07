import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface ModerationItem {
  id: number;
  type: string;
  content: string;
  status: string;
  priority: 'high' | 'medium' | 'low';
  created_at: string;
}

interface ContentModerationCardProps {
  item: ModerationItem;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

export const ContentModerationCard: React.FC<ContentModerationCardProps> = ({
  item,
  onApprove,
  onReject,
}) => {
  const priorityColors = {
    high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-orange-500" />
          <span className="font-medium text-gray-800 dark:text-gray-100 text-sm capitalize">
            {item.type}
          </span>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[item.priority]}`}
        >
          {item.priority}
        </span>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
        {item.content}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Status: {item.status} | {new Date(item.created_at).toLocaleDateString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onApprove(item.id)}
            className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 flex items-center gap-1 transition-colors"
          >
            <CheckCircle className="w-3 h-3" />
            Approve
          </button>
          <button
            onClick={() => onReject(item.id)}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 flex items-center gap-1 transition-colors"
          >
            <XCircle className="w-3 h-3" />
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};
