import type { SaleStatus } from "@/lib/types/listing";

const statusStyles: Record<SaleStatus, string> = {
  판매중: "bg-brand/10 text-brand border-brand/20",
  예약중: "bg-amber-50 text-amber-700 border-amber-200",
  판매완료: "bg-gray-100 text-gray-500 border-gray-200",
  구매요청: "bg-blue-50 text-blue-700 border-blue-200",
};

interface StatusBadgeProps {
  status: SaleStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="inline-flex items-center rounded bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-secondary">
      {category}
    </span>
  );
}
