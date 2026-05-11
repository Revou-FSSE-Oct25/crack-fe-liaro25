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

export default function MyReservationDetailPage() {
  const params = useParams();
  const reservationId = params.id as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReservationDetail();
  }, []);

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
