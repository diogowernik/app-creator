import { requireUser } from "@/server/auth";
import { HomeContent } from "@/components/HomeContent";
export default async function HomePage() {
  await requireUser();
  return <HomeContent />;
}
