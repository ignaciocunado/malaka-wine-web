import { HomePage } from "@/components/landing/home-page";
import { homeMetadata } from "@/lib/metadata";

export const metadata = homeMetadata("en");

export default function Page() {
  return <HomePage lang="en" />;
}
