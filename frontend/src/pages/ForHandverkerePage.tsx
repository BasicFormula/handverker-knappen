import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Zap, Users, Award, CheckCircle2, TrendingUp, Coins, ShieldCheck, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { usePageTitle } from "utils/hooks";
import { useTranslation } from "utils/translations";

export default function ForHandverkerePage() {
  const navigate = useNavigate();
  usePageTitle("For Håndverkere | HåndverkerKnappen");
  const { t } = useTranslation();

  const benefits = [
    {
      icon: <TrendingUp className="w-8 h-8 text-amber-500" />,
      title: t('fh_benefit_1_title'),
      description: t('fh_benefit_1_desc'),
    },
    {
      icon: <Users className="w-8 h-8 text-amber-500" />,
      title: t('fh_benefit_2_title'),
      description: t('fh_benefit_2_desc'),
    },
    {
      icon: <Award className="w-8 h-8 text-amber-500" />,
      title: t('fh_benefit_3_title'),
      description: t('fh_benefit_3_desc'),
    },
  ];

  const offerDetails = [
    t('offer_detail_1'),
    t('offer_detail_2'),
    t('offer_detail_3'),
    t('offer_detail_4'),
    t('offer_detail_5')
  ];

  return (
    <div className="flex flex-col min-h-screen bg-off-white-100">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32 md:pt-32 md:pb-48 px-4 text-center lg:text-left">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-forest-800 via-forest-700 to-steel-600 opacity-95" />
            <div className="absolute inset-0 nordic-pattern opacity-10 [mask-image:linear-gradient(to_bottom,white_20%,transparent_90%)]" />
            
            <div className="container mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <Badge variant="outline" className="border-amber-500 text-amber-600 bg-amber-500/10 font-bold px-4 py-1.5 text-sm uppercase tracking-wider backdrop-blur-sm">
                        {t('fh_hero_badge')}
                    </Badge>
                    <h1 className="type-headline-xl">
                        {t('fh_hero_title')} <span className="text-amber-500 bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-copper-600">{t('fh_hero_title_highlight')}</span>
                    </h1>
                    <p className="type-subtitle max-w-xl">
                        {t('fh_hero_subtitle')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
                        <Button
                            size="lg"
                            onClick={() => navigate("/handverker-registrering")}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white type-cta py-6 px-8 text-lg rounded-xl shadow-lg shadow-red-600/20 transition-all hover:scale-105"
                        >
                            {t('fh_btn_register')}
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => document.getElementById('offer')?.scrollIntoView({ behavior: 'smooth' })}
                            className="border-slate-500/30 text-slate-600 hover:bg-slate-500/5 type-cta py-6 px-8 text-lg rounded-xl"
                        >
                            {t('fh_btn_read_more')}
                        </Button>
                    </div>
                    <div className="flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-600/70 pt-2 font-medium">
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-900" /> {t('fh_no_binding')}</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-forest-900" /> {t('fh_no_commission')}</span>
                    </div>
                </div>

                {/* Hero Visual/Card */}
                <div className="relative mx-auto w-full max-w-md lg:max-w-full">
                    <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 to-forest-900/20 rounded-full blur-3xl opacity-70 animate-pulse" />
                    <Card className="relative glass-surface-light border-slate-500/10 shadow-2xl overflow-hidden chamfered">
                        <CardContent className="p-8 md:p-10 space-y-8">
                            <div className="text-center space-y-2">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600/60">{t('fh_card_launch_price')}</h3>
                                <div className="flex items-baseline justify-center gap-2">
                                    <span className="text-6xl font-extrabold text-forest-900">50,-</span>
                                    <span className="text-xl text-slate-600/60 font-medium">{t('fh_card_per_customer')}</span>
                                </div>
                                <div className="inline-block bg-red-600/10 text-red-600 font-bold px-3 py-1 rounded-full text-sm transform -rotate-2">
                                    {t('fh_card_normal_price')}
                                </div>
                            </div>

                            <Separator className="bg-slate-500/10" />

                            <ul className="space-y-4">
                                {offerDetails.map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-left">
                                        <div className="mt-1 bg-forest-900/10 p-1 rounded-full">
                                            <CheckCircle2 className="w-4 h-4 text-forest-900" />
                                        </div>
                                        <span className="text-slate-600 font-medium">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            <Button 
                                onClick={() => navigate("/handverker-registrering")}
                                className="w-full bg-forest-900 hover:bg-forest-800 text-white h-12 font-bold rounded-lg shadow-md"
                            >
                                {t('fh_card_cta')} <ArrowRight className="ml-2 w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>

        {/* Value Props Grid */}
        <section id="features" className="py-24 bg-white relative">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="type-headline mb-4">{t('fh_features_title')}</h2>
                    <p className="text-lg text-slate-600/80 leading-relaxed">
                        {t('fh_features_desc')}
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="group p-8 rounded-2xl bg-off-white-50 border border-slate-500/5 hover:border-amber-500/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                            <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-500/5">
                                {benefit.icon}
                            </div>
                            <h3 className="text-xl font-bold text-forest-900 mb-3">{benefit.title}</h3>
                            <p className="text-slate-600/70 leading-relaxed">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Detailed Offer Section */}
        <section id="offer" className="py-24 bg-forest-900 text-white relative overflow-hidden">
             {/* Abstract industrial shapes background */}
             <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 transform origin-top-right" />
             <div className="absolute bottom-0 left-0 w-1/3 h-full bg-amber-500/10 -skew-x-12 transform origin-bottom-left" />

             <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                            {t('fh_offer_title')} <span className="text-amber-500">{t('fh_offer_title_highlight')}</span>
                        </h2>
                        <div className="space-y-6 text-lg text-off-white-100/90 leading-relaxed">
                            <p>
                                {t('fh_offer_p1')}
                            </p>
                            <p>
                                {t('fh_offer_p2')}
                            </p>
                        </div>
                        <div className="mt-10 grid grid-cols-2 gap-8 border-t border-white/10 pt-8">
                            <div>
                                <div className="text-3xl font-bold text-amber-500 mb-1">2027</div>
                                <div className="text-sm opacity-70">{t('fh_offer_valid_until')}</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-amber-500 mb-1">50%</div>
                                <div className="text-sm opacity-70">{t('fh_offer_discount_text')}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
                         <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                            <Coins className="w-6 h-6 text-amber-500" />
                            {t('fh_price_example_title')}
                         </h3>
                         <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                                <span>{t('fh_price_regular')}</span>
                                <span className="font-bold line-through text-white/50">100 kr</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-amber-500/20 rounded-lg border border-amber-500/30">
                                <span className="font-bold text-amber-500">{t('fh_price_yours')}</span>
                                <span className="font-bold text-2xl text-white">50 kr</span>
                            </div>
                         </div>
                         <p className="mt-6 text-sm text-white/60 text-center">
                            {t('fh_price_note')}
                         </p>
                         <Button 
                            onClick={() => navigate("/handverker-registrering")}
                            className="w-full mt-8 bg-amber-500 hover:bg-copper-600 text-white h-14 text-lg font-bold shadow-lg shadow-amber-500/20"
                         >
                            {t('fh_btn_start_saving')}
                         </Button>
                    </div>
                </div>
             </div>
        </section>

        {/* FAQ / Trust Section */}
        <section className="py-24 bg-off-white-50">
            <div className="container mx-auto px-4 max-w-4xl">
                 <div className="text-center mb-12">
                    <h2 className="type-headline">{t('fh_faq_title')}</h2>
                 </div>
                 
                 <div className="grid gap-6">
                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-forest-900 mb-2 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-forest-900/70" />
                                {t('fh_faq_1_q')}
                            </h3>
                            <p className="text-slate-600/80">
                                {t('fh_faq_1_a')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-forest-900 mb-2 flex items-center gap-2">
                                <Coins className="w-5 h-5 text-forest-900/70" />
                                {t('fh_faq_2_q')}
                            </h3>
                            <p className="text-slate-600/80">
                                {t('fh_faq_2_a')}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <h3 className="text-lg font-bold text-forest-900 mb-2 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-forest-900/70" />
                                {t('fh_faq_3_q')}
                            </h3>
                            <p className="text-slate-600/80">
                                {t('fh_faq_3_a')}
                            </p>
                        </CardContent>
                    </Card>
                 </div>
            </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
