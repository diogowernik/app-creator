"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appConfig } from "@/config/app";
import { WtreeIcon } from "./icons/WtreeIcon";
import { LogoutButton } from "./LogoutButton";

export function AppHeader() {
  const pathname = usePathname();

  return <header className="app-header">
    <div className="app-toolbar">
      <Link href="/" className="app-brand" aria-label={`${appConfig.name} — início`}>
        <WtreeIcon width={78} />
      </Link>
      <nav className="app-navigation" aria-label="Navegação principal">
        {appConfig.navigation.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <Link key={item.href} href={item.href} className={active ? "active" : undefined}
            aria-current={active ? "true" : undefined}>{item.label}</Link>;
        })}
      </nav>
      <LogoutButton />
    </div>
  </header>;
}
