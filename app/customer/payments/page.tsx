"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Payment } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whiskandwonder.up.railway.app";

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await fetch(`${API_BASE_URL}/payments/my`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch payments");
        }

        setPayments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch customer payments:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-6 py-10">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
                Customer
              </p>

              <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">
                Payment History
              </h1>

              <p className="mt-2 text-sm text-[#6f6258]">
                View your payment records and payment status.
              </p>
            </div>

            <Link
              href="/customer"
              className="rounded-xl border border-[#ead8c5] bg-white px-5 py-3 text-center text-sm font-medium text-[#2f241d] transition hover:bg-[#f8f3ec]"
            >
              Back to Dashboard
            </Link>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Loading payments...
            </div>
          )}

          {!loading && payments.length === 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              No payment history found.
            </div>
          )}

          {!loading && payments.length > 0 && (
            <div className="space-y-5">
              {payments.map((payment) => (
                <div
                  key={payment.id}
                  className="rounded-2xl border border-[#ead8c5] bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-xl font-semibold text-[#2f241d]">
                          {payment.order?.reservation?.reservationCode ||
                            "Payment"}
                        </h2>

                        <span className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs font-medium capitalize text-[#2f241d]">
                          {payment.status}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-sm text-[#6f6258]">
                        <p>
                          Date:{" "}
                          {payment.createdAt
                            ? formatDate(payment.createdAt)
                            : "-"}
                        </p>

                        <p className="capitalize">
                          Type: {payment.paymentType.replace("_", " ")}
                        </p>

                        <p className="capitalize">
                          Method: {payment.paymentMethod.replace("_", " ")}
                        </p>

                        <p>
                          Reservation Date:{" "}
                          {payment.order?.reservation?.reservationDate
                            ? formatDate(
                                payment.order.reservation.reservationDate,
                              )
                            : "-"}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#f8f3ec] px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#b8895b]">
                        Amount
                      </p>

                      <p className="mt-2 text-2xl font-bold text-[#2f241d]">
                        Rp {Number(payment.amount).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
