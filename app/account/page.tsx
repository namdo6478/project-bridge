import type { Metadata } from "next";
import Link from "next/link";
import { AccountForm } from "@/components/account/AccountForm";

export const metadata: Metadata = {
  title: "내 정보",
  description: "축산기계장터 판매자 정보와 연락처를 관리하세요.",
};

export default function AccountPage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold text-brand">ACCOUNT</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">내 정보</h1>
        <p className="mt-2 text-sm text-text-secondary">판매자 이름과 연락처를 한 번 저장하면 매물 등록과 문의 연결에 사용됩니다.</p>

        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>판매자 정보 저장 데모</strong>
          <p className="mt-1">현재 기기에 정보를 저장하고 장비 등록 화면에 자동 입력되는 흐름을 확인할 수 있습니다. 서버로는 전송되지 않습니다.</p>
        </div>
        <AccountForm />

        <div className="mt-6 border-t border-border pt-6"><Link href="/my-listings" className="text-sm font-semibold text-brand hover:underline">내 매물 관리</Link></div>
      </div>
    </div>
  );
}
