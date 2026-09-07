"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { AdForm } from "./ad-form";
import { createAd, updateAd } from "@/actions/ads";
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
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = ads.find((a) => a.id === selectedId) ?? null;

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
        {selected && canManage && (
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
        )}
      </RowDialog>
    </div>
  );
}
