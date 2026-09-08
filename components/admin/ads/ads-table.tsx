"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { AdForm } from "./ad-form";
import { createAd, updateAd, deleteAd } from "@/actions/ads";
import { adStatus, formatKES } from "@/lib/calc";

export interface AdRow {
  id: string;
  platform: string;
  name: string;
  amountSpent: number;
  startDate: string;
  endDate: string;
  notes: string | null;
}

const PLATFORM_LABEL: Record<string, string> = {
  FACEBOOK: "Facebook",
  INSTAGRAM: "Instagram",
  TIKTOK: "TikTok",
  LAUNDRY_KE: "Laundry.ke",
  GOOGLE: "Google",
  OTHER: "Other",
};

const statusVariant: Record<string, "default" | "secondary" | "outline"> = {
  ACTIVE: "default",
  SCHEDULED: "outline",
  ENDED: "secondary",
};

export function AdsTable({ ads, canManage }: { ads: AdRow[]; canManage: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = ads.find((a) => a.id === selectedId) ?? null;

  function onDelete(id: string) {
    if (!confirm("Delete this ad record? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteAd(id);
        toast.success("Ad deleted");
        router.refresh();
        setSelectedId(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const columns: DataTableColumn<AdRow>[] = [
    { key: "platform", header: "Platform", render: (a) => PLATFORM_LABEL[a.platform] ?? a.platform },
    { key: "name", header: "Ad", render: (a) => <span className="font-medium">{a.name}</span> },
    {
      key: "dates",
      header: "Runs",
      render: (a) => `${format(new Date(a.startDate), "d MMM")} – ${format(new Date(a.endDate), "d MMM yyyy")}`,
    },
    { key: "amount", header: "Spend", render: (a) => formatKES(a.amountSpent) },
    {
      key: "status",
      header: "Status",
      render: (a) => {
        const status = adStatus(a);
        return <Badge variant={statusVariant[status]}>{status}</Badge>;
      },
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (a) => (
        <RowActions
          onView={() => setSelectedId(a.id)}
          onDelete={canManage ? () => onDelete(a.id) : undefined}
          deleteLabel="Delete ad"
          disabled={pending}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Ads</h1>
        {canManage && (
          <Button onClick={() => setAddOpen(true)} size="sm">
            <Plus /> New ad
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={ads}
        onRowClick={(row) => setSelectedId(row.id)}
        searchPlaceholder="Search ads..."
        searchFn={(row, q) => row.name.toLowerCase().includes(q) || row.platform.toLowerCase().includes(q)}
        emptyMessage="No ads recorded yet."
      />

      <RowDialog open={addOpen} onOpenChange={setAddOpen} title="New ad">
        <AdForm action={createAd} onSuccess={() => setAddOpen(false)} submitLabel="Add ad" />
      </RowDialog>

      <RowDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        title={selected?.name ?? ""}
        description={selected ? PLATFORM_LABEL[selected.platform] : undefined}
      >
        {selected && (
          <div className="space-y-3">
            {canManage ? (
              <AdForm
                action={(fd) => updateAd(selected.id, fd)}
                defaultValues={{
                  ...selected,
                  startDate: selected.startDate.slice(0, 10),
                  endDate: selected.endDate.slice(0, 10),
                }}
                onSuccess={() => setSelectedId(null)}
                submitLabel="Save changes"
              />
            ) : (
              <div className="space-y-1 text-sm">
                <p><span className="text-muted-foreground">Spend:</span> {formatKES(selected.amountSpent)}</p>
                <p><span className="text-muted-foreground">Runs:</span> {format(new Date(selected.startDate), "d MMM yyyy")} – {format(new Date(selected.endDate), "d MMM yyyy")}</p>
                <p><span className="text-muted-foreground">Notes:</span> {selected.notes || "—"}</p>
              </div>
            )}
            {canManage && (
              <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(selected.id)} disabled={pending}>
                Delete ad
              </Button>
            )}
          </div>
        )}
      </RowDialog>
    </div>
  );
}
