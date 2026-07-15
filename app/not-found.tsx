import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center">
      <p className="text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-xl font-bold text-text-primary">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="mt-2 text-sm text-text-secondary">
        요청하신 매물 또는 페이지가 존재하지 않습니다.
      </p>
      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-md border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-muted"
        >
          홈으로
        </Link>
        <Link
          href="/listings"
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          매물 목록
        </Link>
      </div>
    </div>
  );
}
