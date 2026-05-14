"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import { Menu, MenuPackage } from "@/types";

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
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<TabType>("items");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [packages, setPackages] = useState<MenuPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

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
        fetch(`${API_BASE_URL}/menus/items`, { credentials: "include" }),
        fetch(`${API_BASE_URL}/menus/packages`, { credentials: "include" }),
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

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(
        menus
          .map((menu) => menu.category)
          .filter((category): category is string => Boolean(category)),
      ),
    );

    return ["all", ...uniqueCategories];
  }, [menus]);

  const filteredMenus = useMemo(() => {
    return menus.filter((menu) => {
      const matchesSearch = menu.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || menu.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [menus, search, selectedCategory]);

  const groupedMenus = useMemo(() => {
    return filteredMenus.reduce<Record<string, Menu[]>>((groups, menu) => {
      const category = menu.category || "Uncategorized";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(menu);

      return groups;
    }, {});
  }, [filteredMenus]);

  const filteredPackages = useMemo(() => {
    return packages.filter((menuPackage) =>
      menuPackage.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [packages, search]);

  function scrollToCreateForm() {
    document
      .getElementById(
        activeTab === "items" ? "create-menu-item" : "create-menu-package",
      )
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function handleCreateItem() {
    try {
      setSaving(true);

      const response = await fetch(`${API_BASE_URL}/menus/items`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...itemForm,
          price: Number(itemForm.price),
        }),
      });

      if (!response.ok) throw new Error("Failed to create menu item");

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...packageForm,
          price: Number(packageForm.price),
        }),
      });

      if (!response.ok) throw new Error("Failed to create menu package");

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...menu,
          price: Number(menu.price),
        }),
      });

      if (!response.ok) throw new Error("Failed to update menu item");

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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...menuPackage,
            price: Number(menuPackage.price),
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to update package");

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
      <main
        className={`${inter.className} relative min-h-screen overflow-hidden bg-[#FFF8F1] px-6 py-10 text-[#4A3428] sm:px-10 lg:px-16`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/about-preview.webp')] bg-cover bg-center opacity-[0.5]"
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
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.4em] text-[#8FBFBE]`}
            >
              Whisk & Wonder Admin
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider] text-[#315F5B] sm:text-5xl`}
            >
              Menu Management
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
            >
              curated with taste and wonder
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
              Review existing menu items by category, search and filter the
              current collection, then add new selections from the form below.
            </p>
          </Card>

          <Card className="mb-8 bg-white/70">
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr] lg:items-end">
              <div>
                <p
                  className={`${cinzel.className} mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#C8A86A]`}
                >
                  Menu View
                </p>

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant={activeTab === "items" ? "primary" : "outline"}
                    onClick={() => {
                      setActiveTab("items");
                      setSelectedCategory("all");
                    }}
                  >
                    Menu Items
                  </Button>

                  <Button
                    variant={activeTab === "packages" ? "primary" : "outline"}
                    onClick={() => setActiveTab("packages")}
                  >
                    Menu Packages
                  </Button>

                  <Button variant="secondary" onClick={scrollToCreateForm}>
                    {activeTab === "items"
                      ? "Add New Item ↓"
                      : "Add New Package ↓"}
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search menu..."
                />

                {activeTab === "items" && (
                  <select
                    value={selectedCategory}
                    onChange={(event) =>
                      setSelectedCategory(event.target.value)
                    }
                    className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
          </Card>

          {loading && <Card>Loading menus...</Card>}

          {!loading && activeTab === "items" && (
            <>
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p
                    className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A86A]`}
                  >
                    Existing Menu Items
                  </p>

                  <h2
                    className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-[0.04em] text-[#315F5B]`}
                  >
                    Current Tea House Menu
                  </h2>
                </div>

                <StatusBadge status={`${filteredMenus.length} items`} />
              </div>

              {Object.keys(groupedMenus).length === 0 && (
                <Card>No menu items found.</Card>
              )}

              <div className="space-y-10">
                {Object.entries(groupedMenus).map(([category, items]) => (
                  <div key={category}>
                    <div className="mb-4 flex items-center justify-between gap-4">
                      <h3
                        className={`${cinzel.className} text-xl font-semibold uppercase tracking-[0.06em] text-[#315F5B]`}
                      >
                        {category}
                      </h3>

                      <span className="rounded-full bg-[#DCEFF0] px-4 py-2 text-xs font-semibold text-[#315F5B]">
                        {items.length} items
                      </span>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                      {items.map((menu) => (
                        <Card key={menu.id} className="overflow-hidden p-0">
                          <div className="relative h-52 w-full bg-[#EFE3D3]">
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
                            <div className="flex items-center justify-between gap-3">
                              <StatusBadge status={menu.status} />

                              <Button
                                variant="ghost"
                                onClick={() =>
                                  setEditingItemId(
                                    editingItemId === menu.id ? null : menu.id,
                                  )
                                }
                                className="px-3"
                              >
                                Edit
                              </Button>
                            </div>

                            <h3
                              className={`${cinzel.className} mt-4 text-xl font-semibold uppercase tracking-[0.04em] text-[#315F5B]`}
                            >
                              {menu.name}
                            </h3>

                            <p className="mt-1 text-sm text-[#7D6E66]">
                              {menu.category}
                            </p>

                            <p className="mt-4 text-lg font-semibold text-[#C8A86A]">
                              Rp {Number(menu.price).toLocaleString("id-ID")}
                            </p>

                            <p className="mt-3 text-sm leading-6 text-[#7D6E66]">
                              {menu.description}
                            </p>

                            {editingItemId === menu.id && (
                              <div className="mt-5 space-y-3">
                                <Input
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
                                />

                                <Input
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
                                />

                                <Input
                                  type="number"
                                  value={String(menu.price)}
                                  onChange={(e) =>
                                    setMenus((prev) =>
                                      prev.map((item) =>
                                        item.id === menu.id
                                          ? { ...item, price: e.target.value }
                                          : item,
                                      ),
                                    )
                                  }
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
                                  className="h-24 w-full rounded-3xl border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-4 text-sm text-[#315F5B] outline-none"
                                />

                                <Input
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
                                />

                                <select
                                  value={menu.status}
                                  onChange={(e) =>
                                    setMenus((prev) =>
                                      prev.map((item) =>
                                        item.id === menu.id
                                          ? { ...item, status: e.target.value }
                                          : item,
                                      ),
                                    )
                                  }
                                  className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none"
                                >
                                  <option value="available">Available</option>
                                  <option value="unavailable">
                                    Unavailable
                                  </option>
                                </select>

                                <div className="flex gap-3">
                                  <Button
                                    onClick={() => handleUpdateItem(menu)}
                                  >
                                    Save
                                  </Button>

                                  <Button
                                    variant="outline"
                                    onClick={() => handleDeleteItem(menu.id)}
                                    className="text-red-600"
                                  >
                                    Disable
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <Card id="create-menu-item" className="mt-10 scroll-mt-28">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A86A]`}
                >
                  Add New Selection
                </p>

                <h2
                  className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-[0.04em] text-[#315F5B]`}
                >
                  Create Menu Item
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Menu name"
                    value={itemForm.name}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, name: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Category"
                    value={itemForm.category}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, category: e.target.value })
                    }
                  />

                  <Input
                    type="number"
                    placeholder="Price"
                    value={itemForm.price}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, price: e.target.value })
                    }
                  />

                  <Input
                    placeholder="Image URL"
                    value={itemForm.imageUrl}
                    onChange={(e) =>
                      setItemForm({ ...itemForm, imageUrl: e.target.value })
                    }
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
                  className="mt-4 h-28 w-full rounded-3xl border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-4 text-sm text-[#315F5B] outline-none transition placeholder:text-[#B3A39A] focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
                />

                <Button
                  onClick={handleCreateItem}
                  disabled={saving}
                  className="mt-5"
                >
                  {saving ? "Saving..." : "Create Menu Item"}
                </Button>
              </Card>
            </>
          )}

          {!loading && activeTab === "packages" && (
            <>
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p
                    className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A86A]`}
                  >
                    Existing Menu Packages
                  </p>

                  <h2
                    className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-[0.04em] text-[#315F5B]`}
                  >
                    Afternoon Tea Sets
                  </h2>
                </div>

                <StatusBadge status={`${filteredPackages.length} packages`} />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {filteredPackages.map((menuPackage) => (
                  <Card key={menuPackage.id} className="overflow-hidden p-0">
                    <div className="relative h-64 w-full bg-[#EFE3D3]">
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
                      <div className="flex items-center justify-between gap-3">
                        <StatusBadge status={menuPackage.status} />

                        <Button
                          variant="ghost"
                          onClick={() =>
                            setEditingPackageId(
                              editingPackageId === menuPackage.id
                                ? null
                                : menuPackage.id,
                            )
                          }
                          className="px-3"
                        >
                          Edit
                        </Button>
                      </div>

                      <h3
                        className={`${cinzel.className} mt-4 text-2xl font-semibold uppercase tracking-[0.04em] text-[#315F5B]`}
                      >
                        {menuPackage.name}
                      </h3>

                      <p className="mt-4 text-xl font-semibold text-[#C8A86A]">
                        Rp {Number(menuPackage.price).toLocaleString("id-ID")}
                      </p>

                      <p className="mt-4 text-sm leading-6 text-[#7D6E66]">
                        {menuPackage.description}
                      </p>

                      {editingPackageId === menuPackage.id && (
                        <div className="mt-5 space-y-3">
                          <Input
                            value={menuPackage.name}
                            onChange={(e) =>
                              setPackages((prev) =>
                                prev.map((item) =>
                                  item.id === menuPackage.id
                                    ? { ...item, name: e.target.value }
                                    : item,
                                ),
                              )
                            }
                          />

                          <Input
                            type="number"
                            value={String(menuPackage.price)}
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
                            className="h-24 w-full rounded-3xl border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-4 text-sm text-[#315F5B] outline-none"
                          />

                          <Input
                            value={menuPackage.imageUrl || ""}
                            onChange={(e) =>
                              setPackages((prev) =>
                                prev.map((item) =>
                                  item.id === menuPackage.id
                                    ? { ...item, imageUrl: e.target.value }
                                    : item,
                                ),
                              )
                            }
                          />

                          <select
                            value={menuPackage.status}
                            onChange={(e) =>
                              setPackages((prev) =>
                                prev.map((item) =>
                                  item.id === menuPackage.id
                                    ? { ...item, status: e.target.value }
                                    : item,
                                ),
                              )
                            }
                            className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none"
                          >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                          </select>

                          <div className="flex gap-3">
                            <Button
                              onClick={() => handleUpdatePackage(menuPackage)}
                            >
                              Save
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() =>
                                handleDeletePackage(menuPackage.id)
                              }
                              className="text-red-600"
                            >
                              Disable
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              <Card id="create-menu-package" className="mt-10 scroll-mt-28">
                <p
                  className={`${cinzel.className} text-xs font-semibold uppercase tracking-[0.35em] text-[#C8A86A]`}
                >
                  Add New Package
                </p>

                <h2
                  className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-[0.04em] text-[#315F5B]`}
                >
                  Create Menu Package
                </h2>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Input
                    placeholder="Package name"
                    value={packageForm.name}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        name: e.target.value,
                      })
                    }
                  />

                  <Input
                    type="number"
                    placeholder="Price"
                    value={packageForm.price}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        price: e.target.value,
                      })
                    }
                  />

                  <Input
                    placeholder="Image URL"
                    value={packageForm.imageUrl}
                    onChange={(e) =>
                      setPackageForm({
                        ...packageForm,
                        imageUrl: e.target.value,
                      })
                    }
                    className="md:col-span-2"
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
                  className="mt-4 h-28 w-full rounded-3xl border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-4 text-sm text-[#315F5B] outline-none transition placeholder:text-[#B3A39A] focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
                />

                <Button
                  onClick={handleCreatePackage}
                  disabled={saving}
                  className="mt-5"
                >
                  {saving ? "Saving..." : "Create Package"}
                </Button>
              </Card>
            </>
          )}
        </section>

        <div className="relative z-10 mt-12">
          <Footer />
        </div>
      </main>
    </ProtectedRoute>
  );
}
