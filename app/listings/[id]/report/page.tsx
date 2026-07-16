import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReportForm } from "@/components/reports/ReportForm";
import { getListingById } from "@/lib/data/listings";

export const metadata: Metadata = {
  title: "매물 신고",
  description: "허위 매물과 부적절한 거래를 운영자에게 신고하세요.",
};

export default async function ReportListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href={`/listings/${listing.id}`} className="text-sm font-semibold text-brand hover:underline">매물 상세로 돌아가기</Link>
        <p className="mt-6 text-sm font-semibold text-red-700">REPORT LISTING</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">매물 신고</h1>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">신고 내용은 판매자에게 바로 공개하지 않고 운영 검수에 사용합니다.</p>
        <div className="mt-5 rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">신고 대상</p><p className="mt-1 font-bold text-text-primary">{listing.title}</p><p className="mt-1 text-sm text-text-secondary">{listing.manufacturer} · {listing.region} · {listing.year}년</p></div>
        <div className="mt-6"><ReportForm listingId={listing.id} /></div>
      </div>
    </div>
  );
}
