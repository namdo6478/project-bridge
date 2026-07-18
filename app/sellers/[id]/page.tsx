import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { listings } from "@/lib/data/listings";
import { getSellerById, sellers } from "@/lib/data/sellers";
import { formatDate } from "@/lib/utils/format";

interface SellerPageProps { params: Promise<{ id: string }> }

export function generateStaticParams() { return sellers.map((seller) => ({ id: seller.id })); }

export async function generateMetadata({ params }: SellerPageProps): Promise<Metadata> {
  const seller = getSellerById((await params).id);
  return seller ? { title: `${seller.displayName} 판매자`, description: seller.introduction } : { title: "판매자를 찾을 수 없습니다" };
}

export default async function SellerPage({ params }: SellerPageProps) {
  const seller = getSellerById((await params).id);
  if (!seller) notFound();
  const sellerListings = listings.filter((listing) => listing.sellerId === seller.id);
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-6xl">
      <Link href="/listings" className="text-sm font-semibold text-brand hover:underline">매물 목록으로</Link>
      <section className="mt-5 rounded-2xl border border-border bg-white p-6 sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start"><div><p className="text-xs font-bold text-brand">SELLER</p><h1 className="mt-2 text-3xl font-bold text-text-primary">{seller.displayName}</h1><p className="mt-2 text-sm text-text-secondary">{seller.memberType} · {seller.region}</p></div><div className="flex flex-wrap gap-2">{seller.identityVerified && <span className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">본인인증</span>}{seller.businessVerified && <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">사업자인증</span>}</div></div><p className="mt-5 max-w-3xl text-sm leading-relaxed text-text-secondary">{seller.introduction}</p><dl className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-5 text-center"><div><dt className="text-xs text-text-muted">가입일</dt><dd className="mt-1 text-sm font-bold text-text-primary">{formatDate(seller.joinedAt)}</dd></div><div><dt className="text-xs text-text-muted">판매완료</dt><dd className="mt-1 text-sm font-bold text-text-primary">{seller.completedSales}건</dd></div><div><dt className="text-xs text-text-muted">최근 활동</dt><dd className="mt-1 text-sm font-bold text-text-primary">{formatDate(seller.lastActiveAt)}</dd></div></dl><p className="mt-5 rounded-lg bg-surface-muted p-3 text-xs leading-relaxed text-text-muted">인증 표시는 회원의 신원 또는 사업자등록 정보 확인 여부입니다. 장비 상태, 소유권, 거래 이행을 장터가 보증한다는 뜻은 아닙니다.</p></section>
      <section className="mt-8"><div className="mb-5"><p className="text-xs font-bold text-brand">LISTINGS</p><h2 className="mt-1 text-2xl font-bold text-text-primary">등록한 매물 {sellerListings.length}건</h2></div><ListingGrid listings={sellerListings} /></section>
    </div></div>
  );
}
