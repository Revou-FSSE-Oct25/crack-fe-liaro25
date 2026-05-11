"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Table } from "@/types";

export default function AdminTablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTables();
  }, []);

  async function fetchTables() {
    try {
      const response = await fetch(
        "https://whiskandwonder.up.railway.app/tables",
        {
          credentials: "include",
        },
      );

      const data = await response.json();

      setTables(data);
    } catch (error) {
      console.error("Failed to fetch tables:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-6 py-10">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center text-sm font-medium text-[#b8895b] hover:underline"
            >
              ← Back to Dashboard
            </Link>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
              Admin
            </p>

            <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">Tables</h1>

            <p className="mt-2 text-sm text-[#6f6258]">
              View restaurant tables and availability.
            </p>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Loading tables...
            </div>
          )}

          {!loading && tables.length === 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              No tables found.
            </div>
          )}

          {!loading && tables.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className="rounded-2xl border border-[#ead8c5] bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-semibold text-[#2f241d]">
                        {table.name}
                      </h2>

                      <p className="mt-2 text-sm text-[#6f6258]">
                        Capacity: {table.capacity} guests
                      </p>
                    </div>

                    <span className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs font-medium capitalize text-[#2f241d]">
                      {table.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
