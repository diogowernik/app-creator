"use client";
import Typography from "@mui/material/Typography";
import { appConfig } from "@/config/app";
import { CardGrid, CardGridFullWidth } from "@/components/ui/CardLayout";
import { CardSection } from "@/components/ui/CardSection";
import { PageContent } from "@/theme/content";
import { useStoredToggle } from "@/hooks/useStoredToggle";
export function HomeContent() {
  const { open, toggle } = useStoredToggle("home");
  return (
    <PageContent><CardGrid><CardGridFullWidth><CardSection title={appConfig.name} heading="h1" expanded={open} onToggle={toggle}>
        <Typography color="text.secondary">Ainda não há conteúdo.</Typography>
    </CardSection></CardGridFullWidth></CardGrid></PageContent>
  );
}
