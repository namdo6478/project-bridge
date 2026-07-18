"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Listing } from "@/lib/types/listing";
import { formatPrice } from "@/lib/utils/format";
import { toLocalDateString } from "@/lib/listings/freshness";

type WantedStatus = "모집중" | "구매완료" | "마감";

interface StoredWantedState {
  status: WantedStatus;
  confirmedAt: string;
  validUntil: string;
}

interface ManagedWanted extends Listing {
  requestStatus: WantedStatus;
  draftStatus: WantedStatus;
  validUntil: string;
}

const STORAGE_KEY = "chuksan-market:my-wanted-management:v1";

function addDays(dateString: string, days: number) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function makeItems(initialListings: Listing[]): ManagedWanted[] {
  return initialListings.map((listing) => ({
    ...listing,
    requestStatus: "모집중",
    draftStatus: "모집중",
    validUntil: addDays(listing.confirmedAt, 30),
  }));
}

export function MyWantedManager({ initialListings }: { initialListings: Listing[] }) {
  const [items, setItems] = useState(() => makeItems(initialListings));
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "{}") as Record<string, StoredWantedState>;
      window.setTimeout(() => setItems((current) => current.map((item) => {
        const saved = stored[item.id];
        return saved ? { ...item, requestStatus: saved.status, draftStatus: saved.status, confirmedAt: saved.confirmedAt, validUntil: saved.validUntil } : item;
      })), 0);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const counts = useMemo(() => ({
    open: items.filter((item) => item.requestStatus === "모집중").length,
    completed: items.filter((item) => item.requestStatus === "구매완료").length,
    closed: items.filter((item) => item.requestStatus === "마감").length,
  }), [items]);

  const persist = (next: ManagedWanted[]) => {
    setItems(next);
    const states = Object.fromEntries(next.map((item) => [item.id, {
      status: item.requestStatus,
      confirmedAt: item.confirmedAt,
      validUntil: item.validUntil,
    } satisfies StoredWantedState]));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(states));
  };

  const changeDraft = (id: string, draftStatus: WantedStatus) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, draftStatus } : item));
  };

  const saveStatus = (id: string) => {
    const next = items.map((item) => item.id === id ? { ...item, requestStatus: item.draftStatus } : item);
    persist(next);
    setNotice("구매 요청 상태를 변경하고 이 기기에 저장했습니다.");
  };

  const extendRequest = (id: string) => {
    const today = toLocalDateString();
    const next = items.map((item) => item.id === id ? {
      ...item,
      requestStatus: "모집중" as WantedStatus,
      draftStatus: "모집중" as WantedStatus,
      confirmedAt: today,
      validUntil: addDays(today, 30),
    } : item);
    persist(next);
    setNotice("아직 찾고 있는 요청으로 확인하고 유효기간을 30일 연장했습니다.");
  };

  const reset = () => {
    window.localStorage.removeItem(STORAGE_KEY);
    setItems(makeItems(initialListings));
    setNotice("구매 요청 관리 예시를 초기 상태로 되돌렸습니다.");
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">모집중</p><p className="mt-1 text-2xl font-bold text-brand">{counts.open}</p></div>
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">구매완료</p><p className="mt-1 text-2xl font-bold text-accent-hover">{counts.completed}</p></div>
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">마감</p><p className="mt-1 text-2xl font-bold text-text-muted">{counts.closed}</p></div>
      </div>

      {notice && <p role="status" className="mt-4 rounded-lg bg-brand/5 p-3 text-sm font-medium text-brand">{notice}</p>}
      <div className="mt-4 flex justify-end"><button type="button" onClick={reset} className="rounded-lg border border-border bg-white px-3 py-2 text-xs font-bold text-text-secondary">예시 상태 초기화</button></div>

      <div className="mt-6 space-y-4">
        {items.map((listing) => (
          <article key={listing.id} className="rounded-xl border border-border bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2"><span className={`rounded-full px-3 py-1 text-xs font-bold ${listing.requestStatus === "모집중" ? "bg-brand/10 text-brand" : "bg-surface-muted text-text-secondary"}`}>{listing.requestStatus}</span><span className="rounded bg-surface-muted px-2 py-1 text-[11px] font-semibold text-text-muted">구매 요청</span></div>
                <h3 className="mt-3 font-bold text-text-primary">{listing.title}</h3>
                <p className="mt-1 text-sm text-text-secondary">{listing.subcategory} · {listing.region}</p>
                <p className="mt-2 text-xs font-semibold text-brand">유효기간 {listing.validUntil}까지</p>
              </div>
              <p className="text-lg font-bold text-brand">{formatPrice(listing.price, listing.priceNegotiable)}</p>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <p className="text-xs leading-relaxed text-text-muted">장비를 구했으면 구매완료, 더 이상 제안을 받지 않으면 마감으로 변경하세요. 계속 찾는 경우 30일씩 연장할 수 있습니다.</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <select value={listing.draftStatus} onChange={(event) => changeDraft(listing.id, event.target.value as WantedStatus)} className="flex-1 rounded-md border border-border bg-white px-3 py-2.5 text-sm focus:border-brand">
                  <option value="모집중">모집중</option><option value="구매완료">구매완료</option><option value="마감">마감</option>
                </select>
                <button type="button" onClick={() => saveStatus(listing.id)} disabled={listing.requestStatus === listing.draftStatus} className="rounded-md bg-brand px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40">상태 변경</button>
                <Link href={`/listings/${listing.id}`} className="rounded-md border border-border px-4 py-2.5 text-center text-sm font-semibold text-text-secondary hover:bg-surface-muted">상세 보기</Link>
              </div>
              {listing.requestStatus === "모집중" && <button type="button" onClick={() => extendRequest(listing.id)} className="mt-3 w-full rounded-md border border-brand/25 bg-brand/5 px-4 py-2.5 text-sm font-bold text-brand sm:w-auto">아직 찾는 중 · 30일 연장</button>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
