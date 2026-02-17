import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"

const cities: Record<string, string> = {
    seoul: "서울",
    busan: "부산",
    daegu: "대구",
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

export default async function CityPage({
    params,
}: {
    params: Promise<{ city: string }>
}) {
    const { city } = await params
    const cityName = cities[city]

    if (!cityName) return notFound()

    const today = new Date().toISOString().split("T")[0]

    const { data: events } = await supabase
        .from("events")
        .select("*")
        .eq("city", city)
        .gte("date", today)
        .order("date", { ascending: true })

    return (
        <main className="min-h-screen bg-black text-white px-6 py-24">
            {/* City Title */}
            <div className="mx-auto max-w-4xl">
                <h1 className="text-4xl font-semibold tracking-tight">
                    {cityName}
                </h1>
                <p className="mt-4 text-gray-500">
                    {cityName} 클럽 DJ 라인업 & 파티 일정
                </p>
            </div>

            {/* Event List */}
            <div className="mx-auto mt-20 max-w-4xl">
                {events && events.length > 0 ? (
                    <div className="space-y-10">
                        {events.map((event) => (
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
                    <p className="text-gray-600 text-sm">등록된 이벤트가 없습니다.</p>
                )}
            </div>
        </main>
    )
}
