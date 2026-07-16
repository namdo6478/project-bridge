"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type InquiryDirection = "received" | "sent";
type InquiryStatus = "새 문의" | "확인" | "종료";

interface InquiryItem {
  id: string;
  direction: InquiryDirection;
  listingId: string;
  title: string;
  message: string;
  contact: string;
  status: InquiryStatus;
  date: string;
}

const initialInquiries: InquiryItem[] = [
  {
    id: "received-1",
    direction: "received",
    listingId: "1",
    title: "대형 사각압축포장기 2020년식",
    message: "현재 판매 중인지와 이번 주말 시운전 가능 여부를 알고 싶습니다. 운송은 별도 협의가 가능한가요?",
    contact: "010-1234-5678",
    status: "새 문의",
    date: "오늘 10:24",
  },
  {
    id: "received-2",
    direction: "received",
    listingId: "2",
    title: "5톤 TMR 사료배합기",
    message: "스크류와 교반 날 교체 이력이 있는지 궁금합니다. 다음 주 평일 오후에 장비를 볼 수 있을까요?",
    contact: "010-9876-5432",
    status: "확인",
    date: "어제 16:10",
  },
  {
    id: "sent-1",
    direction: "sent",
    listingId: "4",
    title: "로더용 베일집게 1.8m",
    message: "현재 예약 상태인데 거래가 취소되면 연락 부탁드립니다. 유압 호스 포함 여부도 확인하고 싶습니다.",
    contact: "010-2468-1357",
    status: "확인",
    date: "7월 14일",
  },
];

function statusClass(status: InquiryStatus) {
  if (status === "새 문의") return "bg-accent/10 text-accent-hover";
  if (status === "확인") return "bg-brand/10 text-brand";
  return "bg-surface-muted text-text-muted";
}

export function InquiryManager() {
  const [items, setItems] = useState(initialInquiries);
  const [tab, setTab] = useState<InquiryDirection>("received");
  const [notice, setNotice] = useState("");

  const counts = useMemo(() => ({
    received: items.filter((item) => item.direction === "received").length,
    sent: items.filter((item) => item.direction === "sent").length,
    unread: items.filter((item) => item.direction === "received" && item.status === "새 문의").length,
  }), [items]);

  const visibleItems = items.filter((item) => item.direction === tab);

  const updateStatus = (id: string, status: InquiryStatus) => {
    setItems((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    setNotice(status === "확인" ? "문의 내용을 확인 처리했습니다." : "문의 상태를 종료로 변경했습니다.");
  };

  const copyContact = async (contact: string) => {
    try {
      await navigator.clipboard.writeText(contact);
      setNotice("연락처를 복사했습니다.");
    } catch {
      setNotice(`연락처: ${contact}`);
    }
  };

  return (
    <>
      <div className="mt-7 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">받은 문의</p><p className="mt-1 text-2xl font-bold text-text-primary">{counts.received}</p></div>
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">새 문의</p><p className="mt-1 text-2xl font-bold text-accent-hover">{counts.unread}</p></div>
        <div className="rounded-xl border border-border bg-white p-4"><p className="text-xs text-text-muted">보낸 문의</p><p className="mt-1 text-2xl font-bold text-text-primary">{counts.sent}</p></div>
      </div>

      <div className="mt-7 flex rounded-xl border border-border bg-white p-1" role="tablist" aria-label="문의 구분">
        {(["received", "sent"] as const).map((direction) => (
          <button
            key={direction}
            type="button"
            role="tab"
            aria-selected={tab === direction}
            onClick={() => { setTab(direction); setNotice(""); }}
            className={`flex-1 rounded-lg px-4 py-3 text-sm font-bold ${tab === direction ? "bg-brand text-white" : "text-text-secondary hover:bg-surface-muted"}`}
          >
            {direction === "received" ? `받은 문의 ${counts.received}` : `보낸 문의 ${counts.sent}`}
          </button>
        ))}
      </div>

      {notice && <p role="status" className="mt-4 rounded-lg bg-brand/5 p-3 text-sm font-medium text-brand">{notice}</p>}

      <div className="mt-5 space-y-4">
        {visibleItems.map((item) => (
          <article key={item.id} className="rounded-xl border border-border bg-white p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusClass(item.status)}`}>{item.status}</span>
                <span className="text-xs text-text-muted">{item.date}</span>
              </div>
              <span className="text-xs font-medium text-text-muted">{item.direction === "received" ? "구매자가 보낸 문의" : "내가 보낸 문의"}</span>
            </div>

            <h2 className="mt-4 text-lg font-bold text-text-primary">{item.title}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-text-secondary">{item.message}</p>

            <div className="mt-4 flex flex-col gap-3 rounded-lg bg-surface-muted p-4 sm:flex-row sm:items-center sm:justify-between">
              <div><p className="text-xs text-text-muted">회신 연락처</p><p className="mt-1 font-bold text-text-primary">{item.contact}</p></div>
              <div className="flex gap-2">
                <button type="button" onClick={() => copyContact(item.contact)} className="rounded-md border border-border bg-white px-3 py-2 text-xs font-bold text-text-secondary hover:border-brand/25 hover:text-brand">복사</button>
                <a href={`tel:${item.contact.replaceAll("-", "")}`} className="rounded-md bg-accent px-3 py-2 text-xs font-bold text-white">전화하기</a>
              </div>
            </div>

            <div className="mt-4 flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
              <Link href={`/listings/${item.listingId}`} className="text-center text-sm font-semibold text-brand hover:underline sm:text-left">매물 상세 보기</Link>
              {item.direction === "received" && (
                <div className="flex gap-2">
                  {item.status === "새 문의" && <button type="button" onClick={() => updateStatus(item.id, "확인")} className="flex-1 rounded-md border border-brand/25 px-3 py-2 text-xs font-bold text-brand hover:bg-brand/5">확인 처리</button>}
                  {item.status !== "종료" && <button type="button" onClick={() => updateStatus(item.id, "종료")} className="flex-1 rounded-md border border-border px-3 py-2 text-xs font-bold text-text-secondary hover:bg-surface-muted">문의 종료</button>}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
