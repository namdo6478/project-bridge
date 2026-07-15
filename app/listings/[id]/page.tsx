import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { listings } from "@/lib/data/listings";
import { getListingById } from "@/lib/data/listing-repository";
import { formatDate, formatPrice } from "@/lib/utils/format";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { CategoryBadge, StatusBadge } from "@/components/ui/Badge";

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
  const listing = await getListingById(id);

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
  const listing = await getListingById(id);

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
        <PlaceholderImage
          category={listing.subcategory}
          className="aspect-[4/3] w-full rounded-lg border border-border"
          priority
        />

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
            {listing.model && (
              <div>
                <dt className="text-sm text-text-muted">모델명</dt>
                <dd className="mt-0.5 font-semibold text-text-primary">{listing.model}</dd>
              </div>
            )}
            {typeof listing.usageHours === "number" && (
              <div>
                <dt className="text-sm text-text-muted">사용 시간</dt>
                <dd className="mt-0.5 font-semibold text-text-primary">
                  {listing.usageHours.toLocaleString("ko-KR")}시간
                </dd>
              </div>
            )}
            <div>
              <dt className="text-sm text-text-muted">등록일</dt>
              <dd className="mt-0.5 font-semibold text-text-primary">
                {formatDate(listing.createdAt)}
              </dd>
            </div>
          </dl>

          {(listing.status === "판매중" || listing.status === "구매요청") && (
            <button
              type="button"
              disabled
              className="mt-6 w-full cursor-not-allowed rounded-md bg-accent/60 px-6 py-3 text-sm font-semibold text-white"
              title="문의 기능은 추후 제공 예정입니다"
            >
              {listing.status === "구매요청"
                ? "구매 희망자에게 제안 (준비 중)"
                : "판매자에게 문의 (준비 중)"}
            </button>
          )}
        </div>
      </div>

      <section className="mt-10 rounded-lg border border-border bg-white p-6 sm:p-8">
        <h2 className="text-lg font-bold text-text-primary">상세 설명</h2>
        <p className="mt-4 whitespace-pre-line leading-relaxed text-text-secondary">
          {listing.description}
        </p>
      </section>
    </div>
  );
}
