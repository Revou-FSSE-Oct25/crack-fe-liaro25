type InputProps = {
  label?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-text-secondary">{label}</label>}

      <input
        className={`
          border 
          border-border-soft 
          rounded-xl 
          px-3 
          py-2 
          focus:outline-none 
          focus:ring-2 
          focus:ring-primary
          ${className}
        `}
        {...props}
      />
    </div>
  );
}
