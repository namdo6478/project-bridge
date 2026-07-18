import type { Metadata } from "next";
import Link from "next/link";
import { WantedForm } from "@/components/wanted/WantedForm";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { listings } from "@/lib/data/listings";

export const metadata: Metadata = {
  title: "삽니다 · 구매 요청",
  description: "축산기계 구매 요청을 살펴보거나 찾는 장비 조건을 직접 등록하세요.",
};

export default function WantedPage() {
  const wantedListings = listings
    .filter((listing) => listing.status === "구매요청")
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));

  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-brand">WANTED BOARD</p>
            <h1 className="mt-1 text-3xl font-bold text-text-primary">삽니다 · 구매 요청</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
              구매자가 찾는 장비를 확인하고, 보유한 장비가 조건에 맞으면 휴대폰 인증 후 직접 연락하세요.
              운영자는 장비를 찾아주거나 거래를 중개하지 않습니다.
            </p>
          </div>
          <a href="#register" className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-bold text-white">
            구매 요청 등록하기
          </a>
        </div>

        <section className="mt-8" aria-labelledby="wanted-list-title">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="wanted-list-title" className="text-2xl font-bold text-text-primary">최근 구매 요청</h2>
              <p className="mt-1 text-sm text-text-secondary">현재 연락 가능한 요청 {wantedListings.length}건</p>
            </div>
            <Link href="/listings?category=%EC%82%BD%EB%8B%88%EB%8B%A4" className="text-sm font-bold text-brand hover:underline">
              지역·품목으로 자세히 찾기
            </Link>
          </div>
          <ListingGrid listings={wantedListings} />
        </section>

        <section id="register" className="mt-14 scroll-mt-24 border-t border-border pt-10" aria-labelledby="wanted-register-title">
          <p className="text-sm font-semibold text-brand">POST A REQUEST</p>
          <h2 id="wanted-register-title" className="mt-1 text-2xl font-bold text-text-primary">찾는 장비 직접 등록</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
            품목, 필요한 규격, 예산과 확인 가능한 지역을 구체적으로 적으면 장비를 보유한 판매자가 판단하기 쉽습니다.
          </p>
          <div className="mt-7"><WantedForm /></div>
        </section>
      </div>
    </div>
  );
}
