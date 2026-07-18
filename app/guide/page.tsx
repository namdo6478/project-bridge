import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "이용 안내",
  description: "축산기계장터에서 장비를 찾고 등록하고 판매자와 직접 거래하는 방법을 확인하세요.",
};

const buyerSteps = [
  ["1", "조건으로 찾기", "장비명, 세부 품목, 지역과 신품·중고 조건으로 검색합니다."],
  ["2", "판매자와 장비 확인", "판매자 가입일·인증 상태와 대표 사진뿐 아니라 제조 명판, 작동부와 수리 부위 사진을 확인합니다."],
  ["3", "판매자에게 직접 연락", "연식, 수리 이력, 시운전과 운송 조건을 판매자에게 직접 묻고 현장에서 장비를 확인합니다."],
];

const sellerSteps = [
  ["1", "사진 준비", "장비 전체, 제조 명판, 작동부, 사용 흔적을 밝은 곳에서 촬영합니다."],
  ["2", "정보 입력", "품목, 제조사, 모델, 연식, 수리 이력, 가격과 거래 지역을 구체적으로 적습니다."],
  ["3", "연락과 상태 관리", "연락 가능 시간과 방법을 안내하고 예약중·판매완료 상태를 바로 변경합니다."],
];

const frequentlyAsked = [
  ["매물을 보려면 회원가입해야 하나요?", "아니요. 검색과 상세 열람은 누구나 할 수 있습니다. 장비 등록과 판매자 연락처 확인 등 보호가 필요한 기능에서 휴대폰 인증을 사용합니다."],
  ["가격이나 재고를 장터 운영자에게 물어보나요?", "아니요. 가격, 판매 여부, 장비 상태, 시운전과 운송 조건은 매물 상세에서 판매자에게 직접 연락해 확인합니다."],
  ["첫 번째 사진은 어디에 쓰이나요?", "목록과 상세의 대표 사진으로 사용됩니다. 장비 전체 모습이 잘 보이는 사진을 첫 번째에 놓고, 명판과 사용 흔적 사진을 뒤에 배치하세요."],
  ["판매가 끝나면 매물이 사라지나요?", "판매자가 판매완료로 바꾸면 연락 기능은 종료되고 기록은 남습니다. 실제 판매가격 공개는 판매자가 선택할 수 있습니다."],
  ["장터 이용료가 있나요?", "초기 핵심 기능은 무료로 운영하는 방향입니다. 이후에도 기본 등록·검색은 유지하고 선택형 프리미엄 기능만 유료화하는 것을 원칙으로 합니다."],
  ["거래 문제가 생기면 장터가 해결해 주나요?", "장터는 거래 당사자가 아니므로 가격·계약·환불 분쟁을 중재하거나 보상하지 않습니다. 허위·위험 매물은 신고하고, 송금 피해나 범죄 의심은 금융기관과 관계기관에 즉시 신고하세요."],
];

export default function GuidePage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-brand">HOW TO USE</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">축산기계장터 이용 안내</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-text-secondary">구매자는 장비 상태를 충분히 확인하고, 판매자는 실제 상태와 거래 조건을 구체적으로 공개합니다. 장터는 거래 당사자가 직접 연결되는 공간이며 결제·배송을 대신하지 않습니다.</p>

        <div className="mt-8 grid gap-5 lg:grid-cols-2">
          {[["장비를 찾는 분", buyerSteps, "/listings", "매물 찾기"], ["장비를 파는 분", sellerSteps, "/sell", "장비 등록하기"]].map(([title, steps, href, cta]) => (
            <section key={title as string} className="rounded-2xl border border-border bg-white p-6 sm:p-7">
              <h2 className="text-xl font-bold text-text-primary">{title as string}</h2>
              <ol className="mt-5 space-y-5">
                {(steps as string[][]).map(([number, label, description]) => (
                  <li key={number} className="flex gap-3"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{number}</span><div><h3 className="font-bold text-text-primary">{label}</h3><p className="mt-1 text-sm leading-relaxed text-text-secondary">{description}</p></div></li>
                ))}
              </ol>
              <div className="mt-7 flex flex-wrap gap-3"><Link href={href as string} className="inline-flex rounded-lg bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-light">{cta as string}</Link>{title === "장비를 찾는 분" && <Link href="/wanted" className="inline-flex rounded-lg border border-brand/25 px-5 py-3 text-sm font-bold text-brand">삽니다 등록</Link>}</div>
            </section>
          ))}
        </div>

        <section className="mt-6 rounded-2xl border border-border bg-white p-6 sm:p-7">
          <h2 className="text-xl font-bold text-text-primary">거래 상태 표시</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[["판매중", "판매자에게 직접 연락할 수 있는 매물"], ["예약중", "다른 구매자와 거래를 진행 중인 매물"], ["판매완료", "거래가 끝나 기록만 남은 매물"]].map(([status, description]) => <div key={status} className="rounded-xl bg-surface-muted p-4"><p className="font-bold text-brand">{status}</p><p className="mt-2 text-sm leading-relaxed text-text-secondary">{description}</p></div>)}
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-brand/20 bg-brand/5 p-6 sm:p-7"><h2 className="text-xl font-bold text-text-primary">장터 운영자에게 거래 문의하지 않습니다</h2><p className="mt-3 text-sm leading-relaxed text-text-secondary">가격·장비 상태·운송은 판매자에게 직접 확인합니다. 장터 운영자는 거래를 상담하거나 보증하지 않고 허위·위험 매물 신고를 검수하는 역할만 합니다.</p><div className="mt-4 flex flex-wrap gap-3"><Link href="/inquiries" className="rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-brand">판매자 연락 방법</Link><Link href="/policy" className="rounded-lg border border-brand/20 bg-white px-4 py-2.5 text-sm font-bold text-brand">운영 원칙</Link></div></section>

        <section className="mt-6 rounded-2xl border border-border bg-white p-6 sm:p-7"><p className="text-xs font-bold text-brand">QUICK ANSWERS</p><h2 className="mt-1 text-xl font-bold text-text-primary">자주 묻는 내용</h2><div className="mt-5 divide-y divide-border border-y border-border">{frequentlyAsked.map(([question, answer]) => <details key={question} className="group py-4"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold text-text-primary"><span>{question}</span><span className="text-lg text-brand group-open:rotate-45" aria-hidden="true">+</span></summary><p className="mt-3 pr-8 text-sm leading-relaxed text-text-secondary">{answer}</p></details>)}</div></section>

        <section className="mt-6 rounded-2xl bg-brand p-6 text-white sm:p-8">
          <h2 className="text-xl font-bold">입금 전에 실물을 확인하세요</h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/80">장비를 확인하기 전 계약금이나 운송비 선입금을 요구하면 거래를 중단하고, 명판·시운전·수리 이력과 판매자 정보를 다시 확인하세요.</p>
          <Link href="/safety" className="mt-5 inline-flex rounded-lg bg-white px-5 py-3 text-sm font-bold text-brand">안전거래 안내 보기</Link>
        </section>
      </div>
    </div>
  );
}
