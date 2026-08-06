import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings, siteAssetUrl } from "@/lib/settings";

export default async function PublicLayout({ children }: LayoutProps<"/">) {
  const settings = await getSiteSettings();
  const logoUrl = siteAssetUrl(settings.logo_path);

  return (
    <>
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-forest-800 focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-sand-50"
      >
        Lompat ke konten utama
      </a>
      <Header
        name={settings.name}
        shortName={settings.short_name}
        logoUrl={logoUrl}
      />
      <main id="konten-utama" className="flex-1">
        {children}
      </main>
      <Footer settings={settings} logoUrl={logoUrl} />
    </>
  );
}
