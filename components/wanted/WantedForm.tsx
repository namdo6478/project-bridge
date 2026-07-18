"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { LISTING_CATEGORIES, LISTING_REGIONS, LISTING_SUBCATEGORIES, type ListingCategory } from "@/lib/types/listing";
import { loadStoredSellerProfile } from "@/lib/account/profile-storage";

const DRAFT_KEY = "chuksan-market:wanted-draft:v1";
const equipmentCategories = LISTING_CATEGORIES.filter((category) => category !== "삽니다");
const inputClass = "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10";
const labelClass = "block text-sm font-semibold text-text-primary";
interface WantedDraft { fields: Record<string, string>; category: ListingCategory; savedAt: string }
interface WantedPreview { title: string; category: string; subcategory: string; region: string; budget: string; description: string; contact: string; contactHours: string }

export function WantedForm() {
  const [category, setCategory] = useState<ListingCategory>(equipmentCategories[0]);
  const [preview, setPreview] = useState<WantedPreview | null>(null);
  const [notice, setNotice] = useState("");
  const [savedAt, setSavedAt] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let draft: WantedDraft | null = null;
    try { draft = JSON.parse(window.localStorage.getItem(DRAFT_KEY) ?? "null") as WantedDraft | null; } catch { window.localStorage.removeItem(DRAFT_KEY); }
    const profile = loadStoredSellerProfile();
    window.setTimeout(() => {
      const form = formRef.current;
      if (!form) return;
      if (draft) {
        setCategory(draft.category); setSavedAt(draft.savedAt);
        window.setTimeout(() => { Object.entries(draft?.fields ?? {}).forEach(([name, value]) => { const field = form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null; if (field) field.value = value; }); }, 0);
        setNotice("이 기기에 임시저장된 구매 요청을 불러왔습니다.");
      }
      if (profile) {
        const buyerName = form.elements.namedItem("buyerName") as HTMLInputElement | null;
        const contact = form.elements.namedItem("contact") as HTMLInputElement | null;
        const region = form.elements.namedItem("region") as HTMLSelectElement | null;
        const contactHours = form.elements.namedItem("contactHours") as HTMLInputElement | null;
        if (buyerName && !buyerName.value) buyerName.value = profile.displayName;
        if (contact && !contact.value) contact.value = profile.phone;
        if (region && !region.value) region.value = profile.region;
        if (contactHours && !contactHours.value) contactHours.value = profile.contactHours;
      }
    }, 0);
    return () => { if (timerRef.current !== null) window.clearTimeout(timerRef.current); };
  }, []);

  const saveDraft = (nextCategory = category) => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => {
      const form = formRef.current; if (!form) return;
      const fields = Object.fromEntries(Array.from(new FormData(form).entries()).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
      const nextSavedAt = new Date().toISOString();
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ fields, category: nextCategory, savedAt: nextSavedAt } satisfies WantedDraft));
      setSavedAt(nextSavedAt); setNotice("입력 내용을 이 기기에 임시저장했습니다.");
    }, 700);
  };
  const clearDraft = () => { window.localStorage.removeItem(DRAFT_KEY); setSavedAt(""); setNotice("임시저장을 삭제했습니다. 현재 입력값은 그대로 유지됩니다."); };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); const data = new FormData(event.currentTarget); const maxBudget = Number(data.get("maxBudget") ?? 0);
    setPreview({ title: String(data.get("title") ?? ""), category: String(data.get("desiredCategory") ?? ""), subcategory: String(data.get("desiredSubcategory") ?? ""), region: String(data.get("region") ?? ""), budget: maxBudget > 0 ? `최대 ${maxBudget.toLocaleString("ko-KR")}원` : "가격 협의", description: String(data.get("description") ?? ""), contact: String(data.get("contact") ?? ""), contactHours: String(data.get("contactHours") ?? "") });
    window.setTimeout(() => document.getElementById("wanted-preview")?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  };

  return <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
    <form ref={formRef} onSubmit={submit} onInput={() => saveDraft()} className="space-y-6">
      <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-sm leading-relaxed text-brand"><div className="flex flex-wrap items-start justify-between gap-3"><div><strong>구매자가 직접 등록합니다</strong><p className="mt-1 text-xs text-text-secondary">운영자가 장비를 찾아주거나 판매자를 중개하지 않습니다. 원하는 조건을 구체적으로 공개하면 장비를 보유한 판매자가 직접 연락합니다.</p>{notice && <p role="status" className="mt-2 text-xs font-bold text-brand">{notice}</p>}{savedAt && <p className="mt-1 text-[11px] text-text-muted">마지막 임시저장: {new Date(savedAt).toLocaleString("ko-KR")}</p>}</div>{savedAt && <button type="button" onClick={clearDraft} className="rounded-lg border border-brand/20 bg-white px-3 py-2 text-xs font-bold text-brand">임시저장 삭제</button>}</div></div>
      <section className="rounded-xl border border-border bg-white p-5 sm:p-7"><p className="text-xs font-bold text-brand">STEP 1</p><h2 className="mt-1 text-xl font-bold text-text-primary">찾는 장비</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className={labelClass}>대분류 <strong className="text-accent">*</strong><select name="desiredCategory" value={category} onChange={(event) => { const next = event.target.value as ListingCategory; setCategory(next); saveDraft(next); }} className={inputClass}>{equipmentCategories.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className={labelClass}>세부 품목 <strong className="text-accent">*</strong><select key={category} name="desiredSubcategory" className={inputClass}>{LISTING_SUBCATEGORIES[category].map((item) => <option key={item} value={item}>{item}</option>)}</select></label></div><label className={`${labelClass} mt-5`}>구매 요청 제목 <strong className="text-accent">*</strong><input name="title" required minLength={4} maxLength={60} placeholder="예: 경북 인근 중고 원형베일러 구합니다" className={inputClass} /></label><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className={labelClass}>희망 제조사<input name="manufacturer" placeholder="제조사 무관 가능" className={inputClass} /></label><label className={labelClass}>희망 모델<input name="model" placeholder="모델 무관 가능" className={inputClass} /></label></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className={labelClass}>희망 연식<input name="yearRange" maxLength={30} placeholder="예: 2018년 이후" className={inputClass} /></label><label className={labelClass}>최대 예산 <span className="font-normal text-text-muted">(선택)</span><input name="maxBudget" type="number" min="0" inputMode="numeric" placeholder="미입력 시 가격 협의" className={inputClass} /></label></div><label className={`${labelClass} mt-5`}>필요 조건과 사용 목적 <strong className="text-accent">*</strong><textarea name="description" required minLength={20} maxLength={1000} rows={7} placeholder="필요한 규격, 작업 환경, 부속품, 확인 가능한 지역을 구체적으로 적어 주세요." className={`${inputClass} resize-y leading-relaxed`} /></label></section>
      <section className="rounded-xl border border-border bg-white p-5 sm:p-7"><p className="text-xs font-bold text-brand">STEP 2</p><h2 className="mt-1 text-xl font-bold text-text-primary">거래 지역과 연락 조건</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className={labelClass}>희망 지역 <strong className="text-accent">*</strong><select name="region" required defaultValue="" className={inputClass}><option value="" disabled>지역 선택</option>{LISTING_REGIONS.map((region) => <option key={region} value={region}>{region}</option>)}</select></label><label className={labelClass}>요청 유효기간<select name="validFor" defaultValue="30일" className={inputClass}><option>14일</option><option>30일</option><option>60일</option></select></label></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className={labelClass}>이름 또는 상호 <strong className="text-accent">*</strong><input name="buyerName" required maxLength={30} className={inputClass} /></label><label className={labelClass}>연락처 <strong className="text-accent">*</strong><input name="contact" type="tel" inputMode="tel" pattern="[0-9-]{10,13}" required placeholder="010-1234-5678" className={inputClass} /></label></div><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className={labelClass}>선호 연락 방법<select name="preferredContact" defaultValue="문자 우선" className={inputClass}><option>문자 우선</option><option>전화 우선</option><option>전화·문자 모두</option></select></label><label className={labelClass}>연락 가능 시간 <strong className="text-accent">*</strong><input name="contactHours" required maxLength={40} placeholder="예: 평일 09:00~18:00" className={inputClass} /></label></div></section>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"><input type="checkbox" required className="mt-1 h-4 w-4 accent-brand" /><span>판매 제안을 받으면 장비 실물, 판매자, 명판과 거래 조건을 직접 확인하고 장터 운영자에게 중개·보증을 요청하지 않겠습니다.</span></label><button type="submit" className="w-full rounded-xl bg-brand px-6 py-4 text-sm font-bold text-white hover:bg-brand-light">구매 요청 미리보기</button>
    </form>
    <aside className="space-y-4 lg:sticky lg:top-24"><div className="rounded-xl border border-border bg-white p-5"><h2 className="font-bold text-text-primary">잘 받는 제안 작성법</h2><ul className="mt-3 space-y-2 text-xs leading-relaxed text-text-secondary"><li>정확한 품목과 필요한 규격을 적습니다.</li><li>사용 지역과 직접 확인 가능한 범위를 적습니다.</li><li>예산이 정해졌다면 최대 금액을 표시합니다.</li><li>실물 확인 전 선입금 요구에는 응하지 않습니다.</li></ul></div>{preview && <div id="wanted-preview" className="rounded-xl border-2 border-brand bg-white p-5"><p className="text-xs font-bold text-brand">등록 미리보기</p><h2 className="mt-2 font-bold text-text-primary">{preview.title}</h2><p className="mt-2 text-xs text-text-secondary">{preview.category} · {preview.subcategory} · {preview.region}</p><p className="mt-3 text-lg font-bold text-brand">{preview.budget}</p><p className="mt-3 line-clamp-4 text-xs leading-relaxed text-text-secondary">{preview.description}</p><div className="mt-4 border-t border-border pt-3 text-xs text-text-muted"><p>{preview.contact} · {preview.contactHours}</p></div><button type="button" onClick={() => { window.localStorage.removeItem(DRAFT_KEY); setSavedAt(""); setNotice("구매 요청 등록 예시가 완료됐습니다. 실제 서버에는 저장되지 않습니다."); }} className="mt-4 w-full rounded-lg bg-accent px-4 py-3 text-sm font-bold text-white">등록 완료 예시</button></div>}</aside>
  </div>;
}
