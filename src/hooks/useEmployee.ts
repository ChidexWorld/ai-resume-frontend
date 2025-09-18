import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { employeeAPI } from "../services/api";
import type { Resume, VoiceAnalysis, JobApplication, JobRecommendation, ApiError } from "../types";

// Resume Management Hooks
export const useUploadResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeAPI.uploadResume,
    onSuccess: () => {
      toast.success("Resume uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to upload resume";
      toast.error(message);
    },
  });
};

export const useGetResumes = () => {
  return useQuery({
    queryKey: ["resumes"],
    queryFn: () => employeeAPI.getResumes().then((res) => res.data as Resume[]),
  });
};

export const useGetResume = (id: number) => {
  return useQuery({
    queryKey: ["resume", id],
    queryFn: () => employeeAPI.getResume(id).then((res) => res.data as Resume),
    enabled: !!id,
  });
};

export const useDeleteResume = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeAPI.deleteResume,
    onSuccess: () => {
      toast.success("Resume deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["resumes"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to delete resume";
      toast.error(message);
    },
  });
};

// Voice Analysis Hooks
export const useUploadVoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeAPI.uploadVoice,
    onSuccess: () => {
      toast.success(
        "Voice sample uploaded successfully! Analysis in progress..."
      );
      queryClient.invalidateQueries({ queryKey: ["voice-analyses"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to upload voice sample";
      toast.error(message);
    },
  });
};

export const useGetVoiceAnalyses = () => {
  return useQuery({
    queryKey: ["voice-analyses"],
    queryFn: () =>
      employeeAPI.getVoiceAnalyses().then((res) => res.data as VoiceAnalysis[]),
  });
};

export const useGetVoiceAnalysis = (id: number) => {
  return useQuery({
    queryKey: ["voice-analysis", id],
    queryFn: () =>
      employeeAPI.getVoiceAnalysis(id).then((res) => res.data as VoiceAnalysis),
    enabled: !!id,
  });
};

export const useDeleteVoiceAnalysis = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: employeeAPI.deleteVoiceAnalysis,
    onSuccess: () => {
      toast.success("Voice analysis deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["voice-analyses"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to delete voice analysis";
      toast.error(message);
    },
  });
};

// Job Application Hooks
export const useApplyToJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      data,
    }: {
      jobId: number;
      data: {
        resume_id?: number;
        voice_analysis_id?: number;
        cover_letter?: string;
      };
    }) => employeeAPI.applyToJob(jobId, data),
    onSuccess: () => {
      toast.success("Application submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["job-recommendations"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to submit application";
      toast.error(message);
    },
  });
};

export const useGetApplications = () => {
  return useQuery({
    queryKey: ["applications"],
    queryFn: () =>
      employeeAPI.getApplications().then((res) => res.data as JobApplication[]),
  });
};

export const useGetApplication = (id: number) => {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () =>
      employeeAPI.getApplication(id).then((res) => res.data as JobApplication),
    enabled: !!id,
  });
};

// Job Recommendations Hooks
export const useGetJobRecommendations = (params?: {
  limit?: number;
  min_score?: number;
}) => {
  return useQuery({
    queryKey: ["job-recommendations", params],
    queryFn: () =>
      employeeAPI
        .getJobRecommendations(params)
        .then((res) => res.data as JobRecommendation[]),
  });
};

// Refresh job recommendations
export const useRefreshJobRecommendations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // This will trigger a refetch of job recommendations
      await queryClient.invalidateQueries({
        queryKey: ["job-recommendations"],
      });
      return Promise.resolve();
    },
    onSuccess: () => {
      toast.success("Job recommendations refreshed!");
    },
    onError: () => {
      toast.error("Failed to refresh job recommendations");
    },
  });
};
