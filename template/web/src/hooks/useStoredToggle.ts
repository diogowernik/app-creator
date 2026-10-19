"use client";
import { useEffect, useState } from "react";
import { appConfig } from "@/config/app";

export function useStoredToggle(name: string, defaultOpen = true) {
  const key = `${appConfig.storagePrefix}.toggle.${name}`;
  const [preference, setPreference] = useState<{ key: string; open: boolean } | null>(null);
  const open = preference?.key === key ? preference.open : defaultOpen;
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      try {
        const saved = localStorage.getItem(key);
        if (active && (saved === "true" || saved === "false")) {
          setPreference(current => current?.key === key ? current : { key, open: saved === "true" });
        }
      } catch { /* Storage never blocks the control. */ }
    });
    return () => { active = false; };
  }, [key]);
  function toggle() {
    const next = !open;
    setPreference({ key, open: next });
    try { localStorage.setItem(key, String(next)); } catch { /* Keep working without persistence. */ }
  }
  return { open, toggle };
}
