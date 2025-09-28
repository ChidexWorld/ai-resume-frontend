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

export interface JobMatch {
  id: number;
  employee_id: number;
  job_posting_id: number;
  resume_id: number;
  match_score: number;
  match_details: any;
  is_recommended: boolean;
  is_viewed_by_employee: boolean;
  is_viewed_by_employer: boolean;
  is_dismissed: boolean;
  created_at: string;
  updated_at: string;
}

export interface EmployeeMatch {
  employee: any;
  resume_analysis: any;
  voice_analysis?: any;
  match_summary: any;
}

export interface MatchingStats {
  total_matches: number;
  pending_matches: number;
  accepted_matches: number;
  dismissed_matches: number;
  average_match_score: number;
  top_skills_demand: string[];
}

export interface MatchCalculationRequest {
  employee_id: number;
  job_posting_id: number;
  resume_id?: number;
}

export interface BulkMatchRequest {
  job_ids?: number[];
  employee_ids?: number[];
  min_match_score?: number;
  auto_recommend?: boolean;
}

export const matchingService = {
  // Generate matches for a specific job
  generateJobMatches: async (jobId: number): Promise<JobMatch[]> => {
    const response = await api.post(`/api/matching/generate-matches/${jobId}`);
    return response.data;
  },

  // Get employee job matches
  getEmployeeMatches: async (params?: {
    employee_id?: number;
    job_id?: number;
    is_dismissed?: boolean;
    min_match_score?: number;
    limit?: number;
    offset?: number;
  }): Promise<EmployeeMatch[]> => {
    const response = await api.get('/api/matching/employee-matches', { params });
    return response.data;
  },

  // Calculate match between employee and job
  calculateMatch: async (matchRequest: MatchCalculationRequest): Promise<JobMatch> => {
    const response = await api.post('/api/matching/calculate-match', matchRequest);
    return response.data;
  },

  // Dismiss a job match
  dismissMatch: async (matchId: number): Promise<{ message: string }> => {
    const response = await api.post(`/api/matching/dismiss-match/${matchId}`);
    return response.data;
  },

  // Get matching statistics
  getMatchingStats: async (): Promise<MatchingStats> => {
    const response = await api.get('/api/matching/matching-stats');
    return response.data;
  },

  // Generate bulk matches
  generateBulkMatches: async (bulkRequest: BulkMatchRequest): Promise<{
    message: string;
    total_matches_generated: number;
    jobs_processed: number;
  }> => {
    const response = await api.post('/api/matching/bulk-match-generation', bulkRequest);
    return response.data;
  },
};