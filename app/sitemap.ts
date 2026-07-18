import type { MetadataRoute } from "next";
import { listings } from "@/lib/data/listings";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const publicRoutes = ["", "/listings", "/sell", "/guide", "/safety", "/policy"];
  const latestListingDate = listings.reduce((latest, listing) => listing.createdAt > latest ? listing.createdAt : latest, "2026-01-01");

  return [
    ...publicRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(latestListingDate),
      changeFrequency: path === "" || path === "/listings" ? "daily" as const : "weekly" as const,
      priority: path === "" ? 1 : path === "/listings" ? 0.9 : 0.7,
    })),
    ...listings.map((listing) => ({
      url: `${SITE_URL}/listings/${listing.id}`,
      lastModified: new Date(listing.createdAt),
      changeFrequency: "weekly" as const,
      priority: listing.status === "판매중" || listing.status === "구매요청" ? 0.8 : 0.5,
    })),
  ];
}
