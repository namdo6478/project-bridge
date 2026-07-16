import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개발 현황",
  description: "축산기계장터 MVP 개발 현황과 다음 개발 단계를 확인하세요.",
};

const completed = [
  "홈·카테고리·검색·정렬·상세 화면",
  "장비 등록 입력·미리보기·사진 순서 관리",
  "관심 매물 저장 예시와 2~3대 비교",
  "구매 문의 작성과 받은·보낸 문의 관리",
  "내 매물 수정·삭제·판매 상태 변경",
  "신고 접수·안전거래·운영자 검수 화면",
  "모바일·태블릿·PC 반응형 화면",
];

const phases = [
  { number: "01", title: "회원과 데이터 연결", description: "회원가입 방식 확정, 사용자·매물·문의·관심 매물 데이터를 실제 저장 구조에 연결합니다.", state: "다음 우선순위" },
  { number: "02", title: "실제 사진 업로드", description: "사진 압축, 대표 사진, 순서 변경, 삭제와 업로드 실패 복구를 연결합니다.", state: "준비됨" },
  { number: "03", title: "알림과 연락 보호", description: "문의 알림, 연락처 공개 범위, 차단과 신고 이력을 사용자별로 관리합니다.", state: "후속" },
  { number: "04", title: "운영과 성장", description: "관리자 권한, 매물 검수, 통계, 검색 품질, 판매점 전용 기능을 확장합니다.", state: "확장" },
];

export default function RoadmapPage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-brand p-7 text-white sm:p-9">
          <p className="text-sm font-semibold text-white/70">MVP ROADMAP</p>
          <h1 className="mt-2 text-3xl font-bold">축산기계장터 개발 현황</h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-white/80">현재 공개 링크는 핵심 사용 흐름을 직접 눌러보는 검토용 버전입니다. 입력한 정보는 새로고침하면 초기화되며, 다음 단계에서 실제 회원과 데이터 저장 기능을 연결합니다.</p>
        </div>

        <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_1.15fr]">
          <section className="rounded-2xl border border-border bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-bold text-text-primary">현재 확인 가능한 기능</h2><span className="rounded-full bg-brand/10 px-3 py-1 text-xs font-bold text-brand">MVP 화면 완료</span></div>
            <ul className="mt-5 space-y-3">
              {completed.map((item) => <li key={item} className="flex gap-3 text-sm leading-relaxed text-text-secondary"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">✓</span><span>{item}</span></li>)}
            </ul>
            <div className="mt-6 grid grid-cols-2 gap-3"><Link href="/" className="rounded-lg border border-brand/25 px-4 py-3 text-center text-sm font-bold text-brand">메인 화면</Link><Link href="/sell" className="rounded-lg bg-accent px-4 py-3 text-center text-sm font-bold text-white">등록 화면</Link></div>
          </section>

          <section className="rounded-2xl border border-border bg-white p-6 sm:p-7">
            <h2 className="text-xl font-bold text-text-primary">다음 개발 순서</h2>
            <div className="mt-5 space-y-4">
              {phases.map((phase) => (
                <article key={phase.number} className="grid grid-cols-[44px_1fr] gap-3 rounded-xl bg-surface-muted p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand text-xs font-bold text-white">{phase.number}</span>
                  <div><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-text-primary">{phase.title}</h3><span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-brand">{phase.state}</span></div><p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{phase.description}</p></div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6 sm:p-7">
          <p className="text-xs font-bold tracking-[0.12em] text-amber-800">DECISION NEEDED</p>
          <h2 className="mt-2 text-xl font-bold text-amber-950">실제 회원가입 방식</h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-900">휴대폰 사용 비중과 거래 신뢰를 고려하면 휴대폰 본인인증을 기본으로 하고, 이후 카카오·네이버 간편가입을 추가하는 순서를 추천합니다. 이 선택이 확정되면 실제 저장과 권한 기능을 연결할 수 있습니다.</p>
        </section>
      </div>
    </div>
  );
}
