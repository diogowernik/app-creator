import { AppHeader } from "@/components/AppHeader";
import { AppShell } from "@/components/shell/AppShell";
import { requireUser } from "@/server/auth";
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return <AppShell header={<AppHeader />}>{children}</AppShell>;
}
