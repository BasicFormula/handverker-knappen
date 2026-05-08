import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import brain from "brain";

interface ReviewFormProps {
  assignmentId: number;
  craftsmanId: string;
  onReviewSubmit: () => void;
}

export function ReviewForm({ assignmentId, onReviewSubmit }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Vennligst velg en rangering før du sender inn.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await brain.submit_review(
        { assignment_id: assignmentId },
        { rating, comment }
      );
      if (response.ok) {
        toast.success("Anmeldelsen ble sendt inn!");
        onReviewSubmit();
      } else {
        const errorData = await response.json();
        toast.error("Kunne ikke sende inn anmeldelse", {
          description: errorData.detail || "En ukjent feil oppstod.",
        });
      }
    } catch (error) {
      toast.error("En uventet feil oppstod.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-forest-900">Hvordan var opplevelsen din?</h3>
        <div className="flex items-center gap-2 mt-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={cn(
                "w-8 h-8 cursor-pointer transition-all hover:scale-110 duration-200",
                rating >= star ? "text-amber-500 fill-amber-500" : "text-slate-400 hover:text-amber-500/50"
              )}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold text-forest-900">Skriv en kommentar</h3>
        <NordicTextarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Beskriv din opplevelse med håndverkeren..."
          rows={4}
          className="mt-2"
        />
      </div>
      <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full bg-amber-500 hover:bg-copper-500 text-white font-bold py-6 transition-all hover:shadow-lg hover:shadow-amber-500/20">
        {isSubmitting ? "Sender inn..." : "Send Anmeldelse"}
      </Button>
    </div>
  );
}
