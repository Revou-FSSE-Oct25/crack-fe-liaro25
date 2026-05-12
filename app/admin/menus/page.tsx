"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { Menu, MenuPackage } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whiskandwonder.up.railway.app";

type TabType = "items" | "packages";

const defaultItemForm = {
  name: "",
  category: "",
  price: "",
  description: "",
  imageUrl: "",
};

const defaultPackageForm = {
  name: "",
  price: "",
  description: "",
  imageUrl: "",
};

export default function AdminMenusPage() {
  const [activeTab, setActiveTab] = useState<TabType>("items");

  const [menus, setMenus] = useState<Menu[]>([]);
  const [packages, setPackages] = useState<MenuPackage[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);

  const [itemForm, setItemForm] = useState(defaultItemForm);
  const [packageForm, setPackageForm] = useState(defaultPackageForm);

  useEffect(() => {
    fetchAllMenus();
  }, []);

  async function fetchAllMenus() {
    try {
      setLoading(true);

      const [itemsResponse, packagesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/menus/items`, {
          credentials: "include",
        }),
        fetch(`${API_BASE_URL}/menus/packages`, {
          credentials: "include",
        }),
      ]);

      const itemsData = await itemsResponse.json();
      const packagesData = await packagesResponse.json();

      setMenus(Array.isArray(itemsData) ? itemsData : []);
      setPackages(Array.isArray(packagesData) ? packagesData : []);
    } catch (error) {
      console.error("Failed to fetch menus:", error);
    } finally {
      setLoading(false);
    }
  }

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) =>
      menu.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [menus, search]);

  const filteredPackages = useMemo(() => {
    return packages.filter((menuPackage) =>
      menuPackage.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [packages, search]);

  async function handleCreateItem() {
    try {
      setSaving(true);

      const response = await fetch(`${API_BASE_URL}/menus/items`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...itemForm,
          price: Number(itemForm.price),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create menu item");
      }

      setItemForm(defaultItemForm);

      await fetchAllMenus();
    } catch (error) {
      console.error(error);
      alert("Failed to create menu item");
    } finally {
      setSaving(false);
    }
  }

  async function handleCreatePackage() {
    try {
      setSaving(true);

      const response = await fetch(`${API_BASE_URL}/menus/packages`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...packageForm,
          price: Number(packageForm.price),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create menu package");
      }

      setPackageForm(defaultPackageForm);

      await fetchAllMenus();
    } catch (error) {
      console.error(error);
      alert("Failed to create menu package");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateItem(menu: Menu) {
    try {
      setSaving(true);

      const response = await fetch(`${API_BASE_URL}/menus/items/${menu.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(menu),
      });

      if (!response.ok) {
        throw new Error("Failed to update menu item");
      }

      setEditingItemId(null);

      await fetchAllMenus();
    } catch (error) {
      console.error(error);
      alert("Failed to update menu item");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdatePackage(menuPackage: MenuPackage) {
    try {
      setSaving(true);

      const response = await fetch(
        `${API_BASE_URL}/menus/packages/${menuPackage.id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(menuPackage),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to update package");
      }

      setEditingPackageId(null);

      await fetchAllMenus();
    } catch (error) {
      console.error(error);
      alert("Failed to update package");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteItem(id: string) {
    const confirmed = confirm("Set this menu item as unavailable?");

    if (!confirmed) return;

    try {
      await fetch(`${API_BASE_URL}/menus/items/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      await fetchAllMenus();
    } catch (error) {
      console.error(error);
    }
  }

  async function handleDeletePackage(id: string) {
    const confirmed = confirm("Set this package as unavailable?");

    if (!confirmed) return;

    try {
      await fetch(`${API_BASE_URL}/menus/packages/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      await fetchAllMenus();
    } catch (error) {
      console.error(error);
    }
  }

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

            <h1 className="mt-2 text-4xl font-bold text-[#2f241d]">
              Menu Management
            </h1>
          </div>

          <div className="mb-6 flex gap-3">
            <button
              onClick={() => setActiveTab("items")}
              className={`rounded-full px-5 py-2 text-sm font-medium ${
                activeTab === "items"
                  ? "bg-[#2f241d] text-white"
                  : "bg-white text-[#2f241d]"
              }`}
            >
              Menu Items
            </button>

            <button
              onClick={() => setActiveTab("packages")}
              className={`rounded-full px-5 py-2 text-sm font-medium ${
                activeTab === "packages"
                  ? "bg-[#2f241d] text-white"
                  : "bg-white text-[#2f241d]"
              }`}
            >
              Menu Packages
            </button>
          </div>

          <div className="mb-6">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search menu..."
              className="w-full rounded-2xl border border-[#ead8c5] bg-white px-5 py-4 outline-none"
            />
          </div>

          {loading && (
            <div className="rounded-3xl bg-white p-6">Loading menus...</div>
          )}

          {!loading && activeTab === "items" && (
            <>
              <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-[#2f241d]">
                  Create Menu Item
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <input
                    placeholder="Menu name"
                    value={itemForm.name}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        name: e.target.value,
                      })
                    }
                    className="rounded-xl border border-[#ead8c5] px-4 py-3"
                  />

                  <input
                    placeholder="Category"
                    value={itemForm.category}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        category: e.target.value,
                      })
                    }
                    className="rounded-xl border border-[#ead8c5] px-4 py-3"
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={itemForm.price}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        price: e.target.value,
                      })
                    }
                    className="rounded-xl border border-[#ead8c5] px-4 py-3"
                  />

                  <input
                    placeholder="Image URL"
                    value={itemForm.imageUrl}
                    onChange={(e) =>
                      setItemForm({
                        ...itemForm,
                        imageUrl: e.target.value,
                      })
                    }
                    className="rounded-xl border border-[#ead8c5] px-4 py-3"
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={itemForm.description}
                  onChange={(e) =>
                    setItemForm({
                      ...itemForm,
                      description: e.target.value,
                    })
                  }
                  className="mt-4 h-28 w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                />

                <button
                  onClick={handleCreateItem}
                  disabled={saving}
                  className="mt-5 rounded-xl bg-[#2f241d] px-5 py-3 text-sm font-medium text-white"
                >
                  Create Menu Item
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {filteredMenus.map((menu) => (
                  <div
                    key={menu.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm"
                  >
                    <div className="relative h-52 w-full bg-[#efe3d3]">
                      {menu.imageUrl && (
                        <Image
                          src={menu.imageUrl}
                          alt={menu.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs capitalize text-[#2f241d]">
                          {menu.status}
                        </span>

                        <button
                          onClick={() =>
                            setEditingItemId(
                              editingItemId === menu.id ? null : menu.id,
                            )
                          }
                          className="text-sm font-medium text-[#b8895b]"
                        >
                          Edit
                        </button>
                      </div>

                      <h3 className="mt-4 text-xl font-bold text-[#2f241d]">
                        {menu.name}
                      </h3>

                      <p className="mt-1 text-sm text-[#6f6258]">
                        {menu.category}
                      </p>

                      <p className="mt-4 text-lg font-bold text-[#b8895b]">
                        Rp {Number(menu.price).toLocaleString("id-ID")}
                      </p>

                      <p className="mt-3 text-sm leading-6 text-[#6f6258]">
                        {menu.description}
                      </p>

                      {editingItemId === menu.id && (
                        <div className="mt-5 space-y-3">
                          <input
                            value={menu.name}
                            onChange={(e) =>
                              setMenus((prev) =>
                                prev.map((item) =>
                                  item.id === menu.id
                                    ? { ...item, name: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                          />

                          <input
                            value={menu.category}
                            onChange={(e) =>
                              setMenus((prev) =>
                                prev.map((item) =>
                                  item.id === menu.id
                                    ? {
                                        ...item,
                                        category: e.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                          />

                          <input
                            type="number"
                            value={menu.price}
                            onChange={(e) =>
                              setMenus((prev) =>
                                prev.map((item) =>
                                  item.id === menu.id
                                    ? {
                                        ...item,
                                        price: e.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                          />

                          <textarea
                            value={menu.description || ""}
                            onChange={(e) =>
                              setMenus((prev) =>
                                prev.map((item) =>
                                  item.id === menu.id
                                    ? {
                                        ...item,
                                        description: e.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }
                            className="h-24 w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                          />

                          <input
                            value={menu.imageUrl || ""}
                            onChange={(e) =>
                              setMenus((prev) =>
                                prev.map((item) =>
                                  item.id === menu.id
                                    ? {
                                        ...item,
                                        imageUrl: e.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                          />

                          <select
                            value={menu.status}
                            onChange={(e) =>
                              setMenus((prev) =>
                                prev.map((item) =>
                                  item.id === menu.id
                                    ? {
                                        ...item,
                                        status: e.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                          >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                          </select>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleUpdateItem(menu)}
                              className="rounded-xl bg-[#2f241d] px-4 py-2 text-sm text-white"
                            >
                              Save
                            </button>

                            <button
                              onClick={() => handleDeleteItem(menu.id)}
                              className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-600"
                            >
                              Disable
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && activeTab === "packages" && (
            <>
              <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-bold text-[#2f241d]">
                  Create Menu Package
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <input
                    placeholder="Package name"
                    value={packageForm.name}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        name: e.target.value,
                      })
                    }
                    className="rounded-xl border border-[#ead8c5] px-4 py-3"
                  />

                  <input
                    type="number"
                    placeholder="Price"
                    value={packageForm.price}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        price: e.target.value,
                      })
                    }
                    className="rounded-xl border border-[#ead8c5] px-4 py-3"
                  />

                  <input
                    placeholder="Image URL"
                    value={packageForm.imageUrl}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        imageUrl: e.target.value,
                      })
                    }
                    className="rounded-xl border border-[#ead8c5] px-4 py-3 md:col-span-2"
                  />
                </div>

                <textarea
                  placeholder="Description"
                  value={packageForm.description}
                  onChange={(e) =>
                    setPackageForm({
                      ...packageForm,
                      description: e.target.value,
                    })
                  }
                  className="mt-4 h-28 w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                />

                <button
                  onClick={handleCreatePackage}
                  disabled={saving}
                  className="mt-5 rounded-xl bg-[#2f241d] px-5 py-3 text-sm font-medium text-white"
                >
                  Create Package
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {filteredPackages.map((menuPackage) => (
                  <div
                    key={menuPackage.id}
                    className="overflow-hidden rounded-3xl bg-white shadow-sm"
                  >
                    <div className="relative h-64 w-full bg-[#efe3d3]">
                      {menuPackage.imageUrl && (
                        <Image
                          src={menuPackage.imageUrl}
                          alt={menuPackage.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-[#efe3d3] px-3 py-1 text-xs capitalize text-[#2f241d]">
                          {menuPackage.status}
                        </span>

                        <button
                          onClick={() =>
                            setEditingPackageId(
                              editingPackageId === menuPackage.id
                                ? null
                                : menuPackage.id,
                            )
                          }
                          className="text-sm font-medium text-[#b8895b]"
                        >
                          Edit
                        </button>
                      </div>

                      <h3 className="mt-4 text-2xl font-bold text-[#2f241d]">
                        {menuPackage.name}
                      </h3>

                      <p className="mt-4 text-xl font-bold text-[#b8895b]">
                        Rp {Number(menuPackage.price).toLocaleString("id-ID")}
                      </p>

                      <p className="mt-4 text-sm leading-6 text-[#6f6258]">
                        {menuPackage.description}
                      </p>

                      {editingPackageId === menuPackage.id && (
                        <div className="mt-5 space-y-3">
                          <input
                            value={menuPackage.name}
                            onChange={(e) =>
                              setPackages((prev) =>
                                prev.map((item) =>
                                  item.id === menuPackage.id
                                    ? {
                                        ...item,
                                        name: e.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                          />

                          <input
                            type="number"
                            value={menuPackage.price}
                            onChange={(e) =>
                              setPackages((prev) =>
                                prev.map((item) =>
                                  item.id === menuPackage.id
                                    ? {
                                        ...item,
                                        price: e.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                          />

                          <textarea
                            value={menuPackage.description || ""}
                            onChange={(e) =>
                              setPackages((prev) =>
                                prev.map((item) =>
                                  item.id === menuPackage.id
                                    ? {
                                        ...item,
                                        description: e.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }
                            className="h-24 w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                          />

                          <input
                            value={menuPackage.imageUrl || ""}
                            onChange={(e) =>
                              setPackages((prev) =>
                                prev.map((item) =>
                                  item.id === menuPackage.id
                                    ? {
                                        ...item,
                                        imageUrl: e.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                          />

                          <select
                            value={menuPackage.status}
                            onChange={(e) =>
                              setPackages((prev) =>
                                prev.map((item) =>
                                  item.id === menuPackage.id
                                    ? {
                                        ...item,
                                        status: e.target.value,
                                      }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-xl border border-[#ead8c5] px-4 py-3"
                          >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                          </select>

                          <div className="flex gap-3">
                            <button
                              onClick={() => handleUpdatePackage(menuPackage)}
                              className="rounded-xl bg-[#2f241d] px-4 py-2 text-sm text-white"
                            >
                              Save
                            </button>

                            <button
                              onClick={() =>
                                handleDeletePackage(menuPackage.id)
                              }
                              className="rounded-xl bg-red-100 px-4 py-2 text-sm text-red-600"
                            >
                              Disable
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
