"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Reservation } from "@/types";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      const response = await fetch(
        "https://whiskandwonder.up.railway.app/reservations/my",
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      setReservations(data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-6 py-10">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-[#b8895b] hover:underline"
            >
              ← Back to Home
            </Link>

            <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
              Customer
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">
              My Reservations
            </h1>

            <p className="mt-2 text-sm text-[#6f6258]">
              View your reservation history and upcoming bookings.
            </p>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Loading reservations...
            </div>
          )}

          {!loading && reservations.length === 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              No reservations found.
            </div>
          )}

          {!loading && reservations.length > 0 && (
            <div className="grid gap-5">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="rounded-2xl bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <Link
                        href={`/customer/reservations/${reservation.id}`}
                        className="text-lg font-semibold text-[#b8895b] hover:underline"
                      >
                        {reservation.reservationCode}
                      </Link>

                      <div className="mt-3 space-y-1 text-sm text-[#2f241d]">
                        <p>
                          <span className="font-medium">Date:</span>{" "}
                          {formatDate(reservation.reservationDate)}
                        </p>

                        <p>
                          <span className="font-medium">Time:</span>{" "}
                          {reservation.startTime}
                          {reservation.endTime
                            ? ` - ${reservation.endTime}`
                            : ""}
                        </p>

                        <p>
                          <span className="font-medium">Guests:</span>{" "}
                          {reservation.guestCount}
                        </p>

                        <p>
                          <span className="font-medium">Tables:</span>{" "}
                          {reservation.tables && reservation.tables.length > 0
                            ? reservation.tables
                                .map((item) => item.table.name)
                                .join(", ")
                            : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-start gap-3 lg:items-end">
                      <span className="rounded-full bg-[#efe3d3] px-4 py-2 text-sm font-medium capitalize text-[#2f241d]">
                        {reservation.status}
                      </span>

                      <Link
                        href={`/customer/reservations/${reservation.id}`}
                        className="rounded-xl border border-[#ead8c5] px-4 py-2 text-sm font-medium text-[#2f241d] hover:bg-[#f6efe7]"
                      >
                        View Detail
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
