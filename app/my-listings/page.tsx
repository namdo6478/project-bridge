import type { Metadata } from "next";
import Link from "next/link";
import { MyListingsManager } from "@/components/listings/MyListingsManager";
import { listings } from "@/lib/data/listings";

export const metadata: Metadata = {
  title: "내 매물 관리",
  description: "등록한 축산기계 매물과 판매 상태를 관리하세요.",
};

export default function MyListingsPage() {
  const samples = listings.slice(0, 3);

  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-brand">MY LISTINGS</p>
            <h1 className="mt-1 text-3xl font-bold text-text-primary">내 매물 관리</h1>
            <p className="mt-2 text-sm text-text-secondary">등록한 장비의 판매 상태와 최근 판매 확인일을 직접 관리합니다.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/account" className="rounded-lg border border-brand/25 bg-white px-5 py-3 text-center text-sm font-bold text-brand hover:bg-brand/5">판매자 정보</Link>
            <Link href="/sell" className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-bold text-white hover:bg-accent-hover">새 매물 등록</Link>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>화면 예시를 표시하고 있습니다.</strong>
          <p className="mt-1">현재 상태 변경은 이 기기에 저장되어 새로고침 후에도 유지됩니다. 실제 연결 후에는 본인이 등록한 매물만 표시됩니다.</p>
        </div>

        <div className="mt-4 rounded-xl border border-brand/20 bg-white p-4 text-sm leading-relaxed text-text-secondary">
          <strong className="text-brand">판매자 셀프관리 원칙</strong>
          <p className="mt-1">30일마다 현재도 거래 가능한지 확인해 주세요. 60일 넘게 확인되지 않은 매물은 구매자 혼선을 막기 위해 검색에서 잠시 숨기고, 판매자가 다시 확인하면 자동으로 복원합니다.</p>
        </div>

        <MyListingsManager initialListings={samples} />
      </div>
    </div>
  );
}
