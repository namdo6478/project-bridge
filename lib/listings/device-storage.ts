const FAVORITES_KEY = "chuksan-market:favorite-listings:v1";
const RECENT_KEY = "chuksan-market:recent-listings:v1";
const STORAGE_EVENT = "chuksan-market:listing-storage";

function readIds(key: string): string[] {
  if (typeof window === "undefined") return [];

  try {
    const value = JSON.parse(window.localStorage.getItem(key) ?? "[]") as unknown;
    if (!Array.isArray(value)) return [];
    return value.filter((item): item is string => typeof item === "string");
  } catch {
    window.localStorage.removeItem(key);
    return [];
  }
}

function writeIds(key: string, ids: string[]) {
  window.localStorage.setItem(key, JSON.stringify([...new Set(ids)]));
  window.dispatchEvent(new CustomEvent(STORAGE_EVENT));
}

export function getFavoriteListingIds() {
  return readIds(FAVORITES_KEY);
}

export function initializeFavoriteListingIds(defaultIds: string[]) {
  if (window.localStorage.getItem(FAVORITES_KEY) === null) {
    writeIds(FAVORITES_KEY, defaultIds);
  }
  return getFavoriteListingIds();
}

export function setFavoriteListingIds(ids: string[]) {
  writeIds(FAVORITES_KEY, ids);
}

export function toggleFavoriteListing(listingId: string) {
  const current = getFavoriteListingIds();
  const saved = current.includes(listingId);
  const next = saved ? current.filter((id) => id !== listingId) : [listingId, ...current];
  setFavoriteListingIds(next);
  return !saved;
}

export function getRecentListingIds() {
  return readIds(RECENT_KEY);
}

export function recordRecentlyViewedListing(listingId: string) {
  const next = [listingId, ...getRecentListingIds().filter((id) => id !== listingId)].slice(0, 8);
  writeIds(RECENT_KEY, next);
}

export function clearRecentlyViewedListings() {
  writeIds(RECENT_KEY, []);
}

export function subscribeToListingStorage(callback: () => void) {
  const listener = () => callback();
  window.addEventListener(STORAGE_EVENT, listener);
  window.addEventListener("storage", listener);

  return () => {
    window.removeEventListener(STORAGE_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
