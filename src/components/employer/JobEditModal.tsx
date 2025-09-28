import React, { useState, useEffect } from 'react';
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
import { employerService, type JobPosting } from '../../services/employerService';
import toast from 'react-hot-toast';

interface JobEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: JobPosting | null;
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

export const JobEditModal: React.FC<JobEditModalProps> = ({ isOpen, onClose, job }) => {
  const queryClient = useQueryClient();
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

  // Load job data when modal opens
  useEffect(() => {
    if (job && isOpen) {
      setFormData({
        title: job.title,
        description: job.description,
        location: job.location,
        job_type: job.job_type,
        experience_level: job.experience_level,
        department: job.department || '',
        salary_min: job.salary_min || null,
        salary_max: job.salary_max || null,
        currency: job.currency,
        remote_allowed: job.remote_allowed,
        is_urgent: job.is_urgent,
        required_skills: job.required_skills || [],
        preferred_skills: job.preferred_skills || [],
        benefits: job.benefits || '',
        expires_at: job.expires_at ? job.expires_at.split('T')[0] : '',
        required_experience: job.required_experience || {},
        required_education: job.required_education || {},
        communication_requirements: job.communication_requirements || {},
        matching_weights: job.matching_weights || {},
        minimum_match_score: job.minimum_match_score || 70,
        max_applications: job.max_applications || 0,
        auto_match_enabled: job.auto_match_enabled
      });
    }
  }, [job, isOpen]);

  const updateJobMutation = useMutation({
    mutationFn: (jobData: Partial<JobPosting>) =>
      employerService.updateJobPosting(job?.id || 0, jobData),
    onSuccess: () => {
      toast.success('Job posting updated successfully!');
      queryClient.invalidateQueries({ queryKey: ['job-postings'] });
      onClose();
    },
    onError: (error: any) => {
      let errorMessage = 'Failed to update job posting';

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

      console.error('Job update error:', error);
      toast.error(errorMessage);
    }
  });

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
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.location.trim()) {
      toast.error('Please fill in all required fields');
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

    updateJobMutation.mutate(jobData);
  };

  if (!job) return null;

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
                  <h2 className="text-2xl font-bold text-gray-900">Edit Job Posting</h2>
                  <p className="text-gray-600">Update your job listing details</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                {/* Basic Information */}
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

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
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

                {/* Benefits */}
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

                {/* Salary */}
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

                {/* Checkboxes */}
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

                {/* Expiry Date */}
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
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateJobMutation.isPending}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {updateJobMutation.isPending ? 'Updating...' : 'Update Job Posting'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};