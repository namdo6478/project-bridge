import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "개발 현황",
  description: "축산기계장터 MVP 개발 현황과 다음 개발 단계를 확인하세요.",
};

const completed = [
  "홈·카테고리·검색·정렬·상세 화면",
  "장비 등록 입력·미리보기·사진 순서 관리",
  "등록 입력 자동 임시저장·복구와 판매자 정보 자동 입력",
  "관심·최근 본 매물 기기 저장과 2~3대 비교",
  "휴대폰 인증 후 판매자 직접 연락 흐름",
  "매물 공유와 직거래 확인 체크리스트",
  "내 매물 수정·삭제·판매 상태 변경",
  "30일 판매 여부 재확인·60일 미확인 자동 숨김 정책",
  "검색 조건 기기 저장과 모델·사용시간·최근 확인 비교",
  "정책 위반 신고만 접수하는 최소 운영 검수 흐름",
  "가입일·인증·판매완료·최근 활동 판매자 공개 프로필",
  "같은 품목 추천과 비회원·사진·비용·거래 FAQ",
  "사진 장수 제한 해제와 개인·영농법인·업체 회원 유형",
  "구매자가 직접 올리는 삽니다 구매 요청 등록",
  "구매 요청 전용 목록과 구매자·판매자 직접 연락 구분",
  "판매 매물·구매 요청 통합 관리와 요청 유효기간 연장",
  "메인 화면 구매 요청 노출과 모바일 삽니다 빠른 메뉴",
  "신고 접수·안전거래·운영자 검수 화면",
  "모바일·태블릿·PC 반응형 화면",
];

const phases = [
  { number: "01", title: "회원과 데이터 연결", description: "휴대폰 OTP 화면, 데이터 계약, 테이블과 권한 정책을 준비했습니다. 실제 프로젝트 키를 연결하면 저장을 시작합니다.", state: "연결 기반 완료" },
  { number: "02", title: "실제 사진 업로드", description: "사진 압축, 대표 사진, 순서 변경, 삭제와 업로드 실패 복구를 연결합니다.", state: "준비됨" },
  { number: "03", title: "직접 연락과 개인정보 보호", description: "판매자가 공개한 전화·문자 방식으로 구매자가 직접 연락하고, 번호 노출과 차단·신고 기준을 관리합니다.", state: "정책 확정" },
  { number: "04", title: "최소 운영과 성장", description: "운영자는 신고 매물 숨김·삭제에 집중하고, 통계·검색 품질·판매점 기능을 단계적으로 확장합니다.", state: "확장" },
];

export default function RoadmapPage() {
  return (
    <div className="bg-surface-muted px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-2xl bg-brand p-7 text-white sm:p-9">
          <p className="text-sm font-semibold text-white/70">MVP ROADMAP</p>
          <h1 className="mt-2 text-3xl font-bold">축산기계장터 개발 현황</h1>
          <p className="mt-3 max-w-3xl leading-relaxed text-white/80">현재 공개 링크는 핵심 사용 흐름을 직접 눌러보는 검토용 버전입니다. 찜·최근 본 매물·등록 임시저장은 현재 기기에 유지되며, 다음 단계에서 실제 회원과 서버 데이터 저장을 연결합니다.</p>
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
          <p className="text-xs font-bold tracking-[0.12em] text-amber-800">BACKEND CONNECTION</p>
          <h2 className="mt-2 text-xl font-bold text-amber-950">다음 연결: 실제 회원·매물·사진 저장</h2>
          <p className="mt-2 text-sm leading-relaxed text-amber-900">휴대폰 인증을 기본으로 하는 정책은 확정했습니다. Supabase 프로젝트 주소와 공개 키, 문자 발송 설정이 준비되면 현재 화면을 그대로 실제 회원·매물·사진 데이터에 연결합니다.</p>
        </section>
      </div>
    </div>
  );
}
