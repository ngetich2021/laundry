"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { format, differenceInCalendarDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { TargetProgress } from "@/components/admin/target-progress";
import { RowDialog } from "@/components/admin/row-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { CampaignForm } from "./campaign-form";
import { AchievementPanel, type AchievementRow } from "./achievement-panel";
import { createCampaign, updateCampaign, deleteCampaign, setCampaignStatus } from "@/actions/targets";
import { campaignDailyBreakdown } from "@/lib/calc";
import { cn } from "cn";

export interface CampaignRow {
  id: string;
  name: string;
  type: string;
  cadence: "ONE_OFF" | "DAILY";
  targetMetricLabel: string;
  targetCount: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  notes: string | null;
  achievements: AchievementRow[];
}

const statusVariant: Record<string, "default" | "secondary" | "destructive"> = {
  ACTIVE: "default",
  COMPLETED: "secondary",
  CANCELLED: "destructive",
};

export function TargetsTable({ campaigns, canManage }: { campaigns: CampaignRow[]; canManage: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const selected = campaigns.find((c) => c.id === selectedId) ?? null;

  function onDelete(id: string) {
    if (!confirm("Delete this campaign target? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteCampaign(id);
        toast.success("Campaign deleted");
        router.refresh();
        setSelectedId(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onStatusChange(id: string, status: "ACTIVE" | "COMPLETED" | "CANCELLED") {
    startTransition(async () => {
      try {
        await setCampaignStatus(id, status);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const columns: DataTableColumn<CampaignRow>[] = [
    { key: "name", header: "Campaign", render: (c) => <span className="font-medium">{c.name}</span> },
    { key: "type", header: "Type", render: (c) => c.type.replace("_", " ") },
    {
      key: "progress",
      header: "Progress",
      render: (c) => {
        const { totalAchieved, totalTarget, overallPct } = campaignDailyBreakdown(c, c.achievements);
        return (
          <TargetProgress
            current={totalAchieved}
            target={totalTarget}
            label={c.cadence === "DAILY" ? `${overallPct}% of ${c.targetCount}/day` : `${totalAchieved}/${totalTarget} ${c.targetMetricLabel}`}
            className="w-44"
          />
        );
      },
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
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (c) => (
        <RowActions
          onView={() => {
            setEditing(false);
            setSelectedId(c.id);
          }}
          onEdit={canManage ? () => {
            setEditing(true);
            setSelectedId(c.id);
          } : undefined}
          onDelete={canManage ? () => onDelete(c.id) : undefined}
          deleteLabel="Delete campaign"
          disabled={pending}
        />
      ),
    },
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
        onRowClick={(row) => {
          setEditing(false);
          setSelectedId(row.id);
        }}
        searchPlaceholder="Search campaigns..."
        searchFn={(row, q) => row.name.toLowerCase().includes(q)}
        emptyMessage="No campaigns yet."
      />

      <RowDialog open={addOpen} onOpenChange={setAddOpen} title="New campaign target">
        <CampaignForm action={createCampaign} onSuccess={() => setAddOpen(false)} submitLabel="Create campaign" />
      </RowDialog>

      <RowDialog
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedId(null);
            setEditing(false);
          }
        }}
        title={selected?.name ?? ""}
        description={selected ? `${format(new Date(selected.startDate), "d MMM")} – ${format(new Date(selected.endDate), "d MMM yyyy")}` : undefined}
      >
        {selected && editing && canManage && (
          <CampaignForm
            action={(fd) => updateCampaign(selected.id, fd)}
            defaultValues={{
              ...selected,
              startDate: selected.startDate.slice(0, 10),
              endDate: selected.endDate.slice(0, 10),
              notes: selected.notes ?? "",
            }}
            onSuccess={() => setEditing(false)}
            submitLabel="Save changes"
          />
        )}

        {selected && !editing && (
          <div className="space-y-3">
            {canManage && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <Select value={selected.status} onValueChange={(v) => v && onStatusChange(selected.id, v as "ACTIVE" | "COMPLETED" | "CANCELLED")} disabled={pending}>
                  <SelectTrigger size="sm" className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <AchievementPanel
              campaignId={selected.id}
              type={selected.type}
              startDate={selected.startDate}
              endDate={selected.endDate}
              targetCount={selected.targetCount}
              cadence={selected.cadence}
              targetMetricLabel={selected.targetMetricLabel}
              notes={selected.notes}
              achievements={selected.achievements}
              canManage={canManage}
            />

            {canManage && (
              <>
                <Separator />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => setEditing(true)}>
                    Edit campaign details
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(selected.id)} disabled={pending}>
                    <Trash2 /> Delete
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </RowDialog>
    </div>
  );
}
