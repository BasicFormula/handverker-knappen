import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, UserCheck, Wrench, Zap, Droplets, Paintbrush, Hammer, 
  Stethoscope, Laptop, Bug, Car, Sparkles, Smile, Briefcase,
  ShieldCheck, Star, XCircle, Clock, CheckCircle, AlertTriangle
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FeatureCard from "@/components/FeatureCard";
import { SERVICE_CATEGORIES } from "utils/services";
import { AdBanner } from "@/components/AdBanner";
import { usePageTitle } from "utils/hooks";
import { useTranslation } from "utils/translations";

const serviceCategories = SERVICE_CATEGORIES.map(service => ({
  name: service.label,
  value: service.value
}));

const getServiceIcon = (value: string) => {
  switch (value) {
    case "rørlegger": return Droplets;
    case "elektriker": return Zap;
    case "maler": return Paintbrush;
    case "murer": return Hammer;
    case "sykepleier": return Stethoscope;
    case "vaskehjelp": return Sparkles;
    case "pc-hjelp": return Laptop;
    case "skadedyrkontroll": return Bug;
    case "mekaniker": return Car;
    case "tannlege": return Smile;
    case "lege": return Stethoscope;
    case "snekker": return Hammer;
    default: return Briefcase;
  }
};

export default function App() {
  const navigate = useNavigate();
  usePageTitle("HåndverkerKnappen - Finn rett fagperson");
  const { t } = useTranslation();
  const [pressed, setPressed] = useState(false);

  // ==========================================
  // LOGO POSITION CONTROL (X-Y Axis in pixels)
  // ==========================================
  const LOGO_X = 0;      // Positive = Right, Negative = Left
  const LOGO_Y = 0;      // Positive = Down, Negative = Up
  const LOGO_SCALE = 1.4;
  // ==========================================

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-8 md:py-16 lg:py-24 px-4">
          {/* Nordic gradient background: deep forest → steel blue */}
          <div className="absolute inset-0 bg-gradient-to-br from-forest-800 via-forest-700 to-steel-600 opacity-95"></div>
          <div className="absolute inset-0 nordic-pattern opacity-10 [mask-image:linear-gradient(to_bottom,white_20%,transparent_95%)]"></div>
          
          {/* Subtle warm accent glow */}
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-amber-500 rounded-full blur-3xl opacity-10 translate-x-1/2"></div>
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-copper-500 rounded-full blur-3xl opacity-10 -translate-x-1/2"></div>
          <div className="relative z-10 w-full max-w-6xl mx-auto space-y-6 md:space-y-8">
            {/* Hero Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white font-headline">
              {t('hero_title')}
            </h1>

            {/* Hero Subtitle */}
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/75 max-w-2xl leading-relaxed font-sans">
              {t('hero_subtitle')}
            </p>
            
            {/* Logo Button - MUCH LARGER FOR PC */}
            <div className="flex flex-col items-center justify-center relative w-full mx-auto pt-0">
              <div className="relative z-20 w-full flex flex-col items-center justify-center">
                {/* Button container - MASSIVELY INCREASED PC SIZES */}
                <div 
                  className="relative w-[95vw] sm:w-[90vw] md:w-[75vw] lg:w-[65vw] xl:w-[55vw] max-w-[900px] aspect-square mx-auto flex items-center justify-center"
                  style={{
                    transform: `translate(${LOGO_X}px, ${LOGO_Y}px) scale(${LOGO_SCALE})`
                  }}
                >
                  <button
                    onClick={() => document.getElementById("cta-section")?.scrollIntoView({ behavior: "smooth" })}
                    onMouseDown={() => setPressed(true)}
                    onMouseUp={() => setPressed(false)}
                    onMouseLeave={() => setPressed(false)}
                    onTouchStart={() => setPressed(true)}
                    onTouchEnd={() => setPressed(false)}
                    className="outline-none w-full h-full flex items-center justify-center relative"
                    style={{
                      transform: pressed ? "translate(0, 5px) scale(0.98)" : "translate(0, 0) scale(1)",
                      transition: "transform 90ms ease",
                      cursor: "pointer",
                      touchAction: "manipulation",
                      userSelect: "none",
                    }}
                  >
                    {/* Main logo - Fitted to container */}
                    <div 
                      className="absolute inset-0 w-full h-full"
                      style={{
                        filter: pressed ? "drop-shadow(0 6px 12px rgba(0,0,0,0.3))" : "drop-shadow(0 15px 25px rgba(0,0,0,0.4))",
                        transition: "filter 120ms ease",
                      }}
                    >
                      <img 
                        src="https://static.riff.new/public/02419637-67a6-44de-9539-f81eca42b90a/Logo10.png" 
                        alt="Håndverker Knappen Logo" 
                        className="w-full h-full object-contain block"
                        draggable="false"
                      />
                    </div>
                    
                    {/* Breathing orange ring glow */}
                    <div className="absolute inset-0 w-full h-full pointer-events-none breathe-glow">
                      <img
                        src="https://static.riff.new/public/02419637-67a6-44de-9539-f81eca42b90a/Logo11.png"
                        alt=""
                        className="w-full h-full object-contain"
                        draggable="false"
                        style={{
                          transform: "translateX(0.85%)", /* Precise alignment for ring */
                        }}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 md:py-20 relative overflow-hidden bg-white">
          {/* very subtle background gradient for warmth */}
          <div className="absolute inset-0 bg-gradient-to-b from-forest-900/5 via-forest-700/3 to-transparent opacity-80 [mask-image:linear-gradient(to_bottom,white_10%,transparent_90%)]"></div>
          <div className="container mx-auto px-4 relative">
            <div className="text-center mb-12">
              <h2 className="type-headline text-forest-900">{t('how_it_works_title')}</h2>
              <p className="type-body text-center mt-2">{t('how_it_works_subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <FeatureCard
                icon={FileText}
                step={1}
                title={t('step_1_title')}
                description={t('step_1_desc')}
              />
              <FeatureCard
                icon={UserCheck}
                step={2}
                title={t('step_2_title')}
                description={t('step_2_desc')}
              />
              <FeatureCard
                icon={Wrench}
                step={3}
                title={t('step_3_title')}
                description={t('step_3_desc')}
              />
            </div>
          </div>
        </section>

        {/* Trygghet & Situations Section */}
        <section className="py-12 md:py-24 bg-white bg-gradient-to-b from-slate-800/5 via-forest-900/3 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 nordic-pattern opacity-[0.03] pointer-events-none" />
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            
            {/* Trygghet Column */}
            <div className="space-y-8">
              <div>
                <h2 className="type-headline-lg mb-6 flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-forest-900" />
                  {t('safety_title')}
                </h2>
                <p className="type-body mb-8">{t('safety_desc')}</p>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-500/10 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-forest-900 text-lg">{t('safety_list_title_1')}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>{t('safety_item_1')}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>{t('safety_item_2')}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-600">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span>{t('safety_item_3')}</span>
                    </li>
                  </ul>
                </div>

                <div className="h-px bg-slate-500/10 w-full" />

                <div className="space-y-4">
                  <h3 className="font-bold text-forest-900 text-lg">{t('safety_list_title_2')}</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-slate-600">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span>{t('safety_avoid_1')}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-600">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span>{t('safety_avoid_2')}</span>
                    </li>
                    <li className="flex items-center gap-3 text-slate-600">
                      <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <span>{t('safety_avoid_3')}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Situations Column */}
            <div className="space-y-8">
              <div>
                <h2 className="type-headline-lg mb-6 flex items-center gap-3">
                  <Clock className="w-8 h-8 text-amber-500" />
                  {t('situations_title')}
                </h2>
                <p className="type-body mb-8">{t('situations_desc')}</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                 {[
                   { icon: Zap, text: t('sit_1'), color: "text-yellow-600", bg: "bg-yellow-50" },
                   { icon: Droplets, text: t('sit_2'), color: "text-blue-600", bg: "bg-blue-50" },
                   { icon: AlertTriangle, text: t('sit_3'), color: "text-orange-600", bg: "bg-orange-50" },
                   { icon: Hammer, text: t('sit_4'), color: "text-forest-900", bg: "bg-green-50" },
                 ].map((item, i) => (
                   <div key={i} className={`flex items-center gap-4 p-4 rounded-xl border border-slate-500/10 bg-white hover:shadow-md transition-shadow`}>
                      <div className={`p-3 rounded-full ${item.bg}`}>
                        <item.icon className={`w-6 h-6 ${item.color}`} />
                      </div>
                      <span className="font-medium text-forest-900">{item.text}</span>
                   </div>
                 ))}
              </div>

              <div className="mt-8 p-6 bg-forest-900 text-white rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 rounded-full blur-3xl opacity-20 translate-x-10 -translate-y-10"></div>
                <h3 className="text-xl font-bold mb-2 relative z-10">{t('urgent_title')}</h3>
                <p className="text-off-white-100/80 relative z-10">{t('urgent_desc')}</p>
              </div>
            </div>

          </div>
        </section>

        {/* Featured Services Section */}
        <section className="py-12 md:py-20 bg-white bg-gradient-to-b from-forest-900/8 via-steel-700/5 to-transparent relative overflow-hidden">
          <div className="absolute inset-0 nordic-pattern opacity-[0.04] pointer-events-none" />
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="type-headline">{t('popular_services_title')}</h2>
              <p className="text-slate-600/80 mt-2 text-base md:text-lg">{t('popular_services_subtitle')}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
              {serviceCategories.map((service) => {
                const Icon = getServiceIcon(service.value);
                return (
                  <div 
                    key={service.name} 
                    className="group relative chamfered glass-surface-light border border-slate-500/10 p-6 text-center hover:border-steel-500/50 hover:bg-white kinetic-lift cursor-pointer overflow-hidden flex flex-col items-center justify-center gap-4 transition-all duration-300"
                  >
                    {/* Subtle Nordic gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-steel-600/0 to-forest-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    
                    <div className="p-4 rounded-full bg-slate-500/5 group-hover:bg-gradient-to-br group-hover:from-steel-600 group-hover:to-forest-700 transition-all duration-300 relative z-10 shadow-sm group-hover:shadow-md">
                      <Icon className="w-6 h-6 text-forest-800 group-hover:text-white transition-colors duration-300" />
                    </div>

                    <span className="relative z-10 font-bold text-forest-900 group-hover:text-steel-700 transition-colors text-sm md:text-base tracking-tight">
                      {t(`service_${service.value.toLowerCase().replace('-', '_')}`)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Reklameplass for utvalgte verktøy/partnere */}
            <div className="flex justify-center w-full px-4">
               <AdBanner 
                  format="wide"
                  eyebrow="Månedens Kupp"
                  headline="DeWalt Verktøypakke"
                  body="Gjør som proffene. Skaff deg kvalitetsverktøy fra DeWalt hos vår partner Staypro. Slitesterkt, kraftig og pålitelig."
                  cta="Se tilbud hos Staypro"
                  footerNote="Annonsørinnhold - Inneholder sponsede lenker"
               />
            </div>

          </div>
        </section>

        {/* Final CTA Section */}
        <section id="cta-section" className="py-12 md:py-20 text-center relative overflow-hidden bg-white">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest-900/5 to-steel-800/8" />
            <div className="absolute inset-0 nordic-pattern opacity-[0.03] pointer-events-none" />
            <div className="container mx-auto px-4 relative z-10">
                <h2 className="type-headline">{t('cta_ready_title')}</h2>
                <p className="mt-2 text-slate-600/80 max-w-xl mx-auto text-base md:text-lg">{t('cta_ready_subtitle')}</p>
                <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-4">
                    <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white type-cta tracking-[0.02em] shadow-lg shadow-red-600/20" onClick={() => navigate("/service-request-page")}>
                        {t('hero_cta_button')}
                    </Button>
                    <Button size="lg" variant="outline" className="w-full md:w-auto border-slate-500/30 hover:bg-slate-500/5 text-forest-900 type-cta tracking-[0.02em]" onClick={() => navigate("/handverker-registrering")}>
                        {t('hero_join_button')}
                    </Button>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
