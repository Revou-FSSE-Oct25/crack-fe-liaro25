"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { apiFetch } from "@/lib/api";
import { saveToken, saveUser } from "@/lib/auth";

import { LoginResponse } from "@/types";

type LoginFormData = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<LoginFormData>();

  async function onSubmit(data: LoginFormData) {
    try {
      setError("");

      const response = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      saveToken(response.accessToken);
      saveUser(response.user);

      if (response.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/customer");
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-3xl font-bold mb-6">Login</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Email</label>

            <input
              type="email"
              {...register("email")}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium">Password</label>

            <input
              type="password"
              {...register("password")}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-3 rounded-lg"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </main>
  );
}
