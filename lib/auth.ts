import { User } from "@/types";

export function saveToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export function removeToken() {
  localStorage.removeItem("token");
}

export function saveUser(user: User) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem("user");
  if (!user) return null;

  return JSON.parse(user);
}

export function logout() {
  removeToken();
  localStorage.removeItem("user");
}
