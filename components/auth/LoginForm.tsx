"use client";

import { FormEvent, useState } from "react";

type AuthMode = "login" | "signup";

const inputClass = "mt-2 w-full rounded-lg border border-border bg-white px-4 py-3 text-sm text-text-primary outline-none placeholder:text-text-muted focus:border-brand focus:ring-2 focus:ring-brand/10";

export function LoginForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [submitted, setSubmitted] = useState(false);

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <div className="mt-6 grid grid-cols-2 rounded-lg bg-surface-muted p-1" role="tablist" aria-label="계정 작업 선택">
        <button type="button" role="tab" aria-selected={mode === "login"} onClick={() => changeMode("login")} className={`rounded-md px-4 py-2.5 text-sm font-bold ${mode === "login" ? "bg-white text-brand shadow-sm" : "text-text-secondary"}`}>로그인</button>
        <button type="button" role="tab" aria-selected={mode === "signup"} onClick={() => changeMode("signup")} className={`rounded-md px-4 py-2.5 text-sm font-bold ${mode === "signup" ? "bg-white text-brand shadow-sm" : "text-text-secondary"}`}>회원가입</button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        {mode === "signup" && (
          <label className="block text-sm font-semibold text-text-primary">
            이름 또는 상호
            <input name="name" required maxLength={30} className={inputClass} placeholder="예: 홍길동 농장" onChange={() => setSubmitted(false)} />
          </label>
        )}
        <label className="block text-sm font-semibold text-text-primary">
          이메일
          <input name="email" required type="email" autoComplete="email" className={inputClass} placeholder="name@example.com" onChange={() => setSubmitted(false)} />
        </label>
        <label className="block text-sm font-semibold text-text-primary">
          비밀번호
          <input name="password" required minLength={8} type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} className={inputClass} placeholder="8자 이상" onChange={() => setSubmitted(false)} />
        </label>
        {mode === "signup" && <p className="text-xs leading-relaxed text-text-muted">가입 후 연락처 본인 확인을 완료해야 매물을 등록할 수 있도록 구성할 예정입니다.</p>}

        {submitted && (
          <p role="status" className="rounded-lg border border-brand/20 bg-brand/5 p-3 text-sm font-semibold text-brand">
            {mode === "login" ? "로그인 입력 흐름" : "회원가입 입력 흐름"}을 확인했습니다. 공개 예시에서는 실제 계정이 만들어지지 않습니다.
          </p>
        )}

        <button type="submit" className="w-full rounded-lg bg-brand px-4 py-3 font-bold text-white transition hover:bg-brand-light">
          {mode === "login" ? "로그인 예시 확인" : "회원가입 예시 확인"}
        </button>
      </form>
    </>
  );
}
