"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import { createReservation } from "@/lib/reservation";
import { CreateReservationRequest } from "@/types";

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
        `/reservation/success?code=${encodeURIComponent(
          response.reservationCode,
        )}`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create reservation",
      );
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
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="hidden bg-white/65 lg:block">
            <p
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
            >
              Whisk & Wonder
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-5xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B]`}
            >
              Create Reservation
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-4xl text-[#E8B7C8]`}
            >
              reserve your seaside afternoon tea
            </p>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#7D6E66]">
              Book your afternoon tea experience with elegant tea sets, refined
              pastries, and a serene ocean-inspired atmosphere.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <StatusBadge status="open 11:00–20:00" />
              <StatusBadge status="reservation required" />
              <StatusBadge status="seaside tea house" />
            </div>

            <div className="mt-8">
              <Button variant="outline" onClick={() => router.push("/")}>
                ← Back to Home
              </Button>
            </div>
          </Card>

          <Card className="mx-auto w-full max-w-2xl bg-white/75">
            <div className="text-center">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
              >
                Reservation
              </p>

              <h2
                className={`${cinzel.className} mt-3 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
              >
                Book Your Table
              </h2>

              <p
                className={`${greatVibes.className} mt-2 text-3xl text-[#E8B7C8]`}
              >
                warmth and wonder
              </p>

              <p className="mt-3 text-sm leading-7 text-[#7D6E66]">
                Reservations are available from 11:00 AM to 6:00 PM.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Guest Name"
                  placeholder="Your name"
                  {...register("guestName", { required: true })}
                />

                <Input
                  label="Email"
                  type="email"
                  placeholder="your@email.com"
                  {...register("guestEmail", { required: true })}
                />

                <Input
                  label="Phone"
                  placeholder="08012345678"
                  {...register("guestPhone", { required: true })}
                />

                <Input
                  label="Reservation Date"
                  type="date"
                  {...register("reservationDate", { required: true })}
                />

                <div>
                  <label
                    className={`${cinzel.className} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#C8A86A]`}
                  >
                    Start Time
                  </label>

                  <select
                    {...register("startTime", { required: true })}
                    className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
                  >
                    <option value="">Select time</option>
                    {timeOptions.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Number of Guests"
                  type="number"
                  min="1"
                  placeholder="2"
                  {...register("guestCount", { required: true })}
                />
              </div>

              {error && (
                <Card className="bg-[#F8D7DA]/90 p-4 text-sm font-semibold text-[#9B2C2C]">
                  {error}
                </Card>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3"
              >
                {isSubmitting
                  ? "Creating reservation..."
                  : "Create Reservation"}
              </Button>
            </form>
          </Card>
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
