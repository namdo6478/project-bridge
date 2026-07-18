import type { Listing, SaleStatus } from "@/lib/types/listing";

export type EntityId = string;
export type ISODateTime = string;

export type UserRole = "member" | "dealer" | "admin";
export type AccountStatus = "active" | "suspended" | "withdrawn";
export type ModerationStatus = "draft" | "pending" | "approved" | "rejected";
export type ContactVisibility = "after_inquiry" | "verified_members" | "private";

export interface MarketplaceUser {
  id: EntityId;
  email: string | null;
  phoneNumber: string | null;
  phoneVerifiedAt: ISODateTime | null;
  role: UserRole;
  status: AccountStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface SellerProfile {
  userId: EntityId;
  displayName: string;
  businessName: string | null;
  region: string;
  introduction: string;
  contactVisibility: ContactVisibility;
  completedTrades: number;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface PersistedListing extends Listing {
  sellerId: EntityId;
  district: string | null;
  moderationStatus: ModerationStatus;
  publishedAt: ISODateTime | null;
  updatedAt: ISODateTime;
  deletedAt: ISODateTime | null;
}

export interface ListingPhoto {
  id: EntityId;
  listingId: EntityId;
  storageKey: string;
  originalName: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  width: number;
  height: number;
  byteSize: number;
  position: number;
  isPrimary: boolean;
  createdAt: ISODateTime;
}

export interface Favorite {
  userId: EntityId;
  listingId: EntityId;
  createdAt: ISODateTime;
}

export type InquiryStatus = "open" | "answered" | "closed" | "blocked";

export interface InquiryThread {
  id: EntityId;
  listingId: EntityId;
  buyerId: EntityId;
  sellerId: EntityId;
  status: InquiryStatus;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface InquiryMessage {
  id: EntityId;
  threadId: EntityId;
  senderId: EntityId;
  body: string;
  readAt: ISODateTime | null;
  createdAt: ISODateTime;
}

export type ReportReason =
  | "suspected_fraud"
  | "false_information"
  | "prohibited_item"
  | "abusive_content"
  | "other";
export type ReportStatus = "received" | "reviewing" | "resolved" | "dismissed";

export interface ListingReport {
  id: EntityId;
  listingId: EntityId;
  reporterId: EntityId;
  reason: ReportReason;
  description: string;
  status: ReportStatus;
  reviewedBy: EntityId | null;
  reviewedAt: ISODateTime | null;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
}

export interface ListingStatusHistory {
  id: EntityId;
  listingId: EntityId;
  previousStatus: SaleStatus | null;
  nextStatus: SaleStatus;
  changedBy: EntityId;
  createdAt: ISODateTime;
}

export interface AuditLog {
  id: EntityId;
  actorId: EntityId | null;
  action: string;
  entityType: string;
  entityId: EntityId;
  metadata: Record<string, string | number | boolean | null>;
  createdAt: ISODateTime;
}

export type CreateListingInput = Omit<
  PersistedListing,
  "id" | "createdAt" | "updatedAt" | "publishedAt" | "deletedAt" | "moderationStatus"
>;

export type UpdateListingInput = Partial<
  Omit<
    PersistedListing,
    "id" | "sellerId" | "createdAt" | "updatedAt" | "publishedAt" | "deletedAt"
  >
>;
