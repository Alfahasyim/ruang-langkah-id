-- ============================================================================
-- Ruang Langkah Indonesia — Data contoh
-- Jalankan setelah schema.sql. Tanggal dibuat relatif terhadap hari eksekusi.
-- ============================================================================

insert into public.trips (
  slug, title, category, location, province, meeting_point,
  start_date, end_date, difficulty_level, elevation_m, quota, seats_taken, price,
  summary, description, highlights, includes, requirements, status
) values
(
  'prau-sunrise-camp',
  'Prau Sunrise Camp — Golden Sunrise di Bukit Teletubbies',
  'gunung', 'Gunung Prau, Dieng', 'Jawa Tengah', 'Basecamp Patak Banteng, Wonosobo',
  current_date + 18, current_date + 19, 2, 2590, 25, 18, 385000,
  'Trip perkenalan paling ramah untuk kamu yang baru pertama bermalam di ketinggian.',
  'Prau adalah gerbang pertama banyak anggota Ruang Langkah. Treknya pendek, jalurnya jelas, tapi hadiahnya luar biasa: hamparan bukit bergelombang yang memerah saat matahari terbit di balik deretan Sindoro-Sumbing. Kami berangkat sore, mendirikan tenda sebelum gelap, lalu memasak bersama sambil berbagi cerita perjalanan. Sepanjang trip kami menerapkan Leave No Trace penuh — semua sampah turun kembali bersama kita.',
  array['Golden sunrise dengan panorama tujuh gunung','Sesi pengenalan manajemen tenda dan logistik','Trekking malam terpandu dengan rasio 1 leader : 6 peserta'],
  array['Tenda kapasitas 4 orang dan matras','Makan 3x, kopi, dan camilan lokal','Simaksi, retribusi, dan parkir','Pemandu bersertifikat dan P3K lengkap'],
  array['Usia minimal 15 tahun','Membawa sleeping bag dan jaket hangat','Sepatu trekking atau sepatu bersol kasar'],
  'open'
),
(
  'curug-leuwi-hejo-explore',
  'Leuwi Hejo Explore — Menyusuri Kolam Zamrud Sentul',
  'curug', 'Curug Leuwi Hejo, Sentul', 'Jawa Barat', 'Stasiun Bogor, pintu keluar utara',
  current_date + 9, null, 1, 480, 20, 11, 165000,
  'Satu hari penuh air jernih, batu granit raksasa, dan tawa yang menggema di lembah.',
  'Rangkaian Leuwi Hejo, Leuwi Cepet, dan Leuwi Baliner tersambung oleh jalur setapak yang teduh. Trip ini kami rancang untuk keluarga dan pendatang baru: jalan kaki santai sekitar 45 menit, lalu waktu bebas berenang di kolam alami berwarna hijau zamrud. Sebelum pulang, kami selalu menyisihkan 30 menit untuk memungut sampah di sepanjang aliran sungai.',
  array['Tiga curug dalam satu jalur susur sungai','Sesi foto bawah air bersama tim dokumentasi','Aksi bersih sungai 30 menit sebelum pulang'],
  array['Tiket masuk dan asuransi harian','Pemandu lokal dan life vest','Makan siang nasi liwet Sunda'],
  array['Bisa berenang dasar atau bersedia memakai life vest','Membawa baju ganti dan dry bag'],
  'open'
),
(
  'halimun-salak-forest-walk',
  'Halimun Salak Forest Walk — Rimba, Kabut, dan Owa Jawa',
  'hutan', 'TN Gunung Halimun Salak', 'Jawa Barat', 'Kantor Resort Cikaniki, Bogor',
  current_date + 31, current_date + 32, 3, 1100, 16, 7, 620000,
  'Berjalan pelan di hutan hujan tertua Jawa Barat sambil belajar membaca jejak satwa.',
  'Bukan trip untuk mengejar puncak, tapi untuk memperlambat langkah. Kami menyusuri canopy trail Cikaniki, mendengarkan panggilan owa jawa di pagi buta, dan belajar mengenali pohon rasamala serta tumbuhan obat bersama pendamping dari komunitas Kasepuhan. Malamnya kami menginap di rumah warga — porsi terbesar dari biaya trip ini kembali ke ekonomi desa penyangga.',
  array['Canopy trail sepanjang 100 meter di ketinggian 25 meter','Pengamatan owa jawa dan elang jawa bersama ranger','Menginap di rumah warga Kasepuhan Citalahab'],
  array['Homestay 1 malam dan makan 4x','Ranger taman nasional dan pemandu interpretasi','Simaksi dan kontribusi konservasi'],
  array['Sanggup berjalan 6–8 km di medan berlumpur','Membawa jas hujan dan senter kepala','Dilarang membawa speaker aktif'],
  'open'
),
(
  'gede-pangrango-classic',
  'Gede Pangrango Classic — Kawah, Alun-alun Suryakencana',
  'gunung', 'Gunung Gede, Cianjur', 'Jawa Barat', 'Basecamp Gunung Putri, Cianjur',
  current_date + 46, current_date + 48, 4, 2958, 18, 18, 950000,
  'Tiga hari menembus hutan montana menuju padang edelweis Suryakencana.',
  'Jalur klasik Gunung Putri–Suryakencana–Puncak Gede–Cibodas. Trip ini menuntut fisik yang siap: total 18 km dengan beda ketinggian lebih dari 1.400 meter. Sebagai gantinya, kamu akan berkemah di tengah 50 hektar padang edelweis dan menyaksikan kawah aktif dari bibir puncak. Kuota kami batasi ketat dan wajib melewati sesi briefing fisik dua minggu sebelum keberangkatan.',
  array['Berkemah di Alun-alun Suryakencana','Menyaksikan kawah aktif Gunung Gede dari puncak','Turun via Cibodas melewati Air Panas dan Curug Cibeureum'],
  array['Simaksi TNGGP dan booking kuota','Tenda, logistik, dan makan 6x','Porter logistik kelompok'],
  array['Pernah mendaki minimal 2 gunung di atas 2.000 mdpl','Wajib hadir briefing fisik H-14','Surat keterangan sehat dari dokter'],
  'full'
),
(
  'curug-cikaso-hidden-canyon',
  'Cikaso Hidden Canyon — Tiga Tirai Air di Sukabumi Selatan',
  'curug', 'Curug Cikaso, Sukabumi', 'Jawa Barat', 'Terminal Surade, Sukabumi',
  current_date + 24, current_date + 25, 2, 120, 22, 14, 475000,
  'Naik perahu menyusuri Sungai Cikaso menuju tiga air terjun kembar setinggi 80 meter.',
  'Cikaso hanya bisa dicapai dengan perahu kayu menyusuri sungai berwarna teh. Setibanya di sana, tiga tirai air—Asepan, Meong, dan Aki—jatuh berdampingan ke kolam yang luas. Kami menambahkan satu malam di pesisir Ujung Genteng untuk melihat pelepasan tukik bersama konservasi penyu setempat.',
  array['Perahu tradisional menyusuri Sungai Cikaso','Pelepasan tukik bersama konservasi Ujung Genteng','Sunset di pantai berpasir putih Pangumbahan'],
  array['Transport lokal dan perahu','Penginapan 1 malam dan makan 4x','Donasi konservasi penyu'],
  array['Membawa sandal gunung anti-selip','Tidak menggunakan flash saat pelepasan tukik'],
  'open'
),
(
  'rinjani-summit-expedition',
  'Rinjani Summit Expedition — Danau Segara Anak & Puncak 3.726',
  'gunung', 'Gunung Rinjani, Lombok', 'Nusa Tenggara Barat', 'Bandara Lombok (LOP)',
  current_date + 72, current_date + 76, 5, 3726, 12, 5, 3450000,
  'Ekspedisi lima hari untuk pendaki berpengalaman: Sembalun, Segara Anak, hingga Senaru.',
  'Jalur lintas Sembalun–Senaru adalah ujian nyata: bukit penyesalan, summit attack pukul dua pagi di pasir vulkanik, lalu turun ke Danau Segara Anak untuk berendam di air panas alami. Kami menerapkan rasio 1 leader : 4 peserta, membawa oksigen portabel, dan bekerja sama dengan porter lokal yang dibayar sesuai standar upah Asosiasi Porter Rinjani.',
  array['Summit attack ke puncak tertinggi ketiga di Indonesia','Bermalam di tepi Danau Segara Anak','Kemitraan adil dengan porter dan guide lokal'],
  array['Tiket masuk TN Gunung Rinjani dan asuransi ekspedisi','Porter, guide, tenda, dan makan 12x','Transport bandara–basecamp pulang pergi'],
  array['Pengalaman minimal 3 gunung di atas 3.000 mdpl','Lolos tes fisik: 5 km lari di bawah 35 menit','Asuransi perjalanan pribadi aktif'],
  'open'
)
on conflict (slug) do nothing;

insert into public.articles (slug, title, category, excerpt, read_minutes, author, published_at) values
('layering-system-untuk-gunung-tropis', 'Layering System untuk Gunung Tropis: Kenapa Katun Itu Musuh', 'perlengkapan',
 'Suhu puncak bisa menyentuh 3°C sementara kaki gunung masih 28°C. Pelajari tiga lapis pakaian yang membuat tubuhmu tetap kering dan hangat.', 7, 'Rama Wijanarko', current_date - 12),
('tujuh-prinsip-leave-no-trace', 'Tujuh Prinsip Leave No Trace dan Cara Menerapkannya di Indonesia', 'etika',
 'Dari mengelola sampah organik sampai etika berfoto di padang edelweis — panduan praktis yang kami pakai di setiap trip.', 9, 'Sari Nurhaliza', current_date - 26),
('mengenali-gejala-hipotermia', 'Mengenali Gejala Hipotermia Sebelum Terlambat', 'keselamatan',
 'Menggigil yang berhenti bukan tanda membaik. Kenali lima tahap hipotermia dan protokol penanganan di lapangan.', 6, 'dr. Bagas Prayoga', current_date - 5),
('membaca-peta-kontur-tanpa-sinyal', 'Membaca Peta Kontur Tanpa Sinyal: Kompas Masih Relevan', 'navigasi',
 'GPS di ponsel mati saat baterai habis di suhu dingin. Latih kemampuan dasar orientasi peta dan kompas sebagai jaring pengaman.', 11, 'Yoga Pratama', current_date - 40),
('packing-carrier-45-liter', 'Packing Carrier 45 Liter untuk Trip Dua Hari Satu Malam', 'perlengkapan',
 'Urutan memasukkan barang menentukan titik berat ranselmu. Ikuti pola tiga zona agar bahu tidak cepat lelah.', 8, 'Rama Wijanarko', current_date - 18),
('etika-berinteraksi-dengan-warga-desa-penyangga', 'Etika Berinteraksi dengan Warga Desa Penyangga', 'etika',
 'Kita adalah tamu. Panduan singkat soal izin memotret, berbelanja di warung lokal, dan menghormati aturan adat.', 5, 'Sari Nurhaliza', current_date - 33)
on conflict (slug) do nothing;
