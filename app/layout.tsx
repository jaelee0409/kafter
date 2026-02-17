import type { Metadata } from "next"

import "./globals.css"

export const metadata: Metadata = {
    title: "KAfter | 한국 클럽 DJ 라인업 & 파티 일정",
    description:
        "한국 클럽 DJ 라인업, 파티 일정, 테크노·하우스 이벤트 정보를 모아보는 클럽 인덱스. 서울·부산 등 전국 클럽 정보 제공.",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="ko">
            <body suppressHydrationWarning className="min-h-screen bg-black text-white flex flex-col">
                <div className="flex-1">{children}</div>
                <footer className="border-t border-zinc-900 px-6 py-10 text-center text-xs text-gray-600">
                    © {new Date().getFullYear()} KAfter
                </footer>
            </body>
        </html>
    )
}