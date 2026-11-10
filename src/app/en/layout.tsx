import { RootDocument, rootMetadata, rootViewport } from "@/components/site/root-document";

export const metadata = rootMetadata;
export const viewport = rootViewport;

export default function Layout({ children }: LayoutProps<"/en">) {
  return <RootDocument lang="en">{children}</RootDocument>;
}
