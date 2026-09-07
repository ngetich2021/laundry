"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { RolePermissionsPanel } from "./role-permissions-panel";
import { createRole, deleteRole } from "@/actions/roles";

export interface RoleRow {
  id: string;
  name: string;
  description: string | null;
  isSystem: boolean;
  permissions: { permission: { id: string; key: string } }[];
}

export function RolesTable({ roles, allPermissions }: { roles: RoleRow[]; allPermissions: { id: string; key: string }[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = roles.find((r) => r.id === selectedId) ?? null;

  function onCreate(formData: FormData) {
    startTransition(async () => {
      try {
        await createRole(formData);
        toast.success("Role created");
        router.refresh();
        setAddOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onDelete(roleId: string) {
    startTransition(async () => {
      try {
        await deleteRole(roleId);
        toast.success("Role deleted");
        router.refresh();
        setSelectedId(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const columns: DataTableColumn<RoleRow>[] = [
    {
      key: "name",
      header: "Role",
      render: (r) => (
        <span className="flex items-center gap-2 font-medium">
          {r.name}
          {r.isSystem && <Badge variant="outline">built-in</Badge>}
        </span>
      ),
    },
    { key: "description", header: "Description", render: (r) => r.description || "—" },
    { key: "permissions", header: "Permissions", render: (r) => `${r.permissions.length} granted` },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Roles &amp; Permissions</h1>
        <Button onClick={() => setAddOpen(true)} size="sm">
          <Plus /> New role
        </Button>
      </div>

      <DataTable columns={columns} data={roles} onRowClick={(row) => setSelectedId(row.id)} emptyMessage="No roles yet." />

      <RowDialog open={addOpen} onOpenChange={setAddOpen} title="New role">
        <form action={onCreate} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Role name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={2} />
          </div>
          <Button type="submit" disabled={pending} className="w-full">
            Create role
          </Button>
        </form>
      </RowDialog>

      <RowDialog
        open={!!selected}
        onOpenChange={(open) => !open && setSelectedId(null)}
        title={selected?.name ?? ""}
        description={selected?.description ?? undefined}
      >
        {selected && (
          <div className="space-y-3">
            <RolePermissionsPanel
              roleId={selected.id}
              isSystem={selected.isSystem}
              roleName={selected.name}
              allPermissions={allPermissions}
              grantedKeys={new Set(selected.permissions.map((p) => p.permission.key))}
            />
            {!selected.isSystem && (
              <>
                <Separator />
                <Button variant="destructive" size="sm" className="w-full" onClick={() => onDelete(selected.id)} disabled={pending}>
                  <Trash2 /> Delete role
                </Button>
              </>
            )}
          </div>
        )}
      </RowDialog>
    </div>
  );
}
