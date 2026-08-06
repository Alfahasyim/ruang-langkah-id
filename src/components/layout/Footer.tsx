import Link from "next/link";
import { Mail, MapPin, Phone, TriangleAlert } from "lucide-react";
import { Logo } from "./Logo";
import { Container } from "@/components/ui/Container";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { FOOTER_NAV } from "@/lib/site";
import type { SiteSettings } from "@/lib/settings";
import { socialLabel } from "@/lib/social";

export function Footer({
  settings,
  logoUrl,
}: {
  settings: SiteSettings;
  logoUrl: string | null;
}) {
  return (
    <footer className="mt-auto bg-forest-950 text-forest-100">
      <Container className="py-14">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo
              tone="light"
              name={settings.name}
              shortName={settings.short_name}
              logoUrl={logoUrl}
            />

            {/* whitespace-pre-line: tagline diisi admin dan boleh multi-baris */}
            <p className="mt-5 max-w-sm text-sm leading-relaxed whitespace-pre-line text-forest-200">
              {settings.tagline}
            </p>

            <ul className="mt-6 space-y-2.5 text-sm text-forest-200">
              {settings.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin
                    className="mt-0.5 h-4 w-4 shrink-0 text-moss-300"
                    aria-hidden
                  />
                  <span className="whitespace-pre-line">{settings.address}</span>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 shrink-0 text-moss-300" aria-hidden />
                  <a
                    href={`mailto:${settings.email}`}
                    className="hover:text-sand-50"
                  >
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 shrink-0 text-moss-300" aria-hidden />
                  <a
                    href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`}
                    className="hover:text-sand-50"
                  >
                    {settings.phone}
                  </a>
                </li>
              )}
            </ul>

            {settings.socials.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-2">
                {settings.socials.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={socialLabel(social)}
                      aria-label={socialLabel(social)}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-forest-900 text-forest-200 transition-colors hover:bg-moss-400 hover:text-forest-950"
                    >
                      <SocialIcon platform={social.platform} className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {FOOTER_NAV.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="font-display text-sm font-semibold tracking-[0.14em] text-moss-300 uppercase">
                {group.title}
              </h3>
              <ul className="mt-5 space-y-3 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-forest-200 underline-offset-4 transition-colors hover:text-sand-50 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex items-start gap-3 rounded-2xl border border-terracotta-700/40 bg-terracotta-900/30 p-5">
          <TriangleAlert
            className="mt-0.5 h-5 w-5 shrink-0 text-terracotta-300"
            aria-hidden
          />
          <p className="text-sm leading-relaxed text-terracotta-100">
            <strong className="font-semibold text-sand-50">Darurat di jalur?</strong>{" "}
            Hubungi Basarnas <strong>115</strong> atau pos pendakian terdekat.
            Simpan nomor trip leader-mu sebelum berangkat dan kabari kontak
            daruratmu setiap kali berganti pos.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-forest-800 pt-7 text-xs text-forest-300 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.name}. Dibuat dengan hormat
            untuk alam Indonesia.
          </p>
          <p className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-moss-400" />
            Take nothing but pictures, leave nothing but footprints.
          </p>
        </div>
      </Container>
    </footer>
  );
}
