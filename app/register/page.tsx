"use client";

import { useState } from "react";
import Link from "next/link";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whiskandwonder.up.railway.app";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: { preventDefault: () => void }) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phone || undefined,
          address: address || undefined,
          dateOfBirth: dateOfBirth || undefined,
        }),
      });

      const text = await response.text();

      let data: { message?: string };

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Register API response is not JSON. Check API URL.");
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Registration successful. Redirecting to login...");

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (error) {
      console.error("Registration failed:", error);
      setError(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f3ec] px-6 py-12">
      <section className="mx-auto max-w-xl rounded-3xl bg-white p-8 shadow-sm">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
            Whisk & Wonder
          </p>

          <h1 className="mt-3 text-3xl font-bold text-[#2f241d]">
            Create Account
          </h1>

          <p className="mt-3 text-sm text-[#6f6258]">
            Register as a customer to manage your reservations.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#2f241d]">
              Full Name
            </label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
            />
          </div>

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

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2f241d]">
              Phone
            </label>
            <input
              type="text"
              placeholder="Optional"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2f241d]">
              Address
            </label>
            <input
              type="text"
              placeholder="Optional"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#2f241d]">
              Date of Birth
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(event) => setDateOfBirth(event.target.value)}
              className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
            />
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[#2f241d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#4a3a30] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#6f6258]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#b8895b] hover:underline"
          >
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}
