import { GuidePage } from "@/components/guide/guide-pages";
import { guideMetadata } from "@/lib/metadata";

export const metadata = guideMetadata("es");

export default function Page() {
  return <GuidePage lang="es" />;
}
