import Link from "next/link";
import { IconCoffee } from "@tabler/icons-react";

export default function MainFooter({ className }: { className?: string }) {
  return (
    <footer
      className={`hidden lg:flex mx-5 md:mx-10 mt-5 lg:mt-16 pt-4 lg:pb-4 flex-row items-center justify-between gap-3 border-t border-neutral-700 text-xs text-neutral-600/90 text-center lg:text-left ${className}`}
    >
      <section>
        <p>© 2025 JustReel</p>
      </section>

      <section className={`flex gap-6 lg:gap-10 items-center text-neutral-400`}>
        <a
          href="https://ko-fi.com/justreel"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-amber-400 transition-all duration-300 ease-in-out group"
        >
          <IconCoffee size={14} className="group-hover:animate-bounce" />
          <span>Support Us</span>
        </a>
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
