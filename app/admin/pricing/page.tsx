import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { PricingTable } from "@/components/admin/pricing/pricing-table";

export default async function PricingPage() {
  await requirePermission("pricing.view");

  const categories = await prisma.serviceCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { items: { orderBy: { sortOrder: "asc" } } },
  });

  return <PricingTable categories={categories} />;
}
