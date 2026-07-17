"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const reasons = [
  ["허위·중복 매물", "실제 장비가 없거나 같은 매물을 반복 등록한 경우"],
  ["판매 상태가 다름", "판매완료 장비를 계속 판매중으로 표시한 경우"],
  ["사진·설명 도용", "다른 매물의 사진이나 설명을 무단으로 사용한 경우"],
  ["선입금 요구", "실물 확인 전 계약금·운송비 등을 먼저 요구한 경우"],
  ["사기 의심", "판매자·계좌 정보가 다르거나 실물 확인을 계속 피하는 경우"],
  ["금지 품목·개인정보", "불법·도난 의심 장비나 타인의 개인정보가 포함된 경우"],
] as const;

const REPORT_STORAGE_KEY = "chuksan-market:submitted-reports:v1";

export function ReportForm({ listingId }: { listingId: string }) {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reason) return;
    const suffix = Math.floor(1000 + Math.random() * 9000);
    setReference(`RPT-20260716-${suffix}`);
    try {
      const saved = JSON.parse(window.localStorage.getItem(REPORT_STORAGE_KEY) ?? "[]") as Array<{ listingId: string; reason: string; createdAt: string }>;
      window.localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify([{ listingId, reason, createdAt: new Date().toISOString() }, ...saved].slice(0, 20)));
    } catch {
      window.localStorage.removeItem(REPORT_STORAGE_KEY);
    }
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand/20 bg-white p-6 shadow-sm sm:p-8" role="status">
        <p className="text-sm font-bold text-brand">신고 접수 예시 완료</p>
        <h2 className="mt-2 text-2xl font-bold text-text-primary">운영 검수 대상으로 등록했습니다</h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">공개 미리보기의 예시 동작이며 실제 신고는 저장되지 않습니다. 실제 서비스에서는 운영정책 위반 여부만 검토해 매물 유지·숨김·삭제를 결정하며 가격 흥정, 환불 또는 거래 분쟁에는 개입하지 않습니다.</p>
        <dl className="mt-5 rounded-xl bg-surface-muted p-4 text-sm"><div className="flex justify-between gap-4"><dt className="text-text-muted">접수번호</dt><dd className="font-bold text-text-primary">{reference}</dd></div><div className="mt-2 flex justify-between gap-4"><dt className="text-text-muted">처리 상태</dt><dd className="font-bold text-brand">검토 대기</dd></div></dl>
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href={`/listings/${listingId}`} className="rounded-lg border border-border px-5 py-3 text-center text-sm font-bold text-text-secondary hover:bg-surface-muted">매물로 돌아가기</Link><Link href="/safety" className="rounded-lg bg-brand px-5 py-3 text-center text-sm font-bold text-white">안전거래 안내 보기</Link></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
        <fieldset>
          <legend className="text-lg font-bold text-text-primary">신고 사유</legend>
          <p className="mt-1 text-sm text-text-secondary">가장 가까운 사유 하나를 선택해 주세요.</p>
          <div className="mt-5 space-y-3">
            {reasons.map(([title, description]) => (
              <label key={title} className={`flex cursor-pointer gap-3 rounded-xl border p-4 transition ${reason === title ? "border-brand bg-brand/5" : "border-border hover:border-brand/25"}`}>
                <input type="radio" name="reason" value={title} checked={reason === title} onChange={(event) => setReason(event.target.value)} className="mt-1 h-4 w-4 shrink-0 accent-brand" required />
                <span><strong className="block text-sm text-text-primary">{title}</strong><span className="mt-1 block text-xs leading-relaxed text-text-muted">{description}</span></span>
              </label>
            ))}
          </div>
        </fieldset>
      </section>

      <section className="rounded-xl border border-brand/20 bg-brand/5 p-5 text-sm leading-relaxed text-text-secondary sm:p-6">
        <h2 className="font-bold text-brand">신고가 아닌 경우</h2>
        <ul className="mt-3 space-y-2"><li>가격·운송·시운전 문의는 판매자에게 직접 연락합니다.</li><li>단순 변심, 환불, 계약 분쟁은 거래 당사자가 해결합니다.</li><li>송금 피해나 범죄가 의심되면 금융기관과 경찰 등 관계기관에 먼저 신고합니다.</li></ul>
      </section>

      <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
        <label className="block text-sm font-semibold text-text-primary">상세 내용
          <textarea name="details" rows={6} minLength={10} maxLength={500} required placeholder="확인한 상황과 판매자가 요청한 내용을 구체적으로 적어 주세요. 계좌 비밀번호나 인증번호는 입력하지 마세요." className="mt-1.5 w-full resize-y rounded-lg border border-border px-3.5 py-3 text-sm leading-relaxed outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
        </label>
        <p className="mt-4 rounded-lg bg-surface-muted p-3 text-xs leading-relaxed text-text-muted">운영자는 신고 처리 결과를 개별 상담하지 않습니다. 동일 매물에 반복 신고하지 말고, 추가 피해 위험이 있으면 관계기관에도 신고하세요.</p>
      </section>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"><input type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-brand" /><span>신고 내용이 사실에 근거하며, 단순 문의·가격 흥정·개인적인 불만 또는 거래 분쟁 해결 요청이 아님을 확인합니다.</span></label>

      <div className="grid gap-3 sm:grid-cols-2"><Link href={`/listings/${listingId}`} className="rounded-xl border border-border bg-white px-6 py-3.5 text-center text-sm font-bold text-text-secondary hover:bg-surface-muted">취소</Link><button type="submit" className="rounded-xl bg-red-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-red-800">신고 접수 예시</button></div>
    </form>
  );
}
