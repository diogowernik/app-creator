import { appConfig } from "@/config/app";

export const lastPageKey = (userId: number) => `${appConfig.storagePrefix}.pwa.lastPage.${userId}`;

// Exact paths only. Dynamic resources require a server authorization policy.
export function resumablePage(path: unknown): string | null {
  if (typeof path !== "string" || !/^\/(?!\/)[a-zA-Z0-9/_-]*$/.test(path)) return null;
  if (["/login", "/pwa"].includes(path) || path === "/api" || path.startsWith("/api/")) return null;
  return appConfig.pwa.resumePaths.includes(path) ? path : null;
}
