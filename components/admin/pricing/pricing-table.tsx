"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { CategoryForm } from "./category-form";
import { PriceItemPanel, type PriceItemRow } from "./price-item-panel";
import { createCategory, updateCategory, deleteCategory } from "@/actions/pricing";

export interface CategoryRow {
  id: string;
  name: string;
  icon: string;
  displayStyle: string;
  sortOrder: number;
  items: PriceItemRow[];
}

export function PricingTable({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = categories.find((c) => c.id === selectedId) ?? null;

  function onDelete(id: string) {
    startTransition(async () => {
      try {
        await deleteCategory(id);
        toast.success("Category deleted");
        router.refresh();
        setSelectedId(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const columns: DataTableColumn<CategoryRow>[] = [
    { key: "name", header: "Service", render: (c) => <span className="font-medium">{c.name}</span> },
    { key: "displayStyle", header: "Display", render: (c) => (c.displayStyle === "LIST" ? "Price list" : "Single price") },
    { key: "items", header: "Prices", render: (c) => `${c.items.length} price(s)` },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (c) => (
        <RowActions onView={() => setSelectedId(c.id)} onDelete={() => onDelete(c.id)} deleteLabel="Delete service" disabled={pending} />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Pricing</h1>
        <Button onClick={() => setAddOpen(true)} size="sm">
          <Plus /> New service
        </Button>
      </div>
      <p className="text-sm text-muted-foreground">This is exactly what shows in the &quot;Our Pricing&quot; section of the public site.</p>

      <DataTable columns={columns} data={categories} onRowClick={(row) => setSelectedId(row.id)} emptyMessage="No services priced yet." />

      <RowDialog open={addOpen} onOpenChange={setAddOpen} title="New service">
        <CategoryForm action={createCategory} onSuccess={() => setAddOpen(false)} submitLabel="Add service" />
      </RowDialog>

      <RowDialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)} title={selected?.name ?? ""}>
        {selected && (
          <div className="space-y-4">
            <PriceItemPanel categoryId={selected.id} items={selected.items} />
            <Separator />
            <CategoryForm action={(fd) => updateCategory(selected.id, fd)} defaultValues={selected} submitLabel="Save service settings" />
            <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(selected.id)} disabled={pending}>
              <Trash2 /> Delete service
            </Button>
          </div>
        )}
      </RowDialog>
    </div>
  );
}
