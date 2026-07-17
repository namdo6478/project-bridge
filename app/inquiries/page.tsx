import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "판매자 직접 연락 안내",
  description: "축산기계장터에서 판매자와 직접 연락하는 방법을 확인하세요.",
};

export default function InquiriesPage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-brand">DIRECT CONTACT</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">판매자와 직접 연락합니다</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-text-secondary">초기 장터는 운영자가 문의를 전달하거나 상담하지 않습니다. 매물 상세에서 휴대폰 인증을 마친 뒤 판매자가 공개한 전화·문자 방식으로 직접 연락하세요.</p>
        <div className="mt-7 grid gap-4 sm:grid-cols-3">
          {[["1", "매물 확인", "사진, 명판, 연식과 설명을 확인합니다."], ["2", "휴대폰 인증", "연락처 보호를 위해 구매자 번호를 확인합니다."], ["3", "직접 연락", "판매자에게 전화·문자로 상태와 거래 조건을 묻습니다."]].map(([number, title, description]) => (
            <div key={number} className="rounded-xl border border-border bg-white p-5"><span className="text-xs font-bold text-brand">0{number}</span><h2 className="mt-2 font-bold text-text-primary">{title}</h2><p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p></div>
          ))}
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2"><Link href="/listings" className="rounded-xl bg-brand px-5 py-3.5 text-center text-sm font-bold text-white">매물 찾기</Link><Link href="/policy" className="rounded-xl border border-brand/25 bg-white px-5 py-3.5 text-center text-sm font-bold text-brand">운영 원칙 보기</Link></div>
      </div>
    </div>
  );
}
