"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";

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

function ReservationSuccessContent() {
  const searchParams = useSearchParams();

  const fullCode = searchParams.get("code") || "";
  const displayCode = fullCode.replace("WHISK-", "");

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
              Reservation Confirmed
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-4xl text-[#E8B7C8]`}
            >
              your table is being prepared
            </p>

            <p className="mt-6 max-w-xl text-base leading-8 text-[#7D6E66]">
              Thank you for reserving your Whisk & Wonder afternoon tea
              experience. Please keep your reservation code for confirmation.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <StatusBadge status="reservation created" />
              <StatusBadge status="confirmation ready" />
              <StatusBadge status="see you soon" />
            </div>
          </Card>

          <Card className="mx-auto w-full max-w-2xl bg-white/75 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#DDF2E3] text-4xl">
              ✦
            </div>

            <p
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
            >
              Reservation Success
            </p>

            <h2
              className={`${cinzel.className} mt-3 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
            >
              Reservation Confirmed
            </h2>

            <p
              className={`${greatVibes.className} mt-2 text-3xl text-[#E8B7C8]`}
            >
              warmth and wonder await
            </p>

            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#7D6E66]">
              Your reservation has been created successfully.
            </p>

            <div className="mt-8 rounded-4xl border border-[#EBDDD1] bg-[#FFF8F1]/85 p-6">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#C8A86A]`}
              >
                Reservation Code
              </p>

              {fullCode ? (
                <div
                  className={`${cinzel.className} mt-3 flex flex-wrap items-center justify-center text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                >
                  <span className="text-[#B3A39A]">WHISK-</span>
                  <span>{displayCode}</span>
                </div>
              ) : (
                <p className="mt-3 text-sm font-semibold text-[#9B2C2C]">
                  Reservation code not found.
                </p>
              )}
            </div>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/reservation/check">
                <Button className="w-full sm:w-auto">Check Reservation</Button>
              </Link>

              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">
                  Back Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}

export default function ReservationSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className={`${inter.className} min-h-screen bg-[#FFF8F1] p-8`}>
          Loading...
        </main>
      }
    >
      <ReservationSuccessContent />
    </Suspense>
  );
}
