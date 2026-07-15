import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Header } from "@/components/layout/Header";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "축산기계장터 | 전국 축산기계 중고·신품 거래",
    template: "%s | 축산기계장터",
  },
  description:
    "전국 축산기계 중고·신품 거래 플랫폼. 사각압축포장기, 사료배합기, 컨베이어, 베일집게 등 축산기계 매물을 검색하고 거래하세요.",
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
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border bg-surface-muted">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-brand">축산기계장터</p>
                <p className="mt-1 text-xs text-text-secondary">
                  전국 축산기계 중고·신품 거래 플랫폼
                </p>
              </div>
              <p className="text-xs text-text-muted">
                © 2026 축산기계장터. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
