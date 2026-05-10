"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ReservationSuccessPage() {
  const searchParams = useSearchParams();

  const fullCode = searchParams.get("code") || "";
  const displayCode = fullCode.replace("WHISK-", "");

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-md p-10 text-center">
        <div className="text-6xl mb-6">🎉</div>

        <h1 className="text-4xl font-bold mb-4">Reservation Confirmed</h1>

        <p className="text-gray-600 mb-8">
          Your reservation has been created successfully.
        </p>

        <div className="bg-background rounded-2xl p-6 mb-8">
          <p className="text-sm text-gray-500 mb-2">Reservation Code</p>

          {fullCode ? (
            <div className="text-3xl font-bold tracking-widest">
              <span className="text-gray-500">WHISK-</span>
              <span>{displayCode}</span>
            </div>
          ) : (
            <p className="text-red-500">Reservation code not found.</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/reservation/check"
            className="bg-black text-white px-6 py-3 rounded-xl"
          >
            Check Reservation
          </Link>

          <Link href="/" className="border border-black px-6 py-3 rounded-xl">
            Back Home
          </Link>
        </div>
      </div>
    </main>
  );
}
