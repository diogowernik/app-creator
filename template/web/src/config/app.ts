import type { AppIdentity } from "@/theme/types";
export const appConfig = {
  name: "__APP_NAME__",
  storagePrefix: "__APP_SLUG__",
  navigation: [{ label: "Início", href: "/", activePaths: [] as string[] }],
  identity: {
    primary: { main: "#1976d2", dark: "#115293", light: "#4791db" },
    header: "#1976d2",
    headerText: "#ffffff",
    cardTitle: "#2858a5",
  } satisfies AppIdentity,
};
