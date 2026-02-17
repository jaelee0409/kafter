"use client"

import { useState } from "react"

type Event = {
    id: number
    date: string
    start_time: string | null
    neighborhood: string | null
    club: string
    lineup: string | null
    genre: string | null
    price: string | null
    url: string | null
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr + "T00:00:00")
    const days = ["일", "월", "화", "수", "목", "금", "토"]
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    const dow = days[d.getDay()]
    return `${year}.${month}.${day} (${dow})`
}

export default function EventList({ events }: { events: Event[] }) {
    const [selected, setSelected] = useState<string | null>(null)

    const neighborhoods = Array.from(
        new Set(events.map((e) => e.neighborhood).filter(Boolean))
    ) as string[]

    const filtered = selected
        ? events.filter((e) => e.neighborhood === selected)
        : events

    return (
        <div className="mx-auto mt-12 max-w-4xl">
            {/* Neighborhood filter */}
            {neighborhoods.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-12">
                    <button
                        onClick={() => setSelected(null)}
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                            selected === null
                                ? "border-white text-white"
                                : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                        }`}
                    >
                        전체
                    </button>
                    {neighborhoods.map((n) => (
                        <button
                            key={n}
                            onClick={() => setSelected(selected === n ? null : n)}
                            className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                                selected === n
                                    ? "border-white text-white"
                                    : "border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300"
                            }`}
                        >
                            {n}
                        </button>
                    ))}
                </div>
            )}

            {/* Events */}
            {filtered.length > 0 ? (
                <div className="space-y-10">
                    {filtered.map((event) => (
                        <div key={event.id} className="border-b border-zinc-800 pb-10">
                            <p className="text-sm text-gray-500">
                                {formatDate(event.date)}
                                {event.start_time && <span className="ml-2">{event.start_time}</span>}
                            </p>
                            <div className="mt-3 text-lg">
                                {event.neighborhood && (
                                    <span className="text-gray-400">{event.neighborhood}{" · "}</span>
                                )}
                                <span>{event.club}</span>
                            </div>
                            {event.lineup && (
                                <p className="mt-2 text-gray-300">{event.lineup}</p>
                            )}
                            {(event.genre || event.price) && (
                                <p className="mt-1 text-xs text-zinc-600 uppercase tracking-wider">
                                    {event.genre}
                                    {event.genre && event.price && " · "}
                                    {event.price}
                                </p>
                            )}
                            {event.url && (
                                <a
                                    href={event.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 inline-block text-xs text-zinc-500 hover:text-white transition-colors"
                                >
                                    이벤트 보기 →
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600 text-sm">해당 지역 이벤트가 없습니다.</p>
            )}
        </div>
    )
}
