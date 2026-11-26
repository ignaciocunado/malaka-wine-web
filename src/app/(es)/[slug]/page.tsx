import { notFound } from "next/navigation";

import { CustomPage } from "@/components/page/custom-page";
import { findPage, pageParams } from "@/lib/content/pages";
import { customPageMetadata } from "@/lib/metadata";

// One static page per page created in the CMS; any other address is a 404.
export const dynamicParams = false;
export const generateStaticParams = () => pageParams("es");

export async function generateMetadata({ params }: PageProps<"/[slug]">) {
  const page = findPage("es", (await params).slug);
  return page ? customPageMetadata("es", page) : {};
}

export default async function Page({ params }: PageProps<"/[slug]">) {
  const page = findPage("es", (await params).slug);
  if (!page) notFound();
  return <CustomPage page={page.es} />;
}
