"use client";

import { useEffect, useState } from "react";

import { User } from "@/types";
import {
  getCurrentUser,
  getUser,
  logout as logoutFromServer,
  saveUser,
} from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(getUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        saveUser(currentUser);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    }

    checkAuth();
  }, []);

  async function logout() {
    await logoutFromServer();
    setUser(null);
  }

  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    logout,
  };
}
