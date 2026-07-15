export const LISTING_CATEGORIES = [
  "사각압축포장기",
  "사료배합기",
  "컨베이어",
  "베일집게",
  "절단기",
  "사료공급기",
  "기타 축산기계",
] as const;

export type ListingCategory = (typeof LISTING_CATEGORIES)[number];

export const LISTING_REGIONS = [
  "전국",
  "경기",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
] as const;

export type ListingRegion = (typeof LISTING_REGIONS)[number];

export type SaleStatus = "판매중" | "예약중" | "판매완료";

export type ListingCondition = "신품" | "중고";

export interface Listing {
  id: string;
  title: string;
  category: ListingCategory;
  region: ListingRegion;
  year: number;
  price: number | null;
  priceNegotiable: boolean;
  status: SaleStatus;
  condition: ListingCondition;
  manufacturer: string;
  description: string;
  createdAt: string;
}

export interface ListingFilters {
  q?: string;
  category?: string;
  region?: string;
}
