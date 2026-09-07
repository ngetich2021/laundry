"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { TargetProgress } from "@/components/admin/target-progress";
import { RowDialog } from "@/components/admin/row-dialog";
import { CampaignForm } from "./campaign-form";
import { AchievementPanel, type AchievementRow } from "./achievement-panel";
import { cn } from "cn";

export interface CampaignRow {
  id: string;
  name: string;
  type: string;
  targetMetricLabel: string;
  targetCount: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  achievements: AchievementRow[];
}

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  ACTIVE: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};

export function TargetsTable({ campaigns, canManage }: { campaigns: CampaignRow[]; canManage: boolean }) {
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = campaigns.find((c) => c.id === selectedId) ?? null;

  const columns: DataTableColumn<CampaignRow>[] = [
    { key: "name", header: "Campaign", render: (c) => <span className="font-medium">{c.name}</span> },
    { key: "type", header: "Type", render: (c) => c.type.replace("_", " ") },
    {
      key: "progress",
      header: "Progress",
      render: (c) => (
        <TargetProgress
          current={c.achievements.length}
          target={c.targetCount}
          label={`${c.achievements.length}/${c.targetCount} ${c.targetMetricLabel}`}
          className="w-44"
        />
      ),
    },
    {
      key: "endDate",
      header: "Window",
      render: (c) => {
        const daysLeft = differenceInCalendarDays(new Date(c.endDate), new Date());
        return (
          <div className="text-sm">
            <div>{format(new Date(c.endDate), "d MMM yyyy")}</div>
            {c.status === "ACTIVE" && (
              <div className={cn("text-xs", daysLeft < 0 ? "text-red-600 dark:text-red-400" : daysLeft <= 2 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground")}>
                {daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : daysLeft === 0 ? "Due today" : `${daysLeft}d left`}
              </div>
            )}
          </div>
        );
      },
    },
    { key: "status", header: "Status", render: (c) => <Badge variant={statusVariant[c.status]}>{c.status}</Badge> },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Campaign Targets</h1>
        {canManage && (
          <Button onClick={() => setAddOpen(true)} size="sm">
            <Plus /> New target
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={campaigns}
        onRowClick={(row) => setSelectedId(row.id)}
        searchPlaceholder="Search campaigns..."
        searchFn={(row, q) => row.name.toLowerCase().includes(q)}
        emptyMessage="No campaigns yet."
      />

      <RowDialog open={addOpen} onOpenChange={setAddOpen} title="New campaign target">
        <CampaignForm onSuccess={() => setAddOpen(false)} />
      </RowDialog>

      <RowDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        title={selected?.name ?? ""}
        description={selected ? `${format(new Date(selected.startDate), "d MMM")} – ${format(new Date(selected.endDate), "d MMM yyyy")}` : undefined}
      >
        {selected && (
          <AchievementPanel
            campaignId={selected.id}
            targetCount={selected.targetCount}
            targetMetricLabel={selected.targetMetricLabel}
            achievements={selected.achievements}
            canManage={canManage}
          />
        )}
      </RowDialog>
    </div>
  );
}
