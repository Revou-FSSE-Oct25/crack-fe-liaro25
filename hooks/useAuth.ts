"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { getUser, logout as clearAuth } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getUser());
    setIsLoading(false);
  }, []);

  function logout() {
    clearAuth();
    setUser(null);
    window.location.href = "/login";
  }

  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    logout,
  };
}
