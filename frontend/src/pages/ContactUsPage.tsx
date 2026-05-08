import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, Building } from "lucide-react";

const contactInfo = [
  {
    icon: <Mail className="w-6 h-6 text-amber-500" />,
    title: "E-post",
    description: "For generelle henvendelser og support.",
    value: "post@masters-as.no",
    href: "mailto:post@masters-as.no",
  },
  {
    icon: <Phone className="w-6 h-6 text-amber-500" />,
    title: "Telefon",
    description: "Tilgjengelig mandag - fredag, 09:00 - 16:00.",
    value: "+47 95 18 34 53",
    href: "tel:+4795183453",
  },
];

export default function ContactUsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-forest-900/5 via-forest-700/3 to-transparent pointer-events-none"></div>
        <div className="absolute inset-0 nordic-pattern opacity-[0.03] pointer-events-none"></div>
        
        <Card className="w-full max-w-2xl glass-surface-light border-slate-500/20 shadow-xl rounded-xl relative z-10">
          <CardHeader className="text-center">
            <CardTitle className="type-headline-lg text-forest-900">
              Kontakt Oss
            </CardTitle>
            <CardDescription className="text-slate-600/80 mt-2 font-sans text-lg">
              Vi er her for å hjelpe. Ta gjerne kontakt med oss.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6">
            <div className="space-y-8">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center border border-amber-500/20">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-forest-900">{item.title}</h3>
                    <p className="text-sm text-slate-600/80 mb-1 font-sans">{item.description}</p>
                    <a
                      href={item.href}
                      target={item.target || "_self"}
                      rel="noopener noreferrer"
                      className="text-amber-500 font-semibold hover:text-copper-600 hover:underline transition-colors"
                    >
                      {item.value}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
