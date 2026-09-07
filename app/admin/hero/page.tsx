import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { HeroTable } from "@/components/admin/hero/hero-table";

export default async function HeroPage() {
  const session = await requirePermission("hero.view");

  const slides = await prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } });

  return <HeroTable slides={slides} canManage={session.user.permissions.includes("hero.manage")} />;
}
