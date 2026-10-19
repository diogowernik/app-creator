"use client";
import type { ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "@/theme";
import { appConfig } from "@/config/app";
import { FeedbackProvider } from "./ui/FeedbackProvider";
const theme = createAppTheme(appConfig.identity);
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FeedbackProvider>{children}</FeedbackProvider>
    </ThemeProvider>
  );
}
