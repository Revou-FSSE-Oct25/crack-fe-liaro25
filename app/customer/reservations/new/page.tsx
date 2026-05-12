"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getCurrentUser } from "@/lib/auth";
import { createReservation } from "@/lib/reservation";
import { CreateReservationRequest, Menu, MenuPackage } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whiskandwonder.up.railway.app";

const categoryOrder = [
  "Western Savory",
  "Western Sweet",
  "Western Beverage",
  "Traditional Savory",
  "Traditional Sweet",
  "Traditional Beverage",
];

type CustomerProfile = {
  name: string;
  email: string;
  phone?: string | null;
};

type SelectedOrderItem = {
  menuItemId?: string;
  menuPackageId?: string;
  quantity: number;
};

function formatPrice(price: string | number) {
  return `Rp ${Number(price).toLocaleString("id-ID")}`;
}

export default function CustomerNewReservationPage() {
  const router = useRouter();

  const [menus, setMenus] = useState<Menu[]>([]);
  const [packages, setPackages] = useState<MenuPackage[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedOrderItem[]>([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CreateReservationRequest>();

  useEffect(() => {
    async function fillCustomerProfile() {
      const user = (await getCurrentUser()) as CustomerProfile | null;

      if (!user) return;

      setValue("guestName", user.name);
      setValue("guestEmail", user.email);

      if (user.phone) {
        setValue("guestPhone", user.phone);
      }
    }

    async function fetchMenusAndPackages() {
      try {
        setMenuLoading(true);

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

        if (!itemsResponse.ok) {
          throw new Error(itemsData.message || "Failed to fetch menu items");
        }

        if (!packagesResponse.ok) {
          throw new Error(
            packagesData.message || "Failed to fetch menu packages",
          );
        }

        setMenus(
          Array.isArray(itemsData)
            ? itemsData.filter((menu: Menu) => menu.status === "available")
            : [],
        );

        setPackages(
          Array.isArray(packagesData)
            ? packagesData.filter(
                (menuPackage: MenuPackage) =>
                  menuPackage.status === "available",
              )
            : [],
        );
      } catch (error) {
        console.error("Failed to fetch menus:", error);
        setError("Failed to load menu data. Please refresh the page.");
      } finally {
        setMenuLoading(false);
      }
    }

    fillCustomerProfile();
    fetchMenusAndPackages();
  }, [setValue]);

  function getSelectedQuantity(id: string, type: "item" | "package") {
    const selectedItem = selectedItems.find((item) =>
      type === "item" ? item.menuItemId === id : item.menuPackageId === id,
    );

    return selectedItem?.quantity || 0;
  }

  function updateQuantity(
    id: string,
    type: "item" | "package",
    quantity: number,
  ) {
    setSelectedItems((prevItems) => {
      const filteredItems = prevItems.filter((item) =>
        type === "item" ? item.menuItemId !== id : item.menuPackageId !== id,
      );

      if (quantity <= 0) {
        return filteredItems;
      }

      return [
        ...filteredItems,
        type === "item"
          ? { menuItemId: id, quantity }
          : { menuPackageId: id, quantity },
      ];
    });
  }

  const groupedMenus = useMemo(() => {
    return categoryOrder
      .map((category) => ({
        category,
        items: menus.filter((menu) => menu.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [menus]);

  const selectedOrderDetails = useMemo(() => {
    return selectedItems
      .map((selectedItem) => {
        if (selectedItem.menuItemId) {
          const menu = menus.find(
            (item) => item.id === selectedItem.menuItemId,
          );

          if (!menu) return null;

          return {
            id: menu.id,
            name: menu.name,
            type: "Menu Item",
            price: Number(menu.price),
            quantity: selectedItem.quantity,
            subtotal: Number(menu.price) * selectedItem.quantity,
          };
        }

        if (selectedItem.menuPackageId) {
          const menuPackage = packages.find(
            (item) => item.id === selectedItem.menuPackageId,
          );

          if (!menuPackage) return null;

          return {
            id: menuPackage.id,
            name: menuPackage.name,
            type: "Package",
            price: Number(menuPackage.price),
            quantity: selectedItem.quantity,
            subtotal: Number(menuPackage.price) * selectedItem.quantity,
          };
        }

        return null;
      })
      .filter(Boolean) as {
      id: string;
      name: string;
      type: string;
      price: number;
      quantity: number;
      subtotal: number;
    }[];
  }, [menus, packages, selectedItems]);

  const estimatedTotal = useMemo(() => {
    return selectedOrderDetails.reduce(
      (total, item) => total + item.subtotal,
      0,
    );
  }, [selectedOrderDetails]);

  async function createOrder(reservationId: string) {
    if (selectedItems.length === 0) {
      return;
    }

    const response = await fetch(`${API_BASE_URL}/orders/my`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservationId,
        items: selectedItems,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to create order");
    }

    return data;
  }

  async function onSubmit(data: CreateReservationRequest) {
    try {
      setError("");

      const payload: CreateReservationRequest = {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        reservationDate: data.reservationDate,
        startTime: data.startTime,
        guestCount: Number(data.guestCount),
      };

      const reservation = await createReservation(payload);

      if (selectedItems.length > 0) {
        await createOrder(reservation.id);
        router.push("/customer/orders");
        return;
      }

      router.push(
        `/reservation/success?code=${encodeURIComponent(
          reservation.reservationCode,
        )}`,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create reservation or order",
      );
    }
  }

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <main className="min-h-screen bg-[#f8f3ec] px-4 py-8 md:px-6 md:py-12">
        <section className="mx-auto max-w-7xl">
          <div className="mb-8 rounded-3xl bg-white p-6 shadow-sm md:p-8">
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
              Customer Reservation
            </p>

            <h1 className="mt-3 text-4xl font-bold text-[#2f241d]">
              Create Reservation
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f6258]">
              Choose your reservation details and add your preferred afternoon
              tea package or individual menu items.
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6 lg:grid-cols-[1fr_380px]"
          >
            <div className="space-y-6">
              <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
                <h2 className="text-2xl font-bold text-[#2f241d]">
                  Reservation Details
                </h2>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <input
                    {...register("guestName", { required: true })}
                    className="w-full rounded-xl border border-[#ead8c5] bg-[#f8f3ec] px-4 py-3 text-[#2f241d] outline-none"
                    readOnly
                  />

                  <input
                    type="email"
                    {...register("guestEmail", { required: true })}
                    className="w-full rounded-xl border border-[#ead8c5] bg-[#f8f3ec] px-4 py-3 text-[#2f241d] outline-none"
                    readOnly
                  />

                  <input
                    placeholder="Phone"
                    {...register("guestPhone", { required: true })}
                    className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none focus:border-[#b8895b]"
                  />

                  <input
                    type="date"
                    {...register("reservationDate", { required: true })}
                    className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none focus:border-[#b8895b]"
                  />

                  <select
                    {...register("startTime", { required: true })}
                    className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none focus:border-[#b8895b]"
                  >
                    <option value="">Select time</option>
                    <option value="11:00">11:00</option>
                    <option value="12:00">12:00</option>
                    <option value="13:00">13:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                    <option value="18:00">18:00</option>
                  </select>

                  <input
                    type="number"
                    min="1"
                    placeholder="Number of Guests"
                    {...register("guestCount", { required: true })}
                    className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none focus:border-[#b8895b]"
                  />
                </div>
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b8895b]">
                  Recommended Sets
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#2f241d]">
                  Afternoon Tea Packages
                </h2>

                {menuLoading && (
                  <div className="mt-6 rounded-2xl bg-[#f8f3ec] p-5 text-sm text-[#6f6258]">
                    Loading menus...
                  </div>
                )}

                {!menuLoading && packages.length > 0 && (
                  <div className="mt-6 grid gap-5 md:grid-cols-2">
                    {packages.map((menuPackage) => {
                      const quantity = getSelectedQuantity(
                        menuPackage.id,
                        "package",
                      );

                      return (
                        <div
                          key={menuPackage.id}
                          className="overflow-hidden rounded-3xl border border-[#ead8c5] bg-[#fffaf5]"
                        >
                          <div className="relative h-52 w-full bg-[#efe3d3]">
                            {menuPackage.imageUrl && (
                              <Image
                                src={menuPackage.imageUrl}
                                alt={menuPackage.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                              />
                            )}
                          </div>

                          <div className="p-5">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8895b]">
                              Package
                            </p>

                            <h3 className="mt-2 text-xl font-bold text-[#2f241d]">
                              {menuPackage.name}
                            </h3>

                            {menuPackage.description && (
                              <p className="mt-2 text-sm leading-6 text-[#6f6258]">
                                {menuPackage.description}
                              </p>
                            )}

                            <div className="mt-5 flex items-center justify-between">
                              <p className="text-xl font-bold text-[#b8895b]">
                                {formatPrice(menuPackage.price)}
                              </p>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      menuPackage.id,
                                      "package",
                                      quantity - 1,
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ead8c5] bg-white text-lg font-bold text-[#2f241d]"
                                >
                                  -
                                </button>

                                <span className="w-7 text-center text-sm font-bold text-[#2f241d]">
                                  {quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      menuPackage.id,
                                      "package",
                                      quantity + 1,
                                    )
                                  }
                                  className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2f241d] text-lg font-bold text-white"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b8895b]">
                  À La Carte
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#2f241d]">
                  Individual Menu Items
                </h2>

                {!menuLoading && groupedMenus.length > 0 && (
                  <div className="mt-8 space-y-10">
                    {groupedMenus.map((group) => (
                      <div key={group.category}>
                        <div className="mb-4 flex items-end justify-between">
                          <h3 className="text-xl font-bold text-[#2f241d]">
                            {group.category}
                          </h3>
                          <p className="text-sm text-[#6f6258]">
                            {group.items.length} items
                          </p>
                        </div>

                        <div className="grid gap-5 md:grid-cols-2">
                          {group.items.map((menu) => {
                            const quantity = getSelectedQuantity(
                              menu.id,
                              "item",
                            );

                            return (
                              <div
                                key={menu.id}
                                className="overflow-hidden rounded-3xl border border-[#ead8c5] bg-[#fffaf5]"
                              >
                                <div className="relative h-44 w-full bg-[#efe3d3]">
                                  {menu.imageUrl && (
                                    <Image
                                      src={menu.imageUrl}
                                      alt={menu.name}
                                      fill
                                      sizes="(max-width: 768px) 100vw, 50vw"
                                      className="object-cover"
                                    />
                                  )}
                                </div>

                                <div className="p-5">
                                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b8895b]">
                                    {menu.category}
                                  </p>

                                  <h4 className="mt-2 text-lg font-bold text-[#2f241d]">
                                    {menu.name}
                                  </h4>

                                  <p className="mt-5 text-lg font-bold text-[#b8895b]">
                                    {formatPrice(menu.price)}
                                  </p>

                                  <div className="mt-4 flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateQuantity(
                                          menu.id,
                                          "item",
                                          quantity - 1,
                                        )
                                      }
                                      className="flex h-9 w-9 items-center justify-center rounded-full border border-[#ead8c5] bg-white text-lg font-bold text-[#2f241d]"
                                    >
                                      -
                                    </button>

                                    <span className="w-7 text-center text-sm font-bold text-[#2f241d]">
                                      {quantity}
                                    </span>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        updateQuantity(
                                          menu.id,
                                          "item",
                                          quantity + 1,
                                        )
                                      }
                                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2f241d] text-lg font-bold text-white"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>

            <aside className="h-fit rounded-3xl bg-white p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-2xl font-bold text-[#2f241d]">
                Order Summary
              </h2>

              <div className="mt-6 space-y-3">
                {selectedOrderDetails.length === 0 && (
                  <div className="rounded-2xl bg-[#f8f3ec] p-4 text-sm text-[#6f6258]">
                    No menu selected yet.
                  </div>
                )}

                {selectedOrderDetails.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="rounded-2xl border border-[#ead8c5] bg-[#fffaf5] p-4"
                  >
                    <p className="font-semibold text-[#2f241d]">{item.name}</p>
                    <p className="mt-1 text-xs text-[#6f6258]">
                      {item.type} · {item.quantity} × {formatPrice(item.price)}
                    </p>
                    <p className="mt-2 text-sm font-bold text-[#b8895b]">
                      {formatPrice(item.subtotal)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#ead8c5] pt-5">
                <p className="text-sm font-medium text-[#6f6258]">
                  Estimated subtotal
                </p>
                <p className="text-xl font-bold text-[#b8895b]">
                  {formatPrice(estimatedTotal)}
                </p>
              </div>

              {error && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-xl bg-[#2f241d] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#4a3a30] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting
                  ? "Creating reservation..."
                  : "Create Reservation"}
              </button>
            </aside>
          </form>
        </section>
      </main>
    </ProtectedRoute>
  );
}
