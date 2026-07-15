import type { Metadata } from "next";
import { login, signup } from "@/app/login/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "로그인",
  description: "축산기계장터 계정에 로그인하거나 새 계정을 만드세요.",
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[]; message?: string | string[] }>;
}) {
  const params = await searchParams;
  const error = firstValue(params.error);
  const message = firstValue(params.message);
  const configured = isSupabaseConfigured();
  const inputClass = "mt-2 w-full rounded-lg border border-border px-4 py-3 outline-none focus:border-brand focus:ring-2 focus:ring-brand/10";

  return (
    <div className="bg-surface-muted px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-brand">ACCOUNT</p>
        <h1 className="mt-2 text-2xl font-bold">로그인·회원가입</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          매물을 등록하고 내 매물을 관리하려면 계정이 필요합니다.
        </p>

        {!configured && (
          <p className="mt-5 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            화면과 인증 코드는 준비되었습니다. Supabase 프로젝트 키를 연결한 뒤 실제 로그인이 활성화됩니다.
          </p>
        )}
        {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p className="mt-5 rounded-lg bg-brand/5 p-3 text-sm text-brand">{message}</p>}

        <form className="mt-6 space-y-5">
          <label className="block text-sm font-semibold">
            이메일
            <input name="email" type="email" required autoComplete="email" className={inputClass} placeholder="name@example.com" />
          </label>
          <label className="block text-sm font-semibold">
            비밀번호
            <input name="password" type="password" required minLength={8} autoComplete="current-password" className={inputClass} placeholder="8자 이상" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button formAction={login} disabled={!configured} className="rounded-lg bg-brand px-4 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">
              로그인
            </button>
            <button formAction={signup} disabled={!configured} className="rounded-lg border border-brand/25 px-4 py-3 font-bold text-brand disabled:cursor-not-allowed disabled:opacity-50">
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
