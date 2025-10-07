import api from './api';

export interface SystemStats {
  total_users: number;
  active_users: number;
  total_employees: number;
  total_employers: number;
  total_job_postings: number;
  active_job_postings: number;
  total_resumes: number;
  analyzed_resumes: number;
  total_voice_analyses: number;
  completed_voice_analyses: number;
  total_applications: number;
  pending_applications: number;
  total_matches: number;
  high_score_matches: number;
  new_users_this_week: number;
  new_resumes_this_week: number;
  new_applications_this_week: number;
  average_match_score: number;
  average_applications_per_job: number;
}

export interface UserManagement {
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    full_name: string;
    user_type: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  };
  activity_summary: Record<string, any>;
  last_login: string;
  account_status: string;
}

export interface AnalyticsTrends {
  period_days: number;
  start_date: string;
  trends: {
    daily_registrations: Array<{ date: string; count: number }>;
    daily_job_postings: Array<{ date: string; count: number }>;
    daily_applications: Array<{ date: string; count: number }>;
    daily_matches: Array<{
      date: string;
      total_matches: number;
      high_score_matches: number;
      success_rate: number;
    }>;
  };
}

export interface ContentModerationItem {
  content_type: string;
  total_items: number;
  flagged_only: boolean;
  items: Array<Record<string, any>>;
}

export interface CleanupResult {
  cleanup_type: string;
  items_processed: number;
  threshold_days: number;
  message: string;
}

export const adminAPI = {
  // Get system statistics
  getSystemStats: () => api.get<SystemStats>('/admin/stats/system'),

  // User management
  getUsers: (params?: {
    user_type?: string;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }) => api.get<UserManagement[]>('/admin/users', { params }),

  updateUserStatus: (userId: number, isActive: boolean) =>
    api.put(`/admin/users/${userId}/status`, null, {
      params: { is_active: isActive },
    }),

  // Content moderation
  getContentForModeration: (params: {
    content_type: 'resumes' | 'jobs' | 'applications';
    flagged_only?: boolean;
    limit?: number;
  }) => api.get<ContentModerationItem>('/admin/content/moderation', { params }),

  // Analytics
  getAnalyticsTrends: (days: number = 30) =>
    api.get<AnalyticsTrends>('/admin/analytics/trends', {
      params: { days },
    }),

  // System cleanup
  cleanupSystemData: (params: {
    cleanup_type: 'inactive_users' | 'old_files' | 'failed_analyses';
    days_threshold?: number;
  }) => api.post<CleanupResult>('/admin/system/cleanup', null, { params }),
};

export default adminAPI;
