import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import brain from "brain";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserGuardContext } from "app/auth";
import { format } from "date-fns";
import { Loader2, StarIcon, CheckCircle } from 'lucide-react';
import { ReviewForm } from "components/ReviewForm";
import { AssignmentDetailsSkeleton } from "components/AssignmentDetailsSkeleton";
import { FullScreenError } from "components/FullScreenError";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Use the generated types from brain
import { AssignmentResponse, Review } from "types";

export default function AssignmentDetailsPage() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const { user } = useUserGuardContext();

  const [assignment, setAssignment] = useState<AssignmentResponse | null>(null);
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleting, setIsCompleting] = useState(false);

  const fetchAssignmentData = async () => {
    if (!id) {
      setError("Ingen oppdrags-ID angitt.");
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Corrected API call
      const assignmentResponse = await brain.get_assignment_by_id({ assignmentId: parseInt(id, 10) });
      if (!assignmentResponse.ok) throw new Error("Kunne ikke hente oppdragsdetaljer.");
      const assignmentData: AssignmentResponse = await assignmentResponse.json();
      setAssignment(assignmentData);

      // If a craftsman is selected, fetch reviews
      if (assignmentData.selected_craftsman_id) {
        // Corrected API call and parameter passing
        const reviewResponse = await brain.get_reviews_for_craftsman({ craftsmanId: assignmentData.selected_craftsman_id });
        if (reviewResponse.ok) {
          const reviewData: Review[] = await reviewResponse.json();
          // Find the specific review for this assignment
          const currentReview = reviewData.find((r) => r.assignment_id === parseInt(id, 10));
          if (currentReview) {
            setReview(currentReview);
          }
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "En uventet feil oppstod.";
      setError(errorMessage);
      toast.error("Feil", { description: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignmentData();
  }, [id]);

  const handleMarkAsComplete = async () => {
    if (!id) return;
    setIsCompleting(true);
    try {
      // Mark as complete functionality not yet implemented
      toast.info("Funksjonen for å markere som fullført er ikke tilgjengelig ennå.");
      
      /* DEPRECATED: accept_assignment was for craftsmen taking the job
      const response = await brain.accept_assignment({ assignmentId: parseInt(id, 10) }); 
      if (response.ok) {
        toast.success("Assignment marked as in progress!");
        fetchAssignmentData(); 
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update assignment.");
      }
      */
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
      toast.error("Error", { description: errorMessage });
    } finally {
      setIsCompleting(false);
    }
  };

  const [isRegisteringInterest, setIsRegisteringInterest] = useState(false);

  const handleRegisterInterest = async () => {
    if (!id) return;
    setIsRegisteringInterest(true);
    try {
        const response = await brain.register_interest({ assignmentId: parseInt(id, 10) });
        if (response.ok) {
            toast.success("Interesse registrert!", { description: "Kunden har fått beskjed." });
            // Optionally refresh data or update UI state
            fetchAssignmentData();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Kunne ikke registrere interesse.");
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "En feil oppstod.";
        toast.error("Feil", { description: errorMessage });
    } finally {
        setIsRegisteringInterest(false);
    }
  };

  if (loading) return <AssignmentDetailsSkeleton />;
  if (error) return <FullScreenError message={error} />;
  if (!assignment) return <FullScreenError message="Kunne ikke finne det forespurte oppdraget." />;

  const isOwner = user.sub === assignment.customer_id;
  const isCompleted = assignment.status === 'completed';
  const isAssigned = assignment.status === 'assigned';
  const isOpen = assignment.status === 'open';

  // Check if current user has already expressed interest
  // The backend now populates interested_craftsmen with the current user's interest if applicable
  const hasRegisteredInterest = assignment.interested_craftsmen?.some(i => i.craftsman_id === user.sub);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-8 space-y-6 max-w-4xl">
        <div className="container mx-auto relative z-10 max-w-4xl space-y-6">
        <Card className="glass-surface-light border-slate-600/10 shadow-lg overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-amber-500 to-copper-600"></div>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div>
                    <CardTitle className="type-headline-lg text-forest-900 mb-2">{assignment.headline}</CardTitle>
                    <CardDescription className="text-slate-600/80 font-sans flex items-center gap-2">
                        <span>Lagt ut {format(new Date(assignment.created_at), "dd.MM.yyyy")}</span>
                        <span>•</span>
                        <span>{assignment.location}</span>
                    </CardDescription>
                </div>
                {isCompleted && (
                    <div className="bg-green-100 text-green-800 px-4 py-1.5 rounded-full text-sm font-bold border border-green-200 self-start shadow-sm">
                        Fullført
                    </div>
                )}
                 {isAssigned && !isCompleted && (
                    <div className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-bold border border-blue-200 self-start shadow-sm">
                        Tildelt
                    </div>
                )}
                 {isOpen && (
                    <div className="bg-amber-50/20 text-amber-500 px-4 py-1.5 rounded-full text-sm font-bold border border-amber-500/30 self-start shadow-sm">
                        Åpen
                    </div>
                )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-slate max-w-none text-slate-600 font-sans">
                <h3 className="text-lg font-bold text-forest-900 mb-3">Beskrivelse</h3>
                <p className="whitespace-pre-wrap leading-relaxed text-slate-600/90">{assignment.detailed_description}</p>
                
                {assignment.required_services && assignment.required_services.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-slate-600/10">
                        <h3 className="text-lg font-bold text-forest-900 mb-4">Ønskede tjenester</h3>
                        <div className="flex flex-wrap gap-2">
                            {assignment.required_services.map((service, i) => (
                                <span key={i} className="px-4 py-1.5 bg-amber-500/10 text-forest-900 border border-amber-500/20 rounded-full text-sm font-medium hover:bg-amber-500/20 transition-colors">
                                    {service}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Contact Info (Only visible if owner or selected craftsman) */}
                {assignment.customer_phone && (
                    <div className="mt-8 pt-6 border-t border-slate-600/10">
                        <h3 className="text-lg font-bold text-forest-900 mb-2">Kontaktinformasjon</h3>
                        <p className="text-slate-600/90">
                            <span className="font-semibold">Navn:</span> {assignment.customer_name}<br/>
                            <span className="font-semibold">Telefon:</span> {assignment.customer_phone}<br/>
                            <span className="font-semibold">E-post:</span> {assignment.customer_email}
                        </p>
                    </div>
                )}
            </div>
          </CardContent>
        </Card>

        {/* Craftsman Action: Register Interest */}
        {!isOwner && isOpen && (
            <Card className={`glass-surface-light shadow-md ${hasRegisteredInterest ? 'border-green-200 bg-green-50/50' : 'border-amber-500/30'}`}>
                <CardHeader>
                    <CardTitle className="text-forest-900 flex items-center gap-2">
                        {hasRegisteredInterest ? (
                            <>
                                <CheckCircle className="h-6 w-6 text-green-600" />
                                Interesse registrert
                            </>
                        ) : (
                            "Interessert i jobben?"
                        )}
                    </CardTitle>
                    <CardDescription className="text-slate-600/80">
                        {hasRegisteredInterest 
                            ? "Du har meldt din interesse. Kunden vil ta kontakt hvis du blir valgt."
                            : "Meld din interesse for å komme i kontakt med kunden. Kunden vil se din profil og ta kontakt hvis du blir valgt."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {hasRegisteredInterest ? (
                         <Button 
                            disabled 
                            className="bg-green-100 text-green-800 border border-green-200 opacity-100 font-semibold shadow-none"
                        >
                            Venter på svar
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleRegisterInterest} 
                            disabled={isRegisteringInterest} 
                            className="bg-forest-700 hover:bg-forest-800 text-white h-11 px-8 shadow-md text-lg font-semibold w-full md:w-auto"
                        >
                            {isRegisteringInterest && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Vis interesse
                        </Button>
                    )}
                </CardContent>
            </Card>
        )}

        {isOwner && !isCompleted && assignment.selected_craftsman_id && (
          <Card className="glass-surface-light border-amber-500/30 shadow-md">
            <CardHeader>
              <CardTitle className="text-forest-900 flex items-center gap-2">
                <StarIcon className="w-5 h-5 text-amber-500 fill-amber-500" />
                Fullfør Oppdraget
              </CardTitle>
              <CardDescription className="text-slate-600/80">
                Når jobben er ferdig, marker den som fullført for å kunne legge igjen en anmeldelse.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleMarkAsComplete} disabled={isCompleting} className="bg-forest-900 hover:bg-forest-900/90 text-white h-11 px-6 shadow-md">
                {isCompleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Marker som Fullført
              </Button>
            </CardContent>
          </Card>
        )}

        {isCompleted && assignment.selected_craftsman_id && (
          <Card className="glass-surface-light border-slate-600/20 shadow-sm">
            <CardHeader>
              <CardTitle className="text-forest-900">Tilbakemelding</CardTitle>
            </CardHeader>
            <CardContent>
              {review ? (
                <div className="space-y-4 bg-white/50 p-6 rounded-xl border border-slate-600/10">
                  <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className={`h-5 w-5 ${i < review.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-600/20'}`} />
                        ))}
                      </div>
                  </div>
                  <p className="text-sm text-slate-600/60">Anmeldt den {format(new Date(review.created_at), "dd.MM.yyyy")}</p>
                  <p className="prose text-slate-600 italic">"{review.comment}"</p>
                </div>
              ) : isOwner ? (
                  <div className="bg-amber-500/5 p-6 rounded-xl border border-amber-500/10">
                    <h4 className="font-semibold text-forest-900 mb-4">Legg igjen en anmeldelse</h4>
                    <ReviewForm
                        assignmentId={assignment.id}
                        craftsmanId={assignment.selected_craftsman_id}
                        onReviewSubmit={fetchAssignmentData} // Refresh data after submission
                    />
                  </div>
              ) : (
                  <p className="text-slate-600/70 italic">Kunden har ikke lagt igjen en anmeldelse ennå.</p>
              )}
            </CardContent>
          </Card>
        )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
