import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-2xl font-semibold mb-6">
        "Sorry Mario, but the princess you're looking for is in another castle."
      </p>
      <p className="text-neutral-400 mb-8">
        This username doesn't exist in our records.
      </p>
      <Link
        href="/"
        className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}
