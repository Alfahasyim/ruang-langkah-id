"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShieldCheck, X } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { MAIN_NAV } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Header({
  name,
  shortName,
  logoUrl,
}: {
  name: string;
  shortName: string;
  logoUrl: string | null;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-sand-50/85 backdrop-blur-md">
      <div className="hidden bg-forest-900 py-2 text-sand-100 md:block">
        <Container className="flex items-center justify-between text-xs">
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="h-3.5 w-3.5 text-moss-300" aria-hidden />
            Setiap trip dipandu leader bersertifikat & menerapkan Leave No Trace
          </p>
          <Link
            href="/panduan?kategori=keselamatan"
            className="font-medium text-moss-300 underline-offset-4 hover:underline"
          >
            Baca panduan keselamatan
          </Link>
        </Container>
      </div>

      <Container className="flex h-18 items-center justify-between gap-4">
        <Logo name={name} shortName={shortName} logoUrl={logoUrl} />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigasi utama">
          {MAIN_NAV.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-forest-100 text-forest-800"
                    : "text-granite-600 hover:bg-sand-200 hover:text-forest-800",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/gabung"
            className="hidden rounded-full px-4 py-2.5 text-sm font-semibold text-forest-800 transition-colors hover:bg-forest-100 sm:inline-flex"
          >
            Jadi Anggota
          </Link>
          <Link
            href="/trip"
            className="inline-flex items-center rounded-full bg-terracotta-500 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-terracotta-600"
          >
            Daftar Trip
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            aria-expanded={isOpen}
            aria-controls="menu-mobile"
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-forest-800 transition-colors hover:bg-sand-200 lg:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      {isOpen && (
        <div id="menu-mobile" className="border-t border-sand-200 bg-sand-50 lg:hidden">
          <Container className="flex flex-col py-3">
            {MAIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-xl px-3 py-3 text-sm font-medium text-forest-900 hover:bg-sand-200"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/gabung"
              onClick={closeMenu}
              className="mt-2 rounded-xl bg-forest-700 px-3 py-3 text-center text-sm font-semibold text-sand-50"
            >
              Jadi Anggota
            </Link>
          </Container>
        </div>
      )}
    </header>
  );
}
