import React from 'react';
import { Mail, Phone, Building, Calendar, CheckCircle, XCircle, MoreVertical, Users, Briefcase } from 'lucide-react';

interface UserData {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    user_type: string;
    phone?: string;
    company_name?: string;
    is_active: boolean;
    created_at: string;
  };
  activity_summary: {
    resume_count?: number;
    application_count?: number;
    job_posting_count?: number;
    received_applications?: number;
  };
}

interface UserTableRowProps {
  userResponse: UserData;
  isSelected: boolean;
  onSelect: (userId: number) => void;
  onStatusToggle: (userId: number, currentStatus: boolean) => void;
  isUpdating: boolean;
}

export const UserTableRow: React.FC<UserTableRowProps> = ({
  userResponse,
  isSelected,
  onSelect,
  onStatusToggle,
  isUpdating,
}) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
      <td className="px-6 py-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(userResponse.user.id)}
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
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
              : userResponse.user.user_type === 'employer'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
          }`}
        >
          {userResponse.user.user_type === 'employee' ? (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              Employee
            </span>
          ) : userResponse.user.user_type === 'employer' ? (
            <span className="flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              Employer
            </span>
          ) : (
            <span className="flex items-center gap-1">Admin</span>
          )}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {userResponse.user.user_type === 'employee' ? (
            <>
              <p>Resumes: {userResponse.activity_summary.resume_count || 0}</p>
              <p>Applications: {userResponse.activity_summary.application_count || 0}</p>
            </>
          ) : (
            <>
              <p>Jobs: {userResponse.activity_summary.job_posting_count || 0}</p>
              <p>Applications: {userResponse.activity_summary.received_applications || 0}</p>
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
          onClick={() => onStatusToggle(userResponse.user.id, userResponse.user.is_active)}
          disabled={isUpdating}
          className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            userResponse.user.is_active
              ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300'
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
  );
};
