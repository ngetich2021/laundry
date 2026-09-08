"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PwaInstallButton({
  className,
  iconOnly,
}: {
  className?: string;
  iconOnly?: boolean;
}) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    }
    function onInstalled() {
      setPromptEvent(null);
    }
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (!promptEvent) return null;

  async function onClick() {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  }

  return (
    <button
      onClick={onClick}
      aria-label="Install app"
      title="Install app"
      className={
        className ??
        "flex items-center gap-1.5 rounded-full border border-indigo-200 px-4 py-2 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
      }
    >
      <Download size={18} />
      {!iconOnly && <span className="hidden sm:inline">Install App</span>}
    </button>
  );
}
