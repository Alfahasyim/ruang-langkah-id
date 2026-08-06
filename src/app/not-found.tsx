import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { getSiteSettings, siteAssetUrl } from "@/lib/settings";

// Menangani URL yang tidak cocok dengan route mana pun, jadi kerangka publik
// dipasang manual di sini — layout (public) tidak ikut merender halaman ini.
export default async function NotFound() {
  const settings = await getSiteSettings();
  const logoUrl = siteAssetUrl(settings.logo_path);

  return (
    <>
      <Header
        name={settings.name}
        shortName={settings.short_name}
        logoUrl={logoUrl}
      />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <Footer settings={settings} logoUrl={logoUrl} />
    </>
  );
}
