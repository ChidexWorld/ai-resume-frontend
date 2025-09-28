import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth-storage');
  if (token) {
    try {
      const parsed = JSON.parse(token);
      if (parsed.state.token) {
        config.headers.Authorization = `Bearer ${parsed.state.token}`;
      }
    } catch (error) {
      console.error('Error parsing auth token:', error);
    }
  }
  return config;
});

export interface Resume {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  status: 'uploaded' | 'processing' | 'analyzed' | 'failed';
  total_experience_years: number;
  experience_level: string;
  skills: string[];
  education: any;
  contact_info: any;
  summary: string;
  analysis_results: any;
  is_active: boolean;
  is_analyzed: boolean;
  created_at: string;
  updated_at: string;
}

export interface VoiceAnalysis {
  id: number;
  filename: string;
  original_filename: string;
  file_path: string;
  file_size: number;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  duration_seconds: number;
  overall_communication_score: number;
  fluency_score: number;
  clarity_score: number;
  confidence_score: number;
  pace_score: number;
  pronunciation_score: number;
  analysis_results: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface JobApplication {
  id: number;
  job_id: number;
  job_title: string;
  company_name: string;
  resume_id?: number;
  voice_analysis_id?: number;
  cover_letter?: string;
  status: 'pending' | 'reviewing' | 'shortlisted' | 'interviewed' | 'accepted' | 'rejected' | 'withdrawn';
  match_score: number;
  applied_at: string;
  reviewed_at?: string;
  interview_scheduled_at?: string;
  notes?: string;
  job_details?: any;
}

export interface JobRecommendation {
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
  currency: string;
  required_skills: string[];
  preferred_skills: string[];
  match_score: number;
  match_details: any;
  created_at: string;
  expires_at?: string;
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
  currency: string;
  required_skills: string[];
  preferred_skills: string[];
  status: string;
  created_at: string;
  expires_at?: string;
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
    const response = await api.get('/api/employee/dashboard/stats');
    return response.data;
  },

  // Resume management
  uploadResume: async (file: File): Promise<Resume> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/employee/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getResumes: async (): Promise<Resume[]> => {
    const response = await api.get('/api/employee/resumes');
    return response.data;
  },

  getResume: async (resumeId: number): Promise<Resume> => {
    const response = await api.get(`/api/employee/resumes/${resumeId}`);
    return response.data;
  },

  deleteResume: async (resumeId: number): Promise<void> => {
    await api.delete(`/api/employee/resumes/${resumeId}`);
  },

  downloadResume: async (resumeId: number): Promise<Blob> => {
    const response = await api.get(`/api/employee/resumes/${resumeId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  },

  // Voice analysis
  uploadVoiceAnalysis: async (file: File): Promise<VoiceAnalysis> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/api/employee/voice/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getVoiceAnalyses: async (): Promise<VoiceAnalysis[]> => {
    const response = await api.get('/api/employee/voice-analyses');
    return response.data;
  },

  getVoiceAnalysis: async (analysisId: number): Promise<VoiceAnalysis> => {
    const response = await api.get(`/api/employee/voice-analyses/${analysisId}`);
    return response.data;
  },

  deleteVoiceAnalysis: async (analysisId: number): Promise<void> => {
    await api.delete(`/api/employee/voice-analyses/${analysisId}`);
  },

  // Job applications
  applyToJob: async (jobId: number, applicationData: {
    resume_id?: number;
    voice_analysis_id?: number;
    cover_letter?: string;
  }): Promise<JobApplication> => {
    const response = await api.post(`/api/employee/apply/${jobId}`, applicationData);
    return response.data;
  },

  getApplications: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<JobApplication[]> => {
    const response = await api.get('/api/employee/applications', { params });
    return response.data;
  },

  getApplication: async (applicationId: number): Promise<JobApplication> => {
    const response = await api.get(`/api/employee/applications/${applicationId}`);
    return response.data;
  },

  withdrawApplication: async (applicationId: number): Promise<void> => {
    await api.put(`/api/employee/applications/${applicationId}/withdraw`);
  },

  // Job search and recommendations
  getJobRecommendations: async (params?: {
    limit?: number;
    min_score?: number;
  }): Promise<JobRecommendation[]> => {
    const response = await api.get('/api/employee/job-recommendations', { params });
    return response.data;
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
    limit?: number;
    offset?: number;
  }): Promise<JobPosting[]> => {
    const response = await api.get('/api/employee/jobs/search', { params });
    return response.data;
  },

  getJobDetails: async (jobId: number): Promise<JobPosting> => {
    const response = await api.get(`/api/employee/jobs/${jobId}`);
    return response.data;
  },

  // Skills and analysis
  getSkillsAnalysis: async (): Promise<any> => {
    const response = await api.get('/api/employee/skills-analysis');
    return response.data;
  },

  analyzeJobMatch: async (jobId: number, resumeId?: number): Promise<any> => {
    const response = await api.post(`/api/employee/analyze-job-match/${jobId}`, {
      resume_id: resumeId
    });
    return response.data;
  },

  // Profile management
  getProfile: async (): Promise<any> => {
    const response = await api.get('/api/employee/profile');
    return response.data;
  },

  updateProfile: async (profileData: any): Promise<any> => {
    const response = await api.put('/api/employee/profile', profileData);
    return response.data;
  },

  // Learning and assessments
  getAssessments: async (): Promise<any[]> => {
    const response = await api.get('/api/employee/assessments');
    return response.data;
  },

  takeAssessment: async (assessmentId: number, answers: any): Promise<any> => {
    const response = await api.post(`/api/employee/assessments/${assessmentId}/take`, answers);
    return response.data;
  },

  getLearningPaths: async (): Promise<any[]> => {
    const response = await api.get('/api/employee/learning-paths');
    return response.data;
  },

  enrollInLearningPath: async (pathId: number): Promise<any> => {
    const response = await api.post(`/api/employee/learning-paths/${pathId}/enroll`);
    return response.data;
  },

  // Messages and notifications
  getMessages: async (params?: {
    type?: 'received' | 'sent';
    unread_only?: boolean;
    limit?: number;
  }): Promise<any[]> => {
    const response = await api.get('/api/employee/messages', { params });
    return response.data;
  },

  sendMessage: async (messageData: {
    recipient_id: number;
    subject: string;
    content: string;
  }): Promise<any> => {
    const response = await api.post('/api/employee/messages', messageData);
    return response.data;
  },

  markMessageAsRead: async (messageId: number): Promise<void> => {
    await api.put(`/api/employee/messages/${messageId}/read`);
  },

  getNotifications: async (params?: {
    unread_only?: boolean;
    limit?: number;
  }): Promise<any[]> => {
    const response = await api.get('/api/employee/notifications', { params });
    return response.data;
  },

  markNotificationAsRead: async (notificationId: number): Promise<void> => {
    await api.put(`/api/employee/notifications/${notificationId}/read`);
  },

  // Settings
  getSettings: async (): Promise<any> => {
    const response = await api.get('/api/employee/settings');
    return response.data;
  },

  updateSettings: async (settings: any): Promise<any> => {
    const response = await api.put('/api/employee/settings', settings);
    return response.data;
  },
};