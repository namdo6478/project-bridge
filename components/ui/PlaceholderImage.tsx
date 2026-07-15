import Image from "next/image";
import type { ListingCategory } from "@/lib/types/listing";

interface PlaceholderImageProps {
  category: ListingCategory;
  className?: string;
  priority?: boolean;
}

export function PlaceholderImage({
  category,
  className = "",
  priority = false,
}: PlaceholderImageProps) {
  return (
    <div
      className={`relative overflow-hidden bg-surface-muted ${className}`}
      aria-label={`${category} 이미지`}
    >
      <Image
        src="/images/placeholder-machinery.svg"
        alt={`${category} 플레이스홀더 이미지`}
        fill
        className="object-cover"
        priority={priority}
      />
      <span className="absolute bottom-2 left-2 rounded bg-brand/90 px-2 py-0.5 text-xs font-medium text-white">
        {category}
      </span>
    </div>
  );
}
