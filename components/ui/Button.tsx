import * as React from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "soft";

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
    "inline-flex items-center justify-center rounded-xl px-4 py-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50";

  const variants: Record<ButtonVariant, string> = {
    primary: "bg-primary text-white hover:opacity-90",
    secondary: "bg-secondary text-white hover:opacity-90",
    outline:
      "border border-border-soft bg-white text-text-primary hover:bg-background",
    soft: "bg-accent text-text-primary hover:opacity-90",
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
