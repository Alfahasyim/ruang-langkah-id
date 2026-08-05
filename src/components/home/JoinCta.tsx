import { ArrowRight, Quote } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function JoinCta() {
  return (
    <section className="relative overflow-hidden bg-forest-900 py-20 text-sand-50 sm:py-24">
      <div className="topo-pattern absolute inset-0 opacity-60" aria-hidden />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <h2 className="font-display text-3xl leading-tight font-semibold text-balance sm:text-4xl">
              Langkah pertama selalu yang paling berat.
              <span className="block text-moss-300">
                Kami menemanimu di langkah itu.
              </span>
            </h2>
            <p className="mt-5 max-w-xl leading-relaxed text-pretty text-forest-100">
              Belum pernah mendaki? Justru itu alasan terbaik untuk bergabung.
              Anggota baru mendapat sesi orientasi, akses kelas navigasi dan
              pertolongan pertama, serta potongan biaya untuk trip pemula.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/gabung" variant="secondary" size="lg">
                Daftar Jadi Anggota
                <ArrowRight className="h-4 w-4" aria-hidden />
              </ButtonLink>
              <ButtonLink
                href="/panduan"
                size="lg"
                className="border border-moss-400/40 bg-transparent text-sand-50 hover:bg-moss-400/10"
              >
                Baca Panduan Dulu
              </ButtonLink>
            </div>
          </div>

          <figure className="rounded-3xl border border-forest-700 bg-forest-950/50 p-8">
            <Quote className="h-8 w-8 text-gold-300" aria-hidden />
            <blockquote className="mt-5 leading-relaxed text-pretty text-forest-100">
              Saya ikut trip Prau sebagai orang paling lambat di rombongan. Tidak
              ada satu pun yang mengeluh; leader-nya malah jalan di belakang
              menemani saya sampai puncak. Sejak itu saya tidak pernah absen.
            </blockquote>
            <figcaption className="mt-6 border-t border-forest-800 pt-5 text-sm">
              <span className="block font-semibold text-sand-50">
                Dinda Maharani
              </span>
              <span className="text-forest-300">
                Anggota sejak 2022 · Bandung
              </span>
            </figcaption>
          </figure>
        </div>
      </Container>
    </section>
  );
}
