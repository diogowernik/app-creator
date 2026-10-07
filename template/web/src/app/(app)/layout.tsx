import { AppHeader } from "@/components/AppHeader";
import { requireUser } from "@/server/auth";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  await requireUser();
  return <>
    <AppHeader />
    <main className="workspace">{children}</main>
  </>;
}
