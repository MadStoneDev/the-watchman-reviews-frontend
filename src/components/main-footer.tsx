﻿import Link from "next/link";

export default function MainFooter({ className }: { className?: string }) {
  return (
    <footer
      className={`mt-5 md:mt-16 pt-4 md:pb-4 flex flex-col-reverse lg:flex-row items-center justify-between gap-3 border-t border-neutral-700 text-xs text-neutral-600/90 text-center md:text-left ${className}`}
    >
      <section>
        <p>© 2024 The Watchman Reviews</p>
      </section>

      <section className={`flex gap-10 text-neutral-400`}>
        <Link
          href={`/about`}
          className={`hover:text-lime-400 transition-all duration-300 ease-in-out`}
        >
          About
        </Link>
        <Link
          href={`/blog`}
          className={`hover:text-lime-400 transition-all duration-300 ease-in-out`}
        >
          Blog
        </Link>
        <Link
          href={`/privacy-policy`}
          className={`hover:text-lime-400 transition-all duration-300 ease-in-out`}
        >
          Privacy
        </Link>
        <Link
          href={`/terms-of-use`}
          className={`hover:text-lime-400 transition-all duration-300 ease-in-out`}
        >
          Terms
        </Link>
      </section>
    </footer>
  );
}
