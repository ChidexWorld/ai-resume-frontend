import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { employerAPI } from "../services/api";

// Types for Employer API responses
interface Job {
  id: number;
  title: string;
  description: string;
  department?: string;
  location: string;
  remote_allowed?: boolean;
  job_type: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  required_skills?: string[];
  preferred_skills?: string[];
  required_education?: string;
  required_experience?: number;
  communication_requirements?: Record<string, unknown>;
  matching_weights?: Record<string, unknown>;
  is_urgent?: boolean;
  max_applications?: number;
  auto_match_enabled?: boolean;
  minimum_match_score?: number;
  status: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
}

interface JobApplication {
  id: number;
  job_id: number;
  employee_id: number;
  resume_id?: number;
  voice_analysis_id?: number;
  cover_letter?: string;
  status: string;
  match_score: number;
  notes?: string;
  interview_date?: string;
  applied_at: string;
  updated_at: string;
  employee: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
}

interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  skills: string[];
  experience_level: string;
  experience_years: number;
  location?: string;
  communication_score?: number;
  match_score?: number;
}

interface DashboardStats {
  total_jobs: number;
  active_jobs: number;
  total_applications: number;
  pending_applications: number;
  interviews_scheduled: number;
  applications_this_month: number;
  top_skills_demanded: string[];
  average_match_score: number;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      detail?: string;
    };
  };
}

// Job Management Hooks
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employerAPI.createJob,
    onSuccess: () => {
      toast.success("Job posted successfully!");
      queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to create job";
      toast.error(message);
    },
  });
};

export const useGetJobs = (params?: {
  status_filter?: string;
  limit?: number;
  offset?: number;
}) => {
  return useQuery({
    queryKey: ["employer-jobs", params],
    queryFn: () => employerAPI.getJobs(params).then((res) => res.data as Job[]),
  });
};

export const useGetJob = (id: number) => {
  return useQuery({
    queryKey: ["employer-job", id],
    queryFn: () => employerAPI.getJob(id).then((res) => res.data as Job),
    enabled: !!id,
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) =>
      employerAPI.updateJob(id, data),
    onSuccess: (_, { id }) => {
      toast.success("Job updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["employer-job", id] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update job";
      toast.error(message);
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employerAPI.deleteJob,
    onSuccess: () => {
      toast.success("Job deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to delete job";
      toast.error(message);
    },
  });
};

// Application Management Hooks
export const useGetJobApplications = (
  jobId: number,
  params?: {
    status_filter?: string;
    min_score?: number;
    limit?: number;
    offset?: number;
  }
) => {
  return useQuery({
    queryKey: ["job-applications", jobId, params],
    queryFn: () =>
      employerAPI
        .getJobApplications(jobId, params)
        .then((res) => res.data as JobApplication[]),
    enabled: !!jobId,
  });
};

export const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: number;
      data: {
        status: string;
        notes?: string;
      };
    }) => employerAPI.updateApplicationStatus(applicationId, data),
    onSuccess: () => {
      toast.success("Application status updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update application status";
      toast.error(message);
    },
  });
};

export const useScheduleInterview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      applicationId,
      data,
    }: {
      applicationId: number;
      data: {
        interview_date: string;
        notes?: string;
      };
    }) => employerAPI.scheduleInterview(applicationId, data),
    onSuccess: () => {
      toast.success("Interview scheduled successfully!");
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to schedule interview";
      toast.error(message);
    },
  });
};

// Candidate Search Hooks
export const useSearchCandidates = () => {
  return useMutation({
    mutationFn: (params: {
      skills?: string;
      experience_level?: string;
      min_experience_years?: number;
      location?: string;
      min_communication_score?: number;
      limit?: number;
    }) =>
      employerAPI
        .searchCandidates(params)
        .then((res) => res.data as Candidate[]),
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to search candidates";
      toast.error(message);
    },
  });
};

// Dashboard Stats Hook
export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () =>
      employerAPI.getDashboardStats().then((res) => res.data as DashboardStats),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
};

// Bulk Actions Hooks
export const useBulkUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      jobIds,
      status,
    }: {
      jobIds: number[];
      status: string;
    }) => {
      // Since there's no bulk update API, we'll update each job individually
      const promises = jobIds.map((id) =>
        employerAPI.updateJob(id, { status })
      );
      return Promise.all(promises);
    },
    onSuccess: (_, { jobIds }) => {
      toast.success(`${jobIds.length} job(s) updated successfully!`);
      queryClient.invalidateQueries({ queryKey: ["employer-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update jobs";
      toast.error(message);
    },
  });
};

export const useBulkUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      applicationIds,
      status,
      notes,
    }: {
      applicationIds: number[];
      status: string;
      notes?: string;
    }) => {
      // Since there's no bulk update API, we'll update each application individually
      const promises = applicationIds.map((id) =>
        employerAPI.updateApplicationStatus(id, { status, notes })
      );
      return Promise.all(promises);
    },
    onSuccess: (_, { applicationIds }) => {
      toast.success(
        `${applicationIds.length} application(s) updated successfully!`
      );
      queryClient.invalidateQueries({ queryKey: ["job-applications"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update applications";
      toast.error(message);
    },
  });
};
