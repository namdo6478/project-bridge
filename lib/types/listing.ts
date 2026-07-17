export const LISTING_CATEGORIES = [
  "조사료 장비",
  "사료 장비",
  "축사시설·설비",
  "축산 작업기기",
  "부품·소모품",
  "신품관",
  "삽니다",
] as const;

export type ListingCategory = (typeof LISTING_CATEGORIES)[number];

export const LISTING_SUBCATEGORIES = {
  "조사료 장비": [
    "사각압축포장기",
    "원형베일러",
    "랩핑기",
    "절단기",
    "예취기",
    "반전기",
    "집초기",
    "베일집게",
  ],
  "사료 장비": [
    "TMR 배합기",
    "사료공급기",
    "컨베이어",
    "파쇄기",
    "분쇄기",
    "사료빈",
    "기타",
  ],
  "축사시설·설비": [
    "축사청소기",
    "분뇨처리기",
    "퇴비장비",
    "환풍기",
    "안개분무기",
    "급수기",
    "자동급이설비",
    "사일로",
    "저장시설",
    "기타",
  ],
  "축산 작업기기": ["집게", "버킷", "브러시", "포크", "기타 작업기기"],
  "부품·소모품": ["구동부품", "유압부품", "전기부품", "소모품", "기타"],
  신품관: ["신품 장비", "전시·재고 장비", "신품 부품"],
  삽니다: ["구매 희망 장비", "부품 구함", "교환 희망"],
} as const satisfies Record<ListingCategory, readonly string[]>;

export type ListingSubcategory =
  (typeof LISTING_SUBCATEGORIES)[ListingCategory][number];

export const LISTING_CATEGORY_DETAILS: Record<
  ListingCategory,
  { shortLabel: string; description: string }
> = {
  "조사료 장비": {
    shortLabel: "조사료",
    description: "베일러·랩핑기·예취기",
  },
  "사료 장비": {
    shortLabel: "사료",
    description: "배합기·공급기·컨베이어",
  },
  "축사시설·설비": {
    shortLabel: "시설",
    description: "분뇨·환기·급이 설비",
  },
  "축산 작업기기": {
    shortLabel: "작업",
    description: "집게·버킷·브러시",
  },
  "부품·소모품": {
    shortLabel: "부품",
    description: "유압·구동·전기 부품",
  },
  신품관: {
    shortLabel: "신품",
    description: "새 장비와 재고 상품",
  },
  삽니다: {
    shortLabel: "구매",
    description: "구매·교환 희망 글",
  },
};

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

export type SaleStatus = "판매중" | "예약중" | "판매완료" | "구매요청";

export type ListingCondition = "신품" | "중고";

export interface Listing {
  id: string;
  title: string;
  category: ListingCategory;
  subcategory: ListingSubcategory;
  region: ListingRegion;
  year: number;
  price: number | null;
  priceNegotiable: boolean;
  status: SaleStatus;
  condition: ListingCondition;
  manufacturer: string;
  model?: string;
  usageHours?: number;
  tradeOptions?: string[];
  description: string;
  createdAt: string;
}

export interface ListingFilters {
  q?: string;
  category?: string;
  subcategory?: string;
  region?: string;
  condition?: string;
  status?: string;
  priceMode?: string;
  tradeOption?: string;
}
