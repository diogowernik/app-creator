import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import ButtonBase from "@mui/material/ButtonBase";
import { styled } from "@mui/material/styles";

export const PageContent = styled(Stack, {
  shouldForwardProp: prop => prop !== "wide",
})<{ wide?: boolean }>(({ theme, wide }) => ({
  width: "100%", maxWidth: wide ? undefined : theme.app.layout.contentWidth,
  marginInline: "auto", minWidth: 0, containerType: "inline-size",
}));
export const CardSectionRoot = styled(Card)({ minWidth: 0 }) as typeof Card;
export const CardSectionToggle = styled(ButtonBase)(({ theme }) => ({
  display: "flex", alignItems: "center", gap: theme.spacing(1), minWidth: 0, textAlign: "left",
  "& .navigation-chevron": { transition: "transform .15s", "&.collapsed": { transform: "rotate(-90deg)" } },
}));
