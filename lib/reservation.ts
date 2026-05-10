import { apiFetch } from "@/lib/api";
import { CreateReservationRequest, Reservation } from "@/types";

export function createReservation(data: CreateReservationRequest) {
  return apiFetch<Reservation>("/reservations", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function getReservationByCode(code: string) {
  return apiFetch<Reservation>(`/reservations/code/${code}`);
}
