"use client";

import Link, { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "cn";

/**
 * Drop-in replacement for next/link's <Link> that shows a loading overlay
 * on itself the moment it's clicked, and keeps showing it until the
 * destination route has actually finished rendering (Next.js's own
 * pending-navigation signal, not a guess/timeout). This gives every link
 * in the app the same "working on it" feedback so a user never has a
 * reason to click twice.
 */
export function AppLink({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Link>) {
  return (
    <Link className={cn("relative", className)} {...props}>
      {children}
      <PendingOverlay />
    </Link>
  );
}

function PendingOverlay() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span
      className="absolute inset-0 z-10 flex items-center justify-center rounded-[inherit] bg-background/70 backdrop-blur-[1px]"
      aria-hidden="true"
    >
      <Loader2 className="size-4 animate-spin text-foreground" />
    </span>
  );
}
