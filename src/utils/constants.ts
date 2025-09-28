export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const APP_CONFIG = {
  name: 'AI Resume',
  version: '1.0.0',
  description: 'Smart Recruitment Platform'
};

export const USER_TYPES = {
  EMPLOYEE: 'employee',
  EMPLOYER: 'employer',
  ADMIN: 'admin'
} as const;

export const APPLICATION_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  INTERVIEWED: 'interviewed',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  WITHDRAWN: 'withdrawn'
} as const;

export const JOB_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  CLOSED: 'closed',
  DRAFT: 'draft'
} as const;

export const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  MID: 'mid',
  SENIOR: 'senior',
  EXECUTIVE: 'executive'
} as const;

export const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  FREELANCE: 'freelance',
  INTERNSHIP: 'internship'
} as const;

export const INTERVIEW_TYPES = {
  VIDEO: 'video',
  PHONE: 'phone',
  IN_PERSON: 'in-person'
} as const;

export const FILE_UPLOAD_LIMITS = {
  RESUME_MAX_SIZE: 10 * 1024 * 1024, // 10MB
  VOICE_MAX_SIZE: 50 * 1024 * 1024, // 50MB
  ACCEPTED_RESUME_TYPES: ['.pdf', '.doc', '.docx'],
  ACCEPTED_VOICE_TYPES: ['.mp3', '.wav', '.m4a', '.ogg']
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',

  // Employee routes
  EMPLOYEE: {
    DASHBOARD: '/employee/dashboard',
    RESUMES: '/employee/resumes',
    JOBS: '/employee/jobs',
    APPLICATIONS: '/employee/applications',
    ASSESSMENTS: '/employee/assessments',
    LEARNING: '/employee/learning',
    MESSAGES: '/employee/messages',
    NOTIFICATIONS: '/employee/notifications',
    PROFILE: '/employee/profile',
    SETTINGS: '/employee/settings'
  },

  // Employer routes
  EMPLOYER: {
    DASHBOARD: '/employer/dashboard',
    JOBS: '/employer/jobs',
    CANDIDATES: '/employer/candidates',
    SEARCH: '/employer/search',
    INTERVIEWS: '/employer/interviews',
    ANALYTICS: '/employer/analytics',
    COMPANY: '/employer/company',
    COMPLIANCE: '/employer/compliance',
    MESSAGES: '/employer/messages',
    PROFILE: '/employer/profile',
    SETTINGS: '/employer/settings'
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    CONTENT: '/admin/content',
    ANALYTICS: '/admin/analytics',
    SETTINGS: '/admin/settings'
  }
} as const;