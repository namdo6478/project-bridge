export function formatPrice(price: number | null, priceNegotiable: boolean): string {
  if (priceNegotiable || price === null) {
    return "가격협의";
  }

  if (price >= 100_000_000) {
    const eok = price / 100_000_000;
    const remainder = price % 100_000_000;
    if (remainder === 0) {
      return `${eok}억원`;
    }
    const man = Math.round(remainder / 10_000);
    return `${eok}억 ${man.toLocaleString("ko-KR")}만원`;
  }

  if (price >= 10_000) {
    const man = price / 10_000;
    if (price % 10_000 === 0) {
      return `${man.toLocaleString("ko-KR")}만원`;
    }
    return `${price.toLocaleString("ko-KR")}원`;
  }

  return `${price.toLocaleString("ko-KR")}원`;
}

export function formatDate(date: string): string {
  const [year, month, day] = date.split("-");
  return `${year}년 ${Number(month)}월 ${Number(day)}일`;
}
