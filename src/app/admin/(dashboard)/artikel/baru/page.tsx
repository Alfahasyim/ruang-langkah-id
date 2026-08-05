import { AdminHeading } from "@/components/admin/AdminUI";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Artikel Baru" };

export default async function NewArticlePage() {
  await requireAdmin();

  return (
    <div className="max-w-3xl">
      <AdminHeading
        title="Tulis artikel baru"
        description="Ringkasan adalah bagian yang tampil di kartu halaman Panduan, jadi buat semenarik mungkin."
      />
      <ArticleForm />
    </div>
  );
}
