"use client";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { WtreeIcon } from "./icons/WtreeIcon";
import { LogoutButton } from "./LogoutButton";
import { SidebarIcon } from "./icons/NavigationIcons";
import { appConfig } from "@/config/app";
import { AppNavigation } from "./AppNavigation";
import { useShell } from "./shell/AppShell";
export function AppHeader() {
  const shell = useShell();
  return (
    <AppBar
      position="static"
      sx={(theme) => ({
        bgcolor: theme.app.header,
        color: theme.app.headerText,
        boxShadow: "0 2px 5px rgb(0 0 0 / 16%)",
        zIndex: theme.zIndex.drawer + 1,
      })}
    >
      <Toolbar sx={{ gap: { xs: 1, md: 2 }, minHeight: { xs: 56, sm: 64 } }}>
        {shell.hasLeft && (
          <IconButton
            color="inherit"
            aria-label={
              shell.leftOpen ? "Recolher navegação" : "Mostrar navegação"
            }
            aria-expanded={shell.leftOpen}
            aria-controls="app-left-panel"
            onClick={shell.toggleLeft}
          >
            <SidebarIcon />
          </IconButton>
        )}
        <Box
          component={Link}
          href="/"
          aria-label={`${appConfig.name} — início`}
          sx={{ display: "flex", flexShrink: 0 }}
        >
          <WtreeIcon width={78} />
        </Box>
        {shell.navigationInSidebar
          ? <Box sx={{ flex: 1 }} />
          : <AppNavigation variant="header" />}
        {!shell.navigationInSidebar && <LogoutButton />}
        {shell.hasRight && (
          <IconButton
            color="inherit"
            aria-label={`${shell.rightOpen ? "Ocultar" : "Mostrar"} ${shell.rightLabel.toLocaleLowerCase("pt-BR")}`}
            aria-expanded={shell.rightOpen}
            aria-controls="app-right-panel"
            onClick={shell.toggleRight}
          >
            <SidebarIcon side="right" />
          </IconButton>
        )}
      </Toolbar>
    </AppBar>
  );
}
