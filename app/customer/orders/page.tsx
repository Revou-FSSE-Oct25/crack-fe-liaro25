"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Order } from "@/types";

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

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

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
                My Orders
              </h1>

              <p className="mt-2 text-sm text-[#6f6258]">
                View your reservation orders and selected afternoon tea menus.
              </p>
            </div>

            <Link
              href="/customer/reservations/new"
              className="rounded-xl bg-[#2f241d] px-5 py-3 text-center text-sm font-medium text-white transition hover:bg-[#4a3a30]"
            >
              New Reservation
            </Link>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Loading orders...
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              No orders found.
            </div>
          )}

          {!loading && orders.length > 0 && (
            <div className="space-y-5">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[#ead8c5] bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-semibold text-[#2f241d]">
                          {order.reservation?.reservationCode}
                        </h2>

                        <span className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs font-medium capitalize text-[#2f241d]">
                          {order.status}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-sm text-[#6f6258]">
                        <p>
                          Reservation Date:{" "}
                          {order.reservation?.reservationDate
                            ? formatDate(order.reservation.reservationDate)
                            : "-"}
                        </p>

                        <p>Time: {order.reservation?.startTime || "-"}</p>

                        <p>Guests: {order.reservation?.guestCount || "-"}</p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#f8f3ec] px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-[#b8895b]">
                        Total Amount
                      </p>

                      <p className="mt-2 text-2xl font-bold text-[#2f241d]">
                        Rp {Number(order.totalAmount).toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mt-6 border-t border-[#ead8c5] pt-5">
                      <h3 className="text-lg font-semibold text-[#2f241d]">
                        Ordered Items
                      </h3>

                      <div className="mt-4 space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-xl bg-[#f8f3ec] px-4 py-3"
                          >
                            <div>
                              <p className="font-medium text-[#2f241d]">
                                {item.menuItem?.name || "Menu Item"}
                              </p>

                              <p className="mt-1 text-sm text-[#6f6258]">
                                Qty: {item.quantity}
                              </p>
                            </div>

                            <p className="font-semibold text-[#b8895b]">
                              Rp {Number(item.price).toLocaleString("id-ID")}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
