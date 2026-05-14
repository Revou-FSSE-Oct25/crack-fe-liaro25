"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";

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

const dashboardCards = [
  {
    title: "Reservations",
    description: "View and manage customer reservations.",
    href: "/admin/reservations",
    label: "Booking Flow",
    summaryKey: "reservationsConfirmed",
    status: "confirmed",
    suffix: "Confirmed",
  },
  {
    title: "Tables",
    description: "Manage restaurant table availability.",
    href: "/admin/tables",
    label: "Dining Setup",
    summaryKey: "tablesAvailable",
    status: "available",
    suffix: "Available",
  },
  {
    title: "Menus",
    description: "Manage menu items and categories.",
    href: "/admin/menus",
    label: "Tea Sets",
    summaryKey: "menuItems",
    status: "completed",
    suffix: "Items",
  },
  {
    title: "Orders",
    description: "View and manage customer orders.",
    href: "/admin/orders",
    label: "Guest Orders",
    summaryKey: "activeOrders",
    status: "confirmed",
    suffix: "Active",
  },
  {
    title: "Payments",
    description: "Track payment status and transactions.",
    href: "/admin/payments",
    label: "Transactions",
    summaryKey: "pendingPayments",
    status: "pending",
    suffix: "Pending",
  },
] as const;

type SummaryKey = (typeof dashboardCards)[number]["summaryKey"];

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<Record<SummaryKey, number>>({
    reservationsConfirmed: 0,
    tablesAvailable: 0,
    menuItems: 0,
    activeOrders: 0,
    pendingPayments: 0,
  });

  useEffect(() => {
    fetchDashboardSummary();
  }, []);

  async function fetchDashboardSummary() {
    try {
      const [
        reservationsResponse,
        tablesResponse,
        menusResponse,
        ordersResponse,
        paymentsResponse,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/reservations`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/tables`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/menus/items`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/orders`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/payments`, { credentials: "include" }),
      ]);

      const reservations = await reservationsResponse.json();
      const tables = await tablesResponse.json();
      const menus = await menusResponse.json();
      const orders = await ordersResponse.json();
      const payments = await paymentsResponse.json();

      const reservationList = Array.isArray(reservations) ? reservations : [];
      const tableList = Array.isArray(tables) ? tables : [];
      const menuList = Array.isArray(menus) ? menus : [];
      const orderList = Array.isArray(orders) ? orders : orders?.data || [];
      const paymentList = Array.isArray(payments)
        ? payments
        : payments?.data || [];

      setSummary({
        reservationsConfirmed: reservationList.filter(
          (item: { status?: string }) => item.status === "confirmed",
        ).length,

        tablesAvailable: tableList.filter(
          (item: { status?: string }) =>
            item.status === "available" || item.status === undefined,
        ).length,

        menuItems: menuList.length,

        activeOrders: orderList.filter(
          (item: { status?: string }) =>
            item.status === "pending" || item.status === "confirmed",
        ).length,

        pendingPayments: paymentList.filter(
          (item: { status?: string }) =>
            item.status === "pending" || item.status === "unpaid",
        ).length,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard summary:", error);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main
        className={`${inter.className} relative min-h-screen overflow-hidden bg-[#FFF8F1] px-6 py-10 text-[#4A3428] sm:px-10 lg:px-16`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/about-preview.webp')] bg-cover bg-center opacity-[0.5]"
          aria-hidden="true"
        />

        <section className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-5 flex justify-end">
            <Link href="/">
              <Button variant="outline">← Back to Home</Button>
            </Link>
          </div>

          <Card className="mb-8 overflow-hidden bg-white/65 p-0">
            <div className="grid gap-8 p-8 lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
              <div>
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
                >
                  Whisk & Wonder Admin
                </p>

                <h1
                  className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B] sm:text-5xl`}
                >
                  Admin Dashboard
                </h1>

                <p
                  className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
                >
                  organized with warmth and wonder
                </p>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
                  Manage reservations, tables, menus, orders, and payments from
                  one elegant control center for your seaside afternoon tea
                  house.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/admin/reservations">
                    <Button variant="primary" className="px-6 py-3">
                      View Reservations
                    </Button>
                  </Link>

                  <Link href="/admin/menus">
                    <Button variant="outline" className="px-6 py-3">
                      Manage Menu
                    </Button>
                  </Link>
                </div>
              </div>

              <Card className="border-[#8FBFBE]/25 bg-[#DCEFF0]/70 shadow-teal-100/40">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#315F5B]/70`}
                >
                  Today’s Focus
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <p className="text-5xl font-semibold text-[#315F5B]">5</p>
                    <p className="mt-2 text-sm leading-6 text-[#7D6E66]">
                      Admin modules ready to manage
                    </p>
                  </div>

                  <div className="h-px bg-white/70" />

                  <p className="text-sm leading-7 text-[#7D6E66]">
                    Keep reservations organized, tables available, and every
                    afternoon tea experience prepared with care.
                  </p>
                </div>
              </Card>
            </div>
          </Card>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardCards.map((card) => (
              <Link key={card.title} href={card.href}>
                <Card className="group h-full transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <p
                      className={`${cinzel.className} rounded-full bg-[#DCEFF0] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#315F5B]/75`}
                    >
                      {card.label}
                    </p>
                    <StatusBadge
                      status={`${summary[card.summaryKey]} ${card.suffix}`}
                    />
                  </div>

                  <h2
                    className={`${cinzel.className} text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                  >
                    {card.title}
                  </h2>

                  <p className="mt-4 min-h-12 text-sm leading-7 text-[#7D6E66]">
                    {card.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <Button variant="secondary" className="px-5 py-2.5">
                      Manage Section →
                    </Button>

                    <span className="text-2xl text-[#C8A86A]/50">✦</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="relative z-10 mt-12">
          <Footer />
        </div>
      </main>
    </ProtectedRoute>
  );
}
