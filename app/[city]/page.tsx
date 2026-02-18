import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import EventList from "./EventList";

const cities: Record<string, string> = {
  seoul: "서울",
  busan: "부산",
  incheon: "인천",
  daegu: "대구",
  daejeon: "대전",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const cityName = cities[city];
  if (!cityName) return {};
  return {
    title: `${cityName} 클럽 이벤트`,
    description: `${cityName} 클럽 DJ 라인업과 파티 일정. 테크노, 하우스, 힙합 등 다양한 장르 이벤트 정보 제공.`,
    openGraph: {
      title: `${cityName} 클럽 이벤트 | Kafter`,
      description: `${cityName} 클럽 DJ 라인업과 파티 일정. 테크노, 하우스, 힙합 등 다양한 장르 이벤트 정보 제공.`,
      url: `/${city}`,
    },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const cityName = cities[city];

  if (!cityName) return notFound();

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  // Fetch from yesterday too — overnight events from yesterday may still be running
  const yesterdayDate = new Date(now);
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = yesterdayDate.toISOString().split("T")[0];

  const { data: raw } = await supabase
    .from("events")
    .select("*")
    .eq("city", city)
    .eq("status", "approved")
    .gte("date", yesterday)
    .order("date", { ascending: true });

  function parseHHMM(s: string): number {
    const m = s.trim().match(/^(\d{1,2}):(\d{2})$/);
    return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : NaN;
  }

  const events = (raw ?? []).filter((e) => {
    // Future events always shown
    if (e.date > today) return true;
    // No time info: show today's, hide yesterday's
    if (!e.start_time) return e.date === today;

    const parts = e.start_time.split("~").map((p: string) => p.trim());
    const start = parseHHMM(parts[0]);
    if (isNaN(start)) return e.date === today;

    // END is assumed to be 08:00
    const endRaw = parts[1];
    const end = !endRaw || endRaw === "END" ? 8 * 60 : parseHHMM(endRaw);
    const isOvernight = !isNaN(end) && end < start;

    if (e.date === today) {
      // Overnight events (e.g. 22:00 ~ 07:00) end the next morning —
      // always show on the event's own date (it starts tonight or is ongoing)
      if (isOvernight) return true;
      // Regular event: hide once end time has passed
      return currentMinutes <= (isNaN(end) ? start : end);
    }

    if (e.date === yesterday) {
      // Only keep yesterday's overnight events that haven't ended yet this morning
      return isOvernight && !isNaN(end) && currentMinutes < end;
    }

    return false;
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": events.map((e) => {
      const startTime = e.start_time?.split("~")[0].trim();
      const startDate = startTime ? `${e.date}T${startTime}:00+09:00` : e.date;

      const performers = e.lineup
        ? e.lineup.split(/[,·]/).map((name: string) => ({
            "@type": "Person",
            name: name.trim(),
          }))
        : undefined;

      return {
        "@type": "Event",
        name: e.name || e.club,
        startDate,
        location: {
          "@type": "Place",
          name: [e.neighborhood, e.club].filter(Boolean).join(" · "),
          address: {
            "@type": "PostalAddress",
            addressLocality: cityName,
            addressCountry: "KR",
          },
        },
        ...(performers && { performer: performers }),
        ...(e.price && {
          offers: {
            "@type": "Offer",
            price: e.price,
            priceCurrency: "KRW",
          },
        }),
        ...(e.url && { url: e.url }),
      };
    }),
  };

  return (
    <main className="relative px-6 py-24 overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Glow */}
      <div className="pointer-events-none absolute left-0 top-0 w-100 h-100 rounded-full bg-[#e8195d]/6 blur-[120px] -translate-x-1/2 -translate-y-1/4" />

      <div className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="text-xs text-zinc-600 hover:text-[#e8195d] transition-colors"
        >
          ← 홈
        </Link>
        <h1 className="mt-6 text-5xl font-black tracking-tighter text-white">
          {cityName}
        </h1>
        <p className="mt-3 text-sm text-zinc-500">
          {cityName} 클럽 DJ 라인업 & 파티 일정
        </p>
      </div>

      <EventList events={events} />
    </main>
  );
}
