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
  const status = filters.status?.trim() ?? "";
  const priceMode = filters.priceMode?.trim() ?? "";
  const tradeOption = filters.tradeOption?.trim() ?? "";

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

    const matchesStatus =
      status === "" ||
      (status === "available" && (listing.status === "판매중" || listing.status === "구매요청")) ||
      listing.status === status;

    const matchesPriceMode =
      priceMode === "" ||
      (priceMode === "negotiable" && listing.priceNegotiable) ||
      (priceMode === "fixed" && !listing.priceNegotiable && listing.price !== null);

    const matchesTradeOption =
      tradeOption === "" || listing.tradeOptions?.includes(tradeOption);

    return (
      matchesQuery &&
      matchesCategory &&
      matchesSubcategory &&
      matchesRegion &&
      matchesCondition &&
      matchesStatus &&
      matchesPriceMode &&
      matchesTradeOption
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
  if (filters.status?.trim()) {
    params.set("status", filters.status.trim());
  }
  if (filters.priceMode?.trim()) {
    params.set("priceMode", filters.priceMode.trim());
  }
  if (filters.tradeOption?.trim()) {
    params.set("tradeOption", filters.tradeOption.trim());
  }

  const query = params.toString();
  return query ? `/listings?${query}` : "/listings";
}
