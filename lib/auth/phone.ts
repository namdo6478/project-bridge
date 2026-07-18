export function normalizeKoreanPhone(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.startsWith("82")) {
    return `+${digits}`;
  }

  if (digits.startsWith("0")) {
    return `+82${digits.slice(1)}`;
  }

  return `+${digits}`;
}

export function isSupportedPhone(value: string) {
  return /^\+82\d{9,10}$/.test(normalizeKoreanPhone(value));
}

export function formatKoreanPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value;
}
