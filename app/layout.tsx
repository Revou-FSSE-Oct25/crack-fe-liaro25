import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Whisk & Wonder",
  description: "Elegant Afternoon Tea Reservation System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
