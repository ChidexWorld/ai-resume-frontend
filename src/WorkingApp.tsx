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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function WorkingApp() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/login"
              element={
                !isAuthenticated ? (
                  <LoginPage />
                ) : (
                  <Navigate to={`/${user?.user_type || 'employee'}/dashboard`} replace />
                )
              }
            />
            <Route
              path="/register"
              element={
                !isAuthenticated ? (
                  <RegisterPage />
                ) : (
                  <Navigate to={`/${user?.user_type || 'employee'}/dashboard`} replace />
                )
              }
            />

            {/* Protected Employee Routes */}
            <Route
              path="/employee/*"
              element={
                <ProtectedRoute requiredRole="employee">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route
                path="*"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Employee Feature</h1>
                    <p className="text-gray-600 mt-2">
                      This feature is coming soon.
                    </p>
                  </div>
                }
              />
            </Route>

            {/* Protected Employer Routes */}
            <Route
              path="/employer/*"
              element={
                <ProtectedRoute requiredRole="employer">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<EmployerDashboard />} />
              <Route
                path="*"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Employer Feature</h1>
                    <p className="text-gray-600 mt-2">
                      This feature is coming soon.
                    </p>
                  </div>
                }
              />
            </Route>

            {/* Protected Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute requiredRole="admin">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route
                path="*"
                element={
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Admin Feature</h1>
                    <p className="text-gray-600 mt-2">
                      This feature is coming soon.
                    </p>
                  </div>
                }
              />
            </Route>

            {/* Root redirect */}
            <Route
              path="/"
              element={
                isAuthenticated && user?.user_type ? (
                  <Navigate to={`/${user.user_type}/dashboard`} replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Catch all */}
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

export default WorkingApp;