"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import Footer from "@/components/home/Footer";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";

import { createReservation } from "@/lib/reservation";
import { CreateReservationRequest, Menu, MenuPackage } from "@/types";
import { getCurrentUser } from "@/lib/auth";

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

type OrderLine = {
  id: string;
  type: "item" | "package";
  name: string;
  category?: string;
  menuItemId?: string;
  menuPackageId?: string;
  price: number;
  quantity: number;
};

const timeOptions = [
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

function formatCurrency(value: string | number) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

export default function CustomerNewReservationPage() {
  const router = useRouter();

  const [error, setError] = useState("");
  const [menus, setMenus] = useState<Menu[]>([]);
  const [packages, setPackages] = useState<MenuPackage[]>([]);
  const [loadingMenus, setLoadingMenus] = useState(true);

  const [menuSearch, setMenuSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [quantity, setQuantity] = useState("1");
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<CreateReservationRequest>();

  useEffect(() => {
    async function autofillCustomerProfile() {
      try {
        const user = await getCurrentUser();

        setValue("guestName", user.name || "");
        setValue("guestEmail", user.email || "");
        setValue("guestPhone", user.phone || "");
      } catch (error) {
        console.error("Failed to autofill customer profile:", error);
      }
    }

    autofillCustomerProfile();
  }, [setValue]);

  useEffect(() => {
    async function fetchMenus() {
      try {
        setLoadingMenus(true);

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
        setLoadingMenus(false);
      }
    }

    fetchMenus();
  }, []);

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
    const keyword = menuSearch.toLowerCase();

    return menus.filter((menu) => {
      const matchesSearch =
        !keyword ||
        menu.name.toLowerCase().includes(keyword) ||
        menu.category?.toLowerCase().includes(keyword);

      const matchesCategory =
        categoryFilter === "all" || menu.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [menus, menuSearch, categoryFilter]);

  const filteredPackages = useMemo(() => {
    const keyword = menuSearch.toLowerCase();

    return packages.filter((menuPackage) =>
      menuPackage.name.toLowerCase().includes(keyword),
    );
  }, [packages, menuSearch]);

  const orderTotal = useMemo(() => {
    return orderLines.reduce(
      (total, line) => total + line.price * line.quantity,
      0,
    );
  }, [orderLines]);

  function addMenuItem(menu: Menu) {
    const addedQuantity = Number(quantity || 1);

    setOrderLines((prev) => {
      const existingLine = prev.find((line) => line.menuItemId === menu.id);

      if (existingLine) {
        return prev.map((line) =>
          line.menuItemId === menu.id
            ? {
                ...line,
                quantity: line.quantity + addedQuantity,
              }
            : line,
        );
      }

      return [
        ...prev,
        {
          id: `item-${menu.id}-${Date.now()}`,
          type: "item",
          menuItemId: menu.id,
          name: menu.name,
          category: menu.category,
          price: Number(menu.price || 0),
          quantity: addedQuantity,
        },
      ];
    });

    setQuantity("1");
  }

  function addPackage(menuPackage: MenuPackage) {
    const addedQuantity = Number(quantity || 1);

    setOrderLines((prev) => {
      const existingLine = prev.find(
        (line) => line.menuPackageId === menuPackage.id,
      );

      if (existingLine) {
        return prev.map((line) =>
          line.menuPackageId === menuPackage.id
            ? {
                ...line,
                quantity: line.quantity + addedQuantity,
              }
            : line,
        );
      }

      return [
        ...prev,
        {
          id: `package-${menuPackage.id}-${Date.now()}`,
          type: "package",
          menuPackageId: menuPackage.id,
          name: menuPackage.name,
          price: Number(menuPackage.price || 0),
          quantity: addedQuantity,
        },
      ];
    });

    setQuantity("1");
  }

  function removeOrderLine(lineId: string) {
    setOrderLines((prev) => prev.filter((line) => line.id !== lineId));
  }

  async function createOrder(reservationId: string) {
    if (orderLines.length === 0) return;

    const response = await fetch(`${API_BASE_URL}/orders/my`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reservationId,
        items: orderLines.map((line) => ({
          menuItemId: line.menuItemId,
          menuPackageId: line.menuPackageId,
          quantity: line.quantity,
        })),
      }),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        data?.message || "Reservation created, but order failed.",
      );
    }
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

      const response = await createReservation(payload);

      try {
        await createOrder(response.id);
      } catch (orderError) {
        console.error(
          "Reservation created, but order creation failed:",
          orderError,
        );
      }

      router.push(
        `/reservation/success?code=${encodeURIComponent(
          response.reservationCode,
        )}`,
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create reservation",
      );
    }
  }

  return (
    <ProtectedRoute allowedRoles={["CUSTOMER"]}>
      <main
        className={`${inter.className} relative min-h-screen overflow-hidden bg-[#FFF8F1] text-[#4A3428]`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/about-preview.webp')] bg-cover bg-center opacity-50"
          aria-hidden="true"
        />

        <section className="relative z-10 px-6 py-10 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5 flex justify-end">
              <Link href="/customer">
                <Button variant="outline">← Back to Dashboard</Button>
              </Link>
            </div>

            <Card className="mb-8 bg-white/65">
              <p
                className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
              >
                Whisk & Wonder Customer
              </p>

              <h1
                className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B] sm:text-5xl`}
              >
                Create Reservation
              </h1>

              <p
                className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
              >
                reserve your elegant tea experience
              </p>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
                Fill in your reservation details, choose your preferred time,
                and add menu selections for your afternoon tea experience.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <StatusBadge status="reservation booking" />
                <StatusBadge status="menu selection" />
                <StatusBadge status="customer access" />
              </div>
            </Card>

            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <Card className="bg-white/75">
                <div className="text-center">
                  <p
                    className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
                  >
                    Reservation Form
                  </p>

                  <h2
                    className={`${cinzel.className} mt-3 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                  >
                    Book Your Table
                  </h2>

                  <p
                    className={`${greatVibes.className} mt-2 text-3xl text-[#E8B7C8]`}
                  >
                    warmth and wonder await
                  </p>

                  <p className="mt-3 text-sm leading-7 text-[#7D6E66]">
                    All reservation fields are required.
                  </p>
                </div>

                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="mt-8 space-y-5"
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <Input
                      label="Guest Name"
                      readOnly
                      {...register("guestName")}
                      className="cursor-not-allowed opacity-70"
                    />

                    <Input
                      label="Email Address"
                      readOnly
                      {...register("guestEmail")}
                      className="cursor-not-allowed opacity-70"
                    />

                    <Input
                      label="Phone Number"
                      readOnly
                      {...register("guestPhone")}
                      className="cursor-not-allowed opacity-70"
                    />

                    <Input
                      label="Number of Guests"
                      type="number"
                      min="1"
                      placeholder="2"
                      {...register("guestCount", { required: true })}
                    />

                    <Input
                      label="Reservation Date"
                      type="date"
                      {...register("reservationDate", { required: true })}
                    />

                    <div>
                      <label
                        className={`${cinzel.className} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#C8A86A]`}
                      >
                        Start Time
                      </label>

                      <select
                        {...register("startTime", { required: true })}
                        className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1]/80 px-5 py-3 text-sm text-[#315F5B] outline-none transition focus:border-[#8FBFBE]"
                      >
                        <option value="">Select time</option>
                        {timeOptions.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {error && (
                    <Card className="border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
                      {error}
                    </Card>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3"
                  >
                    {isSubmitting
                      ? "Creating Reservation..."
                      : orderLines.length > 0
                        ? "Create Reservation With Order"
                        : "Create Reservation"}
                  </Button>
                </form>
              </Card>

              <div className="space-y-6">
                <Card className="bg-white/75">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p
                        className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                      >
                        Menu Selection
                      </p>

                      <h2
                        className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                      >
                        Choose Your Afternoon Tea
                      </h2>

                      <p className="mt-2 text-sm leading-7 text-[#7D6E66]">
                        Search and filter menu items by category, then add them
                        to your reservation.
                      </p>
                    </div>

                    <StatusBadge status={`${orderLines.length} selected`} />
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-[1fr_220px_110px]">
                    <Input
                      placeholder="Search menu..."
                      value={menuSearch}
                      onChange={(event) => setMenuSearch(event.target.value)}
                    />

                    <select
                      value={categoryFilter}
                      onChange={(event) =>
                        setCategoryFilter(event.target.value)
                      }
                      className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none transition focus:border-[#8FBFBE]"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>

                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(event) => setQuantity(event.target.value)}
                      placeholder="Qty"
                    />
                  </div>
                </Card>

                <Card className="bg-white/75">
                  <p
                    className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                  >
                    Menu Items
                  </p>

                  {loadingMenus && (
                    <p className="mt-4 text-sm text-[#7D6E66]">
                      Loading menus...
                    </p>
                  )}

                  {!loadingMenus && filteredMenus.length === 0 && (
                    <p className="mt-4 text-sm text-[#7D6E66]">
                      No menu items found.
                    </p>
                  )}

                  <div className="mt-4 max-h-105 space-y-3 overflow-y-auto pr-1">
                    {filteredMenus.map((menu) => (
                      <div
                        key={menu.id}
                        className="flex flex-col gap-3 rounded-3xl border border-[#EBDDD1] bg-[#FFF8F1]/85 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold text-[#315F5B]">
                            {menu.name}
                          </p>

                          <p className="mt-1 text-sm text-[#7D6E66]">
                            {menu.category || "Uncategorized"} ·{" "}
                            {formatCurrency(menu.price)}
                          </p>
                        </div>

                        <Button
                          variant="secondary"
                          onClick={() => addMenuItem(menu)}
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-white/75">
                  <p
                    className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                  >
                    Menu Packages
                  </p>

                  <div className="mt-4 max-h-70 space-y-3 overflow-y-auto pr-1">
                    {filteredPackages.map((menuPackage) => (
                      <div
                        key={menuPackage.id}
                        className="flex flex-col gap-3 rounded-3xl border border-[#EBDDD1] bg-[#FFF8F1]/85 p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-semibold text-[#315F5B]">
                            {menuPackage.name}
                          </p>

                          <p className="mt-1 text-sm text-[#7D6E66]">
                            Package · {formatCurrency(menuPackage.price)}
                          </p>
                        </div>

                        <Button
                          variant="secondary"
                          onClick={() => addPackage(menuPackage)}
                        >
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-white/75">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p
                        className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                      >
                        Current Selection
                      </p>

                      <h3
                        className={`${cinzel.className} mt-2 text-xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                      >
                        Order Draft
                      </h3>
                    </div>

                    <p
                      className={`${cinzel.className} text-lg font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      {formatCurrency(orderTotal)}
                    </p>
                  </div>

                  {orderLines.length === 0 ? (
                    <p className="mt-4 text-sm text-[#7D6E66]">
                      No menu selected yet. You can also create a reservation
                      without menu selection.
                    </p>
                  ) : (
                    <div className="mt-4 space-y-3">
                      {orderLines.map((line) => (
                        <div
                          key={line.id}
                          className="flex flex-col gap-3 rounded-3xl bg-[#FFF8F1]/85 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold text-[#315F5B]">
                              {line.name}
                            </p>

                            <p className="mt-1 text-sm text-[#7D6E66]">
                              {line.type} · Qty {line.quantity} ·{" "}
                              {formatCurrency(line.price * line.quantity)}
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            className="text-red-600"
                            onClick={() => removeOrderLine(line.id)}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </section>

        <div className="relative z-10 mt-12">
          <Footer />
        </div>
      </main>
    </ProtectedRoute>
  );
}
