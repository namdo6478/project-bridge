import type { Listing } from "@/lib/types/listing";
import Link from "next/link";
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
          검색어를 짧게 입력하거나 지역·상태 조건을 하나씩 줄여보세요.
        </p>
        <Link href="/listings" className="mt-5 inline-flex rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-light">
          전체 매물 다시 보기
        </Link>
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
