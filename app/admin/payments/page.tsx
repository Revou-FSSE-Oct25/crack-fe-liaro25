"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import { Payment } from "@/types";

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

const paymentStatuses = [
  "all",
  "pending",
  "unpaid",
  "paid",
  "failed",
  "refunded",
];

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

function getMonthValue(dateString: string) {
  return new Date(dateString).toISOString().slice(0, 7);
}

function formatMonthLabel(monthValue: string) {
  if (monthValue === "all") return "All months";

  return new Date(`${monthValue}-01`).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
  });
}

export default function AdminPaymentsPage() {
  const router = useRouter();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [monthFilter, setMonthFilter] = useState("all");

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

  const availableMonths = useMemo(() => {
    const months = Array.from(
      new Set(
        payments
          .filter((payment) => payment.createdAt)
          .map((payment) => getMonthValue(payment.createdAt)),
      ),
    ).sort((a, b) => b.localeCompare(a));

    return ["all", ...months];
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const keyword = search.toLowerCase();

    return payments.filter((payment) => {
      const matchesSearch =
        !keyword ||
        payment.id.toLowerCase().includes(keyword) ||
        payment.status?.toLowerCase().includes(keyword) ||
        payment.paymentType?.toLowerCase().includes(keyword) ||
        payment.paymentMethod?.toLowerCase().includes(keyword) ||
        payment.order?.reservation?.reservationCode
          ?.toLowerCase()
          .includes(keyword) ||
        payment.order?.reservation?.guestName
          ?.toLowerCase()
          .includes(keyword) ||
        payment.order?.reservation?.guestEmail?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || payment.status === statusFilter;

      const matchesMonth =
        monthFilter === "all" ||
        getMonthValue(payment.createdAt) === monthFilter;

      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [payments, search, statusFilter, monthFilter]);

  const summary = useMemo(() => {
    const paidPayments = filteredPayments.filter(
      (payment) => payment.status === "paid",
    );

    return {
      total: filteredPayments.length,
      paid: paidPayments.length,
      pending: filteredPayments.filter(
        (payment) =>
          payment.status === "pending" || payment.status === "unpaid",
      ).length,
      failed: filteredPayments.filter((payment) => payment.status === "failed")
        .length,
      revenue: paidPayments.reduce(
        (total, payment) => total + Number(payment.amount || 0),
        0,
      ),
    };
  }, [filteredPayments]);

  function handleDownloadPdf() {
    window.print();
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
          <div className="mb-5 flex justify-end print:hidden">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              ← Back to Admin
            </Button>
          </div>

          <Card className="mb-8 bg-white/65 print:hidden">
            <p
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
            >
              Whisk & Wonder Admin
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B] sm:text-5xl`}
            >
              Payment History
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
            >
              tracked with elegance and clarity
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
              View recorded customer payment transactions, monitor monthly
              revenue, and download filtered payment reports as PDF.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => router.push("/admin/orders")}
              >
                Manage Orders & Payments
              </Button>

              <Button variant="secondary" onClick={handleDownloadPdf}>
                Download PDF Report
              </Button>
            </div>
          </Card>

          <Card className="mb-8 bg-white/70 print:hidden">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_auto] lg:items-center">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search reservation, customer, email, method, or status..."
              />

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "all" ? "All payment status" : status}
                  </option>
                ))}
              </select>

              <select
                value={monthFilter}
                onChange={(event) => setMonthFilter(event.target.value)}
                className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
              >
                {availableMonths.map((month) => (
                  <option key={month} value={month}>
                    {formatMonthLabel(month)}
                  </option>
                ))}
              </select>

              <Button variant="outline" onClick={fetchPayments}>
                Refresh
              </Button>
            </div>
          </Card>

          {error && (
            <Card className="mb-4 bg-[#F8D7DA]/90 text-sm font-semibold text-[#9B2C2C]">
              {error}
            </Card>
          )}

          <div className="print-area">
            <Card className="mb-6 hidden bg-white p-8 print:block">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
              >
                Whisk & Wonder Payment Report
              </p>

              <h1
                className={`${cinzel.className} mt-3 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
              >
                Revenue & Payment Summary
              </h1>

              <p className="mt-3 text-sm text-[#7D6E66]">
                Period: {formatMonthLabel(monthFilter)} · Status:{" "}
                {statusFilter === "all" ? "All payment status" : statusFilter}
              </p>
            </Card>

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Card className="bg-[#DCEFF0]/75">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#315F5B]/70`}
                >
                  Total Payments
                </p>

                <p className="mt-3 text-4xl font-semibold text-[#315F5B]">
                  {summary.total}
                </p>
              </Card>

              <Card className="bg-[#EAF6EF]/80">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#315F5B]/70`}
                >
                  Paid
                </p>

                <p className="mt-3 text-4xl font-semibold text-[#2F6B45]">
                  {summary.paid}
                </p>
              </Card>

              <Card className="bg-[#FFF3C4]/75">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#8A6A24]/70`}
                >
                  Pending
                </p>

                <p className="mt-3 text-4xl font-semibold text-[#9A6A00]">
                  {summary.pending}
                </p>
              </Card>

              <Card className="bg-[#F8D7DA]/80">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#9B2C2C]/70`}
                >
                  Failed
                </p>

                <p className="mt-3 text-4xl font-semibold text-[#9B2C2C]">
                  {summary.failed}
                </p>
              </Card>

              <Card className="bg-[#FBE1EA]/75">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#9B4F68]/70`}
                >
                  Revenue
                </p>

                <p className="mt-3 text-2xl font-semibold text-[#9B4F68] lg:text-3xl">
                  {formatCurrency(summary.revenue)}
                </p>
              </Card>
            </div>

            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                >
                  Payment Records
                </p>

                <h2
                  className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                >
                  Customer Payment Transactions
                </h2>

                <p className="mt-2 text-sm text-[#7D6E66]">
                  Showing {formatMonthLabel(monthFilter)}
                </p>
              </div>

              <StatusBadge status={`${filteredPayments.length} records`} />
            </div>

            {loading && <Card>Loading payment history...</Card>}

            {!loading && filteredPayments.length === 0 && (
              <Card className="text-center text-[#7D6E66]">
                No payment history found.
              </Card>
            )}

            {!loading && filteredPayments.length > 0 && (
              <Card className="overflow-hidden bg-white/75 p-0">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead className="bg-[#FFF8F1]/90">
                      <tr>
                        {[
                          "Reservation",
                          "Customer",
                          "Amount",
                          "Payment Type",
                          "Method",
                          "Date",
                          "Status",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className={`${cinzel.className} px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-[#315F5B]`}
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>

                    <tbody>
                      {filteredPayments.map((payment) => (
                        <tr
                          key={payment.id}
                          className="border-t border-[#EBDDD1]/80 transition hover:bg-[#FFF8F1]/70"
                        >
                          <td className="px-5 py-5 text-sm font-semibold text-[#315F5B]">
                            {payment.order?.reservation?.reservationCode || "-"}
                          </td>

                          <td className="px-5 py-5 text-sm text-[#7D6E66]">
                            <div className="font-semibold text-[#315F5B]">
                              {payment.order?.reservation?.guestName || "-"}
                            </div>

                            <div className="mt-1 text-xs text-[#B3A39A]">
                              {payment.order?.reservation?.guestEmail || ""}
                            </div>
                          </td>

                          <td className="px-5 py-5 text-sm font-semibold text-[#C8A86A]">
                            {formatCurrency(payment.amount)}
                          </td>

                          <td className="px-5 py-5 text-sm capitalize text-[#7D6E66]">
                            {payment.paymentType?.replace("_", " ") || "-"}
                          </td>

                          <td className="px-5 py-5 text-sm capitalize text-[#7D6E66]">
                            {payment.paymentMethod?.replace("_", " ") || "-"}
                          </td>

                          <td className="px-5 py-5 text-sm text-[#7D6E66]">
                            {formatDate(payment.createdAt)}
                          </td>

                          <td className="px-5 py-5 text-sm">
                            <StatusBadge status={payment.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}
          </div>
        </section>

        <div className="relative z-10 mt-12 print:hidden">
          <Footer />
        </div>
      </main>
    </ProtectedRoute>
  );
}
