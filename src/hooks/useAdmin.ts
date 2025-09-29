import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { adminAPI } from "../services/api";

// Types for Admin API responses based on backend SystemStatsResponse schema
interface SystemStats {
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

interface UserManagementResponse {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: "employee" | "employer";
    phone?: string;
    company_name?: string;
    company_website?: string;
    company_size?: string;
    is_active: boolean;
    is_verified: boolean;
    created_at: string;
    updated_at: string;
  };
  activity_summary: Record<string, any>;
  last_login: string;
  account_status: string;
}

interface ContentModerationResponse {
  content_type: string;
  total_items: number;
  flagged_only: boolean;
  items: Array<{
    id: number;
    title?: string;
    department?: string;
    status: string;
    created_at: string;
    [key: string]: any;
  }>;
}

interface AnalyticsTrends {
  period_days: number;
  start_date: string;
  trends: {
    daily_registrations: Array<{
      date: string;
      count: number;
    }>;
    daily_job_postings: Array<{
      date: string;
      count: number;
    }>;
    daily_applications: Array<{
      date: string;
      count: number;
    }>;
    daily_matches: Array<{
      date: string;
      total_matches: number;
      high_score_matches: number;
      success_rate: number;
    }>;
  };
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      detail?: string;
    };
  };
}

// System Statistics Hooks
export const useGetSystemStats = () => {
  return useQuery({
    queryKey: ["admin-system-stats"],
    queryFn: () =>
      adminAPI.getSystemStats().then((res) => res.data as SystemStats),
    refetchInterval: 60000, // Refetch every minute
  });
};

// User Management Hooks
export const useGetUsers = (params?: {
  user_type?: string;
  is_active?: boolean;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ["admin-users", params],
    queryFn: () => adminAPI.getUsers(params).then((res) => res.data as UserManagementResponse[]),
  });
};

export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, isActive }: { userId: number; isActive: boolean }) =>
      adminAPI.updateUserStatus(userId, isActive),
    onSuccess: (_, { isActive, userId }) => {
      const action = isActive ? "activated" : "deactivated";
      toast.success(`User ${action} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-system-stats"] });
      // Also invalidate specific user if we're viewing their details
      queryClient.invalidateQueries({ queryKey: ["admin-user", userId] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update user status";
      toast.error(message);
    },
  });
};

// Content Moderation Hooks
export const useGetContentForModeration = (params: {
  content_type: "resumes" | "jobs" | "applications";
  flagged_only?: boolean;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["admin-content-moderation", params],
    queryFn: () =>
      adminAPI
        .getContentForModeration(params)
        .then((res) => res.data as ContentModerationResponse),
  });
};

export const useMarkContentAsReviewed = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      contentIds,
      approved,
    }: {
      contentIds: number[];
      approved: boolean;
    }) => {
      // This is a mock implementation since the API doesn't have this endpoint
      // You would need to implement this on the backend
      return Promise.resolve({ contentIds, approved });
    },
    onSuccess: (_, { contentIds, approved }) => {
      const action = approved ? "approved" : "rejected";
      toast.success(`${contentIds.length} item(s) ${action} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["admin-content-moderation"] });
    },
    onError: (error: ApiError) => {
      toast.error("Failed to update content status");
    },
  });
};

// Analytics Hooks
export const useGetAnalyticsTrends = (params?: { days?: number }) => {
  return useQuery({
    queryKey: ["admin-analytics-trends", params],
    queryFn: () =>
      adminAPI
        .getAnalyticsTrends(params)
        .then((res) => res.data as AnalyticsTrends),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// System Cleanup Hooks
export const useCleanupSystemData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      cleanup_type: "inactive_users" | "old_files" | "failed_analyses";
      days_threshold?: number;
    }) => adminAPI.cleanupSystemData(params),
    onSuccess: (_, { cleanup_type }) => {
      const cleanupLabels = {
        inactive_users: "inactive users",
        old_files: "old files",
        failed_analyses: "failed analyses",
      };
      toast.success(
        `System cleanup completed for ${cleanupLabels[cleanup_type]}!`
      );
      queryClient.invalidateQueries({ queryKey: ["admin-system-stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin-analytics-trends"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to cleanup system data";
      toast.error(message);
    },
  });
};

// Bulk User Operations
export const useBulkUpdateUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userIds,
      isActive,
    }: {
      userIds: number[];
      isActive: boolean;
    }) => {
      // Since there's no bulk update API, we'll update each user individually
      const promises = userIds.map((id) =>
        adminAPI.updateUserStatus(id, isActive)
      );
      return Promise.all(promises);
    },
    onSuccess: (_, { userIds, isActive }) => {
      const action = isActive ? "activated" : "deactivated";
      toast.success(`${userIds.length} user(s) ${action} successfully!`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-system-stats"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update users";
      toast.error(message);
    },
  });
};

// Export System Data (Mock implementation - you'd need backend support)
export const useExportSystemData = () => {
  return useMutation({
    mutationFn: async (
      exportType: "users" | "jobs" | "applications" | "all"
    ) => {
      // Mock implementation - replace with actual API call
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = `Mock export data for ${exportType}`;
          const blob = new Blob([data], { type: "text/csv" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${exportType}_export_${
            new Date().toISOString().split("T")[0]
          }.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve(data);
        }, 1000);
      });
    },
    onSuccess: (_, exportType) => {
      toast.success(`${exportType} data exported successfully!`);
    },
    onError: () => {
      toast.error("Failed to export data");
    },
  });
};

// System Health Check
export const useSystemHealthCheck = () => {
  return useMutation({
    mutationFn: async () => {
      // Mock implementation - replace with actual health check endpoint
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            database: "healthy",
            storage: "healthy",
            external_services: "healthy",
            memory_usage: "65%",
            cpu_usage: "23%",
          });
        }, 2000);
      });
    },
    onSuccess: () => {
      toast.success("System health check completed!");
    },
    onError: () => {
      toast.error("System health check failed");
    },
  });
};
