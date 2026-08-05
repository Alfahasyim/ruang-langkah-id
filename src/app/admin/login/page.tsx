import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Footprints } from "lucide-react";
import { LoginForm } from "@/components/admin/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Masuk Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage({
  searchParams,
}: PageProps<"/admin/login">) {
  const params = await searchParams;
  const raw = typeof params.lanjut === "string" ? params.lanjut : "/admin";
  const next = raw.startsWith("/admin") ? raw : "/admin";

  return (
    <div className="flex min-h-screen items-center justify-center bg-forest-950 px-5 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-400/20 text-moss-300">
            <Footprints className="h-6 w-6" aria-hidden />
          </span>
          <h1 className="mt-5 font-display text-2xl font-semibold text-sand-50">
            Panel Admin
          </h1>
          <p className="mt-2 text-sm text-forest-200">
            Ruang Langkah Indonesia
          </p>
        </div>

        <div className="rounded-3xl bg-sand-50 p-8">
          {isSupabaseConfigured ? (
            <LoginForm next={next} />
          ) : (
            <div className="text-sm leading-relaxed text-granite-700">
              <p className="font-semibold text-forest-950">
                Supabase belum terhubung.
              </p>
              <p className="mt-2">
                Isi <code className="rounded bg-sand-200 px-1.5 py-0.5">.env.local</code>{" "}
                dengan kredensial proyekmu, jalankan{" "}
                <code className="rounded bg-sand-200 px-1.5 py-0.5">schema.sql</code> dan{" "}
                <code className="rounded bg-sand-200 px-1.5 py-0.5">admin.sql</code> di
                SQL Editor, lalu jalankan ulang server.
              </p>
            </div>
          )}
        </div>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 text-sm text-forest-200 transition-colors hover:text-sand-50"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Kembali ke situs
        </Link>
      </div>
    </div>
  );
}
