import React from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Users,
  Eye,
  TrendingUp,
  Calendar,
  Star,
  MapPin,
  Clock,
  Award,
  Target,
  ArrowRight,
  Plus,
  Filter,
  Search,
  MessageSquare,
  BarChart3,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useGetJobs } from "../../hooks/useEmployer";
import { useGetJobApplications } from "../../hooks/useEmployer";
import { useSearchCandidates, useGetDashboardStats } from "../../hooks/useEmployer";
import { Link } from "react-router-dom";

export const EmployerDashboard: React.FC = () => {
  const { user } = useAuthStore();

  // API Queries
  const { data: jobs, isLoading: jobsLoading } = useGetJobs();
  const { data: stats, isLoading: statsLoading } = useGetDashboardStats();

  // Note: useSearchCandidates is a mutation hook, so we'll use mock data for now
  const candidatesLoading = false;
  const candidates = null;

  const dashboardStats = [
    {
      icon: Briefcase,
      label: "Active Jobs",
      value: jobsLoading
        ? "..."
        : (jobs?.filter((job) => job.status === "active").length || 0).toString(),
      change: "+3 this month",
      color: "blue",
    },
    {
      icon: Users,
      label: "Total Applications",
      value: statsLoading ? "..." : (stats?.total_applications || 0).toString(),
      change: `+${stats?.applications_this_month || 0} this month`,
      color: "green",
    },
    {
      icon: Eye,
      label: "Profile Views",
      value: "1,429",
      change: "+18% this week",
      color: "purple",
    },
    {
      icon: Target,
      label: "Pending Reviews",
      value: statsLoading ? "..." : (stats?.pending_applications || 0).toString(),
      change: "Need attention",
      color: "orange",
    },
  ];

  // Mock data for demonstration - replace with real data from API
  const recentJobs = jobs?.slice(0, 3) || [
    {
      id: 1,
      title: "Senior React Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      created_at: "2024-01-15T10:00:00Z",
      applications_count: 34,
      status: "active",
      job_type: "full-time",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Remote",
      created_at: "2024-01-12T10:00:00Z",
      applications_count: 28,
      status: "active",
      job_type: "full-time",
    },
    {
      id: 3,
      title: "UI/UX Designer",
      department: "Design",
      location: "New York, NY",
      created_at: "2024-01-08T10:00:00Z",
      applications_count: 45,
      status: "paused",
      job_type: "contract",
    },
  ];

  const topCandidates = candidates?.slice(0, 3) || [
    {
      id: 1,
      employee: {
        first_name: "Alex",
        last_name: "Johnson",
        email: "alex.johnson@example.com"
      },
      resume_analysis: {
        total_experience_years: 5,
        contact_info: { location: "San Francisco, CA" },
        skills: ["React", "TypeScript", "Node.js"]
      },
      match_summary: {
        experience_years: 5,
        communication_score: 95
      }
    },
    {
      id: 2,
      employee: {
        first_name: "Sarah",
        last_name: "Chen",
        email: "sarah.chen@example.com"
      },
      resume_analysis: {
        total_experience_years: 7,
        contact_info: { location: "Seattle, WA" },
        skills: ["Strategy", "Analytics", "Leadership"]
      },
      match_summary: {
        experience_years: 7,
        communication_score: 92
      }
    },
    {
      id: 3,
      employee: {
        first_name: "Mike",
        last_name: "Rodriguez",
        email: "mike.rodriguez@example.com"
      },
      resume_analysis: {
        total_experience_years: 4,
        contact_info: { location: "Austin, TX" },
        skills: ["Figma", "Prototyping", "User Research"]
      },
      match_summary: {
        experience_years: 4,
        communication_score: 88
      }
    },
  ];

  const upcomingInterviews = [
    {
      id: 1,
      candidate: "Alex Johnson",
      position: "React Developer",
      time: "Today 2:00 PM",
      type: "Technical",
    },
    {
      id: 2,
      candidate: "Sarah Chen",
      position: "Product Manager",
      time: "Tomorrow 10:00 AM",
      type: "Final",
    },
    {
      id: 3,
      candidate: "Mike Rodriguez",
      position: "UI/UX Designer",
      time: "Friday 3:00 PM",
      type: "Portfolio",
    },
  ];

  const analyticsData = [
    { label: "Application Rate", value: "+23%", trend: "up" },
    { label: "Time to Hire", value: "14 days", trend: "down" },
    { label: "Offer Acceptance", value: "87%", trend: "up" },
    { label: "Avg Match Score", value: stats?.average_match_score?.toString() || "N/A", trend: "up" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user?.first_name}! 👋
            </h1>
            <p className="mt-2 text-blue-100">
              {user?.company_name && `Managing talent at ${user.company_name}. `}
              Let's find the perfect candidates today!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
              <TrendingUp className="w-8 h-8 text-white mb-2" />
              <p className="text-sm">Hiring Success</p>
              <p className="text-2xl font-bold">87%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-lg ${
                stat.color === 'blue' ? 'bg-blue-100' :
                stat.color === 'green' ? 'bg-green-100' :
                stat.color === 'purple' ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === 'blue' ? 'text-blue-600' :
                  stat.color === 'green' ? 'text-green-600' :
                  stat.color === 'purple' ? 'text-purple-600' :
                  'text-orange-600'
                }`} />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
            <p className="text-xs text-green-600 mt-4 font-medium">
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Job Postings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Job Postings
            </h2>
            <Link
              to="/employer/jobs"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {jobsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                <span className="ml-2 text-gray-500">Loading jobs...</span>
              </div>
            ) : recentJobs.length > 0 ? (
              recentJobs.map((job) => (
                <div
                  key={job.id}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.department}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                        {job.job_type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">
                      {job.applications_count}
                    </p>
                    <p className="text-sm text-gray-500">Applications</p>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        job.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-gray-500">
                <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No job postings yet</p>
                <Link
                  to="/employer/jobs"
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                >
                  Create your first job posting
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Interviews */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Interviews</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="flex gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    interview.type === "Technical"
                      ? "bg-blue-500"
                      : interview.type === "Final"
                      ? "bg-green-500"
                      : "bg-purple-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">
                    {interview.candidate}
                  </p>
                  <p className="text-xs text-gray-600">{interview.position}</p>
                  <p className="text-xs text-gray-500">{interview.time}</p>
                  <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                    {interview.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <Link
            to="/employer/interviews"
            className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 hover:border-blue-300 rounded-lg transition-colors block text-center"
          >
            View Calendar
          </Link>
        </motion.div>
      </div>

      {/* Top Candidates */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Top Candidates
          </h2>
          <div className="flex gap-2">
            <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
              <Filter className="w-4 h-4" />
            </button>
            <Link
              to="/employer/candidates"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {candidatesLoading ? (
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 animate-pulse"
              >
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4 w-2/3"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))
          ) : topCandidates.length > 0 ? (
            topCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">👤</div>
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {candidate.employee.first_name} {candidate.employee.last_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {candidate.resume_analysis?.total_experience_years} years experience
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {candidate.match_summary?.communication_score || 0}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <Award className="w-4 h-4" />
                    {candidate.resume_analysis?.total_experience_years} years experience
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {candidate.resume_analysis?.contact_info?.location || "Location not specified"}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {candidate.resume_analysis?.skills?.slice(0, 3).map((skill: string) => (
                      <span
                        key={skill}
                        className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 px-3 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                    View Profile
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-300 rounded-lg">
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No candidates available</p>
              <Link
                to="/employer/search"
                className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
              >
                Search for candidates
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Analytics & Quick Actions */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Hiring Analytics
            </h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {analyticsData.map((metric) => (
              <div
                key={metric.label}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{metric.label}</p>
                  <TrendingUp
                    className={`w-4 h-4 ${
                      metric.trend === "up" ? "text-green-500" : "text-red-500"
                    }`}
                  />
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">
                  {metric.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-y-4"
        >
          <Link
            to="/employer/jobs"
            className="w-full bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Post New Job
          </Link>
          <Link
            to="/employer/search"
            className="w-full bg-white border-2 border-gray-300 p-4 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search Candidates
          </Link>
          <Link
            to="/employer/interviews"
            className="w-full bg-white border-2 border-gray-300 p-4 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Schedule Interview
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default EmployerDashboard;