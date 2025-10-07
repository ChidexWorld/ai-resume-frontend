import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  Briefcase,
  Building,
  Calendar,
  MoreVertical,
  Download,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { useGetUsers, useUpdateUserStatus, useBulkUpdateUserStatus, useExportSystemData } from '../../hooks/useAdmin';
import toast from 'react-hot-toast';

export const UserManagement: React.FC = () => {
  const [selectedUserType, setSelectedUserType] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<boolean | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [limit, setLimit] = useState(50);
  const [offset, setOffset] = useState(0);

  // API Hooks
  const { data: users, isLoading, refetch, isFetching } = useGetUsers({
    user_type: selectedUserType || undefined,
    is_active: selectedStatus,
    limit,
    offset,
  });

  const updateUserStatusMutation = useUpdateUserStatus();
  const bulkUpdateMutation = useBulkUpdateUserStatus();
  const exportDataMutation = useExportSystemData();

  // Filter users by search term
  const filteredUsers = users?.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      user.user.first_name.toLowerCase().includes(searchLower) ||
      user.user.last_name.toLowerCase().includes(searchLower) ||
      user.user.email.toLowerCase().includes(searchLower) ||
      (user.user.company_name?.toLowerCase().includes(searchLower) ?? false)
    );
  }) || [];

  // Toggle user selection
  const toggleUserSelection = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  // Select all/none
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.user.id));
    }
  };

  // Handle user status toggle
  const handleStatusToggle = async (userId: number, currentStatus: boolean) => {
    await updateUserStatusMutation.mutateAsync({
      userId,
      isActive: !currentStatus,
    });
  };

  // Handle bulk activation/deactivation
  const handleBulkAction = async (activate: boolean) => {
    if (selectedUsers.length === 0) {
      toast.error('Please select users first');
      return;
    }

    const confirmMessage = activate
      ? `Activate ${selectedUsers.length} user(s)?`
      : `Deactivate ${selectedUsers.length} user(s)?`;

    if (window.confirm(confirmMessage)) {
      await bulkUpdateMutation.mutateAsync({
        userIds: selectedUsers,
        isActive: activate,
      });
      setSelectedUsers([]);
    }
  };

  // Handle export
  const handleExport = async () => {
    await exportDataMutation.mutateAsync('users');
  };

  // Pagination
  const handlePrevious = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };

  const handleNext = () => {
    setOffset((prev) => prev + limit);
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
              <Users className="w-8 h-8 text-indigo-600" />
              User Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage all platform users - {filteredUsers.length} user(s)
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={exportDataMutation.isPending}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
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
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            />
          </div>

          {/* User Type Filter */}
          <div>
            <select
              value={selectedUserType}
              onChange={(e) => setSelectedUserType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">All User Types</option>
              <option value="employee">Employees</option>
              <option value="employer">Employers</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus === undefined ? '' : selectedStatus.toString()}
              onChange={(e) =>
                setSelectedStatus(
                  e.target.value === '' ? undefined : e.target.value === 'true'
                )
              }
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="">All Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="mt-4 flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <span className="text-sm text-indigo-700 dark:text-indigo-300">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => handleBulkAction(true)}
                disabled={bulkUpdateMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
              >
                Activate Selected
              </button>
              <button
                onClick={() => handleBulkAction(false)}
                disabled={bulkUpdateMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Deactivate Selected
              </button>
              <button
                onClick={() => setSelectedUsers([])}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 text-sm"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
      >
        {isLoading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading users...</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center p-12">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No users found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          filteredUsers.length > 0 &&
                          selectedUsers.length === filteredUsers.length
                        }
                        onChange={toggleSelectAll}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.map((userResponse) => (
                    <tr
                      key={userResponse.user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(userResponse.user.id)}
                          onChange={() => toggleUserSelection(userResponse.user.id)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                            {userResponse.user.first_name[0]}
                            {userResponse.user.last_name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 dark:text-gray-100">
                              {userResponse.user.first_name} {userResponse.user.last_name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                              <Mail className="w-3 h-3" />
                              {userResponse.user.email}
                            </div>
                            {userResponse.user.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Phone className="w-3 h-3" />
                                {userResponse.user.phone}
                              </div>
                            )}
                            {userResponse.user.company_name && (
                              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Building className="w-3 h-3" />
                                {userResponse.user.company_name}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            userResponse.user.user_type === 'employee'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {userResponse.user.user_type === 'employee' ? (
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              Employee
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-3 h-3" />
                              Employer
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {userResponse.user.user_type === 'employee' ? (
                            <>
                              <p>
                                Resumes: {userResponse.activity_summary.resume_count || 0}
                              </p>
                              <p>
                                Applications:{' '}
                                {userResponse.activity_summary.application_count || 0}
                              </p>
                            </>
                          ) : (
                            <>
                              <p>
                                Jobs: {userResponse.activity_summary.job_posting_count || 0}
                              </p>
                              <p>
                                Applications:{' '}
                                {userResponse.activity_summary.received_applications || 0}
                              </p>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <Calendar className="w-4 h-4" />
                          {new Date(userResponse.user.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() =>
                            handleStatusToggle(
                              userResponse.user.id,
                              userResponse.user.is_active
                            )
                          }
                          disabled={updateUserStatusMutation.isPending}
                          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            userResponse.user.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {userResponse.user.is_active ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg">
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing {offset + 1} to {Math.min(offset + limit, offset + filteredUsers.length)} of{' '}
                {filteredUsers.length} users
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={offset === 0}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={filteredUsers.length < limit}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default UserManagement;
