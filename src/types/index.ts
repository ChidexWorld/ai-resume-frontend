// User types based on backend UserResponse schema
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  user_type: "employee" | "employer" | "admin";
  is_active: boolean;
  is_verified: boolean;
  company_name?: string;
  company_website?: string;
  company_size?: string;
  created_at: string;
  updated_at: string;
}

// Auth request/response types based on backend schemas
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type: "employee" | "employer" | "admin";
  company_name?: string;
  company_website?: string;
  company_size?: string;
}

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  company_name?: string;
  company_website?: string;
  company_size?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface UserResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  user_type: "employee" | "employer" | "admin";
  is_active: boolean;
  is_verified: boolean;
  company_name?: string;
  company_website?: string;
  company_size?: string;
  created_at: string;
  updated_at: string;
}

export interface TokenVerificationResponse {
  valid: boolean;
  user: User;
}

// Resume types based on backend ResumeResponse schema
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

// Voice Analysis types based on backend VoiceAnalysisResponse schema
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
  };
  created_at: string;
  updated_at: string;
  analyzed_at?: string;
}

// Job Application types
export interface JobApplication {
  id: number;
  employee_id: number;
  job_id: number;
  status: string;
  cover_letter?: string;
  expected_salary?: number;
  expected_salary_formatted?: string;
  availability_date?: string;
  additional_notes?: string;
  applied_at: string;
  updated_at: string;
  job?: Record<string, any>;
  employer?: Record<string, any>;
}

// Job Recommendation types
export interface JobRecommendation {
  match_id: number;
  job: Record<string, any>;
  match_score: number;
  match_details: Record<string, any>;
  created_at: string;
}

// API Error type
export interface ApiError {
  response?: {
    data?: {
      message?: string;
      detail?: string;
    };
  };
}
