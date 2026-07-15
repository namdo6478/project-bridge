"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/listings", label: "매물 목록" },
];

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded bg-brand text-sm font-bold text-white">
            축
          </span>
          <div className="flex flex-col">
            <span className="text-base font-bold leading-tight text-brand sm:text-lg">
              축산기계장터
            </span>
            <span className="hidden text-xs text-text-secondary sm:block">
              전국 축산기계 중고·신품 거래
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-brand/10 text-brand"
                  : "text-text-secondary hover:bg-surface-muted hover:text-brand"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/listings"
            className="ml-2 rounded-md bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-hover"
          >
            매물 찾기
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-brand md:hidden"
          aria-expanded={menuOpen}
          aria-label="메뉴 열기"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            aria-hidden="true"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav className="border-t border-border bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                  isActive(link.href)
                    ? "bg-brand/10 text-brand"
                    : "text-text-secondary"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/listings"
              onClick={() => setMenuOpen(false)}
              className="mt-1 rounded-md bg-accent px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              매물 찾기
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
