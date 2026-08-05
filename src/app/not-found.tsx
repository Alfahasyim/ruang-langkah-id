import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { NotFoundContent } from "@/components/layout/NotFoundContent";

// Menangani URL yang tidak cocok dengan route mana pun, jadi kerangka publik
// dipasang manual di sini — layout (public) tidak ikut merender halaman ini.
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <NotFoundContent />
      </main>
      <Footer />
    </>
  );
}
