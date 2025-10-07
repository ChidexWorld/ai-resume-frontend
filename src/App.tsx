import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./store/authStore";
import { initializeTheme } from "./store/themeStore";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { EmployeeDashboard } from "./pages/employee/Dashboard";
import { EmployerDashboard } from "./pages/employer/Dashboard";
import { AdminDashboard } from "./pages/admin/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import ContentModeration from "./pages/admin/ContentModeration";
import Analytics from "./pages/admin/Analytics";
import SystemCleanup from "./pages/admin/SystemCleanup";
import { LandingPage } from "./pages/LandingPage";
import { ResumePage } from "./pages/employee/ResumePage";
import { JobsPage } from "./pages/employee/JobsPage";
import { JobDetailsPage } from "./pages/employee/JobDetailsPage";
import { JobApplicationPage } from "./pages/employee/JobApplicationPage";
import { ApplicationsPage } from "./pages/employee/ApplicationsPage";
import { AssessmentsPage } from "./pages/employee/AssessmentsPage";
import { ProfilePage as EmployeeProfilePage } from "./pages/employee/ProfilePage";
import { ProfilePage as EmployerProfilePage } from "./pages/employer/ProfilePage";
import { SkillsAnalysisPage } from "./pages/employee/SkillsAnalysisPage";
import { SettingsPage } from "./pages/employee/SettingsPage";
import { JobMatchesPage } from "./pages/employee/JobMatches";
import { SearchPage } from "./pages/employer/SearchPage";
import { InterviewsPage } from "./pages/employer/InterviewsPage";
import { JobPostingsPage } from "./pages/employer/JobPostingsPage";
import type { User } from "./types";

// Define user types (should match your User interface)
type UserType = User["user_type"];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { isAuthenticated, user } = useAuthStore();

  // Initialize theme on app start
  React.useEffect(() => {
    initializeTheme();
  }, []);

  // Helper function to get dashboard redirect path
  const getDashboardPath = (userType: UserType): string => {
    switch (userType) {
      case "employee":
        return "/employee/dashboard";
      case "employer":
        return "/employer/dashboard";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/login";
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                isAuthenticated && user?.user_type ? (
                  <Navigate to={getDashboardPath(user.user_type)} replace />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated && user?.user_type ? (
                  <Navigate to={getDashboardPath(user.user_type)} replace />
                ) : (
                  <RegisterPage />
                )
              }
            />

            {/* Employee Routes */}
            <Route
              path="/employee/*"
              element={
                <ProtectedRoute requiredRole="employee">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="resumes" element={<ResumePage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="jobs/:jobId" element={<JobDetailsPage />} />
              <Route path="jobs/:jobId/apply" element={<JobApplicationPage />} />
              <Route path="job-matches" element={<JobMatchesPage />} />
              <Route path="applications" element={<ApplicationsPage />} />
              <Route path="assessments" element={<AssessmentsPage />} />
              <Route path="skills-analysis" element={<SkillsAnalysisPage />} />
              <Route path="profile" element={<EmployeeProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>

            {/* Employer Routes */}
            <Route
              path="/employer/*"
              element={
                <ProtectedRoute requiredRole="employer">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<EmployerDashboard />} />
              <Route path="search" element={<SearchPage />} />
              <Route path="interviews" element={<InterviewsPage />} />
              <Route path="jobs" element={<JobPostingsPage />} />
              <Route path="analytics" element={<div>Analytics Page</div>} />
              <Route path="compliance" element={
                <div className="p-6">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Compliance Center</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <h3 className="ml-3 text-lg font-semibold text-green-900">GDPR Compliance</h3>
                        </div>
                        <p className="text-green-700 text-sm">All candidate data is processed according to GDPR regulations</p>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="ml-3 text-lg font-semibold text-blue-900">Equal Opportunity</h3>
                        </div>
                        <p className="text-blue-700 text-sm">Fair hiring practices and anti-discrimination policies</p>
                      </div>

                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                          <h3 className="ml-3 text-lg font-semibold text-purple-900">Data Security</h3>
                        </div>
                        <p className="text-purple-700 text-sm">End-to-end encryption and secure data handling</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md">
                      <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-800">Compliance Checklist</h2>
                      </div>
                      <div className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-gray-800">Privacy Policy Updated</span>
                            </div>
                            <span className="text-sm text-gray-500">Last updated: 2024-01-15</span>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-gray-800">Data Processing Agreement</span>
                            </div>
                            <span className="text-sm text-gray-500">Active</span>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center">
                              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-gray-800">Employee Training Completed</span>
                            </div>
                            <span className="text-sm text-gray-500">98% completion rate</span>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                            <div className="flex items-center">
                              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span className="text-gray-800">Security Audit</span>
                            </div>
                            <span className="text-sm text-yellow-600">Due in 30 days</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Compliance Reports</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Q4 2024 GDPR Report</span>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Diversity & Inclusion Report</span>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Data Security Assessment</span>
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Download</button>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                          <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                            <span className="text-blue-700 font-medium">Request Data Export</span>
                          </button>
                          <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                            <span className="text-green-700 font-medium">Schedule Compliance Training</span>
                          </button>
                          <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
                            <span className="text-purple-700 font-medium">Review Privacy Settings</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } />
              <Route path="profile" element={<EmployerProfilePage />} />
              <Route path="settings" element={
                <div className="p-6">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h1>

                    <div className="space-y-6">
                      {/* Company Settings */}
                      <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <h2 className="text-xl font-semibold text-gray-800">Company Settings</h2>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                              <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Your Company Name" />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                                <option>Technology</option>
                                <option>Healthcare</option>
                                <option>Finance</option>
                                <option>Education</option>
                                <option>Manufacturing</option>
                                <option>Other</option>
                              </select>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Description</label>
                            <textarea className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" rows={3} placeholder="Brief description of your company"></textarea>
                          </div>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <h2 className="text-xl font-semibold text-gray-800">Notification Preferences</h2>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">New Applications</h3>
                              <p className="text-sm text-gray-500">Get notified when candidates apply to your jobs</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">Interview Reminders</h3>
                              <p className="text-sm text-gray-500">Reminders about upcoming interviews</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">Weekly Reports</h3>
                              <p className="text-sm text-gray-500">Weekly summary of hiring activities</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">Marketing Updates</h3>
                              <p className="text-sm text-gray-500">Product updates and feature announcements</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Privacy & Security */}
                      <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <h2 className="text-xl font-semibold text-gray-800">Privacy & Security</h2>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h3>
                              <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              Enable
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">Login Notifications</h3>
                              <p className="text-sm text-gray-500">Get notified of new login attempts</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">Data Export</h3>
                              <p className="text-sm text-gray-500">Download all your company data</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                              Request Export
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Billing & Subscription */}
                      <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <h2 className="text-xl font-semibold text-gray-800">Billing & Subscription</h2>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">Current Plan</h3>
                              <p className="text-sm text-gray-500">Professional Plan - $99/month</p>
                            </div>
                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                              Upgrade Plan
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">Payment Method</h3>
                              <p className="text-sm text-gray-500">**** **** **** 4532 (Expires 12/25)</p>
                            </div>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                              Update Card
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">Billing History</h3>
                              <p className="text-sm text-gray-500">View past invoices and receipts</p>
                            </div>
                            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                              View History
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* API & Integrations */}
                      <div className="bg-white rounded-lg shadow-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                          <h2 className="text-xl font-semibold text-gray-800">API & Integrations</h2>
                        </div>
                        <div className="p-6 space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">API Access</h3>
                              <p className="text-sm text-gray-500">Generate API keys for custom integrations</p>
                            </div>
                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                              Manage Keys
                            </button>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-sm font-medium text-gray-900">Webhook Settings</h3>
                              <p className="text-sm text-gray-500">Configure webhooks for real-time notifications</p>
                            </div>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                              Configure
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Save Changes */}
                      <div className="flex justify-end space-x-4">
                        <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                          Cancel
                        </button>
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              } />
            </Route>

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="content" element={<ContentModeration />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="settings" element={<SystemCleanup />} />
            </Route>

            {/* Root route */}
            <Route
              path="/"
              element={
                isAuthenticated && user?.user_type ? (
                  <Navigate to={getDashboardPath(user.user_type)} replace />
                ) : (
                  <LandingPage />
                )
              }
            />

            {/* Catch all - redirect to root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#363636",
                color: "#fff",
              },
              success: {
                style: {
                  background: "#10B981",
                },
              },
              error: {
                style: {
                  background: "#EF4444",
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
