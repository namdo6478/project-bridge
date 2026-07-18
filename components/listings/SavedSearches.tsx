"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "chuksan-market:saved-searches:v1";
const MAX_SAVED_SEARCHES = 5;

interface SavedSearch {
  id: string;
  label: string;
  href: string;
  resultCount: number;
}

interface SavedSearchesProps {
  currentHref: string;
  currentLabel: string;
  resultCount: number;
  canSave: boolean;
}

export function SavedSearches({ currentHref, currentLabel, resultCount, canSave }: SavedSearchesProps) {
  const [items, setItems] = useState<SavedSearch[]>([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]") as SavedSearch[];
      window.setTimeout(() => setItems(Array.isArray(stored) ? stored.slice(0, MAX_SAVED_SEARCHES) : []), 0);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const persist = (next: SavedSearch[]) => {
    setItems(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const saveCurrent = () => {
    const nextItem = { id: currentHref, label: currentLabel, href: currentHref, resultCount };
    const next = [nextItem, ...items.filter((item) => item.href !== currentHref)].slice(0, MAX_SAVED_SEARCHES);
    persist(next);
    setNotice("현재 검색 조건을 이 기기에 저장했습니다.");
  };

  const remove = (href: string) => {
    persist(items.filter((item) => item.href !== href));
    setNotice("저장한 검색 조건을 삭제했습니다.");
  };

  if (!canSave && items.length === 0) {
    return (
      <div className="mb-6 rounded-xl border border-dashed border-brand/25 bg-brand/5 p-4 text-sm leading-relaxed text-text-secondary">
        <strong className="text-brand">자주 찾는 조건을 저장할 수 있습니다.</strong>
        <p className="mt-1">품목·지역·거래 조건으로 검색한 뒤 저장하면 다음 방문에 바로 다시 볼 수 있습니다.</p>
      </div>
    );
  }

  return (
    <section className="mb-6 rounded-xl border border-brand/20 bg-white p-4 sm:p-5" aria-label="저장한 검색 조건">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-bold text-text-primary">내 검색 조건</h2>
          <p className="mt-1 text-xs leading-relaxed text-text-muted">이 기기에 최대 {MAX_SAVED_SEARCHES}개까지 저장됩니다.</p>
        </div>
        {canSave && <button type="button" onClick={saveCurrent} className="rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-light">현재 조건 저장</button>}
      </div>

      {notice && <p role="status" className="mt-3 rounded-lg bg-brand/5 p-3 text-xs font-semibold text-brand">{notice}</p>}

      {items.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 rounded-lg bg-surface-muted p-2">
              <Link href={item.href} className="min-w-0 flex-1 px-2 py-1 text-sm font-semibold text-text-secondary hover:text-brand">
                <span className="block truncate">{item.label}</span>
                <span className="mt-0.5 block text-xs font-normal text-text-muted">저장 당시 {item.resultCount}건</span>
              </Link>
              <button type="button" onClick={() => remove(item.href)} aria-label={`${item.label} 검색 조건 삭제`} className="shrink-0 rounded-md border border-border bg-white px-3 py-2 text-xs font-bold text-text-muted hover:text-red-700">삭제</button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
