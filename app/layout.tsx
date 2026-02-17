import type { Metadata } from "next";

import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://kafter-beta.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "KAfter | 한국 클럽 DJ 라인업 & 파티 일정",
    template: "%s | KAfter",
  },
  description:
    "한국 클럽 DJ 라인업, 파티 일정, 테크노·하우스 이벤트 정보를 모아보는 클럽 인덱스. 서울·부산·대구 클럽 정보 제공.",
  openGraph: {
    siteName: "KAfter",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary",
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
      </body>
    </html>
  );
}
