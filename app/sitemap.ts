import type { MetadataRoute } from "next"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kafter.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: siteUrl,
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${siteUrl}/seoul`,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/busan`,
            changeFrequency: "daily",
            priority: 0.9,
        },
        {
            url: `${siteUrl}/daegu`,
            changeFrequency: "daily",
            priority: 0.9,
        },
    ]
}
