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
import { Order } from "@/types";

type OrderStatus = "pending" | "confirmed" | "cancelled" | "completed";
type PaymentStatus = "unpaid" | "paid" | "failed" | "refunded";

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

function formatDate(dateString?: string) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function getPayment(order: Order) {
  return order.payments?.[0] || null;
}

export default function AdminOrdersPage() {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

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

  const filteredOrders = useMemo(() => {
    const keyword = search.toLowerCase();

    return orders.filter((order) => {
      const payment = getPayment(order);

      const matchesSearch =
        !keyword ||
        order.id.toLowerCase().includes(keyword) ||
        order.status?.toLowerCase().includes(keyword) ||
        order.reservation?.reservationCode?.toLowerCase().includes(keyword) ||
        order.reservation?.guestName?.toLowerCase().includes(keyword) ||
        order.reservation?.guestEmail?.toLowerCase().includes(keyword);

      const matchesOrderStatus =
        orderStatusFilter === "all" || order.status === orderStatusFilter;

      const matchesPaymentStatus =
        paymentStatusFilter === "all" ||
        payment?.status === paymentStatusFilter ||
        (!payment && paymentStatusFilter === "unpaid");

      return matchesSearch && matchesOrderStatus && matchesPaymentStatus;
    });
  }, [orders, search, orderStatusFilter, paymentStatusFilter]);

  const summary = useMemo(() => {
    return {
      total: filteredOrders.length,
      pending: filteredOrders.filter((order) => order.status === "pending")
        .length,
      completed: filteredOrders.filter((order) => order.status === "completed")
        .length,
      paid: filteredOrders.filter(
        (order) => getPayment(order)?.status === "paid",
      ).length,
    };
  }, [filteredOrders]);

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
          <div className="mb-5 flex justify-end">
            <Button variant="outline" onClick={() => router.push("/admin")}>
              ← Back to Admin
            </Button>
          </div>

          <Card className="mb-8 bg-white/65">
            <p
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
            >
              Whisk & Wonder Admin
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B] sm:text-5xl`}
            >
              Order Management
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
            >
              served with care and clarity
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
              Manage customer orders, create payments, and update payment
              progress from one calm and organized admin workspace.
            </p>
          </Card>

          <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-[#DCEFF0]/75">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#315F5B]/70`}
              >
                Total Orders
              </p>
              <p className="mt-3 text-4xl font-semibold text-[#315F5B]">
                {summary.total}
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

            <Card className="bg-[#EAF6EF]/80">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#315F5B]/70`}
              >
                Completed
              </p>
              <p className="mt-3 text-4xl font-semibold text-[#2F6B45]">
                {summary.completed}
              </p>
            </Card>

            <Card className="bg-[#FBE1EA]/75">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-wider text-[#9B4F68]/70`}
              >
                Paid
              </p>
              <p className="mt-3 text-4xl font-semibold text-[#9B4F68]">
                {summary.paid}
              </p>
            </Card>
          </div>

          <Card className="mb-8 bg-white/70">
            <div className="grid gap-4 lg:grid-cols-3">
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search order, guest, email, or reservation code..."
              />

              <select
                value={orderStatusFilter}
                onChange={(event) => setOrderStatusFilter(event.target.value)}
                className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
              >
                <option value="all">All order status</option>
                {orderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <select
                value={paymentStatusFilter}
                onChange={(event) => setPaymentStatusFilter(event.target.value)}
                className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
              >
                <option value="all">All payment status</option>
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </Card>

          {message && (
            <Card className="mb-4 bg-[#DDF2E3]/90 text-sm font-semibold text-[#2F6B45]">
              {message}
            </Card>
          )}

          {error && (
            <Card className="mb-4 bg-[#F8D7DA]/90 text-sm font-semibold text-[#9B2C2C]">
              {error}
            </Card>
          )}

          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
              >
                Current Orders
              </p>

              <h2
                className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
              >
                Guest Order & Payment Flow
              </h2>
            </div>

            <StatusBadge status={`${filteredOrders.length} orders`} />
          </div>

          {loading && <Card>Loading orders...</Card>}

          {!loading && filteredOrders.length === 0 && (
            <Card className="text-center text-[#7D6E66]">No orders found.</Card>
          )}

          {!loading && filteredOrders.length > 0 && (
            <div className="space-y-5">
              {filteredOrders.map((order) => {
                const payment = getPayment(order);

                return (
                  <Card key={order.id} className="bg-white/75">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div>
                        <p
                          className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                        >
                          Order
                        </p>

                        <h3
                          className={`${cinzel.className} mt-2 text-xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                        >
                          {order.reservation?.reservationCode || order.id}
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-[#7D6E66]">
                          {order.reservation?.guestName || "Guest name not set"}
                          <br />
                          {order.reservation?.guestEmail || "No email"}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <StatusBadge status={order.status} />
                        <StatusBadge status={payment?.status || "unpaid"} />
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
                      <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                        <p
                          className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                        >
                          Total Amount
                        </p>
                        <p className="mt-2 font-semibold text-[#315F5B]">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                        <p
                          className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                        >
                          Created
                        </p>
                        <p className="mt-2 font-semibold text-[#315F5B]">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                        <p
                          className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                        >
                          Payment Method
                        </p>
                        <p className="mt-2 font-semibold capitalize text-[#315F5B]">
                          {payment?.paymentMethod?.replace("_", " ") || "-"}
                        </p>
                      </div>

                      <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                        <p
                          className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                        >
                          Payment Type
                        </p>
                        <p className="mt-2 font-semibold capitalize text-[#315F5B]">
                          {payment?.paymentType?.replace("_", " ") || "-"}
                        </p>
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="mt-6 rounded-3xl bg-[#FFF8F1]/80 p-4">
                        <p
                          className={`${cinzel.className} mb-3 text-xs font-semibold uppercase tracking-wider text-[#C8A86A]`}
                        >
                          Order Items
                        </p>

                        <div className="space-y-2 text-sm text-[#7D6E66]">
                          {order.items.map((item) => (
                            <div
                              key={item.id}
                              className="flex flex-col gap-1 border-b border-[#EBDDD1] pb-2 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                            >
                              <span>
                                {item.menuItem?.name ||
                                  item.menuPackage?.name ||
                                  "Menu item"}
                              </span>

                              <span className="font-semibold text-[#315F5B]">
                                Qty {item.quantity} ·{" "}
                                {formatCurrency(
                                  Number(
                                    item.menuItem?.price ||
                                      item.menuPackage?.price ||
                                      0,
                                  ) * Number(item.quantity || 0),
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 grid gap-3 border-t border-[#EBDDD1] pt-5 lg:grid-cols-[1fr_1fr_auto] lg:items-center">
                      <select
                        value={order.status}
                        onChange={(event) =>
                          updateOrderStatus(
                            order.id,
                            event.target.value as OrderStatus,
                          )
                        }
                        disabled={actionLoading === order.id}
                        className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none"
                      >
                        {orderStatuses.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>

                      {payment ? (
                        <select
                          value={payment.status}
                          onChange={(event) =>
                            updatePaymentStatus(
                              payment.id,
                              event.target.value as PaymentStatus,
                            )
                          }
                          disabled={actionLoading === payment.id}
                          className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none"
                        >
                          {paymentStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Button
                          variant="secondary"
                          onClick={() => createPayment(order)}
                          disabled={actionLoading === order.id}
                        >
                          {actionLoading === order.id
                            ? "Creating..."
                            : "Create Payment"}
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => fetchOrders()}
                        disabled={Boolean(actionLoading)}
                      >
                        Refresh
                      </Button>
                    </div>
                  </Card>
                );
              })}
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
