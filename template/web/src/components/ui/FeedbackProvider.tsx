"use client";
import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert, { type AlertColor } from "@mui/material/Alert";

type Notify = (message: string, severity?: AlertColor) => void;
const FeedbackContext = createContext<Notify | null>(null);
export function useFeedback() {
  const notify = useContext(FeedbackContext);
  if (!notify) throw new Error("FeedbackProvider ausente.");
  return { notify };
}
export function FeedbackProvider({ children }: { children: ReactNode }) {
  const [feedback, setFeedback] = useState<{ id: number; message: string; severity: AlertColor } | null>(null);
  const sequence = useRef(0);
  const notify = useCallback<Notify>((message, severity = "success") => {
    setFeedback({ id: ++sequence.current, message, severity });
  }, []);
  return <FeedbackContext.Provider value={notify}>
    {children}
    <Snackbar key={feedback?.id ?? "empty"} open={Boolean(feedback)} autoHideDuration={feedback?.severity === "error" ? null : 5000}
      onClose={(_, reason) => { if (reason !== "clickaway") setFeedback(null); }}>
      {feedback ? <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>{feedback.message}</Alert> : undefined}
    </Snackbar>
  </FeedbackContext.Provider>;
}
