import { notFound } from "next/navigation";

import { TopicPage } from "@/components/guide/guide-pages";
import { TOPIC_SLUGS, getGuide } from "@/lib/content/guide";
import { topicMetadata } from "@/lib/metadata";

// One static page per wine area and grape; any other slug is a 404.
export const dynamicParams = false;
export const generateStaticParams = () => TOPIC_SLUGS.map((slug) => ({ slug }));

const findTopic = (slug: string) => getGuide("en").topics.find((topic) => topic.slug === slug);

export async function generateMetadata({ params }: PageProps<"/en/malaga-wines/[slug]">) {
  const topic = findTopic((await params).slug);
  return topic ? topicMetadata("en", topic) : {};
}

export default async function Page({ params }: PageProps<"/en/malaga-wines/[slug]">) {
  const topic = findTopic((await params).slug);
  if (!topic) notFound();
  return <TopicPage lang="en" topic={topic} />;
}
