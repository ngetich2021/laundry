"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createSale } from "@/actions/sales";
import { createClientQuick } from "@/actions/clients";
import { formatKES } from "@/lib/calc";

export interface CatalogItem {
  id: string;
  label: string;
  price: number;
  unit: string | null;
}

export interface CatalogCategory {
  id: string;
  name: string;
  items: CatalogItem[];
}

export interface ClientOption {
  id: string;
  name: string;
  phone: string;
}

interface ItemRow {
  key: string;
  catalogItemId: string;
  label: string;
  unit: string;
  quantity: string;
  unitPrice: string;
}

function emptyRow(): ItemRow {
  return { key: crypto.randomUUID(), catalogItemId: "", label: "", unit: "", quantity: "1", unitPrice: "" };
}

export function SaleForm({
  clients,
  categories,
  onSuccess,
}: {
  clients: ClientOption[];
  categories: CatalogCategory[];
  onSuccess?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [creatingClient, startCreatingClient] = useTransition();
  const [localClients, setLocalClients] = useState<ClientOption[]>(clients);
  const [clientId, setClientId] = useState<string>("");
  const [showNewClient, setShowNewClient] = useState(false);
  const [newClientName, setNewClientName] = useState("");
  const [newClientPhone, setNewClientPhone] = useState("");
  const [items, setItems] = useState<ItemRow[]>([emptyRow()]);
  const [discountPercent, setDiscountPercent] = useState("0");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [amountPaid, setAmountPaid] = useState("0");
  const [fullyPaid, setFullyPaid] = useState(true);
  const [notes, setNotes] = useState("");

  const catalogById = useMemo(() => {
    const map = new Map<string, CatalogItem>();
    for (const cat of categories) for (const item of cat.items) map.set(item.id, item);
    return map;
  }, [categories]);

  // Base UI's Select resolves the trigger's displayed label from this map rather
  // than from the (possibly-unmounted) popup content, so a controlled value shows
  // the item's name instead of falling back to its raw id.
  const catalogSelectLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const cat of categories) for (const item of cat.items) labels[item.id] = `${item.label} · ${formatKES(item.price)}`;
    return labels;
  }, [categories]);

  const clientSelectLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    for (const c of localClients) labels[c.id] = `${c.name} · ${c.phone}`;
    return labels;
  }, [localClients]);

  const subtotal = items.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0);
  const discount = Number(discountPercent) || 0;
  const total = Math.max(0, subtotal * (1 - discount / 100));
  const effectiveAmountPaid = fullyPaid ? total : Number(amountPaid) || 0;

  function updateRow(key: string, patch: Partial<ItemRow>) {
    setItems((rows) => rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  }

  function pickCatalogItem(key: string, catalogItemId: string) {
    const item = catalogById.get(catalogItemId);
    if (!item) return;
    updateRow(key, { catalogItemId, label: item.label, unit: item.unit ?? "", unitPrice: String(item.price) });
  }

  function addRow() {
    setItems((rows) => [...rows, emptyRow()]);
  }

  function removeRow(key: string) {
    setItems((rows) => (rows.length > 1 ? rows.filter((r) => r.key !== key) : rows));
  }

  function onCreateClient(e: React.FormEvent) {
    e.preventDefault();
    if (!newClientName.trim() || !newClientPhone.trim()) return;

    startCreatingClient(async () => {
      try {
        const client = await createClientQuick({ name: newClientName.trim(), phone: newClientPhone.trim() });
        setLocalClients((prev) => (prev.some((c) => c.id === client.id) ? prev : [...prev, client]));
        setClientId(client.id);
        setShowNewClient(false);
        setNewClientName("");
        setNewClientPhone("");
        toast.success("Client added");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!clientId) {
      toast.error("Select or add a client");
      return;
    }

    const cleanedItems = items
      .filter((r) => r.label.trim().length > 0)
      .map((r) => ({
        label: r.label.trim(),
        unit: r.unit.trim() || null,
        quantity: Number(r.quantity) || 0,
        unitPrice: Number(r.unitPrice) || 0,
      }));

    if (cleanedItems.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    startTransition(async () => {
      try {
        await createSale({
          clientId,
          items: cleanedItems,
          discountPercent: discount,
          amountPaid: effectiveAmountPaid,
          paymentMethod,
          notes,
        });
        toast.success("Sale recorded");
        router.refresh();
        onSuccess?.();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Customer</Label>
          {!showNewClient && (
            <Button type="button" size="xs" variant="ghost" onClick={() => setShowNewClient(true)}>
              <Plus /> New client
            </Button>
          )}
        </div>

        {showNewClient ? (
          <div className="space-y-2 rounded-md border bg-muted/40 p-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Customer name"
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                className="h-8"
              />
              <Input
                placeholder="Phone number"
                value={newClientPhone}
                onChange={(e) => setNewClientPhone(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={onCreateClient} disabled={creatingClient}>
                {creatingClient ? "Adding..." : "Add & select"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setShowNewClient(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Select items={clientSelectLabels} value={clientId} onValueChange={(v) => setClientId(v ?? "")}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {localClients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} &middot; {c.phone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Items</Label>
        <div className="space-y-2">
          {items.map((row) => (
            <div key={row.key} className="grid grid-cols-12 items-end gap-2 rounded-md border p-2">
              <div className="col-span-3 space-y-1">
                <Label className="text-xs text-muted-foreground">From price list</Label>
                <Select
                  items={catalogSelectLabels}
                  value={row.catalogItemId}
                  onValueChange={(v) => v && pickCatalogItem(row.key, v)}
                >
                  <SelectTrigger className="w-full" size="sm">
                    <SelectValue placeholder="Quick fill..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectGroup key={cat.id}>
                        <SelectLabel>{cat.name}</SelectLabel>
                        {cat.items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.label} &middot; {formatKES(item.price)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-3 space-y-1">
                <Label className="text-xs text-muted-foreground">Item</Label>
                <Input
                  value={row.label}
                  onChange={(e) => updateRow(row.key, { label: e.target.value })}
                  placeholder="e.g. Duvet 6x6"
                  className="h-8"
                  required
                />
              </div>
              <div className="col-span-1 space-y-1">
                <Label className="text-xs text-muted-foreground">Qty</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={row.quantity}
                  onChange={(e) => updateRow(row.key, { quantity: e.target.value })}
                  className="h-8"
                  required
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs text-muted-foreground">Unit price</Label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={row.unitPrice}
                  onChange={(e) => updateRow(row.key, { unitPrice: e.target.value })}
                  className="h-8"
                  required
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label className="text-xs text-muted-foreground">Total</Label>
                <div className="flex h-8 items-center rounded-md border border-transparent bg-muted/50 px-2 text-sm font-medium">
                  {formatKES((Number(row.quantity) || 0) * (Number(row.unitPrice) || 0))}
                </div>
              </div>
              <div className="col-span-1 flex justify-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeRow(row.key)}
                  disabled={items.length === 1}
                  aria-label="Remove item"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus /> Add item
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="discountPercent">Discount %</Label>
          <Input
            id="discountPercent"
            type="number"
            min="0"
            max="100"
            step="1"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="paymentMethod">Payment method</Label>
          <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v ?? "CASH")}>
            <SelectTrigger id="paymentMethod" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CASH">Cash</SelectItem>
              <SelectItem value="MPESA">M-Pesa</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
              <SelectItem value="BANK_TRANSFER">Bank transfer</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 rounded-md bg-muted/50 p-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatKES(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Total</span>
          <span>{formatKES(total)}</span>
        </div>

        <label className="flex items-center gap-2 pt-1 text-sm">
          <Checkbox checked={fullyPaid} onCheckedChange={(c) => setFullyPaid(!!c)} />
          Paid in full now
        </label>

        {!fullyPaid && (
          <div className="space-y-1.5 pt-1">
            <Label htmlFor="amountPaid">Amount paid now</Label>
            <Input
              id="amountPaid"
              type="number"
              min="0"
              step="1"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Recording sale..." : `Record sale · ${formatKES(total)}`}
      </Button>
    </form>
  );
}
