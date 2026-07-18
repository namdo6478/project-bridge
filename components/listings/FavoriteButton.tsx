"use client";

import { useEffect, useState } from "react";
import {
  getFavoriteListingIds,
  subscribeToListingStorage,
  toggleFavoriteListing,
} from "@/lib/listings/device-storage";

interface FavoriteButtonProps {
  listingId: string;
}

export function FavoriteButton({ listingId }: FavoriteButtonProps) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const sync = () => window.setTimeout(() => setSaved(getFavoriteListingIds().includes(listingId)), 0);
    sync();
    return subscribeToListingStorage(sync);
  }, [listingId]);

  const toggleFavorite = () => {
    setSaved(toggleFavoriteListing(listingId));
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        aria-pressed={saved}
        onClick={toggleFavorite}
        className={`w-full rounded-md border px-4 py-2.5 text-sm font-bold transition ${saved ? "border-brand bg-brand text-white" : "border-brand/25 bg-white text-brand hover:bg-brand/5"}`}
      >
        {saved ? "관심 매물에 저장됨" : "관심 매물로 저장"}
      </button>
      <p role="status" className="mt-1.5 text-center text-xs text-text-muted">{saved ? "이 기기의 관심 매물에 저장했습니다. 새로고침 후에도 유지됩니다." : "저장한 매물은 관심 매물 화면에서 다시 비교할 수 있습니다."}</p>
    </div>
  );
}
