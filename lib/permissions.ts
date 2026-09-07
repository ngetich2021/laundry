import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function getSession() {
  return auth();
}

export async function requireSession() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requirePermission(key: string) {
  const session = await requireSession();
  if (!session.user.permissions?.includes(key)) {
    redirect("/admin/forbidden");
  }
  return session;
}

export function hasPermission(session: { user?: { permissions?: string[] } } | null, key: string) {
  return !!session?.user?.permissions?.includes(key);
}
