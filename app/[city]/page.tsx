import { notFound } from "next/navigation"
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
        <main className="min-h-screen bg-black text-white px-6 py-24">
            <div className="mx-auto max-w-4xl">
                <h1 className="text-4xl font-semibold tracking-tight">
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
