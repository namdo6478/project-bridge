import type {
  CreateListingInput,
  EntityId,
  Favorite,
  InquiryMessage,
  InquiryStatus,
  InquiryThread,
  ListingPhoto,
  ListingReport,
  MarketplaceUser,
  PersistedListing,
  ReportStatus,
  SellerProfile,
  UpdateListingInput,
} from "@/lib/types/marketplace";
import type { ListingFilters, SaleStatus } from "@/lib/types/listing";

export interface PageRequest {
  cursor?: string;
  limit?: number;
}

export interface PageResult<T> {
  items: T[];
  nextCursor: string | null;
}

export interface MarketplaceRepository {
  users: {
    findById(id: EntityId): Promise<MarketplaceUser | null>;
  };
  profiles: {
    findByUserId(userId: EntityId): Promise<SellerProfile | null>;
    save(profile: SellerProfile): Promise<SellerProfile>;
  };
  listings: {
    list(filters: ListingFilters, page?: PageRequest): Promise<PageResult<PersistedListing>>;
    findById(id: EntityId): Promise<PersistedListing | null>;
    create(input: CreateListingInput): Promise<PersistedListing>;
    update(id: EntityId, actorId: EntityId, input: UpdateListingInput): Promise<PersistedListing>;
    changeStatus(id: EntityId, actorId: EntityId, status: SaleStatus): Promise<PersistedListing>;
    softDelete(id: EntityId, actorId: EntityId): Promise<void>;
  };
  photos: {
    listForListing(listingId: EntityId): Promise<ListingPhoto[]>;
    replaceForListing(listingId: EntityId, actorId: EntityId, photos: ListingPhoto[]): Promise<ListingPhoto[]>;
  };
  favorites: {
    listForUser(userId: EntityId): Promise<Favorite[]>;
    add(userId: EntityId, listingId: EntityId): Promise<Favorite>;
    remove(userId: EntityId, listingId: EntityId): Promise<void>;
  };
  inquiries: {
    listForUser(userId: EntityId, page?: PageRequest): Promise<PageResult<InquiryThread>>;
    create(thread: InquiryThread, firstMessage: InquiryMessage): Promise<InquiryThread>;
    reply(message: InquiryMessage): Promise<InquiryMessage>;
    changeStatus(threadId: EntityId, actorId: EntityId, status: InquiryStatus): Promise<InquiryThread>;
  };
  reports: {
    create(report: ListingReport): Promise<ListingReport>;
    listForAdmin(status?: ReportStatus, page?: PageRequest): Promise<PageResult<ListingReport>>;
    changeStatus(reportId: EntityId, adminId: EntityId, status: ReportStatus): Promise<ListingReport>;
  };
}
