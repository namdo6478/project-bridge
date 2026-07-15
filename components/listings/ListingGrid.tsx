import type { Listing } from "@/lib/types/listing";
import { ListingCard } from "@/components/listings/ListingCard";

interface ListingGridProps {
  listings: Listing[];
}

export function ListingGrid({ listings }: ListingGridProps) {
  if (listings.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-white px-6 py-16 text-center">
        <p className="text-base font-medium text-text-primary">
          조건에 맞는 매물이 없습니다
        </p>
        <p className="mt-2 text-sm text-text-secondary">
          검색어나 필터 조건을 변경해 다시 검색해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          priority={index < 3}
        />
      ))}
    </div>
  );
}
