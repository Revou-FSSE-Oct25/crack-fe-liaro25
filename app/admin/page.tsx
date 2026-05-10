import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      </main>
    </ProtectedRoute>
  );
}
