import { PrivacyPage } from "@/components/legal/privacy-page";
import { privacyMetadata } from "@/lib/metadata";

export const metadata = privacyMetadata("es");

export default function Page() {
  return <PrivacyPage lang="es" />;
}
