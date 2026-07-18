"use client";

import { useEffect, useState } from "react";
import { ListingCard } from "@/components/listings/ListingCard";
import { listings } from "@/lib/data/listings";
import type { Listing } from "@/lib/types/listing";
import {
  clearRecentlyViewedListings,
  getRecentListingIds,
  subscribeToListingStorage,
} from "@/lib/listings/device-storage";

export function RecentlyViewedListings() {
  const [items, setItems] = useState<Listing[]>([]);

  useEffect(() => {
    const sync = () => {
      const recentItems = getRecentListingIds()
        .map((id) => listings.find((listing) => listing.id === id))
        .filter((listing): listing is Listing => Boolean(listing));
      window.setTimeout(() => setItems(recentItems), 0);
    };
    sync();
    return subscribeToListingStorage(sync);
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="mt-10 border-t border-border pt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand">RECENTLY VIEWED</p>
          <h2 className="mt-1 text-xl font-bold text-text-primary">최근 본 매물</h2>
          <p className="mt-1 text-sm text-text-secondary">이 기기에서 최근 확인한 장비를 다시 볼 수 있습니다.</p>
        </div>
        <button
          type="button"
          onClick={clearRecentlyViewedListings}
          className="shrink-0 rounded-lg border border-border bg-white px-3 py-2 text-xs font-bold text-text-secondary"
        >
          기록 지우기
        </button>
      </div>
      <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.slice(0, 4).map((item) => <ListingCard key={item.id} listing={item} />)}
      </div>
    </section>
  );
}
