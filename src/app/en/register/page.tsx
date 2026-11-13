import { InterestPage } from "@/components/interest/interest-page";
import { interestMetadata } from "@/lib/metadata";

export const metadata = interestMetadata("en");

export default function Page() {
  return <InterestPage lang="en" />;
}
