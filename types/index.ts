export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface Reservation {
  id: string;
  userId?: string | null;

  guestName: string;
  guestEmail: string;
  guestPhone: string;
  reservationCode: string;
  reservationDate: string;
  startTime: string;
  endTime?: string;
  guestCount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  tables?: {
    id: string;
    table: {
      id: string;
      name: string;
      capacity: number;
      status: string;
    };
  }[];

  order?: unknown | null;
}

export interface CreateReservationRequest {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  reservationDate: string;
  startTime: string;
  guestCount: number;
}

export type ReservationResponse = Reservation;

export interface Table {
  id: string;
  name: string;
  capacity: number;
  status: string;
}

export interface Menu {
  id: string;
  name: string;
  category: string;
  price: string;
  status: string;
}
