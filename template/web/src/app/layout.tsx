import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "__APP_NAME__", description: "__APP_DESCRIPTION__" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="pt-BR"><body>{children}</body></html>;
}
