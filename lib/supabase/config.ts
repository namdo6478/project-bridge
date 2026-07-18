const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function isSupabaseConfigured() {
  return Boolean(
    url &&
      publishableKey &&
      !url.includes("your-project") &&
      !publishableKey.includes("your-publishable-key"),
  );
}

export function getSupabaseConfig() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Supabase 환경변수가 설정되지 않았습니다. .env.example을 참고해 .env.local을 구성하세요.",
    );
  }

  return { url: url as string, publishableKey: publishableKey as string };
}
