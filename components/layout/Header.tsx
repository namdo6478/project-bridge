"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/listings", label: "매물 목록" },
];

function BrandMark() {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white shadow-sm" aria-hidden="true">
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none">
        <path d="M5.5 14.5 16 6l10.5 8.5v10.2a1.8 1.8 0 0 1-1.8 1.8H7.3a1.8 1.8 0 0 1-1.8-1.8V14.5Z" fill="currentColor" opacity=".2" />
        <path d="m4.5 15.2 11.5-9 11.5 9M8 13.5v12h16v-12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="21" r="3" stroke="currentColor" strokeWidth="2" />
        <circle cx="21.5" cy="21.5" r="2.5" stroke="currentColor" strokeWidth="2" />
        <path d="M12 18h6l2 1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5" onClick={() => setMenuOpen(false)}>
            <BrandMark />
            <div className="flex flex-col">
              <span className="text-base font-bold leading-tight tracking-tight text-brand sm:text-lg">축산기계장터</span>
              <span className="hidden text-[11px] text-text-secondary sm:block">전국 축산기계 중고·신품 거래</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-brand/10 text-brand"
                    : "text-text-secondary hover:bg-surface-muted hover:text-brand"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/listings" className="ml-3 rounded-md border border-brand/25 px-4 py-2 text-sm font-semibold text-brand transition hover:bg-brand/5">
              매물 찾기
            </Link>
            <Link href="/sell" className="ml-1 rounded-md bg-accent px-4 py-2 text-sm font-bold text-white transition hover:bg-accent-hover">
              장비 팔기
            </Link>
          </nav>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-brand md:hidden"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-border bg-white px-4 py-3 md:hidden" aria-label="모바일 메뉴">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium ${isActive(link.href) ? "bg-brand/10 text-brand" : "text-text-secondary"}`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/sell" onClick={() => setMenuOpen(false)} className="mt-1 rounded-md bg-accent px-3 py-2.5 text-center text-sm font-bold text-white">
                장비 팔기
              </Link>
            </div>
          </nav>
        )}
      </header>

      <nav className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-2 gap-2 border-t border-border bg-white p-2 shadow-[0_-6px_20px_rgba(17,24,39,0.08)] md:hidden" aria-label="빠른 메뉴">
        <Link href="/listings" className="rounded-lg border border-brand/20 px-3 py-3 text-center text-sm font-bold text-brand">매물 찾기</Link>
        <Link href="/sell" className="rounded-lg bg-accent px-3 py-3 text-center text-sm font-bold text-white">장비 팔기</Link>
      </nav>
    </>
  );
}
