"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { toast } from "sonner";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, setIsLoading, login, logout } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          const response = await api.get("/auth/me");
          if (response.data.success) {
            setUser(response.data.data);
            localStorage.setItem("user", JSON.stringify(response.data.data));
          }
        } catch {
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [setUser, setIsLoading, logout]);

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await api.post("/auth/register", { name, email, password, role });
      if (response.data.success) {
        const { user, token } = response.data.data;
        login(user, token);
        toast.success("Account created successfully!");
        return { success: true };
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Registration failed");
      return { success: false, error: err.response?.data?.message };
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      if (response.data.success) {
        const { user, token } = response.data.data;
        login(user, token);
        toast.success("Welcome back!");
        return { success: true };
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Login failed");
      return { success: false, error: err.response?.data?.message };
    }
  };

  const googleLogin = async (googleId: string, name: string, email: string, avatar?: string) => {
    try {
      const response = await api.post("/auth/google", { googleId, name, email, avatar });
      if (response.data.success) {
        const { user, token } = response.data.data;
        login(user, token);
        toast.success("Welcome!");
        return { success: true };
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || "Google login failed");
      return { success: false, error: err.response?.data?.message };
    }
  };

  const logoutUser = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore error
    }
    logout();
    toast.success("Logged out successfully");
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    register,
    login: loginUser,
    googleLogin,
    logout: logoutUser,
  };
}
