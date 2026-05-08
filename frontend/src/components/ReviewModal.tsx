import { useState } from "react";
import brain from "brain";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

interface Props {
  assignmentId: number;
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
}

export const ReviewModal = ({ assignmentId, isOpen, onClose, onReviewSubmitted }: Props) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStarClick = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Vennligst gi en stjernerating.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await brain.submit_review({
        assignment_id: assignmentId,
        rating: rating,
        comment: comment,
      });

      if (response.ok) {
        toast.success("Takk for din anmeldelse!");
        onReviewSubmitted();
        onClose();
      } else {
        const errorData = await response.json();
        toast.error("Noe gikk galt", {
          description: errorData.detail || "Kunne ikke sende inn anmeldelse.",
        });
      }
    } catch (error) {
      toast.error("En uventet feil oppstod.");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-surface-light border-slate-400/20 text-slate-700">
        <DialogHeader>
          <DialogTitle className="text-forest-900">Gi en anmeldelse</DialogTitle>
          <DialogDescription className="text-slate-600">
            Del din opplevelse av jobben som ble utført.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <label className="font-semibold mb-2 block text-forest-900">Rating</label>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => {
                const rate = i + 1;
                return (
                  <button key={rate} onClick={() => handleStarClick(rate)}>
                    <Star
                      className={`h-8 w-8 cursor-pointer transition-colors ${
                        rate <= rating
                          ? "text-amber-500 fill-amber-500"
                          : "text-slate-400 hover:text-amber-500"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label htmlFor="comment" className="font-semibold mb-2 block text-forest-900">
              Kommentar (valgfritt)
            </label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Beskriv din opplevelse..."
              className="bg-white/50 border-slate-400/30 focus:ring-amber-500"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Avbryt
          </Button>
          <Button className="bg-amber-500 hover:bg-copper-500 text-white transition-all hover:shadow-lg hover:shadow-amber-500/20" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Sender..." : "Send anmeldelse"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
