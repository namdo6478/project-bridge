"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { loadDemoPhoneSession } from "@/lib/auth/demo-session";

interface DirectContactCardProps {
  listingId: string;
  region: string;
  sellerLabel: string;
  status: string;
}

export function DirectContactCard({ listingId, region, sellerLabel, status }: DirectContactCardProps) {
  const [verified, setVerified] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    window.setTimeout(() => setVerified(Boolean(loadDemoPhoneSession())), 0);
  }, []);

  const copyDemoContact = async () => {
    const value = "010-0000-0000";
    try {
      await navigator.clipboard.writeText(value);
      setNotice("공개 데모 연락처를 복사했습니다. 실제 서비스에서는 판매자가 등록한 인증 번호가 표시됩니다.");
    } catch {
      setNotice(`공개 데모 연락처: ${value}`);
    }
  };

  const openContact = () => {
    setRevealed(true);
    window.setTimeout(() => document.getElementById("direct-contact")?.scrollIntoView({ behavior: "smooth", block: "center" }), 0);
  };

  return (
    <section id="direct-contact" className="mt-4 rounded-xl border border-border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-text-muted">판매자와 직접 거래</p>
          <h2 className="mt-1 text-lg font-bold text-text-primary">{sellerLabel}</h2>
          <p className="mt-1 text-sm text-text-secondary">{region} · 전화·문자 직접 연락</p>
        </div>
        <span className="rounded-full bg-brand/10 px-3 py-1.5 text-xs font-bold text-brand">휴대폰 확인 판매자 예시</span>
      </div>

      <div className="mt-4 rounded-lg bg-surface-muted p-4 text-sm leading-relaxed text-text-secondary">
        축산기계장터는 판매자와 구매자가 직접 연락하는 공간입니다. 장터 운영자는 거래 당사자나 결제·배송 중개자가 아닙니다.
      </div>

      {status === "판매중" || status === "구매요청" ? (
        verified ? (
          <div className="mt-4">
            {!revealed ? (
              <button type="button" onClick={openContact} className="w-full rounded-lg bg-accent px-5 py-3.5 text-sm font-bold text-white">
                판매자 연락처 보기
              </button>
            ) : (
              <div className="rounded-lg border border-brand/20 bg-brand/5 p-4">
                <p className="text-xs font-semibold text-text-muted">공개 데모 연락처</p>
                <p className="mt-1 text-xl font-bold text-text-primary">010-0000-0000</p>
                <p className="mt-1 text-xs text-text-muted">실제 서버 연결 후에는 판매자가 인증하고 공개한 번호가 표시됩니다.</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={copyDemoContact} className="rounded-lg border border-brand/25 bg-white px-4 py-3 text-sm font-bold text-brand">번호 복사</button>
                  <button type="button" onClick={() => setNotice("실제 서비스에서는 휴대폰 문자 작성 화면으로 바로 연결됩니다.")} className="rounded-lg bg-accent px-4 py-3 text-sm font-bold text-white">문자 보내기</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <Link href={`/login?next=/listings/${listingId}`} className="block w-full rounded-lg bg-accent px-5 py-3.5 text-center text-sm font-bold text-white">
              휴대폰 인증 후 연락처 보기
            </Link>
            <p className="mt-2 text-center text-xs text-text-muted">판매자 연락처 보호와 거래 책임 확인을 위해 휴대폰 인증이 필요합니다.</p>
          </div>
        )
      ) : (
        <p className="mt-4 rounded-lg border border-border bg-surface-muted p-4 text-center text-sm font-semibold text-text-secondary">현재 직접 연락할 수 없는 거래 상태입니다.</p>
      )}

      {notice && <p role="status" className="mt-3 rounded-lg border border-brand/20 bg-brand/5 p-3 text-xs font-semibold leading-relaxed text-brand">{notice}</p>}

      {(status === "판매중" || status === "구매요청") && (
        <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-white p-2 shadow-[0_-6px_20px_rgba(17,24,39,0.1)] lg:hidden">
          {verified ? (
            <button type="button" onClick={openContact} className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-bold text-white">판매자 연락처 보기</button>
          ) : (
            <Link href={`/login?next=/listings/${listingId}`} className="block w-full rounded-lg bg-accent px-4 py-3 text-center text-sm font-bold text-white">인증 후 판매자에게 직접 연락</Link>
          )}
        </div>
      )}
    </section>
  );
}
