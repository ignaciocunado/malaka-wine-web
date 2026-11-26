import { AboutPage } from "@/components/about/about-page";
import { aboutMetadata } from "@/lib/metadata";

export const metadata = aboutMetadata("es");

export default function Page() {
  return <AboutPage lang="es" />;
}
