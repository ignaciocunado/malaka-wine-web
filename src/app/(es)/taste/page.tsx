import { TastePage } from "@/components/taste/taste-page";
import { tasteMetadata } from "@/lib/metadata";

export const metadata = tasteMetadata("es");

export default function Page() {
  return <TastePage lang="es" />;
}
