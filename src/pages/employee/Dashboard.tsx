import React from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Briefcase,
  Target,
  TrendingUp,
  Calendar,
  Star,
  MapPin,
  Clock,
  Award,
  Users,
  ArrowRight,
  Plus,
  Eye,
  Download,
  Loader2,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useGetResumes, useGetApplications, useGetJobRecommendations } from "../../hooks/useEmployee";
import { Link } from "react-router-dom";

export const EmployeeDashboard: React.FC = () => {
  const { user } = useAuthStore();

  // API Queries
  const { data: resumes, isLoading: resumesLoading } = useGetResumes();
  const { data: applications, isLoading: applicationsLoading } = useGetApplications();
  const { data: recommendedJobs, isLoading: jobsLoading } = useGetJobRecommendations();

  const stats = [
    {
      icon: FileText,
      label: "Total Resumes",
      value: resumesLoading ? "..." : (resumes?.length || 0).toString(),
      change: "+1 this month",
      color: "blue",
    },
    {
      icon: Target,
      label: "Applications",
      value: applicationsLoading
        ? "..."
        : (applications?.length || 0).toString(),
      change: "+5 this week",
      color: "green",
    },
    {
      icon: Eye,
      label: "Profile Views",
      value: "156",
      change: "+12% this week",
      color: "purple",
    },
    {
      icon: Award,
      label: "Skill Score",
      value: "85%",
      change: "+8% this month",
      color: "orange",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Interview with TechCorp",
      time: "Today 2:00 PM",
      type: "interview",
    },
    { id: 2, title: "Career Fair", time: "Tomorrow 10:00 AM", type: "event" },
    {
      id: 3,
      title: "Skills Assessment",
      time: "Friday 3:00 PM",
      type: "assessment",
    },
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
              Ready to find your next opportunity? Let's make today count!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4">
              <TrendingUp className="w-8 h-8 text-white mb-2" />
              <p className="text-sm">Profile Strength</p>
              <p className="text-2xl font-bold">85%</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
        {/* Recent Applications */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Recent Applications
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {applicationsLoading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="animate-spin w-6 h-6 text-gray-400" />
                <span className="ml-2 text-gray-500">
                  Loading applications...
                </span>
              </div>
            ) : applications && applications.length > 0 ? (
              applications.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">
                      Application #{app.id}
                    </h3>
                    <p className="text-sm text-gray-600">Job ID: {app.job_id}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(app.applied_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        app.status === "interviewed" || app.status === "offered"
                          ? "bg-green-100 text-green-700"
                          : app.status === "reviewing" ||
                            app.status === "shortlisted"
                          ? "bg-blue-100 text-blue-700"
                          : app.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8 text-gray-500">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No applications yet</p>
                <Link
                  to="/employee/jobs"
                  className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
                >
                  Find jobs to apply to
                </Link>
              </div>
            )}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    event.type === "interview"
                      ? "bg-green-500"
                      : event.type === "event"
                      ? "bg-blue-500"
                      : "bg-orange-500"
                  }`}
                />
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    {event.title}
                  </p>
                  <p className="text-xs text-gray-500">{event.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-4 py-2 text-blue-600 hover:text-blue-700 text-sm font-medium border border-blue-200 hover:border-blue-300 rounded-lg transition-colors">
            View Calendar
          </button>
        </motion.div>
      </div>

      {/* Recommended Jobs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Recommended for You
          </h2>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
            See All Jobs <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobsLoading ? (
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
          ) : recommendedJobs && recommendedJobs.length > 0 ? (
            recommendedJobs.slice(0, 3).map((jobRec) => (
              <div
                key={jobRec.match_id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-800">{jobRec.job.title || 'Job Title'}</h3>
                    <p className="text-sm text-gray-600">{jobRec.job.company || 'Company'}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-gray-700">
                        {jobRec.match_score}%
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {jobRec.job.location || 'Location'}
                  </div>
                  {jobRec.job.salary_min && jobRec.job.salary_max && (
                    <div className="text-sm font-medium text-green-600">
                      ${jobRec.job.salary_min?.toLocaleString()} - $
                      {jobRec.job.salary_max?.toLocaleString()}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {new Date(jobRec.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/employee/jobs/${jobRec.job.id}`}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Apply
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center p-8 text-gray-500">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No recommended jobs available</p>
              <Link
                to="/employee/jobs"
                className="text-blue-600 hover:text-blue-700 text-sm mt-2 inline-block"
              >
                Browse all jobs
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-3 gap-4"
      >
        <Link
          to="/employee/resumes"
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50 transition-all group block text-center"
        >
          <Plus className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
          <p className="font-medium text-gray-600 group-hover:text-blue-700">
            Upload Resume
          </p>
        </Link>
        <button className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50 transition-all group">
          <Download className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
          <p className="font-medium text-gray-600 group-hover:text-blue-700">
            Download Resume
          </p>
        </button>
        <button className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-300 hover:bg-blue-50 transition-all group">
          <Users className="w-8 h-8 text-gray-400 group-hover:text-blue-600 mx-auto mb-2" />
          <p className="font-medium text-gray-600 group-hover:text-blue-700">
            Network & Connect
          </p>
        </button>
      </motion.div>
    </div>
  );
};

export default EmployeeDashboard;