import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: { default: "Panel Admin", template: "%s · Panel Admin" },
  robots: { index: false, follow: false },
};

// Setiap halaman admin wajib diperiksa per request. Tanpa ini, halaman yang
// tidak menyentuh cookie bisa ikut ter-prerender statis saat build.
export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: LayoutProps<"/admin">) {
  const session = await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col bg-sand-100 lg:flex-row">
      <AdminSidebar email={session.email} />
      <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:py-10">
        {children}
      </main>
    </div>
  );
}
