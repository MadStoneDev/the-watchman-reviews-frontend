import React from "react";
import { IconSquarePlus } from "@tabler/icons-react";
import Link from "next/link";
import CollectionBlock from "@/src/components/collections-block";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;

  return {
    title: `Collections | The Watchman Reviews`,
    description: `Collections on The Watchman Reviews`,
  };
}

export default function CollectionPage() {
  return (
    <section
      className={`mt-14 lg:mt-20 mb-6 transition-all duration-300 ease-in-out`}
    >
      <h1 className={`max-w-64 text-2xl sm:3xl md:text-4xl font-bold`}>
        Collection
      </h1>

      <CollectionBlock />
    </section>
  );
}
