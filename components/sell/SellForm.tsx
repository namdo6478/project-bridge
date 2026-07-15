"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import {
  createListing,
  initialCreateListingState,
} from "@/app/sell/actions";
import {
  LISTING_CATEGORIES,
  LISTING_REGIONS,
  LISTING_SUBCATEGORIES,
  type ListingCategory,
} from "@/lib/types/listing";

interface PreviewData {
  title: string;
  category: string;
  subcategory: string;
  condition: string;
  region: string;
  price: string;
  contact: string;
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/10";

const labelClass = "block text-sm font-semibold text-text-primary";

export function SellForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [category, setCategory] = useState<ListingCategory>(LISTING_CATEGORIES[0]);
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [state, formAction, pending] = useActionState(
    createListing,
    initialCreateListingState,
  );

  const handlePreview = () => {
    if (!formRef.current) return;
    const data = new FormData(formRef.current);

    setPreview({
      title: String(data.get("title") ?? ""),
      category: String(data.get("category") ?? ""),
      subcategory: String(data.get("subcategory") ?? ""),
      condition: String(data.get("condition") ?? ""),
      region: String(data.get("region") ?? ""),
      price: priceNegotiable
        ? "가격 협의"
        : `${Number(data.get("price") ?? 0).toLocaleString("ko-KR")}원`,
      contact: String(data.get("contact") ?? ""),
    });

    window.setTimeout(() => {
      document.getElementById("sell-preview")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
      <form ref={formRef} action={formAction} className="space-y-6">
        <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[0.12em] text-brand">STEP 1</p>
              <h2 className="mt-1 text-xl font-bold text-text-primary">장비 기본 정보</h2>
            </div>
            <span className="text-xs text-text-muted"><strong className="text-accent">*</strong> 필수 입력</span>
          </div>

          <div className="mt-6">
            <label className={labelClass} htmlFor="photos">장비 사진</label>
            <label htmlFor="photos" className="mt-2 flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-brand/20 bg-brand/5 px-5 text-center transition hover:border-brand/40 hover:bg-brand/10">
              <svg className="h-8 w-8 text-brand" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M4 16.5V7a2 2 0 0 1 2-2h2l1.2-1.5h5.6L16 5h2a2 2 0 0 1 2 2v9.5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="11.5" r="3" />
              </svg>
              <span className="mt-2 text-sm font-semibold text-brand">사진 선택하기</span>
              <span className="mt-1 text-xs text-text-muted">정면·측면·명판·사용 흔적 사진을 권장합니다</span>
            </label>
            <input id="photos" type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" />
            <p className="mt-2 text-xs text-text-muted">사진 선택과 업로드는 다음 작업에서 연결됩니다. 현재 등록에는 장비 정보가 먼저 저장됩니다.</p>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              대분류 <strong className="text-accent">*</strong>
              <select
                name="category"
                value={category}
                onChange={(event) => setCategory(event.target.value as ListingCategory)}
                required
                className={inputClass}
              >
                {LISTING_CATEGORIES.filter((item) => item !== "삽니다").map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              세부 품목 <strong className="text-accent">*</strong>
              <select key={category} name="subcategory" required className={inputClass}>
                {LISTING_SUBCATEGORIES[category].map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5">
            <label className={labelClass} htmlFor="title">매물 제목 <strong className="text-accent">*</strong></label>
            <input id="title" name="title" required maxLength={60} placeholder="예: 2021년식 원형베일러 상태 양호" className={inputClass} />
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <label className={labelClass}>
              장비 상태 <strong className="text-accent">*</strong>
              <select name="condition" required className={inputClass} defaultValue="중고">
                <option value="중고">중고</option>
                <option value="신품">신품</option>
              </select>
            </label>
            <label className={labelClass}>
              제조사
              <input name="manufacturer" placeholder="예: 명성" className={inputClass} />
            </label>
            <label className={labelClass}>
              모델명
              <input name="model" placeholder="예: RB-1200" className={inputClass} />
            </label>
          </div>

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              연식 <strong className="text-accent">*</strong>
              <input name="year" type="number" required min="1980" max="2027" inputMode="numeric" placeholder="2021" className={inputClass} />
            </label>
            <label className={labelClass}>
              사용 시간
              <input name="usageHours" type="number" min="0" inputMode="numeric" placeholder="예: 850시간" className={inputClass} />
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
          <p className="text-xs font-bold tracking-[0.12em] text-brand">STEP 2</p>
          <h2 className="mt-1 text-xl font-bold text-text-primary">가격과 거래 지역</h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              판매 가격 <strong className="text-accent">*</strong>
              <div className="relative">
                <input
                  name="price"
                  type="number"
                  min="0"
                  inputMode="numeric"
                  required={!priceNegotiable}
                  disabled={priceNegotiable}
                  placeholder="금액 입력"
                  className={`${inputClass} pr-12 disabled:bg-surface-muted disabled:text-text-muted`}
                />
                <span className="absolute bottom-3 right-3 text-sm text-text-muted">원</span>
              </div>
            </label>
            <label className={labelClass}>
              거래 지역 <strong className="text-accent">*</strong>
              <select name="region" required className={inputClass} defaultValue="">
                <option value="" disabled>지역 선택</option>
                {LISTING_REGIONS.filter((region) => region !== "전국").map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-medium text-text-secondary">
            <input
              type="checkbox"
              name="priceNegotiable"
              checked={priceNegotiable}
              onChange={(event) => setPriceNegotiable(event.target.checked)}
              className="h-4 w-4 accent-brand"
            />
            가격을 정하지 않고 협의로 등록
          </label>

          <div className="mt-6">
            <label className={labelClass} htmlFor="description">상세 설명 <strong className="text-accent">*</strong></label>
            <textarea
              id="description"
              name="description"
              required
              rows={7}
              placeholder="구입 시기, 사용 횟수, 수리 이력, 현재 상태와 운송 가능 여부를 적어주세요."
              className={`${inputClass} resize-y leading-relaxed`}
            />
          </div>

          <fieldset className="mt-5">
            <legend className={labelClass}>추가 거래 조건</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {["가격 협의 가능", "운송 협의 가능", "시운전 가능", "정비 이력 있음"].map((item) => (
                <label key={item} className="cursor-pointer rounded-full border border-border bg-surface-muted px-3 py-2 text-sm text-text-secondary">
                  <input type="checkbox" name="tradeOptions" value={item} className="mr-2 accent-brand" />
                  {item}
                </label>
              ))}
            </div>
          </fieldset>
        </section>

        <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
          <p className="text-xs font-bold tracking-[0.12em] text-brand">STEP 3</p>
          <h2 className="mt-1 text-xl font-bold text-text-primary">연락처 확인</h2>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">연락처는 구매 문의를 받을 때 사용됩니다. 실제 공개 범위는 회원 기능 연결 시 선택할 수 있습니다.</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              판매자 이름 <strong className="text-accent">*</strong>
              <input name="sellerName" required autoComplete="name" placeholder="이름 또는 상호" className={inputClass} />
            </label>
            <label className={labelClass}>
              연락처 <strong className="text-accent">*</strong>
              <input name="contact" required type="tel" autoComplete="tel" placeholder="010-0000-0000" className={inputClass} />
            </label>
          </div>
        </section>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>안전 거래 안내</strong>
          <p className="mt-1">장비를 확인하기 전 계약금이나 운송비 선입금을 요구하는 거래에 주의하세요.</p>
        </div>

        {state.status !== "idle" && (
          <div
            role="status"
            className={`rounded-xl border p-4 text-sm leading-relaxed ${
              state.status === "success"
                ? "border-brand/20 bg-brand/5 text-brand"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <p className="font-semibold">{state.message}</p>
            {state.status === "error" && state.message.includes("로그인") && (
              <Link href="/login" className="mt-2 inline-flex font-bold underline">로그인 화면으로 이동</Link>
            )}
            {state.status === "success" && state.listingId && (
              <Link href={`/listings/${state.listingId}`} className="mt-2 inline-flex font-bold underline">등록한 매물 보기</Link>
            )}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={handlePreview} className="w-full rounded-xl border border-brand/25 bg-white px-6 py-4 text-base font-bold text-brand transition hover:bg-brand/5">
            입력 내용 미리보기
          </button>
          <button type="submit" disabled={pending} className="w-full rounded-xl bg-accent px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-accent-hover disabled:cursor-wait disabled:opacity-60">
            {pending ? "등록 중..." : "매물 등록하기"}
          </button>
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="rounded-xl border border-border bg-white p-5">
          <h2 className="font-bold text-text-primary">잘 팔리는 매물 작성법</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary">
            <li className="flex gap-2"><span className="font-bold text-brand">01</span><span>장비 전체와 명판 사진을 함께 올리기</span></li>
            <li className="flex gap-2"><span className="font-bold text-brand">02</span><span>수리·교체 이력을 구체적으로 적기</span></li>
            <li className="flex gap-2"><span className="font-bold text-brand">03</span><span>운송과 시운전 가능 여부 표시하기</span></li>
          </ul>
        </div>

        {preview ? (
          <div id="sell-preview" className="rounded-xl border-2 border-brand bg-white p-5 shadow-sm" role="status">
            <p className="text-xs font-bold tracking-[0.12em] text-brand">PREVIEW READY</p>
            <h2 className="mt-2 text-lg font-bold text-text-primary">{preview.title}</h2>
            <p className="mt-2 text-sm text-text-secondary">{preview.category} · {preview.subcategory}</p>
            <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between gap-3"><dt className="text-text-muted">상태</dt><dd className="font-medium">{preview.condition}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-text-muted">지역</dt><dd className="font-medium">{preview.region}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-text-muted">가격</dt><dd className="font-bold text-brand">{preview.price || "미입력"}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-text-muted">연락처</dt><dd className="font-medium">{preview.contact}</dd></div>
            </dl>
            <p className="mt-4 rounded-lg bg-brand/5 p-3 text-xs leading-relaxed text-brand">입력 흐름 확인 완료. 로그인 후 매물 등록하기를 누르면 실제 데이터베이스에 저장됩니다.</p>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-white p-5 text-sm leading-relaxed text-text-secondary">
            필수 항목을 입력하고 <strong className="text-text-primary">입력 내용 미리보기</strong>를 누르면 등록 전 요약을 확인할 수 있습니다.
          </div>
        )}
      </aside>
    </div>
  );
}
