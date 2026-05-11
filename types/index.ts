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

  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    dateOfBirth?: string | null;
    role: UserRole;
  } | null;

  tables?: {
    id: string;
    reservationId?: string;
    tableId?: string;
    table: {
      id: string;
      name: string;
      capacity: number;
      status: string;
    };
  }[];

  order?: Order | null;
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

export interface Order {
  id: string;
  reservationId: string;
  subtotal: string;
  tax: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  updatedAt?: string;

  reservation?: {
    id: string;
    guestName: string;
    guestEmail: string;
    reservationCode: string;
    reservationDate: string;
    startTime: string;
    endTime?: string;
    guestCount: number;
    status: string;
  };

  items?: {
    id: string;
    orderId: string;
    menuItemId?: string | null;
    menuPackageId?: string | null;
    quantity: number;
    price: string;
    menuItem?: {
      id: string;
      name: string;
      category: string;
      price: string;
      status: string;
    } | null;
    menuPackage?: unknown | null;
  }[];

  payments?: Payment[];
}

export interface Payment {
  id: string;
  orderId: string;
  amount: string;
  paymentType: string;
  status: string;
  paymentMethod: string;
  createdAt: string;

  order?: {
    id: string;
    reservationId: string;
    subtotal: string;
    tax: string;
    totalAmount: string;
    status: string;
    createdAt: string;
    updatedAt?: string;

    reservation?: {
      id: string;
      guestName: string;
      guestEmail: string;
      reservationCode: string;
      reservationDate: string;
      startTime: string;
      endTime?: string;
      guestCount: number;
      status: string;
    };
  };
}
