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

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  department?: string;
  location: string;
  remote_allowed: boolean;
  job_type: string;
  experience_level: string;
  salary_min?: number;
  salary_max?: number;
  currency: string;
  benefits?: string;
  required_skills: string[];
  preferred_skills: string[];
  required_education?: any;
  required_experience?: any;
  communication_requirements?: any;
  matching_weights?: any;
  is_urgent: boolean;
  applications_count: number;
  max_applications?: number;
  auto_match_enabled: boolean;
  minimum_match_score?: number;
  expires_at?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: number;
  employee_id: number;
  job_posting_id: number;
  resume_id?: number;
  voice_analysis_id?: number;
  status: string;
  match_score: number;
  applied_at: string;
  reviewed_at?: string;
  interview_scheduled_at?: string;
  notes?: string;
  ai_match_analysis?: any;
}

export interface Employee {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  is_active: boolean;
  created_at: string;
}

export interface Resume {
  id: number;
  filename: string;
  status: string;
  total_experience_years: number;
  experience_level: string;
  skills: any;
  education: any;
  contact_info: any;
  summary: string;
  created_at: string;
}

export interface VoiceAnalysis {
  id: number;
  filename: string;
  status: string;
  overall_communication_score: number;
  fluency_score: number;
  clarity_score: number;
  confidence_score: number;
  analysis_results: any;
  created_at: string;
}

export interface CandidateSearchResponse {
  employee: Employee;
  resume_analysis: Resume;
  voice_analysis?: VoiceAnalysis;
  match_summary: {
    skills_match?: string[];
    experience_years: number;
    communication_score?: number;
    ai_match_score?: number;
    ai_matching_details?: any;
    strengths?: string[];
    concerns?: string[];
    recommendations?: string[];
  };
}

export interface ApplicationReviewResponse {
  application: Application;
  employee: Employee;
  resume_analysis?: Resume;
  voice_analysis?: VoiceAnalysis;
}

export interface DashboardStats {
  company_name: string;
  total_job_postings: number;
  active_job_postings: number;
  total_applications: number;
  pending_applications: number;
  recent_applications_30d: number;
  average_applications_per_job: number;
}

export interface Interview {
  id: number;
  application_id: number;
  candidate_name: string;
  candidate_email: string;
  job_title: string;
  interview_date: Date;
  interview_type: 'video' | 'phone' | 'in_person';
  location_or_link?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  candidate_id: number;
  job_id: number;
}

export const employerService = {
  // Dashboard stats
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/api/employer/dashboard/stats');
    return response.data;
  },

  // Job postings
  getJobPostings: async (params?: {
    status_filter?: string;
    limit?: number;
    offset?: number;
  }): Promise<JobPosting[]> => {
    const response = await api.get('/api/employer/jobs', { params });
    return response.data;
  },

  getJobPosting: async (jobId: number): Promise<JobPosting> => {
    const response = await api.get(`/api/employer/jobs/${jobId}`);
    return response.data;
  },

  createJobPosting: async (jobData: Partial<JobPosting>): Promise<JobPosting> => {
    const response = await api.post('/api/employer/jobs', jobData);
    return response.data;
  },

  updateJobPosting: async (jobId: number, jobData: Partial<JobPosting>): Promise<JobPosting> => {
    const response = await api.put(`/api/employer/jobs/${jobId}`, jobData);
    return response.data;
  },

  deleteJobPosting: async (jobId: number): Promise<void> => {
    console.log('Deleting job with ID:', jobId);
    const response = await api.delete(`/api/employer/jobs/${jobId}`);
    console.log('Delete response:', response);
    return response.data;
  },

  // Applications
  getJobApplications: async (jobId: number, params?: {
    status_filter?: string;
    min_score?: number;
    limit?: number;
    offset?: number;
  }): Promise<ApplicationReviewResponse[]> => {
    const response = await api.get(`/api/employer/jobs/${jobId}/applications`, { params });
    return response.data;
  },

  updateApplicationStatus: async (
    applicationId: number,
    status: string,
    notes?: string
  ): Promise<ApplicationReviewResponse> => {
    const response = await api.put(`/api/employer/applications/${applicationId}/status`, {
      status,
      notes
    });
    return response.data;
  },

  scheduleInterview: async (
    applicationId: number,
    interviewData: {
      interview_date: string;
      interview_type: 'video' | 'phone' | 'in_person';
      location_or_link?: string;
      notes?: string;
    }
  ): Promise<any> => {
    const response = await api.post(`/api/employer/applications/${applicationId}/interview`, {
      application_id: applicationId,
      ...interviewData
    });
    return response.data;
  },

  // Candidate search
  searchCandidates: async (params: {
    skills?: string;
    experience_level?: string;
    min_experience_years?: number;
    location?: string;
    min_communication_score?: number;
    limit?: number;
  }): Promise<CandidateSearchResponse[]> => {
    const response = await api.get('/api/employer/candidates/search', { params });
    return response.data;
  },

  // AI recommendations - Updated to use new matching API
  getAIRecommendations: async (jobId: number, limit?: number): Promise<CandidateSearchResponse[]> => {
    const response = await api.post(`/api/matching/generate-matches/${jobId}`);
    return response.data;
  },

  autoScoreApplications: async (jobId: number): Promise<any> => {
    const response = await api.post(`/api/matching/generate-matches/${jobId}`);
    return response.data;
  },

  // Get interviews by fetching applications with interview dates
  getInterviews: async (): Promise<Interview[]> => {
    try {
      // First get all job postings
      const jobsResponse = await api.get('/api/employer/jobs');
      const jobs = jobsResponse.data;

      const interviews: Interview[] = [];

      // For each job, get applications with interviews
      for (const job of jobs) {
        try {
          const applicationsResponse = await api.get(`/api/employer/jobs/${job.id}/applications`);
          const applications = applicationsResponse.data;

          // Filter applications that have interview dates
          const interviewApplications = applications.filter((app: any) =>
            app.application.interview_scheduled_at
          );

          // Transform to Interview objects
          interviewApplications.forEach((app: any) => {
            interviews.push({
              id: app.application.id,
              application_id: app.application.id,
              candidate_name: `${app.employee.first_name} ${app.employee.last_name}`,
              candidate_email: app.employee.email,
              job_title: job.title,
              interview_date: new Date(app.application.interview_scheduled_at),
              interview_type: 'video', // Default, can be enhanced later
              location_or_link: undefined, // Can be enhanced later
              status: app.application.status === 'interview_scheduled' ? 'scheduled' : 'completed',
              notes: app.application.notes || undefined,
              candidate_id: app.employee.id,
              job_id: job.id
            });
          });
        } catch (error) {
          console.error(`Failed to fetch applications for job ${job.id}:`, error);
        }
      }

      return interviews.sort((a, b) => a.interview_date.getTime() - b.interview_date.getTime());
    } catch (error) {
      console.error('Failed to fetch interviews:', error);
      return [];
    }
  },
};