"use client";

import { useState } from "react";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";

const photoLabels = ["대표 사진", "제조 명판", "작동부·사용부", "사용 흔적·수리 부위"];

export function ListingGallery({ category }: { category: string }) {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <div className="relative">
        <PlaceholderImage category={category} className="aspect-[4/3] w-full rounded-lg border border-border" priority />
        <span className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-xs font-bold text-white">{selected + 1}/{photoLabels.length}</span>
        <span className="absolute bottom-3 right-3 rounded bg-white/95 px-3 py-1.5 text-xs font-bold text-text-primary shadow-sm">{photoLabels[selected]}</span>
      </div>
      <div className="mt-3 grid grid-cols-4 gap-2" aria-label="매물 사진 선택">
        {photoLabels.map((label, index) => (
          <button key={label} type="button" onClick={() => setSelected(index)} aria-pressed={selected === index} className={`overflow-hidden rounded-lg border-2 bg-white text-left ${selected === index ? "border-brand" : "border-transparent"}`}>
            <PlaceholderImage category={category} className="aspect-[4/3] w-full" />
            <span className={`block truncate px-2 py-2 text-[10px] font-bold sm:text-xs ${selected === index ? "text-brand" : "text-text-secondary"}`}>{label}</span>
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs leading-relaxed text-text-muted">사진 영역 예시입니다. 실제 매물에서는 판매자가 등록한 대표 사진, 명판과 상태 사진을 순서대로 보여 줍니다.</p>
    </div>
  );
}
