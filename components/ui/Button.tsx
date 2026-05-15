import * as React from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "soft"
  | "gold"
  | "ghost";

type ButtonProps = {
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  wiggleOnHover?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  wiggleOnHover = false,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#8FBFBE]/30 disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-[#315F5B] text-white shadow-lg shadow-teal-900/15 hover:-translate-y-0.5 hover:bg-[#264C49]",

    secondary:
      "bg-[#E8B7C8] text-white shadow-lg shadow-pink-200/40 hover:-translate-y-0.5 hover:bg-[#DFA6BA]",

    outline:
      "border border-[#DCCBBB] bg-white/70 text-[#315F5B] backdrop-blur-sm hover:bg-[#FFF8F1]",

    soft: "bg-[#DCEFF0] text-[#315F5B] hover:bg-[#CFE7E8]",

    gold: "bg-[#C8A86A] text-white shadow-lg shadow-amber-200/30 hover:bg-[#B89552]",

    ghost: "bg-transparent text-[#315F5B] hover:bg-white/50",
  };

  const hoverEffect = wiggleOnHover
    ? "hover:animate-[wiggle_0.35s_ease-in-out]"
    : "";

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${hoverEffect} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
