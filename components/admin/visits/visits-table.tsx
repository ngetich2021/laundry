"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";

export interface VisitRow {
  id: string;
  path: string;
  referrer: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  country: string | null;
  city: string | null;
  deviceType: string | null;
  userAgent: string | null;
  visitedAt: string;
}

function sourceLabel(v: VisitRow) {
  if (v.utmSource) return v.utmSource;
  if (!v.referrer) return "Direct";
  try {
    return new URL(v.referrer).hostname.replace("www.", "");
  } catch {
    return v.referrer;
  }
}

export function VisitsTable({ visits }: { visits: VisitRow[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = visits.find((v) => v.id === selectedId) ?? null;

  const columns: DataTableColumn<VisitRow>[] = [
    { key: "path", header: "Page", render: (v) => <span className="font-medium">{v.path}</span> },
    { key: "source", header: "Source", render: (v) => sourceLabel(v) },
    {
      key: "location",
      header: "Location",
      render: (v) => (v.city || v.country ? [v.city, v.country].filter(Boolean).join(", ") : "Unknown"),
    },
    { key: "device", header: "Device", render: (v) => <Badge variant="outline">{v.deviceType ?? "unknown"}</Badge> },
    { key: "time", header: "When", render: (v) => format(new Date(v.visitedAt), "d MMM, HH:mm") },
  ];

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={visits}
        onRowClick={(row) => setSelectedId(row.id)}
        searchPlaceholder="Search by page or source..."
        searchFn={(row, q) => row.path.toLowerCase().includes(q) || sourceLabel(row).toLowerCase().includes(q)}
        emptyMessage="No visits recorded yet."
        pageSize={15}
      />

      <RowDialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)} title="Visit detail">
        {selected && (
          <div className="space-y-1.5 text-sm">
            <p><span className="text-muted-foreground">Page:</span> {selected.path}</p>
            <p><span className="text-muted-foreground">Referrer:</span> {selected.referrer || "—"}</p>
            <p><span className="text-muted-foreground">UTM:</span> {[selected.utmSource, selected.utmMedium, selected.utmCampaign].filter(Boolean).join(" / ") || "—"}</p>
            <p><span className="text-muted-foreground">Location:</span> {[selected.city, selected.country].filter(Boolean).join(", ") || "Unknown"}</p>
            <p><span className="text-muted-foreground">Device:</span> {selected.deviceType}</p>
            <p><span className="text-muted-foreground">User agent:</span> <span className="break-all">{selected.userAgent}</span></p>
            <p><span className="text-muted-foreground">Time:</span> {format(new Date(selected.visitedAt), "d MMM yyyy, HH:mm:ss")}</p>
          </div>
        )}
      </RowDialog>
    </div>
  );
}
