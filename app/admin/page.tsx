import Link from "next/link";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

const dashboardCards = [
  {
    title: "Reservations",
    description: "View and manage customer reservations.",
    href: "/admin/reservations",
  },
  {
    title: "Tables",
    description: "Manage restaurant table availability.",
    href: "/admin/tables",
  },
  {
    title: "Menus",
    description: "Manage menu items and categories.",
    href: "/admin/menus",
  },
  {
    title: "Orders",
    description: "View and manage customer orders.",
    href: "/admin/orders",
  },
  {
    title: "Payments",
    description: "Track payment status and transactions.",
    href: "/admin/payments",
  },
];

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-6 py-10">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
              Whisk & Wonder
            </p>
            <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">
              Admin Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#6f6258]">
              Manage reservations, tables, menus, orders, and payments from one
              place.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {dashboardCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="rounded-2xl border border-[#ead8c5] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h2 className="text-xl font-semibold text-[#2f241d]">
                  {card.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#6f6258]">
                  {card.description}
                </p>
                <p className="mt-5 text-sm font-semibold text-[#b8895b]">
                  Open →
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
}
