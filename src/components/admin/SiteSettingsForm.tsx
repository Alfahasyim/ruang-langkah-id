"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Loader2, Save } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { SocialLinksEditor } from "@/components/admin/SocialLinksEditor";
import { Field, FormAlert, Input, Select, Textarea } from "@/components/forms/Fields";
import { Button } from "@/components/ui/Button";
import { saveSiteSettings } from "@/lib/admin/settings-actions";
import { INITIAL_FORM_STATE } from "@/lib/form-state";
import type { SiteSettings } from "@/lib/settings";

function SubmitButton() {
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
          Simpan pengaturan
        </>
      )}
    </Button>
  );
}

export function SiteSettingsForm({
  settings,
  logoUrl,
  bannerUrl,
}: {
  settings: SiteSettings;
  logoUrl: string | null;
  bannerUrl: string | null;
}) {
  const [state, formAction] = useActionState(saveSiteSettings, INITIAL_FORM_STATE);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-8" noValidate>
      {state.status === "error" && (
        <FormAlert status="error" message={state.message} />
      )}

      <section className="rounded-2xl border border-sand-300 bg-white p-6">
        <h2 className="mb-5 font-semibold text-forest-950">Identitas komunitas</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nama lengkap" htmlFor="name" required error={errors.name}>
            <Input id="name" name="name" defaultValue={settings.name} required />
          </Field>

          <Field
            label="Nama pendek"
            htmlFor="short_name"
            hint="Dipakai di logo dan akhiran judul tab browser."
            required
            error={errors.short_name}
          >
            <Input
              id="short_name"
              name="short_name"
              defaultValue={settings.short_name}
              required
            />
          </Field>

          <Field
            label="Tagline"
            htmlFor="tagline"
            hint="Tampil di footer. Boleh lebih dari satu baris — tekan Enter untuk baris baru."
            required
            error={errors.tagline}
            className="sm:col-span-2"
          >
            <Textarea
              id="tagline"
              name="tagline"
              rows={3}
              defaultValue={settings.tagline}
              required
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-sand-300 bg-white p-6">
        <h2 className="mb-5 font-semibold text-forest-950">Kontak</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={settings.email ?? ""}
              placeholder="halo@ruanglangkah.id"
            />
          </Field>

          <Field label="Nomor telepon / WhatsApp" htmlFor="phone">
            <Input
              id="phone"
              name="phone"
              defaultValue={settings.phone ?? ""}
              placeholder="+62 812-3456-7890"
            />
          </Field>

          <Field
            label="Alamat basecamp"
            htmlFor="address"
            hint="Boleh beberapa baris — tekan Enter untuk memisahkan jalan, kota, dan kode pos."
            className="sm:col-span-2"
          >
            <Textarea
              id="address"
              name="address"
              rows={3}
              defaultValue={settings.address ?? ""}
              placeholder={"Jl. Rimbawan No. 17\nBogor, Jawa Barat 16680"}
            />
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-sand-300 bg-white p-6">
        <h2 className="mb-5 font-semibold text-forest-950">Logo komunitas</h2>

        <div className="mb-5 rounded-xl bg-sand-100 p-4 text-sm leading-relaxed text-granite-700">
          <p className="font-semibold text-forest-950">Ketentuan berkas logo</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Bentuk:</strong> persegi (rasio 1:1). Logo memanjang akan
              terpotong karena ditampilkan dalam kotak.
            </li>
            <li>
              <strong>Resolusi ideal:</strong> 512 × 512 piksel. Minimal 256 × 256
              agar tidak pecah di layar beresolusi tinggi.
            </li>
            <li>
              <strong>Format:</strong> PNG atau SVG dengan latar transparan
              (disarankan), atau WebP/JPG bila latar solid tidak masalah.
            </li>
            <li>
              <strong>Ukuran berkas:</strong> maksimal 2 MB.
            </li>
            <li>
              <strong>Ruang kosong:</strong> sisakan sedikit margin di tepi logo —
              gambar yang mepet ke tepi akan terlihat sesak di dalam kotak.
            </li>
          </ul>
          <p className="mt-3 text-xs text-granite-500">
            Logo ini dipakai di header, footer, dan ikon tab browser (favicon).
            Bila dikosongkan, situs memakai ikon jejak kaki bawaan.
          </p>
        </div>

        <ImageUploadField
          name="logo_path"
          inputId="logo"
          bucket="situs"
          label="Berkas logo"
          allowSvg
          maxBytes={2 * 1024 * 1024}
          currentUrl={logoUrl}
          error={errors.logo}
          hint="Pilih berkas baru untuk mengganti logo yang sedang dipakai."
        />
      </section>

      <section className="rounded-2xl border border-sand-300 bg-white p-6">
        <h2 className="mb-2 font-semibold text-forest-950">Banner beranda</h2>
        <p className="mb-5 text-sm leading-relaxed text-granite-600">
          Gambar latar di bagian paling atas beranda, di belakang judul besar.
        </p>

        <div className="mb-5 rounded-xl bg-sand-100 p-4 text-sm leading-relaxed text-granite-700">
          <p className="font-semibold text-forest-950">Ketentuan berkas banner</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <strong>Bentuk:</strong> lanskap (mendatar), rasio sekitar 21:9
              sampai 16:9.
            </li>
            <li>
              <strong>Resolusi ideal:</strong> 2400 × 1100 piksel. Minimal
              1600 × 800 agar tidak pecah di layar lebar.
            </li>
            <li>
              <strong>Format:</strong> JPG atau WebP (paling hemat untuk foto).
              PNG boleh, tapi ukurannya jauh lebih besar.
            </li>
            <li>
              <strong>Ukuran berkas:</strong> maksimal 4 MB. Kompres dulu bila
              lebih besar — banner ikut menentukan cepat-lambatnya beranda dimuat.
            </li>
            <li>
              <strong>Komposisi:</strong> tulisan hero berada di{" "}
              <strong>sisi kiri</strong>. Pilih foto yang bagian kirinya relatif
              lapang — langit, kabut, atau bidang polos — dan letakkan objek utama
              di sisi kanan.
            </li>
            <li>
              <strong>Bagian atas &amp; bawah bisa terpotong</strong> di layar
              tertentu, jadi jangan taruh detail penting di tepi.
            </li>
          </ul>
          <p className="mt-3 text-xs text-granite-500">
            Bila dikosongkan, beranda memakai tampilan bawaan: latar hijau tua
            dengan pola topografi — persis seperti sekarang.
          </p>
        </div>

        <ImageUploadField
          name="banner_path"
          inputId="banner"
          bucket="situs"
          label="Berkas banner"
          preview="wide"
          maxBytes={4 * 1024 * 1024}
          currentUrl={bannerUrl}
          error={errors.banner}
          hint={
            bannerUrl
              ? "Sudah ada banner. Pilih berkas baru untuk menggantinya, atau tekan “Kembalikan ke latar warna” di atas untuk menghapusnya."
              : "Beranda sedang memakai latar warna bawaan. Unggah gambar untuk menggantinya."
          }
        />

        <div className="mt-5">
          <Field
            label="Kepekatan lapisan gelap"
            htmlFor="banner_overlay"
            hint="Lapisan hitam tipis di atas banner supaya tulisan putih tetap terbaca. Makin terang fotonya, makin tinggi angkanya. Tidak berpengaruh bila tidak ada banner."
            error={errors.banner_overlay}
          >
            <Select
              id="banner_overlay"
              name="banner_overlay"
              defaultValue={String(settings.banner_overlay)}
            >
              <option value="25">25% — foto sudah gelap</option>
              <option value="40">40% — agak gelap</option>
              <option value="55">55% — seimbang (disarankan)</option>
              <option value="70">70% — foto terang</option>
              <option value="85">85% — foto sangat terang atau ramai</option>
            </Select>
          </Field>
        </div>
      </section>

      <section className="rounded-2xl border border-sand-300 bg-white p-6">
        <SocialLinksEditor
          name="socials"
          initial={settings.socials}
          title="Sosial media komunitas"
          description="Tampil sebagai ikon di footer. Bisa ditambah sebanyak yang dibutuhkan, termasuk beberapa akun dari platform yang sama."
        />
      </section>

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
