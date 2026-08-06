"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Contact,
  Footprints,
  Images,
  LayoutDashboard,
  LogOut,
  Menu,
  Mountain,
  NotebookPen,
  Settings,
  UsersRound,
  X,
} from "lucide-react";
import { signOutAdmin } from "@/lib/admin/auth-actions";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dasbor", icon: LayoutDashboard, exact: true },
  { href: "/admin/trip", label: "Trip", icon: Mountain },
  { href: "/admin/artikel", label: "Artikel", icon: NotebookPen },
  { href: "/admin/galeri", label: "Galeri", icon: Images },
  { href: "/admin/tim", label: "Profil Tim", icon: Contact },
  { href: "/admin/pendaftar", label: "Pendaftar Trip", icon: ClipboardList },
  { href: "/admin/anggota", label: "Anggota", icon: UsersRound },
  { href: "/admin/pengaturan", label: "Pengaturan Situs", icon: Settings },
];

export function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => setIsOpen(false);

  const nav = (
    <nav className="flex flex-col gap-1" aria-label="Navigasi admin">
      {NAV.map((item) => {
        const isActive = item.exact
          ? pathname === item.href
          : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={closeMenu}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-moss-400/15 text-moss-200"
                : "text-forest-200 hover:bg-forest-900 hover:text-sand-50",
            )}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  const footer = (
    <div className="border-t border-forest-800 pt-5">
      <p className="truncate px-3.5 text-xs text-forest-300" title={email}>
        {email}
      </p>
      <form action={signOutAdmin}>
        <button
          type="submit"
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-forest-200 transition-colors hover:bg-forest-900 hover:text-sand-50"
        >
          <LogOut className="h-4 w-4" aria-hidden />
          Keluar
        </button>
      </form>
      <Link
        href="/"
        className="mt-1 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-forest-300 transition-colors hover:text-sand-50"
      >
        Lihat situs publik
      </Link>
    </div>
  );

  return (
    <>
      {/* Bilah atas — hanya tampil di layar kecil */}
      <div className="flex items-center justify-between border-b border-forest-800 bg-forest-950 px-5 py-3.5 lg:hidden">
        <span className="flex items-center gap-2.5 text-sand-50">
          <Footprints className="h-5 w-5 text-moss-300" aria-hidden />
          <span className="font-display text-sm font-semibold">Panel Admin</span>
        </span>
        <button
          type="button"
          onClick={() => setIsOpen((value) => !value)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-sand-50 hover:bg-forest-900"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="flex flex-col gap-5 border-b border-forest-800 bg-forest-950 p-5 lg:hidden">
          {nav}
          {footer}
        </div>
      )}

      {/* Sidebar tetap — layar besar */}
      <aside className="hidden w-64 shrink-0 flex-col justify-between bg-forest-950 p-5 lg:sticky lg:top-0 lg:flex lg:h-screen">
        <div>
          <Link href="/admin" className="mb-8 flex items-center gap-2.5 px-3.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-moss-400/20 text-moss-300">
              <Footprints className="h-4 w-4" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block font-display text-sm font-semibold text-sand-50">
                Panel Admin
              </span>
              <span className="block text-[0.65rem] tracking-[0.18em] text-moss-300 uppercase">
                Ruang Langkah
              </span>
            </span>
          </Link>
          {nav}
        </div>
        {footer}
      </aside>
    </>
  );
}
