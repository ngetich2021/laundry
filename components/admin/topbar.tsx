import { signOut } from "@/lib/auth";
import { SubmitButton } from "@/components/ui/submit-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import AdminMobileNav from "@/components/admin/mobile-nav";

export default function AdminTopbar({
  user,
  permissions,
}: {
  user: { name?: string | null; email?: string | null; image?: string | null; roleName: string };
  permissions: string[];
}) {
  return (
    <header className="flex h-16 items-center justify-between gap-3 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <AdminMobileNav permissions={permissions} />
        <div>
          <p className="text-sm font-medium">{user.name ?? user.email}</p>
          <p className="text-xs text-muted-foreground">{user.roleName}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Avatar className="size-8">
          <AvatarImage src={user.image ?? undefined} alt={user.name ?? ""} />
          <AvatarFallback>{(user.name ?? user.email ?? "?").slice(0, 1).toUpperCase()}</AvatarFallback>
        </Avatar>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <SubmitButton variant="ghost" size="icon" aria-label="Sign out">
            <LogOut className="size-4" />
          </SubmitButton>
        </form>
      </div>
    </header>
  );
}
