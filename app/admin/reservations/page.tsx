"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getToken } from "@/lib/auth";
import { Reservation } from "@/types";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      const token = getToken();

      const response = await fetch(
        "https://whiskandwonder.up.railway.app/reservations",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-6 py-10">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm font-medium text-[#b8895b] hover:underline"
            >
              ← Back to Dashboard
            </Link>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">
              Reservations
            </h1>

            <p className="mt-2 text-sm text-[#6f6258]">
              View all customer and guest reservations.
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
            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="min-w-full">
                <thead className="bg-[#f3ebe2]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Code
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Customer
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Date
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Time
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Guests
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Table
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {reservations.map((reservation) => (
                    <tr
                      key={reservation.id}
                      className="border-t border-[#f1e5d8]"
                    >
                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {reservation.reservationCode}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        <div className="font-medium">
                          {reservation.guestName}
                        </div>

                        <div className="text-xs text-gray-500">
                          {reservation.guestEmail}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {formatDate(reservation.reservationDate)}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {reservation.startTime}
                        {reservation.endTime ? ` - ${reservation.endTime}` : ""}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {reservation.guestCount}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {reservation.tables && reservation.tables.length > 0
                          ? reservation.tables
                              .map((item) => item.table.name)
                              .join(", ")
                          : "-"}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <span className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs font-medium capitalize text-[#2f241d]">
                          {reservation.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
