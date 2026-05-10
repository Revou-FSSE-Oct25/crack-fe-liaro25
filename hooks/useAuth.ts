"use client";

import { useEffect, useState } from "react";
import { User } from "@/types";
import { getUser, logout as clearAuth } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, []);

  function logout() {
    clearAuth();
    setUser(null);
    window.location.href = "/login";
  }

  return {
    user,
    isLoggedIn: !!user,
    logout,
  };
}
