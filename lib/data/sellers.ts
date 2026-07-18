import type { SellerProfile } from "@/lib/types/listing";

export const sellers: SellerProfile[] = [
  { id: "seller-gb-farm", displayName: "경북 한우농가", memberType: "개인", region: "경북", joinedAt: "2026-05-12", identityVerified: true, businessVerified: false, completedSales: 3, lastActiveAt: "2026-07-17", introduction: "조사료 작업에 사용한 장비를 직접 관리하며 판매합니다." },
  { id: "seller-cn-company", displayName: "충남 사료장비", memberType: "업체", region: "충남", joinedAt: "2026-04-03", identityVerified: true, businessVerified: true, completedSales: 8, lastActiveAt: "2026-07-17", introduction: "사료 배합·이송 장비와 부품을 취급합니다." },
  { id: "seller-jb-farm", displayName: "전북 낙농가", memberType: "개인", region: "전북", joinedAt: "2026-06-01", identityVerified: true, businessVerified: false, completedSales: 1, lastActiveAt: "2026-07-16", introduction: "농장에서 사용하던 장비의 상태와 정비 이력을 직접 안내합니다." },
  { id: "seller-gg-equipment", displayName: "경기 축산장비", memberType: "영농법인", region: "경기", joinedAt: "2026-03-18", identityVerified: true, businessVerified: true, completedSales: 12, lastActiveAt: "2026-07-17", introduction: "축산 작업기기와 중고 장비를 점검 후 등록합니다." },
  { id: "seller-jeju-shop", displayName: "제주 축산설비", memberType: "업체", region: "제주", joinedAt: "2026-02-22", identityVerified: true, businessVerified: true, completedSales: 6, lastActiveAt: "2026-07-16", introduction: "신품 장비와 설치 가능한 축사 설비를 안내합니다." },
  { id: "buyer-gb-farm", displayName: "경북 조사료농가", memberType: "개인", region: "경북", joinedAt: "2026-07-04", identityVerified: true, businessVerified: false, completedSales: 0, lastActiveAt: "2026-07-17", introduction: "현장에서 사용할 중고 조사료 장비를 찾고 있습니다." },
  { id: "buyer-jn-company", displayName: "전남 한우영농법인", memberType: "영농법인", region: "전남", joinedAt: "2026-06-24", identityVerified: true, businessVerified: true, completedSales: 2, lastActiveAt: "2026-07-18", introduction: "사료 생산과 급이에 필요한 중고 장비를 직접 확인해 구매합니다." },
  { id: "buyer-gn-farm", displayName: "경남 낙농가", memberType: "개인", region: "경남", joinedAt: "2026-07-08", identityVerified: true, businessVerified: false, completedSales: 1, lastActiveAt: "2026-07-18", introduction: "목장 설비와 사료 장비 부품을 찾고 있습니다." },
  { id: "buyer-jj-farm", displayName: "제주 축산농가", memberType: "개인", region: "제주", joinedAt: "2026-07-10", identityVerified: true, businessVerified: false, completedSales: 0, lastActiveAt: "2026-07-17", introduction: "제주에서 사용할 장비를 찾으며 운송 가능 여부를 우선 확인합니다." },
];

export function getSellerById(id: string) {
  return sellers.find((seller) => seller.id === id);
}
