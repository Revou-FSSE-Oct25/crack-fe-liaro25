"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getToken } from "@/lib/auth";
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

export default function CustomerReservationDetailPage() {
  const params = useParams();
  const reservationId = params.id as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [reservationDate, setReservationDate] = useState("");
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    fetchReservationDetail();
  }, []);

  useEffect(() => {
    if (reservation) {
      setReservationDate(reservation.reservationDate.split("T")[0]);
      setStartTime(reservation.startTime);
    }
  }, [reservation]);

  async function fetchReservationDetail() {
    try {
      const token = getToken();

      const response = await fetch(
        `https://whiskandwonder.up.railway.app/reservations/${reservationId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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

  async function rescheduleReservation() {
    try {
      setSaving(true);

      const token = getToken();

      const response = await fetch(
        `https://whiskandwonder.up.railway.app/reservations/${reservationId}/reschedule`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reservationDate,
            startTime,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to reschedule reservation");
      }

      await fetchReservationDetail();
    } catch (error) {
      console.error("Failed to reschedule reservation:", error);
      alert("Failed to reschedule reservation");
    } finally {
      setSaving(false);
    }
  }

  async function cancelReservation() {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this reservation?",
    );

    if (!confirmCancel) return;

    try {
      setSaving(true);

      const token = getToken();

      const response = await fetch(
        `https://whiskandwonder.up.railway.app/reservations/${reservationId}/cancel`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to cancel reservation");
      }

      await fetchReservationDetail();
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      alert("Failed to cancel reservation");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-6 py-10">
        <section className="mx-auto max-w-5xl">
          <div className="mb-8">
            <Link
              href="/customer/reservations"
              className="inline-flex items-center text-sm font-medium text-[#b8895b] hover:underline"
            >
              ← Back to My Reservations
            </Link>

            <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
              Customer
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
                  Manage Reservation
                </h3>

                {reservation.status === "cancelled" ? (
                  <p className="mt-4 text-sm text-red-500">
                    This reservation has been cancelled.
                  </p>
                ) : (
                  <div className="mt-5 space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                          Reservation Date
                        </label>

                        <input
                          type="date"
                          value={reservationDate}
                          onChange={(event) =>
                            setReservationDate(event.target.value)
                          }
                          className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                          Start Time
                        </label>

                        <input
                          type="time"
                          value={startTime}
                          onChange={(event) => setStartTime(event.target.value)}
                          className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={rescheduleReservation}
                        disabled={saving}
                        className="rounded-xl bg-[#2f241d] px-5 py-3 text-sm font-medium text-white hover:bg-[#4a3a30] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {saving ? "Saving..." : "Reschedule"}
                      </button>

                      <button
                        onClick={cancelReservation}
                        disabled={saving}
                        className="rounded-xl border border-red-300 bg-white px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Cancel Reservation
                      </button>
                    </div>
                  </div>
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
                    No order created for this reservation yet.
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
