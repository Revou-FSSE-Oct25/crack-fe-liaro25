import ProtectedRoute from "@/components/layout/ProtectedRoute";

export default function CustomerDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold">Customer Dashboard</h1>
      </main>
    </ProtectedRoute>
  );
}
