import type { Metadata } from "next";
import { listings } from "@/lib/data/listings";
import { filterListings } from "@/lib/utils/filter-listings";
import { ListingFilters } from "@/components/listings/ListingFilters";
import { ListingGrid } from "@/components/listings/ListingGrid";

export const metadata: Metadata = {
  title: "매물 목록",
  description: "전국 축산기계 매물을 카테고리, 지역, 검색어로 필터링하여 찾아보세요.",
};

function getFilterValue(
  value: string | string[] | undefined,
): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    region?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const filters = {
    q: getFilterValue(params.q),
    category: getFilterValue(params.category),
    region: getFilterValue(params.region),
  };

  const filteredListings = filterListings(listings, filters);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">매물 목록</h1>
        <p className="mt-2 text-sm text-text-secondary">
          전국 축산기계 매물 {filteredListings.length}건
          {filters.q || filters.category || filters.region
            ? " (필터 적용됨)"
            : ""}
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <ListingFilters
            defaultQuery={filters.q}
            defaultCategory={filters.category}
            defaultRegion={filters.region || "전국"}
          />
        </aside>

        <div className="flex-1">
          <ListingGrid listings={filteredListings} />
        </div>
      </div>
    </div>
  );
}
