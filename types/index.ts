export type UserRole = "ADMIN" | "CUSTOMER";

export interface LoginResponse {
  accessToken: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Reservation {
  id: string;
  reservationCode: string;
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  status: string;
}
