import Link from "next/link";
import { getAllListings } from "@/lib/data/listing-repository";
import {
  LISTING_CATEGORIES,
  LISTING_CATEGORY_DETAILS,
  LISTING_REGIONS,
} from "@/lib/types/listing";
import { buildListingsQuery } from "@/lib/utils/filter-listings";
import { ListingGrid } from "@/components/listings/ListingGrid";

export default async function HomePage() {
  const listings = await getAllListings();
  const openListings = listings.filter((item) => item.status !== "판매완료");
  const featuredListings = openListings.slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-[linear-gradient(135deg,#f4f8f5_0%,#ffffff_56%,#fff7ed_100%)]">
        <div className="absolute -right-20 -top-28 h-80 w-80 rounded-full border-[48px] border-brand/5" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1fr_420px] lg:items-center lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <p className="inline-flex rounded-full border border-brand/15 bg-white px-3 py-1 text-sm font-semibold text-brand shadow-sm">
              전국 축산 현장을 잇는 장비 거래
            </p>
            <h1 className="mt-5 text-4xl font-bold leading-[1.15] tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              필요한 장비는 찾고,
              <br />
              <span className="text-brand">쓰지 않는 장비는 팔고</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-text-secondary sm:text-lg">
              조사료 장비부터 축사 설비, 부품과 신품까지. 지역과 세부 품목으로
              빠르게 찾고 거래 조건을 한눈에 비교하세요.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/listings"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-light"
              >
                매물 찾기
              </Link>
              <Link
                href="/sell"
                className="inline-flex min-h-12 items-center justify-center rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-accent-hover"
              >
                장비 팔기
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
              <span><strong className="text-text-primary">전국</strong> 지역 검색</span>
              <span><strong className="text-text-primary">7개</strong> 대분류</span>
              <span><strong className="text-text-primary">무료</strong> 매물 등록 준비 중</span>
            </div>
          </div>

          <form
            action="/listings"
            method="get"
            className="rounded-2xl border border-white/80 bg-white p-5 shadow-[0_16px_50px_rgba(26,86,50,0.12)] sm:p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                  QUICK SEARCH
                </p>
                <h2 className="mt-1 text-xl font-bold text-text-primary">
                  원하는 장비 바로 찾기
                </h2>
              </div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-semibold text-brand">
                {openListings.length}건 거래 가능
              </span>
            </div>
            <div className="mt-6 space-y-3">
              <label className="block">
                <span className="sr-only">검색어</span>
                <input
                  name="q"
                  type="search"
                  placeholder="장비명 또는 제조사를 입력하세요"
                  className="w-full rounded-lg border border-border px-4 py-3 text-sm outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/10"
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label>
                  <span className="sr-only">카테고리</span>
                  <select
                    name="category"
                    defaultValue=""
                    className="w-full rounded-lg border border-border bg-white px-3 py-3 text-sm text-text-secondary outline-none focus:border-brand"
                  >
                    <option value="">전체 카테고리</option>
                    {LISTING_CATEGORIES.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className="sr-only">지역</span>
                  <select
                    name="region"
                    defaultValue="전국"
                    className="w-full rounded-lg border border-border bg-white px-3 py-3 text-sm text-text-secondary outline-none focus:border-brand"
                  >
                    {LISTING_REGIONS.map((region) => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </label>
              </div>
              <button
                type="submit"
                className="w-full rounded-lg bg-accent px-5 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
              >
                조건에 맞는 매물 보기
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-brand">CATEGORY</p>
            <h2 className="mt-1 text-2xl font-bold text-text-primary">장비 종류별로 찾기</h2>
          </div>
          <p className="text-sm text-text-secondary">현장 기준 7개 대분류로 정리했습니다.</p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {LISTING_CATEGORIES.map((category) => {
            const detail = LISTING_CATEGORY_DETAILS[category];
            const count = openListings.filter((item) => item.category === category).length;

            return (
              <Link
                key={category}
                href={buildListingsQuery({ category })}
                className="group rounded-xl border border-border bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-xs font-bold text-brand transition group-hover:bg-brand group-hover:text-white">
                  {detail.shortLabel}
                </span>
                <p className="mt-4 text-sm font-bold leading-snug text-text-primary">{category}</p>
                <p className="mt-1 hidden text-xs leading-relaxed text-text-muted lg:block">{detail.description}</p>
                <p className="mt-3 text-xs font-medium text-brand">거래 가능 {count}건</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="border-y border-border bg-surface-muted">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-brand">NEW LISTINGS</p>
              <h2 className="mt-1 text-2xl font-bold text-text-primary">새로 올라온 장비</h2>
            </div>
            <Link href="/listings" className="shrink-0 text-sm font-semibold text-brand hover:underline">
              전체 매물 보기
            </Link>
          </div>
          <ListingGrid listings={featuredListings} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid overflow-hidden rounded-2xl bg-brand text-white lg:grid-cols-[1fr_420px]">
          <div className="p-7 sm:p-10">
            <p className="text-sm font-semibold text-white/70">SELL YOUR EQUIPMENT</p>
            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">창고에 쉬고 있는 장비가 있나요?</h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-white/75">
              장비 정보와 사진, 희망 가격을 입력하면 등록 준비가 끝납니다. 현재는 등록 화면을 먼저 확인할 수 있습니다.
            </p>
            <Link
              href="/sell"
              className="mt-7 inline-flex rounded-lg bg-accent px-6 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
            >
              장비 등록 시작하기
            </Link>
          </div>
          <ol className="grid grid-cols-3 border-t border-white/15 lg:grid-cols-1 lg:border-l lg:border-t-0">
            {[
              ["01", "장비 정보"],
              ["02", "사진·가격"],
              ["03", "연락처 확인"],
            ].map(([number, label]) => (
              <li key={number} className="flex flex-col justify-center border-r border-white/15 p-5 last:border-r-0 lg:border-b lg:border-r-0 lg:last:border-b-0">
                <span className="text-xs font-bold text-accent">{number}</span>
                <span className="mt-1 text-sm font-semibold">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
