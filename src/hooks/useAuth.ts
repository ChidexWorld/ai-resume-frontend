import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authAPI } from "../services/api";
import { useAuthStore } from "../store/authStore";
import type { AuthResponse, UserResponse, TokenVerificationResponse, ApiError } from "../types";

export const useLogin = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  return useMutation({
    mutationFn: authAPI.login,
    onSuccess: (response) => {
      const { access_token, user } = response.data as AuthResponse;
      login(user, access_token);
      toast.success(`Welcome back, ${user.full_name}!`);
      // Navigate based on user_type
      navigate(`/${user.user_type}/dashboard`);
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Login failed";
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: authAPI.register,
    onSuccess: (response) => {
      const user = response.data as UserResponse;
      toast.success(
        `Account created successfully, ${user.full_name}! Please login to continue.`
      );
      navigate("/login");
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Registration failed";
      toast.error(message);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Since there's no logout API endpoint, we'll just perform client-side logout
      return Promise.resolve();
    },
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
    onError: () => {
      // Force logout even if there are issues
      logout();
      queryClient.clear();
      navigate("/login");
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => authAPI.changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success("Password changed successfully!");
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to change password";
      toast.error(message);
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.updateProfile,
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      // Invalidate profile query to refresh the data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to update profile";
      toast.error(message);
    },
  });
};

export const useDeactivateAccount = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authAPI.deactivateAccount,
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success("Account deactivated successfully");
      navigate("/login");
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Failed to deactivate account";
      toast.error(message);
    },
  });
};

export const useGetProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authAPI.getProfile().then((res) => res.data as UserResponse),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useVerifyToken = () => {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: authAPI.verifyToken,
    onSuccess: (response) => {
      const { user } = response.data as TokenVerificationResponse;
      updateUser(user);
      toast.success("Token verified successfully");
    },
    onError: (error: ApiError) => {
      const message =
        error.response?.data?.message ||
        error.response?.data?.detail ||
        "Token verification failed";
      toast.error(message);

      // If token verification fails, it might be expired/invalid
      // Logout the user
      const logout = useAuthStore.getState().logout;
      logout();
    },
  });
};
