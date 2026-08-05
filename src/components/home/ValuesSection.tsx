import { HandHeart, Leaf, ShieldCheck, Sprout } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const VALUES = [
  {
    icon: Leaf,
    title: "Leave No Trace",
    body: "Semua sampah turun bersama kita — termasuk kulit buah dan puntung rokok. Kami tidak memetik edelweis, tidak mencorat-coret batu, dan berkemah hanya di titik yang diizinkan.",
    accent: "bg-moss-100 text-forest-700",
  },
  {
    icon: ShieldCheck,
    title: "Keselamatan Lebih Dulu",
    body: "Rasio maksimal 1 leader untuk 6 peserta, briefing wajib sebelum berangkat, P3K lengkap di setiap kelompok, dan keberanian untuk membatalkan trip ketika cuaca tidak bersahabat.",
    accent: "bg-terracotta-100 text-terracotta-700",
  },
  {
    icon: HandHeart,
    title: "Kebersamaan Tanpa Sekat",
    body: "Tidak ada senioritas di jalur. Yang cepat menunggu, yang lelah dibantu. Pemula selalu punya tempat, dan tidak ada yang ditinggalkan di belakang.",
    accent: "bg-gold-100 text-gold-600",
  },
  {
    icon: Sprout,
    title: "Berdampak untuk Sekitar",
    body: "Kami menginap di rumah warga, menyewa porter lokal dengan upah layak, dan menyisihkan sebagian biaya trip untuk kegiatan konservasi desa penyangga.",
    accent: "bg-forest-100 text-forest-700",
  },
];

export function ValuesSection() {
  return (
    <section className="bg-sand-50 py-20 sm:py-24">
      <Container>
        <SectionHeading
          eyebrow="Nilai Komunitas"
          title="Empat hal yang tidak pernah kami tawar"
          description="Petualangan yang baik bukan soal seberapa tinggi puncaknya, tapi seberapa utuh alam dan tim kita saat pulang."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {VALUES.map((value) => (
            <article
              key={value.title}
              className="rounded-3xl border border-sand-200 bg-white p-7 transition-colors hover:border-forest-200"
            >
              <span
                className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${value.accent}`}
              >
                <value.icon className="h-6 w-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-xl font-semibold text-forest-950">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-granite-600">
                {value.body}
              </p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
