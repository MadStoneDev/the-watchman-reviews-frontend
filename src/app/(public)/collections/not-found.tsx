import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-2xl font-semibold mb-6">
        "Houston, we have a problem. This collection doesn't exist."
      </p>
      <p className="text-neutral-400 mb-8">
        The collection you're looking for might have been deleted or never
        existed.
      </p>
    </div>
  );
}
