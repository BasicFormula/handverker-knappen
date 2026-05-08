import React from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { usePageTitle } from "utils/hooks";

export default function LaunchInfoPage() {
  const navigate = useNavigate();
  usePageTitle("Lansering | HåndverkerKnappen");

  const timeline = [
    { title: "Plattformen bygges", description: "Vi jobber intensivt med å lage en plattform som løser huseiere og håndverkere.", date: "Kvartal 1", completed: true },
    { title: "Håndverkere registreres", description: "Håndverkere kan nå begynne med å registrere seg på plattformen.", date: "Kvartal 2", completed: true },
    { title: "Lanseringsdag", description: "Offentlig lansering med præsentasjon og demo.", date: "Kvartal 3", completed: true },
    { title: "Markedssprøvelse", description: "Vi starter med å nå ut til markedet med en liten gruppe huseiere.", date: "Kvartal 4", completed: false },
  ];

  const features = [
    { title: "Ferdig Leads", description: "Få ferdig kvalifiserte leads rett i innboksen.", icon: <CheckCircle2 className="w-6 h-6" /> },
    { title: "Mindre Papirarbeid", description: "Mindre papirarbeid med våre digitale verktøy.", icon: <Zap className="w-6 h-6" /> },
    { title: "Digital Merkevare", description: "Bygg din digitale merkevare og samle gode anmeldelser.", icon: <ShieldCheck className="w-6 h-6" /> },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48 px-4 text-center">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-forest-800 via-forest-700 to-steel-600 opacity-95" />
          <div className="absolute inset-0 nordic-pattern opacity-10 [mask-image:linear-gradient(to_bottom,white_20%,transparent_90%)]" />

          <div className="container mx-auto relative z-10 max-w-4xl">
            <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-500/10 font-bold px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-sm mb-6">
              LANSERING 2026
            </Badge>
            <h1 className="type-headline-xl mb-6">
              HåndverkerKnappen <span className="text-amber-500 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-copper-600">Lanseres Snart</span>
            </h1>
            <p className="type-subtitle mb-8">
              Vi forbinder seriøse håndverkere med kunder uten anbudskrig.
              Alle håndverkere er BankID-verifisert.
            </p>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="type-headline text-center mb-16">Lanseringsplan</h2>
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="flex gap-6 items-start">
                  <div className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg ${
                    item.completed
                      ? 'bg-forest-900 text-white shadow-lg'
                      : 'bg-slate-500/10 text-slate-600/50 border-2 border-slate-500/20'
                  }`}>
                    {item.completed ? <CheckCircle2 className="w-6 h-6" /> : index + 1}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-forest-900 mb-1">{item.title}</h3>
                    <p className="text-slate-600/70 font-sans mb-2">{item.description}</p>
                    <div className="text-sm font-semibold text-amber-500">{item.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Preview */}
        <section className="py-24 bg-off-white-50">
          <div className="container mx-auto px-4 max-w-6xl">
            <h2 className="type-headline text-center mb-16">Hva kan du se fram til?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-none shadow-sm hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-bold text-forest-900 mb-2">{feature.title}</h3>
                    <p className="text-slate-600/70 font-sans text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-forest-900 text-white">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
              Klar til å <span className="text-amber-500">bli med?</span>
            </h2>
            <p className="text-lg text-off-white-100/90 mb-10 leading-relaxed">
              Registrer deg i dag og vær blant de første til å ta i bruk plattformen når vi lanserer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate("/handverker-registrering")}
                className="bg-amber-500 hover:bg-copper-600 text-white h-14 px-8 text-lg font-bold rounded-xl shadow-lg shadow-amber-500/20"
              >
                Registrer deg som Håndverker
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/")}
                className="border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg font-semibold rounded-xl"
              >
                Gå til Hjemmesiden
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
