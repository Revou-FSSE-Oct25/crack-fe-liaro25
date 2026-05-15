import * as React from "react";

type InputProps = {
  label?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({
  label,
  className = "",
  id,
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-[#C8A86A]"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`w-full rounded-full border border-[#EBDDD1] bg-[#FFF8F1] px-5 py-3 text-sm text-[#315F5B] outline-none transition placeholder:text-[#B3A39A] focus:border-[#8FBFBE] focus:ring-2 focus:ring-[#8FBFBE]/20 ${className}`}
        {...props}
      />
    </div>
  );
}
