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
  reservationCode: string;
  customerName: string;
  reservationDate: string;
  reservationTime: string;
  guestCount: number;
  status: string;
}
