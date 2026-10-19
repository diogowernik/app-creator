"use client";
import { useId, type ReactNode } from "react";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Collapse from "@mui/material/Collapse";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ChevronIcon } from "@/components/icons/NavigationIcons";
import { CardSectionRoot, CardSectionToggle } from "@/theme/content";
import { HeaderTitleControls } from "./HeaderControls";

export function CardSection({ title, actions, titleControls, children, expanded = true, onToggle, heading = "h2" }: {
  title: string; actions?: ReactNode; titleControls?: ReactNode; children: ReactNode;
  expanded?: boolean; onToggle?: () => void; heading?: "h1" | "h2" | "h3";
}) {
  const id = useId();
  const label = <Typography component={heading} variant="h6">{title}</Typography>;
  return <CardSectionRoot component="section" aria-label={title}>
    <CardHeader disableTypography title={<HeaderTitleControls>
      {onToggle ? <CardSectionToggle id={`${id}-heading`} aria-expanded={expanded} aria-controls={`${id}-body`} onClick={onToggle}>
        <ChevronIcon collapsed={!expanded}/>{label}
      </CardSectionToggle> : <Box id={`${id}-heading`}>{label}</Box>}
      {titleControls}
    </HeaderTitleControls>} action={actions}/>
    <Collapse in={expanded}>
      <CardContent id={`${id}-body`} aria-labelledby={`${id}-heading`} inert={!expanded}>{children}</CardContent>
    </Collapse>
  </CardSectionRoot>;
}
