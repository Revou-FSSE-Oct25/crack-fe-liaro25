"use client";

import { FormEvent, useEffect, useState } from "react";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { User } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whiskandwonder.up.railway.app";

type ProfileForm = {
  name: string;
  phone: string;
  address: string;
  dateOfBirth: string;
};

function formatDateForInput(dateString?: string | null) {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
}

export default function CustomerProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    phone: "",
    address: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch profile");
      }

      setUser(data);
      setForm({
        name: data.name || "",
        phone: data.phone || "",
        address: data.address || "",
        dateOfBirth: formatDateForInput(data.dateOfBirth),
      });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to load profile",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          address: form.address,
          dateOfBirth: form.dateOfBirth || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      setUser(data);
      setMessage("Profile updated successfully.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update profile",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-4 py-8 md:px-6 md:py-10">
        <section className="mx-auto max-w-3xl">
          <div className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
              Customer Profile
            </p>

            <h1 className="mt-3 text-4xl font-bold text-[#2f241d]">
              My Profile
            </h1>

            <p className="mt-3 text-sm leading-6 text-[#6f6258]">
              View and update your personal account information used for
              reservations.
            </p>

            {loading && (
              <div className="mt-8 rounded-2xl bg-[#f8f3ec] p-5 text-sm text-[#6f6258]">
                Loading profile...
              </div>
            )}

            {!loading && error && (
              <div className="mt-8 rounded-2xl bg-red-50 p-5 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {!loading && user && (
              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                    Full Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(event) =>
                      setForm({ ...form, name: event.target.value })
                    }
                    className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none focus:border-[#b8895b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                    Email Address
                  </label>
                  <input
                    value={user.email}
                    readOnly
                    className="w-full rounded-xl border border-[#ead8c5] bg-[#f8f3ec] px-4 py-3 text-[#6f6258] outline-none"
                  />
                  <p className="mt-2 text-xs text-[#6f6258]">
                    Email cannot be changed from this page.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                    Phone Number
                  </label>
                  <input
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                    className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none focus:border-[#b8895b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                    Address
                  </label>
                  <textarea
                    value={form.address}
                    onChange={(event) =>
                      setForm({ ...form, address: event.target.value })
                    }
                    className="h-28 w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none focus:border-[#b8895b]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(event) =>
                      setForm({ ...form, dateOfBirth: event.target.value })
                    }
                    className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none focus:border-[#b8895b]"
                  />
                </div>

                {message && (
                  <div className="rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                    {message}
                  </div>
                )}

                {error && (
                  <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-[#2f241d] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#4a3a30] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Saving profile..." : "Save Profile"}
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
