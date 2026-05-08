import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function FloatingActionButton() {
  const navigate = useNavigate();

  return (
    <Button
      className="fixed bottom-8 right-8 h-20 w-20 rounded-full
                 bg-gradient-to-br from-amber-600 via-copper-600 to-amber-700
                 text-white font-bold
                 shadow-[0_0_24px_rgba(217,119,6,0.6),_inset_0_2px_4px_rgba(255,255,255,0.3),_0_12px_24px_rgba(0,0,0,0.5)]
                 border-2 border-amber-500/50
                 ring-2 ring-copper-500/30
                 transition-all duration-300 ease-in-out
                 hover:shadow-[0_0_32px_rgba(217,119,6,0.9),_inset_0_2px_4px_rgba(255,255,255,0.4),_0_16px_32px_rgba(0,0,0,0.6)]
                 hover:scale-110 hover:rotate-90
                 hover:ring-4 hover:ring-amber-400/40
                 active:scale-95
                 before:absolute before:inset-0 before:rounded-full
                 before:bg-gradient-to-tr before:from-white/20 before:to-transparent
                 before:opacity-0 before:hover:opacity-100 before:transition-opacity"
      onClick={() => navigate("/service-request-page")}
    >
      <Plus className="h-10 w-10 relative z-10 transition-transform duration-300" />
      <span className="sr-only">Start nytt oppdrag</span>
    </Button>
  );
}
