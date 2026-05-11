"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold">
        Whisk & Wonder
      </Link>

      <div className="flex items-center gap-4">
        {user && (
          <>
            {user.role === "ADMIN" && (
              <Link href="/admin" className="text-sm font-medium">
                Admin Dashboard
              </Link>
            )}

            {user.role === "CUSTOMER" && (
              <Link href="/customer" className="text-sm font-medium">
                Customer Dashboard
              </Link>
            )}

            <span className="text-sm">{user.name}</span>

            <button
              onClick={logout}
              className="bg-black text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
