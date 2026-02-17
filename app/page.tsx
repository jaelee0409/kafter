import Link from "next/link";

const cities = [
  { name: "서울", slug: "seoul" },
  { name: "부산", slug: "busan" },
  { name: "대구", slug: "daegu" },
];

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className="px-6 py-16 text-center">
        <h1 className="text-5xl font-semibold tracking-tight">Kafter</h1>
        <p className="mt-6 text-gray-500">한국 클럽 DJ 라인업 & 파티 일정</p>
      </section>

      {/* Cities */}
      <section className="mx-auto max-w-3xl px-6 py-8">
        <div className="space-y-6">
          {cities.map((city) => (
            <Link
              key={city.slug}
              href={`/${city.slug}`}
              className="flex justify-between border-b border-zinc-800 py-4 text-lg transition hover:text-gray-300"
            >
              <span>{city.name}</span>
              <span className="text-gray-600">→</span>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
