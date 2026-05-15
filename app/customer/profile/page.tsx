"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import { User } from "@/types";

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

    fetchProfile();
  }, []);

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
      <main
        className={`${inter.className} relative min-h-screen overflow-hidden bg-[#FFF8F1] px-6 py-10 text-[#4A3428] sm:px-10 lg:px-16`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/about-preview.webp')] bg-cover bg-center opacity-50"
          aria-hidden="true"
        />

        <section className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-5 flex justify-end">
            <Link href="/customer">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>

          <Card className="mb-8 bg-white/65">
            <p
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
            >
              Customer Profile
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B] sm:text-5xl`}
            >
              My Profile
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
            >
              your personal reservation details
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
              View and update your customer account information used for future
              reservations and afternoon tea bookings.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <StatusBadge status="customer profile" />
              <StatusBadge status="editable details" />
            </div>
          </Card>

          {loading && (
            <Card className="bg-white/75">
              <p className="text-sm text-[#7D6E66]">Loading profile...</p>
            </Card>
          )}

          {!loading && error && !user && (
            <Card className="bg-[#F8D7DA]/90 text-sm font-semibold text-[#9B2C2C]">
              {error}
            </Card>
          )}

          {!loading && user && (
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <Card className="h-fit border-[#8FBFBE]/25 bg-[#DCEFF0]/70 shadow-teal-100/40">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#315F5B]/70`}
                >
                  Account Overview
                </p>

                <h2 className="mt-5 text-3xl font-semibold text-[#315F5B]">
                  {user.name}
                </h2>

                <p className="mt-2 text-sm leading-7 text-[#7D6E66]">
                  {user.email}
                </p>

                <div className="mt-6 h-px bg-white/70" />

                <div className="mt-6 space-y-4">
                  <div>
                    <p
                      className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#315F5B]/70`}
                    >
                      Phone
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#315F5B]">
                      {user.phone || "-"}
                    </p>
                  </div>

                  <div>
                    <p
                      className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#315F5B]/70`}
                    >
                      Address
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-[#315F5B]">
                      {user.address || "-"}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-white/75">
                <div>
                  <p
                    className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                  >
                    Edit Profile
                  </p>

                  <h2
                    className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                  >
                    Customer Information
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-[#7D6E66]">
                    Keep your contact details updated for smoother reservation
                    handling.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Full Name"
                      value={form.name}
                      onChange={(event) =>
                        setForm({ ...form, name: event.target.value })
                      }
                    />

                    <Input
                      label="Email Address"
                      value={user.email}
                      readOnly
                      className="cursor-not-allowed opacity-70"
                    />

                    <Input
                      label="Phone Number"
                      value={form.phone}
                      onChange={(event) =>
                        setForm({ ...form, phone: event.target.value })
                      }
                    />

                    <Input
                      label="Date of Birth"
                      type="date"
                      value={form.dateOfBirth}
                      onChange={(event) =>
                        setForm({
                          ...form,
                          dateOfBirth: event.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label
                      className={`${cinzel.className} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#C8A86A]`}
                    >
                      Address
                    </label>

                    <textarea
                      value={form.address}
                      onChange={(event) =>
                        setForm({ ...form, address: event.target.value })
                      }
                      className="h-28 w-full rounded-3xl border border-[#EBDDD1] bg-[#FFF8F1]/80 px-5 py-4 text-sm text-[#315F5B] outline-none transition focus:border-[#8FBFBE]"
                    />
                  </div>

                  <p className="text-xs leading-6 text-[#7D6E66]">
                    Email cannot be changed from this page.
                  </p>

                  {message && (
                    <Card className="bg-[#DDF2E3]/90 p-4 text-sm font-semibold text-[#2F6B45]">
                      {message}
                    </Card>
                  )}

                  {error && (
                    <Card className="bg-[#F8D7DA]/90 p-4 text-sm font-semibold text-[#9B2C2C]">
                      {error}
                    </Card>
                  )}

                  <Button
                    type="submit"
                    disabled={saving}
                    className="w-full py-3"
                  >
                    {saving ? "Saving profile..." : "Save Profile"}
                  </Button>
                </form>
              </Card>
            </div>
          )}
        </section>

        <div className="relative z-10 mt-12">
          <Footer />
        </div>
      </main>
    </ProtectedRoute>
  );
}
