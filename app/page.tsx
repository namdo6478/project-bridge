import Link from "next/link";
import { listings } from "@/lib/data/listings";
import { LISTING_CATEGORIES } from "@/lib/types/listing";
import { buildListingsQuery } from "@/lib/utils/filter-listings";
import { ListingGrid } from "@/components/listings/ListingGrid";

export default function HomePage() {
  const activeListings = listings.filter((item) => item.status === "판매중");
  const featuredListings = activeListings.slice(0, 6);

  return (
    <>
      <section className="border-b border-border bg-surface-muted">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-brand">전국 축산기계 거래</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-text-primary sm:text-4xl lg:text-5xl">
              믿을 수 있는
              <br />
              <span className="text-brand">축산기계장터</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-text-secondary sm:text-lg">
              사각압축포장기, 사료배합기, 컨베이어 등 전국 축산기계 중고·신품
              매물을 한곳에서 검색하고 비교하세요.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/listings"
                className="inline-flex items-center justify-center rounded-md bg-accent px-6 py-3 text-sm font-semibold text-white hover:bg-accent-hover"
              >
                매물 둘러보기
              </Link>
              <Link
                href={buildListingsQuery({ category: "사각압축포장기" })}
                className="inline-flex items-center justify-center rounded-md border border-brand px-6 py-3 text-sm font-semibold text-brand hover:bg-brand/5"
              >
                사각압축포장기 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h2 className="text-lg font-bold text-text-primary">카테고리</h2>
        <p className="mt-1 text-sm text-text-secondary">
          원하는 축산기계 종류를 선택하세요
        </p>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {LISTING_CATEGORIES.map((category) => {
            const count = listings.filter(
              (item) => item.category === category && item.status === "판매중",
            ).length;

            return (
              <Link
                key={category}
                href={buildListingsQuery({ category })}
                className="rounded-lg border border-border bg-white px-4 py-4 hover:border-brand/30 hover:bg-brand/5"
              >
                <p className="text-sm font-semibold text-text-primary">
                  {category}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  판매중 {count}건
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-t border-border bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-text-primary">최신 매물</h2>
              <p className="mt-1 text-sm text-text-secondary">
                현재 등록된 판매중 매물
              </p>
            </div>
            <Link
              href="/listings"
              className="shrink-0 text-sm font-medium text-brand hover:underline"
            >
              전체 보기
            </Link>
          </div>
          <ListingGrid listings={featuredListings} />
        </div>
      </section>

      <section className="border-t border-border bg-surface-muted">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-white p-6 text-center">
              <p className="text-2xl font-bold text-brand">{listings.length}</p>
              <p className="mt-1 text-sm text-text-secondary">등록 매물</p>
            </div>
            <div className="rounded-lg border border-border bg-white p-6 text-center">
              <p className="text-2xl font-bold text-brand">
                {activeListings.length}
              </p>
              <p className="mt-1 text-sm text-text-secondary">판매중 매물</p>
            </div>
            <div className="rounded-lg border border-border bg-white p-6 text-center">
              <p className="text-2xl font-bold text-brand">
                {LISTING_CATEGORIES.length}
              </p>
              <p className="mt-1 text-sm text-text-secondary">카테고리</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
