import Link from "next/link";
import { ChevronRight } from "lucide-react";

/** Blue page banner with breadcrumb and the page's single <h1>. */
export default function PageHeader({
  title,
  subtitle,
  crumbs,
  image,
}: {
  title: string;
  subtitle?: string;
  crumbs: { name: string; href?: string }[];
  image?: string;
}) {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 px-4 py-14 text-white sm:py-20">
      {image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt="" aria-hidden="true" className="absolute inset-0 h-full w-full object-cover opacity-20" />
      )}
      <div className="relative mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1 text-sm text-sky-200">
          {crumbs.map((c, i) => (
            <span key={c.name} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="size-3.5" />}
              {c.href ? (
                <Link href={c.href} className="hover:text-white">
                  {c.name}
                </Link>
              ) : (
                <span className="text-white">{c.name}</span>
              )}
            </span>
          ))}
        </nav>
        <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base text-sky-100 sm:text-lg">{subtitle}</p>}
      </div>
    </header>
  );
}
