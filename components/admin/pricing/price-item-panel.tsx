"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatKES } from "@/lib/calc";
import { addPriceItem, updatePriceItem, deletePriceItem } from "@/actions/pricing";

export interface PriceItemRow {
  id: string;
  label: string;
  price: number;
  unit: string | null;
  sortOrder: number;
}

export function PriceItemPanel({ categoryId, items }: { categoryId: string; items: PriceItemRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  function onAdd(formData: FormData) {
    startTransition(async () => {
      try {
        await addPriceItem(categoryId, formData);
        toast.success("Price added");
        router.refresh();
        setAdding(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onUpdate(id: string, formData: FormData) {
    startTransition(async () => {
      try {
        await updatePriceItem(id, formData);
        toast.success("Price updated");
        router.refresh();
        setEditingId(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onDelete(id: string) {
    startTransition(async () => {
      try {
        await deletePriceItem(id);
        toast.success("Price removed");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Label</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-16 text-center text-muted-foreground">
                  No prices yet.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) =>
                editingId === item.id ? (
                  <TableRow key={item.id}>
                    <TableCell colSpan={4}>
                      <form action={(fd) => onUpdate(item.id, fd)} className="flex flex-wrap items-end gap-2 py-1">
                        <div className="space-y-1">
                          <Label className="text-xs">Label</Label>
                          <Input name="label" defaultValue={item.label} className="h-8 w-28" required />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Price (KES)</Label>
                          <Input name="price" type="number" min="0" step="1" defaultValue={item.price} className="h-8 w-24" required />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Unit (optional)</Label>
                          <Input name="unit" defaultValue={item.unit ?? ""} placeholder="per kg" className="h-8 w-24" />
                        </div>
                        <input type="hidden" name="sortOrder" value={item.sortOrder} />
                        <Button type="submit" size="sm" disabled={pending}>
                          Save
                        </Button>
                        <Button type="button" size="sm" variant="ghost" onClick={() => setEditingId(null)} disabled={pending}>
                          Cancel
                        </Button>
                      </form>
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow key={item.id}>
                    <TableCell>{item.label}</TableCell>
                    <TableCell className="font-medium text-blue-600">{formatKES(item.price)}</TableCell>
                    <TableCell className="text-muted-foreground">{item.unit || "—"}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button size="icon-sm" variant="ghost" onClick={() => setEditingId(item.id)} disabled={pending} aria-label="Edit">
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button size="icon-sm" variant="ghost" onClick={() => onDelete(item.id)} disabled={pending} aria-label="Delete">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              )
            )}
          </TableBody>
        </Table>
      </div>

      <Separator />

      {adding ? (
        <form action={onAdd} className="flex flex-wrap items-end gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Label</Label>
            <Input name="label" placeholder="e.g. 4x6" className="h-8 w-28" required />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Price (KES)</Label>
            <Input name="price" type="number" min="0" step="1" className="h-8 w-24" required />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Unit (optional)</Label>
            <Input name="unit" placeholder="per kg" className="h-8 w-24" />
          </div>
          <input type="hidden" name="sortOrder" value={items.length} />
          <Button type="submit" size="sm" disabled={pending}>
            Add
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={() => setAdding(false)} disabled={pending}>
            Cancel
          </Button>
        </form>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setAdding(true)} disabled={pending}>
          <Plus /> Add price
        </Button>
      )}
    </div>
  );
}
