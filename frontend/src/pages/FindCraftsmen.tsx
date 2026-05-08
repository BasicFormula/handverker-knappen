import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import brain from "brain";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type CraftsmanPublicProfile } from "types";
import { CraftsmanResultCard, CraftsmanCardSkeleton } from "components/CraftsmanResultCard";
import { Search, X, AlertTriangle, Phone, ExternalLink, Zap } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header"; 
import Footer from "components/Footer";
import { SERVICE_CATEGORIES } from "utils/services";

const areaOptions = ["Oslo", "Bergen", "Trondheim", "Stavanger", "Kristiansand", "Tromsø"];

const URGENT_CATEGORIES = ["rørlegger", "elektriker", "skadedyrkontroll", "mekaniker", "pc-hjelp", "låsesmed"];

export default function FindCraftsmen() {
  const navigate = useNavigate();
  const [craftsmen, setCraftsmen] = useState<CraftsmanPublicProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCraftsmen = async () => {
    setLoading(true);
    try {
      const response = await brain.search_craftsmen({
        searchTerm: searchTerm,
        services: selectedService ? [selectedService] : [],
        areas: selectedArea ? [selectedArea] : [],
      });
      const data = await response.json();
      setCraftsmen(data);
    } catch (error) {
      console.error("Kunne ikke hente håndverkere:", error);
      toast.error("Kunne ikke laste inn håndverkere.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCraftsmen();
  }, []); // Initial fetch

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCraftsmen();
  };

  const isUrgentCategory = selectedService && URGENT_CATEGORIES.includes(SERVICE_CATEGORIES.find(s => s.label === selectedService)?.value || "");

  const handleGoogleSearch = () => {
    if (!selectedService) return;
    const query = `Akutt ${selectedService} ${selectedArea || "i nærheten"}`;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, "_blank");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedService("");
    setSelectedArea("");
    // Optionally re-fetch with cleared filters
    // fetchCraftsmen();
  };

  const filteredCraftsmen = craftsmen.filter((craftsman) => {
    const matchesSearch =
      craftsman.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      craftsman.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = selectedService
      ? craftsman.services_offered?.includes(selectedService)
      : true;
    return matchesSearch && matchesService;
  });

  return (
    <div className="flex flex-col min-h-screen bg-off-white-100/30 text-slate-600">
      <Header />
      <main className="flex-grow relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 nordic-pattern opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-forest-900/10 via-forest-700/5 to-transparent pointer-events-none"></div>

        <div className="container mx-auto relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl">
          <header className="py-12 text-center">
            <h1 className="type-headline-xl text-forest-900 mb-4">
              Finn en Håndverker
            </h1>
            <p className="text-slate-600/80 text-xl max-w-2xl mx-auto font-sans leading-relaxed">
              Søk i vårt nettverk av verifiserte fagfolk og få jobben gjort.
            </p>
          </header>

          <div className="p-8 mb-12 glass-surface-light border border-slate-500/10 rounded-xl shadow-xl backdrop-blur-md">
            <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-grow w-full lg:w-auto">
                <label htmlFor="search" className="sr-only">
                  Søk
                </label>
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-600/50 group-focus-within:text-amber-500 transition-colors" />
                  <Input
                    id="search"
                    placeholder="Søk på navn, tjeneste eller firma..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/80 border-slate-500/20 text-slate-600 placeholder-slate-600/40 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-full pl-12 h-14 text-lg rounded-xl transition-all shadow-sm hover:border-amber-500/30"
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <Select onValueChange={setSelectedService} value={selectedService}>
                  <SelectTrigger id="services" className="bg-white/80 border-slate-500/20 text-slate-600 h-14 text-base w-full sm:w-48 rounded-xl shadow-sm hover:border-amber-500/30 focus:ring-2 focus:ring-amber-500/20">
                    <SelectValue placeholder="Alle tjenester" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-500/20 text-slate-600 shadow-xl rounded-xl">
                    {SERVICE_CATEGORIES.map((s) => (
                      <SelectItem key={s.value} value={s.label} className="focus:bg-amber-500/10 focus:text-forest-900 cursor-pointer py-3">
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={setSelectedArea} value={selectedArea}>
                  <SelectTrigger id="areas" className="bg-white/80 border-slate-500/20 text-slate-600 h-14 text-base w-full sm:w-48 rounded-xl shadow-sm hover:border-amber-500/30 focus:ring-2 focus:ring-amber-500/20">
                    <SelectValue placeholder="Alle områder" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-500/20 text-slate-600 shadow-xl rounded-xl">
                    {areaOptions.map((a) => (
                      <SelectItem key={a} value={a} className="focus:bg-amber-500/10 focus:text-forest-900 cursor-pointer py-3">
                        {a}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button type="button" variant="ghost" onClick={clearFilters} className="h-14 w-14 p-0 text-slate-600/60 hover:text-forest-900 hover:bg-slate-500/10 rounded-xl shrink-0">
                    <X className="h-6 w-6" />
                  </Button>
                  <Button type="submit" className="h-14 flex-grow sm:w-auto px-8 bg-amber-500 text-white hover:bg-copper-600 font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5">
                    Søk
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {isUrgentCategory && (
            <div className="mb-12 p-6 rounded-xl bg-red-50 border border-red-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 text-red-600 rounded-full shrink-0">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-800 mb-1">
                      Trenger du akutt hjelp?
                    </h3>
                    <p className="text-red-700/80 max-w-xl">
                      For {selectedService?.toLowerCase()} kan det ofte haste. 
                      Finner du ingen ledige her, anbefaler vi å utvide søket eller kontakte nødtjenester ved fare for liv og helse.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 w-full md:w-auto">
                   <Button 
                    variant="outline" 
                    className="border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800 h-12 px-6 gap-2 bg-white"
                    onClick={handleGoogleSearch}
                  >
                    <ExternalLink className="w-4 h-4" />
                    Søk på Google
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700 text-white h-12 px-6 shadow-md hover:shadow-lg gap-2"
                    onClick={() => navigate(`/service-request-page?category=${selectedService}&urgent=true`)}
                  >
                    <Zap className="w-4 h-4 fill-current" />
                    Kan du komme nå?
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => <CraftsmanCardSkeleton key={i} />)}
              </div>
            ) : craftsmen.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {craftsmen.map((craftsman) => (
                  <CraftsmanResultCard 
                    key={craftsman.id} 
                    craftsman={craftsman}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-slate-500/10 rounded-xl bg-white/30 glass-surface-light">
                <div className="bg-slate-500/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-slate-600/40" />
                </div>
                <h3 className="text-2xl font-bold text-forest-900 mb-2">Ingen håndverkere funnet</h3>
                <p className="text-slate-600/60 font-sans max-w-md mx-auto">Prøv å justere søkefiltrene dine eller fjern filtrene helt for å se flere resultater.</p>
                <Button onClick={clearFilters} variant="link" className="text-amber-500 mt-4 font-semibold">
                    Nullstill alle filtre
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
