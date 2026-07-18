import type { Metadata } from "next";
import Link from "next/link";
import { MyListingsManager } from "@/components/listings/MyListingsManager";
import { MyWantedManager } from "@/components/wanted/MyWantedManager";
import { listings } from "@/lib/data/listings";

export const metadata: Metadata = {
  title: "내 등록 관리",
  description: "등록한 판매 매물과 구매 요청 상태를 한곳에서 관리하세요.",
};

export default function MyListingsPage() {
  const sellingSamples = listings.filter((listing) => listing.status !== "구매요청").slice(0, 3);
  const wantedSamples = listings.filter((listing) => listing.status === "구매요청").slice(0, 2);

  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-brand">MY POSTS</p>
            <h1 className="mt-1 text-3xl font-bold text-text-primary">내 등록 관리</h1>
            <p className="mt-2 text-sm text-text-secondary">판매하려는 장비와 찾고 있는 장비의 상태를 한곳에서 직접 관리합니다.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/wanted#register" className="rounded-lg border border-brand/25 bg-white px-5 py-3 text-center text-sm font-bold text-brand hover:bg-brand/5">구매 요청 등록</Link>
            <Link href="/sell" className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-bold text-white hover:bg-accent-hover">새 매물 등록</Link>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>화면 예시를 표시하고 있습니다.</strong>
          <p className="mt-1">현재 상태 변경은 이 기기에 저장됩니다. 실제 연결 후에는 본인이 등록한 판매 매물과 구매 요청만 표시됩니다.</p>
        </div>

        <nav className="mt-6 grid grid-cols-2 gap-3" aria-label="내 등록 바로가기">
          <a href="#selling" className="rounded-xl border border-brand/20 bg-white p-4 text-center text-sm font-bold text-brand">판매 매물 관리</a>
          <a href="#buying" className="rounded-xl border border-brand/20 bg-white p-4 text-center text-sm font-bold text-brand">구매 요청 관리</a>
        </nav>

        <section id="selling" className="mt-10 scroll-mt-24" aria-labelledby="selling-title">
          <div className="rounded-xl border border-brand/20 bg-white p-4 text-sm leading-relaxed text-text-secondary">
            <h2 id="selling-title" className="text-xl font-bold text-text-primary">판매 매물 관리</h2>
            <p className="mt-2">30일마다 현재도 거래 가능한지 확인해 주세요. 60일 넘게 확인되지 않은 매물은 검색에서 잠시 숨깁니다.</p>
          </div>
          <MyListingsManager initialListings={sellingSamples} />
        </section>

        <section id="buying" className="mt-14 scroll-mt-24 border-t border-border pt-10" aria-labelledby="buying-title">
          <div className="rounded-xl border border-brand/20 bg-white p-4 text-sm leading-relaxed text-text-secondary">
            <h2 id="buying-title" className="text-xl font-bold text-text-primary">구매 요청 관리</h2>
            <p className="mt-2">장비를 구했거나 더 이상 제안을 받지 않을 때 상태를 바로 변경해 불필요한 연락을 줄입니다.</p>
          </div>
          <MyWantedManager initialListings={wantedSamples} />
        </section>
      </div>
    </div>
  );
}
