import Link from "next/link";
import React from "react";

async function getStrapiData(path: string) {
  const baseUrl = "http://localhost:1337";
  try {
    const response = await fetch(`${baseUrl}${path}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page");
  console.log(strapiData);

  const { title, description } = strapiData.data.attributes;

  return (
    <>
      <h1 className={`text-5xl font-bold`}>{title}</h1>
      <p className={`mt-4 text-xl`}>{description}</p>
    </>
  );
}
