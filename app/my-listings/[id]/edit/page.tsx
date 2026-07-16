import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EditListingForm } from "@/components/listings/EditListingForm";
import { getListingById } from "@/lib/data/listings";

export const metadata: Metadata = {
  title: "매물 정보 수정",
  description: "등록한 축산기계 매물의 정보와 거래 조건을 수정하세요.",
};

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <Link href="/my-listings" className="text-sm font-semibold text-brand hover:underline">내 매물로 돌아가기</Link>
        <h1 className="mt-3 text-3xl font-bold text-text-primary">매물 정보 수정</h1>
        <p className="mt-2 text-sm text-text-secondary">가격이나 장비 상태가 달라졌다면 구매자가 혼동하지 않도록 바로 고쳐 주세요.</p>
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
          <strong>수정 화면 예시입니다.</strong>
          <p className="mt-1">로그인과 데이터베이스 연결 후 본인 매물만 수정할 수 있습니다.</p>
        </div>
        <div className="mt-7"><EditListingForm listing={listing} /></div>
      </div>
    </div>
  );
}
