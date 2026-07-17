export const SELLER_PROFILE_STORAGE_KEY = "chuksan-market:seller-profile:v1";

export interface StoredSellerProfile {
  displayName: string;
  sellerType: "개인" | "판매점";
  phone: string;
  region: string;
  contactVisibility: "인증회원 공개" | "전체 공개" | "비공개";
  preferredContact: "전화·문자 모두" | "전화 우선" | "문자 우선";
  contactHours: string;
  introduction: string;
  savedAt: string;
}

export function loadStoredSellerProfile() {
  try {
    const stored = window.localStorage.getItem(SELLER_PROFILE_STORAGE_KEY);
    if (!stored) return null;
    const profile = JSON.parse(stored) as Partial<StoredSellerProfile> & { contactVisibility?: string };
    return {
      displayName: profile.displayName ?? "",
      sellerType: profile.sellerType === "판매점" ? "판매점" : "개인",
      phone: profile.phone ?? "",
      region: profile.region ?? "",
      contactVisibility: profile.contactVisibility === "전체 공개" || profile.contactVisibility === "비공개" ? profile.contactVisibility : "인증회원 공개",
      preferredContact: profile.preferredContact ?? "전화·문자 모두",
      contactHours: profile.contactHours ?? "평일 09:00~18:00",
      introduction: profile.introduction ?? "",
      savedAt: profile.savedAt ?? new Date().toISOString(),
    } satisfies StoredSellerProfile;
  } catch {
    window.localStorage.removeItem(SELLER_PROFILE_STORAGE_KEY);
    return null;
  }
}

export function saveStoredSellerProfile(profile: StoredSellerProfile) {
  window.localStorage.setItem(SELLER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
}

export function removeStoredSellerProfile() {
  window.localStorage.removeItem(SELLER_PROFILE_STORAGE_KEY);
}
