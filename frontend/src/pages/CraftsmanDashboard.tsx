import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Briefcase, User, CheckCircle, Clock, Zap, AlertCircle, Building, Star, PlusCircle, Wrench } from "lucide-react";
import brain from "brain";
import { AssignmentResponse, CraftsmanProfile as CraftsmanProfileType, AffiliateProduct } from "types";
import { useUserGuardContext } from "app/auth";
import { AdBanner } from "@/components/AdBanner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CraftsmanDashboard() {
  const navigate = useNavigate();
  const { user } = useUserGuardContext();
  const [profile, setProfile] = useState<CraftsmanProfileType | null>(null);
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [availableLeads, setAvailableLeads] = useState<AssignmentResponse[]>(
    [],
  );
  const [affiliateProducts, setAffiliateProducts] = useState<AffiliateProduct[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only set loading true if we don't have data yet to avoid flashing on re-fetches if we wanted to support that
        // But for now, standard fetch on mount/user-change
        setLoading(true);
        setError(null);

        const [profileRes, assignedRes, leadsRes, adsRes] = await Promise.all([
          brain.get_current_craftsman_profile(),
          brain.get_craftsman_assignments(),
          brain.list_open_assignments(),
          brain.list_affiliate_products2(),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData);
        } else {
          console.error("Failed to fetch profile:", await profileRes.text());
          setError("Klarte ikke å hente profilen din.");
        }

        if (assignedRes.ok) {
          setAssignments(await assignedRes.json());
        } else {
          console.error("Failed to fetch assignments:", await assignedRes.text());
          setError((prev) => (prev ? `${prev} Klarte ikke å hente dine oppdrag.` : "Klarte ikke å hente dine oppdrag."));
        }

        if (leadsRes.ok) {
          setAvailableLeads(await leadsRes.json());
        } else {
          console.error("Failed to fetch open assignments:", await leadsRes.text());
          setError((prev) => (prev ? `${prev} Klarte ikke å hente tilgjengelige leads.` : "Klarte ikke å hente tilgjengelige leads."));
        }

        if (adsRes.ok) {
          setAffiliateProducts(await adsRes.json());
        }
      } catch (e: any) {
        setError("En uventet feil oppstod. Prøv igjen senere.");
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user.id]);

  useEffect(() => {
    if (affiliateProducts.length > 0) {
      // Rotate ad every 10 seconds or just pick random on mount?
      // Let's just pick a random one on mount for now to keep it simple, or we can use the index if we want rotation later.
      // Actually, let's just pick a random start index.
      setCurrentAdIndex(Math.floor(Math.random() * affiliateProducts.length));
    }
  }, [affiliateProducts]);

  const currentAd = affiliateProducts.length > 0 ? affiliateProducts[currentAdIndex] : null;

  const WelcomeHeader = () => (
    <div className="mb-8 p-6 rounded-xl glass-surface-light border border-slate-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-forest-900 tracking-tight">
          Hei, {user.displayName || user.primaryEmail || "Håndverker"}!
        </h1>
        <p className="text-slate-600/80 mt-2 text-base font-sans">
          Her har du oversikt over dine oppdrag og nye muligheter.
        </p>
      </div>
      <Button
        onClick={() => navigate("/edit-craftsman-profile")}
        className="bg-forest-700 hover:bg-forest-800 text-white font-semibold w-full sm:w-auto shadow-sm transition-all"
      >
        <User className="mr-2 h-4 w-4" />
        Rediger Profil
      </Button>
    </div>
  );

  const StatCard = ({
    icon,
    title,
    value,
    colorClass,
    action,
  }: {
    icon: React.ReactNode;
    title: string;
    value: string | number;
    colorClass: string;
    action?: { label: string; handler: () => void };
  }) => (
    <Card className="glass-surface-light border-slate-500/20 flex flex-col shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
            {title}
          </CardTitle>
          <div className={colorClass}>{icon}</div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-3xl font-bold text-forest-900">{value}</div>
      </CardContent>
      {action && (
        <CardFooter>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-amber-500 hover:text-copper-600 hover:bg-amber-500/10 p-0 px-2"
            onClick={action.handler}
          >
            {action.label}
          </Button>
        </CardFooter>
      )}
    </Card>
  );

  const LeadCard = ({ lead }: { lead: AssignmentResponse }) => (
    <Card className="glass-surface-light border-slate-500/20 hover:border-amber-500/50 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md hover:-translate-y-1 group">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-forest-900 truncate group-hover:text-amber-500 transition-colors">
          {lead.headline || "Tittel mangler"}
        </CardTitle>
        <CardDescription className="text-slate-600/70 pt-1 text-sm font-sans flex items-center gap-1">
          <Building className="w-3 h-3" /> {lead.location || "Sted ikke angitt"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-slate-600/80 line-clamp-2 font-sans">
          {lead.detailed_description || "Beskrivelse mangler."}
        </p>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full bg-forest-900 hover:bg-forest-800 text-white font-semibold"
          onClick={() => navigate(`/assignment-details-page?id=${lead.id}`)}
        >
          Se Detaljer
        </Button>
      </CardFooter>
    </Card>
  );

  const MyAssignmentRow = ({ assignment }: { assignment: AssignmentResponse }) => {
    let badgeVariant: "default" | "secondary" | "destructive" | "outline" = "secondary";
    let badgeText = "Ukjent";
    let badgeClass = "";

    const isAssignedToMe = assignment.relationship === 'assigned';
    const isInterestRegistered = assignment.relationship === 'interested';

    if (assignment.status === 'completed') {
        badgeVariant = "default";
        badgeText = "Fullført";
        badgeClass = "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
    } else if (isAssignedToMe) {
        badgeVariant = "default";
        badgeText = "Ditt oppdrag"; // Or "Pågående"
        badgeClass = "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200";
    } else if (isInterestRegistered) {
        if (assignment.status === 'assigned') {
             // Assigned to someone else
             badgeVariant = "secondary"; // or destructive?
             badgeText = "Gitt til annen";
             badgeClass = "bg-gray-100 text-gray-500 border-gray-200";
        } else {
             badgeVariant = "secondary";
             badgeText = "Venter på svar";
             badgeClass = "bg-amber-500/20 text-amber-500 border-amber-500/30";
        }
    }

    return (
    <div
      className="p-4 rounded-lg border border-slate-600/10 bg-white/50 hover:bg-white/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 transition-all cursor-pointer shadow-sm"
      onClick={() => navigate(`/assignment-details-page?id=${assignment.id}`)}
    >
      <div className="flex-grow">
        <h3 className="font-semibold text-forest-900 text-base">
          {assignment.headline || "Tittel mangler"}
        </h3>
        <p className="text-sm text-slate-600/70 truncate max-w-md mt-1 font-sans">
          {assignment.detailed_description || "Beskrivelse mangler"}
        </p>
      </div>
      <Badge
        variant={badgeVariant}
        className={badgeClass}
      >
        <Clock className="mr-1 h-3 w-3" />
        {badgeText}
      </Badge>
    </div>
  );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <WelcomeHeader />

        {error && (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 text-red-800">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Feil</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            icon={<Briefcase className="w-5 h-5" />}
            title="Dine Oppdrag"
            value={assignments.filter((a) => a.relationship === 'assigned' && a.status !== 'completed').length}
            colorClass="text-forest-900"
          />
           <StatCard
            icon={<CheckCircle className="w-5 h-5" />}
            title="Fullførte"
            value={assignments.filter((a) => a.status === "completed" && a.relationship === 'assigned').length}
            colorClass="text-green-600"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            title="Venter svar"
            value={assignments.filter((a) => a.relationship === 'interested' && a.status === 'open').length}
            colorClass="text-amber-500"
          />
           <StatCard
            icon={<Zap className="w-5 h-5" />}
            title="Nye Leads"
            value={availableLeads.length}
            colorClass="text-blue-500"
            action={{
              label: "Se alle leads",
              handler: () => navigate("/purchase-leads-page"),
            }}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area (Left 2/3) */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* New Leads Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-forest-900 flex items-center gap-2">
                  <Zap className="h-5 w-5 text-amber-500" />
                  Nye muligheter i ditt område
                </h2>
                <Button variant="link" className="text-amber-500 hover:text-copper-600 p-0" onClick={() => navigate("/purchase-leads-page")}>
                  Se alle
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                {loading ? (
                  Array(2).fill(0).map((_, i) => (
                    <Card key={i} className="h-48 animate-pulse bg-slate-600/5 border-none" />
                  ))
                ) : availableLeads.length > 0 ? (
                  availableLeads.slice(0, 4).map((lead) => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))
                ) : (
                   <div className="col-span-2 p-8 text-center bg-white/50 rounded-xl border border-slate-600/10 border-dashed">
                    <p className="text-slate-600/70">Ingen nye leads akkurat nå.</p>
                  </div>
                )}
              </div>
            </section>

             {/* Active Assignments Section */}
             <section>
               <h2 className="text-xl font-bold text-forest-900 mb-6 flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-forest-900" />
                  Dine oppdrag & søknader
               </h2>
               <div className="space-y-3">
                 {loading ? (
                   <div className="h-20 animate-pulse bg-slate-600/5 rounded-lg" />
                 ) : assignments.length > 0 ? (
                   assignments.map((assignment) => (
                     <MyAssignmentRow key={assignment.id} assignment={assignment} />
                   ))
                 ) : (
                   <div className="p-8 text-center bg-white/50 rounded-xl border border-slate-600/10 border-dashed">
                     <p className="text-slate-600/70">Du har ingen aktive oppdrag eller søknader.</p>
                     <Button variant="link" className="text-amber-500 mt-2" onClick={() => navigate("/purchase-leads-page")}>
                       Finn oppdrag nå
                     </Button>
                   </div>
                 )}
               </div>
             </section>

          </div>

          {/* Sidebar (Right 1/3) */}
          <div className="space-y-6">
            
            {/* Action Box */}
             <Card className="glass-surface-light border-amber-500/30 shadow-md overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-amber-500 to-copper-600" />
                <CardHeader>
                  <CardTitle className="text-lg text-forest-900">Vil du ha flere jobber?</CardTitle>
                  <CardDescription>Oppgrader profilen din for å bli mer synlig.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center gap-2 text-sm text-slate-600/80">
                      <CheckCircle className="h-4 w-4 text-forest-900" /> Verifisert-badge
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600/80">
                      <CheckCircle className="h-4 w-4 text-forest-900" /> Prioritert i søk
                    </li>
                  </ul>
                  <Button className="w-full bg-forest-900 hover:bg-forest-900/90 text-white" onClick={() => navigate("/edit-craftsman-profile")}>
                    Oppdater Profil
                  </Button>
                </CardContent>
             </Card>

            {/* Reklameplass: Partner Ad */}
             <div className="flex justify-center">
                {currentAd ? (
                  <AdBanner 
                    format="vertical"
                    eyebrow={`Partner: ${currentAd.partner_name}`}
                    headline={currentAd.name}
                    body={currentAd.description}
                    bullet="Eksklusiv pris"
                    cta="Se Tilbud"
                    link={currentAd.product_url}
                    footerNote="Sponset innhold"
                  />
                ) : (
                  <AdBanner 
                    format="vertical"
                    eyebrow="Partner Tilbud"
                    headline="Proffenes Valg"
                    body="Få tilgang til markedets beste verktøy til innkjøpspris gjennom vårt partnerprogram."
                    bullet="Spar opptil 30%"
                    cta="Søk Nå"
                    footerNote="Sponset innhold"
                  />
                )}
             </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
