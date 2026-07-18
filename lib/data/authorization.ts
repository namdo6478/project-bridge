import type { MarketplaceUser, PersistedListing } from "@/lib/types/marketplace";

function isActive(user: MarketplaceUser) {
  return user.status === "active";
}

export function canCreateListing(user: MarketplaceUser) {
  return isActive(user) && user.phoneVerifiedAt !== null;
}

export function canManageListing(user: MarketplaceUser, listing: PersistedListing) {
  return isActive(user) && (user.id === listing.sellerId || user.role === "admin");
}

export function canReviewReports(user: MarketplaceUser) {
  return isActive(user) && user.role === "admin";
}

export function canStartInquiry(user: MarketplaceUser, listing: PersistedListing) {
  return (
    isActive(user) &&
    user.phoneVerifiedAt !== null &&
    user.id !== listing.sellerId &&
    listing.deletedAt === null &&
    listing.moderationStatus === "approved" &&
    (listing.status === "판매중" || listing.status === "구매요청")
  );
}
