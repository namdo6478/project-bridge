import type { Metadata } from "next";
import { InquiryManager } from "@/components/inquiries/InquiryManager";

export const metadata: Metadata = {
  title: "문의 내역",
  description: "보낸 문의와 받은 문의를 확인하세요.",
};

export default function InquiriesPage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-brand">INQUIRIES</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">문의 내역</h1>
        <p className="mt-2 text-sm text-text-secondary">구매자가 보낸 문의와 내가 보낸 문의를 한곳에서 확인합니다.</p>
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><strong>문의 관리 화면 예시입니다.</strong><p className="mt-1">탭 전환, 연락처 복사, 확인 처리와 문의 종료를 직접 눌러 흐름을 확인할 수 있습니다.</p></div>
        <InquiryManager />
      </div>
    </div>
  );
}
