"use client";

import { useState } from "react";

export function ShareListingButton({ title }: { title: string }) {
  const [notice, setNotice] = useState("");

  const share = async () => {
    const shareData = { title, text: `축산기계장터에서 확인해 보세요: ${title}`, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setNotice("공유 화면을 열었습니다.");
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setNotice("매물 링크를 복사했습니다.");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setNotice("주소창의 링크를 복사해 전달해 주세요.");
    }
  };

  return (
    <div className="mt-2">
      <button type="button" onClick={share} className="w-full rounded-md border border-border bg-white px-4 py-2.5 text-sm font-bold text-text-secondary hover:border-brand/25 hover:text-brand">매물 링크 공유</button>
      {notice && <p role="status" className="mt-1.5 text-center text-xs text-text-muted">{notice}</p>}
    </div>
  );
}
