import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용 안내",
  description: "축산기계장터에서 장비를 찾고 등록하고 문의하는 방법을 확인하세요.",
};

const buyerSteps = [
  ["1", "조건으로 찾기", "장비명, 세부 품목, 지역과 신품·중고 조건으로 검색합니다."],
  ["2", "사진과 명판 확인", "대표 사진뿐 아니라 제조 명판, 작동부와 수리 부위 사진을 확인합니다."],
  ["3", "문의하고 실물 확인", "연식, 수리 이력, 시운전과 운송 조건을 묻고 현장에서 장비를 확인합니다."],
];

const sellerSteps = [
  ["1", "사진 준비", "장비 전체, 제조 명판, 작동부, 사용 흔적을 밝은 곳에서 촬영합니다."],
  ["2", "정보 입력", "품목, 제조사, 모델, 연식, 수리 이력, 가격과 거래 지역을 구체적으로 적습니다."],
  ["3", "문의와 상태 관리", "구매 문의에 답하고 예약중·판매완료 상태를 바로 변경합니다."],
];

export default function GuidePage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-brand">HOW TO USE</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">축산기계장터 이용 안내</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-text-secondary">구매자는 장비 상태를 충분히 확인하고, 판매자는 실제 상태와 거래 조건을 구체적으로 공개하는 것을 기본 원칙으로 합니다.</p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {[["장비를 찾는 분", buyerSteps, "/listings", "매물 찾기"], ["장비를 파는 분", sellerSteps, "/sell", "장비 등록하기"]].map(([title, steps, href, cta]) => (
            <section key={title as string} className="rounded-2xl border border-border bg-white p-6 sm:p-7">
              <h2 className="text-xl font-bold text-text-primary">{title as string}</h2>
              <ol className="mt-5 space-y-5">
                {(steps as string[][]).map(([number, label, description]) => (
                  <li key={number} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{number}</span><div><h3 className="font-bold text-text-primary">{label}</h3><p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p></div></li>
                ))}
              </ol>
              <Link href={href as string} className="mt-7 inline-flex rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-light">{cta as string}</Link>
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-white p-6 sm:p-7">
          <h2 className="text-xl font-bold text-text-primary">거래 상태 표시</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[["판매중", "바로 문의할 수 있는 매물"], ["예약중", "다른 구매자와 거래를 진행 중인 매물"], ["판매완료", "거래가 끝나 기록만 남은 매물"]].map(([status, description]) => <div key={status} className="rounded-xl bg-surface-muted p-4"><p className="font-bold text-brand">{status}</p><p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p></div>)}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-brand p-6 text-white sm:p-8">
          <h2 className="text-xl font-bold">입금 전에 실물을 확인하세요</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80">장비를 확인하기 전 계약금이나 운송비 선입금을 요구하면 거래를 중단하고, 명판·시운전·수리 이력과 판매자 정보를 다시 확인하세요.</p>
          <Link href="/safety" className="mt-5 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-bold text-brand">안전거래 안내 보기</Link>
        </section>
      </div>
    </div>
  );
}
