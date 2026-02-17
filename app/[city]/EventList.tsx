"use client"

import { useState } from "react"

type Event = {
    id: number
    name: string | null
    date: string
    start_time: string | null
    neighborhood: string | null
    club: string
    lineup: string | null
    genre: string | null
    price: string | null
    url: string | null
}

function formatDateHeader(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00")
    const days = ["일", "월", "화", "수", "목", "금", "토"]
    const month = d.getMonth() + 1
    const day = d.getDate()
    const dow = days[d.getDay()]
    return `${month}월 ${day}일 (${dow})`
}

export default function EventList({ events }: { events: Event[] }) {
    const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null)
    const [selectedGenres, setSelectedGenres] = useState<string[]>([])

    const neighborhoods = Array.from(
        new Set(events.map((e) => e.neighborhood).filter(Boolean))
    ) as string[]

    const genres = Array.from(
        new Set(
            events.flatMap((e) =>
                e.genre ? e.genre.split(",").map((g) => g.trim()).filter(Boolean) : []
            )
        )
    )

    const filtered = events.filter((e) => {
        if (selectedNeighborhood && e.neighborhood !== selectedNeighborhood) return false
        if (selectedGenres.length > 0) {
            const eventGenres = e.genre ? e.genre.split(",").map((g) => g.trim()) : []
            if (!selectedGenres.some((g) => eventGenres.includes(g))) return false
        }
        return true
    })

    // Group by date
    const grouped = filtered.reduce<Record<string, Event[]>>((acc, event) => {
        if (!acc[event.date]) acc[event.date] = []
        acc[event.date].push(event)
        return acc
    }, {})
    const sortedDates = Object.keys(grouped).sort()

    return (
        <div className="mx-auto mt-12 max-w-4xl">
            {/* Filters */}
            {(neighborhoods.length > 0 || genres.length > 0) && (
                <div className="space-y-3 mb-12">
                    {neighborhoods.length > 0 && (
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs uppercase tracking-wider text-zinc-500 w-8 shrink-0">지역</span>
                            <button
                                onClick={() => setSelectedNeighborhood(null)}
                                className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
                                    selectedNeighborhood === null
                                        ? "border-white text-white"
                                        : "border-zinc-700 text-zinc-500 hover:border-zinc-400 hover:text-zinc-300"
                                }`}
                            >
                                전체
                            </button>
                            {neighborhoods.map((n) => (
                                <button
                                    key={n}
                                    onClick={() => setSelectedNeighborhood(selectedNeighborhood === n ? null : n)}
                                    className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
                                        selectedNeighborhood === n
                                            ? "border-white text-white"
                                            : "border-zinc-700 text-zinc-500 hover:border-zinc-400 hover:text-zinc-300"
                                    }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    )}
                    {genres.length > 0 && (
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs uppercase tracking-wider text-zinc-500 w-8 shrink-0">장르</span>
                            <button
                                onClick={() => setSelectedGenres([])}
                                className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
                                    selectedGenres.length === 0
                                        ? "border-white text-white"
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
                                            prev.includes(g) ? prev.filter((s) => s !== g) : [...prev, g]
                                        )
                                    }
                                    className={`px-4 py-1.5 text-xs rounded-full border transition-colors ${
                                        selectedGenres.includes(g)
                                            ? "border-white text-white"
                                            : "border-zinc-700 text-zinc-500 hover:border-zinc-400 hover:text-zinc-300"
                                    }`}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Events grouped by date */}
            {sortedDates.length > 0 ? (
                <div className="space-y-14">
                    {sortedDates.map((date) => (
                        <div key={date}>
                            {/* Date header */}
                            <div className="flex items-center gap-4 mb-6">
                                <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                                    {formatDateHeader(date)}
                                </span>
                                <div className="flex-1 h-px bg-zinc-800" />
                            </div>

                            {/* Events under this date */}
                            <div className="space-y-8">
                                {grouped[date].map((event) => (
                                    <div key={event.id} className="pl-4 border-l border-zinc-800">
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
                                            <span className="w-10 shrink-0 text-xs uppercase tracking-wider text-zinc-500 pt-px">클럽</span>
                                            <span className="text-zinc-400">
                                                {[event.neighborhood, event.club].filter(Boolean).join(" · ")}
                                            </span>
                                        </div>

                                        {/* Lineup */}
                                        {event.lineup && (
                                            <div className="mt-1.5 flex gap-3 text-sm">
                                                <span className="w-10 shrink-0 text-xs uppercase tracking-wider text-zinc-500 pt-px">라인업</span>
                                                <span className="text-zinc-300">{event.lineup}</span>
                                            </div>
                                        )}

                                        {/* Genre */}
                                        {event.genre && (
                                            <div className="mt-1.5 flex gap-3 text-sm">
                                                <span className="w-10 shrink-0 text-xs uppercase tracking-wider text-zinc-500 pt-px">장르</span>
                                                <span className="text-sm text-zinc-400 uppercase tracking-wider pt-px">{event.genre}</span>
                                            </div>
                                        )}

                                        {/* Price */}
                                        {event.price && (
                                            <div className="mt-1.5 flex gap-3 text-sm">
                                                <span className="w-10 shrink-0 text-xs uppercase tracking-wider text-zinc-500 pt-px">가격</span>
                                                <span className="text-sm text-zinc-400 pt-px">{event.price}</span>
                                            </div>
                                        )}

                                        {/* Link */}
                                        {event.url && (
                                            <a
                                                href={event.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 inline-block text-sm text-zinc-400 hover:text-white transition-colors"
                                            >
                                                이벤트 보기 →
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-zinc-500 text-sm">해당 지역 이벤트가 없습니다.</p>
            )}
        </div>
    )
}
