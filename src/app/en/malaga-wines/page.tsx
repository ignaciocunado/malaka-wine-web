import { GuidePage } from "@/components/guide/guide-pages";
import { guideMetadata } from "@/lib/metadata";

export const metadata = guideMetadata("en");

export default function Page() {
  return <GuidePage lang="en" />;
}
