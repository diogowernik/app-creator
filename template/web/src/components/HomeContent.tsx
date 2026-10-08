"use client";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { appConfig } from "@/config/app";
export function HomeContent() {
  return (
    <Card>
      <CardHeader
        title={appConfig.name}
        slotProps={{ title: { component: "h1", variant: "h6" } }}
      />
      <CardContent>
        <Typography color="text.secondary">Ainda não há conteúdo.</Typography>
      </CardContent>
    </Card>
  );
}
