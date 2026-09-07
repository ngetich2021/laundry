"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { TargetProgress } from "@/components/admin/target-progress";
import { PunchPanel, type PunchRow } from "./punch-panel";
import { enrollClient } from "@/actions/loyalty";
import { loyaltyFreeWashesAvailable, loyaltyPunchesUntilFree } from "@/lib/calc";

export interface LoyaltyCardRow {
  id: string;
  punchesCount: number;
  freeWashThreshold: number;
  totalFreeWashesEarned: number;
  totalFreeWashesRedeemed: number;
  client: { id: string; name: string; phone: string };
  punches: PunchRow[];
}

export interface ReminderEntry {
  clientName: string;
  phone: string;
  reason: string;
}

export function LoyaltyTable({
  cards,
  clientsWithoutCard,
  reminders,
  canManage,
}: {
  cards: LoyaltyCardRow[];
  clientsWithoutCard: { id: string; name: string; phone: string }[];
  reminders: ReminderEntry[];
  canManage: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [enrollThreshold, setEnrollThreshold] = useState(6);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = cards.find((c) => c.id === selectedId) ?? null;

  function onEnroll(clientId: string) {
    startTransition(async () => {
      try {
        await enrollClient(clientId, enrollThreshold);
        toast.success("Client enrolled in loyalty program");
        router.refresh();
        setEnrollOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const columns: DataTableColumn<LoyaltyCardRow>[] = [
    { key: "client", header: "Client", render: (c) => <span className="font-medium">{c.client.name}</span> },
    { key: "phone", header: "Phone", render: (c) => c.client.phone },
    {
      key: "progress",
      header: "Progress",
      render: (c) => (
        <TargetProgress
          current={c.punchesCount % c.freeWashThreshold}
          target={c.freeWashThreshold}
          label={`${c.punchesCount % c.freeWashThreshold}/${c.freeWashThreshold} punches`}
          className="w-40"
        />
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (c) => {
        const available = loyaltyFreeWashesAvailable(c);
        if (available > 0) return <Badge>{available} free wash ready</Badge>;
        const until = loyaltyPunchesUntilFree(c);
        return until === 1 ? <Badge variant="secondary">1 away from free wash</Badge> : <span className="text-muted-foreground">{until} to go</span>;
      },
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Loyalty Cards</h1>
        {canManage && (
          <Button onClick={() => setEnrollOpen(true)} size="sm">
            <Plus /> Enroll client
          </Button>
        )}
      </div>

      {reminders.length > 0 && (
        <Card className="border-amber-300/60 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30">
          <CardHeader className="flex-row items-center gap-2 pb-2">
            <BellRing className="size-4 text-amber-600 dark:text-amber-400" />
            <CardTitle className="text-sm">Due for a reminder ({reminders.length})</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {reminders.map((r) => (
              <Badge key={r.phone} variant="outline" className="bg-background">
                {r.clientName} ({r.phone}) &middot; {r.reason}
              </Badge>
            ))}
          </CardContent>
        </Card>
      )}

      <DataTable
        columns={columns}
        data={cards}
        onRowClick={(row) => setSelectedId(row.id)}
        searchPlaceholder="Search by client..."
        searchFn={(row, q) => row.client.name.toLowerCase().includes(q)}
        emptyMessage="No clients enrolled yet."
      />

      <RowDialog open={enrollOpen} onOpenChange={setEnrollOpen} title="Enroll client in loyalty program">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="enroll-threshold">Washes needed for a free wash</Label>
            <Input
              id="enroll-threshold"
              type="number"
              min={1}
              max={100}
              value={enrollThreshold}
              onChange={(e) => setEnrollThreshold(Math.max(1, Number(e.target.value) || 1))}
            />
            <p className="text-xs text-muted-foreground">
              e.g. 6 means every 6th wash is free.
            </p>
          </div>
          <Select onValueChange={(v) => v && onEnroll(v as string)} disabled={pending}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clientsWithoutCard.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} &middot; {c.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {clientsWithoutCard.length === 0 && (
            <p className="text-sm text-muted-foreground">All clients are already enrolled.</p>
          )}
        </div>
      </RowDialog>

      <RowDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        title={selected?.client.name ?? ""}
        description={selected?.client.phone}
      >
        {selected && (
          <PunchPanel
            clientId={selected.client.id}
            cardId={selected.id}
            punchesCount={selected.punchesCount}
            freeWashThreshold={selected.freeWashThreshold}
            totalFreeWashesEarned={selected.totalFreeWashesEarned}
            totalFreeWashesRedeemed={selected.totalFreeWashesRedeemed}
            punches={selected.punches}
          />
        )}
      </RowDialog>
    </div>
  );
}
