"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";

import { Reservation } from "@/types";

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

function formatDate(dateString?: string) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function MyReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchReservations();
  }, []);

  async function fetchReservations() {
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/my`, {
        credentials: "include",
      });

      const data = await response.json();

      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const matchesSearch =
        reservation.reservationCode
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        reservation.guestName?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : reservation.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reservations, search, statusFilter]);

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
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#8FBFBE]`}
                >
                  Customer Booking History
                </p>

                <h1
                  className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase tracking-wider text-[#315F5B] sm:text-5xl`}
                >
                  My Reservations
                </h1>

                <p
                  className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
                >
                  your afternoon tea moments
                </p>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
                  View your reservation history, upcoming afternoon tea
                  bookings, table assignments, and reservation details.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link href="/customer/reservations/new">
                  <Button className="w-full">+ New Reservation</Button>
                </Link>

                <StatusBadge
                  status={`${filteredReservations.length} Reservations`}
                />
              </div>
            </div>
          </Card>

          <Card className="mb-8 bg-white/70">
            <div className="grid gap-4 lg:grid-cols-3">
              <Input
                label="Search Reservation"
                placeholder="Search reservation code"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <div>
                <label
                  className={`${cinzel.className} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#C8A86A]`}
                >
                  Reservation Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1]/80 px-5 py-3 text-sm text-[#315F5B] outline-none transition focus:border-[#8FBFBE]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div className="flex items-end">
                <Card className="w-full bg-[#FFF8F1]/85 p-5">
                  <p
                    className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                  >
                    Total Reservations
                  </p>

                  <h2
                    className={`${cinzel.className} mt-2 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                  >
                    {filteredReservations.length}
                  </h2>
                </Card>
              </div>
            </div>
          </Card>

          {loading && (
            <Card className="bg-white/75">
              <p className="text-sm text-[#7D6E66]">Loading reservations...</p>
            </Card>
          )}

          {!loading && filteredReservations.length === 0 && (
            <Card className="bg-white/75 text-center">
              <h2
                className={`${cinzel.className} text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
              >
                No Reservations Found
              </h2>

              <p className="mt-4 text-sm text-[#7D6E66]">
                Your reservation history will appear here.
              </p>

              <div className="mt-6">
                <Link href="/customer/reservations/new">
                  <Button>Create Reservation</Button>
                </Link>
              </div>
            </Card>
          )}

          {!loading && filteredReservations.length > 0 && (
            <div className="grid gap-6">
              {filteredReservations.map((reservation) => (
                <Card
                  key={reservation.id}
                  className="bg-white/75 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p
                          className={`${cinzel.className} text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                        >
                          {reservation.reservationCode}
                        </p>

                        <StatusBadge status={reservation.status} />
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                          <p
                            className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                          >
                            Reservation Date
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                            {formatDate(reservation.reservationDate)}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                          <p
                            className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                          >
                            Reservation Time
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                            {reservation.startTime}
                            {reservation.endTime
                              ? ` - ${reservation.endTime}`
                              : ""}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                          <p
                            className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                          >
                            Guests
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                            {reservation.guestCount} Guests
                          </p>
                        </div>

                        <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                          <p
                            className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                          >
                            Assigned Tables
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                            {reservation.tables && reservation.tables.length > 0
                              ? reservation.tables
                                  .map((item) => item.table.name)
                                  .join(", ")
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 lg:w-55">
                      <Link href={`/customer/reservations/${reservation.id}`}>
                        <Button className="w-full">View Reservation</Button>
                      </Link>

                      <Link href={`/customer/reservations/${reservation.id}`}>
                        <Button variant="outline" className="w-full">
                          Manage Booking
                        </Button>
                      </Link>
                    </div>
                  </div>
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
