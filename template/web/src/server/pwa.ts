import "server-only";
import type { CurrentUser } from "./django";
import { resumablePage } from "@/components/pwa/navigation";

// Extend here with Django ownership checks before allowing product resources.
export async function resolvePwaDestination(user: CurrentUser, path: unknown): Promise<string> {
  if (!Number.isInteger(user.id) || user.id <= 0) return "/";
  return resumablePage(path) ?? "/";
}
