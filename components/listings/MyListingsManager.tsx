"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils/format";
import type { Listing, SaleStatus } from "@/lib/types/listing";

type ManageableStatus = Extract<SaleStatus, "판매중" | "예약중" | "판매완료">;

export function MyListingsManager({ initialListings }: { initialListings: Listing[] }) {
  const [items, setItems] = useState(initialListings.map((listing) => ({
    ...listing,
    draftStatus: (listing.status === "구매요청" ? "판매중" : listing.status) as ManageableStatus,
  })));
  const [notice, setNotice] = useState("");

  const counts = useMemo(() => ({
    selling: items.filter((item) => item.status === "판매중").length,
    reserved: items.filter((item) => item.status === "예약중").length,
    completed: items.filter((item) => item.status === "판매완료").length,
  }), [items]);

  const changeDraft = (id: string, draftStatus: ManageableStatus) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, draftStatus } : item));
  };

  const saveStatus = (id: string) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status: item.draftStatus } : item));
    setNotice("판매 상태를 변경했습니다. 공개 화면 예시이므로 새로고침하면 원래 상태로 돌아갑니다.");
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">판매중</p><p className="mt-1 text-2xl font-bold text-brand">{counts.selling}</p></div>
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">예약중</p><p className="mt-1 text-2xl font-bold text-accent-hover">{counts.reserved}</p></div>
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">판매완료</p><p className="mt-1 text-2xl font-bold text-text-muted">{counts.completed}</p></div>
      </div>

      {notice && <p role="status" className="mt-4 rounded-lg bg-brand/5 p-3 text-sm font-medium text-brand">{notice}</p>}

      <div className="mt-6 space-y-4">
        {items.map((listing) => (
          <article key={listing.id} className="rounded-xl border border-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2"><StatusBadge status={listing.status} /><span className="rounded bg-surface-muted px-2 py-1 text-[11px] font-semibold text-text-muted">화면 예시</span></div>
                <h2 className="mt-3 font-bold text-text-primary">{listing.title}</h2>
                <p className="mt-1 text-sm text-text-secondary">{listing.subcategory} · {listing.region} · {listing.year}년</p>
              </div>
              <p className="text-lg font-bold text-brand">{formatPrice(listing.price, listing.priceNegotiable)}</p>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <p className="text-xs leading-relaxed text-text-muted">예약이 잡히면 예약중, 거래가 끝나면 판매완료로 바꾸면 구매자가 현재 상태를 바로 알 수 있습니다.</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <select value={listing.draftStatus} onChange={(event) => changeDraft(listing.id, event.target.value as ManageableStatus)} className="flex-1 rounded-md border border-border bg-white px-3 py-2.5 text-sm focus:border-brand">
                  <option value="판매중">판매중</option><option value="예약중">예약중</option><option value="판매완료">판매완료</option>
                </select>
                <button type="button" onClick={() => saveStatus(listing.id)} disabled={listing.status === listing.draftStatus} className="rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">상태 변경</button>
                <Link href={`/my-listings/${listing.id}/edit`} className="rounded-md border border-brand/25 px-4 py-2.5 text-center text-sm font-semibold text-brand hover:bg-brand/5">정보 수정</Link>
                <Link href={`/listings/${listing.id}`} className="rounded-md border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-secondary hover:bg-surface-muted">상세 보기</Link>
              </div>
              <Link href={`/my-listings/${listing.id}/delete`} className="mt-3 inline-flex text-xs font-semibold text-red-700 hover:underline">매물 삭제</Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
