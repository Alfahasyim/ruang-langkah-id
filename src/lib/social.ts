/**
 * Daftar platform sosial media yang didukung.
 *
 * Catatan: lucide-react versi ini sudah menghapus seluruh ikon brand, jadi
 * lambangnya digambar sendiri sebagai SVG inline di components/ui/SocialIcon.tsx
 * — tanpa dependensi tambahan.
 */
export const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram", placeholder: "https://instagram.com/ruanglangkah.id" },
  { value: "whatsapp", label: "WhatsApp", placeholder: "https://wa.me/628123456789" },
  { value: "facebook", label: "Facebook", placeholder: "https://facebook.com/ruanglangkah" },
  { value: "youtube", label: "YouTube", placeholder: "https://youtube.com/@ruanglangkah" },
  { value: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@ruanglangkah" },
  { value: "x", label: "X / Twitter", placeholder: "https://x.com/ruanglangkah" },
  { value: "telegram", label: "Telegram", placeholder: "https://t.me/ruanglangkah" },
  { value: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/nama" },
  { value: "lainnya", label: "Lainnya (isi nama sendiri)", placeholder: "https://situs-anda.com" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["value"];

export const SOCIAL_PLATFORM_VALUES: string[] = SOCIAL_PLATFORMS.map(
  (platform) => platform.value,
);

export type SocialLink = {
  id: string;
  platform: string;
  label: string | null;
  url: string;
  sort_order: number;
};

export function socialLabel(link: Pick<SocialLink, "platform" | "label">) {
  if (link.platform === "lainnya") return link.label?.trim() || "Tautan";
  return (
    SOCIAL_PLATFORMS.find((platform) => platform.value === link.platform)?.label ??
    link.platform
  );
}

/**
 * Hanya izinkan skema yang aman untuk atribut href. Nilai tautan diisi admin,
 * tapi tetap disaring supaya `javascript:` tidak pernah lolos ke markup.
 */
export function safeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : null;
  } catch {
    return null;
  }
}

export type ParsedSocial = {
  platform: string;
  label: string | null;
  url: string;
};

const MAX_SOCIAL_LINKS = 12;

/**
 * Tautan dikirim sebagai JSON dari editor dinamis di browser. Setiap baris
 * divalidasi ulang di server — platform harus dari daftar yang dikenal dan URL
 * harus berskema http/https supaya `javascript:` tidak pernah lolos.
 *
 * Sengaja diletakkan di sini, bukan di berkas "use server", karena seluruh
 * ekspor berkas server action wajib berupa fungsi async.
 */
export function parseSocialLinks(raw: string): ParsedSocial[] {
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .slice(0, MAX_SOCIAL_LINKS)
      .map((entry) => {
        if (typeof entry !== "object" || entry === null) return null;
        const row = entry as Record<string, unknown>;

        const platform = String(row.platform ?? "").trim();
        const url = safeUrl(String(row.url ?? ""));

        if (!SOCIAL_PLATFORM_VALUES.includes(platform) || !url) return null;

        const label = String(row.label ?? "").trim();
        return {
          platform,
          label: platform === "lainnya" && label ? label.slice(0, 40) : null,
          url,
        };
      })
      .filter((entry): entry is ParsedSocial => entry !== null);
  } catch {
    return [];
  }
}
