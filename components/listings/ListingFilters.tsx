import Link from "next/link";
import {
  LISTING_CATEGORIES,
  LISTING_REGIONS,
  LISTING_SUBCATEGORIES,
} from "@/lib/types/listing";

interface ListingFiltersProps {
  defaultQuery?: string;
  defaultCategory?: string;
  defaultSubcategory?: string;
  defaultRegion?: string;
  defaultCondition?: string;
}

export function ListingFilters({
  defaultQuery = "",
  defaultCategory = "",
  defaultSubcategory = "",
  defaultRegion = "",
  defaultCondition = "",
}: ListingFiltersProps) {
  return (
    <form
      action="/listings"
      method="get"
      className="rounded-lg border border-border bg-white p-4 sm:p-5"
    >
      <h2 className="mb-4 text-sm font-semibold text-text-primary">매물 검색</h2>

      <div className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="filter-q"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            검색어
          </label>
          <input
            id="filter-q"
            name="q"
            type="search"
            defaultValue={defaultQuery}
            placeholder="기계명, 제조사 등"
            className="w-full rounded-md border border-border px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          />
        </div>

        <div>
          <label
            htmlFor="filter-category"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            카테고리
          </label>
          <select
            id="filter-category"
            name="category"
            defaultValue={defaultCategory}
            className="w-full rounded-md border border-border px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">전체 카테고리</option>
            {LISTING_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-subcategory"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            세부 품목
          </label>
          <select
            id="filter-subcategory"
            name="subcategory"
            defaultValue={defaultSubcategory}
            className="w-full rounded-md border border-border px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">전체 세부 품목</option>
            {LISTING_CATEGORIES.map((category) => (
              <optgroup key={category} label={category}>
                {LISTING_SUBCATEGORIES[category].map((subcategory) => (
                  <option key={`${category}-${subcategory}`} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-region"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            지역
          </label>
          <select
            id="filter-region"
            name="region"
            defaultValue={defaultRegion}
            className="w-full rounded-md border border-border px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            {LISTING_REGIONS.map((region) => (
              <option key={region} value={region}>
                {region === "전국" ? "전국" : region}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="filter-condition"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            장비 상태
          </label>
          <select
            id="filter-condition"
            name="condition"
            defaultValue={defaultCondition}
            className="w-full rounded-md border border-border px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="">신품·중고 전체</option>
            <option value="중고">중고</option>
            <option value="신품">신품</option>
          </select>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="submit"
            className="flex-1 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            검색
          </button>
          <Link
            href="/listings"
            className="rounded-md border border-border px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-muted"
          >
            초기화
          </Link>
        </div>
      </div>
    </form>
  );
}
