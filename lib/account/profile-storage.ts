export const SELLER_PROFILE_STORAGE_KEY = "chuksan-market:seller-profile:v1";

export interface StoredSellerProfile {
  displayName: string;
  sellerType: "개인" | "판매점";
  phone: string;
  region: string;
  contactVisibility: "문의 후 공개" | "인증회원 공개" | "비공개";
  introduction: string;
  savedAt: string;
}

export function loadStoredSellerProfile() {
  try {
    const stored = window.localStorage.getItem(SELLER_PROFILE_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as StoredSellerProfile) : null;
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
