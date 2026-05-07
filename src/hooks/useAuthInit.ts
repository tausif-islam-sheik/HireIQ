"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export function useAuthInit() {
  const { setUser, setToken, setIsLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          setToken(token);
          setUser(user);
        } catch {
          // Invalid user data, clear storage
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, [setUser, setToken, setIsLoading]);
}
