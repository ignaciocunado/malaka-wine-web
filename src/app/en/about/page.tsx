import { AboutPage } from "@/components/about/about-page";
import { aboutMetadata } from "@/lib/metadata";

export const metadata = aboutMetadata("en");

export default function Page() {
  return <AboutPage lang="en" />;
}
