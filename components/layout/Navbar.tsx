"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/30 bg-white/70 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-2xl font-bold text-[#2f241d]">
          Whisk & Wonder
        </Link>

        <div className="flex items-center gap-4">
          {!user && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[#2f241d] hover:text-[#b8895b]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="text-sm font-medium text-[#2f241d] hover:text-[#b8895b]"
              >
                Register
              </Link>
            </>
          )}

          {user && (
            <>
              {user.role === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-[#2f241d] hover:text-[#b8895b]"
                >
                  Admin Dashboard
                </Link>
              )}

              {user.role === "CUSTOMER" && (
                <Link
                  href="/customer"
                  className="text-sm font-medium text-[#2f241d] hover:text-[#b8895b]"
                >
                  Customer Dashboard
                </Link>
              )}

              <span className="rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm font-medium text-[#2f241d]">
                {user.name}
              </span>

              <Button onClick={logout} className="px-4 py-2">
                Logout
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
