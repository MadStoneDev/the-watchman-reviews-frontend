import React from "react";
import { Input } from "@/components/ui/input";
import SearchForm from "@/components/SearchForm";

export default function SearchPage() {
  return (
    <>
      <section className={`mt-20`}>
        <h1 className={`max-w-60 text-4xl font-bold`}>Search</h1>
        <SearchForm />
      </section>
    </>
  );
}
