"use client";

import { useEffect } from "react";
import { recordRecentlyViewedListing } from "@/lib/listings/device-storage";

export function ListingActivityTracker({ listingId }: { listingId: string }) {
  useEffect(() => {
    recordRecentlyViewedListing(listingId);
  }, [listingId]);

  return null;
}
