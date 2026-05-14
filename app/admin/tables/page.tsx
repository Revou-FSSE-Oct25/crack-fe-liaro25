"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import { Reservation, Table } from "@/types";

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

function getDateOnly(dateString: string) {
  return new Date(dateString).toISOString().split("T")[0];
}

function todayDate() {
  return new Date().toISOString().split("T")[0];
}

export default function AdminTablesPage() {
  const router = useRouter();

  const [tables, setTables] = useState<Table[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectedDate, setSelectedDate] = useState(todayDate());
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

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
      <main
        className={`${inter.className} relative min-h-screen overflow-hidden bg-[#FFF8F1] px-6 py-10 text-[#4A3428] sm:px-10 lg:px-16`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/about-preview.webp')] bg-cover bg-center opacity-[0.5]"
          aria-hidden="true"
        />

        <section className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-5 flex justify-end">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              ← Back to Admin
            </Button>
          </div>

          <Card className="mb-8 bg-white/65">
            <p
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.4em] text-[#8FBFBE]`}
            >
              Whisk & Wonder Admin
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B] sm:text-5xl`}
            >
              Table Availability
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
            >
              arranged for graceful dining
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
              View table availability by reservation date, monitor booked
              guests, and check which tables are assigned to upcoming afternoon
              tea reservations.
            </p>
          </Card>

          <Card className="mb-8 bg-white/70">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Input
                label="Reservation Date"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />

              <div>
                <label
                  className={`${cinzel.className} mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A86A]`}
                >
                  Table Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
                >
                  <option value="all">All tables</option>
                  <option value="available">Available only</option>
                  <option value="booked">Booked only</option>
                </select>
              </div>

              <div className="rounded-4xl border border-[#C8A86A]/25 bg-[#FFF3C4]/70 p-5 shadow-lg shadow-amber-100/40">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.25em] text-[#8A6A24]/70`}
                >
                  Booked Guests
                </p>

                <p className="mt-3 text-4xl font-semibold text-[#9A6A00]">
                  {totalBookedGuests}
                </p>
              </div>

              <div className="rounded-4xl border border-[#8FBFBE]/25 bg-[#DCEFF0]/70 p-5 shadow-lg shadow-teal-100/40">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.25em] text-[#315F5B]/70`}
                >
                  Tables
                </p>

                <p className="mt-3 text-sm font-semibold leading-7 text-[#315F5B]">
                  {bookedTablesCount} booked
                  <br />
                  {availableTablesCount} available
                </p>
              </div>
            </div>
          </Card>

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A86A]`}
              >
                Dining Layout
              </p>

              <h2
                className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-[0.04em] text-[#315F5B]`}
              >
                Tables on Selected Date
              </h2>
            </div>

            <StatusBadge status={`${filteredTableCards.length} tables`} />
          </div>

          {loading && <Card>Loading tables...</Card>}

          {!loading && filteredTableCards.length === 0 && (
            <Card>No tables found for this filter.</Card>
          )}

          {!loading && filteredTableCards.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTableCards.map(({ table, isBooked, reservations }) => (
                <Card key={table.id} className="h-full">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p
                        className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A86A]`}
                      >
                        Table
                      </p>

                      <h3
                        className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-[0.04em] text-[#315F5B]`}
                      >
                        {table.name}
                      </h3>

                      <p className="mt-2 text-sm text-[#7D6E66]">
                        Capacity: {table.capacity} guests
                      </p>
                    </div>

                    <StatusBadge status={isBooked ? "booked" : "available"} />
                  </div>

                  {isBooked ? (
                    <div className="mt-6 space-y-3 border-t border-[#EBDDD1] pt-5">
                      {reservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="rounded-3xl bg-[#FFF8F1]/85 p-4"
                        >
                          <Link
                            href={`/admin/reservations/${reservation.id}`}
                            className={`${cinzel.className} text-sm font-semibold uppercase tracking-[0.08em] text-[#C8A86A] transition hover:text-[#315F5B]`}
                          >
                            {reservation.reservationCode}
                          </Link>

                          <p className="mt-2 font-semibold text-[#315F5B]">
                            {reservation.guestName}
                          </p>

                          <p className="mt-1 text-sm leading-6 text-[#7D6E66]">
                            {reservation.startTime}
                            {reservation.endTime
                              ? ` - ${reservation.endTime}`
                              : ""}{" "}
                            · {reservation.guestCount} guests
                          </p>

                          <div className="mt-3">
                            <StatusBadge status={reservation.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 rounded-3xl bg-[#DDF2E3]/70 p-4 text-sm leading-7 text-[#2F6B45]">
                      This table is available for the selected date.
                    </div>
                  )}
                </Card>
              ))}
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
