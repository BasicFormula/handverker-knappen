import Header from "components/Header";
import Footer from "components/Footer";
import AdBanner from "components/AdBanner";

const previewBanners = [
  {
    id: "fb-square",
    format: "square" as const,
    eyebrow: "OSLO • OMEGN",
    headline: "Flere lokale oppdrag",
    body: "Snekker, rørlegger eller elektriker? HåndverkerKnappen gir deg direkte kontakt med kunder i Oslo, Asker og Bærum.",
    bullet: "Ingen provisjon. Du velger hvilke henvendelser du svarer på.",
    cta: "Registrer deg",
    footerNote: "Format 1080×1080 · UTM: utm_source=ads&utm_medium=fb",
  },
  {
    id: "story-vertical",
    format: "vertical" as const,
    eyebrow: "NYE JOBBER",
    headline: "Bli funnet i Oslo",
    body: "Bygg profil på 2 minutter. BankID-verifisering og anmeldelser bygger tillit hos kunder.",
    bullet: "Direkte kundedialog • Ingen mellomledd",
    cta: "Start nå",
    footerNote: "Format 1080×1920 · IG Story/Reel",
  },
];

export default function AdPreviewPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 space-y-12">
        <section className="text-center space-y-3">
          <span className="text-sm uppercase tracking-[0.35em] text-forest-700/70">HåndverkerKnappen Annonser</span>
          <h1 className="type-headline-xl text-forest-900">Annonseutkast · Oslo og omegn</h1>
          <p className="mx-auto max-w-3xl text-base md:text-lg text-forest-800/80">
            Forhåndsvisning av statiske bannere før eksport til PNG/SVG. Bruk dette som visuell QA før vi genererer
            endelige filer i alle formater (1080×1080, 1080×1920, 1200×628, 1200×1200, 300×250, 1200×300).
          </p>
        </section>

        <section className="grid gap-10 md:grid-cols-2 place-items-center">
          {previewBanners.map((banner) => (
            <div key={banner.id} className="flex flex-col items-center gap-4">
              <AdBanner {...banner} />
              <p className="text-sm text-forest-700/70">{banner.footerNote}</p>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
