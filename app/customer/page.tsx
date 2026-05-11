"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getCurrentUser } from "@/lib/auth";

type CustomerProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  role: "CUSTOMER" | "ADMIN";
  createdAt?: string;
};

function formatDate(dateString?: string | null) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function CustomerDashboardPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = await getCurrentUser();
        setProfile(user);
      } catch (error) {
        console.error("Failed to fetch customer profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-6 py-10">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
              Whisk & Wonder
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">
              Customer Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-[#6f6258]">
              Manage your profile, reservations, orders, and payment history.
            </p>
          </div>

          <div className="mb-8 rounded-2xl border border-[#ead8c5] bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#b8895b]">
                  Profile
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-[#2f241d]">
                  {loading ? "Loading profile..." : profile?.name || "-"}
                </h2>

                <p className="mt-2 text-sm text-[#6f6258]">
                  Your customer information is used to simplify future
                  reservations.
                </p>
              </div>

              <Link
                href="/customer/profile"
                className="rounded-xl bg-[#2f241d] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#4a3a30]"
              >
                Edit Profile
              </Link>
            </div>

            {!loading && profile && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl bg-[#f8f3ec] p-4">
                  <p className="text-xs font-medium uppercase text-[#b8895b]">
                    Email
                  </p>
                  <p className="mt-2 wrap-break-words text-sm font-medium text-[#2f241d]">
                    {profile.email}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f8f3ec] p-4">
                  <p className="text-xs font-medium uppercase text-[#b8895b]">
                    Phone
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#2f241d]">
                    {profile.phone || "-"}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f8f3ec] p-4">
                  <p className="text-xs font-medium uppercase text-[#b8895b]">
                    Date of Birth
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#2f241d]">
                    {formatDate(profile.dateOfBirth)}
                  </p>
                </div>

                <div className="rounded-xl bg-[#f8f3ec] p-4">
                  <p className="text-xs font-medium uppercase text-[#b8895b]">
                    Address
                  </p>
                  <p className="mt-2 text-sm font-medium text-[#2f241d]">
                    {profile.address || "-"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/customer/reservations"
              className="rounded-2xl border border-[#ead8c5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-[#2f241d]">
                My Reservations
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6f6258]">
                View your reservation history, check details, reschedule, or
                cancel your booking.
              </p>

              <p className="mt-5 text-sm font-semibold text-[#b8895b]">
                Open →
              </p>
            </Link>

            <Link
              href="/customer/reservations/new"
              className="rounded-2xl border border-[#ead8c5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-[#2f241d]">
                Make a Reservation
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6f6258]">
                Create a new reservation using your saved customer information.
              </p>

              <p className="mt-5 text-sm font-semibold text-[#b8895b]">
                Book Now →
              </p>
            </Link>

            <Link
              href="/customer/orders"
              className="rounded-2xl border border-[#ead8c5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-[#2f241d]">
                My Orders
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6f6258]">
                View your afternoon tea menu orders connected to your
                reservations.
              </p>

              <p className="mt-5 text-sm font-semibold text-[#b8895b]">
                View Orders →
              </p>
            </Link>

            <Link
              href="/customer/payments"
              className="rounded-2xl border border-[#ead8c5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-[#2f241d]">
                Payment History
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6f6258]">
                Check your payment records, status, and transaction history.
              </p>

              <p className="mt-5 text-sm font-semibold text-[#b8895b]">
                View Payments →
              </p>
            </Link>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
