import { requireUser } from "@/server/auth";

export default async function HomePage() {
  await requireUser();
  return <section><h1>__APP_NAME__</h1><p>Ainda não há conteúdo.</p></section>;
}
