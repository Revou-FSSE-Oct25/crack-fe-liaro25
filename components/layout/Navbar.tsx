"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cinzel } from "next/font/google";

import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#menu", label: "Menu" },
  { href: "/#gallery", label: "Gallery" },
  { href: "/#reservation", label: "Reservation" },
];

export default function Navbar() {
  const { user, logout } = useAuth();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 border-b border-white/40 bg-[#FFF8F1]/80 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-22 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
        <Link
          href="/"
          className={`${cinzel.className} text-xl font-semibold tracking-[0.08em] text-teal-dark transition hover:opacity-90 sm:text-2xl`}
        >
          Whisk & Wonder
        </Link>

        <div
          className={`${cinzel.className} hidden items-center gap-7 lg:flex`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-dark/75 transition hover:text-[#E8B7C8]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {!mounted ? (
            <>
              <div className="h-10 w-24 rounded-full bg-white/40" />
              <div className="h-10 w-28 rounded-full bg-[#E8B7C8]/40" />
            </>
          ) : (
            <>
              {!user && (
                <>
                  <Link
                    href="/login"
                    className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.14em] text-teal-dark/75 transition hover:text-[#E8B7C8]`}
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className={`${cinzel.className} rounded-full border border-[#C8A86A]/50 bg-white/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-teal-dark transition hover:bg-white/85`}
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
                      className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.12em] text-teal-dark/75 transition hover:text-[#E8B7C8]`}
                    >
                      Admin Dashboard
                    </Link>
                  )}

                  {user.role === "CUSTOMER" && (
                    <Link
                      href="/customer"
                      className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.12em] text-teal-dark/75 transition hover:text-[#E8B7C8]`}
                    >
                      Customer Dashboard
                    </Link>
                  )}

                  <span className="hidden rounded-full border border-white/60 bg-white/60 px-4 py-2 text-sm font-medium text-teal-dark backdrop-blur-md sm:inline-flex">
                    {user.name}
                  </span>

                  <Button
                    onClick={logout}
                    className="rounded-full bg-[#E8B7C8] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    Logout
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
