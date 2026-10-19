import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";

export const WorkspaceRoot = styled(Box)({
  height: "100dvh",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});
export const WorkspaceColumns = styled(Box)({
  display: "flex",
  flex: 1,
  minHeight: 0,
});
export const NavigationBoundary = styled(Box)({ display: "contents" });
export const WorkspaceMain = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  overflowY: "auto",
  padding: theme.spacing(2.5, 3),
  [theme.breakpoints.down("md")]: { padding: theme.spacing(2) },
})) as typeof Box;
export const WorkspaceDrawer = styled(Drawer, {
  shouldForwardProp: (prop) =>
    !["panelSide", "docked", "expanded"].includes(String(prop)),
})<{ panelSide: "left" | "right"; docked: boolean; expanded: boolean }>(({
  theme,
  panelSide,
  docked,
  expanded,
}) => {
  const width =
    panelSide === "left"
      ? theme.app.layout.leftWidth
      : docked
        ? theme.app.layout.rightWidth
        : theme.app.layout.rightOverlayWidth;
  return {
    width: docked && expanded ? width : 0,
    flexShrink: 0,
    overflow: "hidden",
    height: "100%",
    "& .MuiDrawer-paper": {
      position: docked ? "relative" : "fixed",
      top: docked ? 0 : 56,
      width,
      maxWidth: "calc(100vw - 48px)",
      height: docked ? "100%" : "calc(100% - 56px)",
      backgroundColor:
        panelSide === "left"
          ? theme.app.surfaces.sidebar
          : theme.app.surfaces.reading,
      boxShadow: "none",
      display: docked && !expanded ? "none" : undefined,
      [theme.breakpoints.up("sm")]: {
        top: docked ? 0 : 64,
        height: docked ? "100%" : "calc(100% - 64px)",
      },
    },
  };
});
export const PanelCloseButton = styled(Button)(({ theme }) => ({
  alignSelf: "flex-end",
  margin: theme.spacing(1),
}));
export const PreviewPanel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  overflowWrap: "anywhere",
  [theme.breakpoints.down("sm")]: { padding: theme.spacing(2) },
}));
