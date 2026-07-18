"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  LISTING_CATEGORIES,
  LISTING_REGIONS,
  LISTING_SUBCATEGORIES,
  type ListingCategory,
} from "@/lib/types/listing";
import { loadStoredSellerProfile } from "@/lib/account/profile-storage";

interface PreviewData {
  title: string;
  category: string;
  subcategory: string;
  condition: string;
  region: string;
  price: string;
  contact: string;
  preferredContact: string;
  contactHours: string;
}

interface SelectedPhoto {
  id: string;
  file: File;
  previewUrl: string;
}

interface SellDraft {
  fields: Record<string, string[]>;
  category: ListingCategory;
  priceNegotiable: boolean;
  savedAt: string;
}

const MAX_PHOTO_SIZE = 10 * 1024 * 1024;
const ALLOWED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];
const DRAFT_STORAGE_KEY = "chuksan-market:sell-draft:v1";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/10";

const labelClass = "block text-sm font-semibold text-text-primary";

export function SellForm() {
  const [category, setCategory] = useState<ListingCategory>(LISTING_CATEGORIES[0]);
  const [priceNegotiable, setPriceNegotiable] = useState(false);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [registrationMessage, setRegistrationMessage] = useState(false);
  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [photoMessage, setPhotoMessage] = useState("");
  const [draftMessage, setDraftMessage] = useState("");
  const [draftSavedAt, setDraftSavedAt] = useState("");
  const [completionChecks, setCompletionChecks] = useState<boolean[]>(Array(8).fill(false));
  const photosRef = useRef<SelectedPhoto[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const draftTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    let draft: SellDraft | null = null;

    if (stored) {
      try {
        draft = JSON.parse(stored) as SellDraft;
      } catch {
        window.localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    }

    window.setTimeout(() => {
      if (draft) {
        setCategory(draft.category);
        setPriceNegotiable(draft.priceNegotiable);
        setDraftSavedAt(draft.savedAt);
      }

      window.setTimeout(() => {
        const form = formRef.current;
        if (!form) return;

        if (draft) {
          Object.entries(draft.fields).forEach(([name, values]) => {
            form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(`[name="${name}"]`).forEach((field) => {
              if (field instanceof HTMLInputElement && (field.type === "checkbox" || field.type === "radio")) {
                field.checked = values.includes(field.value);
              } else if (values[0] !== undefined) {
                field.value = values[0];
              }
            });
          });
        }

        const profile = loadStoredSellerProfile();
        if (profile) {
          const sellerName = form.elements.namedItem("sellerName") as HTMLInputElement | null;
          const contact = form.elements.namedItem("contact") as HTMLInputElement | null;
          const region = form.elements.namedItem("region") as HTMLSelectElement | null;
          const preferredContact = form.elements.namedItem("preferredContact") as HTMLSelectElement | null;
          const contactHours = form.elements.namedItem("contactHours") as HTMLInputElement | null;
          if (sellerName && !sellerName.value) sellerName.value = profile.displayName;
          if (contact && !contact.value) contact.value = profile.phone;
          if (region && !region.value && profile.region) region.value = profile.region;
          if (preferredContact) preferredContact.value = profile.preferredContact;
          if (contactHours && !contactHours.value) contactHours.value = profile.contactHours;
        }

        if (draft) {
          setDraftMessage("이전에 입력하던 내용을 자동으로 불러왔습니다. 사진은 보안을 위해 다시 선택해 주세요.");
        } else if (profile) {
          setDraftMessage("내 정보에 저장된 이름, 연락처와 지역을 자동으로 입력했습니다.");
        }
        form.dispatchEvent(new Event("input", { bubbles: true }));
      }, 0);
    }, 0);
  }, []);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
      if (draftTimerRef.current !== null) window.clearTimeout(draftTimerRef.current);
    };
  }, []);

  const saveDraft = (nextCategory = category, nextPriceNegotiable = priceNegotiable) => {
    if (draftTimerRef.current !== null) window.clearTimeout(draftTimerRef.current);

    draftTimerRef.current = window.setTimeout(() => {
      const form = formRef.current;
      if (!form) return;

      const fields: Record<string, string[]> = {};
      new FormData(form).forEach((value, name) => {
        if (typeof value !== "string") return;
        fields[name] = [...(fields[name] ?? []), value];
      });

      const savedAt = new Date().toISOString();
      const draft: SellDraft = { fields, category: nextCategory, priceNegotiable: nextPriceNegotiable, savedAt };
      window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setDraftSavedAt(savedAt);
      setDraftMessage("입력 내용이 이 기기에 자동 임시저장됐습니다.");
    }, 700);
  };

  const clearDraft = () => {
    if (draftTimerRef.current !== null) window.clearTimeout(draftTimerRef.current);
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    setDraftSavedAt("");
    setDraftMessage("임시저장 내용을 삭제했습니다. 현재 화면의 입력값은 그대로 유지됩니다.");
  };

  const refreshCompletion = (photoCount = photos.length) => {
    const form = formRef.current;
    if (!form) return;
    const data = new FormData(form);
    const text = (name: string) => String(data.get(name) ?? "").trim();
    const checks = [
      photoCount > 0,
      Boolean(text("title") && text("category") && text("subcategory")),
      Boolean(text("manufacturer") && text("model") && text("year")),
      Boolean(text("region") && text("condition")),
      data.has("priceNegotiable") || Number(text("price")) > 0,
      text("description").length >= 20,
      Boolean(text("sellerName") && text("contact")),
      Boolean(text("preferredContact") && text("contactHours")),
    ];
    setCompletionChecks(checks);
  };

  const completeDemoRegistration = () => {
    const form = formRef.current;
    if (!form?.reportValidity()) return;
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    setDraftSavedAt("");
    setRegistrationMessage(true);
  };

  const handlePhotoChange = (files: FileList | null) => {
    if (!files) return;

    const selected = Array.from(files);
    if (selected.some((file) => !ALLOWED_PHOTO_TYPES.includes(file.type))) {
      setPhotoMessage("JPG, PNG, WEBP 사진만 선택할 수 있습니다.");
      return;
    }
    if (selected.some((file) => file.size > MAX_PHOTO_SIZE)) {
      setPhotoMessage("사진 한 장의 용량은 10MB 이하여야 합니다.");
      return;
    }

    setPhotoMessage("");
    setPhotos((current) => {
      const next = [
        ...current,
        ...selected.map((file) => ({
        id: `${file.name}-${file.lastModified}-${file.size}-${Math.random()}`,
        file,
        previewUrl: URL.createObjectURL(file),
      })),
      ];
      window.setTimeout(() => refreshCompletion(next.length), 0);
      return next;
    });
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      const next = current.filter((photo) => photo.id !== id);
      window.setTimeout(() => refreshCompletion(next.length), 0);
      return next;
    });
    setPhotoMessage("");
  };

  const movePhoto = (index: number, direction: -1 | 1) => {
    setPhotos((current) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) return current;
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const makeRepresentative = (index: number) => {
    if (index === 0) return;
    setPhotos((current) => {
      const next = [...current];
      const [selected] = next.splice(index, 1);
      next.unshift(selected);
      return next;
    });
    setPhotoMessage("선택한 사진을 대표 사진으로 지정했습니다.");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

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
      preferredContact: String(data.get("preferredContact") ?? ""),
      contactHours: String(data.get("contactHours") ?? ""),
    });

    window.setTimeout(() => {
      document.getElementById("sell-preview")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_300px] lg:items-start">
      <form ref={formRef} onSubmit={handleSubmit} onInput={() => { saveDraft(); refreshCompletion(); }} className="space-y-6">
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-sm leading-relaxed text-brand">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <strong>입력 내용 자동 임시저장</strong>
              <p className="mt-1 text-xs text-text-secondary">사진을 제외한 입력값만 현재 기기에 저장됩니다. 다른 휴대폰이나 PC에서는 보이지 않습니다.</p>
              {draftMessage && <p className="mt-2 text-xs font-semibold text-brand" role="status">{draftMessage}</p>}
              {draftSavedAt && <p className="mt-1 text-[11px] text-text-muted">마지막 저장: {new Date(draftSavedAt).toLocaleString("ko-KR")}</p>}
            </div>
            {draftSavedAt && <button type="button" onClick={clearDraft} className="rounded-lg border border-brand/20 bg-white px-3 py-2 text-xs font-bold text-brand">임시저장 삭제</button>}
          </div>
        </div>
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
              <span className="mt-1 text-xs text-text-muted">정면·측면·명판·사용 흔적 사진을 차례로 추가하세요</span>
            </label>
            <input
              id="photos"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="sr-only"
              onChange={(event) => handlePhotoChange(event.target.files)}
            />
            <p className="mt-2 text-xs text-text-muted">JPG·PNG·WEBP, 장당 10MB 이하 · 사진 장수 제한 없음</p>
            <div className="mt-3 rounded-lg border border-brand/15 bg-brand/5 p-3 text-sm leading-relaxed text-brand">
              <strong>첫 번째 사진이 대표 사진으로 표시됩니다.</strong>
              <p className="mt-1 text-xs text-text-secondary">장비 전체가 잘 보이는 정면 또는 측면 사진을 첫 번째로 선택하세요. 명판, 사용 흔적, 수리 부위 사진은 그다음에 올리면 좋습니다.</p>
            </div>

            {photos.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-label="선택한 사진">
                {photos.map((photo, index) => (
                  <div key={photo.id} className="overflow-hidden rounded-lg border border-border bg-white">
                    <div className="relative">
                    <div
                      className="aspect-square bg-cover bg-center"
                      style={{ backgroundImage: `url(${photo.previewUrl})` }}
                      role="img"
                      aria-label={`${index + 1}번째 선택 사진: ${photo.file.name}`}
                    />
                    {index === 0 && (
                      <span className="absolute left-1.5 top-1.5 rounded bg-brand px-2 py-1 text-[10px] font-bold text-white">대표 사진</span>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/65 text-sm font-bold text-white"
                      aria-label={`${photo.file.name} 제거`}
                    >
                      ×
                    </button>
                    </div>
                    <div className="grid grid-cols-2 gap-1 p-2">
                      {index === 0 ? (
                        <span className="col-span-2 rounded bg-brand/5 px-2 py-1.5 text-center text-[11px] font-bold text-brand">현재 대표 사진</span>
                      ) : (
                        <button type="button" onClick={() => makeRepresentative(index)} className="col-span-2 rounded bg-brand/10 px-2 py-1.5 text-[11px] font-bold text-brand">대표로 지정</button>
                      )}
                      <button type="button" disabled={index === 0} onClick={() => movePhoto(index, -1)} className="rounded border border-border px-2 py-1.5 text-[11px] font-semibold text-text-secondary disabled:opacity-35">앞으로</button>
                      <button type="button" disabled={index === photos.length - 1} onClick={() => movePhoto(index, 1)} className="rounded border border-border px-2 py-1.5 text-[11px] font-semibold text-text-secondary disabled:opacity-35">뒤로</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {photos.length > 0 && <p className="mt-3 text-xs font-medium text-text-secondary">{photos.length}장 선택 · 순서를 바꾸면 상세 화면의 사진 순서도 함께 바뀝니다.</p>}
            {photoMessage && <p className="mt-3 text-sm text-red-700">{photoMessage}</p>}
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              대분류 <strong className="text-accent">*</strong>
              <select
                name="category"
                value={category}
                onChange={(event) => {
                  const nextCategory = event.target.value as ListingCategory;
                  setCategory(nextCategory);
                  saveDraft(nextCategory, priceNegotiable);
                }}
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
              onChange={(event) => {
                setPriceNegotiable(event.target.checked);
                saveDraft(category, event.target.checked);
              }}
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
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">구매자가 판매자에게 직접 연락할 수 있도록 연락 방법과 가능한 시간을 안내합니다.</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className={labelClass}>
              판매자 이름 <strong className="text-accent">*</strong>
              <input name="sellerName" required autoComplete="name" placeholder="이름 또는 상호" className={inputClass} />
            </label>
            <label className={labelClass}>
              연락처 <strong className="text-accent">*</strong>
              <input name="contact" required type="tel" autoComplete="tel" placeholder="010-0000-0000" className={inputClass} />
            </label>
            <label className={labelClass}>
              선호 연락 방법
              <select name="preferredContact" defaultValue="전화·문자 모두" className={inputClass}>
                <option value="전화·문자 모두">전화·문자 모두</option>
                <option value="전화 우선">전화 우선</option>
                <option value="문자 우선">문자 우선</option>
              </select>
            </label>
            <label className={labelClass}>
              연락 가능 시간 <strong className="text-accent">*</strong>
              <input name="contactHours" required maxLength={40} placeholder="예: 평일 09:00~18:00" className={inputClass} />
            </label>
          </div>
        </section>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>안전 거래 안내</strong>
          <p className="mt-1">장비를 확인하기 전 계약금이나 운송비 선입금을 요구하는 거래에 주의하세요.</p>
        </div>

        {registrationMessage && (
          <div role="status" className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-sm leading-relaxed text-brand">
            <strong>실제 등록 연결 준비 완료</strong>
            <p className="mt-1">로그인과 데이터베이스 연결 후 이 버튼에서 매물이 저장됩니다. 현재 공개 화면에서는 입력 정보가 저장되지 않습니다.</p>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <button type="submit" className="w-full rounded-xl border border-brand/25 bg-white px-6 py-4 text-base font-bold text-brand transition hover:bg-brand/5">
            입력 내용 미리보기
          </button>
          <button type="button" onClick={completeDemoRegistration} className="w-full rounded-xl bg-accent px-6 py-4 text-base font-bold text-white shadow-sm transition hover:bg-accent-hover">
            매물 등록하기
          </button>
        </div>
      </form>

      <aside className="space-y-4 lg:sticky lg:top-24">
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-5">
          {(() => {
            const completionCount = completionChecks.filter(Boolean).length;
            const completionLabels = ["대표 사진", "장비 분류", "제조 정보", "지역·상태", "가격", "상세 설명", "판매자 연락처", "연락 가능 시간"];
            return <>
          <div className="flex items-end justify-between gap-3">
            <div><p className="text-xs font-bold text-brand">등록 준비도</p><h2 className="mt-1 font-bold text-text-primary">{completionCount === 8 ? "등록 준비 완료" : "필수 정보를 채워주세요"}</h2></div>
            <span className="text-lg font-bold text-brand">{Math.round((completionCount / 8) * 100)}%</span>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white" aria-label={`등록 준비도 ${completionCount}/8`}>
            <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${(completionCount / 8) * 100}%` }} />
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-text-secondary">
            {completionLabels.map((item, index) => (
              <li key={item} className={completionChecks[index] ? "font-semibold text-brand" : ""}>{completionChecks[index] ? "완료" : "확인"} · {item}</li>
            ))}
          </ul>
            </>;
          })()}
        </div>
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
              <div className="flex justify-between gap-3"><dt className="text-text-muted">연락 방법</dt><dd className="font-medium">{preview.preferredContact}</dd></div>
              <div className="flex justify-between gap-3"><dt className="text-text-muted">연락 시간</dt><dd className="font-medium text-right">{preview.contactHours}</dd></div>
            </dl>
            <p className="mt-4 rounded-lg bg-brand/5 p-3 text-xs leading-relaxed text-brand">입력 흐름 확인 완료. 실제 저장 구조와 로그인 기능은 구현되었고 서비스 데이터베이스 연결을 기다리고 있습니다.</p>
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
