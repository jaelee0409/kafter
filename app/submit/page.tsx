"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

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

export default function SubmitPage() {
    const [form, setForm] = useState(emptyForm)
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [errorMsg, setErrorMsg] = useState("")

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
            status: "pending",
        })

        if (error) {
            setStatus("error")
            setErrorMsg(error.message)
        } else {
            setStatus("success")
            setForm(emptyForm)
        }
    }

    if (status === "success") {
        return (
            <main className="min-h-screen bg-black text-white px-6 py-16">
                <div className="mx-auto max-w-lg text-center">
                    <p className="text-4xl mb-4">🎉</p>
                    <h1 className="text-xl font-semibold mb-3">이벤트가 제출되었습니다</h1>
                    <p className="text-zinc-500 text-sm mb-8">검토 후 승인되면 목록에 표시됩니다.</p>
                    <button
                        onClick={() => setStatus("idle")}
                        className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                    >
                        ← 다른 이벤트 제출하기
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white px-6 py-16">
            <div className="mx-auto max-w-lg">
                <h1 className="text-2xl font-semibold tracking-tight mb-2">이벤트 제출</h1>
                <p className="text-sm text-zinc-500 mb-10">검토 후 승인되면 목록에 표시됩니다.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">도시</label>
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
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">이벤트 이름</label>
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
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">날짜</label>
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
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">시작 시간</label>
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
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">지역</label>
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
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">클럽</label>
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
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">라인업</label>
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
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">장르</label>
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
                            <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">가격</label>
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
                        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">링크 (Instagram, 티켓 등)</label>
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
                        {status === "loading" ? "제출 중…" : "제출하기"}
                    </button>

                    {status === "error" && (
                        <p className="text-center text-sm text-red-400">{errorMsg}</p>
                    )}
                </form>
            </div>
        </main>
    )
}
