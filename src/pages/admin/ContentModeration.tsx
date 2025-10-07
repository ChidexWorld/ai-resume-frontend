import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  FileText,
  Briefcase,
  Users,
  Search,
  Filter,
  Loader2,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { useGetContentForModeration } from '../../hooks/useAdmin';
import toast from 'react-hot-toast';

export const ContentModeration: React.FC = () => {
  const [contentType, setContentType] = useState<'resumes' | 'jobs' | 'applications'>('resumes');
  const [flaggedOnly, setFlaggedOnly] = useState(false);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');

  // API Hook
  const { data: moderationData, isLoading, refetch, isFetching } = useGetContentForModeration({
    content_type: contentType,
    flagged_only: flaggedOnly,
    limit,
  });

  // Filter content by search
  const filteredContent = moderationData?.items?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.title?.toLowerCase().includes(searchLower) ||
      item.department?.toLowerCase().includes(searchLower) ||
      item.status.toLowerCase().includes(searchLower) ||
      item.id.toString().includes(searchLower)
    );
  }) || [];

  // Handle approve/reject (mock implementation)
  const handleApprove = (itemId: number) => {
    toast.success(`Item #${itemId} approved`);
    // In real implementation, you'd call an API endpoint
  };

  const handleReject = (itemId: number) => {
    if (window.confirm(`Are you sure you want to reject item #${itemId}?`)) {
      toast.success(`Item #${itemId} rejected`);
      // In real implementation, you'd call an API endpoint
    }
  };

  // Get priority based on status
  const getPriority = (status: string): 'high' | 'medium' | 'low' => {
    if (status === 'failed' || status === 'rejected') return 'high';
    if (status === 'pending') return 'medium';
    return 'low';
  };

  // Get icon for content type
  const getContentIcon = () => {
    switch (contentType) {
      case 'resumes':
        return FileText;
      case 'jobs':
        return Briefcase;
      case 'applications':
        return Users;
    }
  };

  const ContentIcon = getContentIcon();

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
              <AlertTriangle className="w-8 h-8 text-orange-600" />
              Content Moderation
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review and moderate platform content - {filteredContent.length} item(s)
            </p>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
      >
        <div className="grid md:grid-cols-4 gap-4">
          {/* Content Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as typeof contentType)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="resumes">Resumes</option>
              <option value="jobs">Job Postings</option>
              <option value="applications">Applications</option>
            </select>
          </div>

          {/* Flagged Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Filter
            </label>
            <select
              value={flaggedOnly.toString()}
              onChange={(e) => setFlaggedOnly(e.target.value === 'true')}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="false">All Content</option>
              <option value="true">Flagged Only</option>
            </select>
          </div>

          {/* Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Items per Page
            </label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Items</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {moderationData?.total_items || 0}
              </p>
            </div>
            <ContentIcon className="w-12 h-12 text-gray-300" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Flagged</p>
              <p className="text-2xl font-bold text-orange-600">
                {filteredContent.filter((item) => getPriority(item.status) === 'high').length}
              </p>
            </div>
            <AlertTriangle className="w-12 h-12 text-orange-300" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pending Review</p>
              <p className="text-2xl font-bold text-blue-600">
                {filteredContent.filter((item) => item.status === 'pending').length}
              </p>
            </div>
            <Eye className="w-12 h-12 text-blue-300" />
          </div>
        </motion.div>
      </div>

      {/* Content List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading content...</span>
          </div>
        ) : filteredContent.length === 0 ? (
          <div className="text-center p-12">
            <AlertTriangle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No content found for moderation</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
              All {contentType} are currently clean
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredContent.map((item) => {
              const priority = getPriority(item.status);
              const priorityColors = {
                high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
                medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                low: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
              };

              return (
                <div
                  key={item.id}
                  className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <ContentIcon className="w-5 h-5 text-gray-400" />
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">
                          {item.title || `${contentType.slice(0, -1)} #${item.id}`}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[priority]}`}>
                          {priority.toUpperCase()}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                          {item.status}
                        </span>
                      </div>

                      {item.department && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          Department: {item.department}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Created: {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <span>ID: #{item.id}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleApprove(item.id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 text-sm"
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                      <button className="px-4 py-2 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ContentModeration;
