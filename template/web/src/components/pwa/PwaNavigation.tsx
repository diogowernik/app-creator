"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { lastPageKey, resumablePage } from "./navigation";

export function PwaNavigation({ userId }: { userId: number }) {
  const path = usePathname();
  useEffect(() => {
    const page = resumablePage(path);
    if (!page) return;
    try { localStorage.setItem(lastPageKey(userId), page); }
    catch { /* Remembering navigation is optional. */ }
  }, [userId, path]);
  return null;
}
