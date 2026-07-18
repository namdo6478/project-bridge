import type { Metadata } from "next";
import { SellForm } from "@/components/sell/SellForm";

export const metadata: Metadata = {
  title: "장비 팔기",
  description: "판매할 축산기계의 사진과 장비 정보, 가격, 지역을 입력해 매물 등록을 준비하세요.",
};

export default function SellPage() {
  return (
    <div className="bg-surface-muted">
      <section className="border-b border-border bg-white">
        <div className="mx-auto max-w-5xl px-4 py-9 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold text-brand">SELL EQUIPMENT</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-text-primary">장비 팔기</h1>
          <p className="mt-3 max-w-2xl leading-relaxed text-text-secondary">
            정확한 품목과 상태, 가격을 적을수록 구매자에게 더 빠르게 연결됩니다. 입력 내용을 미리 확인하고 실제 등록 단계까지 점검할 수 있습니다.
          </p>
          <ol className="mt-7 grid max-w-2xl grid-cols-3 gap-2" aria-label="등록 단계">
            {[
              ["1", "장비 정보"],
              ["2", "가격·지역"],
              ["3", "연락처 확인"],
            ].map(([number, label]) => (
              <li key={number} className="flex items-center gap-2 rounded-lg bg-brand/5 px-3 py-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{number}</span>
                <span className="text-xs font-semibold text-brand sm:text-sm">{label}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-5 rounded-xl border border-brand/20 bg-brand/5 p-4 text-sm leading-relaxed text-brand">
          <strong>등록 화면 미리보기와 자동 임시저장</strong>
          <p className="mt-1">사진 순서와 입력 내용을 확인할 수 있습니다. 사진을 제외한 입력값은 현재 기기에만 임시저장되며 서버로 전송되지 않습니다.</p>
        </div>
        <SellForm />
      </div>
    </div>
  );
}
