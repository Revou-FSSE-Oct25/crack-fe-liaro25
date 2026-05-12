"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Order } from "@/types";

type OrderStatus = "pending" | "confirmed" | "cancelled" | "completed";
type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";

const API_URL = "https://whiskandwonder.up.railway.app";

const orderStatuses: OrderStatus[] = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
];

const paymentStatuses: PaymentStatus[] = [
  "unpaid",
  "paid",
  "failed",
  "refunded",
];

function formatCurrency(value?: string | number) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function getPayment(order: Order) {
  return order.payments?.[0] || null;
}

function Badge({ value }: { value: string }) {
  const color =
    value === "paid" || value === "confirmed" || value === "completed"
      ? "bg-green-100 text-green-700"
      : value === "failed" || value === "cancelled"
        ? "bg-red-100 text-red-700"
        : value === "refunded"
          ? "bg-blue-100 text-blue-700"
          : "bg-yellow-100 text-yellow-700";

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${color}`}
    >
      {value}
    </span>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function fetchOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/orders`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch orders",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function updateOrderStatus(orderId: string, status: OrderStatus) {
    try {
      setActionLoading(orderId);
      setMessage("");
      setError("");

      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      setMessage("Order status updated successfully.");
      await fetchOrders();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update order",
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function createPayment(order: Order) {
    try {
      setActionLoading(order.id);
      setMessage("");
      setError("");

      const response = await fetch(`${API_URL}/payments`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: Number(order.totalAmount),
          paymentType: "full_payment",
          paymentMethod: "bank_transfer",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      setMessage("Payment created successfully.");
      await fetchOrders();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to create payment",
      );
    } finally {
      setActionLoading(null);
    }
  }

  async function updatePaymentStatus(paymentId: string, status: PaymentStatus) {
    try {
      setActionLoading(paymentId);
      setMessage("");
      setError("");

      const response = await fetch(`${API_URL}/payments/${paymentId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }

      setMessage("Payment status updated successfully.");
      await fetchOrders();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to update payment",
      );
    } finally {
      setActionLoading(null);
    }
  }

  const totalOrders = useMemo(() => orders.length, [orders]);

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
              Order & Payment Management
            </h1>

            <p className="mt-2 text-sm text-[#6f6258]">
              Manage customer orders, payment creation, and payment status.
            </p>
          </div>

          <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[#6f6258]">Total Orders</p>
            <p className="mt-1 text-3xl font-bold text-[#2f241d]">
              {totalOrders}
            </p>
          </div>

          {message && (
            <div className="mb-4 rounded-2xl bg-green-100 px-5 py-4 text-sm font-semibold text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-2xl bg-red-100 px-5 py-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Loading orders...
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className="rounded-2xl bg-white p-6 text-center text-[#6f6258] shadow-sm">
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
                      Order Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Payment Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-[#2f241d]">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map((order) => {
                    const payment = getPayment(order);

                    return (
                      <tr key={order.id} className="border-t border-[#f1e5d8]">
                        <td className="px-4 py-4 text-sm font-medium text-[#2f241d]">
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
                          <div className="space-y-1">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item) => (
                                <div key={item.id}>
                                  {item.menuItem?.name || "Menu item"} x{" "}
                                  {item.quantity}
                                </div>
                              ))
                            ) : (
                              <span>-</span>
                            )}
                          </div>
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

                        <td className="px-4 py-4 text-sm">
                          <div className="space-y-2">
                            <Badge value={order.status} />

                            <select
                              value={order.status}
                              disabled={actionLoading === order.id}
                              onChange={(event) =>
                                updateOrderStatus(
                                  order.id,
                                  event.target.value as OrderStatus,
                                )
                              }
                              className="block rounded-xl border border-[#e5d6c6] bg-white px-3 py-2 text-xs text-[#2f241d] disabled:opacity-50"
                            >
                              {orderStatuses.map((status) => (
                                <option key={status} value={status}>
                                  {status}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>

                        <td className="px-4 py-4 text-sm">
                          {payment ? (
                            <div className="space-y-2">
                              <Badge value={payment.status} />

                              <select
                                value={payment.status}
                                disabled={actionLoading === payment.id}
                                onChange={(event) =>
                                  updatePaymentStatus(
                                    payment.id,
                                    event.target.value as PaymentStatus,
                                  )
                                }
                                className="block rounded-xl border border-[#e5d6c6] bg-white px-3 py-2 text-xs text-[#2f241d] disabled:opacity-50"
                              >
                                {paymentStatuses.map((status) => (
                                  <option key={status} value={status}>
                                    {status}
                                  </option>
                                ))}
                              </select>
                            </div>
                          ) : (
                            <Badge value="unpaid" />
                          )}
                        </td>

                        <td className="px-4 py-4 text-sm">
                          {!payment ? (
                            <button
                              disabled={actionLoading === order.id}
                              onClick={() => createPayment(order)}
                              className="rounded-xl bg-[#b8895b] px-4 py-2 text-xs font-semibold text-white hover:bg-[#9d744a] disabled:opacity-50"
                            >
                              {actionLoading === order.id
                                ? "Creating..."
                                : "Create Payment"}
                            </button>
                          ) : (
                            <span className="text-xs text-[#6f6258]">
                              Payment exists
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
