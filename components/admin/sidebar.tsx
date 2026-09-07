import Image from "next/image";
import { AdminNavLinks } from "@/components/admin/nav-links";

export default function AdminSidebar({ permissions }: { permissions: string[] }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-background md:flex md:flex-col">
      <div className="flex h-16 items-center gap-2 border-b px-5">
        <div className="relative h-9 w-20">
          <Image src="/logo.jpeg" alt="Royal Laundry" fill className="object-contain" />
        </div>
        <span className="text-sm font-semibold">Staff Dashboard</span>
      </div>
      <AdminNavLinks permissions={permissions} />
    </aside>
  );
}
