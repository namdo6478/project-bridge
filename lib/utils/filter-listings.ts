import type { Listing, ListingFilters } from "@/lib/types/listing";

export function filterListings(
  items: Listing[],
  filters: ListingFilters,
): Listing[] {
  const query = filters.q?.trim().toLowerCase() ?? "";
  const category = filters.category?.trim() ?? "";
  const subcategory = filters.subcategory?.trim() ?? "";
  const region = filters.region?.trim() ?? "";
  const condition = filters.condition?.trim() ?? "";

  return items.filter((listing) => {
    const matchesQuery =
      query === "" ||
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query) ||
      listing.manufacturer.toLowerCase().includes(query) ||
      listing.subcategory.toLowerCase().includes(query);

    const matchesCategory =
      category === "" || listing.category === category;

    const matchesSubcategory =
      subcategory === "" || listing.subcategory === subcategory;

    const matchesRegion =
      region === "" || region === "전국" || listing.region === region;

    const matchesCondition =
      condition === "" || listing.condition === condition;

    return (
      matchesQuery &&
      matchesCategory &&
      matchesSubcategory &&
      matchesRegion &&
      matchesCondition
    );
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
  if (filters.subcategory?.trim()) {
    params.set("subcategory", filters.subcategory.trim());
  }
  if (filters.region?.trim() && filters.region !== "전국") {
    params.set("region", filters.region.trim());
  }
  if (filters.condition?.trim()) {
    params.set("condition", filters.condition.trim());
  }

  const query = params.toString();
  return query ? `/listings?${query}` : "/listings";
}
