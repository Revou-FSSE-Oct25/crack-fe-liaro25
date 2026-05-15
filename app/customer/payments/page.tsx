"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";

import { Payment } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whiskandwonder.up.railway.app";

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

function formatDate(dateString?: string) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatCurrency(value?: string | number) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function formatText(value?: string) {
  if (!value) return "-";
  return value.replaceAll("_", " ");
}

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const keyword = search.toLowerCase();

      const reservationCode =
        payment.order?.reservation?.reservationCode?.toLowerCase() || "";

      const matchesSearch =
        reservationCode.includes(keyword) ||
        payment.status?.toLowerCase().includes(keyword) ||
        payment.paymentType?.toLowerCase().includes(keyword) ||
        payment.paymentMethod?.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ? true : payment.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [payments, search, statusFilter]);

  const totalPaid = useMemo(() => {
    return filteredPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0,
    );
  }, [filteredPayments]);

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <main
        className={`${inter.className} relative min-h-screen overflow-hidden bg-[#FFF8F1] px-6 py-10 text-[#4A3428] sm:px-10 lg:px-16`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/about-preview.webp')] bg-cover bg-center opacity-50"
          aria-hidden="true"
        />

        <section className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-5 flex justify-end">
            <Link href="/customer">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>

          <Card className="mb-8 bg-white/65">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#8FBFBE]`}
                >
                  Customer Transactions
                </p>

                <h1
                  className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase tracking-wider text-[#315F5B] sm:text-5xl`}
                >
                  Payment History
                </h1>

                <p
                  className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
                >
                  your transaction records
                </p>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
                  View your payment records, transaction status, payment method,
                  and reservation payment details.
                </p>
              </div>

              <Card className="min-w-65 border-[#8FBFBE]/25 bg-[#DCEFF0]/70 shadow-teal-100/40">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#315F5B]/70`}
                >
                  Total Payment
                </p>

                <p className="mt-4 text-3xl font-semibold text-[#315F5B]">
                  {formatCurrency(totalPaid)}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge status={`${filteredPayments.length} records`} />
                </div>
              </Card>
            </div>
          </Card>

          <Card className="mb-8 bg-white/70">
            <div className="grid gap-4 lg:grid-cols-3">
              <Input
                label="Search Payment"
                placeholder="Search reservation code, method, or status"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />

              <div>
                <label
                  className={`${cinzel.className} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#C8A86A]`}
                >
                  Payment Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1]/80 px-5 py-3 text-sm capitalize text-[#315F5B] outline-none transition focus:border-[#8FBFBE]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div className="flex items-end">
                <Card className="w-full bg-[#FFF8F1]/85 p-5">
                  <p
                    className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                  >
                    Payment Records
                  </p>

                  <h2
                    className={`${cinzel.className} mt-2 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                  >
                    {filteredPayments.length}
                  </h2>
                </Card>
              </div>
            </div>
          </Card>

          {loading && (
            <Card className="bg-white/75">
              <p className="text-sm text-[#7D6E66]">Loading payments...</p>
            </Card>
          )}

          {!loading && filteredPayments.length === 0 && (
            <Card className="bg-white/75 text-center">
              <h2
                className={`${cinzel.className} text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
              >
                No Payment History Found
              </h2>

              <p className="mt-4 text-sm text-[#7D6E66]">
                Your payment records will appear here once a transaction is
                created.
              </p>

              <div className="mt-6">
                <Link href="/customer/reservations/new">
                  <Button>Create Reservation</Button>
                </Link>
              </div>
            </Card>
          )}

          {!loading && filteredPayments.length > 0 && (
            <div className="grid gap-6">
              {filteredPayments.map((payment) => (
                <Card
                  key={payment.id}
                  className="bg-white/75 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <p
                          className={`${cinzel.className} text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                        >
                          {payment.order?.reservation?.reservationCode ||
                            "Payment"}
                        </p>

                        <StatusBadge status={payment.status} />
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                          <p
                            className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                          >
                            Payment Date
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                            {formatDate(payment.createdAt)}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                          <p
                            className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                          >
                            Payment Type
                          </p>

                          <p className="mt-2 text-sm font-semibold capitalize text-[#315F5B]">
                            {formatText(payment.paymentType)}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                          <p
                            className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                          >
                            Payment Method
                          </p>

                          <p className="mt-2 text-sm font-semibold capitalize text-[#315F5B]">
                            {formatText(payment.paymentMethod)}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                          <p
                            className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                          >
                            Reservation Date
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                            {payment.order?.reservation?.reservationDate
                              ? formatDate(
                                  payment.order.reservation.reservationDate,
                                )
                              : "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Card className="min-w-60 border-[#8FBFBE]/20 bg-[#DCEFF0]/70">
                      <p
                        className={`${cinzel.className} text-xs uppercase tracking-wider text-[#315F5B]/70`}
                      >
                        Amount
                      </p>

                      <p className="mt-3 text-3xl font-semibold text-[#315F5B]">
                        {formatCurrency(payment.amount)}
                      </p>
                    </Card>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <div className="relative z-10 mt-12">
          <Footer />
        </div>
      </main>
    </ProtectedRoute>
  );
}
