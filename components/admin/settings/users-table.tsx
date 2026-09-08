"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { RowDialog } from "@/components/admin/row-dialog";
import { RowActions } from "@/components/admin/row-actions";
import { inviteUser, changeUserRole, revokeAccess } from "@/actions/users";

export interface InvitedUserRow {
  id: string;
  email: string;
  note: string | null;
  role: { id: string; name: string };
  lastLoginAt: string | null;
}

export function UsersTable({ users, roles }: { users: InvitedUserRow[]; roles: { id: string; name: string }[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [addOpen, setAddOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = users.find((u) => u.id === selectedId) ?? null;

  function onInvite(formData: FormData) {
    startTransition(async () => {
      try {
        await inviteUser(formData);
        toast.success("Invited");
        router.refresh();
        setAddOpen(false);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onChangeRole(id: string, roleId: string) {
    startTransition(async () => {
      try {
        await changeUserRole(id, roleId);
        toast.success("Role updated");
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  function onRevoke(id: string) {
    if (!confirm("Revoke this user's access? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await revokeAccess(id);
        toast.success("Access revoked");
        router.refresh();
        setSelectedId(null);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      }
    });
  }

  const columns: DataTableColumn<InvitedUserRow>[] = [
    { key: "email", header: "Email", render: (u) => <span className="font-medium">{u.email}</span> },
    { key: "role", header: "Role", render: (u) => <Badge>{u.role.name}</Badge> },
    { key: "lastLoginAt", header: "Last login", render: (u) => (u.lastLoginAt ? format(new Date(u.lastLoginAt), "d MMM yyyy") : "Never") },
    {
      key: "actions",
      header: "",
      className: "w-10",
      render: (u) => (
        <RowActions onView={() => setSelectedId(u.id)} onDelete={() => onRevoke(u.id)} deleteLabel="Revoke access" disabled={pending} />
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Users</h1>
        <Button onClick={() => setAddOpen(true)} size="sm">
          <Plus /> Invite staff
        </Button>
      </div>

      <DataTable columns={columns} data={users} onRowClick={(row) => setSelectedId(row.id)} emptyMessage="No one invited yet." />

      <RowDialog open={addOpen} onOpenChange={setAddOpen} title="Invite staff">
        <form action={onInvite} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="email">Google email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="roleId">Role</Label>
            <Select name="roleId" required>
              <SelectTrigger id="roleId" className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" name="note" placeholder="e.g. Front desk, Nairobi branch" />
          </div>
          <Button type="submit" disabled={pending} className="w-full">
            Send invite
          </Button>
        </form>
      </RowDialog>

      <RowDialog open={!!selected} onOpenChange={(open) => !open && setSelectedId(null)} title={selected?.email ?? ""}>
        {selected && (
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Select value={selected.role.id} onValueChange={(v) => v && onChangeRole(selected.id, v as string)} disabled={pending}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button variant="destructive" size="sm" className="w-full" onClick={() => onRevoke(selected.id)} disabled={pending}>
              <Trash2 /> Revoke access
            </Button>
          </div>
        )}
      </RowDialog>
    </div>
  );
}
