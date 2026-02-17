import { notFound } from "next/navigation"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import EventList from "./EventList"

const cities: Record<string, string> = {
    seoul: "서울",
    busan: "부산",
    daegu: "대구",
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
        <main className="px-6 py-24">
            <div className="mx-auto max-w-4xl">
                <Link href="/" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
                    ← 홈
                </Link>
                <h1 className="mt-6 text-4xl font-semibold tracking-tight">
                    {cityName}
                </h1>
                <p className="mt-4 text-gray-500">
                    {cityName} 클럽 DJ 라인업 & 파티 일정
                </p>
            </div>

            <EventList events={events ?? []} />
        </main>
    )
}
