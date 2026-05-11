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
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatedId, setUpdatedId] = useState<string | null>(null);

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

  async function updateReservationStatus(id: string, status: string) {
    try {
      setUpdatingId(id);
      setUpdatedId(null);

      const token = getToken();

      const response = await fetch(
        `https://whiskandwonder.up.railway.app/reservations/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update reservation status");
      }

      setUpdatedId(id);

      setTimeout(() => {
        setUpdatedId(null);
      }, 2000);
    } catch (error) {
      console.error("Failed to update reservation status:", error);
      alert("Failed to update reservation status");
    } finally {
      setUpdatingId(null);
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

            <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
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
                        <div className="flex items-center gap-2">
                          <select
                            value={reservation.status}
                            onChange={(event) => {
                              setReservations((prevReservations) =>
                                prevReservations.map((item) =>
                                  item.id === reservation.id
                                    ? { ...item, status: event.target.value }
                                    : item,
                                ),
                              );
                            }}
                            className="rounded-full border border-[#ead8c5] bg-[#efe3d3] px-3 py-1 text-xs font-medium capitalize text-[#2f241d]"
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          <button
                            onClick={() =>
                              updateReservationStatus(
                                reservation.id,
                                reservation.status,
                              )
                            }
                            disabled={updatingId === reservation.id}
                            className="rounded-lg bg-[#2f241d] px-3 py-1 text-xs font-medium text-white hover:bg-[#4a3a30] disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {updatingId === reservation.id
                              ? "Saving..."
                              : "Save"}
                          </button>

                          {updatedId === reservation.id && (
                            <span className="text-xs font-medium text-green-700">
                              Updated
                            </span>
                          )}
                        </div>
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
