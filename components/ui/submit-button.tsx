"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

type ButtonComponentProps = React.ComponentProps<typeof Button>;

/**
 * A submit button for `<form action={...}>` (server action or client function).
 * Auto-disables and shows a spinner for the lifetime of that form's submission,
 * so a click can never fire the action twice.
 */
export function SubmitButton({
  children,
  pendingText,
  className,
  disabled,
  ...props
}: ButtonComponentProps & { pendingText?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled} className={cn(className)} {...props}>
      {pending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
