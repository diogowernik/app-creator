import { fetchCurrentUser, isSameOrigin, noStoreJson } from "@/server/django";
import { resolvePwaDestination } from "@/server/pwa";

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return noStoreJson({}, { status: 403 });
  const input = await request.json().catch(() => null);
  if (!input || typeof input !== "object" || Array.isArray(input) || typeof input.path !== "string") {
    return noStoreJson({}, { status: 400 });
  }
  try {
    const user = await fetchCurrentUser();
    if (!user) return noStoreJson({}, { status: 401 });
    return noStoreJson({ destination: await resolvePwaDestination(user, input.path) });
  } catch {
    return noStoreJson({ detail: "Não foi possível retomar a navegação." }, { status: 502 });
  }
}
