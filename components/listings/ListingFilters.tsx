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
  defaultSort?: string;
}

export function ListingFilters({
  defaultQuery = "",
  defaultCategory = "",
  defaultSubcategory = "",
  defaultRegion = "",
  defaultCondition = "",
  defaultSort = "newest",
}: ListingFiltersProps) {
  const activeFilterCount = [
    defaultQuery,
    defaultCategory,
    defaultSubcategory,
    defaultRegion && defaultRegion !== "전국" ? defaultRegion : "",
    defaultCondition,
  ].filter(Boolean).length;

  return (
    <details className="group rounded-lg border border-border bg-white lg:border-0 lg:bg-transparent">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-text-primary lg:hidden">
        <span>검색 조건</span>
        <span className="flex items-center gap-2">
          {activeFilterCount > 0 && <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-bold text-brand">{activeFilterCount}개 적용</span>}
          <span className="text-xs font-medium text-brand group-open:hidden">필터 열기</span>
          <span className="hidden text-xs font-medium text-brand group-open:inline">필터 닫기</span>
        </span>
      </summary>
      <form
        action="/listings"
        method="get"
        className="hidden border-t border-border p-4 group-open:block sm:p-5 lg:block lg:rounded-lg lg:border lg:border-border lg:bg-white"
      >
      <h2 className="hidden text-sm font-semibold text-text-primary lg:block">매물 검색</h2>
      <p className="mb-4 text-xs leading-relaxed text-text-muted lg:mt-1">원하는 조건만 선택해도 됩니다. 조건을 적게 선택할수록 더 많은 매물이 보입니다.</p>

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
            placeholder="예: 원형베일러, 명성"
            className="w-full rounded-md border border-border px-3 py-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
            className="w-full rounded-md border border-border px-3 py-3 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
            htmlFor="filter-sort"
            className="mb-1.5 block text-sm font-medium text-text-secondary"
          >
            정렬
          </label>
          <select
            id="filter-sort"
            name="sort"
            defaultValue={defaultSort}
            className="w-full rounded-md border border-border px-3 py-3 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="newest">최신 등록순</option>
            <option value="price-low">낮은 가격순</option>
            <option value="price-high">높은 가격순</option>
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
            className="w-full rounded-md border border-border px-3 py-3 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
            className="w-full rounded-md border border-border px-3 py-3 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
            className="w-full rounded-md border border-border px-3 py-3 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
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
    </details>
  );
}
