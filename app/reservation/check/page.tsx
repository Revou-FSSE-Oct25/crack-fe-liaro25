"use client";

import { useState } from "react";

import { getReservationByCode } from "@/lib/reservation";
import { Reservation } from "@/types";

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
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-4xl font-bold mb-4">Check Reservation</h1>

        <p className="text-gray-600 mb-8">
          Enter your reservation code to view your booking details.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Reservation Code</label>

            <div className="flex">
              <span className="inline-flex items-center px-4 border border-r-0 rounded-l-lg bg-background text-gray-500">
                WHISK-
              </span>

              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border rounded-r-lg px-4 py-3"
                placeholder="1778400152103"
              />
            </div>
          </div>

          <button
            onClick={handleCheckReservation}
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-xl"
          >
            {loading ? "Checking..." : "Check Reservation"}
          </button>

          {error && <p className="text-red-500">{error}</p>}

          {reservation && (
            <div className="mt-8 border rounded-2xl p-6 bg-background">
              <h2 className="text-2xl font-bold mb-4">Reservation Details</h2>

              <div className="space-y-2">
                <p>
                  <strong>Code:</strong> {reservation.reservationCode}
                </p>

                <p>
                  <strong>Guest:</strong> {reservation.guestName}
                </p>

                <p>
                  <strong>Email:</strong> {reservation.guestEmail}
                </p>

                <p>
                  <strong>Phone:</strong> {reservation.guestPhone}
                </p>

                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(reservation.reservationDate).toLocaleDateString()}
                </p>

                <p>
                  <strong>Time:</strong> {reservation.startTime} -{" "}
                  {reservation.endTime}
                </p>

                <p>
                  <strong>Guests:</strong> {reservation.guestCount}
                </p>

                <p>
                  <strong>Status:</strong> {reservation.status}
                </p>

                <p>
                  <strong>Table:</strong>{" "}
                  {reservation.tables
                    ?.map((item) => item.table.name)
                    .join(", ") || "-"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
