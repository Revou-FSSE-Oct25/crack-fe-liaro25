"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getToken } from "@/lib/auth";
import { Payment } from "@/types";

function formatCurrency(value: string) {
  return `Rp ${Number(value).toLocaleString("id-ID")}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      const token = getToken();

      const response = await fetch(
        "https://whiskandwonder.up.railway.app/payments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      setPayments(data);
    } catch (error) {
      console.error("Failed to fetch payments:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-6 py-10">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm font-medium text-[#b8895b] hover:underline"
            >
              ← Back to Dashboard
            </Link>

            <p className="mt-4 text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">Payments</h1>

            <p className="mt-2 text-sm text-[#6f6258]">
              View payment transactions and payment status.
            </p>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Loading payments...
            </div>
          )}

          {!loading && payments.length === 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              No payments found.
            </div>
          )}

          {!loading && payments.length > 0 && (
            <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
              <table className="min-w-full">
                <thead className="bg-[#f3ebe2]">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Reservation
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Customer
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Amount
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Payment Type
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Method
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Date
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-t border-[#f1e5d8]">
                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {payment.order?.reservation?.reservationCode || "-"}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        <div className="font-medium">
                          {payment.order?.reservation?.guestName || "-"}
                        </div>

                        <div className="text-xs text-gray-500">
                          {payment.order?.reservation?.guestEmail || ""}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-[#2f241d]">
                        {formatCurrency(payment.amount)}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d] capitalize">
                        {payment.paymentType.replace("_", " ")}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d] capitalize">
                        {payment.paymentMethod.replace("_", " ")}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {formatDate(payment.createdAt)}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <span className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs font-medium capitalize text-[#2f241d]">
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
