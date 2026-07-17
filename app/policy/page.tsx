import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "장터 운영 원칙",
  description: "축산기계장터의 직거래 방식, 이용자 책임과 최소 운영 원칙을 안내합니다.",
};

const roles = [
  ["판매자", "본인이 판매할 수 있는 장비만 등록하고 실제 사진, 결함·수리 이력, 가격과 연락 조건을 정확히 알립니다."],
  ["구매자", "판매자에게 직접 연락해 장비 명판, 시운전, 수리 이력, 운송 범위를 확인하고 거래 여부를 결정합니다."],
  ["장터 운영자", "정보가 잘 보이고 이용자가 직접 연결되도록 장터를 관리하며 신고된 허위·위험 매물을 숨기거나 삭제합니다."],
];

export default function PolicyPage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-semibold text-brand">MARKET POLICY</p>
        <h1 className="mt-1 text-3xl font-bold text-text-primary">함께 만드는 직거래 장터 운영 원칙</h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-text-secondary">축산기계장터는 판매자와 구매자의 직접 거래를 돕는 정보 연결 공간입니다. 운영자는 장비 판매자, 구매자, 결제·배송 대행자 또는 거래 보증인이 아닙니다.</p>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {roles.map(([title, description], index) => (
            <article key={title} className="rounded-2xl border border-border bg-white p-6">
              <span className="text-xs font-bold text-brand">0{index + 1}</span>
              <h2 className="mt-2 text-lg font-bold text-text-primary">{title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{description}</p>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-border bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-text-primary">초기 운영 범위</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <div><h3 className="font-bold text-brand">장터가 제공하는 것</h3><ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary"><li>매물 등록·검색·비교와 판매 상태 표시</li><li>휴대폰 인증 기반 연락처 확인</li><li>안전거래 체크와 허위·위험 매물 신고</li><li>신고 매물 검토 후 숨김·삭제</li></ul></div>
            <div><h3 className="font-bold text-text-primary">장터가 대신하지 않는 것</h3><ul className="mt-3 space-y-2 text-sm leading-relaxed text-text-secondary"><li>가격 흥정과 거래 상담</li><li>계약금·잔금 수납과 결제 보증</li><li>장비 성능·하자 보증과 감정</li><li>운송·설치 계약과 분쟁 중재</li></ul></div>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-brand/20 bg-white p-6 sm:p-8">
          <h2 className="text-xl font-bold text-text-primary">판매자가 직접 최신 상태를 관리합니다</h2>
          <ol className="mt-4 grid gap-3 text-sm leading-relaxed text-text-secondary sm:grid-cols-3">
            <li className="rounded-xl bg-surface-muted p-4"><strong className="block text-brand">등록 후 30일 이내</strong><span className="mt-1 block">판매중·예약중·판매완료 상태와 연락 조건을 판매자가 직접 유지합니다.</span></li>
            <li className="rounded-xl bg-amber-50 p-4"><strong className="block text-amber-800">30일이 지나면</strong><span className="mt-1 block">판매 여부 확인이 필요하다고 표시해 판매자에게 갱신을 안내합니다.</span></li>
            <li className="rounded-xl bg-red-50 p-4"><strong className="block text-red-800">60일 동안 미확인</strong><span className="mt-1 block">삭제하지 않고 검색에서만 잠시 숨깁니다. 판매자가 확인하면 다시 노출됩니다.</span></li>
          </ol>
          <p className="mt-4 text-xs leading-relaxed text-text-muted">판매완료 매물은 거래 기록과 시세 참고를 위해 보관합니다. 실제 판매가격 입력은 판매자가 선택할 수 있습니다.</p>
        </section>

        <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-red-900">등록할 수 없는 내용</h2>
          <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-red-900 sm:grid-cols-2"><li>소유·판매 권한이 없는 장비</li><li>사진 도용 또는 허위 사양·가격</li><li>불법 개조·도난 의심 장비</li><li>장비 확인 전 선입금만 요구하는 내용</li><li>반복·중복·광고성 게시물</li><li>타인의 개인정보가 포함된 게시물</li></ul>
        </section>

        <div className="mt-7 grid gap-3 sm:grid-cols-2"><Link href="/safety" className="rounded-xl border border-brand/25 bg-white px-5 py-3.5 text-center text-sm font-bold text-brand">안전거래 안내</Link><Link href="/listings" className="rounded-xl bg-brand px-5 py-3.5 text-center text-sm font-bold text-white">매물 둘러보기</Link></div>
      </div>
    </div>
  );
}
