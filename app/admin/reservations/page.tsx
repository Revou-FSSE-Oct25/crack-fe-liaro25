"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";

import { Reservation } from "@/types";

const API_URL = "https://whiskandwonder.up.railway.app";

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

const statusOptions = ["all", "pending", "confirmed", "cancelled", "completed"];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getReservationDateValue(dateString: string) {
  return new Date(dateString).toISOString().split("T")[0];
}

function getMonthValue(dateString: string) {
  return new Date(dateString).toISOString().slice(0, 7);
}

function formatMonthLabel(monthValue: string) {
  if (monthValue === "all") return "All months";

  return new Date(`${monthValue}-01`).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
  });
}

export default function AdminReservationsPage() {
  const router = useRouter();

  const [reservations, setReservations] = useState<Reservation[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [monthFilter, setMonthFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchReservations() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/reservations`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const data = await response.json();

      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch reservations",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReservations();
  }, []);

  const availableMonths = useMemo(() => {
    const months = Array.from(
      new Set(
        reservations
          .filter((reservation) => reservation.reservationDate)
          .map((reservation) => getMonthValue(reservation.reservationDate)),
      ),
    ).sort((a, b) => b.localeCompare(a));

    return ["all", ...months];
  }, [reservations]);

  const filteredReservations = useMemo(() => {
    const keyword = search.toLowerCase();

    return reservations.filter((reservation) => {
      const matchesSearch =
        !keyword ||
        reservation.guestName?.toLowerCase().includes(keyword) ||
        reservation.guestEmail?.toLowerCase().includes(keyword) ||
        reservation.guestPhone?.toLowerCase().includes(keyword) ||
        reservation.reservationCode?.toLowerCase().includes(keyword);

      const matchesDate =
        !dateFilter ||
        getReservationDateValue(reservation.reservationDate) === dateFilter;

      const matchesStatus =
        statusFilter === "all" ||
        reservation.status?.toLowerCase() === statusFilter;

      const matchesMonth =
        monthFilter === "all" ||
        getMonthValue(reservation.reservationDate) === monthFilter;

      return matchesSearch && matchesDate && matchesStatus && matchesMonth;
    });
  }, [reservations, search, dateFilter, statusFilter, monthFilter]);

  const summary = useMemo(() => {
    return {
      total: filteredReservations.length,

      confirmed: filteredReservations.filter(
        (reservation) => reservation.status === "confirmed",
      ).length,

      pending: filteredReservations.filter(
        (reservation) => reservation.status === "pending",
      ).length,

      completed: filteredReservations.filter(
        (reservation) => reservation.status === "completed",
      ).length,

      guests: filteredReservations.reduce(
        (total, reservation) => total + Number(reservation.guestCount || 0),
        0,
      ),
    };
  }, [filteredReservations]);

  async function updateReservationStatus(id: string, newStatus: string) {
    try {
      setUpdatingId(id);
      setMessage("");
      setError("");

      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update reservation");
      }

      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === id
            ? { ...reservation, status: newStatus }
            : reservation,
        ),
      );

      setMessage("Reservation updated successfully.");
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update reservation",
      );
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main
        className={`${inter.className} relative min-h-screen overflow-hidden bg-[#FFF8F1] px-6 py-10 text-[#4A3428] sm:px-10 lg:px-16`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/about-preview.webp')] bg-cover bg-center opacity-50"
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
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
            >
              Whisk & Wonder Admin
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B] sm:text-5xl`}
            >
              Reservation Management
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
            >
              organized with warmth and precision
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
              Manage guest reservations, table scheduling, reservation statuses,
              and daily booking flow from one elegant admin workspace.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/admin/reservations/new">
                <Button variant="primary">Create Reservation</Button>
              </Link>

              <Button variant="outline" onClick={fetchReservations}>
                Refresh Data
              </Button>
            </div>
          </Card>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Card className="bg-[#DCEFF0]/75">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#315F5B]/70`}
              >
                Total Reservations
              </p>

              <p className="mt-3 text-4xl font-semibold text-[#315F5B]">
                {summary.total}
              </p>
            </Card>

            <Card className="bg-[#EAF6EF]/80">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#315F5B]/70`}
              >
                Confirmed
              </p>

              <p className="mt-3 text-4xl font-semibold text-[#2F6B45]">
                {summary.confirmed}
              </p>
            </Card>

            <Card className="bg-[#FFF3C4]/75">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#8A6A24]/70`}
              >
                Pending
              </p>

              <p className="mt-3 text-4xl font-semibold text-[#9A6A00]">
                {summary.pending}
              </p>
            </Card>

            <Card className="bg-[#FBE1EA]/75">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#9B4F68]/70`}
              >
                Completed
              </p>

              <p className="mt-3 text-4xl font-semibold text-[#9B4F68]">
                {summary.completed}
              </p>
            </Card>

            <Card className="bg-[#F6EEE7]/80">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#8A6A24]/70`}
              >
                Total Guests
              </p>

              <p className="mt-3 text-4xl font-semibold text-[#8A6A24]">
                {summary.guests}
              </p>
            </Card>
          </div>

          <Card className="mb-8 bg-white/70">
            <div className="grid gap-4 lg:grid-cols-[1fr_200px_200px_200px_auto] lg:items-center">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, phone, or code..."
              />

              <input
                type="date"
                value={dateFilter}
                onChange={(event) => setDateFilter(event.target.value)}
                className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
              />

              <select
                value={monthFilter}
                onChange={(event) => setMonthFilter(event.target.value)}
                className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
              >
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {formatMonthLabel(month)}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === "all" ? "All statuses" : status}
                  </option>
                ))}
              </select>

              <Button variant="outline" onClick={fetchReservations}>
                Refresh
              </Button>
            </div>
          </Card>

          {message && (
            <Card className="mb-4 bg-[#DDF2E3]/90 text-sm font-semibold text-[#2F6B45]">
              {message}
            </Card>
          )}

          {error && (
            <Card className="mb-4 bg-[#F8D7DA]/90 text-sm font-semibold text-[#9B2C2C]">
              {error}
            </Card>
          )}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
              >
                Reservation Records
              </p>

              <h2
                className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
              >
                Guest Reservation Overview
              </h2>

              <p className="mt-2 text-sm text-[#7D6E66]">
                Showing {formatMonthLabel(monthFilter)}
              </p>
            </div>

            <StatusBadge
              status={`${filteredReservations.length} reservations`}
            />
          </div>

          {loading && <Card>Loading reservations...</Card>}

          {!loading && filteredReservations.length === 0 && (
            <Card className="text-center text-[#7D6E66]">
              No reservations found.
            </Card>
          )}

          {!loading && filteredReservations.length > 0 && (
            <div className="space-y-5">
              {filteredReservations.map((reservation) => (
                <Card key={reservation.id} className="bg-white/75">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p
                        className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                      >
                        Reservation Code
                      </p>

                      <Link
                        href={`/admin/reservations/${reservation.id}`}
                        className={`${cinzel.className} mt-2 block text-2xl font-semibold uppercase tracking-wider text-[#315F5B] transition hover:text-[#C8A86A]`}
                      >
                        {reservation.reservationCode}
                      </Link>

                      <p className="mt-3 text-sm leading-7 text-[#7D6E66]">
                        {reservation.guestName}
                        <br />
                        {reservation.guestEmail}
                        <br />
                        {reservation.guestPhone || "-"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge status={reservation.status} />

                      {reservation.order?.status && (
                        <StatusBadge status={reservation.order.status} />
                      )}
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                      <p
                        className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                      >
                        Reservation Date
                      </p>

                      <p className="mt-2 font-semibold text-[#315F5B]">
                        {formatDate(reservation.reservationDate)}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                      <p
                        className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                      >
                        Time
                      </p>

                      <p className="mt-2 font-semibold text-[#315F5B]">
                        {reservation.startTime}
                        {reservation.endTime ? ` - ${reservation.endTime}` : ""}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                      <p
                        className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                      >
                        Guest Count
                      </p>

                      <p className="mt-2 font-semibold text-[#315F5B]">
                        {reservation.guestCount}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                      <p
                        className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                      >
                        Assigned Tables
                      </p>

                      <p className="mt-2 font-semibold text-[#315F5B]">
                        {reservation.tables && reservation.tables.length > 0
                          ? reservation.tables
                              .map((item) => item.table.name)
                              .join(", ")
                          : "-"}
                      </p>
                    </div>

                    <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                      <p
                        className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                      >
                        Order Status
                      </p>

                      <p className="mt-2 font-semibold capitalize text-[#315F5B]">
                        {reservation.order?.status || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 border-t border-[#EBDDD1] pt-5 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex flex-wrap gap-3">
                      <Link href={`/admin/reservations/${reservation.id}`}>
                        <Button variant="outline">View Details</Button>
                      </Link>

                      <Link href={`/admin/reservations/${reservation.id}/edit`}>
                        <Button variant="secondary">Edit Reservation</Button>
                      </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={reservation.status}
                        onChange={(event) =>
                          updateReservationStatus(
                            reservation.id,
                            event.target.value,
                          )
                        }
                        disabled={updatingId === reservation.id}
                        className="rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none"
                      >
                        <option value="pending">pending</option>

                        <option value="confirmed">confirmed</option>

                        <option value="cancelled">cancelled</option>

                        <option value="completed">completed</option>
                      </select>

                      {updatingId === reservation.id && (
                        <StatusBadge status="Updating..." />
                      )}
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
