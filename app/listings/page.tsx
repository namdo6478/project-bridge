import type { Metadata } from "next";
import { listings } from "@/lib/data/listings";
import { filterListings } from "@/lib/utils/filter-listings";
import { buildListingsQuery } from "@/lib/utils/filter-listings";
import Link from "next/link";
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
    subcategory?: string | string[];
    region?: string | string[];
    condition?: string | string[];
    sort?: string | string[];
    status?: string | string[];
    priceMode?: string | string[];
    tradeOption?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const filters = {
    q: getFilterValue(params.q),
    category: getFilterValue(params.category),
    subcategory: getFilterValue(params.subcategory),
    region: getFilterValue(params.region),
    condition: getFilterValue(params.condition),
    status: getFilterValue(params.status),
    priceMode: getFilterValue(params.priceMode),
    tradeOption: getFilterValue(params.tradeOption),
  };
  const sort = getFilterValue(params.sort) || "newest";

  const filteredListings = filterListings(listings, filters);
  const sortedListings = [...filteredListings].sort((left, right) => {
    if (sort === "price-low") {
      return (left.price ?? Number.MAX_SAFE_INTEGER) - (right.price ?? Number.MAX_SAFE_INTEGER);
    }
    if (sort === "price-high") {
      return (right.price ?? -1) - (left.price ?? -1);
    }
    return right.createdAt.localeCompare(left.createdAt);
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">매물 목록</h1>
        <p className="mt-2 text-sm text-text-secondary">
          전국 축산기계 매물 {sortedListings.length}건
          {filters.q ||
          filters.category ||
          filters.subcategory ||
          filters.region ||
          filters.condition
          || filters.status
          || filters.priceMode
          || filters.tradeOption
            ? " (필터 적용됨)"
            : ""}
        </p>
      </div>

      <nav className="mb-6 flex gap-2 overflow-x-auto pb-1" aria-label="빠른 매물 분류">
        {[
          { label: "전체 매물", href: "/listings" },
          { label: "조사료 장비", href: buildListingsQuery({ category: "조사료 장비" }) },
          { label: "신품관", href: buildListingsQuery({ category: "신품관" }) },
          { label: "삽니다", href: buildListingsQuery({ category: "삽니다" }) },
          { label: "시운전 가능", href: buildListingsQuery({ status: "available", tradeOption: "시운전 가능" }) },
          { label: "가격 협의", href: buildListingsQuery({ status: "available", priceMode: "negotiable" }) },
        ].map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="shrink-0 rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-text-secondary transition hover:border-brand/30 hover:text-brand"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-72">
          <ListingFilters
            defaultQuery={filters.q}
            defaultCategory={filters.category}
            defaultSubcategory={filters.subcategory}
            defaultRegion={filters.region || "전국"}
            defaultCondition={filters.condition}
            defaultSort={sort}
            defaultStatus={filters.status}
            defaultPriceMode={filters.priceMode}
            defaultTradeOption={filters.tradeOption}
          />
        </aside>

        <div className="flex-1">
          <ListingGrid listings={sortedListings} />
        </div>
      </div>
    </div>
  );
}
