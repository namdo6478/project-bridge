import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "운영자 화면 예시" };

const metrics = [["전체 매물", "12"], ["판매중", "9"], ["오늘 등록", "3"], ["검토 대기 신고", "2"]];

export default function AdminPage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-relaxed text-red-900"><strong>운영자 화면 예시입니다.</strong><p className="mt-1">실제 서비스에서는 관리자 계정만 접근하도록 별도 권한을 적용합니다.</p></div>
        <p className="mt-7 text-sm font-semibold text-brand">ADMIN</p><h1 className="mt-1 text-3xl font-bold text-text-primary">장터 운영 현황</h1><p className="mt-2 text-sm text-text-secondary">초기 운영은 신고된 허위·위험 매물 확인과 최소 조치에 집중합니다.</p>
        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map(([label, value]) => <div key={label} className="rounded-xl border border-border bg-white p-5"><p className="text-xs text-text-muted">{label}</p><p className="mt-2 text-3xl font-bold text-text-primary">{value}</p></div>)}</div>
        <div className="mt-7 grid gap-4 sm:grid-cols-2"><Link href="/admin/reports" className="rounded-xl border border-red-200 bg-white p-6 hover:border-red-300 hover:shadow-sm"><p className="text-sm font-bold text-red-700">신고 검수</p><h2 className="mt-2 text-xl font-bold text-text-primary">검토 대기 신고 2건</h2><p className="mt-2 text-sm leading-relaxed text-text-secondary">선입금 요구, 사진 도용 등 위험 신고를 확인하고 매물 숨김 여부를 결정합니다.</p><span className="mt-5 inline-flex text-sm font-bold text-red-700">신고 목록 보기</span></Link><Link href="/my-listings" className="rounded-xl border border-border bg-white p-6 hover:border-brand/25 hover:shadow-sm"><p className="text-sm font-bold text-brand">매물 관리</p><h2 className="mt-2 text-xl font-bold text-text-primary">거래 상태와 매물 정보</h2><p className="mt-2 text-sm leading-relaxed text-text-secondary">판매중·예약중·판매완료 상태와 수정·삭제 흐름을 확인합니다.</p><span className="mt-5 inline-flex text-sm font-bold text-brand">매물 관리 보기</span></Link></div>
      </div>
    </div>
  );
}
