import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kafter | 한국 클럽 DJ 라인업 & 파티 일정",
  description:
    "한국 클럽 DJ 라인업, 파티 일정, 테크노, 하우스, 힙합 등 다양한 장르 이벤트 정보를 한눈에.",
  openGraph: {
    title: "Kafter | 한국 클럽 DJ 라인업 & 파티 일정",
    description:
      "한국 클럽 DJ 라인업, 파티 일정, 테크노, 하우스, 힙합 등 다양한 장르 이벤트 정보를 한눈에.",
    url: "/",
  },
};

const cities = [
  { name: "서울", slug: "seoul" },
  { name: "부산", slug: "busan" },
  { name: "인천", slug: "incheon" },
  { name: "대구", slug: "daegu" },
  { name: "대전", slug: "daejeon" },
];

export default function Home() {
  return (
    <main className="relative">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-36 pb-28 text-center overflow-hidden">
        {/* Glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#e8195d]/8 blur-[100px]" />

        <p className="text-[11px] uppercase tracking-[0.35em] text-zinc-600 mb-8">
          한국 클럽 이벤트 인덱스
        </p>
        <h1 className="text-8xl font-black tracking-tighter text-white leading-none">
          KAFTER
        </h1>
        <p className="mt-6 text-sm text-zinc-500">
          DJ 라인업 &amp; 파티 일정
        </p>
      </section>

      {/* Cities */}
      <section className="mx-auto max-w-2xl px-6 pb-32">
        <div>
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="group flex items-center justify-between py-5 border-b border-zinc-900 hover:border-zinc-800 transition-all duration-200"
            >
              <span className="text-2xl font-medium text-zinc-400 group-hover:text-white transition-colors duration-200">
                {city.name}
              </span>
              <span className="text-zinc-700 group-hover:text-white transition-colors duration-200 text-base">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
