import type { Metadata } from "next";
import { Compass, Eye, Target } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { PageHeader } from "@/components/ui/PageHeader";
import { SectionHeading } from "@/components/ui/SectionHeading";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Cerita terbentuknya Ruang Langkah Indonesia, visi misi pelestarian alam, dan orang-orang di balik setiap trip.",
};

const MISSIONS = [
  "Menyelenggarakan kegiatan alam bebas dengan standar keselamatan yang tidak dikompromikan.",
  "Mendidik anggota melalui kelas navigasi, pertolongan pertama, dan manajemen perjalanan.",
  "Menjalankan prinsip Leave No Trace di setiap kegiatan, tanpa pengecualian.",
  "Bermitra secara adil dengan pemandu, porter, dan warga desa penyangga.",
  "Membuka pintu selebar mungkin bagi pemula, perempuan, dan siapa pun yang selama ini merasa tidak punya tempat di komunitas outdoor.",
];

const TIMELINE = [
  {
    year: "2019",
    title: "Tujuh orang, satu tenda bocor",
    body: "Berawal dari obrolan di warung kopi Bogor, tujuh orang nekat mendaki Gunung Salak dengan perlengkapan seadanya. Tenda bocor, logistik kurang, tapi malam itu lahir kesepakatan: kalau mau terus jalan, kita harus belajar melakukannya dengan benar.",
  },
  {
    year: "2020",
    title: "Berhenti berjalan, mulai belajar",
    body: "Pandemi menutup semua jalur. Kami memakai waktu itu untuk kelas daring: navigasi darat, manajemen risiko, dan sertifikasi pertolongan pertama bagi calon trip leader.",
  },
  {
    year: "2022",
    title: "Trip pertama dengan SOP lengkap",
    body: "Kembali ke jalur dengan aturan main yang jelas: rasio leader-peserta, briefing wajib, daftar peralatan minimum, dan protokol pembatalan karena cuaca.",
  },
  {
    year: "2024",
    title: "Dari komunitas jadi gerakan",
    body: "Program Bersih Jalur rutin digelar setiap kuartal. Total 2,3 ton sampah dibawa turun bersama relawan dan warga desa penyangga.",
  },
  {
    year: "2026",
    title: "1.240 anggota, satu prinsip yang sama",
    body: "Chapter tersebar di Bogor, Bandung, Yogyakarta, Surabaya, dan Makassar. Yang tidak berubah: pulang dengan alam yang sama utuhnya seperti saat kita datang.",
  },
];

const TEAM = [
  {
    name: "Rama Wijanarko",
    role: "Ketua Komunitas & Trip Leader",
    initials: "RW",
    bio: "Pendaki 14 tahun, sertifikasi Wilderness First Responder. Percaya bahwa keputusan turun lebih berani daripada memaksa naik.",
    tone: "bg-forest-700",
  },
  {
    name: "Sari Nurhaliza",
    role: "Koordinator Konservasi",
    initials: "SN",
    bio: "Sarjana kehutanan yang menjaga agar setiap trip berdampak baik bagi ekosistem dan ekonomi desa penyangga.",
    tone: "bg-terracotta-500",
  },
  {
    name: "dr. Bagas Prayoga",
    role: "Penanggung Jawab Medis",
    initials: "BP",
    bio: "Dokter umum sekaligus pendaki. Menyusun protokol medis lapangan dan melatih tim P3K di tiap kelompok.",
    tone: "bg-gold-500",
  },
  {
    name: "Yoga Pratama",
    role: "Kepala Navigasi & Logistik",
    initials: "YP",
    bio: "Mantan anggota SAR daerah. Memetakan jalur, menyiapkan rencana evakuasi, dan mengajar kelas kompas.",
    tone: "bg-forest-600",
  },
  {
    name: "Dinda Maharani",
    role: "Koordinator Anggota Baru",
    initials: "DM",
    bio: "Dulu peserta paling lambat di rombongan, kini memastikan tidak ada pemula yang merasa sendirian di jalur.",
    tone: "bg-moss-500",
  },
  {
    name: "Fajar Ramadhan",
    role: "Dokumentasi & Media",
    initials: "FR",
    bio: "Merekam perjalanan tanpa mengganggu satwa maupun merusak vegetasi demi satu frame yang bagus.",
    tone: "bg-granite-600",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Tentang Kami"
        title="Berawal dari tujuh orang dan satu tenda bocor"
        description="Ruang Langkah Indonesia tumbuh dari kesadaran sederhana: mencintai alam saja tidak cukup, kita perlu tahu cara memperlakukannya dengan benar."
      />

      <section className="bg-sand-50 py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.18em] text-terracotta-600 uppercase">
                Perjalanan Kami
              </p>
              <h2 className="mt-3 text-3xl font-semibold text-balance text-forest-950">
                Tujuh tahun belajar di jalur
              </h2>
              <p className="mt-4 leading-relaxed text-granite-600">
                Kami tidak berpura-pura selalu benar. Banyak aturan yang kini
                kami pegang lahir dari kesalahan yang pernah kami buat sendiri.
              </p>
            </div>

            <ol className="relative border-l border-sand-300 pl-8">
              {TIMELINE.map((item) => (
                <li key={item.year} className="relative pb-10 last:pb-0">
                  <span className="absolute top-1.5 -left-[2.3rem] flex h-4 w-4 items-center justify-center rounded-full border-2 border-sand-50 bg-forest-600" />
                  <p className="font-display text-sm font-semibold text-terracotta-600">
                    {item.year}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-forest-950">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-granite-600">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      <section className="border-y border-sand-200 bg-white py-20 sm:py-24">
        <Container>
          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-3xl bg-forest-950 p-9 text-sand-50">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-400/20 text-moss-300">
                <Eye className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-6 text-2xl font-semibold">Visi</h2>
              <p className="mt-4 leading-relaxed text-pretty text-forest-100">
                Menjadi ruang tumbuh bagi petualang Indonesia yang berjalan
                dengan pengetahuan, pulang dengan selamat, dan meninggalkan alam
                dalam keadaan yang sama utuhnya — atau lebih baik.
              </p>
            </article>

            <article className="rounded-3xl border border-sand-200 bg-sand-50 p-9">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-terracotta-100 text-terracotta-700">
                <Target className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-6 text-2xl font-semibold text-forest-950">Misi</h2>
              <ul className="mt-4 space-y-3">
                {MISSIONS.map((mission) => (
                  <li
                    key={mission}
                    className="flex gap-3 text-sm leading-relaxed text-granite-700"
                  >
                    <Compass
                      className="mt-0.5 h-4 w-4 shrink-0 text-forest-600"
                      aria-hidden
                    />
                    {mission}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </Container>
      </section>

      <section id="tim" className="scroll-mt-28 bg-sand-50 py-20 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Tim & Trip Leader"
            title="Orang-orang yang berjalan paling depan — dan paling belakang"
            description="Semua trip leader kami mengikuti pelatihan berkala dan wajib memegang sertifikasi pertolongan pertama yang masih berlaku."
          />

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((person) => (
              <article
                key={person.name}
                className="rounded-3xl border border-sand-200 bg-white p-7"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl font-display text-lg font-semibold text-white ${person.tone}`}
                >
                  {person.initials}
                </span>
                <h3 className="mt-5 text-lg font-semibold text-forest-950">
                  {person.name}
                </h3>
                <p className="mt-1 text-sm font-medium text-terracotta-600">
                  {person.role}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-granite-600">
                  {person.bio}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start gap-5 rounded-3xl bg-forest-900 p-9 text-sand-50 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold">
                Ingin jadi trip leader berikutnya?
              </h3>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-forest-200">
                Kami membuka kaderisasi dua kali setahun untuk anggota aktif
                yang siap belajar navigasi, manajemen risiko, dan pertolongan
                pertama.
              </p>
            </div>
            <ButtonLink href="/gabung" variant="secondary" size="lg">
              Mulai dari jadi anggota
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
