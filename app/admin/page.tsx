import Link from "next/link";
import ProtectedRoute from "@/components/layout/ProtectedRoute";

const adminCards = [
  {
    title: "Reservations",
    description: "View and manage guest reservations.",
    href: "/admin/reservations",
  },
  {
    title: "Tables",
    description: "Manage table capacity and availability.",
    href: "/admin/tables",
  },
  {
    title: "Menus",
    description: "Manage afternoon tea menus and packages.",
    href: "/admin/menus",
  },
  {
    title: "Orders",
    description: "Manage reservation-related orders.",
    href: "/admin/orders",
  },
  {
    title: "Payments",
    description: "Track and confirm payment records.",
    href: "/admin/payments",
  },
];

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main className="min-h-screen px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <p className="text-sm uppercase tracking-[0.3em] text-gray-500 mb-3">
              Admin Panel
            </p>

            <h1 className="text-5xl font-bold mb-4">
              Whisk & Wonder Dashboard
            </h1>

            <p className="text-gray-600 max-w-2xl">
              Manage reservations, tables, menus, orders, and payments from one
              central dashboard.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="bg-white rounded-2xl shadow-md p-6 hover:-translate-y-1 transition"
              >
                <h2 className="text-2xl font-bold mb-3">{card.title}</h2>

                <p className="text-gray-600 mb-6">{card.description}</p>

                <span className="font-semibold">Open →</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
