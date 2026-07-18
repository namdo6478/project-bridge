"use client";

import Link from "next/link";
import { useState } from "react";
import { PhotoManager } from "@/components/listings/PhotoManager";
import {
  LISTING_CATEGORIES,
  LISTING_REGIONS,
  LISTING_SUBCATEGORIES,
  type Listing,
  type ListingCategory,
} from "@/lib/types/listing";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/10";
const labelClass = "block text-sm font-semibold text-text-primary";

export function EditListingForm({ listing }: { listing: Listing }) {
  const [category, setCategory] = useState<ListingCategory>(listing.category);
  const [subcategory, setSubcategory] = useState<string>(listing.subcategory);
  const [priceNegotiable, setPriceNegotiable] = useState(listing.priceNegotiable);
  const [saved, setSaved] = useState(false);

  const handleCategoryChange = (nextCategory: ListingCategory) => {
    setCategory(nextCategory);
    setSubcategory(LISTING_SUBCATEGORIES[nextCategory][0]);
  };

  return (
    <form className="space-y-6">
      <PhotoManager />

      <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
        <h2 className="text-xl font-bold text-text-primary">장비 기본 정보</h2>
        <p className="mt-2 text-sm text-text-secondary">검색 결과와 상세 화면에 보이는 핵심 정보를 수정합니다.</p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            대분류
            <select value={category} onChange={(event) => handleCategoryChange(event.target.value as ListingCategory)} className={inputClass}>
              {LISTING_CATEGORIES.filter((item) => item !== "삽니다").map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
          <label className={labelClass}>
            세부 품목
            <select value={subcategory} onChange={(event) => setSubcategory(event.target.value)} className={inputClass}>
              {LISTING_SUBCATEGORIES[category].map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>

        <label className={`${labelClass} mt-5`}>
          매물 제목
          <input required minLength={4} maxLength={60} defaultValue={listing.title} className={inputClass} />
        </label>

        <div className="mt-5 grid gap-5 sm:grid-cols-3">
          <label className={labelClass}>
            장비 상태
            <select defaultValue={listing.condition} className={inputClass}><option value="중고">중고</option><option value="신품">신품</option></select>
          </label>
          <label className={labelClass}>
            제조사
            <input defaultValue={listing.manufacturer} className={inputClass} />
          </label>
          <label className={labelClass}>
            모델명
            <input defaultValue={listing.model ?? ""} className={inputClass} />
          </label>
        </div>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            연식
            <input type="number" min="1980" max="2027" defaultValue={listing.year} className={inputClass} />
          </label>
          <label className={labelClass}>
            사용 시간
            <input type="number" min="0" defaultValue={listing.usageHours ?? ""} placeholder="예: 850" className={inputClass} />
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
        <h2 className="text-xl font-bold text-text-primary">가격과 거래 조건</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <label className={labelClass}>
            판매 가격
            <input type="number" min="0" disabled={priceNegotiable} defaultValue={listing.price ?? ""} className={`${inputClass} disabled:bg-surface-muted`} />
          </label>
          <label className={labelClass}>
            거래 지역
            <select defaultValue={listing.region} className={inputClass}>
              {LISTING_REGIONS.filter((region) => region !== "전국").map((region) => <option key={region} value={region}>{region}</option>)}
            </select>
          </label>
        </div>

        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-text-secondary">
          <input type="checkbox" checked={priceNegotiable} onChange={(event) => setPriceNegotiable(event.target.checked)} className="h-4 w-4 accent-brand" />
          가격 협의로 표시
        </label>

        <label className={`${labelClass} mt-6`}>
          상세 설명
          <textarea required minLength={10} rows={8} defaultValue={listing.description} className={`${inputClass} resize-y leading-relaxed`} />
        </label>

        <fieldset className="mt-5">
          <legend className={labelClass}>추가 거래 조건</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {["가격 협의 가능", "운송 협의 가능", "시운전 가능", "정비 이력 있음"].map((item) => (
              <label key={item} className="cursor-pointer rounded-full border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary">
                <input type="checkbox" defaultChecked={listing.tradeOptions?.includes(item)} className="mr-2 accent-brand" />{item}
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      {saved && <div role="status" className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-sm leading-relaxed text-brand"><strong>수정 내용을 확인했습니다.</strong><p className="mt-1 text-xs text-text-secondary">공개 화면은 예시이므로 새로고침하면 원래 상태로 돌아갑니다. 실제 로그인 연결 후에는 변경 내용이 저장됩니다.</p></div>}

      <div className="grid gap-3 sm:grid-cols-2">
        <Link href="/my-listings" className="rounded-xl border border-border bg-white px-6 py-3.5 text-center text-sm font-bold text-text-secondary hover:bg-surface-muted">취소</Link>
        <button type="button" onClick={() => setSaved(true)} className="rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white hover:bg-brand-light">수정 내용 저장 예시</button>
      </div>
    </form>
  );
}
