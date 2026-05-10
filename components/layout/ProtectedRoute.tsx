"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRole } from "@/types";
import { getUser } from "@/lib/auth";

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
    const user = getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      router.push("/");
      return;
    }

    setIsAllowed(true);
    setIsChecking(false);
  }, [allowedRoles, router]);

  if (isChecking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Checking access...</p>
      </main>
    );
  }

  if (!isAllowed) return null;

  return <>{children}</>;
}
