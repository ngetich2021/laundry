"use client";

import { usePathname } from "next/navigation";
import { ADMIN_NAV_ITEMS } from "@/lib/admin-nav";
import { AppLink } from "@/components/ui/app-link";
import { cn } from "cn";

export function AdminNavLinks({ permissions }: { permissions: string[] }) {
  const pathname = usePathname();
  const items = ADMIN_NAV_ITEMS.filter((item) => permissions.includes(item.permission));

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {items.map((item) => {
        const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
        const Icon = item.icon;
        return (
          <AppLink
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </AppLink>
        );
      })}
    </nav>
  );
}
