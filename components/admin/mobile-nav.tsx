"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AdminNavLinks } from "@/components/admin/nav-links";

export default function AdminMobileNav({ permissions }: { permissions: string[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close only once the destination route has actually rendered, so the
  // AppLink pending overlay inside the sheet has a chance to show instead
  // of the sheet unmounting it immediately on click.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Open menu"
        className="md:hidden"
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Navigation</SheetTitle>
        <div className="flex h-16 items-center gap-2 border-b px-5">
          <div className="relative h-9 w-20">
            <Image src="/logo.jpeg" alt="Royal Laundry" fill className="object-contain" />
          </div>
          <span className="text-sm font-semibold">Staff Dashboard</span>
        </div>
        <AdminNavLinks permissions={permissions} />
      </SheetContent>
    </Sheet>
  );
}
