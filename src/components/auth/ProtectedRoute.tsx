import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "employee" | "employer" | "admin";
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, user, token } = useAuthStore();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRole && user?.user_type !== requiredRole) {
    return <Navigate to={`/${user?.user_type}/dashboard`} replace />;
  }

  return <>{children}</>;
};
