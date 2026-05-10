"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { createReservation } from "@/lib/reservation";
import { CreateReservationRequest } from "@/types";

export default function ReservationPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<CreateReservationRequest>();

  async function onSubmit(data: CreateReservationRequest) {
    try {
      setError("");

      const payload: CreateReservationRequest = {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        reservationDate: data.reservationDate,
        startTime: data.startTime,
        guestCount: Number(data.guestCount),
      };

      const response = await createReservation(payload);

      router.push(
        `/reservation/success?code=${encodeURIComponent(response.reservationCode)}`,
      );
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to create reservation");
      }
    }
  }

  return (
    <main className="min-h-screen px-6 py-16">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-4xl font-bold mb-3">Create Reservation</h1>

        <p className="text-gray-600 mb-8">
          Book your afternoon tea experience. Reservations are available from
          11:00 AM to 6:00 PM.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block mb-2 font-medium">Guest Name</label>
            <input
              {...register("guestName", { required: true })}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              {...register("guestEmail", { required: true })}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Phone</label>
            <input
              {...register("guestPhone", { required: true })}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="08012345678"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Reservation Date</label>
            <input
              type="date"
              {...register("reservationDate", { required: true })}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Start Time</label>
            <select
              {...register("startTime", { required: true })}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="">Select time</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Number of Guests</label>
            <input
              type="number"
              min="1"
              {...register("guestCount", { required: true })}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="2"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-4 rounded-xl"
          >
            {isSubmitting ? "Creating reservation..." : "Create Reservation"}
          </button>
        </form>
      </div>
    </main>
  );
}
