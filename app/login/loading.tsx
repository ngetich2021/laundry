import { Skeleton } from "@/components/ui/skeleton";

export default function LoginLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm space-y-4 rounded-xl border bg-background p-6">
        <Skeleton className="mx-auto h-14 w-28" />
        <Skeleton className="mx-auto h-5 w-32" />
        <Skeleton className="mx-auto h-4 w-48" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}
