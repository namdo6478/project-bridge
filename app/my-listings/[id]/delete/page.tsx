import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/data/listings";

export const metadata: Metadata = { title: "매물 삭제 확인" };

export default async function DeleteListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  return (
    <div className="bg-surface-muted px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl rounded-2xl border border-red-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-bold text-red-700">DELETE LISTING</p>
        <h1 className="mt-2 text-2xl font-bold text-text-primary">이 매물을 삭제할까요?</h1>
        <p className="mt-4 rounded-lg bg-surface-muted p-4 font-semibold text-text-primary">{listing.title}</p>
        <p className="mt-4 text-sm leading-relaxed text-text-secondary">삭제하면 매물 정보와 등록 사진, 관심 매물 저장 기록이 함께 없어지며 되돌릴 수 없습니다. 잠시 판매를 멈추는 경우에는 삭제 대신 판매완료 상태를 권장합니다.</p>
        <p className="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-900">공개 화면은 예시이므로 삭제 버튼이 비활성화되어 있습니다.</p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          <Link href="/my-listings" className="rounded-lg border border-border px-5 py-3 text-center text-sm font-bold text-text-secondary hover:bg-surface-muted">취소</Link>
          <button type="button" disabled className="rounded-lg bg-red-700 px-5 py-3 text-sm font-bold text-white opacity-50">영구 삭제</button>
        </div>
      </div>
    </div>
  );
}
