const DAY_IN_MS = 24 * 60 * 60 * 1000;

export type ListingFreshnessState = "fresh" | "normal" | "check" | "hidden";

export interface ListingFreshness {
  ageDays: number;
  label: string;
  detail: string;
  state: ListingFreshnessState;
}

function parseDate(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

export function getListingFreshness(
  confirmedAt: string,
  referenceDate = new Date(),
): ListingFreshness {
  const today = Date.UTC(
    referenceDate.getUTCFullYear(),
    referenceDate.getUTCMonth(),
    referenceDate.getUTCDate(),
  );
  const ageDays = Math.max(0, Math.floor((today - parseDate(confirmedAt)) / DAY_IN_MS));

  if (ageDays <= 7) {
    return {
      ageDays,
      label: "최근 판매 확인",
      detail: ageDays === 0 ? "오늘 판매자가 판매 여부를 확인했습니다." : `${ageDays}일 전 판매자가 판매 여부를 확인했습니다.`,
      state: "fresh",
    };
  }

  if (ageDays <= 30) {
    return {
      ageDays,
      label: `${ageDays}일 전 확인`,
      detail: "판매자가 최근 30일 안에 판매 여부를 확인했습니다.",
      state: "normal",
    };
  }

  if (ageDays <= 60) {
    return {
      ageDays,
      label: "판매 여부 확인 필요",
      detail: "최근 확인 후 30일이 지나 판매자에게 상태 갱신이 필요합니다.",
      state: "check",
    };
  }

  return {
    ageDays,
    label: "검색 일시 숨김",
    detail: "60일 넘게 확인되지 않아 검색에서 숨김 처리되는 매물입니다.",
    state: "hidden",
  };
}

export function toLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
