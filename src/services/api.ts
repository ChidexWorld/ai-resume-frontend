import axios from 'axios';
import type { RegisterData, LoginCredentials, UserUpdateData } from '../types';

// Create axios instance
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8000') + '/api',
  timeout: 30000,
});

// Request interceptor to add auth token
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

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Authentication API - Matches server auth router
export const authAPI = {
  register: (userData: RegisterData) => api.post('/auth/register', userData),

  login: (credentials: LoginCredentials) => api.post('/auth/login', credentials),

  getProfile: () => api.get('/auth/me'),

  updateProfile: (data: UserUpdateData) => api.put('/auth/me', data),

  changePassword: (currentPassword: string, newPassword: string) => {
    const params = new URLSearchParams();
    params.append('current_password', currentPassword);
    params.append('new_password', newPassword);
    return api.post('/auth/change-password', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },

  deactivateAccount: () => api.delete('/auth/deactivate'),

  verifyToken: () => api.post('/auth/verify-token'),
};

// Employee API - Matches server employee router
export const employeeAPI = {
  // Resume management
  uploadResume: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/employee/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getResumes: () => api.get('/employee/resumes'),

  getResume: (id: number) => api.get(`/employee/resumes/${id}`),

  deleteResume: (id: number) => api.delete(`/employee/resumes/${id}`),

  // Voice analysis
  uploadVoice: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/employee/voice/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  getVoiceAnalyses: () => api.get('/employee/voice-analyses'),

  getVoiceAnalysis: (id: number) => api.get(`/employee/voice-analyses/${id}`),

  deleteVoiceAnalysis: (id: number) => api.delete(`/employee/voice-analyses/${id}`),

  // Job applications
  applyToJob: (jobId: number, data: {
    resume_id?: number;
    voice_analysis_id?: number;
    cover_letter?: string;
  }) => api.post(`/employee/apply/${jobId}`, data),

  getApplications: () => api.get('/employee/applications'),

  getApplication: (id: number) => api.get(`/employee/applications/${id}`),

  // Job recommendations
  getJobRecommendations: (params?: {
    limit?: number;
    min_score?: number;
  }) => api.get('/employee/job-recommendations', { params }),

  // Skills analysis
  getSkillsAnalysis: () => api.get('/employee/skills-analysis'),

  // Job match analysis
  analyzeJobMatch: (jobId: number, resumeId?: number) =>
    api.post(`/employee/analyze-job-match/${jobId}`, { resume_id: resumeId }),
};

// Employer API - Matches server employer router
export const employerAPI = {
  // Job posting management
  createJob: (data: {
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
    expires_at?: string;
  }) => api.post('/employer/jobs', data),

  getJobs: (params?: {
    status_filter?: string;
    limit?: number;
    offset?: number;
  }) => api.get('/employer/jobs', { params }),

  getJob: (id: number) => api.get(`/employer/jobs/${id}`),

  updateJob: (id: number, data: Record<string, unknown>) => api.put(`/employer/jobs/${id}`, data),

  deleteJob: (id: number) => api.delete(`/employer/jobs/${id}`),

  // Application management
  getJobApplications: (jobId: number, params?: {
    status_filter?: string;
    min_score?: number;
    limit?: number;
    offset?: number;
  }) => api.get(`/employer/jobs/${jobId}/applications`, { params }),

  updateApplicationStatus: (applicationId: number, data: {
    status: string;
    notes?: string;
  }) => api.put(`/employer/applications/${applicationId}/status`, data),

  scheduleInterview: (applicationId: number, data: {
    interview_date: string;
    notes?: string;
  }) => api.post(`/employer/applications/${applicationId}/interview`, data),

  // Candidate search
  searchCandidates: (params?: {
    skills?: string;
    experience_level?: string;
    min_experience_years?: number;
    location?: string;
    min_communication_score?: number;
    limit?: number;
  }) => api.get('/employer/candidates/search', { params }),

  // Dashboard stats
  getDashboardStats: () => api.get('/employer/dashboard/stats'),
};

// Matching API - Matches server matching router
export const matchingAPI = {
  // Generate AI matches for job posting
  generateJobMatches: (jobId: number, params?: {
    limit?: number;
    min_score?: number;
  }) => api.post(`/matching/generate-matches/${jobId}`, {}, { params }),

  // Get job matches for employee
  getEmployeeMatches: (params?: {
    min_score?: number;
    limit?: number;
    offset?: number;
  }) => api.get('/matching/employee-matches', { params }),

  // Calculate match score between resume and job
  calculateMatch: (data: {
    resume_id: number;
    job_id?: number;
    job_requirements?: Record<string, unknown>;
  }) => api.post('/matching/calculate-match', data),

  // Dismiss a job match
  dismissMatch: (matchId: number) => api.post(`/matching/dismiss-match/${matchId}`),

  // Get matching statistics
  getMatchingStats: () => api.get('/matching/matching-stats'),

  // Generate bulk matches (admin/system use)
  generateBulkMatches: (params?: {
    employer_id?: number;
    min_score?: number;
  }) => api.post('/matching/bulk-match-generation', {}, { params }),
};

// Admin API - Matches server admin router (restricted access)
export const adminAPI = {
  // System statistics
  getSystemStats: () => api.get('/admin/stats/system'),

  // User management
  getUsers: (params?: {
    user_type?: string;
    is_active?: boolean;
    limit?: number;
    offset?: number;
  }) => api.get('/admin/users', { params }),

  updateUserStatus: (userId: number, isActive: boolean) =>
    api.put(`/admin/users/${userId}/status`, { is_active: isActive }),

  // Content moderation
  getContentForModeration: (params: {
    content_type: 'resumes' | 'jobs' | 'applications';
    flagged_only?: boolean;
    limit?: number;
  }) => api.get('/admin/content/moderation', { params }),

  // Analytics trends
  getAnalyticsTrends: (params?: {
    days?: number;
  }) => api.get('/admin/analytics/trends', { params }),

  // System cleanup
  cleanupSystemData: (params: {
    cleanup_type: 'inactive_users' | 'old_files' | 'failed_analyses';
    days_threshold?: number;
  }) => api.post('/admin/system/cleanup', {}, { params }),
};

export default api;