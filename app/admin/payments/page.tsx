"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Payment } from "@/types";

const API_URL = "https://whiskandwonder.up.railway.app";

function formatCurrency(value: string | number) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "paid"
      ? "bg-green-100 text-green-700"
      : status === "failed"
        ? "bg-red-100 text-red-700"
        : status === "refunded"
          ? "bg-blue-100 text-blue-700"
          : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${color}`}
    >
      {status}
    </span>
  );
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchPayments() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/payments`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch payment history");
      }

      const data = await response.json();
      setPayments(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Failed to fetch payment history",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPayments();
  }, []);

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

            <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">
              Payment History
            </h1>

            <p className="mt-2 text-sm text-[#6f6258]">
              View all recorded customer payment transactions. Payment updates
              are managed from the Admin Orders page.
            </p>

            <Link
              href="/admin/orders"
              className="mt-5 inline-flex rounded-xl bg-[#b8895b] px-4 py-2 text-sm font-semibold text-white hover:bg-[#9d744a]"
            >
              Manage Orders & Payments
            </Link>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-[#6f6258]">Total Payments</p>
              <p className="mt-1 text-3xl font-bold text-[#2f241d]">
                {payments.length}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-[#6f6258]">Paid Payments</p>
              <p className="mt-1 text-3xl font-bold text-green-700">
                {payments.filter((payment) => payment.status === "paid").length}
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-[#6f6258]">Total Revenue</p>
              <p className="mt-1 text-3xl font-bold text-[#2f241d]">
                {formatCurrency(
                  payments
                    .filter((payment) => payment.status === "paid")
                    .reduce(
                      (total, payment) => total + Number(payment.amount || 0),
                      0,
                    ),
                )}
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-2xl bg-red-100 px-5 py-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Loading payment history...
            </div>
          )}

          {!loading && payments.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center text-[#6f6258] shadow-sm">
              No payment history found.
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
                      <td className="px-4 py-4 text-sm font-medium text-[#2f241d]">
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

                      <td className="px-4 py-4 text-sm capitalize text-[#2f241d]">
                        {payment.paymentType?.replace("_", " ") || "-"}
                      </td>

                      <td className="px-4 py-4 text-sm capitalize text-[#2f241d]">
                        {payment.paymentMethod?.replace("_", " ") || "-"}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {formatDate(payment.createdAt)}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <StatusBadge status={payment.status} />
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
