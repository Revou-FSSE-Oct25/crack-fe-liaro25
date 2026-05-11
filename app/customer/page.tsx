"use client";

import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function CustomerDashboardPage() {
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
              Manage your afternoon tea reservations and create new bookings.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
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
              href="/reservation"
              className="rounded-2xl border border-[#ead8c5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <h2 className="text-xl font-semibold text-[#2f241d]">
                Make a Reservation
              </h2>

              <p className="mt-3 text-sm leading-6 text-[#6f6258]">
                Create a new afternoon tea reservation with your preferred date
                and time.
              </p>

              <p className="mt-5 text-sm font-semibold text-[#b8895b]">
                Book Now →
              </p>
            </Link>
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
