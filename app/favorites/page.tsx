import type { Metadata } from "next";
import { FavoritesManager } from "@/components/listings/FavoritesManager";
import { RecentlyViewedListings } from "@/components/listings/RecentlyViewedListings";

export const metadata: Metadata = {
  title: "관심 매물",
  description: "다시 보고 싶은 축산기계 매물을 모아 비교하세요.",
};

export default function FavoritesPage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold text-brand">FAVORITES</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">관심 매물</h1>
        <p className="mt-2 text-sm text-text-secondary">나중에 다시 보거나 가격·지역을 비교할 매물을 모아둡니다.</p>

        <FavoritesManager />
        <RecentlyViewedListings />
      </div>
    </div>
  );
}
