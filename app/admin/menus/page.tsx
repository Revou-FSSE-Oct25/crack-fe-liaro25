"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Menu } from "@/types";

const API_URL = "https://whiskandwonder.up.railway.app";

const categoryOrder = [
  "Western Savory",
  "Western Sweet",
  "Western Beverage",
  "Traditional Savory",
  "Traditional Sweet",
  "Traditional Beverage",
];

function formatPrice(price: string | number) {
  return `Rp ${Number(price).toLocaleString("id-ID")}`;
}

export default function AdminMenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMenus();
  }, []);

  async function fetchMenus() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/menus/items`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch menus");
      }

      const data = await response.json();

      setMenus(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
      setError("Failed to load menus. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const availableMenus = useMemo(() => {
    return menus.filter((menu) => menu.status === "available");
  }, [menus]);

  const groupedMenus = useMemo(() => {
    return categoryOrder
      .map((category) => ({
        category,
        items: availableMenus.filter((menu) => menu.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [availableMenus]);

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-4 py-8 md:px-6 md:py-10">
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

            <h1 className="mt-2 text-3xl font-bold text-[#2f241d]">Menus</h1>

            <p className="mt-2 text-sm text-[#6f6258]">
              View available Western and Nusantara afternoon tea menu items.
            </p>
          </div>

          {loading && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              Loading menus...
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl bg-red-50 p-6 text-sm font-medium text-red-700 shadow-sm">
              {error}
            </div>
          )}

          {!loading && !error && availableMenus.length === 0 && (
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              No available menus found.
            </div>
          )}

          {!loading && !error && groupedMenus.length > 0 && (
            <div className="space-y-10">
              {groupedMenus.map((group) => (
                <section key={group.category}>
                  <div className="mb-4 flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b8895b]">
                        Menu Category
                      </p>

                      <h2 className="mt-1 text-2xl font-bold text-[#2f241d]">
                        {group.category}
                      </h2>
                    </div>

                    <p className="text-sm text-[#6f6258]">
                      {group.items.length} items
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {group.items.map((menu) => (
                      <div
                        key={menu.id}
                        className="overflow-hidden rounded-3xl border border-[#ead8c5] bg-white shadow-sm"
                      >
                        <div className="relative h-48 w-full bg-[#efe3d3]">
                          {menu.imageUrl ? (
                            <Image
                              src={menu.imageUrl}
                              alt={menu.name}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-sm text-[#6f6258]">
                              No image
                            </div>
                          )}
                        </div>

                        <div className="p-5">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-bold text-[#2f241d]">
                                {menu.name}
                              </h3>

                              <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-[#b8895b]">
                                {menu.category}
                              </p>
                            </div>

                            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold capitalize text-green-700">
                              {menu.status}
                            </span>
                          </div>

                          {menu.description && (
                            <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#6f6258]">
                              {menu.description}
                            </p>
                          )}

                          <p className="mt-5 text-xl font-bold text-[#b8895b]">
                            {formatPrice(menu.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
