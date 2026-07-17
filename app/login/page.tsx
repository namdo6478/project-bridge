import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "로그인",
  description: "축산기계장터 로그인과 회원가입 화면을 확인하세요.",
};

interface LoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const configured = isSupabaseConfigured();
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") && !next.startsWith("//") ? next : "/account";

  return (
    <div className="bg-surface-muted px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-semibold text-brand">ACCOUNT</p>
        <h1 className="mt-2 text-2xl font-bold text-text-primary">로그인·회원가입</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">
          매물 등록과 판매자 연락처 확인을 위한 휴대폰 인증 화면입니다.
        </p>

        <div className={`mt-5 rounded-lg border p-3 text-sm leading-relaxed ${configured ? "border-brand/20 bg-brand/5 text-brand" : "border-amber-200 bg-amber-50 text-amber-900"}`}>
          <strong>{configured ? "휴대폰 인증 연결됨" : "로그인 화면 미리보기"}</strong>
          <p className="mt-1">{configured ? "문자로 받은 인증번호를 확인하면 실제 로그인 세션이 만들어집니다." : "공개 데모 인증번호 123456으로 전체 흐름을 확인할 수 있으며 입력 정보는 전송되지 않습니다."}</p>
        </div>
        <LoginForm configured={configured} nextPath={nextPath} />
      </div>
    </div>
  );
}
