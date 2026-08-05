"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, Save } from "lucide-react";
import {
  CheckboxRow,
  Field,
  FormAlert,
  Input,
  Select,
  Textarea,
} from "@/components/forms/Fields";
import { Button } from "@/components/ui/Button";
import { saveArticle } from "@/lib/admin/content-actions";
import { INITIAL_FORM_STATE } from "@/lib/form-state";

type ArticleRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string | null;
  read_minutes: number;
  author: string;
  published_at: string;
  is_published: boolean;
};

const CATEGORIES = [
  { value: "perlengkapan", label: "Perlengkapan" },
  { value: "etika", label: "Etika Alam Bebas" },
  { value: "keselamatan", label: "Keselamatan" },
  { value: "navigasi", label: "Navigasi" },
];

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" size="lg" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Menyimpan…
        </>
      ) : (
        <>
          <Save className="h-4 w-4" aria-hidden />
          {isEdit ? "Simpan perubahan" : "Terbitkan artikel"}
        </>
      )}
    </Button>
  );
}

export function ArticleForm({ article }: { article?: ArticleRow }) {
  const [state, formAction] = useActionState(saveArticle, INITIAL_FORM_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-8" noValidate>
      {article && <input type="hidden" name="id" value={article.id} />}

      {state.status === "error" && (
        <FormAlert status="error" message={state.message} />
      )}

      <section className="rounded-2xl border border-sand-300 bg-white p-6">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Judul artikel"
            htmlFor="title"
            required
            error={errors.title}
            className="sm:col-span-2"
          >
            <Input id="title" name="title" defaultValue={article?.title} required />
          </Field>

          <Field
            label="Slug URL"
            htmlFor="slug"
            hint="Kosongkan untuk dibuat otomatis dari judul."
            className="sm:col-span-2"
          >
            <Input id="slug" name="slug" defaultValue={article?.slug} />
          </Field>

          <Field label="Kategori" htmlFor="category" required error={errors.category}>
            <Select
              id="category"
              name="category"
              defaultValue={article?.category ?? ""}
              required
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {CATEGORIES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Penulis" htmlFor="author" required error={errors.author}>
            <Input id="author" name="author" defaultValue={article?.author} required />
          </Field>

          <Field
            label="Estimasi baca (menit)"
            htmlFor="read_minutes"
            required
            error={errors.read_minutes}
          >
            <Input
              id="read_minutes"
              name="read_minutes"
              type="number"
              min={1}
              defaultValue={article?.read_minutes ?? 5}
              required
            />
          </Field>

          <Field label="Tanggal terbit" htmlFor="published_at">
            <Input
              id="published_at"
              name="published_at"
              type="date"
              defaultValue={
                article?.published_at ?? new Date().toISOString().slice(0, 10)
              }
            />
          </Field>

          <Field
            label="Ringkasan"
            htmlFor="excerpt"
            hint="Tampil di kartu artikel halaman Panduan."
            required
            error={errors.excerpt}
            className="sm:col-span-2"
          >
            <Textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={article?.excerpt}
              required
            />
          </Field>

          <Field
            label="Isi artikel"
            htmlFor="body"
            hint="Opsional. Disimpan untuk halaman detail artikel di kemudian hari."
            className="sm:col-span-2"
          >
            <Textarea id="body" name="body" rows={10} defaultValue={article?.body ?? ""} />
          </Field>
        </div>

        <div className="mt-5">
          <CheckboxRow
            name="is_published"
            defaultChecked={article?.is_published ?? true}
            label="Terbitkan artikel ini (hilangkan centang untuk menyimpan sebagai draf)"
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton isEdit={Boolean(article)} />
        <Link
          href="/admin/artikel"
          className="rounded-full px-5 py-3 text-sm font-semibold text-granite-600 transition-colors hover:bg-sand-200"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
