// app/sitemap.ts  →  https://drycleaners.co.ke/sitemap.xml
import type { MetadataRoute } from "next";
import { SITE, SERVICES } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: `${SITE.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    page("/", 1, "weekly"),
    page("/services/", 0.9),
    ...SERVICES.map((s) => page(`/services/${s.slug}/`, 0.8)),
    page("/pricing/", 0.9, "weekly"),
    page("/location/", 0.7),
    page("/contact/", 0.7),
    page("/about/", 0.6),
    page("/referrals/", 0.4),
  ];
}
