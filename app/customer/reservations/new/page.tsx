"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import { getCurrentUser } from "@/lib/auth";
import { createReservation } from "@/lib/reservation";
import { CreateReservationRequest, Menu } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://whiskandwonder.up.railway.app";

type CustomerProfile = {
  name: string;
  email: string;
  phone?: string | null;
};

type SelectedMenu = {
  menuItemId: string;
  quantity: number;
};

export default function CustomerNewReservationPage() {
  const router = useRouter();

  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenus, setSelectedMenus] = useState<SelectedMenu[]>([]);
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

    async function fetchMenus() {
      try {
        const response = await fetch(`${API_BASE_URL}/menus/items`, {
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch menus");
        }

        setMenus(data.filter((menu: Menu) => menu.status === "available"));
      } catch (error) {
        console.error("Failed to fetch menus:", error);
      }
    }

    fillCustomerProfile();
    fetchMenus();
  }, [setValue]);

  function updateMenuQuantity(menuItemId: string, quantity: number) {
    setSelectedMenus((prevMenus) => {
      if (quantity <= 0) {
        return prevMenus.filter((item) => item.menuItemId !== menuItemId);
      }

      const existingMenu = prevMenus.find(
        (item) => item.menuItemId === menuItemId,
      );

      if (existingMenu) {
        return prevMenus.map((item) =>
          item.menuItemId === menuItemId ? { ...item, quantity } : item,
        );
      }

      return [...prevMenus, { menuItemId, quantity }];
    });
  }

  const estimatedTotal = useMemo(() => {
    return selectedMenus.reduce((total, selectedMenu) => {
      const menu = menus.find((item) => item.id === selectedMenu.menuItemId);

      if (!menu) return total;

      return total + Number(menu.price) * selectedMenu.quantity;
    }, 0);
  }, [menus, selectedMenus]);

  async function createOrder(reservationId: string) {
    if (selectedMenus.length === 0) {
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
        items: selectedMenus,
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

      if (selectedMenus.length > 0) {
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
      <main className="min-h-screen bg-[#f8f3ec] px-6 py-12">
        <section className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-[#b8895b]">
            Customer Reservation
          </p>

          <h1 className="mt-3 text-4xl font-bold text-[#2f241d]">
            Create Reservation
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#6f6258]">
            Your customer profile information is automatically filled in. Choose
            your reservation details and optionally add menu items to your
            order.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                  Guest Name
                </label>
                <input
                  {...register("guestName", { required: true })}
                  className="w-full rounded-xl border border-[#ead8c5] bg-[#f8f3ec] px-4 py-3 text-[#2f241d] outline-none"
                  readOnly
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                  Email
                </label>
                <input
                  type="email"
                  {...register("guestEmail", { required: true })}
                  className="w-full rounded-xl border border-[#ead8c5] bg-[#f8f3ec] px-4 py-3 text-[#2f241d] outline-none"
                  readOnly
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                  Phone
                </label>
                <input
                  {...register("guestPhone", { required: true })}
                  className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                  Reservation Date
                </label>
                <input
                  type="date"
                  {...register("reservationDate", { required: true })}
                  className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                  Start Time
                </label>
                <select
                  {...register("startTime", { required: true })}
                  className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
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
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#2f241d]">
                  Number of Guests
                </label>
                <input
                  type="number"
                  min="1"
                  {...register("guestCount", { required: true })}
                  className="w-full rounded-xl border border-[#ead8c5] bg-white px-4 py-3 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-[#ead8c5] bg-[#f8f3ec] p-5">
              <h2 className="text-xl font-semibold text-[#2f241d]">
                Add Menu Order
              </h2>

              <p className="mt-2 text-sm text-[#6f6258]">
                Optional. Select menu items to order together with your
                reservation.
              </p>

              <div className="mt-5 space-y-3">
                {menus.map((menu) => {
                  const selectedMenu = selectedMenus.find(
                    (item) => item.menuItemId === menu.id,
                  );

                  return (
                    <div
                      key={menu.id}
                      className="flex flex-col gap-3 rounded-xl bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-[#2f241d]">
                          {menu.name}
                        </p>
                        <p className="mt-1 text-sm text-[#6f6258]">
                          {menu.category} · Rp{" "}
                          {Number(menu.price).toLocaleString("id-ID")}
                        </p>
                      </div>

                      <input
                        type="number"
                        min="0"
                        value={selectedMenu?.quantity || 0}
                        onChange={(event) =>
                          updateMenuQuantity(
                            menu.id,
                            Number(event.target.value),
                          )
                        }
                        className="w-24 rounded-xl border border-[#ead8c5] px-4 py-2 text-[#2f241d] outline-none transition focus:border-[#b8895b]"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-[#ead8c5] pt-4">
                <p className="text-sm font-medium text-[#6f6258]">
                  Estimated subtotal
                </p>
                <p className="text-lg font-bold text-[#b8895b]">
                  Rp {estimatedTotal.toLocaleString("id-ID")}
                </p>
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-500">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-[#2f241d] px-5 py-4 text-sm font-medium text-white transition hover:bg-[#4a3a30] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating reservation..." : "Create Reservation"}
            </button>
          </form>
        </section>
      </main>
    </ProtectedRoute>
  );
}
