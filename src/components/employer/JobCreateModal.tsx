import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Plus,
  Building
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { employerService } from '../../services/employerService';
import toast from 'react-hot-toast';

interface JobCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface JobFormData {
  title: string;
  description: string;
  location: string;
  job_type: string;
  experience_level: string;
  department: string;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  remote_allowed: boolean;
  is_urgent: boolean;
  required_skills: string[];
  preferred_skills: string[];
  benefits: string;
  expires_at: string;
  required_experience: any;
  required_education: any;
  communication_requirements: any;
  matching_weights: any;
  minimum_match_score: number;
  max_applications: number;
  auto_match_enabled: boolean;
}

export const JobCreateModal: React.FC<JobCreateModalProps> = ({ isOpen, onClose }) => {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    location: '',
    job_type: 'full_time',
    experience_level: 'entry',
    department: '',
    salary_min: null,
    salary_max: null,
    currency: 'USD',
    remote_allowed: false,
    is_urgent: false,
    required_skills: [],
    preferred_skills: [],
    benefits: '',
    expires_at: '',
    required_experience: {},
    required_education: {},
    communication_requirements: {},
    matching_weights: {},
    minimum_match_score: 70,
    max_applications: 0,
    auto_match_enabled: true
  });

  const [newSkill, setNewSkill] = useState('');
  const [newPreferredSkill, setNewPreferredSkill] = useState('');

  const createJobMutation = useMutation({
    mutationFn: (jobData: any) => {
      // CRITICAL: Only allow mutation if on step 3
      if (currentStep !== 3) {
        throw new Error('Job creation is only allowed on step 3');
      }
      return employerService.createJobPosting(jobData);
    },
    onSuccess: () => {
      toast.success('Job posting created successfully!');
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      let errorMessage = 'Failed to create job posting';

      if (error?.response?.data?.detail) {
        if (Array.isArray(error.response.data.detail)) {
          // Handle validation errors
          const validationErrors = error.response.data.detail.map((err: any) =>
            `${err.loc?.join('.')}: ${err.msg}`
          ).join(', ');
          errorMessage = `Validation error: ${validationErrors}`;
        } else {
          errorMessage = error.response.data.detail;
        }
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      }

      console.error('Job creation error:', error);
      toast.error(errorMessage);
    }
  });

  const resetForm = () => {
    setCurrentStep(1);
    setFormData({
      title: '',
      description: '',
      location: '',
      job_type: 'full_time',
      experience_level: 'entry',
      department: '',
      salary_min: null,
      salary_max: null,
      currency: 'USD',
      remote_allowed: false,
      is_urgent: false,
      required_skills: [],
      preferred_skills: [],
      benefits: '',
      expires_at: '',
      required_experience: {},
      required_education: {},
      communication_requirements: {},
      matching_weights: {},
      minimum_match_score: 70,
      max_applications: 0,
      auto_match_enabled: true
    });
    setNewSkill('');
    setNewPreferredSkill('');
  };

  const handleInputChange = (field: keyof JobFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.required_skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        required_skills: [...prev.required_skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const addPreferredSkill = () => {
    if (newPreferredSkill.trim() && !formData.preferred_skills.includes(newPreferredSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        preferred_skills: [...prev.preferred_skills, newPreferredSkill.trim()]
      }));
      setNewPreferredSkill('');
    }
  };

  const removePreferredSkill = (skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      preferred_skills: prev.preferred_skills.filter(skill => skill !== skillToRemove)
    }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    // ALWAYS prevent form submission
    e.preventDefault();
    e.stopPropagation();
    return false;
  };

  const handleCreateJob = () => {
    // Only allow if on step 3
    if (currentStep !== 3) {
      toast.error('You must complete all steps before creating the job');
      return;
    }

    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Ensure arrays are not empty for required fields
    if (formData.required_skills.length === 0) {
      toast.error('Please add at least one required skill');
      return;
    }

    // Prepare data for API
    const jobData = {
      ...formData,
      salary_min: formData.salary_min || 0,
      salary_max: formData.salary_max || 0,
      expires_at: formData.expires_at ? new Date(formData.expires_at + 'T23:59:59.999Z').toISOString() : undefined,
      benefits: formData.benefits.trim() || undefined,
      required_experience: formData.required_experience || {},
      required_education: formData.required_education || {},
      communication_requirements: formData.communication_requirements || {},
      matching_weights: formData.matching_weights || {},
      max_applications: formData.max_applications || 0
    };

    createJobMutation.mutate(jobData);
  };

  const nextStep = () => {
    // Validation for step 1
    if (currentStep === 1) {
      if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
        toast.error('Please fill in all required fields before proceeding');
        return;
      }
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep !== 3) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Job Posting</h2>
              <p className="text-gray-600">Step {currentStep} of 3</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step <= currentStep
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Basic Info</span>
              <span>Requirements</span>
              <span>Details</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g. Senior React Developer"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={6}
                  placeholder="Describe the role, responsibilities, and what you're looking for..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. New York, NY"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. Engineering"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={formData.job_type}
                    onChange={(e) => handleInputChange('job_type', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="full_time">Full-time</option>
                    <option value="part_time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => handleInputChange('experience_level', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="junior">Junior</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.remote_allowed}
                    onChange={(e) => handleInputChange('remote_allowed', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remote work allowed</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_urgent}
                    onChange={(e) => handleInputChange('is_urgent', e.target.checked)}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Urgent hiring</span>
                </label>
              </div>
            </div>
          )}

          {/* Step 2: Requirements & Skills */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Required Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        addSkill();
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Add a required skill (e.g. React, JavaScript)"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.required_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-blue-500 hover:text-blue-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Skills
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newPreferredSkill}
                    onChange={(e) => setNewPreferredSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        addPreferredSkill();
                      }
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Add a preferred skill"
                  />
                  <button
                    type="button"
                    onClick={addPreferredSkill}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.preferred_skills.map((skill, index) => (
                    <span
                      key={index}
                      className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removePreferredSkill(skill)}
                        className="ml-1 text-green-500 hover:text-green-700"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Benefits & Perks
                </label>
                <textarea
                  value={formData.benefits}
                  onChange={(e) => handleInputChange('benefits', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Describe the benefits and perks (e.g. Health insurance, Flexible hours, Remote work)"
                />
              </div>
            </div>
          )}

          {/* Step 3: Compensation & Details */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Minimum</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        value={formData.salary_min || ''}
                        onChange={(e) => handleInputChange('salary_min', e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="50000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Maximum</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="number"
                        value={formData.salary_max || ''}
                        onChange={(e) => handleInputChange('salary_max', e.target.value ? parseInt(e.target.value) : null)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="80000"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Currency</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="CAD">CAD</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="date"
                    value={formData.expires_at}
                    onChange={(e) => handleInputChange('expires_at', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Applications
                  </label>
                  <input
                    type="number"
                    value={formData.max_applications || ''}
                    onChange={(e) => handleInputChange('max_applications', e.target.value ? parseInt(e.target.value) : 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0 (unlimited)"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Match Score (%)
                  </label>
                  <input
                    type="number"
                    value={formData.minimum_match_score || ''}
                    onChange={(e) => handleInputChange('minimum_match_score', e.target.value ? parseInt(e.target.value) : 70)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="70"
                    min="0"
                    max="100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="auto_match_enabled"
                    checked={formData.auto_match_enabled}
                    onChange={(e) => handleInputChange('auto_match_enabled', e.target.checked)}
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="auto_match_enabled" className="text-sm text-gray-700">
                    Enable automatic candidate matching
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="is_urgent"
                    checked={formData.is_urgent}
                    onChange={(e) => handleInputChange('is_urgent', e.target.checked)}
                    className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="is_urgent" className="text-sm text-gray-700">
                    Mark as urgent position
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200 mt-8">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCreateJob}
                  disabled={createJobMutation.isPending}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {createJobMutation.isPending ? 'Creating...' : 'Create Job Posting'}
                </button>
              )}
            </div>
          </div>
        </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};