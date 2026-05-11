"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Order } from "@/types";

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const response = await fetch(
        "https://whiskandwonder.up.railway.app/orders",
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      setOrders(data);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
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

            <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">Orders</h1>

            <p className="mt-2 text-sm text-[#6f6258]">
              View customer orders, items, and total amounts.
            </p>
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
                      Items
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Subtotal
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Tax
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Total
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
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t border-[#f1e5d8]">
                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {order.reservation?.reservationCode || "-"}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        <div className="font-medium">
                          {order.reservation?.guestName || "-"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.reservation?.guestEmail || ""}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {order.items && order.items.length > 0
                          ? order.items
                              .map(
                                (item) =>
                                  `${item.menuItem?.name || "Item"} x${item.quantity}`,
                              )
                              .join(", ")
                          : "-"}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {formatCurrency(order.subtotal)}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {formatCurrency(order.tax)}
                      </td>

                      <td className="px-4 py-4 text-sm font-semibold text-[#2f241d]">
                        {formatCurrency(order.totalAmount)}
                      </td>

                      <td className="px-4 py-4 text-sm text-[#2f241d]">
                        {formatDate(order.createdAt)}
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <span className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs font-medium capitalize text-[#2f241d]">
                          {order.status}
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
