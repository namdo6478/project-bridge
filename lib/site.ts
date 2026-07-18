const fallbackSiteUrl = "https://chuksan-market-preview.k861113.chatgpt.site";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || fallbackSiteUrl).replace(/\/$/, "");
