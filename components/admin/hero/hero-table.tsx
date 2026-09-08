"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { HeroForm } from "./hero-form";
import { createHeroSlide, updateHeroSlide, setHeroSlideActive, deleteHeroSlide } from "@/actions/hero";

export interface HeroSlideRow {
  id: string;
  label: string;
  body: string;
  ctaText: string;
  ctaLink: string | null;
  imageUrl: string;
  isActive: boolean;
  sortOrder: number;
}

export function HeroTable({ slides, canManage }: { slides: HeroSlideRow[]; canManage: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = slides.find((s) => s.id === selectedId) ?? null;

  function onToggleActive(id: string, isActive: boolean) {
    startTransition(async () => {
      try {
        await setHeroSlideActive(id, isActive);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteHeroSlide(id);
        toast.success("Slide deleted");
        router.refresh();
        setSelectedId(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const columns: DataTableColumn<HeroSlideRow>[] = [
    {
      key: "image",
      header: "",
      render: (s) => (
        <div className="h-10 w-16 overflow-hidden rounded-md bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.imageUrl} alt={s.label} className="h-full w-full object-cover" />
        </div>
      ),
    },
    { key: "label", header: "Headline", render: (s) => <span className="font-medium">{s.label}</span> },
    { key: "ctaText", header: "Button", render: (s) => s.ctaText },
    { key: "sortOrder", header: "Order", render: (s) => s.sortOrder },
    {
      key: "active",
      header: "Live on site",
      render: (s) => (
        <Switch
          checked={s.isActive}
          disabled={!canManage || pending}
          onCheckedChange={(v) => onToggleActive(s.id, v)}
          onClick={(e) => e.stopPropagation()}
        />
      ),
    },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (s) => (
        <RowActions
          onView={() => setSelectedId(s.id)}
          onDelete={canManage ? () => onDelete(s.id) : undefined}
          deleteLabel="Delete slide"
          disabled={pending}
        />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Homepage Hero Slides</h1>
        {canManage && (
          <Button onClick={() => setAddOpen(true)} size="sm">
            <Plus /> New slide
          </Button>
        )}
      </div>
      <p className="text-sm text-muted-foreground">
        These slides rotate in the hero banner at the top of the public homepage. Only slides marked &quot;Live on site&quot; are shown.
      </p>

      <DataTable columns={columns} data={slides} onRowClick={(row) => setSelectedId(row.id)} emptyMessage="No slides yet." />

      <RowDialog open={addOpen} onOpenChange={setAddOpen} title="New hero slide">
        <HeroForm action={createHeroSlide} onSuccess={() => setAddOpen(false)} submitLabel="Add slide" />
      </RowDialog>

      <RowDialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)} title={selected?.label ?? ""}>
        {selected && canManage && (
          <div className="space-y-3">
            <HeroForm action={(fd) => updateHeroSlide(selected.id, fd)} defaultValues={selected} onSuccess={() => setSelectedId(null)} submitLabel="Save changes" />
            <Separator />
            <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(selected.id)} disabled={pending}>
              <Trash2 /> Delete slide
            </Button>
          </div>
        )}
      </RowDialog>
    </div>
  );
}
