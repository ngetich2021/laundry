"use client";

import { useOptimistic, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { setRolePermission } from "@/actions/roles";
import { PERMISSION_GROUPS, PERMISSIONS } from "@/lib/permission-defs";

export function RolePermissionsPanel({
  roleId,
  isSystem,
  roleName,
  allPermissions,
  grantedKeys,
}: {
  roleId: string;
  isSystem: boolean;
  roleName: string;
  allPermissions: { id: string; key: string }[];
  grantedKeys: Set<string>;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [optimisticGranted, setOptimisticGranted] = useOptimistic(
    grantedKeys,
    (state: Set<string>, action: { key: string; enabled: boolean }) => {
      const next = new Set(state);
      if (action.enabled) next.add(action.key);
      else next.delete(action.key);
      return next;
    }
  );
  const locked = isSystem && roleName === "Admin";

  function toggle(permissionId: string, key: string, enabled: boolean) {
    setPendingIds((prev) => new Set(prev).add(permissionId));
    startTransition(async () => {
      setOptimisticGranted({ key, enabled });
      try {
        await setRolePermission(roleId, permissionId, enabled);
        router.refresh();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setPendingIds((prev) => {
          const next = new Set(prev);
          next.delete(permissionId);
          return next;
        });
      }
    });
  }

  return (
    <div className="max-h-96 space-y-4 overflow-y-auto pr-1">
      {locked && <p className="text-xs text-muted-foreground">Admin always has every permission.</p>}
      {PERMISSION_GROUPS.map((group) => {
        const perms = PERMISSIONS.filter((p) => p.group === group);
        if (perms.length === 0) return null;
        return (
          <div key={group} className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{group}</p>
            <div className="space-y-2">
              {perms.map((p) => {
                const dbPerm = allPermissions.find((ap) => ap.key === p.key);
                if (!dbPerm) return null;
                return (
                  <PermissionRow
                    key={p.key}
                    permKey={p.key}
                    label={p.label}
                    description={p.description}
                    checked={optimisticGranted.has(p.key)}
                    disabled={locked}
                    pending={pendingIds.has(dbPerm.id)}
                    onToggle={(enabled) => toggle(dbPerm.id, p.key, enabled)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PermissionRow({
  permKey,
  label,
  description,
  checked,
  disabled,
  pending,
  onToggle,
}: {
  permKey: string;
  label: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  pending: boolean;
  onToggle: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <Label htmlFor={`perm-${permKey}`} className="text-sm">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="flex items-center gap-2">
        {pending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
        <Switch id={`perm-${permKey}`} checked={checked} disabled={disabled || pending} onCheckedChange={onToggle} />
      </div>
    </div>
  );
}
