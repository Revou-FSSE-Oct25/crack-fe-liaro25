"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
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

export default function AdminReservationDetailPage() {
  const params = useParams();
  const router = useRouter();

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
      setLoading(true);

      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        credentials: "include",
      });

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

      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

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
              onClick={() => router.push("/admin/reservations")}
            >
              ← Back to Reservations
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
              Reservation Detail
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
            >
              reviewed with care and precision
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
              Review guest details, reservation schedule, table assignment, and
              order information for this afternoon tea booking.
            </p>
          </Card>

          {loading && <Card>Loading reservation detail...</Card>}

          {!loading && !reservation && (
            <Card className="text-center text-[#7D6E66]">
              Reservation not found.
            </Card>
          )}

          {!loading && reservation && (
            <div className="space-y-6">
              <Card className="bg-white/75">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p
                      className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                    >
                      Reservation Code
                    </p>

                    <h2
                      className={`${cinzel.className} mt-3 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      {reservation.reservationCode}
                    </h2>

                    <p className="mt-4 text-sm leading-7 text-[#7D6E66]">
                      Created {formatDateTime(reservation.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={reservation.status} />

                    {reservation.order?.status && (
                      <StatusBadge status={reservation.order.status} />
                    )}
                  </div>
                </div>
              </Card>

              <Card className="bg-white/75">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3
                      className={`${cinzel.className} text-xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      Update Reservation Status
                    </h3>

                    <p className="mt-2 text-sm leading-7 text-[#7D6E66]">
                      Change the reservation flow status and save the update.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <select
                      value={selectedStatus}
                      onChange={(event) =>
                        setSelectedStatus(event.target.value)
                      }
                      className="rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm font-medium capitalize text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </select>

                    <Button onClick={updateReservationStatus} disabled={saving}>
                      {saving ? "Saving..." : "Save Status"}
                    </Button>

                    {updated && <StatusBadge status="updated" />}
                  </div>
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
                    <DetailItem
                      label="Guest Name"
                      value={reservation.guestName}
                    />
                    <DetailItem label="Email" value={reservation.guestEmail} />
                    <DetailItem
                      label="Phone"
                      value={reservation.guestPhone || "-"}
                    />
                    <DetailItem
                      label="User Role"
                      value={reservation.user?.role || "Guest"}
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
                      label="Reservation Date"
                      value={formatDate(reservation.reservationDate)}
                    />
                    <DetailItem
                      label="Time"
                      value={`${reservation.startTime}${
                        reservation.endTime ? ` - ${reservation.endTime}` : ""
                      }`}
                    />
                    <DetailItem
                      label="Guest Count"
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
                    No table assigned.
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

              <div className="flex flex-wrap justify-end gap-3">
                <Link href={`/admin/reservations/${reservation.id}/edit`}>
                  <Button variant="secondary">Edit Reservation</Button>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => router.push("/admin/reservations")}
                >
                  Back to Reservation List
                </Button>
              </div>
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
