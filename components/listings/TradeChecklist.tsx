"use client";

import { useEffect, useState } from "react";

const checklist = [
  "판매자 이름·상호와 연락처 일치 확인",
  "장비 명판의 제조사·모델·연식 확인",
  "시운전 또는 작동 영상 확인",
  "수리·부품 교체 이력 확인",
  "운송비·상차·설치 책임 범위 확인",
  "계약금·잔금 조건을 문서로 확인",
];

export function TradeChecklist({ listingId }: { listingId: string }) {
  const storageKey = `chuksan-market:trade-checklist:${listingId}:v1`;
  const [checked, setChecked] = useState<boolean[]>(Array(checklist.length).fill(false));

  useEffect(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]") as unknown;
      if (Array.isArray(stored)) {
        window.setTimeout(() => setChecked(checklist.map((_, index) => stored[index] === true)), 0);
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const toggle = (index: number) => {
    setChecked((current) => {
      const next = current.map((value, itemIndex) => itemIndex === index ? !value : value);
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      return next;
    });
  };

  const completed = checked.filter(Boolean).length;

  return (
    <section className="mt-6 rounded-xl border border-brand/20 bg-brand/5 p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><p className="text-xs font-bold text-brand">DIRECT TRADE CHECK</p><h2 className="mt-1 text-lg font-bold text-text-primary">이 매물 거래 전 확인표</h2><p className="mt-2 text-sm text-text-secondary">확인한 항목은 이 기기에 저장되며 장터 운영자에게 전송되지 않습니다.</p></div>
        <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand">{completed}/{checklist.length} 확인</span>
      </div>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {checklist.map((item, index) => (
          <label key={item} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm leading-relaxed ${checked[index] ? "border-brand/25 bg-white font-semibold text-brand" : "border-transparent bg-white/60 text-text-secondary"}`}>
            <input type="checkbox" checked={checked[index]} onChange={() => toggle(index)} className="mt-0.5 h-4 w-4 shrink-0 accent-brand" />
            <span>{item}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
