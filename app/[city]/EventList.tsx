"use client";

import { useState, useEffect } from "react";

type Event = {
  id: number;
  name: string | null;
  date: string;
  start_time: string | null;
  neighborhood: string | null;
  club: string;
  lineup: string | null;
  genre: string | null;
  price: string | null;
  url: string | null;
};

function parseHHMM(s: string): number {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})$/);
  return m ? parseInt(m[1]) * 60 + parseInt(m[2]) : NaN;
}

function parseStartTime(time: string | null): number {
  if (!time) return Infinity;
  const start = parseHHMM(time.split("~")[0]);
  return isNaN(start) ? Infinity : start;
}

function formatDateHeader(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const dow = days[d.getDay()];
  return `${month}월 ${day}일 (${dow})`;
}

const PAGE_SIZE = 5;

export default function EventList({ events }: { events: Event[] }) {
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<
    string | null
  >(null);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [visibleDates, setVisibleDates] = useState(PAGE_SIZE);

  const neighborhoods = Array.from(
    new Set(events.map((e) => e.neighborhood).filter(Boolean)),
  ) as string[];

  const genres = Array.from(
    new Set(
      events.flatMap((e) =>
        e.genre
          ? e.genre
              .split(",")
              .map((g) => g.trim())
              .filter(Boolean)
          : [],
      ),
    ),
  );

  const filtered = events.filter((e) => {
    if (dateFrom && e.date < dateFrom) return false;
    if (dateTo && e.date > dateTo) return false;
    if (search) {
      const q = search.toLowerCase();
      const inLineup = e.lineup?.toLowerCase().includes(q) ?? false;
      const inClub = e.club.toLowerCase().includes(q);
      if (!inLineup && !inClub) return false;
    }
    if (selectedNeighborhood && e.neighborhood !== selectedNeighborhood)
      return false;
    if (selectedGenres.length > 0) {
      const eventGenres = e.genre
        ? e.genre.split(",").map((g) => g.trim())
        : [];
      if (!selectedGenres.some((g) => eventGenres.includes(g))) return false;
    }
    return true;
  });

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleDates(PAGE_SIZE);
  }, [dateFrom, dateTo, search, selectedNeighborhood, selectedGenres]);

  // Group by date
  const grouped = filtered.reduce<Record<string, Event[]>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {});
  const sortedDates = Object.keys(grouped).sort();
  for (const date of sortedDates) {
    grouped[date].sort(
      (a, b) => parseStartTime(a.start_time) - parseStartTime(b.start_time),
    );
  }
  const visibleDateList = sortedDates.slice(0, visibleDates);
  const hasMore = visibleDates < sortedDates.length;

  return (
    <div className="mx-auto mt-12 max-w-4xl">
      {/* Filters */}
      {(neighborhoods.length > 0 || genres.length > 0) && (
        <div className="space-y-3 mb-12">
          <div className="flex gap-3 items-center">
            <span className="text-xs uppercase tracking-wider text-zinc-500 shrink-0">
              검색
            </span>
            <div className="relative flex-1 max-w-xs">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="DJ, 아티스트 또는 클럽 이름"
                className="w-full bg-transparent border border-zinc-700 rounded px-3 py-1 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <span className="text-xs uppercase tracking-wider text-zinc-500 shrink-0">
              날짜
            </span>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="bg-transparent border border-zinc-700 rounded px-3 py-1 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 scheme-dark"
              />
              <span className="text-zinc-600 text-xs">–</span>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="bg-transparent border border-zinc-700 rounded px-3 py-1 text-xs text-zinc-300 focus:outline-none focus:border-zinc-500 scheme-dark"
              />
              {(dateFrom || dateTo) && (
                <button
                  onClick={() => {
                    setDateFrom("");
                    setDateTo("");
                  }}
                  className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors ml-1"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
          {neighborhoods.length > 0 && (
            <div className="flex gap-3">
              <span className="text-xs uppercase tracking-wider text-zinc-500 shrink-0 pt-1.5">
                지역
              </span>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedNeighborhood(null)}
                  className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
                    selectedNeighborhood === null
                      ? "border-[#e8195d] text-[#e8195d]"
                      : "border-zinc-700 text-zinc-500 hover:border-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  전체
                </button>
                {neighborhoods.map((n) => (
                  <button
                    key={n}
                    onClick={() =>
                      setSelectedNeighborhood(
                        selectedNeighborhood === n ? null : n,
                      )
                    }
                    className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
                      selectedNeighborhood === n
                        ? "border-[#e8195d] text-[#e8195d]"
                        : "border-zinc-700 text-zinc-500 hover:border-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}
          {genres.length > 0 && (
            <div className="flex gap-3">
              <span className="text-xs uppercase tracking-wider text-zinc-500 shrink-0 pt-1.5">
                장르
              </span>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setSelectedGenres([])}
                  className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
                    selectedGenres.length === 0
                      ? "border-[#e8195d] text-[#e8195d]"
                      : "border-zinc-700 text-zinc-500 hover:border-zinc-400 hover:text-zinc-300"
                  }`}
                >
                  전체
                </button>
                {genres.map((g) => (
                  <button
                    key={g}
                    onClick={() =>
                      setSelectedGenres((prev) =>
                        prev.includes(g)
                          ? prev.filter((s) => s !== g)
                          : [...prev, g],
                      )
                    }
                    className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
                      selectedGenres.includes(g)
                        ? "border-[#e8195d] text-[#e8195d]"
                        : "border-zinc-700 text-zinc-500 hover:border-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Events grouped by date */}
      {sortedDates.length > 0 ? (
        <div className="space-y-14">
          {visibleDateList.map((date) => (
            <div key={date}>
              {/* Date header */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-xs font-medium uppercase tracking-widest text-[#e8195d]/70">
                  {formatDateHeader(date)}
                </span>
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              {/* Events under this date */}
              <div className="space-y-8">
                {grouped[date].map((event) => (
                  <div key={event.id} className="group/card pl-4 border-l border-zinc-800 hover:border-[#e8195d]/40 transition-colors">
                    {/* Name + time */}
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-xl font-medium text-white">
                        {event.name || event.club}
                      </h3>
                      {event.start_time && (
                        <span className="text-sm text-zinc-500 shrink-0">
                          {event.start_time}
                        </span>
                      )}
                    </div>

                    {/* Venue */}
                    <div className="mt-2 flex gap-3 text-sm">
                      <span className="w-10 shrink-0 text-xs uppercase tracking-wider text-zinc-500 pt-px">
                        클럽
                      </span>
                      <span className="text-zinc-400">
                        {[event.neighborhood, event.club]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>

                    {/* Lineup */}
                    {event.lineup && (
                      <div className="mt-1.5 flex gap-3 text-sm">
                        <span className="w-10 shrink-0 text-xs uppercase tracking-wider text-zinc-500 pt-px">
                          라인업
                        </span>
                        <span className="text-zinc-300">{event.lineup}</span>
                      </div>
                    )}

                    {/* Genre */}
                    {event.genre && (
                      <div className="mt-1.5 flex gap-3 text-sm">
                        <span className="w-10 shrink-0 text-xs uppercase tracking-wider text-zinc-500 pt-px">
                          장르
                        </span>
                        <span className="text-sm text-zinc-400 uppercase tracking-wider pt-px">
                          {event.genre}
                        </span>
                      </div>
                    )}

                    {/* Price */}
                    {event.price && (
                      <div className="mt-1.5 flex gap-3 text-sm">
                        <span className="w-10 shrink-0 text-xs uppercase tracking-wider text-zinc-500 pt-px">
                          가격
                        </span>
                        <span className="text-sm text-zinc-400 pt-px">
                          {event.price}
                        </span>
                      </div>
                    )}

                    {/* Link */}
                    {event.url && (
                      <a
                        href={event.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-full border border-zinc-700 text-zinc-400 hover:border-[#e8195d]/60 hover:text-[#e8195d] transition-all"
                      >
                        이벤트 보기 →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {hasMore && (
            <button
              onClick={() => setVisibleDates((v) => v + PAGE_SIZE)}
              className="w-full py-3 text-sm text-[#e8195d]/60 border border-[#e8195d]/20 rounded hover:border-[#e8195d]/60 hover:text-[#e8195d] transition-colors"
            >
              더 보기
            </button>
          )}
        </div>
      ) : (
        <p className="text-zinc-500 text-sm">해당 지역 이벤트가 없습니다.</p>
      )}
    </div>
  );
}
