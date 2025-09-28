import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Star,
  Download,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Calendar
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { employerService, type ApplicationReviewResponse } from '../../services/employerService';
import toast from 'react-hot-toast';

interface ApplicationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: number;
  jobTitle: string;
}

export const ApplicationReviewModal: React.FC<ApplicationReviewModalProps> = ({
  isOpen,
  onClose,
  jobId,
  jobTitle
}) => {
  const queryClient = useQueryClient();
  const [selectedApplication, setSelectedApplication] = useState<ApplicationReviewResponse | null>(null);
  const [notes, setNotes] = useState('');
  const [showInterviewSchedule, setShowInterviewSchedule] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewType, setInterviewType] = useState<'video' | 'phone' | 'in_person'>('video');
  const [interviewLocation, setInterviewLocation] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');

  const { data: applications, isLoading } = useQuery({
    queryKey: ['job-applications', jobId],
    queryFn: () => employerService.getJobApplications(jobId),
    enabled: isOpen
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ applicationId, status, notes }: { applicationId: number; status: string; notes?: string }) =>
      employerService.updateApplicationStatus(applicationId, status, notes),
    onSuccess: () => {
      toast.success('Application status updated successfully');
      queryClient.invalidateQueries({ queryKey: ['job-applications', jobId] });
    },
    onError: () => {
      toast.error('Failed to update application status');
    }
  });

  const scheduleInterviewMutation = useMutation({
    mutationFn: ({ applicationId, interviewData }: {
      applicationId: number;
      interviewData: {
        interview_date: string;
        interview_type: 'video' | 'phone' | 'in_person';
        location_or_link?: string;
        notes?: string;
      }
    }) => employerService.scheduleInterview(applicationId, interviewData),
    onSuccess: () => {
      toast.success('Interview scheduled successfully');
      queryClient.invalidateQueries({ queryKey: ['job-applications', jobId] });
    },
    onError: () => {
      toast.error('Failed to schedule interview');
    }
  });

  const handleStatusUpdate = (status: string) => {
    if (!selectedApplication) return;

    updateStatusMutation.mutate({
      applicationId: selectedApplication.application.id,
      status,
      notes: notes.trim() || undefined
    });

    setNotes('');
  };

  const handleScheduleInterview = () => {
    if (!selectedApplication || !interviewDate) return;

    scheduleInterviewMutation.mutate({
      applicationId: selectedApplication.application.id,
      interviewData: {
        interview_date: interviewDate,
        interview_type: interviewType,
        location_or_link: interviewLocation.trim() || undefined,
        notes: interviewNotes.trim() || undefined
      }
    });

    setShowInterviewSchedule(false);
    setInterviewDate('');
    setInterviewType('video');
    setInterviewLocation('');
    setInterviewNotes('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'reviewing':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-purple-100 text-purple-800';
      case 'interview_scheduled':
        return 'bg-indigo-100 text-indigo-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg max-w-7xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Applications for {jobTitle}</h2>
                  <p className="text-gray-600">{applications?.length || 0} applications received</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex h-[600px]">
              {/* Applications List */}
              <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
                {isLoading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading applications...</p>
                  </div>
                ) : applications && applications.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                    {applications.map((app) => (
                      <div
                        key={app.application.id}
                        onClick={() => setSelectedApplication(app)}
                        className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                          selectedApplication?.application.id === app.application.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {app.employee.first_name} {app.employee.last_name}
                            </h3>
                            <p className="text-sm text-gray-600">{app.employee.email}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.application.status)}`}>
                                {app.application.status.replace('_', ' ')}
                              </span>
                              <span className={`text-sm font-medium ${getMatchScoreColor(app.application.match_score)}`}>
                                {app.application.match_score}% match
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No applications yet</p>
                  </div>
                )}
              </div>

              {/* Application Details */}
              <div className="flex-1 overflow-y-auto">
                {selectedApplication ? (
                  <div className="p-6">
                    {/* Candidate Info */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {selectedApplication.employee.first_name} {selectedApplication.employee.last_name}
                          </h3>
                          <p className="text-gray-600">{selectedApplication.employee.email}</p>
                        </div>
                        <div className="text-right">
                          <div className={`text-2xl font-bold ${getMatchScoreColor(selectedApplication.application.match_score)}`}>
                            {selectedApplication.application.match_score}%
                          </div>
                          <p className="text-sm text-gray-600">AI Match Score</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedApplication.application.status)}`}>
                          {selectedApplication.application.status.replace('_', ' ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Applied {new Date(selectedApplication.application.applied_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Resume Analysis */}
                    {selectedApplication.resume_analysis && (
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Resume Analysis</h4>
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Experience Level</p>
                            <p className="font-medium">{selectedApplication.resume_analysis.experience_level}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total Experience</p>
                            <p className="font-medium">{selectedApplication.resume_analysis.total_experience_years} years</p>
                          </div>
                        </div>

                        {selectedApplication.resume_analysis.skills && (
                          <div>
                            <p className="text-sm text-gray-600 mb-2">Skills</p>
                            <div className="flex flex-wrap gap-2">
                              {Object.keys(selectedApplication.resume_analysis.skills).map((skill) => (
                                <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Voice Analysis */}
                    {selectedApplication.voice_analysis && (
                      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Communication Analysis</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-600">Overall Score</p>
                            <p className="font-medium">{selectedApplication.voice_analysis.overall_communication_score}/100</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Fluency</p>
                            <p className="font-medium">{selectedApplication.voice_analysis.fluency_score}/100</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Clarity</p>
                            <p className="font-medium">{selectedApplication.voice_analysis.clarity_score}/100</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Confidence</p>
                            <p className="font-medium">{selectedApplication.voice_analysis.confidence_score}/100</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>

                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Notes
                        </label>
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                          rows={3}
                          placeholder="Add notes about this candidate..."
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleStatusUpdate('reviewing')}
                          disabled={updateStatusMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                          <Star className="w-4 h-4" />
                          Start Review
                        </button>
                        <button
                          onClick={() => handleStatusUpdate('shortlisted')}
                          disabled={updateStatusMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Shortlist
                        </button>
                        <button
                          onClick={() => setShowInterviewSchedule(true)}
                          disabled={updateStatusMutation.isPending || scheduleInterviewMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                        >
                          <Calendar className="w-4 h-4" />
                          Schedule Interview
                        </button>
                        <button
                          onClick={() => handleStatusUpdate('accepted')}
                          disabled={updateStatusMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusUpdate('rejected')}
                          disabled={updateStatusMutation.isPending}
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>

                    {/* Interview Scheduling Modal */}
                    {showInterviewSchedule && (
                      <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Interview</h3>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interview Date & Time
                              </label>
                              <input
                                type="datetime-local"
                                value={interviewDate}
                                onChange={(e) => setInterviewDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                min={new Date().toISOString().slice(0, 16)}
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interview Type
                              </label>
                              <select
                                value={interviewType}
                                onChange={(e) => setInterviewType(e.target.value as 'video' | 'phone' | 'in_person')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                              >
                                <option value="video">Video Call</option>
                                <option value="phone">Phone Call</option>
                                <option value="in_person">In Person</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                {interviewType === 'video' ? 'Meeting Link' :
                                 interviewType === 'phone' ? 'Phone Number' : 'Location'}
                              </label>
                              <input
                                type="text"
                                value={interviewLocation}
                                onChange={(e) => setInterviewLocation(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                placeholder={
                                  interviewType === 'video' ? 'https://meet.google.com/...' :
                                  interviewType === 'phone' ? '+1 (555) 123-4567' :
                                  'Office Address or Meeting Room'
                                }
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Interview Notes
                              </label>
                              <textarea
                                value={interviewNotes}
                                onChange={(e) => setInterviewNotes(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                rows={3}
                                placeholder="Add interview details, agenda, or special instructions..."
                              />
                            </div>
                          </div>

                          <div className="flex justify-end gap-3 mt-6">
                            <button
                              onClick={() => {
                                setShowInterviewSchedule(false);
                                setInterviewDate('');
                                setInterviewType('video');
                                setInterviewLocation('');
                                setInterviewNotes('');
                              }}
                              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleScheduleInterview}
                              disabled={!interviewDate || scheduleInterviewMutation.isPending}
                              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                              {scheduleInterviewMutation.isPending ? 'Scheduling...' : 'Schedule Interview'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>Select an application to view details</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};