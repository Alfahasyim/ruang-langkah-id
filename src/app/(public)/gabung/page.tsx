import type { Metadata } from "next";
import {
  BookOpen,
  CalendarCheck,
  CircleCheck,
  HeartHandshake,
  Percent,
  Users,
} from "lucide-react";
import { MembershipForm } from "@/components/forms/MembershipForm";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Gabung Anggota",
  description:
    "Syarat, keuntungan, dan formulir pendaftaran anggota Komunitas Ruang Langkah Indonesia.",
};

const REQUIREMENTS = [
  "Berusia minimal 17 tahun, atau 15 tahun dengan izin tertulis orang tua.",
  "Sehat jasmani dan bersedia mengisi data riwayat kesehatan dengan jujur.",
  "Menyetujui kode etik komunitas dan prinsip Leave No Trace.",
  "Bersedia mengikuti sesi orientasi anggota baru (daring, 90 menit).",
  "Tidak ada biaya pendaftaran — kontribusi hanya dibayar per kegiatan.",
];

const BENEFITS = [
  {
    icon: CalendarCheck,
    title: "Akses lebih awal ke open trip",
    body: "Anggota mendapat tautan pendaftaran 48 jam sebelum kuota dibuka untuk umum.",
  },
  {
    icon: Percent,
    title: "Potongan biaya kegiatan",
    body: "Diskon 10% untuk trip reguler dan gratis untuk kegiatan bersih jalur maupun penanaman pohon.",
  },
  {
    icon: BookOpen,
    title: "Kelas keterampilan gratis",
    body: "Navigasi darat, pertolongan pertama, manajemen logistik, dan fotografi alam — digelar rutin tiap bulan.",
  },
  {
    icon: Users,
    title: "Chapter daerah & kopdar",
    body: "Bergabung dengan grup chapter kotamu untuk latihan fisik bersama dan trip dadakan akhir pekan.",
  },
  {
    icon: HeartHandshake,
    title: "Peminjaman alat komunitas",
    body: "Tenda, carrier, nesting, dan trekking pole tersedia untuk dipinjam anggota tanpa biaya sewa.",
  },
  {
    icon: CircleCheck,
    title: "Jalur kaderisasi trip leader",
    body: "Anggota aktif berkesempatan mengikuti pelatihan trip leader bersertifikat dua kali setahun.",
  },
];

const STEPS = [
  { step: "01", label: "Isi formulir", detail: "Kurang dari 3 menit." },
  {
    step: "02",
    label: "Verifikasi email",
    detail: "Kami kirim tautan konfirmasi ke inbox-mu.",
  },
  {
    step: "03",
    label: "Sesi orientasi",
    detail: "Daring 90 menit, dijadwalkan setiap dua minggu.",
  },
  {
    step: "04",
    label: "Masuk grup chapter",
    detail: "Langsung bisa ikut latihan dan trip anggota.",
  },
];

export default function GabungPage() {
  return (
    <>
      <PageHeader
        eyebrow="Keanggotaan"
        title="Tidak perlu jadi pendaki hebat untuk bergabung"
        description="Yang kami cari bukan yang paling kuat, tapi yang mau belajar, menjaga sesama, dan menghormati alam. Sisanya kita pelajari bersama di jalur."
      />

      <section className="bg-sand-50 py-16 sm:py-20">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="rounded-3xl border border-sand-200 bg-white p-6"
              >
                <p className="font-display text-2xl font-semibold text-terracotta-500">
                  {item.step}
                </p>
                <h2 className="mt-3 font-semibold text-forest-950">
                  {item.label}
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-granite-600">
                  {item.detail}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section id="keuntungan" className="scroll-mt-28 border-y border-sand-200 bg-white py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Keuntungan Anggota"
            title="Apa yang kamu dapat setelah bergabung"
            description="Keanggotaan tidak dipungut biaya. Kontribusi hanya dibayar saat kamu ikut kegiatan."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded-3xl border border-sand-200 bg-sand-50 p-7"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-forest-100 text-forest-700">
                  <benefit.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 font-semibold text-forest-950">
                  {benefit.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-granite-600">
                  {benefit.body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-sand-100 py-20 sm:py-24">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <aside className="rounded-3xl bg-forest-950 p-8 text-sand-50 lg:sticky lg:top-28">
              <h2 className="text-2xl font-semibold">Syarat pendaftaran</h2>
              <ul className="mt-6 space-y-4">
                {REQUIREMENTS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm leading-relaxed text-forest-100"
                  >
                    <CircleCheck
                      className="mt-0.5 h-4 w-4 shrink-0 text-moss-300"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-8 rounded-2xl bg-forest-900 p-5 text-xs leading-relaxed text-forest-200">
                Punya pertanyaan sebelum mendaftar? Sapa kami lewat WhatsApp —
                tidak ada pertanyaan yang terlalu mendasar untuk ditanyakan.
              </p>
            </aside>

            <div className="rounded-3xl border border-sand-300 bg-white p-7 sm:p-9">
              <h2 className="text-2xl font-semibold text-forest-950">
                Formulir gabung anggota
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-granite-600">
                Isi data berikut dengan lengkap. Kami hanya memakainya untuk
                keperluan komunitas dan tidak membagikannya ke pihak mana pun.
              </p>

              <div className="mt-8">
                <MembershipForm />
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
