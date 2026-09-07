export default function ForbiddenPage() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
      <h1 className="text-lg font-semibold">You don&apos;t have access to this page</h1>
      <p className="text-sm text-muted-foreground">Ask an admin to grant you the required permission.</p>
    </div>
  );
}
