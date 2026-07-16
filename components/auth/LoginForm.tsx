"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatKoreanPhone, isSupportedPhone, normalizeKoreanPhone } from "@/lib/auth/phone";

type AuthMode = "login" | "signup";
type AuthStep = "phone" | "otp" | "success";

const inputClass = "mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/10";

interface LoginFormProps {
  configured: boolean;
}

export function LoginForm({ configured }: LoginFormProps) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [step, setStep] = useState<AuthStep>("phone");
  const [displayName, setDisplayName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [sentPhone, setSentPhone] = useState("");
  const [token, setToken] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [secondsLeft]);

  const resetFeedback = () => {
    setError("");
    setNotice("");
  };

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setStep("phone");
    setToken("");
    setSecondsLeft(0);
    resetFeedback();
  };

  const requestOtp = async () => {
    resetFeedback();

    if (!isSupportedPhone(phoneInput)) {
      setError("휴대폰 번호를 010-1234-5678 형식으로 확인해 주세요.");
      return;
    }
    if (mode === "signup" && displayName.trim().length < 2) {
      setError("가입할 이름 또는 상호를 2자 이상 입력해 주세요.");
      return;
    }

    const normalizedPhone = normalizeKoreanPhone(phoneInput);
    setLoading(true);

    if (!configured) {
      setSentPhone(normalizedPhone);
      setStep("otp");
      setSecondsLeft(60);
      setNotice("공개 데모 인증번호는 123456입니다.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      phone: normalizedPhone,
      options: {
        shouldCreateUser: mode === "signup",
        data: mode === "signup" ? { display_name: displayName.trim() } : undefined,
      },
    });

    setLoading(false);
    if (authError) {
      setError("인증번호를 보내지 못했습니다. 번호와 가입 상태를 확인한 뒤 다시 시도해 주세요.");
      return;
    }

    setSentPhone(normalizedPhone);
    setStep("otp");
    setSecondsLeft(60);
    setNotice("문자로 받은 6자리 인증번호를 입력해 주세요.");
  };

  const handlePhoneSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await requestOtp();
  };

  const handleOtpSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    resetFeedback();

    if (!/^\d{6}$/.test(token)) {
      setError("문자로 받은 인증번호 6자리를 입력해 주세요.");
      return;
    }

    setLoading(true);
    if (!configured) {
      setLoading(false);
      if (token !== "123456") {
        setError("공개 데모 인증번호는 123456입니다.");
        return;
      }
      setStep("success");
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.verifyOtp({
      phone: sentPhone,
      token,
      type: "sms",
    });
    setLoading(false);

    if (authError) {
      setError("인증번호가 올바르지 않거나 만료됐습니다. 다시 확인해 주세요.");
      return;
    }

    setStep("success");
  };

  if (step === "success") {
    return (
      <div className="mt-7 rounded-xl border border-brand/20 bg-brand/5 p-5" role="status">
        <p className="font-bold text-brand">휴대폰 인증이 완료됐습니다.</p>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {configured ? "로그인 세션이 생성됐습니다. 판매자 정보를 확인해 주세요." : "공개 데모에서는 실제 계정이나 세션이 만들어지지 않습니다."}
        </p>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <button type="button" onClick={() => changeMode(mode)} className="rounded-lg border border-border bg-white px-4 py-3 text-sm font-bold text-text-secondary">다시 확인</button>
          <Link href="/account" className="rounded-lg bg-brand px-4 py-3 text-center text-sm font-bold text-white">내 정보로 이동</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mt-6 grid grid-cols-2 rounded-lg bg-surface-muted p-1" role="tablist" aria-label="계정 작업 선택">
        <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => changeMode("login")} className={`rounded-md px-4 py-2.5 text-sm font-bold ${mode === "login" ? "bg-white text-brand shadow-sm" : "text-text-secondary"}`}>로그인</button>
        <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => changeMode("signup")} className={`rounded-md px-4 py-2.5 text-sm font-bold ${mode === "signup" ? "bg-white text-brand shadow-sm" : "text-text-secondary"}`}>회원가입</button>
      </div>

      {step === "phone" ? (
        <form onSubmit={handlePhoneSubmit} className="mt-6 space-y-5">
          {mode === "signup" && (
            <label className="block text-sm font-semibold text-text-primary">
              이름 또는 상호
              <input value={displayName} onChange={(event) => { setDisplayName(event.target.value); resetFeedback(); }} name="name" required maxLength={30} className={inputClass} placeholder="예: 홍길동 농장" />
            </label>
          )}
          <label className="block text-sm font-semibold text-text-primary">
            휴대폰 번호
            <input value={phoneInput} onChange={(event) => { setPhoneInput(formatKoreanPhone(event.target.value)); resetFeedback(); }} name="phone" required type="tel" inputMode="tel" autoComplete="tel" className={inputClass} placeholder="010-1234-5678" />
          </label>
          <p className="text-xs leading-relaxed text-text-muted">비밀번호 없이 문자 인증번호로 로그인합니다. 인증된 번호는 매물 등록과 안전한 문의에 사용됩니다.</p>
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand px-4 py-3 font-bold text-white transition hover:bg-brand-light disabled:cursor-wait disabled:opacity-60">
            {loading ? "인증번호 전송 중..." : "문자로 인증번호 받기"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="mt-6 space-y-5">
          <div className="rounded-lg bg-surface-muted p-4 text-sm text-text-secondary">
            <p className="font-semibold text-text-primary">{phoneInput}로 인증번호를 보냈습니다.</p>
            <button type="button" onClick={() => { setStep("phone"); resetFeedback(); }} className="mt-2 text-xs font-bold text-brand hover:underline">번호 수정</button>
          </div>
          <label className="block text-sm font-semibold text-text-primary">
            인증번호 6자리
            <input value={token} onChange={(event) => { setToken(event.target.value.replace(/\D/g, "").slice(0, 6)); resetFeedback(); }} name="token" required inputMode="numeric" autoComplete="one-time-code" className={`${inputClass} text-center text-xl tracking-[0.35em]`} placeholder="000000" />
          </label>
          {notice && <p role="status" className="rounded-lg border border-brand/20 bg-brand/5 p-3 text-sm font-semibold text-brand">{notice}</p>}
          {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-lg bg-brand px-4 py-3 font-bold text-white transition hover:bg-brand-light disabled:cursor-wait disabled:opacity-60">
            {loading ? "인증 확인 중..." : "인증하고 계속하기"}
          </button>
          <button type="button" disabled={loading || secondsLeft > 0} onClick={requestOtp} className="w-full rounded-lg border border-border bg-white px-4 py-3 text-sm font-bold text-text-secondary disabled:cursor-not-allowed disabled:opacity-50">
            {secondsLeft > 0 ? `${secondsLeft}초 후 다시 받기` : "인증번호 다시 받기"}
          </button>
        </form>
      )}
    </>
  );
}
