import Image from "next/image";
import { redirect } from "next/navigation";
import { signIn, auth } from "@/lib/auth";
import { SubmitButton } from "@/components/ui/submit-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ERROR_MESSAGES: Record<string, string> = {
  AccessDenied: "That Google account isn't authorized for the staff dashboard. Ask an admin to invite you.",
  Configuration: "Sign-in isn't configured correctly. Contact an admin.",
  Default: "Something went wrong signing you in. Please try again.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}) {
  const session = await auth();
  const { error, callbackUrl } = await searchParams;

  if (session?.user) {
    redirect(callbackUrl || "/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="relative mb-2 h-14 w-28">
            <Image src="/logo.jpeg" alt="Royal Laundry" fill className="object-contain" />
          </div>
          <CardTitle>Staff Dashboard</CardTitle>
          <CardDescription>Sign in with your Google account to continue</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-center text-sm text-destructive">
              {ERROR_MESSAGES[error] ?? ERROR_MESSAGES.Default}
            </p>
          )}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: callbackUrl || "/admin" });
            }}
          >
            <SubmitButton className="w-full" size="lg" pendingText="Redirecting to Google...">
              Continue with Google
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
