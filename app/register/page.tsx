"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whiskandwonder.up.railway.app";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    <main
      className={`${inter.className} relative min-h-screen overflow-hidden bg-[#FFF8F1] text-[#4A3428]`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/about-preview.webp')] bg-cover bg-center opacity-50"
        aria-hidden="true"
      />

      <section className="relative z-10 px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="hidden bg-white/65 lg:block">
            <p
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
            >
              Whisk & Wonder
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-5xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B]`}
            >
              Create Account
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-4xl text-[#E8B7C8]`}
            >
              begin your afternoon tea journey
            </p>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#7D6E66]">
              Register to make reservations, review your bookings, and enjoy a
              seamless Whisk & Wonder afternoon tea experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <StatusBadge status="guest access" />
              <StatusBadge status="reservation ready" />
              <StatusBadge status="customer profile" />
            </div>
          </Card>

          <Card className="mx-auto w-full max-w-2xl bg-white/75">
            <div className="text-center">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
              >
                Whisk & Wonder
              </p>

              <h2
                className={`${cinzel.className} mt-3 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
              >
                Register
              </h2>

              <p
                className={`${greatVibes.className} mt-2 text-3xl text-[#E8B7C8]`}
              >
                warmth and wonder
              </p>

              <p className="mt-3 text-sm leading-7 text-[#7D6E66]">
                Create your customer account to manage reservations.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Full Name"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />

                <Input
                  label="Email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />

                <Input
                  label="Password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <Input
                  label="Phone"
                  type="text"
                  placeholder="Optional"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                />

                <Input
                  label="Address"
                  type="text"
                  placeholder="Optional"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />

                <Input
                  label="Date of Birth"
                  type="date"
                  value={dateOfBirth}
                  onChange={(event) => setDateOfBirth(event.target.value)}
                />
              </div>

              {error && (
                <Card className="bg-[#F8D7DA]/90 p-4 text-sm font-semibold text-[#9B2C2C]">
                  {error}
                </Card>
              )}

              {success && (
                <Card className="bg-[#DDF2E3]/90 p-4 text-sm font-semibold text-[#2F6B45]">
                  {success}
                </Card>
              )}

              <Button type="submit" disabled={loading} className="w-full py-3">
                {loading ? "Creating Account..." : "Register"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#7D6E66]">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#C8A86A] transition hover:text-[#315F5B]"
              >
                Login
              </Link>
            </p>
          </Card>
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
