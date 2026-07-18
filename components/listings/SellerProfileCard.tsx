import Link from "next/link";
import type { SellerProfile } from "@/lib/types/listing";
import { formatDate } from "@/lib/utils/format";

export function SellerProfileCard({ seller, role = "seller" }: { seller: SellerProfile; role?: "seller" | "buyer" }) {
  const isBuyer = role === "buyer";
  return (
    <section className="mt-5 rounded-xl border border-border bg-white p-5" aria-labelledby="seller-profile-title">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs font-bold text-brand">{isBuyer ? "BUYER PROFILE" : "SELLER PROFILE"}</p><h2 id="seller-profile-title" className="mt-1 text-lg font-bold text-text-primary">{seller.displayName}</h2><p className="mt-1 text-sm text-text-secondary">{seller.memberType} · {seller.region}</p></div>
        <div className="flex flex-wrap gap-2">{seller.identityVerified && <span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">본인인증</span>}{seller.businessVerified && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">사업자인증</span>}</div>
      </div>
      <dl className="mt-4 grid grid-cols-3 gap-2 rounded-lg bg-surface-muted p-3 text-center"><div><dt className="text-[11px] text-text-muted">가입일</dt><dd className="mt-1 text-xs font-bold text-text-secondary">{formatDate(seller.joinedAt)}</dd></div><div><dt className="text-[11px] text-text-muted">{isBuyer ? "거래 이력" : "판매완료"}</dt><dd className="mt-1 text-xs font-bold text-text-secondary">{seller.completedSales}건</dd></div><div><dt className="text-[11px] text-text-muted">최근 활동</dt><dd className="mt-1 text-xs font-bold text-text-secondary">{formatDate(seller.lastActiveAt)}</dd></div></dl>
      <p className="mt-4 text-sm leading-relaxed text-text-secondary">{seller.introduction}</p>
      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"><p className="text-xs leading-relaxed text-text-muted">인증 표시는 신원·사업자 정보 확인 여부이며 장비 성능이나 거래를 보증하지 않습니다.</p><Link href={`/sellers/${seller.id}`} className="shrink-0 text-sm font-bold text-brand hover:underline">{isBuyer ? "회원 활동 보기" : "판매자 매물 보기"}</Link></div>
    </section>
  );
}
