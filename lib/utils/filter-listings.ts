import type { Listing, ListingFilters } from "@/lib/types/listing";

export function filterListings(
  items: Listing[],
  filters: ListingFilters,
): Listing[] {
  const query = filters.q?.trim().toLowerCase() ?? "";
  const category = filters.category?.trim() ?? "";
  const region = filters.region?.trim() ?? "";

  return items.filter((listing) => {
    const matchesQuery =
      query === "" ||
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.manufacturer.toLowerCase().includes(query);

    const matchesCategory =
      category === "" || listing.category === category;

    const matchesRegion =
      region === "" || region === "전국" || listing.region === region;

    return matchesQuery && matchesCategory && matchesRegion;
  });
}

export function buildListingsQuery(filters: ListingFilters): string {
  const params = new URLSearchParams();

  if (filters.q?.trim()) {
    params.set("q", filters.q.trim());
  }
  if (filters.category?.trim()) {
    params.set("category", filters.category.trim());
  }
  if (filters.region?.trim() && filters.region !== "전국") {
    params.set("region", filters.region.trim());
  }

  const query = params.toString();
  return query ? `/listings?${query}` : "/listings";
}
