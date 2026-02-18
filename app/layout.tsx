import type { Metadata } from "next";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kafter-beta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Kafter | 한국 클럽 DJ 라인업 & 파티 일정",
    template: "%s | Kafter",
  },
  description:
    "한국 클럽 DJ 라인업, 파티 일정, 테크노, 하우스, 힙합 등 다양한 장르 이벤트 정보를 모아보는 클럽 인덱스. 전국 클럽 정보 제공.",
  openGraph: {
    siteName: "Kafter",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
  other: {
    "google-adsense-account": "ca-pub-2053557989020507",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body
        suppressHydrationWarning
        className="min-h-screen bg-black text-white flex flex-col"
      >
        <div className="flex-1">{children}</div>
        <footer className="border-t border-zinc-900 px-6 py-10 text-center text-xs text-gray-600">
          © {new Date().getFullYear()} KAfter
        </footer>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2053557989020507"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        <Analytics />
      </body>
    </html>
  );
}
