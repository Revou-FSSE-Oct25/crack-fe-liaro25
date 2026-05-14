"use client";

import { useState } from "react";
import Link from "next/link";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";

import { getReservationByCode } from "@/lib/reservation";
import { Reservation } from "@/types";

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

function getStatusVariant(status?: string) {
  switch (status) {
    case "confirmed":
      return "confirmed";

    case "cancelled":
      return "cancelled";

    default:
      return "pending";
  }
}

export default function ReservationCheckPage() {
  const [code, setCode] = useState("");
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCheckReservation() {
    try {
      setLoading(true);
      setError("");

      const fullCode = `WHISK-${code}`;

      const response = await getReservationByCode(fullCode);

      setReservation(response);
    } catch (err) {
      setReservation(null);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Reservation not found");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`${inter.className} relative min-h-screen overflow-hidden bg-[#FFF8F1] text-[#4A3428]`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[url('/images/about-preview.webp')] bg-cover bg-center opacity-50"
        aria-hidden="true"
      />

      <section className="relative z-10 px-6 py-10 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="hidden bg-white/65 lg:block">
            <p
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
            >
              Whisk & Wonder
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-5xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B]`}
            >
              Check Reservation
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-4xl text-[#E8B7C8]`}
            >
              review your afternoon tea booking
            </p>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#7D6E66]">
              Enter your reservation code to view your reservation details,
              table assignment, booking schedule, and reservation status.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <StatusBadge status="booking lookup" />
              <StatusBadge status="reservation status" />
              <StatusBadge status="guest access" />
            </div>

            <div className="mt-8">
              <Link href="/">
                <Button variant="outline">← Back to Home</Button>
              </Link>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="bg-white/75">
              <div className="text-center">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
                >
                  Reservation Lookup
                </p>

                <h2
                  className={`${cinzel.className} mt-3 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                >
                  Reservation Details
                </h2>

                <p
                  className={`${greatVibes.className} mt-2 text-3xl text-[#E8B7C8]`}
                >
                  warmth and wonder
                </p>

                <p className="mt-3 text-sm leading-7 text-[#7D6E66]">
                  Enter your reservation code below.
                </p>
              </div>

              <div className="mt-8 space-y-5">
                <div>
                  <label
                    className={`${cinzel.className} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#C8A86A]`}
                  >
                    Reservation Code
                  </label>

                  <div className="flex overflow-hidden rounded-full border border-[#EBDDD1] bg-[#FFF8F1]">
                    <div className="flex items-center border-r border-[#EBDDD1] px-5 text-sm font-semibold text-[#B3A39A]">
                      WHISK-
                    </div>

                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="1778400152103"
                      className="w-full bg-transparent px-5 py-3 text-sm text-[#315F5B] outline-none"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCheckReservation}
                  disabled={loading}
                  className="w-full py-3"
                >
                  {loading ? "Checking..." : "Check Reservation"}
                </Button>

                {error && (
                  <Card className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
                    {error}
                  </Card>
                )}
              </div>
            </Card>

            {reservation && (
              <Card className="bg-white/75">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p
                      className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#C8A86A]`}
                    >
                      Reservation Code
                    </p>

                    <h3
                      className={`${cinzel.className} mt-2 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      {reservation.reservationCode}
                    </h3>
                  </div>

                  <StatusBadge status={getStatusVariant(reservation.status)} />
                </div>

                <div className="mt-8 grid gap-6 md:grid-cols-2">
                  <div className="space-y-4 rounded-4xl border border-[#EBDDD1] bg-[#FFF8F1]/70 p-6">
                    <h4
                      className={`${cinzel.className} text-lg font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      Guest Information
                    </h4>

                    <div className="space-y-2 text-sm text-[#7D6E66]">
                      <p>
                        <span className="font-semibold text-[#315F5B]">
                          Guest:
                        </span>{" "}
                        {reservation.guestName}
                      </p>

                      <p>
                        <span className="font-semibold text-[#315F5B]">
                          Email:
                        </span>{" "}
                        {reservation.guestEmail}
                      </p>

                      <p>
                        <span className="font-semibold text-[#315F5B]">
                          Phone:
                        </span>{" "}
                        {reservation.guestPhone}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 rounded-4xl border border-[#EBDDD1] bg-[#FFF8F1]/70 p-6">
                    <h4
                      className={`${cinzel.className} text-lg font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      Reservation Schedule
                    </h4>

                    <div className="space-y-2 text-sm text-[#7D6E66]">
                      <p>
                        <span className="font-semibold text-[#315F5B]">
                          Date:
                        </span>{" "}
                        {new Date(
                          reservation.reservationDate,
                        ).toLocaleDateString()}
                      </p>

                      <p>
                        <span className="font-semibold text-[#315F5B]">
                          Time:
                        </span>{" "}
                        {reservation.startTime}
                        {reservation.endTime ? ` - ${reservation.endTime}` : ""}
                      </p>

                      <p>
                        <span className="font-semibold text-[#315F5B]">
                          Guests:
                        </span>{" "}
                        {reservation.guestCount}
                      </p>

                      <p>
                        <span className="font-semibold text-[#315F5B]">
                          Table:
                        </span>{" "}
                        {reservation.tables
                          ?.map((item) => item.table.name)
                          .join(", ") || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
