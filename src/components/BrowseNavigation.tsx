"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  label: string;
  href: string;
}

export default function BrowseNavigation({
  items = [],
}: {
  items?: NavigationItem[];
}) {
  // Hooks
  const pathname = usePathname();

  // States
  const [highlightStyle, setHighlightStyle] = useState<{}>({});

  // Refs
  const browseRef = React.useRef<HTMLAnchorElement[]>([]);
  const highlightRef = React.useRef<HTMLDivElement>(null);

  // Effects
  useEffect(() => {
    const updateHighlight = () => {
      const currentLink = browseRef.current.find(
        (el) => el.getAttribute(`href`) === pathname,
      );

      if (currentLink) {
        const { offsetLeft, offsetWidth } = currentLink;
        setHighlightStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
      } else {
        setHighlightStyle({
          left: `0`,
          width: `0`,
        });
      }
    };

    updateHighlight();
    window.addEventListener(`resize`, updateHighlight);
    return () => window.removeEventListener(`resize`, updateHighlight);
  }, [pathname]);

  return (
    <section
      className={`relative flex gap-10 transition-all duration-300 ease-in-out`}
    >
      {items.map(({ label, href }, index) => (
        <Link
          key={href}
          ref={(el) => {
            if (el) {
              browseRef.current[index] = el;
            }
          }}
          href={href}
          className={`px-4 py-2 flex max-w-fit ${
            pathname === href
              ? "text-neutral-900"
              : "text-neutral-500 hover:text-lime-400"
          } font-bold transition-all duration-300 ease-in-out z-50`}
        >
          <span>{label}</span>
        </Link>
      ))}

      <div
        ref={highlightRef}
        className={`absolute top-0 h-full bg-lime-400 transition-all duration-500 ease-in-out`}
        style={{ ...highlightStyle }}
      ></div>
    </section>
  );
}
