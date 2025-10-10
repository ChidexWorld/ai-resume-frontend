import { api } from './api';

export interface Resume {
  id: number;
  employee_id: number;
  original_filename: string;
  file_path: string;
  file_size: number;
  content_type: string;
  is_analyzed: boolean;
  analysis_status: string;
  extracted_text?: string;
  analysis_results?: {
    contact_info?: Record<string, any>;
    skills?: Record<string, any>;
    experience?: Array<any>;
    education?: Array<any>;
    certifications?: Array<any>;
    languages?: Array<any>;
    professional_summary?: string;
    experience_level?: string;
    total_experience_years?: number;
  };
  created_at: string;
  updated_at: string;
  analyzed_at?: string;
}

export interface VoiceAnalysis {
  id: number;
  employee_id: number;
  original_filename: string;
  file_path: string;
  file_size: number;
  content_type: string;
  is_analyzed: boolean;
  analysis_status: string;
  transcription?: string;
  duration_seconds?: number; // Duration in seconds
  // Top-level scores for easy access
  overall_communication_score?: number;
  clarity_score?: number;
  confidence_score?: number;
  fluency_score?: number;
  pace_score?: number;
  // Detailed analysis results
  analysis_results?: {
    speech_features?: Record<string, any>;
    communication_analysis?: Record<string, any>;
    language_analysis?: Record<string, any>;
    clarity_score?: number;
    confidence_score?: number;
    fluency_score?: number;
    vocabulary_score?: number;
    overall_communication_score?: number;
    strengths?: Array<string>;
    areas_for_improvement?: Array<string>;
    speaking_pace?: string;
    professional_language_usage?: number;
    emotional_tone?: string;
    communication_summary?: Record<string, any>;
    transcript_stats?: Record<string, any>;
    summary?: string;
  };
  created_at: string;
  updated_at: string;
  analyzed_at?: string;
}

export interface MatchDetails {
  skills_score?: number;
  experience_score?: number;
  matching_skills?: string[];
  missing_skills?: string[];
  strengths?: string[];
  concerns?: string[];
  recommendations?: string[];
}

export interface JobApplication {
  id: number;
  employee_id?: number;
  job_posting_id: number;
  job_id: number;
  job_title: string;
  company_name: string;
  resume_id?: number;
  voice_analysis_id?: number;
  cover_letter?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'accepted' | 'rejected' | 'withdrawn';
  match_score: number;
  match_details?: MatchDetails;
  recommendation?: string;
  applied_at: string;
  reviewed_at?: string;
  interview_scheduled?: string;
  interview_scheduled_at?: string; // Legacy field name
  interview_type?: string;
  interview_location?: string;
  notes?: string;
  job_details?: any;
}

export interface JobRecommendation {
  match_id: number;
  job: {
    id: number;
    employer_id: number;
    title: string;
    description: string;
    department: string;
    location: string;
    remote_allowed: boolean;
    job_type: string;
    experience_level: string;
    salary_range?: string;
    currency: string;
    status: string;
    is_urgent: boolean;
    is_active: boolean;
    applications_count: number;
    max_applications?: number;
    auto_match_enabled: boolean;
    minimum_match_score: number;
    created_at: string;
    updated_at: string;
    expires_at?: string;
    required_skills: string[];
    preferred_skills: string[];
    required_education?: any;
    required_experience: {
      minimum_years: number;
      preferred_areas: string[];
    };
    communication_requirements?: any;
    matching_weights?: any;
  };
  match_score: number;
  match_details: {
    skills_score: number;
    experience_score: number;
    matching_skills: string[];
    missing_skills: string[];
    strengths: string[];
    concerns: string[];
    recommendations: string[];
  };
  created_at: string;
}

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  company_name: string;
  location: string;
  remote_allowed: boolean;
  job_type: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  salary_range?: string;
  currency: string;
  required_skills: string[];
  preferred_skills: string[];
  status: string;
  department?: string;
  is_urgent?: boolean;
  applications_count?: number;
  minimum_match_score?: number;
  created_at: string;
  updated_at?: string;
  expires_at?: string;
}

export interface JobSearchResponse {
  jobs: JobPosting[];
  total_count: number;
  limit: number;
  offset: number;
  has_more: boolean;
}

export interface DashboardStats {
  total_resumes: number;
  analyzed_resumes: number;
  total_applications: number;
  pending_applications: number;
  interview_requests: number;
  average_match_score: number;
  profile_completion: number;
  recent_activity_count: number;
}


export const employeeService = {
  // Dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get("/employee/dashboard/stats");
    return response.data;
  },

  // Resume management
  uploadResume: async (file: File): Promise<Resume> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/employee/resume/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getResumes: async (): Promise<Resume[]> => {
    const response = await api.get("/employee/resumes");
    return response.data;
  },

  getResume: async (resumeId: number): Promise<Resume> => {
    const response = await api.get(`/employee/resumes/${resumeId}`);
    return response.data;
  },

  deleteResume: async (resumeId: number): Promise<void> => {
    await api.delete(`/employee/resumes/${resumeId}`);
  },

  downloadResume: async (resumeId: number): Promise<Blob> => {
    const response = await api.get(`/employee/resumes/${resumeId}/download`, {
      responseType: "blob",
    });
    return response.data;
  },

  // Voice analysis
  uploadVoiceAnalysis: async (
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<VoiceAnalysis> => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post("/employee/voice/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
    return response.data;
  },

  getVoiceAnalyses: async (): Promise<VoiceAnalysis[]> => {
    const response = await api.get("/employee/voice-analyses");
    return response.data;
  },

  getVoiceAnalysis: async (analysisId: number): Promise<VoiceAnalysis> => {
    const response = await api.get(`/employee/voice-analyses/${analysisId}`);
    return response.data;
  },

  deleteVoiceAnalysis: async (analysisId: number): Promise<void> => {
    await api.delete(`/employee/voice-analyses/${analysisId}`);
  },

  // Job applications
  applyToJob: async (
    jobId: number,
    applicationData: {
      resume_id?: number;
      voice_analysis_id?: number;
      cover_letter?: string;
    }
  ): Promise<JobApplication> => {
    const response = await api.post(
      `/employee/apply/${jobId}`,
      applicationData
    );
    return response.data;
  },

  getApplications: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<JobApplication[]> => {
    const response = await api.get("/employee/applications", { params });
    return response.data;
  },

  getApplication: async (applicationId: number): Promise<JobApplication> => {
    const response = await api.get(`/employee/applications/${applicationId}`);
    return response.data;
  },

  withdrawApplication: async (applicationId: number): Promise<void> => {
    await api.put(`/employee/applications/${applicationId}/withdraw`);
  },

  // Job search and recommendations
  getJobRecommendations: async (params?: {
    limit?: number;
    min_score?: number;
  }): Promise<JobRecommendation[]> => {
    try {
      const response = await api.get("/employee/job-recommendations", {
        params,
      });
      return response.data;
    } catch (error) {
      console.error("📡 Recommendations API error:", error);
      throw error;
    }
  },

  searchJobs: async (params: {
    q?: string;
    location?: string;
    job_type?: string;
    experience_level?: string;
    remote_allowed?: boolean;
    min_salary?: number;
    max_salary?: number;
    skills?: string;
    department?: string;
    limit?: number;
    offset?: number;
  }): Promise<JobSearchResponse> => {
    const response = await api.get("/employee/jobs/search", { params });
    return response.data;
  },

  getJobDetails: async (jobId: number): Promise<JobPosting> => {
    const response = await api.get(`/employee/jobs/${jobId}`);
    return response.data;
  },

  // Skills and analysis
  getSkillsAnalysis: async (): Promise<any> => {
    const response = await api.get("/employee/skills-analysis");
    return response.data;
  },

  analyzeJobMatch: async (jobId: number, resumeId?: number): Promise<any> => {
    const response = await api.post(`/employee/analyze-job-match/${jobId}`, {
      resume_id: resumeId,
    });
    return response.data;
  },

  // Profile management
  getProfile: async (): Promise<any> => {
    const response = await api.get("/employee/profile");
    return response.data;
  },

  updateProfile: async (profileData: any): Promise<any> => {
    const response = await api.put("/employee/profile", profileData);
    return response.data;
  },



  // Settings
  getSettings: async (): Promise<any> => {
    const response = await api.get("/employee/settings");
    return response.data;
  },

  updateSettings: async (settings: any): Promise<any> => {
    const response = await api.put("/employee/settings", settings);
    return response.data;
  },

  // Assessments (placeholder for future implementation)
  getAssessments: async (): Promise<any[]> => {
    // This is a placeholder - the backend endpoint doesn't exist yet
    // Return empty array for now
    return [];
  },
};