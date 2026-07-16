import type { Metadata } from "next";
import Link from "next/link";
import { ReportQueue } from "@/components/admin/ReportQueue";

export const metadata: Metadata = { title: "신고 검수 | 운영자" };

export default function AdminReportsPage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/admin" className="text-sm font-semibold text-brand hover:underline">운영 현황으로 돌아가기</Link>
        <p className="mt-6 text-sm font-semibold text-red-700">REPORT REVIEW</p><h1 className="mt-1 text-3xl font-bold text-text-primary">신고 검수</h1><p className="mt-2 text-sm leading-relaxed text-text-secondary">신고 사유와 위험도를 확인하고 검토 상태 또는 매물 숨김 조치를 선택합니다.</p>
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-900"><strong>운영자 전용 화면 예시입니다.</strong><p className="mt-1">버튼을 눌러 검토 상태 변경 흐름을 확인할 수 있습니다.</p></div>
        <div className="mt-7"><ReportQueue /></div>
      </div>
    </div>
  );
}
