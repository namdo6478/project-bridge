"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ReviewStatus = "검토 대기" | "확인 중" | "매물 숨김" | "반려";

interface ReportItem {
  id: string;
  listingId: string;
  title: string;
  reason: string;
  details: string;
  risk: "높음" | "보통" | "낮음";
  status: ReviewStatus;
  createdAt: string;
}

const initialReports: ReportItem[] = [
  { id: "RPT-2401", listingId: "1", title: "대형 사각압축포장기 2020년식", reason: "선입금 요구", details: "장비를 보여 주기 전에 운송비 50만원을 먼저 입금해 달라고 요청했습니다.", risk: "높음", status: "검토 대기", createdAt: "오늘 11:20" },
  { id: "RPT-2398", listingId: "4", title: "로더용 베일집게 1.8m", reason: "판매 상태가 다름", details: "이미 판매했다고 답변했지만 계속 예약중으로 표시되어 있습니다.", risk: "보통", status: "확인 중", createdAt: "어제 17:42" },
  { id: "RPT-2391", listingId: "8", title: "중고 사각압축기 2018년", reason: "사진·설명 도용", details: "다른 중고 장비 사이트에서 본 사진과 동일합니다.", risk: "보통", status: "검토 대기", createdAt: "7월 14일" },
  { id: "RPT-2389", listingId: "2", title: "5톤 TMR 사료배합기", reason: "단순 가격 문의", details: "가격을 알려 달라는 내용으로 운영정책 위반 신고가 아닙니다.", risk: "낮음", status: "반려", createdAt: "7월 14일" },
];

const filters: Array<"전체" | ReviewStatus> = ["전체", "검토 대기", "확인 중", "매물 숨김", "반려"];

function riskClass(risk: ReportItem["risk"]) {
  if (risk === "높음") return "bg-red-100 text-red-800";
  if (risk === "보통") return "bg-amber-100 text-amber-900";
  return "bg-surface-muted text-text-secondary";
}

export function ReportQueue() {
  const [items, setItems] = useState(initialReports);
  const [filter, setFilter] = useState<(typeof filters)[number]>("전체");
  const [notice, setNotice] = useState("");

  const counts = useMemo(() => ({
    waiting: items.filter((item) => item.status === "검토 대기").length,
    reviewing: items.filter((item) => item.status === "확인 중").length,
    hidden: items.filter((item) => item.status === "매물 숨김").length,
  }), [items]);
  const riskOrder: Record<ReportItem["risk"], number> = { 높음: 0, 보통: 1, 낮음: 2 };
  const visibleItems = (filter === "전체" ? items : items.filter((item) => item.status === filter)).toSorted((left, right) => riskOrder[left.risk] - riskOrder[right.risk]);

  const updateStatus = (id: string, status: ReviewStatus) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    setNotice(`신고 상태를 '${status}'으로 변경했습니다. 공개 예시는 새로고침하면 초기화됩니다.`);
  };

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">검토 대기</p><p className="mt-1 text-2xl font-bold text-red-700">{counts.waiting}</p></div>
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">확인 중</p><p className="mt-1 text-2xl font-bold text-accent-hover">{counts.reviewing}</p></div>
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">숨김 조치</p><p className="mt-1 text-2xl font-bold text-brand">{counts.hidden}</p></div>
      </div>

      <div className="mt-4 rounded-xl border border-brand/20 bg-brand/5 p-4 text-sm leading-relaxed text-text-secondary"><strong className="text-brand">최소 운영 기준</strong><p className="mt-1">위험 높음부터 확인하고, 정책 위반이 아닌 가격 문의·분쟁 해결 요청은 반려합니다. 판매 상태 오류는 판매자 셀프 갱신을 우선 안내합니다.</p></div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1" aria-label="신고 상태 필터">
        {filters.map((item) => <button key={item} type="button" onClick={() => setFilter(item)} className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold ${filter === item ? "bg-brand text-white" : "border border-border bg-white text-text-secondary"}`}>{item}</button>)}
      </div>

      {notice && <p role="status" className="mt-4 rounded-lg bg-brand/5 p-3 text-sm font-medium text-brand">{notice}</p>}

      <div className="mt-5 space-y-4">
        {visibleItems.map((item) => (
          <article key={item.id} className="rounded-xl border border-border bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2"><div className="flex items-center gap-2"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${riskClass(item.risk)}`}>위험 {item.risk}</span><span className="rounded-full bg-surface-muted px-2.5 py-1 text-xs font-bold text-text-secondary">{item.status}</span></div><span className="text-xs text-text-muted">{item.id} · {item.createdAt}</span></div>
            <h2 className="mt-4 text-lg font-bold text-text-primary">{item.title}</h2>
            <p className="mt-2 text-sm font-semibold text-red-700">{item.reason}</p>
            <p className="mt-2 rounded-lg bg-surface-muted p-4 text-sm leading-relaxed text-text-secondary">{item.details}</p>
            <div className="mt-4 flex flex-col-reverse gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between"><Link href={`/listings/${item.listingId}`} className="text-center text-sm font-semibold text-brand hover:underline">매물 확인</Link><div className="grid grid-cols-3 gap-2"><button type="button" onClick={() => updateStatus(item.id, "확인 중")} className="rounded-md border border-brand/25 px-3 py-2 text-xs font-bold text-brand">확인 중</button><button type="button" onClick={() => updateStatus(item.id, "매물 숨김")} className="rounded-md bg-red-700 px-3 py-2 text-xs font-bold text-white">매물 숨김</button><button type="button" onClick={() => updateStatus(item.id, "반려")} className="rounded-md border border-border px-3 py-2 text-xs font-bold text-text-secondary">반려</button></div></div>
          </article>
        ))}
        {visibleItems.length === 0 && <p className="rounded-xl border border-dashed border-border bg-white p-10 text-center text-sm text-text-secondary">이 상태의 신고가 없습니다.</p>}
      </div>
    </>
  );
}
