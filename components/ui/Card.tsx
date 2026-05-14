import * as React from "react";

type CardProps = {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Card({
  children,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-4xl border border-white/70 bg-white/70 p-6 shadow-xl shadow-pink-100/30 backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
