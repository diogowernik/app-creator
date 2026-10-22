import { AppHeader } from "@/components/AppHeader";
import { AppNavigation } from "@/components/AppNavigation";
import { AppShell } from "@/components/shell/AppShell";
import { cookies } from "next/headers";
import { appConfig } from "@/config/app";
import { PwaNavigation } from "@/components/pwa/PwaNavigation";
import { DeviceLockProvider } from "@/features/device-lock/DeviceLockProvider";
import { deviceLockCookie } from "@/features/device-lock/preferences";
import { requireUser } from "@/server/auth";
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const lockEnabled = appConfig.deviceLock.available && Boolean((await cookies()).get(deviceLockCookie(user.id))?.value);
  return (
    <DeviceLockProvider key={user.id} initialEnabled={lockEnabled}>
    <PwaNavigation userId={user.id} />
    <AppShell header={<AppHeader />} navigation={<AppNavigation variant="sidebar" />}>
      {children}
    </AppShell>
    </DeviceLockProvider>
  );
}
