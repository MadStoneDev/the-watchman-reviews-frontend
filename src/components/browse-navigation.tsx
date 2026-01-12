"use client";

import React, { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavigationItem {
  label: string;
  href: string;
  textColor?: string;
  bgColor?: string;
}

export default function BrowseNavigation({
  items = [],
  profileId,
  currentUserId,
}: {
  items?: NavigationItem[];
  profileId?: string;
  currentUserId?: string;
}) {
  const pathname = usePathname();

  const [highlightStyle, setHighlightStyle] = useState<{}>({});
  const [highlightColor, setHighlightColor] = useState<string>("bg-lime-400"); // NEW

  const browseRef = React.useRef<HTMLAnchorElement[]>([]);
  const highlightRef = React.useRef<HTMLDivElement>(null);

  const isOwnProfile =
    profileId &&
    currentUserId &&
    currentUserId !== "" &&
    profileId === currentUserId;
  const navigationItems = isOwnProfile
    ? [...items, { label: "Settings", href: "/settings", textColor: "hover:text-neutral-300", bgColor: "bg-neutral-300" }]
    : items;

  useEffect(() => {
    const updateHighlight = () => {
      const currentLink = browseRef.current.find(
        (el) => el.getAttribute(`href`) === pathname,
      );

      const getIndex = navigationItems
        .map((item) => item.href)
        .indexOf(pathname);

      if (currentLink) {
        const { offsetLeft, offsetWidth } = currentLink;
        setHighlightStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`,
        });
        setHighlightColor(
          navigationItems[getIndex]?.bgColor
            ? navigationItems[getIndex].bgColor
            : "bg-lime-400",
        );
      } else {
        setHighlightStyle({
          left: `0`,
          width: `0`,
        });
        setHighlightColor("bg-lime-400");
      }
    };

    updateHighlight();
    window.addEventListener(`resize`, updateHighlight);
    return () => window.removeEventListener(`resize`, updateHighlight);
  }, [pathname, items, profileId, currentUserId]);

  return (
    <nav
      className={`pb-3 relative flex gap-5 md:gap-10 border-b border-neutral-700 transition-all duration-300 ease-in-out`}
    >
      {navigationItems.map(({ label, href, textColor }, index) => (
        <Link
          key={href}
          ref={(el) => {
            if (el) {
              browseRef.current[index] = el;
            }
          }}
          href={href}
          className={`px-2 md:px-4 py-2 flex max-w-fit ${
            pathname === href
              ? "text-neutral-900"
              : `text-neutral-500 ${textColor ? textColor : "hover:text-lime-400"}`
          } text-sm md:text-base font-bold transition-all duration-300 ease-in-out z-50`}
        >
          <span>{label}</span>
        </Link>
      ))}

      <div
        ref={highlightRef}
        className={`absolute top-0 bottom-3 transition-all duration-300 ease-in-out ${highlightColor}`}
        style={{ ...highlightStyle }}
      ></div>
    </nav>
  );
}
