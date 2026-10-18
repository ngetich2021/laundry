"use client";

import { useState } from "react";
import { CalendarCheck } from "lucide-react";
import Book from "@/components/Book";

/** "Book a pickup" button that opens the existing booking form. */
export default function BookButton({
  label = "Book a pickup",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:from-sky-600 hover:to-blue-700 ${className}`}
      >
        <CalendarCheck className="size-5" />
        {label}
      </button>
      <Book isOpen={open} onClose={() => setOpen(false)} />
    </>
  );
}
