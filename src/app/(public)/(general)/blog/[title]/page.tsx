import React from "react";
import type { Metadata } from "next";

interface BlogArticlePageProps {
  params: Promise<{ title: string }>;
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { title } = await params;

  // Convert URL slug to readable title (e.g., "my-article-title" -> "My Article Title")
  const readableTitle = title
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    title: `${readableTitle} | JustReel`,
    description: `Read ${readableTitle} on the JustReel blog.`,
  };
}

export default async function BlogArticlePage({ params }: BlogArticlePageProps) {
  const { title } = await params;

  const readableTitle = title
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <>
      <section
        className={`mt-6 lg:mt-8 transition-all duration-300 ease-in-out`}
      >
        <h1 className={`max-w-60 text-2xl sm:3xl md:text-4xl font-bold`}>
          {readableTitle}
        </h1>
      </section>
    </>
  );
}
