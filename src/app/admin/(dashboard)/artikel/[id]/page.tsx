import { notFound } from "next/navigation";
import { AdminHeading } from "@/components/admin/AdminUI";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { getArticleById } from "@/lib/admin/queries";

export const dynamic = "force-dynamic";

export const metadata = { title: "Ubah Artikel" };

export default async function EditArticlePage({
  params,
}: PageProps<"/admin/artikel/[id]">) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) notFound();

  return (
    <div className="max-w-3xl">
      <AdminHeading title="Ubah artikel" description={article.title} />
      <ArticleForm article={article} />
    </div>
  );
}
