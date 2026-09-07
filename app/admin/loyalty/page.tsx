import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { LoyaltyTable, type ReminderEntry } from "@/components/admin/loyalty/loyalty-table";
import { loyaltyFreeWashesAvailable, loyaltyPunchesUntilFree } from "@/lib/calc";

export default async function LoyaltyPage() {
  const session = await requirePermission("loyalty.view");

  const [cards, clientsWithoutCard] = await Promise.all([
    prisma.loyaltyCard.findMany({
      orderBy: { lastPunchAt: "desc" },
      include: {
        client: { select: { id: true, name: true, phone: true } },
        punches: { orderBy: { visitDate: "asc" } },
      },
    }),
    prisma.client.findMany({ where: { loyaltyCard: null }, orderBy: { name: "asc" }, select: { id: true, name: true, phone: true } }),
  ]);

  const reminders: ReminderEntry[] = [];
  for (const card of cards) {
    const available = loyaltyFreeWashesAvailable(card);
    if (available > 0) {
      reminders.push({ clientName: card.client.name, phone: card.client.phone, reason: `${available} free wash unused` });
      continue;
    }
    const until = loyaltyPunchesUntilFree(card);
    if (until === 1) {
      reminders.push({ clientName: card.client.name, phone: card.client.phone, reason: "1 punch from free wash" });
    }
  }

  return (
    <LoyaltyTable
      cards={cards.map((c) => ({
        ...c,
        punches: c.punches.map((p) => ({ ...p, visitDate: p.visitDate.toISOString() })),
      }))}
      clientsWithoutCard={clientsWithoutCard}
      reminders={reminders}
      canManage={session.user.permissions.includes("loyalty.manage")}
    />
  );
}
