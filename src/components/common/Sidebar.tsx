import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Search,
  Calendar,
  Award,
  BookOpen,
  MessageSquare,
  Bell,
  User,
  Building,
  TrendingUp,
  Shield,
  Zap,
  Target,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const employeeMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/employee/dashboard" },
    { icon: FileText, label: "My Resumes", path: "/employee/resumes" },
    { icon: Briefcase, label: "Job Search", path: "/employee/jobs" },
    { icon: Target, label: "Applications", path: "/employee/applications" },
    { icon: Award, label: "Voice Assessment", path: "/employee/assessments" },
    { icon: BookOpen, label: "Learning Path", path: "/employee/learning" },
    { icon: MessageSquare, label: "Messages", path: "/employee/messages" },
    { icon: Bell, label: "Notifications", path: "/employee/notifications" },
    { icon: User, label: "Profile", path: "/employee/profile" },
    { icon: Settings, label: "Settings", path: "/employee/settings" },
  ];

  const employerMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/employer/dashboard" },
    { icon: Briefcase, label: "Job Postings", path: "/employer/jobs" },
    { icon: Users, label: "Candidates", path: "/employer/candidates" },
    { icon: Search, label: "Talent Search", path: "/employer/search" },
    { icon: Calendar, label: "Interviews", path: "/employer/interviews" },
    { icon: BarChart3, label: "Analytics", path: "/employer/analytics" },
    { icon: Building, label: "Company Profile", path: "/employer/company" },
    { icon: Shield, label: "Compliance", path: "/employer/compliance" },
    { icon: MessageSquare, label: "Messages", path: "/employer/messages" },
    { icon: User, label: "Profile", path: "/employer/profile" },
    { icon: Settings, label: "Settings", path: "/employer/settings" },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { icon: FileText, label: "Content Moderation", path: "/admin/content" },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: Settings, label: "System Settings", path: "/admin/settings" },
  ];

  const getMenuItems = () => {
    switch (user?.user_type) {
      case "employee":
        return employeeMenuItems;
      case "employer":
        return employerMenuItems;
      case "admin":
        return adminMenuItems;
      default:
        return employeeMenuItems;
    }
  };

  const menuItems = getMenuItems();

  // Get user display name
  const getUserDisplayName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.first_name) {
      return user.first_name;
    }
    if (user?.email) {
      return user.email.split("@")[0];
    }
    return "User";
  };

  // Get user type display
  const getUserTypeDisplay = () => {
    switch (user?.user_type) {
      case "employee":
        return "Job Seeker";
      case "employer":
        return "Employer";
      case "admin":
        return "Administrator";
      default:
        return "User";
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed left-0 top-0 h-full w-72 bg-white shadow-2xl z-50 lg:relative lg:translate-x-0 ${
          isOpen ? "" : "lg:w-20"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                {isOpen && (
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      AI Resume
                    </h2>
                    <p className="text-xs text-gray-500">Smart Recruitment</p>
                  </div>
                )}
              </motion.div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors lg:hidden"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                {user?.user_type === "employee" ? (
                  <User className="w-6 h-6 text-primary-600" />
                ) : user?.user_type === "admin" ? (
                  <Shield className="w-6 h-6 text-primary-600" />
                ) : (
                  <Building className="w-6 h-6 text-primary-600" />
                )}
              </div>
              {isOpen && (
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate">
                    {getUserDisplayName()}
                  </p>
                  <p className="text-xs text-gray-500">
                    {getUserTypeDisplay()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                        isActive
                          ? "bg-primary-50 text-primary-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span className="truncate">{item.label}</span>}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-200">
                        {item.label}
                      </div>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Premium Badge - Only for employees */}
          {isOpen && user?.user_type === "employee" && (
            <div className="p-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 rounded-lg text-white cursor-pointer"
              >
                <TrendingUp className="w-6 h-6 mb-2" />
                <p className="font-semibold">Upgrade to Pro</p>
                <p className="text-xs mt-1 opacity-90">
                  Get AI-powered recommendations
                </p>
              </motion.div>
            </div>
          )}

          {/* Footer */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              {isOpen && <span>Logout</span>}
              {!isOpen && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  Logout
                </div>
              )}
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};
