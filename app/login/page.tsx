"use client";

import { useState } from "react";
import Link from "next/link";

import { saveUser } from "@/lib/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whiskandwonder.up.railway.app";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      saveUser(data.user);

      if (data.user.role === "ADMIN") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/customer";
      }
    } catch (error) {
      console.error("Login failed:", error);

      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec] px-6 py-12">
      <section className="mx-auto max-w-md rounded-3xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
            Whisk & Wonder
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#2f241d]">
            Welcome Back
          </h1>

          <p className="mt-3 text-sm text-[#6f6258]">
            Login to manage your reservations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#2f241d]">
              Email
            </label>

            <input
              type="email"
              required
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2f241d]">
              Password
            </label>

            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2f241d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4a3a30] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6f6258]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-[#b8895b] hover:underline"
          >
            Register
          </Link>
        </p>
      </section>
    </main>
  );
}
