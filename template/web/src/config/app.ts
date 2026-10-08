import type { AppIdentity } from "@/theme/types";
export const appConfig = {
  name: "__APP_NAME__",
  navigation: [{ label: "Início", href: "/", activePaths: [] as string[] }],
  identity: {
    primary: { main: "#4b555d", dark: "#30383e", light: "#77828a" },
    header: "#4b555d",
    headerText: "#ffffff",
    cardTitle: "#394148",
  } satisfies AppIdentity,
};
