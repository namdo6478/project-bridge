import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById, listings } from "@/lib/data/listings";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { CategoryBadge, StatusBadge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { ListingGallery } from "@/components/listings/ListingGallery";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return listings.map((listing) => ({
    id: listing.id,
  }));
}

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    return { title: "매물을 찾을 수 없습니다" };
  }

  return {
    title: listing.title,
    description: listing.description.slice(0, 120),
  };
}

export default async function ListingDetailPage({
  params,
}: ListingDetailPageProps) {
  const { id } = await params;
  const listing = getListingById(id);

  if (!listing) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/listings"
        className="inline-flex items-center gap-1 text-sm font-medium text-text-secondary hover:text-brand"
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
        매물 목록으로
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ListingGallery category={listing.subcategory} />

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge category={listing.category} />
            <span className="rounded bg-brand/5 px-2 py-0.5 text-xs font-medium text-brand">
              {listing.subcategory}
            </span>
            <StatusBadge status={listing.status} />
            <span className="rounded bg-surface-muted px-2 py-0.5 text-xs font-medium text-text-secondary">
              {listing.condition}
            </span>
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-tight text-text-primary sm:text-3xl">
            {listing.title}
          </h1>

          <p className="mt-4 text-3xl font-bold text-brand">
            {formatPrice(listing.price, listing.priceNegotiable)}
          </p>

          <FavoriteButton />

          <dl className="mt-6 grid grid-cols-2 gap-4 rounded-lg border border-border bg-surface-muted p-5">
            <div>
              <dt className="text-sm text-text-muted">지역</dt>
              <dd className="mt-0.5 font-semibold text-text-primary">
                {listing.region}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">연식</dt>
              <dd className="mt-0.5 font-semibold text-text-primary">
                {listing.year}년
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">제조사</dt>
              <dd className="mt-0.5 font-semibold text-text-primary">
                {listing.manufacturer}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">등록일</dt>
              <dd className="mt-0.5 font-semibold text-text-primary">
                {formatDate(listing.createdAt)}
              </dd>
            </div>
          </dl>

          <section className="mt-4 rounded-lg border border-border bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div><p className="text-xs font-semibold text-text-muted">판매자 정보</p><h2 className="mt-1 font-bold text-text-primary">{listing.condition === "신품" ? "장비 판매점" : "개인 판매자"}</h2></div>
              <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">연락처 확인 필요</span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
              <div><dt className="text-text-muted">활동 지역</dt><dd className="mt-1 font-semibold text-text-primary">{listing.region}</dd></div>
              <div><dt className="text-text-muted">연락 방법</dt><dd className="mt-1 font-semibold text-text-primary">문의 후 확인</dd></div>
            </dl>
            <p className="mt-4 text-xs leading-relaxed text-text-muted">판매자 이름과 연락처 본인 확인 표시는 실제 회원 기능이 연결된 뒤 표시합니다.</p>
          </section>

          {(listing.status === "판매중" || listing.status === "구매요청") && (
            <div className="mt-6">
              <p className="mb-2 text-xs leading-relaxed text-text-muted">문의 전 연식·모델·수리 이력과 현재 판매 상태를 다시 확인하세요.</p>
              <Link
                href={`/listings/${listing.id}/inquiry`}
                className="block w-full rounded-md bg-accent px-6 py-3 text-center text-sm font-semibold text-white hover:bg-accent-hover"
              >
                {listing.status === "구매요청"
                  ? "구매 희망자에게 제안"
                  : "판매자에게 문의"}
              </Link>
            </div>
          )}
        </div>
      </div>

      <section className="mt-10 rounded-lg border border-border bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-text-primary">상세 설명</h2>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-text-secondary">
          {listing.description}
        </p>
      </section>

      <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-6 sm:p-8">
        <h2 className="font-bold text-amber-950">거래 전 꼭 확인하세요</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-900">
          <li>장비 실물과 명판의 제조번호·연식을 직접 확인합니다.</li>
          <li>시운전, 수리 이력, 운송 비용과 책임 범위를 판매자와 합의합니다.</li>
          <li>장비를 확인하기 전 계약금이나 운송비 선입금을 요구하는 거래에 주의합니다.</li>
        </ul>
        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-amber-200 pt-4 text-sm"><Link href="/safety" className="font-semibold text-amber-950 hover:underline">안전거래 안내 전체 보기</Link><Link href={`/listings/${listing.id}/report`} className="font-semibold text-red-700 hover:underline">이 매물 신고</Link></div>
      </section>
    </div>
  );
}
