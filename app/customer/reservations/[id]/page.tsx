"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
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

const timeOptions = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

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

function formatCurrency(value?: string | number) {
  if (value === undefined || value === null) return "-";

  return `Rp ${Number(value).toLocaleString("id-ID")}`;
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
      <p
        className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
      >
        {label}
      </p>

      <div className="mt-2 text-sm font-semibold text-[#315F5B]">{value}</div>
    </div>
  );
}

export default function CustomerReservationDetailPage() {
  const params = useParams();
  const router = useRouter();

  const reservationId = params.id as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [reservationDate, setReservationDate] = useState("");
  const [startTime, setStartTime] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReservationDetail();
  }, []);

  useEffect(() => {
    if (reservation) {
      setReservationDate(reservation.reservationDate?.split("T")[0] || "");
      setStartTime(reservation.startTime || "");
    }
  }, [reservation]);

  async function fetchReservationDetail() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservationId}`,
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch reservation detail");
      }

      setReservation(data);
    } catch (error) {
      console.error("Failed to fetch reservation detail:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch reservation detail",
      );
    } finally {
      setLoading(false);
    }
  }

  async function rescheduleReservation() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservationId}/reschedule`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationDate,
            startTime,
          }),
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to reschedule reservation");
      }

      setMessage("Reservation rescheduled successfully.");
      await fetchReservationDetail();
    } catch (error) {
      console.error("Failed to reschedule reservation:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to reschedule reservation",
      );
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
      setMessage("");
      setError("");

      const response = await fetch(
        `${API_BASE_URL}/reservations/${reservationId}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        },
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to cancel reservation");
      }

      setMessage("Reservation cancelled successfully.");
      await fetchReservationDetail();
    } catch (error) {
      console.error("Failed to cancel reservation:", error);
      setError(
        error instanceof Error ? error.message : "Failed to cancel reservation",
      );
    } finally {
      setSaving(false);
    }
  }

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
            <Button
              variant="outline"
              onClick={() => router.push("/customer/reservations")}
            >
              ← Back to My Reservations
            </Button>
          </div>

          <Card className="mb-8 bg-white/65">
            <p
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
            >
              Customer Reservation
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B] sm:text-5xl`}
            >
              Reservation Detail
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
            >
              review your afternoon tea booking
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
              View your reservation details, table assignment, order summary,
              and manage your booking schedule.
            </p>
          </Card>

          {loading && (
            <Card className="bg-white/75">
              <p className="text-sm text-[#7D6E66]">
                Loading reservation detail...
              </p>
            </Card>
          )}

          {!loading && error && (
            <Card className="mb-4 bg-[#F8D7DA]/90 text-sm font-semibold text-[#9B2C2C]">
              {error}
            </Card>
          )}

          {!loading && message && (
            <Card className="mb-4 bg-[#DDF2E3]/90 text-sm font-semibold text-[#2F6B45]">
              {message}
            </Card>
          )}

          {!loading && !reservation && !error && (
            <Card className="bg-white/75 text-center">
              <h2
                className={`${cinzel.className} text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
              >
                Reservation Not Found
              </h2>

              <p className="mt-4 text-sm text-[#7D6E66]">
                We could not find this reservation.
              </p>
            </Card>
          )}

          {!loading && reservation && (
            <div className="space-y-6">
              <Card className="bg-white/75">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p
                      className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                    >
                      Reservation Code
                    </p>

                    <h2
                      className={`${cinzel.className} mt-2 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      {reservation.reservationCode}
                    </h2>
                  </div>

                  <StatusBadge status={reservation.status} />
                </div>
              </Card>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-white/75">
                  <h3
                    className={`${cinzel.className} text-xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                  >
                    Customer Information
                  </h3>

                  <div className="mt-5 grid gap-4">
                    <DetailItem label="Name" value={reservation.guestName} />

                    <DetailItem label="Email" value={reservation.guestEmail} />

                    <DetailItem
                      label="Phone"
                      value={reservation.guestPhone || "-"}
                    />
                  </div>
                </Card>

                <Card className="bg-white/75">
                  <h3
                    className={`${cinzel.className} text-xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                  >
                    Reservation Schedule
                  </h3>

                  <div className="mt-5 grid gap-4">
                    <DetailItem
                      label="Date"
                      value={formatDate(reservation.reservationDate)}
                    />

                    <DetailItem
                      label="Time"
                      value={`${reservation.startTime}${
                        reservation.endTime ? ` - ${reservation.endTime}` : ""
                      }`}
                    />

                    <DetailItem
                      label="Guests"
                      value={`${reservation.guestCount} guests`}
                    />

                    <DetailItem
                      label="Created"
                      value={formatDateTime(reservation.createdAt)}
                    />
                  </div>
                </Card>
              </div>

              <Card className="bg-white/75">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p
                      className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                    >
                      Dining Setup
                    </p>

                    <h3
                      className={`${cinzel.className} mt-2 text-xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      Assigned Tables
                    </h3>
                  </div>

                  <StatusBadge
                    status={`${reservation.tables?.length || 0} tables`}
                  />
                </div>

                {reservation.tables && reservation.tables.length > 0 ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {reservation.tables.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-3xl border border-[#EBDDD1] bg-[#FFF8F1]/85 p-5"
                      >
                        <p
                          className={`${cinzel.className} text-lg font-semibold uppercase tracking-wider text-[#315F5B]`}
                        >
                          {item.table.name}
                        </p>

                        <p className="mt-2 text-sm leading-6 text-[#7D6E66]">
                          Capacity: {item.table.capacity} guests
                        </p>

                        <div className="mt-3">
                          <StatusBadge status={item.table.status} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-[#7D6E66]">
                    No table assigned yet.
                  </p>
                )}
              </Card>

              <Card className="bg-white/75">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p
                      className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                    >
                      Order Summary
                    </p>

                    <h3
                      className={`${cinzel.className} mt-2 text-xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      Reservation Order
                    </h3>
                  </div>

                  {reservation.order?.status && (
                    <StatusBadge status={reservation.order.status} />
                  )}
                </div>

                {reservation.order ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <DetailItem
                      label="Subtotal"
                      value={formatCurrency(reservation.order.subtotal)}
                    />

                    <DetailItem
                      label="Tax"
                      value={formatCurrency(reservation.order.tax)}
                    />

                    <DetailItem
                      label="Total"
                      value={formatCurrency(reservation.order.totalAmount)}
                    />

                    <DetailItem
                      label="Status"
                      value={
                        <span className="capitalize">
                          {reservation.order.status}
                        </span>
                      }
                    />
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-[#7D6E66]">
                    No order created for this reservation.
                  </p>
                )}
              </Card>

              <Card className="bg-white/75">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p
                      className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                    >
                      Manage Reservation
                    </p>

                    <h3
                      className={`${cinzel.className} mt-2 text-xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      Reschedule or Cancel
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7D6E66]">
                      You may reschedule your reservation date and start time,
                      or cancel the booking if your plans change.
                    </p>
                  </div>

                  <StatusBadge status={reservation.status} />
                </div>

                {reservation.status === "cancelled" ? (
                  <Card className="mt-5 border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
                    This reservation has been cancelled.
                  </Card>
                ) : (
                  <div className="mt-6 space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <Input
                        label="Reservation Date"
                        type="date"
                        value={reservationDate}
                        onChange={(event) =>
                          setReservationDate(event.target.value)
                        }
                      />

                      <div>
                        <label
                          className={`${cinzel.className} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#C8A86A]`}
                        >
                          Start Time
                        </label>

                        <select
                          value={startTime}
                          onChange={(event) => setStartTime(event.target.value)}
                          className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1]/80 px-5 py-3 text-sm text-[#315F5B] outline-none transition focus:border-[#8FBFBE]"
                        >
                          <option value="">Select time</option>
                          {timeOptions.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button onClick={rescheduleReservation} disabled={saving}>
                        {saving ? "Saving..." : "Reschedule"}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={cancelReservation}
                        disabled={saving}
                        className="text-red-600"
                      >
                        Cancel Reservation
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
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
