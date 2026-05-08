import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import brain from "brain";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ReviewModal } from "components/ReviewModal";
import { AssignmentResponse, Review } from "types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Briefcase } from "lucide-react";

export default function MyAssignmentsPage() {
  const [assignments, setAssignments] = useState<AssignmentResponse[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<number | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const navigate = useNavigate();

  const allCount = assignments.length;
  const activeCount = assignments.filter(a => a.status === 'open' || a.status === 'assigned').length;
  const completedCount = assignments.filter(a => a.status === 'completed').length;

  const fetchData = async () => {
    try {
      const [assignmentsResponse, reviewsResponse] = await Promise.all([
        brain.get_my_assignments(),
        brain.get_my_reviews(),
      ]);

      if (assignmentsResponse.ok) {
        setAssignments(await assignmentsResponse.json());
      } else {
        toast.error("Kunne ikke hente dine oppdrag.");
      }

      if (reviewsResponse.ok) {
        setReviews(await reviewsResponse.json());
      } else {
        toast.error("Kunne ikke hente dine anmeldelser.");
      }
    } catch (error) {
      toast.error("En feil oppstod under henting av data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const reviewedAssignmentIds = new Set(reviews.map((r) => r.assignment_id));

  const handleReviewSubmitted = () => {
    setLoading(true);
    fetchData();
  };

  const handleSelectCraftsman = async (assignmentId: number, craftsmanUserId: string) => {
    const toastId = toast.loading("Velger håndverker...");
    try {
        const response = await brain.select_craftsman({ assignment_id: assignmentId, craftsman_user_id: craftsmanUserId });
        if (response.ok) {
            toast.success("Håndverker valgt!", { id: toastId, description: "Håndverkeren har blitt varslet." });
            fetchData();
        } else {
            toast.error("Kunne ikke velge håndverker.", { id: toastId });
        }
    } catch (error) {
        toast.error("En feil oppstod.", { id: toastId });
    }
  };

  const getStatusBadge = (assignment: AssignmentResponse) => {
    const isReviewed = reviewedAssignmentIds.has(assignment.id);

    if (isReviewed) {
      return <Badge variant="default" className="bg-slate-300 text-slate-700 hover:bg-slate-400">Anmeldt</Badge>;
    }
    if (assignment.status === "completed") {
      return (
        <Button
          size="sm"
          className="bg-forest-800 hover:bg-forest-900 text-white transition-all hover:shadow-lg"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setSelectedAssignmentId(assignment.id);
          }}
        >
          Gi anmeldelse
        </Button>
      );
    }
    
    const statusLabels: Record<string, string> = {
        open: "Åpen",
        assigned: "Tildelt",
        completed: "Fullført"
    };

    return <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 border border-amber-500/20">{statusLabels[assignment.status] || assignment.status}</Badge>;
  };
  
  const getInitials = (name: string) => {
      return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 max-w-7xl">
        <div className="mb-12">
          <h1 className="type-headline-xl text-forest-900 mb-3">Mine Oppdrag</h1>
          <p className="text-slate-600/70 text-lg font-sans max-w-2xl">
            Her finner du en oversikt over alle dine oppdrag.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8 p-1 bg-white rounded-xl shadow-sm border border-slate-500/10">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all transform ${
              filter === 'all'
                ? 'bg-forest-900 text-white shadow-md scale-[1.02]'
                : 'bg-transparent text-slate-600 hover:bg-slate-500/5'
            }`}
          >
            Alle ({allCount})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all transform ${
              filter === 'active'
                ? 'bg-amber-500 text-white shadow-md scale-[1.02]'
                : 'bg-transparent text-slate-600 hover:bg-slate-500/5'
            }`}
          >
            Aktive ({activeCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all transform ${
              filter === 'completed'
                ? 'bg-forest-700 text-white shadow-md scale-[1.02]'
                : 'bg-transparent text-slate-600 hover:bg-slate-500/5'
            }`}
          >
            Fullførte ({completedCount})
          </button>
        </div>

        <div className="space-y-4">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full bg-slate-200" />
            ))
          ) : assignments.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-slate-500/10 rounded-xl bg-white">
              <div className="bg-slate-500/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-slate-600/40" />
              </div>
              <h3 className="text-2xl font-bold text-forest-900 mb-2">Ingen oppdrag funnet</h3>
              <p className="text-slate-600/60 font-sans max-w-md mx-auto">
                {filter === 'all' && 'Du har ingen oppdrag ennå.'}
                {filter === 'active' && 'Du har ingen aktive oppdrag for øyeblikket.'}
                {filter === 'completed' && 'Du har ingen fullførte oppdrag ennå.'}
              </p>
            </div>
          ) : (
            assignments.map((assignment) => (
              <Card key={assignment.id} className="glass-surface-light border-slate-400/20 overflow-hidden hover:border-amber-500/30 transition-all">
                <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <Link to={`/assignment-details-page?id=${assignment.id}`} className="hover:underline">
                       <h3 className="text-xl font-bold text-forest-900 hover:text-amber-500 transition-colors">{assignment.headline}</h3>
                    </Link>
                    <p className="text-sm text-slate-600 font-sans mt-1">{assignment.location}</p>
                  </div>
                  {getStatusBadge(assignment)}
                </div>
                
                {/* Interested Craftsmen Accordion */}
                {assignment.status === 'open' && (
                    <div className="border-t border-slate-400/10 px-6 pb-2">
                      <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value="interested" className="border-0">
                              <AccordionTrigger className="text-slate-600 hover:text-forest-900 hover:no-underline">
                                  <span className="font-semibold text-sm">
                                      {assignment.interested_craftsmen?.length || 0} Håndverkere interessert
                                  </span>
                              </AccordionTrigger>
                              <AccordionContent>
                                  {(assignment.interested_craftsmen?.length || 0) > 0 ? (
                                      <div className="space-y-3 pt-2">
                                          {assignment.interested_craftsmen?.map((interest) => (
                                              <div key={interest.craftsman_id} className="flex items-center justify-between p-3 bg-off-white rounded-lg border border-slate-400/20">
                                                  <div className="flex items-center gap-3">
                                                      <Avatar>
                                                          <AvatarImage src={interest.profile_photo_url || undefined} />
                                                          <AvatarFallback>{getInitials(interest.business_name || "Håndverker")}</AvatarFallback>
                                                      </Avatar>
                                                      <div>
                                                          <p className="font-semibold text-forest-900">{interest.business_name}</p>
                                                          <p className="text-xs text-slate-600">Viste interesse {new Date(interest.created_at).toLocaleDateString()}</p>
                                                      </div>
                                                  </div>
                                                  <Button 
                                                      size="sm" 
                                                      className="bg-amber-500 hover:bg-copper-500 text-white transition-all hover:shadow-lg hover:shadow-amber-500/20"
                                                      onClick={() => handleSelectCraftsman(assignment.id, interest.craftsman_id)}
                                                  >
                                                      Velg håndverker
                                                  </Button>
                                              </div>
                                          ))}
                                      </div>
                                  ) : (
                                      <p className="text-sm text-slate-600 italic py-2">Ingen håndverkere har meldt interesse enda.</p>
                                  )}
                              </AccordionContent>
                          </AccordionItem>
                      </Accordion>
                    </div>
                )}
              </Card>
            ))
          )}
        </div>
      </main>
      <Footer />
      {selectedAssignmentId && (
        <ReviewModal
          assignmentId={selectedAssignmentId}
          isOpen={!!selectedAssignmentId}
          onClose={() => setSelectedAssignmentId(null)}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  );
}
