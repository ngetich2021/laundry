"use client";

import { MoreVertical, Eye, Pencil, Trash2 } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function RowActions({
  onView,
  onEdit,
  onDelete,
  viewLabel = "View",
  editLabel = "Edit",
  deleteLabel = "Delete",
  disabled,
}: {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
  disabled?: boolean;
}) {
  if (!onView && !onEdit && !onDelete) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Row actions"
        disabled={disabled}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        className={cn(buttonVariants({ variant: "ghost", size: "icon-sm" }))}
      >
        <MoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        {onView && (
          <DropdownMenuItem onClick={onView}>
            <Eye /> {viewLabel}
          </DropdownMenuItem>
        )}
        {onEdit && (
          <DropdownMenuItem onClick={onEdit}>
            <Pencil /> {editLabel}
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem variant="destructive" onClick={onDelete}>
            <Trash2 /> {deleteLabel}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
