"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { lastPageKey, resumablePage } from "./navigation";

export function PwaLaunch({ userId }: { userId: number }) {
  const router = useRouter();
  const [attempt, setAttempt] = useState(0);
  const [error, setError] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    async function launch() {
      let destination = "/";
      try { destination = resumablePage(localStorage.getItem(lastPageKey(userId))) ?? "/"; }
      catch { /* The library works without browser storage. */ }
      try {
        if (destination !== "/") {
          const response = await fetch("/api/pwa/resume", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ path: destination }), cache: "no-store", signal: controller.signal,
          });
          if (response.status === 401) { router.replace("/login?next=/pwa"); return; }
          if (response.status === 404 || response.status === 403) destination = "/";
          else if (!response.ok) throw new Error("API unavailable");
          else destination = resumablePage((await response.json()).destination) ?? "/";
        }
        if (!controller.signal.aborted) router.replace(destination);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    void launch();
    return () => controller.abort();
  }, [userId, attempt, router]);
  return (
    <Stack role="status" spacing={2}>
      {error ? <>
        <Alert severity="error">Não foi possível abrir sua última página.</Alert>
        <Button onClick={() => { setError(false); setAttempt((value) => value + 1); }}>Tentar novamente</Button>
        <Button href="/">Abrir início</Button>
      </> : <CircularProgress aria-label="Abrindo aplicativo" />}
    </Stack>
  );
}
