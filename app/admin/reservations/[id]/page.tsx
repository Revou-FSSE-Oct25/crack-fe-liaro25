"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Reservation } from "@/types";

function formatDate(dateString?: string) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatDateTime(dateString?: string) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCurrency(value?: string) {
  if (!value) return "-";

  return `Rp ${Number(value).toLocaleString("id-ID")}`;
}

export default function AdminReservationDetailPage() {
  const params = useParams();
  const reservationId = params.id as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [saving, setSaving] = useState(false);
  const [updated, setUpdated] = useState(false);

  useEffect(() => {
    fetchReservationDetail();
  }, []);

  useEffect(() => {
    if (reservation) {
      setSelectedStatus(reservation.status);
    }
  }, [reservation]);

  async function fetchReservationDetail() {
    try {
      const response = await fetch(
        `https://whiskandwonder.up.railway.app/reservations/${reservationId}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      setReservation(data);
    } catch (error) {
      console.error("Failed to fetch reservation detail:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateReservationStatus() {
    try {
      setSaving(true);
      setUpdated(false);

      const response = await fetch(
        `https://whiskandwonder.up.railway.app/reservations/${reservationId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: selectedStatus }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update reservation status");
      }

      setReservation((prevReservation) =>
        prevReservation
          ? { ...prevReservation, status: selectedStatus }
          : prevReservation,
      );

      setUpdated(true);

      setTimeout(() => {
        setUpdated(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to update reservation status:", error);
      alert("Failed to update reservation status");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-6 py-10">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8">
            <Link
              href="/admin/reservations"
              className="inline-flex items-center text-sm font-medium text-[#b8895b] hover:underline"
            >
              ← Back to Reservations
            </Link>

            <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">
              Reservation Detail
            </h1>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Loading reservation detail...
            </div>
          )}

          {!loading && !reservation && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Reservation not found.
            </div>
          )}

          {!loading && reservation && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-[#6f6258]">Reservation Code</p>
                    <h2 className="mt-1 text-2xl font-bold text-[#2f241d]">
                      {reservation.reservationCode}
                    </h2>
                  </div>

                  <span className="w-fit rounded-full bg-[#efe3d3] px-4 py-2 text-sm font-medium capitalize text-[#2f241d]">
                    {reservation.status}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#2f241d]">
                  Update Reservation Status
                </h3>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <select
                    value={selectedStatus}
                    onChange={(event) => setSelectedStatus(event.target.value)}
                    className="rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-sm font-medium capitalize text-[#2f241d] outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={updateReservationStatus}
                    disabled={saving}
                    className="rounded-xl bg-[#2f241d] px-5 py-3 text-sm font-medium text-white hover:bg-[#4a3a30] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Status"}
                  </button>

                  {updated && (
                    <span className="text-sm font-medium text-green-700">
                      Updated
                    </span>
                  )}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#2f241d]">
                    Customer Information
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-[#2f241d]">
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {reservation.guestName}
                    </p>

                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {reservation.guestEmail}
                    </p>

                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {reservation.guestPhone}
                    </p>

                    <p>
                      <span className="font-medium">User Role:</span>{" "}
                      {reservation.user?.role || "Guest"}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-[#2f241d]">
                    Reservation Schedule
                  </h3>

                  <div className="mt-4 space-y-3 text-sm text-[#2f241d]">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {formatDate(reservation.reservationDate)}
                    </p>

                    <p>
                      <span className="font-medium">Time:</span>{" "}
                      {reservation.startTime}
                      {reservation.endTime ? ` - ${reservation.endTime}` : ""}
                    </p>

                    <p>
                      <span className="font-medium">Guests:</span>{" "}
                      {reservation.guestCount}
                    </p>

                    <p>
                      <span className="font-medium">Created:</span>{" "}
                      {formatDateTime(reservation.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#2f241d]">
                  Assigned Tables
                </h3>

                {reservation.tables && reservation.tables.length > 0 ? (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {reservation.tables.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[#ead8c5] p-4"
                      >
                        <p className="font-semibold text-[#2f241d]">
                          {item.table.name}
                        </p>

                        <p className="mt-1 text-sm text-[#6f6258]">
                          Capacity: {item.table.capacity} guests
                        </p>

                        <p className="mt-1 text-sm capitalize text-[#6f6258]">
                          Status: {item.table.status}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-[#6f6258]">
                    No table assigned.
                  </p>
                )}
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-[#2f241d]">Order</h3>

                {reservation.order ? (
                  <div className="mt-4 space-y-3 text-sm text-[#2f241d]">
                    <p>
                      <span className="font-medium">Subtotal:</span>{" "}
                      {formatCurrency(reservation.order.subtotal)}
                    </p>

                    <p>
                      <span className="font-medium">Tax:</span>{" "}
                      {formatCurrency(reservation.order.tax)}
                    </p>

                    <p>
                      <span className="font-medium">Total:</span>{" "}
                      {formatCurrency(reservation.order.totalAmount)}
                    </p>

                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span className="capitalize">
                        {reservation.order.status}
                      </span>
                    </p>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-[#6f6258]">
                    No order created for this reservation.
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
