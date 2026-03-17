"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-[#0a0a0a]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-op-yellow">
            Grand Line Explorer
          </span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium transition-colors hover:text-op-waterfall ${
              pathname === "/" ? "text-op-waterfall" : "text-muted-foreground"
            }`}
          >
            Islands
          </Link>
          <Link
            href="/characters"
            className={`text-sm font-medium transition-colors hover:text-op-waterfall ${
              pathname === "/characters"
                ? "text-op-waterfall"
                : "text-muted-foreground"
            }`}
          >
            Characters
          </Link>
        </div>
      </div>
    </nav>
  );
}
