import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  Video,
  Phone,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  User,
  Briefcase,
  MessageSquare
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay, addMonths, subMonths } from 'date-fns';
import { employerService, type Interview } from '../../services/employerService';
import { matchingService } from '../../services/matchingService';
import toast from 'react-hot-toast';



export const InterviewsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const [showNewInterviewModal, setShowNewInterviewModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch interviews from API
  const { data: interviews = [], isLoading: interviewsLoading } = useQuery({
    queryKey: ['employer-interviews'],
    queryFn: employerService.getInterviews,
    refetchInterval: 60000, // Refetch every minute
  });

  // AI Matching Statistics
  const { data: matchingStats } = useQuery({
    queryKey: ['matching-stats'],
    queryFn: matchingService.getMatchingStats,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Get AI recommendations mutation
  const getAIRecommendationsMutation = useMutation({
    mutationFn: matchingService.getEmployeeMatches,
    onSuccess: (data) => {
      toast.success(`Found ${data.length} AI-recommended candidates!`);
    },
    onError: () => {
      toast.error('Failed to get AI recommendations');
    }
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getInterviewsForDate = (date: Date) => {
    return interviews.filter(interview =>
      isSameDay(interview.interview_date, date)
    );
  };

  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Interview['status']) => {
    switch (status) {
      case 'scheduled':
        return <Clock className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      case 'no-show':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type: Interview['interview_type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'in-person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const handleUpdateStatus = (interviewId: number, newStatus: Interview['status']) => {
    toast.success(`Interview status updated to ${newStatus}`);
  };

  const handleReschedule = (interview: Interview) => {
    toast.success(`Opening reschedule dialog for ${interview.candidate_name}`);
  };

  const handleCancel = (interview: Interview) => {
    toast.success(`Interview with ${interview.candidate_name} has been cancelled`);
  };

  const filteredInterviews = interviews.filter(interview => {
    if (filterStatus === 'all') return true;
    return interview.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interviews & Calendar</h1>
          <p className="text-gray-600 dark:text-gray-300 dark:text-gray-600 mt-1">
            Manage your interview schedule and candidate meetings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'calendar'
                  ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 dark:text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 dark:text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => getAIRecommendationsMutation.mutate()}
            disabled={getAIRecommendationsMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            <Brain className="w-4 h-4" />
            {getAIRecommendationsMutation.isPending ? 'Finding...' : 'AI Recommendations'}
          </button>
          <button
            onClick={() => setShowNewInterviewModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Schedule Interview
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Interviews</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="no-show">No Show</option>
          </select>
        </div>
        <div className="text-sm text-gray-600">
          Total: {filteredInterviews.length} interviews
        </div>
      </div>

      {/* AI Insights */}
      {matchingStats && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200"
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">AI Matching Insights</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{matchingStats.total_matches}</p>
              <p className="text-sm text-gray-600">Total Matches</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{matchingStats.pending_matches}</p>
              <p className="text-sm text-gray-600">Pending Review</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{matchingStats.average_match_score.toFixed(1)}%</p>
              <p className="text-sm text-gray-600">Avg Match Score</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{matchingStats.accepted_matches}</p>
              <p className="text-sm text-gray-600">Accepted</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Calendar View */}
      {viewMode === 'calendar' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200"
        >
          {/* Calendar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentMonth(new Date())}
                  className="px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="p-6">
            {/* Week Headers */}
            <div className="grid grid-cols-7 gap-4 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-4">
              {monthDays.map((day) => {
                const dayInterviews = getInterviewsForDate(day);
                const isSelected = isSameDay(day, selectedDate);
                const isCurrentDay = isToday(day);

                return (
                  <motion.div
                    key={day.toISOString()}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[100px] p-2 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                    } ${
                      !isSameMonth(day, currentMonth) ? 'opacity-30' : ''
                    }`}
                  >
                    <div className={`text-sm font-medium mb-2 ${
                      isCurrentDay ? 'text-primary-600' : 'text-gray-900'
                    }`}>
                      {format(day, 'd')}
                    </div>

                    <div className="space-y-1">
                      {dayInterviews.slice(0, 2).map((interview) => (
                        <div
                          key={interview.id}
                          className="p-1 bg-blue-100 text-blue-800 rounded text-xs truncate"
                        >
                          {format(interview.interview_date, 'HH:mm')} - {interview.candidate_name}
                        </div>
                      ))}
                      {dayInterviews.length > 2 && (
                        <div className="text-xs text-gray-500">
                          +{dayInterviews.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details */}
          {selectedDate && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Interviews for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>

              {getInterviewsForDate(selectedDate).length > 0 ? (
                <div className="space-y-4">
                  {getInterviewsForDate(selectedDate).map((interview) => (
                    <InterviewCard
                      key={interview.id}
                      interview={interview}
                      onUpdateStatus={handleUpdateStatus}
                      onReschedule={handleReschedule}
                      onCancel={handleCancel}
                      onViewDetails={() => setSelectedInterview(interview)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-500">No interviews scheduled for this date</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">All Interviews</h2>
          </div>

          {interviewsLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full mx-auto"></div>
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Loading interviews...</p>
            </div>
          ) : filteredInterviews.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredInterviews.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  interview={interview}
                  onUpdateStatus={handleUpdateStatus}
                  onReschedule={handleReschedule}
                  onCancel={handleCancel}
                  onViewDetails={() => setSelectedInterview(interview)}
                  showDate
                />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No interviews scheduled yet</p>
              <p className="text-sm mt-1">Schedule interviews from your job applications</p>
            </div>
          )}
        </motion.div>
      )}

      {/* Interview Detail Modal */}
      {selectedInterview && (
        <InterviewDetailModal
          interview={selectedInterview}
          onClose={() => setSelectedInterview(null)}
          onUpdate={(id, status) => {
            handleUpdateStatus(id, status);
            setSelectedInterview(null);
          }}
        />
      )}
    </div>
  );
};

// Interview Card Component
interface InterviewCardProps {
  interview: Interview;
  onUpdateStatus: (id: number, status: Interview['status']) => void;
  onReschedule: (interview: Interview) => void;
  onCancel: (interview: Interview) => void;
  onViewDetails: () => void;
  showDate?: boolean;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onUpdateStatus,
  onReschedule,
  onCancel,
  onViewDetails,
  showDate = false
}) => {
  const getStatusColor = (status: Interview['status']) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: Interview['interview_type']) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4" />;
      case 'phone':
        return <Phone className="w-4 h-4" />;
      case 'in-person':
        return <MapPin className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-900 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{interview.candidate_name}</h4>
              <p className="text-sm text-gray-600">{interview.job_title}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-300 dark:text-gray-600 mb-2">
            {showDate && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {format(interview.interview_date, 'MMM d, yyyy')}
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {format(interview.interview_date, 'HH:mm')}
            </div>
            <div className="flex items-center gap-1">
              {getTypeIcon(interview.interview_type)}
              {interview.interview_type}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(interview.status)}`}>
              {interview.status}
            </span>
            {interview.location_or_link && (
              <span className="text-sm text-gray-600">{interview.location_or_link}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={onViewDetails}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:text-gray-300 dark:text-gray-600 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {interview.status === 'scheduled' && (
            <>
              <button
                onClick={() => onReschedule(interview)}
                className="p-2 text-blue-400 hover:text-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onCancel(interview)}
                className="p-2 text-red-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Interview Detail Modal Component
interface InterviewDetailModalProps {
  interview: Interview;
  onClose: () => void;
  onUpdate: (id: number, status: Interview['status']) => void;
}

const InterviewDetailModal: React.FC<InterviewDetailModalProps> = ({
  interview,
  onClose,
  onUpdate
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Interview Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Candidate Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <p className="font-medium">{interview.candidate_name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Email:</span>
                  <p className="font-medium">{interview.candidate_email}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Position:</span>
                  <p className="font-medium">{interview.job_title}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Interview Details</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Date & Time:</span>
                  <p className="font-medium">
                    {format(interview.interview_date, 'EEEE, MMMM d, yyyy')} at {format(interview.interview_date, 'HH:mm')}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Type:</span>
                  <p className="font-medium capitalize">{interview.interview_type}</p>
                </div>
                {interview.location_or_link && (
                  <div>
                    <span className="text-sm text-gray-600">
                      {interview.interview_type === 'video' ? 'Meeting Link:' :
                       interview.interview_type === 'phone' ? 'Phone Number:' : 'Location:'}
                    </span>
                    <p className="font-medium">{interview.location_or_link}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {interview.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-700 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">{interview.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {interview.status === 'scheduled' && (
              <>
                <button
                  onClick={() => onUpdate(interview.id, 'completed')}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark Complete
                </button>
                <button
                  onClick={() => onUpdate(interview.id, 'no-show')}
                  className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  No Show
                </button>
                <button
                  onClick={() => onUpdate(interview.id, 'cancelled')}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <XCircle className="w-4 h-4" />
                  Cancel
                </button>
              </>
            )}
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <MessageSquare className="w-4 h-4" />
              Message Candidate
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};