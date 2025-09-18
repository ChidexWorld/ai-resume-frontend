import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStore } from "./store/authStore";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { DashboardLayout } from "./layouts/DashboardLayout";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { EmployeeDashboard } from "./pages/employee/Dashboard";
import { EmployerDashboard } from "./pages/employer/Dashboard";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { LandingPage } from "./pages/LandingPage";
import { ResumePage } from "./pages/employee/ResumePage";
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
              <Route
                path="users"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-gray-600 mt-2">Manage system users.</p>
                  </div>
                }
              />
              <Route
                path="content"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Content Moderation</h1>
                    <p className="text-gray-600 mt-2">
                      Review and moderate content.
                    </p>
                  </div>
                }
              />
              <Route
                path="analytics"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">System Analytics</h1>
                    <p className="text-gray-600 mt-2">
                      View system-wide analytics.
                    </p>
                  </div>
                }
              />
              <Route
                path="settings"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">System Settings</h1>
                    <p className="text-gray-600 mt-2">
                      Configure system settings.
                    </p>
                  </div>
                }
              />
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
