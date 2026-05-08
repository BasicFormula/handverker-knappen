import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import brain from "brain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { CraftsmanProfile, Review } from "types";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { FullScreenError } from "@/components/FullScreenError";

const CraftsmanProfilePage = () => {
  const [searchParams] = useSearchParams();
  const craftsmanId = searchParams.get("id");
  
  const [profile, setProfile] = useState<CraftsmanProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!craftsmanId) {
      setError("Ingen håndverker-ID oppgitt.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch profile and reviews in parallel
        const [profileResponse, reviewsResponse] = await Promise.all([
          brain.get_craftsman_profile_by_id({ id: craftsmanId }),
          brain.get_reviews_for_craftsman({ craftsmanId }),
        ]);

        if (profileResponse.status === 200) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
        } else {
          throw new Error(`Kunne ikke hente håndverkerprofil: ${profileResponse.statusText}`);
        }

        if (reviewsResponse.status === 200) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData);
        } else {
          throw new Error(`Kunne ikke hente anmeldelser: ${reviewsResponse.statusText}`);
        }

      } catch (err: any) {
        console.error("Feil under henting av data:", err);
        setError(err.message || "En uventet feil oppstod.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [craftsmanId]);

  const StarRating = ({ rating, size = 5 }: { rating: number; size?: number }) => (
    <div className="flex items-center">
      {[...Array(size)].map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? "text-amber-500 fill-amber-500" : "text-slate-600/20"
          }`}
        />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="flex-grow flex justify-center items-center">
             <div className="space-y-4 w-full max-w-4xl px-4">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
             </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return <FullScreenError message={`Feil: ${error}`} />;
  }

  if (!profile) {
    return <FullScreenError message="Kunne ikke finne håndverkerprofilen." />;
  }
  
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow relative overflow-hidden py-12 px-4 sm:px-6">
        {/* Background elements */}
        <div className="absolute inset-0 nordic-pattern opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-forest-900/10 via-forest-700/5 to-transparent pointer-events-none"></div>

        <div className="container mx-auto relative z-10 max-w-5xl space-y-8">
          <Card className="glass-surface-light border-slate-500/10 shadow-xl rounded-xl overflow-hidden">
            <div className="h-3 w-full bg-gradient-to-r from-steel-600 to-forest-800"></div>
            <CardHeader className="p-8 bg-slate-50/50 border-b border-slate-500/5">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <Avatar className="h-32 w-32 border-4 border-steel-500/20 shadow-lg ring-2 ring-white">
                  <AvatarImage src={profile.profile_photo_url || ""} alt={profile.name} className="object-cover" />
                  <AvatarFallback className="text-4xl bg-slate-600 text-steel-600 font-bold">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left space-y-2">
                  <h1 className="type-headline-xl text-forest-900">{profile.name}</h1>
                  <p className="text-xl text-steel-700 font-bold tracking-wide">{profile.business_name}</p>
                  <div className="flex items-center gap-3 justify-center md:justify-start bg-white/60 px-3 py-1.5 rounded-full w-fit mx-auto md:mx-0 border border-slate-500/5">
                    <StarRating rating={Math.round(averageRating)} />
                    <span className="text-slate-600 font-semibold">
                      {averageRating.toFixed(1)} <span className="text-slate-600/60 font-normal text-sm">({reviews.length} anmeldelser)</span>
                    </span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <section>
                <h3 className="text-xl font-bold text-forest-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-steel-600 rounded-full"></span>
                    Om Meg
                </h3>
                <p className="text-slate-600/80 leading-relaxed prose prose-slate max-w-none text-lg font-sans">
                    {profile.bio || "Ingen biografi tilgjengelig."}
                </p>
              </section>
              
              <section>
                <h3 className="text-xl font-bold text-forest-900 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 bg-steel-600 rounded-full"></span>
                    Tjenesteodråder
                </h3>
                <div className="flex flex-wrap gap-3">
                  {profile.service_areas?.map((area) => (
                    <Badge key={area} className="bg-amber-500/10 text-forest-900 hover:bg-amber-500/20 border-amber-500/20 text-sm px-4 py-1.5 rounded-full transition-colors">
                      {area}
                    </Badge>
                  ))}
                </div>
              </section>
            </CardContent>
          </Card>

          <section className="mt-12">
            <h2 className="type-headline-lg text-forest-900 mb-6 pl-2 border-l-4 border-amber-500">Anmeldelser</h2>
            {reviews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {reviews.map((review) => (
                  <Card key={review.id} className="glass-surface-light border-slate-500/10 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg font-bold text-forest-900">{review.customer_name || "Anonym"}</CardTitle>
                          <p className="text-sm text-slate-600/60 font-sans">{new Date(review.created_at).toLocaleDateString('no-NO')}</p>
                        </div>
                        <div className="bg-slate-50/80 px-2 py-1 rounded-lg border border-slate-500/5">
                             <StarRating rating={review.rating} size={4} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600/80 italic leading-relaxed">"{review.comment || "Ingen kommentar."}"</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 glass-surface-light rounded-xl border border-slate-500/10 border-dashed">
                <p className="text-slate-600/60 text-lg font-sans">Denne håndverkeren har ingen anmeldelser enda.</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CraftsmanProfilePage;
