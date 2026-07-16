"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

const reasons = [
  ["허위·중복 매물", "실제 장비가 없거나 같은 매물을 반복 등록한 경우"],
  ["판매 상태가 다름", "판매완료 장비를 계속 판매중으로 표시한 경우"],
  ["사진·설명 도용", "다른 매물의 사진이나 설명을 무단으로 사용한 경우"],
  ["선입금 요구", "실물 확인 전 계약금·운송비 등을 먼저 요구한 경우"],
  ["부적절한 연락", "욕설·협박·반복 연락 등 거래와 무관한 행동"],
  ["기타", "위 항목에 해당하지 않는 운영정책 위반"],
] as const;

export function ReportForm({ listingId }: { listingId: string }) {
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [reference, setReference] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!reason) return;
    const suffix = Math.floor(1000 + Math.random() * 9000);
    setReference(`RPT-20260716-${suffix}`);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-brand/20 bg-white p-6 shadow-sm sm:p-8" role="status">
        <p className="text-sm font-bold text-brand">신고 접수 예시 완료</p>
        <h2 className="mt-2 text-2xl font-bold text-text-primary">운영 검수 대상으로 등록했습니다</h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">공개 미리보기의 예시 동작이며 실제 신고는 저장되지 않습니다. 실제 서비스에서는 운영자가 매물과 거래 기록을 확인한 뒤 필요한 조치를 진행합니다.</p>
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

      <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
        <label className="block text-sm font-semibold text-text-primary">상세 내용
          <textarea name="details" rows={6} minLength={10} maxLength={500} required placeholder="확인한 상황과 판매자가 요청한 내용을 구체적으로 적어 주세요. 계좌 비밀번호나 인증번호는 입력하지 마세요." className="mt-1.5 w-full resize-y rounded-lg border border-border px-3.5 py-3 text-sm leading-relaxed outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
        </label>
        <label className="mt-5 block text-sm font-semibold text-text-primary">답변받을 연락처 <span className="font-normal text-text-muted">(선택)</span>
          <input type="tel" placeholder="010-1234-5678" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
        </label>
      </section>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"><input type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-brand" /><span>신고 내용이 사실에 근거하며, 단순한 가격 흥정이나 개인적인 불만만으로 신고하지 않았음을 확인합니다.</span></label>

      <div className="grid gap-3 sm:grid-cols-2"><Link href={`/listings/${listingId}`} className="rounded-xl border border-border bg-white px-6 py-3.5 text-center text-sm font-bold text-text-secondary hover:bg-surface-muted">취소</Link><button type="submit" className="rounded-xl bg-red-700 px-6 py-3.5 text-sm font-bold text-white hover:bg-red-800">신고 접수 예시</button></div>
    </form>
  );
}
