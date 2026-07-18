import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getListingById, listings } from "@/lib/data/listings";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { CategoryBadge, StatusBadge } from "@/components/ui/Badge";
import { FavoriteButton } from "@/components/listings/FavoriteButton";
import { ListingGallery } from "@/components/listings/ListingGallery";
import { ListingActivityTracker } from "@/components/listings/ListingActivityTracker";
import { DirectContactCard } from "@/components/listings/DirectContactCard";
import { ShareListingButton } from "@/components/listings/ShareListingButton";
import { TradeChecklist } from "@/components/listings/TradeChecklist";
import { getListingFreshness } from "@/lib/listings/freshness";
import { getSellerById } from "@/lib/data/sellers";
import { SellerProfileCard } from "@/components/listings/SellerProfileCard";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { buildListingsQuery } from "@/lib/utils/filter-listings";

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

  const freshness = getListingFreshness(listing.confirmedAt);
  const seller = getSellerById(listing.sellerId);
  const isWanted = listing.status === "구매요청";
  const relatedListings = listings.filter((item) => item.id !== listing.id && item.category === listing.category && item.status !== "판매완료").slice(0, 3);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ListingActivityTracker listingId={listing.id} />
      <Link
        href={isWanted ? "/wanted" : "/listings"}
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
        {isWanted ? "구매 요청 목록으로" : "매물 목록으로"}
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

          <FavoriteButton listingId={listing.id} />
          <ShareListingButton title={listing.title} />

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
              <dt className="text-sm text-text-muted">모델</dt>
              <dd className="mt-0.5 font-semibold text-text-primary">{listing.model ?? "판매자 확인"}</dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">사용시간</dt>
              <dd className="mt-0.5 font-semibold text-text-primary">{listing.usageHours ? `${listing.usageHours.toLocaleString("ko-KR")}시간` : "판매자 확인"}</dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">등록일</dt>
              <dd className="mt-0.5 font-semibold text-text-primary">
                {formatDate(listing.createdAt)}
              </dd>
            </div>
            <div className="col-span-2 rounded-lg bg-white p-3">
              <dt className="text-sm text-text-muted">판매 여부 최근 확인</dt>
              <dd className={`mt-1 font-semibold ${freshness.state === "check" || freshness.state === "hidden" ? "text-amber-700" : "text-brand"}`}>{formatDate(listing.confirmedAt)} · {freshness.label}</dd>
              <p className="mt-1 text-xs leading-relaxed text-text-muted">{freshness.detail} 연락 전에 현재 판매 상태를 한 번 더 확인하세요.</p>
            </div>
          </dl>

          {seller && <SellerProfileCard seller={seller} role={isWanted ? "buyer" : "seller"} />}

          <DirectContactCard
            listingId={listing.id}
            region={listing.region}
            sellerLabel={isWanted ? "장비 구매 희망자" : listing.condition === "신품" ? "장비 판매점" : "개인 판매자"}
            status={listing.status}
          />
        </div>
      </div>

      <section className="mt-10 rounded-lg border border-border bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-text-primary">상세 설명</h2>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-text-secondary">
          {listing.description}
        </p>
        {listing.tradeOptions && listing.tradeOptions.length > 0 && (
          <div className="mt-6 border-t border-border pt-5"><h3 className="text-sm font-bold text-text-primary">판매자가 표시한 거래 조건</h3><div className="mt-3 flex flex-wrap gap-2">{listing.tradeOptions.map((option) => <span key={option} className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">{option}</span>)}</div><p className="mt-3 text-xs leading-relaxed text-text-muted">표시 내용은 판매자가 입력한 정보입니다. 실제 가능 여부와 비용은 직접 연락해 다시 확인하세요.</p></div>
        )}
      </section>

      <TradeChecklist listingId={listing.id} />

      {relatedListings.length > 0 && (
        <section className="mt-10"><div className="mb-5 flex items-end justify-between gap-4"><div><p className="text-xs font-bold text-brand">SIMILAR LISTINGS</p><h2 className="mt-1 text-2xl font-bold text-text-primary">같은 종류의 다른 매물</h2></div><Link href={buildListingsQuery({ category: listing.category })} className="shrink-0 text-sm font-bold text-brand hover:underline">더 보기</Link></div><ListingGrid listings={relatedListings} /></section>
      )}

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
