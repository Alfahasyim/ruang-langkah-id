import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import {
  AdminHeading,
  Badge,
  DataTable,
  EmptyState,
} from "@/components/admin/AdminUI";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { FormAlert } from "@/components/forms/Fields";
import { ButtonLink } from "@/components/ui/Button";
import { deleteArticle } from "@/lib/admin/content-actions";
import { getAllArticles } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Artikel" };

const MESSAGES: Record<string, { status: "success" | "error"; text: string }> = {
  tersimpan: { status: "success", text: "Artikel berhasil disimpan." },
  terhapus: { status: "success", text: "Artikel berhasil dihapus." },
};

const CATEGORY_LABEL: Record<string, string> = {
  perlengkapan: "Perlengkapan",
  etika: "Etika Alam Bebas",
  keselamatan: "Keselamatan",
  navigasi: "Navigasi",
};

export default async function AdminArticlePage({
  searchParams,
}: PageProps<"/admin/artikel">) {
  const params = await searchParams;
  const notice =
    typeof params.pesan === "string" ? MESSAGES[params.pesan] : undefined;

  const articles = await getAllArticles();

  return (
    <>
      <AdminHeading
        title="Panduan & Tips"
        description="Kelola artikel edukasi yang tampil di halaman Panduan."
        action={
          <ButtonLink href="/admin/artikel/baru">
            <Plus className="h-4 w-4" aria-hidden />
            Artikel baru
          </ButtonLink>
        }
      />

      {notice && (
        <div className="mb-6">
          <FormAlert status={notice.status} message={notice.text} />
        </div>
      )}

      {articles.length === 0 ? (
        <EmptyState
          title="Belum ada artikel"
          description="Tulis panduan pertama untuk membantu anggota mempersiapkan perjalanan mereka."
          action={
            <ButtonLink href="/admin/artikel/baru">
              <Plus className="h-4 w-4" aria-hidden />
              Tulis artikel
            </ButtonLink>
          }
        />
      ) : (
        <DataTable headers={["Judul", "Kategori", "Penulis", "Terbit", "Aksi"]}>
          {articles.map((article) => (
            <tr key={article.id} className="align-top">
              <td className="px-5 py-4">
                <p className="font-medium text-forest-950">{article.title}</p>
                <p className="whitespace-pre-line mt-0.5 line-clamp-2 max-w-md text-xs text-granite-500">
                  {article.excerpt}
                </p>
              </td>
              <td className="px-5 py-4 text-granite-700">
                {CATEGORY_LABEL[article.category] ?? article.category}
              </td>
              <td className="px-5 py-4 text-granite-700">
                {article.author}
                <span className="mt-0.5 block text-xs text-granite-500">
                  {article.read_minutes} menit baca
                </span>
              </td>
              <td className="px-5 py-4">
                <Badge tone={article.is_published ? "success" : "neutral"}>
                  {article.is_published ? "Terbit" : "Draf"}
                </Badge>
                <span className="mt-1.5 block text-xs text-granite-500">
                  {new Date(article.published_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </td>
              <td className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-1">
                  <Link
                    href={`/admin/artikel/${article.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-forest-700 transition-colors hover:bg-forest-50"
                  >
                    <Pencil className="h-3.5 w-3.5" aria-hidden />
                    Ubah
                  </Link>
                  <DeleteForm
                    action={deleteArticle}
                    confirmMessage={`Hapus artikel "${article.title}"? Tindakan ini tidak bisa dibatalkan.`}
                  >
                    <input type="hidden" name="id" value={article.id} />
                  </DeleteForm>
                </div>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
    </>
  );
}
