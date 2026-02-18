"use client"

import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
    const [input, setInput] = useState("")
    const [error, setError] = useState(false)

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (input === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
            onUnlock()
        } else {
            setError(true)
            setInput("")
        }
    }

    return (
        <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
            <form onSubmit={handleSubmit} className="w-full max-w-xs space-y-4">
                <h1 className="text-sm uppercase tracking-widest text-zinc-500 text-center mb-8">Admin</h1>
                <input
                    type="password"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError(false) }}
                    placeholder="Password"
                    autoFocus
                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
                {error && <p className="text-xs text-red-400 text-center">Incorrect password</p>}
                <button
                    type="submit"
                    className="w-full py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition"
                >
                    Enter
                </button>
            </form>
        </main>
    )
}

const cities = [
    { label: "서울", value: "seoul" },
    { label: "부산", value: "busan" },
    { label: "인천", value: "incheon" },
    { label: "대구", value: "daegu" },
    { label: "대전", value: "daejeon" },
]

const emptyForm = {
    city: "seoul",
    name: "",
    date: "",
    start_time: "",
    neighborhood: "",
    club: "",
    lineup: "",
    genre: "",
    price: "",
    url: "",
}

type PendingEvent = {
    id: number
    city: string
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

export default function AdminPage() {
    const [unlocked, setUnlocked] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [errorMsg, setErrorMsg] = useState("")

    if (!unlocked) return <PasswordGate onUnlock={() => setUnlocked(true)} />

    const [pending, setPending] = useState<PendingEvent[]>([])
    const [loadingPending, setLoadingPending] = useState(true)
    const [actionId, setActionId] = useState<number | null>(null)

    const fetchPending = useCallback(async () => {
        setLoadingPending(true)
        const { data } = await supabase
            .from("events")
            .select("*")
            .eq("status", "pending")
            .order("created_at", { ascending: true })
        setPending(data ?? [])
        setLoadingPending(false)
    }, [])

    useEffect(() => {
        fetchPending()
    }, [fetchPending])

    async function approve(id: number) {
        setActionId(id)
        await supabase.from("events").update({ status: "approved" }).eq("id", id)
        setPending((prev) => prev.filter((e) => e.id !== id))
        setActionId(null)
    }

    async function reject(id: number) {
        setActionId(id)
        await supabase.from("events").delete().eq("id", id)
        setPending((prev) => prev.filter((e) => e.id !== id))
        setActionId(null)
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setStatus("loading")
        setErrorMsg("")

        const { error } = await supabase.from("events").insert({
            city: form.city,
            name: form.name || null,
            date: form.date,
            start_time: form.start_time || null,
            neighborhood: form.neighborhood || null,
            club: form.club,
            lineup: form.lineup || null,
            genre: form.genre || null,
            price: form.price || null,
            url: form.url || null,
            status: "approved",
        })

        if (error) {
            setStatus("error")
            setErrorMsg(error.message)
        } else {
            setStatus("success")
            setForm(emptyForm)
        }
    }

    return (
        <main className="min-h-screen bg-black text-white px-6 py-16">
            <div className="mx-auto max-w-lg space-y-16">

                {/* Moderation */}
                <section>
                    <h2 className="text-lg font-semibold tracking-tight mb-6">
                        Pending Review
                        {pending.length > 0 && (
                            <span className="ml-2 text-xs font-normal px-2 py-0.5 rounded-full bg-[#e8195d]/20 text-[#e8195d]">
                                {pending.length}
                            </span>
                        )}
                    </h2>

                    {loadingPending ? (
                        <p className="text-zinc-600 text-sm">Loading…</p>
                    ) : pending.length === 0 ? (
                        <p className="text-zinc-600 text-sm">No pending submissions.</p>
                    ) : (
                        <div className="space-y-4">
                            {pending.map((e) => (
                                <div key={e.id} className="border border-zinc-800 rounded p-4 space-y-1">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-sm">{e.name || e.club}</p>
                                            <p className="text-xs text-zinc-500 mt-0.5">
                                                {e.date} · {[e.neighborhood, e.club].filter(Boolean).join(" · ")} · {cities.find(c => c.value === e.city)?.label}
                                            </p>
                                            {e.lineup && <p className="text-xs text-zinc-400 mt-1">{e.lineup}</p>}
                                            {e.url && (
                                                <a
                                                    href={e.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors mt-1 inline-block"
                                                >
                                                    {e.url}
                                                </a>
                                            )}
                                        </div>
                                        <div className="flex gap-2 shrink-0">
                                            <button
                                                onClick={() => approve(e.id)}
                                                disabled={actionId === e.id}
                                                className="px-3 py-1 text-xs rounded border border-green-800 text-green-400 hover:bg-green-900/30 transition disabled:opacity-50"
                                            >
                                                승인
                                            </button>
                                            <button
                                                onClick={() => reject(e.id)}
                                                disabled={actionId === e.id}
                                                className="px-3 py-1 text-xs rounded border border-zinc-700 text-zinc-500 hover:border-red-800 hover:text-red-400 transition disabled:opacity-50"
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Add Event */}
                <section>
                    <h2 className="text-lg font-semibold tracking-tight mb-6">Add Event</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">City</label>
                            <select
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white focus:outline-none focus:border-zinc-500"
                            >
                                {cities.map((c) => (
                                    <option key={c.value} value={c.value}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Event Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="e.g. Faust presents: Ben Klock"
                                required
                                className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    value={form.date}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white focus:outline-none focus:border-zinc-500 scheme-dark"
                                />
                            </div>
                            <div className="w-36">
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Start Time</label>
                                <input
                                    type="text"
                                    name="start_time"
                                    value={form.start_time}
                                    onChange={handleChange}
                                    placeholder="e.g. 23:00"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Neighborhood</label>
                                <input
                                    type="text"
                                    name="neighborhood"
                                    value={form.neighborhood}
                                    onChange={handleChange}
                                    placeholder="e.g. 홍대"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Club</label>
                                <input
                                    type="text"
                                    name="club"
                                    value={form.club}
                                    onChange={handleChange}
                                    placeholder="e.g. Faust"
                                    required
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Lineup</label>
                            <textarea
                                name="lineup"
                                value={form.lineup}
                                onChange={handleChange}
                                placeholder="e.g. Ben Klock · DJ Nobu · Local Support"
                                rows={3}
                                className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500 resize-none"
                            />
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Genre</label>
                                <input
                                    type="text"
                                    name="genre"
                                    value={form.genre}
                                    onChange={handleChange}
                                    placeholder="e.g. techno, hard techno"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                            <div className="w-36">
                                <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Price</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={form.price}
                                    onChange={handleChange}
                                    placeholder="e.g. 20,000원"
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">Link (Instagram, ticket, etc.)</label>
                            <input
                                type="url"
                                name="url"
                                value={form.url}
                                onChange={handleChange}
                                placeholder="https://instagram.com/p/..."
                                className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === "loading"}
                            className="w-full py-3 bg-white text-black font-medium rounded hover:bg-gray-200 transition disabled:opacity-50"
                        >
                            {status === "loading" ? "Adding…" : "Add Event"}
                        </button>

                        {status === "success" && (
                            <p className="text-center text-sm text-green-400">Event added.</p>
                        )}
                        {status === "error" && (
                            <p className="text-center text-sm text-red-400">{errorMsg}</p>
                        )}
                    </form>
                </section>

            </div>
        </main>
    )
}
