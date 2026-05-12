"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Reservation } from "@/types";

const API_URL = "https://whiskandwonder.up.railway.app";

const statusOptions = ["all", "pending", "confirmed", "cancelled", "completed"];

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getStatusBadgeClass(status: string) {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    case "completed":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

function getReservationDateValue(dateString: string) {
  return new Date(dateString).toISOString().split("T")[0];
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("all");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updatedId, setUpdatedId] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, [search, date, status]);

  async function fetchReservations() {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (search.trim()) params.append("search", search.trim());
      if (date) params.append("date", date);
      if (status !== "all") params.append("status", status);

      const queryString = params.toString();

      const response = await fetch(
        `${API_URL}/reservations${queryString ? `?${queryString}` : ""}`,
        {
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reservations");
      }

      const data = await response.json();

      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
      setError("Failed to load reservations. Please try again.");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredReservations = useMemo(() => {
    return reservations.filter((reservation) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        !keyword ||
        reservation.guestName?.toLowerCase().includes(keyword) ||
        reservation.guestEmail?.toLowerCase().includes(keyword) ||
        reservation.guestPhone?.toLowerCase().includes(keyword) ||
        reservation.reservationCode?.toLowerCase().includes(keyword);

      const matchesDate =
        !date || getReservationDateValue(reservation.reservationDate) === date;

      const matchesStatus =
        status === "all" || reservation.status?.toLowerCase() === status;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [reservations, search, date, status]);

  const summary = useMemo(() => {
    return {
      total: filteredReservations.length,
      confirmed: filteredReservations.filter(
        (reservation) => reservation.status === "confirmed",
      ).length,
      pending: filteredReservations.filter(
        (reservation) => reservation.status === "pending",
      ).length,
      cancelled: filteredReservations.filter(
        (reservation) => reservation.status === "cancelled",
      ).length,
    };
  }, [filteredReservations]);

  async function updateReservationStatus(id: string, newStatus: string) {
    try {
      setUpdatingId(id);
      setUpdatedId(null);

      const response = await fetch(`${API_URL}/reservations/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update reservation status");
      }

      setReservations((prevReservations) =>
        prevReservations.map((reservation) =>
          reservation.id === id
            ? { ...reservation, status: newStatus }
            : reservation,
        ),
      );

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
      <main className="min-h-screen bg-[#f8f3ec] px-4 py-8 md:px-6 md:py-10">
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
              Manage customer reservations, table assignments, and reservation
              statuses.
            </p>
          </div>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-[#6f6258]">Total Reservations</p>
              <p className="mt-2 text-3xl font-bold text-[#2f241d]">
                {summary.total}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-[#6f6258]">Confirmed</p>
              <p className="mt-2 text-3xl font-bold text-green-700">
                {summary.confirmed}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-[#6f6258]">Pending</p>
              <p className="mt-2 text-3xl font-bold text-yellow-700">
                {summary.pending}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <p className="text-sm text-[#6f6258]">Cancelled</p>
              <p className="mt-2 text-3xl font-bold text-red-700">
                {summary.cancelled}
              </p>
            </div>
          </div>

          <div className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, phone, or code..."
                className="rounded-xl border border-[#ead8c5] bg-[#fffaf5] px-4 py-3 text-sm text-[#2f241d] outline-none focus:border-[#b8895b]"
              />

              <input
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                className="rounded-xl border border-[#ead8c5] bg-[#fffaf5] px-4 py-3 text-sm text-[#2f241d] outline-none focus:border-[#b8895b]"
              />

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="rounded-xl border border-[#ead8c5] bg-[#fffaf5] px-4 py-3 text-sm capitalize text-[#2f241d] outline-none focus:border-[#b8895b]"
              >
                {statusOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Loading reservations...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl bg-red-50 p-6 text-sm font-medium text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {!loading && !error && filteredReservations.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-[#6f6258] shadow-sm">
              No reservations found.
            </div>
          )}

          {!loading && !error && filteredReservations.length > 0 && (
            <div className="space-y-4">
              {filteredReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="rounded-2xl bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <Link
                        href={`/admin/reservations/${reservation.id}`}
                        className="text-lg font-bold text-[#b8895b] hover:underline"
                      >
                        {reservation.reservationCode}
                      </Link>

                      <p className="mt-1 font-semibold text-[#2f241d]">
                        {reservation.guestName}
                      </p>

                      <p className="text-sm text-[#6f6258]">
                        {reservation.guestEmail}
                      </p>

                      <p className="text-sm text-[#6f6258]">
                        {reservation.guestPhone || "-"}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusBadgeClass(
                        reservation.status,
                      )}`}
                    >
                      {reservation.status}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4 text-sm text-[#2f241d] sm:grid-cols-2 lg:grid-cols-5">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9b8a7b]">
                        Date
                      </p>
                      <p className="mt-1 font-medium">
                        {formatDate(reservation.reservationDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9b8a7b]">
                        Time
                      </p>
                      <p className="mt-1 font-medium">
                        {reservation.startTime}
                        {reservation.endTime ? ` - ${reservation.endTime}` : ""}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9b8a7b]">
                        Guests
                      </p>
                      <p className="mt-1 font-medium">
                        {reservation.guestCount}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9b8a7b]">
                        Tables
                      </p>
                      <p className="mt-1 font-medium">
                        {reservation.tables && reservation.tables.length > 0
                          ? reservation.tables
                              .map((item) => item.table.name)
                              .join(", ")
                          : "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wide text-[#9b8a7b]">
                        Order Status
                      </p>
                      <p className="mt-1 font-medium capitalize">
                        {reservation.order?.status || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-col gap-3 border-t border-[#f1e5d8] pt-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/reservations/${reservation.id}`}
                        className="rounded-xl border border-[#ead8c5] px-4 py-2 text-sm font-medium text-[#2f241d] hover:bg-[#f8f3ec]"
                      >
                        View Details
                      </Link>

                      <Link
                        href={`/admin/reservations/${reservation.id}/edit`}
                        className="rounded-xl border border-[#ead8c5] px-4 py-2 text-sm font-medium text-[#2f241d] hover:bg-[#f8f3ec]"
                      >
                        Edit Reservation
                      </Link>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={reservation.status}
                        onChange={(event) => {
                          const newStatus = event.target.value;

                          setReservations((prevReservations) =>
                            prevReservations.map((item) =>
                              item.id === reservation.id
                                ? { ...item, status: newStatus }
                                : item,
                            ),
                          );
                        }}
                        className="rounded-xl border border-[#ead8c5] bg-[#fffaf5] px-3 py-2 text-sm capitalize text-[#2f241d]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                      </select>

                      <button
                        onClick={() =>
                          updateReservationStatus(
                            reservation.id,
                            reservation.status,
                          )
                        }
                        disabled={updatingId === reservation.id}
                        className="rounded-xl bg-[#2f241d] px-4 py-2 text-sm font-medium text-white hover:bg-[#4a3a30] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {updatingId === reservation.id
                          ? "Saving..."
                          : "Change Status"}
                      </button>

                      {updatedId === reservation.id && (
                        <span className="text-sm font-medium text-green-700">
                          Updated
                        </span>
                      )}
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
