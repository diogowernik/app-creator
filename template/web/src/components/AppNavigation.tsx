"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { appConfig } from "@/config/app";
import { HeaderNavigation, HeaderNavigationButton } from "@/theme/workspace";
import { useShell } from "./shell/AppShell";

export function AppNavigation({ variant }: { variant: "header" | "sidebar" }) {
  const pathname = usePathname();
  const shell = useShell();
  const items = appConfig.navigation.map((item) => {
    const active = [item.href, ...(item.activePaths ?? [])].some(
      (path) => pathname === path || (path !== "/" && pathname.startsWith(`${path}/`)),
    );
    const icon = item.icon ? <item.icon /> : undefined;
    return variant === "header" ? (
      <HeaderNavigationButton
        key={item.href}
        component={Link}
        href={item.href}
        startIcon={icon}
        color="inherit"
        variant="text"
        aria-current={active ? "page" : undefined}
      >
        {item.label}
      </HeaderNavigationButton>
    ) : (
      <ListItemButton
        key={item.href}
        component={Link}
        href={item.href}
        selected={active}
        aria-current={active ? "page" : undefined}
        onNavigate={shell.closeMobileNavigation}
      >
        {icon && <ListItemIcon>{icon}</ListItemIcon>}
        <ListItemText primary={item.label} />
      </ListItemButton>
    );
  });

  if (variant === "header") {
    return (
      <HeaderNavigation component="nav" aria-label="Navegação principal">
        {items}
      </HeaderNavigation>
    );
  }
  return (
    <List component="nav" aria-label="Navegação principal">{items}</List>
  );
}
