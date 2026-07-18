"use client";

import { FormEvent, useEffect, useState } from "react";
import { LISTING_REGIONS } from "@/lib/types/listing";
import {
  loadStoredSellerProfile,
  removeStoredSellerProfile,
  saveStoredSellerProfile,
  type StoredSellerProfile,
} from "@/lib/account/profile-storage";

const inputClass = "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10";

const initialProfile: Omit<StoredSellerProfile, "savedAt"> = {
  displayName: "",
  sellerType: "개인",
  phone: "",
  region: "",
  contactVisibility: "인증회원 공개",
  preferredContact: "전화·문자 모두",
  contactHours: "평일 09:00~18:00",
  introduction: "",
};

export function AccountForm() {
  const [profile, setProfile] = useState(initialProfile);
  const [savedAt, setSavedAt] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const stored = loadStoredSellerProfile();
    if (!stored) return;
    window.setTimeout(() => {
      setProfile(stored);
      setSavedAt(stored.savedAt);
      setNotice("이 기기에 저장된 판매자 정보를 불러왔습니다.");
    }, 0);
  }, []);

  const updateProfile = <K extends keyof typeof initialProfile>(key: K, value: (typeof initialProfile)[K]) => {
    setProfile((current) => ({ ...current, [key]: value }));
    setNotice("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextSavedAt = new Date().toISOString();
    saveStoredSellerProfile({ ...profile, savedAt: nextSavedAt });
    setSavedAt(nextSavedAt);
    setNotice("판매자 정보를 이 기기에 저장했습니다. 장비 등록 화면에 이름과 연락처가 자동 입력됩니다.");
  };

  const clearProfile = () => {
    removeStoredSellerProfile();
    setProfile(initialProfile);
    setSavedAt("");
    setNotice("이 기기에 저장된 판매자 정보를 삭제했습니다.");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-6">
      <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-text-primary">휴대폰 인증</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">실제 서비스에서는 인증된 번호를 계정 기준으로 사용하고 사용자가 임의로 바꾸지 못하게 합니다.</p>
          </div>
          <span className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">데모 화면</span>
        </div>
      </section>

      <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
        <h2 className="text-lg font-bold text-text-primary">판매자 정보</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">매물에 표시할 이름과 구매자가 직접 연락할 방법을 입력하세요.</p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-text-primary">
            이름 또는 상호
            <input value={profile.displayName} onChange={(event) => updateProfile("displayName", event.target.value)} required maxLength={30} className={inputClass} placeholder="예: 홍길동 농장" />
          </label>
          <label className="block text-sm font-semibold text-text-primary">
            판매자 유형
            <select value={profile.sellerType} onChange={(event) => updateProfile("sellerType", event.target.value as StoredSellerProfile["sellerType"])} className={inputClass}>
              <option value="개인">개인</option>
              <option value="영농법인">영농법인</option>
              <option value="업체">업체·판매점</option>
            </select>
          </label>
          <label className="block text-sm font-semibold text-text-primary">
            주 거래 지역
            <select value={profile.region} onChange={(event) => updateProfile("region", event.target.value)} required className={inputClass}>
              <option value="" disabled>지역 선택</option>
              {LISTING_REGIONS.filter((region) => region !== "전국").map((region) => <option key={region} value={region}>{region}</option>)}
            </select>
          </label>
          <label className="block text-sm font-semibold text-text-primary">
            연락처 공개 범위
            <select value={profile.contactVisibility} onChange={(event) => updateProfile("contactVisibility", event.target.value as StoredSellerProfile["contactVisibility"])} className={inputClass}>
              <option value="인증회원 공개">휴대폰 인증 회원에게 공개</option>
              <option value="전체 공개">누구에게나 공개</option>
              <option value="비공개">비공개</option>
            </select>
          </label>
        </div>

        <label className="mt-5 block text-sm font-semibold text-text-primary">
          연락처
          <input value={profile.phone} onChange={(event) => updateProfile("phone", event.target.value)} type="tel" inputMode="tel" required pattern="[0-9-]{10,13}" className={inputClass} placeholder="010-1234-5678" />
        </label>
        <p className="mt-2 text-xs text-text-muted">실제 연결 후에는 휴대폰 인증을 완료한 번호만 사용합니다.</p>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-text-primary">
            선호 연락 방법
            <select value={profile.preferredContact} onChange={(event) => updateProfile("preferredContact", event.target.value as StoredSellerProfile["preferredContact"])} className={inputClass}>
              <option value="전화·문자 모두">전화·문자 모두</option>
              <option value="전화 우선">전화 우선</option>
              <option value="문자 우선">문자 우선</option>
            </select>
          </label>
          <label className="block text-sm font-semibold text-text-primary">
            연락 가능 시간
            <input value={profile.contactHours} onChange={(event) => updateProfile("contactHours", event.target.value)} required maxLength={40} className={inputClass} placeholder="예: 평일 09:00~18:00" />
          </label>
        </div>

        <label className="mt-5 block text-sm font-semibold text-text-primary">
          판매자 소개
          <textarea value={profile.introduction} onChange={(event) => updateProfile("introduction", event.target.value)} maxLength={500} rows={4} className={`${inputClass} resize-y leading-relaxed`} placeholder="주요 취급 장비, 거래 가능 지역, 운영 시간 등을 적어주세요." />
        </label>
      </section>

      <section className="rounded-xl border border-brand/15 bg-brand/5 p-5 text-sm leading-relaxed text-text-secondary">
        <h2 className="font-bold text-brand">연락처와 기기 저장 안내</h2>
        <p className="mt-2">공개 데모에서는 정보가 현재 기기에만 저장되며 언제든 삭제할 수 있습니다. 실제 서비스에서는 서버 권한으로 보호하고 선택한 공개 범위를 적용합니다.</p>
      </section>

      {notice && <p role="status" className="rounded-xl border border-brand/20 bg-white p-4 text-sm font-semibold text-brand">{notice}{savedAt && <span className="mt-1 block text-xs font-normal text-text-muted">마지막 저장: {new Date(savedAt).toLocaleString("ko-KR")}</span>}</p>}

      <div className="grid gap-3 sm:grid-cols-2">
        <button type="button" onClick={clearProfile} className="rounded-xl border border-border bg-white px-6 py-3.5 text-sm font-bold text-text-secondary">저장 정보 삭제</button>
        <button type="submit" className="rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-light">판매자 정보 저장</button>
      </div>
    </form>
  );
}
