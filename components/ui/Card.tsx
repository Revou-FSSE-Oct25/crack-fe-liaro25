type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={`
        bg-surface 
        border 
        border-border-soft 
        rounded-2xl 
        p-6 
        shadow-sm 
        ${className}
      `}
    >
      {children}
    </div>
  );
}
