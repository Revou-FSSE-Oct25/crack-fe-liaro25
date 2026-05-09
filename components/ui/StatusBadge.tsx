type ReservationStatus =
  | "pending"
  | "approved"
  | "cancelled"
  | "completed"
  | "no_show";

type PaymentStatus = "unpaid" | "paid" | "partial" | "refunded";

type StatusBadgeProps = {
  status: ReservationStatus | PaymentStatus;
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    pending: "bg-accent2 text-text-primary",
    approved: "bg-accent text-text-primary",
    cancelled: "bg-[#F8D7DA] text-[#7A1F2A]",
    completed: "bg-secondary text-white",
    no_show: "bg-[#E5E7EB] text-[#374151]",
    unpaid: "bg-[#FDE68A] text-[#78350F]",
    paid: "bg-accent text-text-primary",
    partial: "bg-[#FCD34D] text-[#78350F]",
    refunded: "bg-[#DBEAFE] text-[#1E3A8A]",
  };

  const label = status.replace("_", " ");

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${styles[status]}`}
    >
      {label}
    </span>
  );
}
