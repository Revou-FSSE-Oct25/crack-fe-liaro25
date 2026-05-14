"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import { saveUser } from "@/lib/auth";

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

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
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
    <main
      className={`${inter.className} relative min-h-screen overflow-hidden bg-[#FFF8F1] px-6 py-10 text-[#4A3428] sm:px-10 lg:px-16`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/about-preview.webp')] bg-cover bg-center opacity-50"
        aria-hidden="true"
      />

      <section className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-5 flex justify-end">
          <Button variant="outline" onClick={() => router.push("/")}>
            ← Back to Home
          </Button>
        </div>

        <div className="grid min-h-[calc(100vh-220px)] items-center gap-8 lg:grid-cols-[1fr_480px]">
          <Card className="hidden bg-white/65 lg:block">
            <p
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
            >
              Whisk & Wonder
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-5xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B]`}
            >
              Welcome Back
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-4xl text-[#E8B7C8]`}
            >
              continue your afternoon tea journey
            </p>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#7D6E66]">
              Sign in to manage reservations, review your booking details, and
              continue your elegant seaside afternoon tea experience.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <StatusBadge status="secure login" />
              <StatusBadge status="reservation access" />
            </div>
          </Card>

          <Card className="mx-auto w-full max-w-md bg-white/75">
            <div className="text-center">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
              >
                Whisk & Wonder
              </p>

              <h2
                className={`${cinzel.className} mt-3 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
              >
                Login
              </h2>

              <p
                className={`${greatVibes.className} mt-2 text-3xl text-[#E8B7C8]`}
              >
                warmth and wonder
              </p>

              <p className="mt-3 text-sm leading-7 text-[#7D6E66]">
                Access your reservation account.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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

              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-[#C8A86A] transition hover:text-[#315F5B]"
                >
                  Forgot password?
                </Link>
              </div>

              {error && (
                <Card className="bg-[#F8D7DA]/90 p-4 text-sm font-semibold text-[#9B2C2C]">
                  {error}
                </Card>
              )}

              <Button type="submit" disabled={loading} className="w-full py-3">
                {loading ? "Signing In..." : "Login"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-[#7D6E66]">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#C8A86A] transition hover:text-[#315F5B]"
              >
                Register
              </Link>
            </p>
          </Card>
        </div>
      </section>

      <div className="relative z-10 mt-12">
        <Footer />
      </div>
    </main>
  );
}
