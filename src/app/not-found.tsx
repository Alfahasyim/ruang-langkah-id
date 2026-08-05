import { MapPinOff } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function NotFound() {
  return (
    <section className="bg-sand-50 py-28">
      <Container className="max-w-xl text-center">
        <MapPinOff className="mx-auto h-12 w-12 text-granite-300" aria-hidden />
        <h1 className="mt-6 text-3xl font-semibold text-forest-950">
          Sepertinya kita salah jalur
        </h1>
        <p className="mt-4 leading-relaxed text-granite-600">
          Halaman yang kamu cari tidak ditemukan. Mungkin trip-nya sudah selesai
          atau tautannya keliru. Mari kembali ke jalur utama.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/">Kembali ke beranda</ButtonLink>
          <ButtonLink href="/trip" variant="outline">
            Lihat open trip
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
