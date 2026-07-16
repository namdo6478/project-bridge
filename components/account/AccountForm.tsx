"use client";

import { FormEvent, useState } from "react";

const inputClass = "mt-1.5 w-full rounded-lg border border-border bg-white px-3.5 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10";

export function AccountForm() {
  const [saved, setSaved] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-7 space-y-6">
      <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
        <h2 className="text-lg font-bold text-text-primary">계정 정보</h2>
        <label className="mt-5 block text-sm font-semibold text-text-primary">
          로그인 이메일
          <input defaultValue="demo@example.com" readOnly className={`${inputClass} bg-surface-muted text-text-secondary`} />
        </label>
      </section>

      <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
        <h2 className="text-lg font-bold text-text-primary">판매자 정보</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">매물에 표시할 이름과 구매 문의를 받을 연락처를 입력하세요.</p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-semibold text-text-primary">
            이름 또는 상호
            <input name="displayName" defaultValue="홍길동 농장" required maxLength={30} className={inputClass} onChange={() => setSaved(false)} />
          </label>
          <label className="block text-sm font-semibold text-text-primary">
            판매자 유형
            <select name="sellerType" defaultValue="개인" className={inputClass} onChange={() => setSaved(false)}>
              <option value="개인">개인</option>
              <option value="판매점">판매점</option>
            </select>
          </label>
        </div>
        <label className="mt-5 block text-sm font-semibold text-text-primary">
          연락처
          <input name="phone" type="tel" inputMode="tel" defaultValue="010-1234-5678" required pattern="[0-9-]{10,13}" className={inputClass} onChange={() => setSaved(false)} />
        </label>
        <p className="mt-2 text-xs text-text-muted">숫자와 하이픈(-)을 포함해 입력하세요. 실제 서비스에서는 본인 확인 후 사용됩니다.</p>
      </section>

      <section className="rounded-xl border border-brand/15 bg-brand/5 p-5 text-sm leading-relaxed text-text-secondary">
        <h2 className="font-bold text-brand">연락처 공개 안내</h2>
        <p className="mt-2">연락처는 구매자가 문의를 시작할 때만 보여 주고, 검색 목록에는 공개하지 않는 방식으로 운영할 예정입니다.</p>
      </section>

      {saved && (
        <p role="status" className="rounded-xl border border-brand/20 bg-white p-4 text-sm font-semibold text-brand">
          입력한 판매자 정보를 저장하는 흐름을 확인했습니다. 공개 예시에서는 새로고침하면 초기화됩니다.
        </p>
      )}

      <button type="submit" className="w-full rounded-xl bg-brand px-6 py-3.5 text-sm font-bold text-white transition hover:bg-brand-light">
        판매자 정보 저장 예시
      </button>
    </form>
  );
}
