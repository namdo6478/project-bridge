import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "안전거래 안내",
  description: "축산기계 거래 전 확인사항과 사기 예방 수칙을 안내합니다.",
};

const checks = [
  ["판매자 확인", "이름·상호·연락처가 매물 설명과 일치하는지 확인합니다."],
  ["장비 실물 확인", "명판의 제조번호와 연식, 외관, 누유·균열·마모 상태를 직접 확인합니다."],
  ["시운전", "가능하면 실제 작업 조건에서 작동 소음, 유압, 전기 제어와 안전장치를 확인합니다."],
  ["수리 이력", "주요 부품 교체·수리 내역과 현재 필요한 정비 항목을 서면으로 남깁니다."],
  ["운송 조건", "상차·운송·하차 비용과 파손 책임, 일정, 필요한 장비를 사전에 합의합니다."],
  ["대금 지급", "실물과 판매자를 확인하기 전 계약금·운송비 선입금을 재촉하는 거래는 중단합니다."],
];

export default function SafetyPage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-brand">SAFE TRADE</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">안전거래 안내</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-secondary">축산기계는 금액이 크고 운송·설치·시운전 조건이 복잡합니다. 연락처만 믿고 결정하지 말고 아래 순서대로 확인하세요.</p>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {checks.map(([title, description], index) => (
            <article key={title} className="rounded-xl border border-border bg-white p-5"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-xs font-bold text-brand">{index + 1}</span><h2 className="mt-4 font-bold text-text-primary">{title}</h2><p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p></article>
          ))}
        </section>

        <section className="mt-8 grid overflow-hidden rounded-2xl border border-red-200 bg-white lg:grid-cols-[1fr_1fr]">
          <div className="bg-red-50 p-6 sm:p-8"><p className="text-sm font-bold text-red-700">거래를 멈춰야 하는 신호</p><ul className="mt-4 space-y-3 text-sm leading-relaxed text-red-950"><li>시세보다 지나치게 저렴한 가격을 제시하며 결정을 재촉합니다.</li><li>실물 확인이나 영상 통화를 계속 피합니다.</li><li>판매자와 다른 이름의 계좌로 입금을 요구합니다.</li><li>공식 운송업체를 사칭하며 운송비를 먼저 요구합니다.</li></ul></div>
          <div className="p-6 sm:p-8"><p className="text-sm font-bold text-brand">문제가 생겼다면</p><ol className="mt-4 space-y-3 text-sm leading-relaxed text-text-secondary"><li><strong className="text-text-primary">1. 추가 송금을 중단</strong>하고 판매자와의 대화 기록을 보존합니다.</li><li><strong className="text-text-primary">2. 송금한 금융기관</strong>에 즉시 상황을 알리고 안내를 받습니다.</li><li><strong className="text-text-primary">3. 긴급하거나 범죄가 의심되면</strong> 경찰 등 관계기관에 신고합니다.</li><li><strong className="text-text-primary">4. 장터 매물 신고</strong>를 접수해 다른 이용자의 피해를 예방합니다.</li></ol></div>
        </section>

        <section className="mt-8 rounded-2xl bg-brand p-6 text-white sm:p-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><h2 className="text-xl font-bold">안전한 거래는 확인에서 시작합니다</h2><p className="mt-2 text-sm leading-relaxed text-white/75">판매자에게 직접 연락해 장비 상태와 거래 조건을 확인하고, 입금 전에는 반드시 실물을 확인하세요.</p></div><Link href="/listings" className="shrink-0 rounded-lg bg-accent px-5 py-3 text-center text-sm font-bold text-white">매물 둘러보기</Link></div></section>
      </div>
    </div>
  );
}
