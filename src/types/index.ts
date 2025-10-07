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

// Job Application types based on backend ApplicationResponse schema
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

// Job Posting types based on backend schemas
export type JobType = "full_time" | "part_time" | "contract" | "internship" | "freelance";
export type ExperienceLevel = "entry" | "junior" | "mid" | "senior" | "lead" | "executive";
export type JobStatus = "active" | "paused" | "closed" | "expired";

export interface JobPosting {
  id: number;
  employer_id: number;
  title: string;
  description: string;
  department?: string;
  location: string;
  remote_allowed: boolean;
  job_type: string;
  experience_level: string;
  salary_range?: string;
  currency: string;
  salary_min?: number;
  salary_max?: number;
  required_skills: string[];
  preferred_skills: string[];
  required_experience: Record<string, any>;
  required_education: Record<string, any>;
  communication_requirements: Record<string, any>;
  matching_weights: Record<string, any>;
  minimum_match_score: number;
  status: string;
  is_urgent: boolean;
  is_active: boolean;
  applications_count: number;
  max_applications?: number;
  auto_match_enabled: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
}

export interface JobPostingCreate {
  title: string;
  description: string;
  department?: string;
  location: string;
  remote_allowed: boolean;
  job_type: JobType;
  experience_level: ExperienceLevel;
  salary_min?: number | null;
  salary_max?: number | null;
  currency?: string;
  required_skills: string[];
  preferred_skills?: string[];
  required_experience?: Record<string, any>;
  required_education?: Record<string, any>;
  communication_requirements?: Record<string, any>;
  matching_weights?: Record<string, any>;
  minimum_match_score?: number;
  is_urgent?: boolean;
  max_applications?: number;
  auto_match_enabled?: boolean;
  expires_at?: string;
}

export interface JobPostingUpdate {
  title?: string;
  description?: string;
  department?: string;
  location?: string;
  remote_allowed?: boolean;
  job_type?: JobType;
  experience_level?: ExperienceLevel;
  salary_min?: number;
  salary_max?: number;
  required_skills?: string[];
  preferred_skills?: string[];
  status?: JobStatus;
  minimum_match_score?: number;
}

// Job Recommendation types
export interface JobRecommendation {
  match_id: number;
  job: JobPosting;
  match_score: number;
  match_details: Record<string, any>;
  created_at: string;
}

// API Error type
export interface ApiError {
  response?: {
    data?: {
      message?: string;
      detail?: string | Array<{loc: string[], msg: string, type: string}>;
    };
  };
}
