"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import StatusBadge from "@/components/ui/StatusBadge";
import { getCurrentUser } from "@/lib/auth";

type CustomerProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: string | null;
  role: "CUSTOMER" | "ADMIN";
  createdAt?: string;
};

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
    title: "My Reservations",
    description:
      "View your reservation history, check details, reschedule, or cancel your booking.",
    href: "/customer/reservations",
    label: "Booking History",
    badge: "Reservation Access",
    action: "View Reservations →",
  },
  {
    title: "Make a Reservation",
    description:
      "Create a new reservation using your saved customer information.",
    href: "/customer/reservations/new",
    label: "New Booking",
    badge: "Tea Experience",
    action: "Book Now →",
  },
  {
    title: "My Orders",
    description:
      "View your afternoon tea menu orders connected to your reservations.",
    href: "/customer/orders",
    label: "Tea Orders",
    badge: "Menu Selection",
    action: "View Orders →",
  },
  {
    title: "Payment History",
    description: "Check your payment records, status, and transaction history.",
    href: "/customer/payments",
    label: "Transactions",
    badge: "Payment Records",
    action: "View Payments →",
  },
];

function formatDate(dateString?: string | null) {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("en-GB", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export default function CustomerDashboardPage() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const user = await getCurrentUser();
        setProfile(user);
      } catch (error) {
        console.error("Failed to fetch customer profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

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
                  Whisk & Wonder Customer
                </p>

                <h1
                  className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B] sm:text-5xl`}
                >
                  Customer Dashboard
                </h1>

                <p
                  className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
                >
                  your afternoon tea journey
                </p>

                <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
                  Manage your profile, reservations, orders, and payment history
                  from one elegant Whisk & Wonder customer space.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/customer/reservations/new">
                    <Button variant="primary" className="px-6 py-3">
                      Make Reservation
                    </Button>
                  </Link>

                  <Link href="/customer/reservations">
                    <Button variant="outline" className="px-6 py-3">
                      My Reservations
                    </Button>
                  </Link>
                </div>
              </div>

              <Card className="border-[#8FBFBE]/25 bg-[#DCEFF0]/70 shadow-teal-100/40">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#315F5B]/70`}
                >
                  Customer Profile
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <p
                      className={`${cinzel.className} text-4xl font-semibold text-[#315F5B]`}
                    >
                      {loading ? "..." : profile?.name || "-"}
                    </p>

                    <p
                      className={`${cinzel.className} mt-2 text-sm leading-6 text-[#7D6E66]`}
                    >
                      {profile?.email || "Loading customer profile..."}
                    </p>
                  </div>

                  <div className="h-px bg-white/70" />

                  <div className="flex flex-wrap gap-2">
                    <StatusBadge status={profile?.role || "customer"} />
                    <StatusBadge status="Registered user access" />
                  </div>
                </div>
              </Card>
            </div>
          </Card>

          <Card className="mb-8 bg-white/75">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div>
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                >
                  Profile Details
                </p>

                <h2
                  className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                >
                  {loading ? "Loading Profile..." : profile?.name || "-"}
                </h2>

                <p className="mt-2 text-sm leading-7 text-[#7D6E66]">
                  Your customer information is used to simplify future
                  reservations.
                </p>
              </div>

              <Link href="/customer/profile">
                <Button variant="secondary">Edit Profile</Button>
              </Link>
            </div>

            {!loading && profile && (
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                  <p
                    className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                  >
                    Email
                  </p>

                  <p className="mt-2 wrap-break-words text-sm font-semibold text-[#315F5B]">
                    {profile.email}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                  <p
                    className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                  >
                    Phone
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                    {profile.phone || "-"}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                  <p
                    className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                  >
                    Date of Birth
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                    {formatDate(profile.dateOfBirth)}
                  </p>
                </div>

                <div className="rounded-3xl bg-[#FFF8F1]/85 p-4">
                  <p
                    className={`${cinzel.className} text-[10px] uppercase tracking-wider text-[#C8A86A]`}
                  >
                    Address
                  </p>

                  <p className="mt-2 text-sm font-semibold text-[#315F5B]">
                    {profile.address || "-"}
                  </p>
                </div>
              </div>
            )}
          </Card>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {dashboardCards.map((card) => (
              <Link key={card.title} href={card.href}>
                <Card className="group h-full transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
                  <div className="mb-6 flex items-center justify-between gap-3">
                    <p
                      className={`${cinzel.className} rounded-full bg-[#DCEFF0] px-4 py-2 text-[10px] font-semibold uppercase tracking-widest text-[#315F5B]/75`}
                    >
                      {card.label}
                    </p>

                    <p className="rounded-full bg-[#F6EFE7] px-4 py-2 text-xs font-semibold text-[#7D6E66]">
                      {card.badge}
                    </p>
                  </div>

                  <h2
                    className={`${cinzel.className} text-xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                  >
                    {card.title}
                  </h2>

                  <p className="mt-4 min-h-20 text-sm leading-7 text-[#7D6E66]">
                    {card.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <Button variant="secondary" className="px-5 py-2.5">
                      {card.action}
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
