import Link from "next/link";
import type { Listing } from "@/lib/types/listing";
import { formatPrice } from "@/lib/utils/format";
import { PlaceholderImage } from "@/components/ui/PlaceholderImage";
import { CategoryBadge, StatusBadge } from "@/components/ui/Badge";

interface ListingCardProps {
  listing: Listing;
  priority?: boolean;
}

export function ListingCard({ listing, priority = false }: ListingCardProps) {
  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-white hover:border-brand/30 hover:shadow-sm"
    >
      <PlaceholderImage
        category={listing.category}
        className="aspect-[4/3] w-full"
        priority={priority}
      />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <CategoryBadge category={listing.category} />
          <StatusBadge status={listing.status} />
        </div>
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-text-primary group-hover:text-brand">
          {listing.title}
        </h3>
        <dl className="mt-auto grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
          <div>
            <dt className="text-text-muted">지역</dt>
            <dd className="font-medium text-text-secondary">{listing.region}</dd>
          </div>
          <div>
            <dt className="text-text-muted">연식</dt>
            <dd className="font-medium text-text-secondary">{listing.year}년</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-text-muted">가격</dt>
            <dd className="text-lg font-bold text-brand">
              {formatPrice(listing.price, listing.priceNegotiable)}
            </dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}
