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

import { Order } from "@/types";

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

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/my`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch orders");
        }

        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch customer orders:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const keyword = search.toLowerCase();

      return (
        order.reservation?.reservationCode?.toLowerCase().includes(keyword) ||
        order.status?.toLowerCase().includes(keyword)
      );
    });
  }, [orders, search]);

  const totalSpent = useMemo(() => {
    return filteredOrders.reduce(
      (total, order) => total + Number(order.totalAmount || 0),
      0,
    );
  }, [filteredOrders]);

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

          <Card className="mb-8 overflow-hidden bg-white/65 p-0">
            <div className="grid gap-8 p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
              <div>
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
                >
                  Customer Orders
                </p>

                <h1
                  className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B] sm:text-5xl`}
                >
                  My Orders
                </h1>

                <p
                  className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
                >
                  afternoon tea selections
                </p>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
                  Review your reservation orders, selected afternoon tea menu
                  items, and total payment history.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/customer/reservations/new">
                    <Button variant="primary" className="px-6 py-3">
                      New Reservation
                    </Button>
                  </Link>

                  <Link href="/customer/reservations">
                    <Button variant="outline" className="px-6 py-3">
                      Reservation History
                    </Button>
                  </Link>
                </div>
              </div>

              <Card className="border-[#8FBFBE]/25 bg-[#DCEFF0]/70 shadow-teal-100/40">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#315F5B]/70`}
                >
                  Order Summary
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-sm text-[#7D6E66]">Total Orders</p>

                    <p className="mt-2 text-5xl font-semibold text-[#315F5B]">
                      {filteredOrders.length}
                    </p>
                  </div>

                  <div className="h-px bg-white/70" />

                  <div>
                    <p className="text-sm text-[#7D6E66]">Total Spending</p>

                    <p className="mt-2 text-2xl font-semibold text-[#315F5B]">
                      Rp {totalSpent.toLocaleString("id-ID")}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status="customer orders" />
                    <StatusBadge status="tea selections" />
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          <Card className="mb-8 bg-white/75">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                >
                  Order Search
                </p>

                <h2
                  className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                >
                  Search Orders
                </h2>

                <p className="mt-2 text-sm leading-7 text-[#7D6E66]">
                  Search by reservation code or order status.
                </p>
              </div>

              <div className="w-full lg:max-w-md">
                <Input
                  placeholder="Search reservation code or status..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
            </div>
          </Card>

          {loading && (
            <Card className="bg-white/75">
              <p className="text-sm text-[#7D6E66]">Loading orders...</p>
            </Card>
          )}

          {!loading && filteredOrders.length === 0 && (
            <Card className="bg-white/75 text-center">
              <h3
                className={`${cinzel.className} text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
              >
                No Orders Found
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#7D6E66]">
                You do not have any orders yet.
              </p>

              <div className="mt-6">
                <Link href="/customer/reservations/new">
                  <Button>Create Reservation</Button>
                </Link>
              </div>
            </Card>
          )}

          {!loading && filteredOrders.length > 0 && (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden bg-white/75">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2
                          className={`${cinzel.className} text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                        >
                          {order.reservation?.reservationCode}
                        </h2>

                        <StatusBadge status={order.status} />
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                          <p
                            className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                          >
                            Reservation Date
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                            {order.reservation?.reservationDate
                              ? formatDate(order.reservation.reservationDate)
                              : "-"}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                          <p
                            className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                          >
                            Time
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                            {order.reservation?.startTime || "-"}
                          </p>
                        </div>

                        <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                          <p
                            className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                          >
                            Guests
                          </p>

                          <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                            {order.reservation?.guestCount || "-"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Card className="min-w-60 border-[#8FBFBE]/20 bg-[#DCEFF0]/70">
                      <p
                        className={`${cinzel.className} text-xs uppercase tracking-wider text-[#315F5B]/70`}
                      >
                        Total Amount
                      </p>

                      <p className="mt-3 text-3xl font-semibold text-[#315F5B]">
                        Rp {Number(order.totalAmount).toLocaleString("id-ID")}
                      </p>
                    </Card>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mt-8 border-t border-[#EBDDD1] pt-8">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p
                            className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                          >
                            Ordered Menus
                          </p>

                          <h3
                            className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                          >
                            Afternoon Tea Selection
                          </h3>
                        </div>

                        <StatusBadge status={`${order.items.length} items`} />
                      </div>

                      <div className="mt-6 grid gap-4">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex flex-col gap-4 rounded-3xl border border-[#EBDDD1] bg-[#FFF8F1]/85 p-5 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div>
                              <h4 className="text-lg font-semibold text-[#315F5B]">
                                {item.menuItem?.name ||
                                  item.menuPackage?.name ||
                                  "Menu Item"}
                              </h4>

                              <p className="mt-2 text-sm text-[#7D6E66]">
                                Quantity: {item.quantity}
                              </p>
                            </div>

                            <div className="text-left sm:text-right">
                              <p
                                className={`${cinzel.className} text-xs uppercase tracking-wider text-[#C8A86A]`}
                              >
                                Price
                              </p>

                              <p className="mt-2 text-lg font-semibold text-[#315F5B]">
                                Rp {Number(item.price).toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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
