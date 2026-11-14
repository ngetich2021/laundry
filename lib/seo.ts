// lib/seo.ts
import type { Metadata } from "next";
import { SITE } from "@/lib/site";

/**
 * Builds the SEO tags for one page: title, description, canonical URL and the
 * share image shown when the link is pasted into WhatsApp, Facebook or X.
 * `path` must end with "/" (the site is exported with trailing slashes).
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  image: string;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_KE",
      siteName: SITE.name,
      url: path,
      title: fullTitle,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [image],
    },
  };
}
