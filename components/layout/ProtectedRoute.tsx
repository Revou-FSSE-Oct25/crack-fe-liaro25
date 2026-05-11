"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { User, UserRole } from "@/types";
import { getCurrentUser, saveUser } from "@/lib/auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
};

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    async function checkAccess() {
      const user = (await getCurrentUser()) as User | null;

      if (!user) {
        router.push("/login");
        return;
      }

      saveUser(user);

      if (!allowedRoles.includes(user.role)) {
        router.push("/");
        return;
      }

      setIsAllowed(true);
      setIsChecking(false);
    }

    checkAccess();
  }, [allowedRoles, router]);

  if (isChecking) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p>Checking access...</p>
      </main>
    );
  }

  if (!isAllowed) return null;

  return <>{children}</>;
}
