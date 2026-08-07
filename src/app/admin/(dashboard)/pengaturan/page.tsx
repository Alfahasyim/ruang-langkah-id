import { AdminHeading } from "@/components/admin/AdminUI";
import { DeleteForm } from "@/components/admin/DeleteForm";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { FormAlert } from "@/components/forms/Fields";
import { requireAdmin } from "@/lib/auth";
import { removeSiteBanner, removeSiteLogo } from "@/lib/admin/settings-actions";
import { getSiteSettings, siteAssetUrl } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata = { title: "Pengaturan Situs" };

const MESSAGES: Record<string, { status: "success" | "error"; text: string }> = {
  tersimpan: { status: "success", text: "Pengaturan situs berhasil disimpan." },
  "logo-dihapus": {
    status: "success",
    text: "Logo dihapus. Situs kembali memakai ikon bawaan.",
  },
  "banner-dihapus": {
    status: "success",
    text: "Banner dihapus. Beranda kembali memakai latar warna bawaan.",
  },
};

export default async function AdminSettingsPage({
  searchParams,
}: PageProps<"/admin/pengaturan">) {
  await requireAdmin();

  const params = await searchParams;
  const notice =
    typeof params.pesan === "string" ? MESSAGES[params.pesan] : undefined;

  const settings = await getSiteSettings();
  const logoUrl = siteAssetUrl(settings.logo_path);
  const bannerUrl = siteAssetUrl(settings.banner_path);

  return (
    <div className="max-w-3xl">
      <AdminHeading
        title="Pengaturan Situs"
        description="Identitas komunitas, kontak, logo, banner beranda, dan tautan sosial media yang tampil di seluruh situs."
        action={
          logoUrl || bannerUrl ? (
            <div className="flex flex-wrap gap-1">
              {logoUrl && (
                <DeleteForm
                  action={removeSiteLogo}
                  confirmMessage="Hapus logo dan kembali memakai ikon jejak kaki bawaan?"
                  label="Hapus logo"
                />
              )}
              {bannerUrl && (
                <DeleteForm
                  action={removeSiteBanner}
                  confirmMessage="Hapus banner dan kembalikan beranda ke latar warna bawaan?"
                  label="Kembalikan ke latar warna"
                />
              )}
            </div>
          ) : undefined
        }
      />

      {notice && (
        <div className="mb-6">
          <FormAlert status={notice.status} message={notice.text} />
        </div>
      )}

      <SiteSettingsForm
        settings={settings}
        logoUrl={logoUrl}
        bannerUrl={bannerUrl}
      />
    </div>
  );
}
