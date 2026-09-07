import { requireSession } from "@/lib/permissions";
import AdminSidebar from "@/components/admin/sidebar";
import AdminTopbar from "@/components/admin/topbar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar permissions={session.user.permissions} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar
          user={{
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            roleName: session.user.roleName,
          }}
          permissions={session.user.permissions}
        />
        <main className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
