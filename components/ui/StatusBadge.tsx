type StatusBadgeProps = {
  status: string;
  className?: string;
};

function getStatusClass(status: string) {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-[#FFF3C4] text-[#9A6A00]";
    case "confirmed":
    case "paid":
      return "bg-[#DDF2E3] text-[#2F6B45]";
    case "cancelled":
    case "failed":
      return "bg-[#F8D7DA] text-[#9B2C2C]";
    case "completed":
      return "bg-[#DCEFF0] text-[#315F5B]";
    default:
      return "bg-[#F2ECE6] text-[#7D6E66]";
  }
}

export default function StatusBadge({
  status,
  className = "",
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold capitalize ${getStatusClass(
        status,
      )} ${className}`}
    >
      {status}
    </span>
  );
}
