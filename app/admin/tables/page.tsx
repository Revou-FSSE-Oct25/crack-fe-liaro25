"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Reservation, Table } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whiskandwonder.up.railway.app";

function getDateOnly(dateString: string) {
  return new Date(dateString).toISOString().split("T")[0];
}

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayDate());
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tablesResponse, reservationsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/tables`, {
            credentials: "include",
          }),
          fetch(`${API_BASE_URL}/reservations`, {
            credentials: "include",
          }),
        ]);

        const tablesData = await tablesResponse.json();
        const reservationsData = await reservationsResponse.json();

        setTables(Array.isArray(tablesData) ? tablesData : []);
        setReservations(
          Array.isArray(reservationsData) ? reservationsData : [],
        );
      } catch (error) {
        console.error("Failed to fetch table availability:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const reservationsOnSelectedDate = useMemo(() => {
    return reservations.filter((reservation) => {
      return (
        getDateOnly(reservation.reservationDate) === selectedDate &&
        reservation.status !== "cancelled"
      );
    });
  }, [reservations, selectedDate]);

  const totalBookedGuests = reservationsOnSelectedDate.reduce(
    (total, reservation) => total + Number(reservation.guestCount || 0),
    0,
  );

  const tableCards = useMemo(() => {
    return tables.map((table) => {
      const relatedReservations = reservationsOnSelectedDate.filter(
        (reservation) =>
          reservation.tables?.some((item) => item.table.id === table.id),
      );

      const isBooked = relatedReservations.length > 0;

      return {
        table,
        isBooked,
        reservations: relatedReservations,
      };
    });
  }, [tables, reservationsOnSelectedDate]);

  const filteredTableCards = tableCards.filter((item) => {
    if (statusFilter === "available") return !item.isBooked;
    if (statusFilter === "booked") return item.isBooked;
    return true;
  });

  const bookedTablesCount = tableCards.filter((item) => item.isBooked).length;
  const availableTablesCount = tableCards.length - bookedTablesCount;

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

            <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">Tables</h1>

            <p className="mt-2 text-sm text-[#6f6258]">
              View table availability by reservation date.
            </p>
          </div>

          <div className="mb-6 grid gap-4 rounded-2xl border border-[#ead8c5] bg-white p-5 shadow-sm md:grid-cols-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                Reservation Date
              </label>

              <input
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
                className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                Table Status
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
              >
                <option value="all">All tables</option>
                <option value="available">Available only</option>
                <option value="booked">Booked only</option>
              </select>
            </div>

            <div className="rounded-xl bg-[#f8f3ec] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b8895b]">
                Booked Guests
              </p>
              <p className="mt-2 text-2xl font-bold text-[#2f241d]">
                {totalBookedGuests}
              </p>
            </div>

            <div className="rounded-xl bg-[#f8f3ec] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b8895b]">
                Tables
              </p>
              <p className="mt-2 text-sm font-semibold text-[#2f241d]">
                {bookedTablesCount} booked / {availableTablesCount} available
              </p>
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Loading tables...
            </div>
          )}

          {!loading && filteredTableCards.length === 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              No tables found for this filter.
            </div>
          )}

          {!loading && filteredTableCards.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTableCards.map(({ table, isBooked, reservations }) => (
                <div
                  key={table.id}
                  className="rounded-2xl border border-[#ead8c5] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-[#2f241d]">
                        {table.name}
                      </h2>

                      <p className="mt-2 text-sm text-[#6f6258]">
                        Capacity: {table.capacity} guests
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                        isBooked
                          ? "bg-[#f5d6d6] text-[#8a2f2f]"
                          : "bg-[#e6f2dd] text-[#3f6f2f]"
                      }`}
                    >
                      {isBooked ? "Booked" : "Available"}
                    </span>
                  </div>

                  {isBooked ? (
                    <div className="mt-5 space-y-3 border-t border-[#ead8c5] pt-4">
                      {reservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="rounded-xl bg-[#f8f3ec] p-4"
                        >
                          <Link
                            href={`/admin/reservations/${reservation.id}`}
                            className="font-semibold text-[#b8895b] hover:underline"
                          >
                            {reservation.reservationCode}
                          </Link>

                          <p className="mt-2 text-sm text-[#2f241d]">
                            {reservation.guestName}
                          </p>

                          <p className="mt-1 text-sm text-[#6f6258]">
                            {reservation.startTime}
                            {reservation.endTime
                              ? ` - ${reservation.endTime}`
                              : ""}{" "}
                            · {reservation.guestCount} guests
                          </p>

                          <p className="mt-1 text-xs capitalize text-[#6f6258]">
                            Status: {reservation.status}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-5 rounded-xl bg-[#f8f3ec] p-4 text-sm text-[#6f6258]">
                      No reservation assigned to this table on selected date.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
