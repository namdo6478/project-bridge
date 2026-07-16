import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById } from "@/lib/data/listings";
import { InquiryForm } from "@/components/inquiries/InquiryForm";

export const metadata: Metadata = {
  title: "판매자에게 문의",
  description: "축산기계 매물의 상태와 거래 조건을 판매자에게 문의하세요.",
};

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = getListingById(id);
  if (!listing) notFound();

  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href={`/listings/${listing.id}`} className="text-sm font-semibold text-brand hover:underline">매물 상세로 돌아가기</Link>
        <p className="mt-6 text-sm font-semibold text-brand">SAFE INQUIRY</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">판매자에게 문의</h1>
        <p className="mt-3 rounded-xl border border-border bg-white p-4 font-semibold text-text-primary">{listing.title}</p>

        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900"><strong>문의 화면 예시입니다.</strong><p className="mt-1">실제 로그인과 문의 데이터베이스를 연결하면 판매자에게 전달됩니다.</p></div>

        <InquiryForm listingId={listing.id} />
      </div>
    </div>
  );
}
