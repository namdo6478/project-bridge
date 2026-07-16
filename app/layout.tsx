import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "축산기계장터 | 전국 축산기계 중고·신품 거래",
    template: "%s | 축산기계장터",
  },
  description:
    "조사료 장비, 사료 장비, 축사시설과 부품까지 전국 축산기계 중고·신품 매물을 검색하고 거래하세요.",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "축산기계장터",
    title: "축산기계장터 | 전국 축산기계 중고·신품 거래",
    description: "조사료 장비부터 축사 설비와 부품까지 전국 축산기계 매물을 찾고 등록하세요.",
  },
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white text-text-primary">
        <Header />
        <main className="flex-1 pb-[68px] lg:pb-0">{children}</main>
        <footer className="border-t border-border bg-surface-muted">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-brand">축산기계장터</p>
                <p className="mt-1 text-xs text-text-secondary">
                  전국 축산기계 중고·신품 거래 플랫폼
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-text-muted">
                <a href="/guide" className="hover:text-brand">이용 안내</a>
                <a href="/safety" className="hover:text-brand">안전거래</a>
                <a href="/inquiries" className="hover:text-brand">문의 내역</a>
                <a href="/account" className="hover:text-brand">내 정보</a>
                <a href="/admin" className="hover:text-brand">운영 화면 예시</a>
                <a href="/roadmap" className="hover:text-brand">개발 현황</a>
                <span>© 2026 축산기계장터</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
