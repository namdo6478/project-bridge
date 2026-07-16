"use client";

import { useState } from "react";

export function FavoriteButton() {
  const [saved, setSaved] = useState(false);

  return (
    <div className="mt-4">
      <button
        type="button"
        aria-pressed={saved}
        onClick={() => setSaved((current) => !current)}
        className={`w-full rounded-md border px-4 py-2.5 text-sm font-bold transition ${saved ? "border-brand bg-brand text-white" : "border-brand/25 bg-white text-brand hover:bg-brand/5"}`}
      >
        {saved ? "관심 매물에 저장됨" : "관심 매물로 저장"}
      </button>
      <p role="status" className="mt-1.5 text-center text-xs text-text-muted">{saved ? "관심 매물 화면에서 다시 비교할 수 있습니다. 공개 예시는 새로고침하면 초기화됩니다." : "저장한 매물은 관심 매물 화면에서 다시 비교할 수 있습니다."}</p>
    </div>
  );
}
