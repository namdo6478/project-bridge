"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

export function InquiryForm({ listingId }: { listingId: string }) {
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (sent) {
    return (
      <div role="status" className="mt-6 rounded-2xl border border-brand/20 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold text-brand">문의 전송 예시 완료</p>
        <h2 className="mt-2 text-2xl font-bold text-text-primary">판매자에게 문의를 보냈습니다</h2>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">공개 미리보기의 예시 동작이며 실제 문의는 저장되지 않습니다. 로그인 연결 후에는 문의 내역에서 답변 상태를 확인할 수 있습니다.</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href={`/listings/${listingId}`} className="rounded-lg border border-border px-5 py-3 text-center text-sm font-bold text-text-secondary">매물로 돌아가기</Link><Link href="/inquiries" className="rounded-lg bg-brand px-5 py-3 text-center text-sm font-bold text-white">문의 내역 보기</Link></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-6">
      <section className="rounded-xl border border-border bg-white p-5 sm:p-7">
        <label className="block text-sm font-semibold text-text-primary">문의 내용
          <textarea required minLength={10} maxLength={1000} rows={7} placeholder="현재 판매 여부, 시운전 가능 날짜, 수리 이력, 운송 조건처럼 확인할 내용을 구체적으로 적어 주세요." className="mt-1.5 w-full resize-y rounded-lg border border-border px-3.5 py-3 text-sm leading-relaxed outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
        </label>
        <label className="mt-5 block text-sm font-semibold text-text-primary">회신받을 연락처
          <input type="tel" autoComplete="tel" required pattern="0[0-9]{1,2}-?[0-9]{3,4}-?[0-9]{4}" placeholder="010-1234-5678" className="mt-1.5 w-full rounded-lg border border-border px-3.5 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/10" />
        </label>
        <p className="mt-2 text-xs text-text-muted">입력한 연락처는 이 매물의 판매자에게만 전달됩니다.</p>
      </section>

      <section className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm leading-relaxed text-amber-900">
        <h2 className="font-bold text-amber-950">문의 전 안전 확인</h2>
        <ul className="mt-2 space-y-1.5"><li>장비 실물과 명판, 시운전 가능 여부를 먼저 확인합니다.</li><li>장비 확인 전 계약금이나 운송비 선입금 요구에 주의합니다.</li><li>개인정보·계좌 비밀번호·인증번호는 문의 내용에 적지 않습니다.</li></ul>
      </section>

      <button type="submit" className="w-full rounded-xl bg-accent px-6 py-4 text-sm font-bold text-white hover:bg-accent-hover">문의 보내기 예시</button>
    </form>
  );
}
