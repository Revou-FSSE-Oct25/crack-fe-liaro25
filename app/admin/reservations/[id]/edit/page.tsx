"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Cinzel, Great_Vibes, Inter } from "next/font/google";

import ProtectedRoute from "@/components/layout/ProtectedRoute";
import Footer from "@/components/home/Footer";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import StatusBadge from "@/components/ui/StatusBadge";
import { Menu, MenuPackage, Reservation, Table } from "@/types";

const API_URL = "https://whiskandwonder.up.railway.app";

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

const statusOptions = ["pending", "confirmed", "cancelled", "completed"];

type OrderLine = {
  id: string;
  type: "item" | "package";
  name: string;
  menuItemId?: string;
  menuPackageId?: string;
  price: number;
  quantity: number;
};

function formatCurrency(value: string | number) {
  return `Rp ${Number(value || 0).toLocaleString("id-ID")}`;
}

function getDateValue(dateString?: string) {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
}

export default function AdminReservationEditPage() {
  const params = useParams();
  const router = useRouter();

  const reservationId = params.id as string;

  const [reservation, setReservation] = useState<Reservation | null>(null);
  const [tables, setTables] = useState<Table[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [packages, setPackages] = useState<MenuPackage[]>([]);

  const [loading, setLoading] = useState(true);
  const [savingReservation, setSavingReservation] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [reservationDate, setReservationDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [status, setStatus] = useState("pending");
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);

  const [selectedMenuItemId, setSelectedMenuItemId] = useState("");
  const [selectedPackageId, setSelectedPackageId] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  async function fetchInitialData() {
    try {
      setLoading(true);
      setError("");

      const [
        reservationResponse,
        tablesResponse,
        menusResponse,
        packagesResponse,
        ordersResponse,
      ] = await Promise.all([
        fetch(`${API_URL}/reservations/${reservationId}`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/tables`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/menus/items`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/menus/packages`, {
          credentials: "include",
        }),
        fetch(`${API_URL}/orders`, {
          credentials: "include",
        }),
      ]);

      const reservationData = await reservationResponse.json();
      const tablesData = await tablesResponse.json();
      const menusData = await menusResponse.json();
      const packagesData = await packagesResponse.json();
      const ordersData = await ordersResponse.json();

      const orderList = Array.isArray(ordersData)
        ? ordersData
        : ordersData.data || [];

      const reservationOrder =
        reservationData.order ||
        orderList.find(
          (order: any) =>
            order.reservationId === reservationId ||
            order.reservation?.id === reservationId,
        );

      const mergedReservation = {
        ...reservationData,
        order: reservationOrder,
      };

      setReservation(mergedReservation);
      setTables(Array.isArray(tablesData) ? tablesData : []);
      setMenus(Array.isArray(menusData) ? menusData : []);
      setPackages(Array.isArray(packagesData) ? packagesData : []);

      setGuestName(reservationData.guestName || "");
      setGuestEmail(reservationData.guestEmail || "");
      setGuestPhone(reservationData.guestPhone || "");
      setReservationDate(getDateValue(reservationData.reservationDate));
      setStartTime(reservationData.startTime || "");
      setEndTime(reservationData.endTime || "");
      setGuestCount(String(reservationData.guestCount || ""));
      setStatus(reservationData.status || "pending");

      setSelectedTableIds(
        reservationData.tables?.map(
          (item: { table: { id: string } }) => item.table.id,
        ) || [],
      );

      const existingOrderLines: OrderLine[] =
        reservationOrder?.items?.map((item: any) => {
          const menuItem = item.menuItem;
          const menuPackage = item.menuPackage;

          return {
            id: item.id,
            type: menuItem ? "item" : "package",
            name: menuItem?.name || menuPackage?.name || "Menu Selection",
            menuItemId: item.menuItemId || menuItem?.id,
            menuPackageId: item.menuPackageId || menuPackage?.id,
            price: Number(menuItem?.price || menuPackage?.price || 0),
            quantity: Number(item.quantity || 1),
          };
        }) || [];

      setOrderLines(existingOrderLines);
    } catch (error) {
      console.error(error);
      setError("Failed to load reservation edit data.");
    } finally {
      setLoading(false);
    }
  }

  const orderTotal = useMemo(() => {
    return orderLines.reduce(
      (total, line) => total + line.price * line.quantity,
      0,
    );
  }, [orderLines]);

  function toggleTable(tableId: string) {
    setSelectedTableIds((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId],
    );
  }

  function addMenuItem() {
    const menu = menus.find((item) => item.id === selectedMenuItemId);
    if (!menu) return;

    setOrderLines((prev) => [
      ...prev,
      {
        id: `item-${menu.id}-${Date.now()}`,
        type: "item",
        menuItemId: menu.id,
        name: menu.name,
        price: Number(menu.price || 0),
        quantity: Number(quantity || 1),
      },
    ]);

    setSelectedMenuItemId("");
    setQuantity("1");
  }

  function addPackage() {
    const menuPackage = packages.find((item) => item.id === selectedPackageId);
    if (!menuPackage) return;

    setOrderLines((prev) => [
      ...prev,
      {
        id: `package-${menuPackage.id}-${Date.now()}`,
        type: "package",
        menuPackageId: menuPackage.id,
        name: menuPackage.name,
        price: Number(menuPackage.price || 0),
        quantity: Number(quantity || 1),
      },
    ]);

    setSelectedPackageId("");
    setQuantity("1");
  }

  function removeOrderLine(lineId: string) {
    setOrderLines((prev) => prev.filter((line) => line.id !== lineId));
  }

  async function updateReservation() {
    try {
      setSavingReservation(true);
      setMessage("");
      setError("");

      const response = await fetch(`${API_URL}/reservations/${reservationId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          guestName,
          guestEmail,
          guestPhone,
          reservationDate,
          startTime,
          endTime,
          guestCount: Number(guestCount),
          status,
          tableIds: selectedTableIds,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update reservation");
      }

      setMessage("Reservation updated successfully.");
      await fetchInitialData();
    } catch (error) {
      console.error(error);
      setError("Failed to update reservation.");
    } finally {
      setSavingReservation(false);
    }
  }

  async function createOrUpdateOrder() {
    if (orderLines.length === 0) {
      setError("Please add at least one menu item or package.");
      return;
    }

    if (reservation?.order?.id) {
      setError(
        "This reservation already has an order. Updating existing order items is not supported by the backend yet.",
      );
      return;
    }

    try {
      setSavingOrder(true);
      setMessage("");
      setError("");

      const payload = {
        reservationId,
        items: orderLines.map((line) => ({
          menuItemId: line.menuItemId,
          menuPackageId: line.menuPackageId,
          quantity: line.quantity,
        })),
      };

      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save order");
      }

      setMessage("Order saved successfully.");
      await fetchInitialData();
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Failed to save order.",
      );
    } finally {
      setSavingOrder(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["ADMIN"]}>
      <main
        className={`${inter.className} relative min-h-screen overflow-hidden bg-[#FFF8F1] px-6 py-10 text-[#4A3428] sm:px-10 lg:px-16`}
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[url('/images/about-preview.webp')] bg-cover bg-center opacity-50"
          aria-hidden="true"
        />

        <section className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-5 flex justify-end">
            <Button
              variant="outline"
              onClick={() =>
                router.push(`/admin/reservations/${reservationId}`)
              }
            >
              ← Back to Detail
            </Button>
          </div>

          <Card className="mb-8 bg-white/65">
            <p
              className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#8FBFBE]`}
            >
              Whisk & Wonder Admin
            </p>

            <h1
              className={`${cinzel.className} mt-4 text-4xl font-semibold uppercase leading-tight tracking-wider text-[#315F5B] sm:text-5xl`}
            >
              Edit Reservation
            </h1>

            <p
              className={`${greatVibes.className} mt-3 text-3xl text-[#E8B7C8] sm:text-4xl`}
            >
              refined with care and precision
            </p>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#7D6E66]">
              Update guest information, reservation schedule, table assignment,
              and add menu selections for this reservation.
            </p>
          </Card>

          {loading && <Card>Loading reservation editor...</Card>}

          {!loading && error && (
            <Card className="mb-4 bg-[#F8D7DA]/90 text-sm font-semibold text-[#9B2C2C]">
              {error}
            </Card>
          )}

          {!loading && message && (
            <Card className="mb-4 bg-[#DDF2E3]/90 text-sm font-semibold text-[#2F6B45]">
              {message}
            </Card>
          )}

          {!loading && reservation && (
            <div className="space-y-8">
              <Card className="bg-white/75">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p
                      className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                    >
                      Reservation Code
                    </p>

                    <h2
                      className={`${cinzel.className} mt-2 text-3xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      {reservation.reservationCode}
                    </h2>
                  </div>

                  <StatusBadge status={status} />
                </div>
              </Card>

              <Card className="bg-white/75">
                <h3
                  className={`${cinzel.className} text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                >
                  Guest & Schedule
                </h3>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <Input
                    label="Guest Name"
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                  />

                  <Input
                    label="Guest Email"
                    type="email"
                    value={guestEmail}
                    onChange={(event) => setGuestEmail(event.target.value)}
                  />

                  <Input
                    label="Guest Phone"
                    value={guestPhone}
                    onChange={(event) => setGuestPhone(event.target.value)}
                  />

                  <Input
                    label="Guest Count"
                    type="number"
                    value={guestCount}
                    onChange={(event) => setGuestCount(event.target.value)}
                  />

                  <Input
                    label="Reservation Date"
                    type="date"
                    value={reservationDate}
                    onChange={(event) => setReservationDate(event.target.value)}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Start Time"
                      type="time"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                    />

                    <Input
                      label="End Time"
                      type="time"
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                    />
                  </div>
                </div>

                <div className="mt-5">
                  <label
                    className={`${cinzel.className} mb-2 block text-xs font-semibold uppercase tracking-wider text-[#C8A86A]`}
                  >
                    Reservation Status
                  </label>

                  <select
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm capitalize text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20 md:max-w-sm"
                  >
                    {statusOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </Card>

              <Card className="bg-white/75">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p
                      className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                    >
                      Dining Setup
                    </p>

                    <h3
                      className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      Assign Tables
                    </h3>
                  </div>

                  <StatusBadge status={`${selectedTableIds.length} selected`} />
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {tables.map((table) => {
                    const selected = selectedTableIds.includes(table.id);

                    return (
                      <button
                        key={table.id}
                        type="button"
                        onClick={() => toggleTable(table.id)}
                        className={`rounded-3xl border p-5 text-left transition ${
                          selected
                            ? "border-[#8FBFBE] bg-[#DCEFF0]/80 shadow-lg shadow-teal-100/40"
                            : "border-[#EBDDD1] bg-[#FFF8F1]/85 hover:border-[#8FBFBE]"
                        }`}
                      >
                        <p
                          className={`${cinzel.className} text-lg font-semibold uppercase tracking-wider text-[#315F5B]`}
                        >
                          {table.name}
                        </p>

                        <p className="mt-2 text-sm text-[#7D6E66]">
                          Capacity: {table.capacity} guests
                        </p>

                        <div className="mt-3">
                          <StatusBadge
                            status={selected ? "selected" : table.status}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={updateReservation}
                  disabled={savingReservation}
                >
                  {savingReservation ? "Saving..." : "Save Reservation"}
                </Button>
              </div>

              <Card className="bg-white/75">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p
                      className={`${cinzel.className} text-xs font-semibold uppercase tracking-widest text-[#C8A86A]`}
                    >
                      Order Builder
                    </p>

                    <h3
                      className={`${cinzel.className} mt-2 text-2xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                    >
                      Add Menu Selection
                    </h3>

                    <p className="mt-3 max-w-2xl text-sm leading-7 text-[#7D6E66]">
                      Add menu items or afternoon tea packages to create or
                      update the order for this reservation.
                    </p>
                  </div>

                  {reservation.order?.status && (
                    <StatusBadge status={reservation.order.status} />
                  )}
                </div>

                <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_140px]">
                  <select
                    value={selectedMenuItemId}
                    onChange={(event) => {
                      setSelectedMenuItemId(event.target.value);
                      setSelectedPackageId("");
                    }}
                    className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
                  >
                    <option value="">Select menu item</option>
                    {menus.map((menu) => (
                      <option key={menu.id} value={menu.id}>
                        {menu.name} — {formatCurrency(menu.price)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedPackageId}
                    onChange={(event) => {
                      setSelectedPackageId(event.target.value);
                      setSelectedMenuItemId("");
                    }}
                    className="w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm text-[#315F5B] outline-none transition focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20"
                  >
                    <option value="">Select package</option>
                    {packages.map((menuPackage) => (
                      <option key={menuPackage.id} value={menuPackage.id}>
                        {menuPackage.name} — {formatCurrency(menuPackage.price)}
                      </option>
                    ))}
                  </select>

                  <Input
                    type="number"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    min={1}
                    placeholder="Qty"
                  />
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <Button
                    variant="secondary"
                    onClick={addMenuItem}
                    disabled={!selectedMenuItemId}
                  >
                    Add Item
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={addPackage}
                    disabled={!selectedPackageId}
                  >
                    Add Package
                  </Button>
                </div>

                <div className="mt-8">
                  <h4
                    className={`${cinzel.className} text-lg font-semibold uppercase tracking-wider text-[#315F5B]`}
                  >
                    Current Order
                  </h4>

                  {orderLines.length === 0 ? (
                    <p className="mt-4 text-sm text-[#7D6E66]">
                      No menu selection has been added yet.
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

                      <div className="flex justify-end border-t border-[#EBDDD1] pt-4">
                        <p
                          className={`${cinzel.className} text-xl font-semibold uppercase tracking-wider text-[#315F5B]`}
                        >
                          Total: {formatCurrency(orderTotal)}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={createOrUpdateOrder}
                      disabled={savingOrder || orderLines.length === 0}
                    >
                      {savingOrder ? "Saving..." : "Save Order"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </section>

        <div className="relative z-10 mt-12">
          <Footer />
        </div>
      </main>
    </ProtectedRoute>
  );
}
