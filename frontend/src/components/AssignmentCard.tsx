import React, { useEffect, useState } from "react";
import brain from "brain";
import { GetMyAssignmentsResponse, CraftsmanInfo } from "types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AssignmentCardProps {
  assignment: GetMyAssignmentsResponse;
  onReview?: () => void;
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    open: "secondary",
    assigned: "default",
    in_progress: "outline",
    completed: "default",
};

const statusTextMap: { [key: string]: string } = {
    open: "Åpen for bud",
    assigned: "Tildelt",
    in_progress: "Pågår",
    completed: "Fullført",
};

export default function AssignmentCard({ assignment, onReview }: AssignmentCardProps) {
  const [interestedCraftsmen, setInterestedCraftsmen] = useState<CraftsmanInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCraftsman, setSelectedCraftsman] = useState<string | null>(assignment.craftsman_id);

  const isCustomerView = onReview !== undefined;

  const fetchInterestedCraftsmen = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await brain.get_expressions_of_interest({ assignment_id: assignment.id });
      if (response.ok) {
        const data = await response.json();
        setInterestedCraftsmen(data);
      } else {
        setError("Failed to fetch interested craftsmen.");
      }
    } catch (err) {
      setError("An error occurred while fetching interested craftsmen.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCraftsman = async (craftsmanId: string) => {
    try {
      const response = await brain.select_craftsman({ assignment_id: assignment.id, craftsman_id: craftsmanId });
      if (response.ok) {
        setSelectedCraftsman(craftsmanId);
      } else {
        // Handle error
      }
    } catch (err) {
      // Handle error
    }
  };

  return (
    <Card className="group relative overflow-hidden
                     bg-gradient-to-br from-forest-900/40 via-slate-800/50 to-slate-900/40
                     backdrop-blur-md border-2 border-slate-700/30
                     shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_2px_rgba(255,255,255,0.1)]
                     hover:shadow-[0_12px_48px_rgba(217,119,6,0.3),inset_0_1px_2px_rgba(255,255,255,0.15)]
                     hover:border-amber-600/40 transition-all duration-300
                     [clip-path:polygon(0_0,100%_0,100%_calc(100%-12px),calc(100%-12px)_100%,0_100%)]
                     before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:opacity-0 before:hover:opacity-100 before:transition-opacity before:duration-300">
      {/* Geometric accent line */}
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500/60 via-copper-500/60 to-transparent" />
      
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-offwhite via-amber-100 to-offwhite bg-clip-text text-transparent tracking-tight">
            {assignment.headline}
          </CardTitle>
          <Badge variant={statusVariantMap[assignment.status] || "default"}
                 className="bg-gradient-to-r from-amber-600/20 to-copper-600/20 border border-amber-500/30 text-amber-200 font-semibold">
            {statusTextMap[assignment.status] || assignment.status}
          </Badge>
        </div>
        <CardDescription className="text-slate-400 font-medium">
          {new Date(assignment.created_at).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      
      <CardFooter className="flex justify-end gap-4 items-center">
        {isCustomerView && assignment.status === 'completed' && !assignment.is_reviewed && onReview && (
          <Button 
            onClick={onReview}
            className="bg-gradient-to-r from-amber-600 to-copper-600 hover:from-amber-500 hover:to-copper-500
                       text-white font-bold tracking-wide
                       shadow-[0_4px_12px_rgba(217,119,6,0.4)]
                       hover:shadow-[0_6px_20px_rgba(217,119,6,0.6)]
                       border border-amber-500/30
                       transition-all duration-300"
          >
            Gi anmeldelse
          </Button>
        )}
        {isCustomerView && assignment.status === 'open' && (
          <Button 
            onClick={fetchInterestedCraftsmen} 
            disabled={loading} 
            variant="outline"
            className="border-2 border-slate-600/50 bg-slate-800/30 hover:bg-slate-700/40
                       text-offwhite hover:text-amber-200
                       font-semibold tracking-wide
                       backdrop-blur-sm transition-all duration-300"
          >
            {loading ? "Laster..." : "Vis interesserte"}
          </Button>
        )}
      </CardFooter>

      {error && (
        <p className="text-red-400 mt-2 px-6 pb-4 font-medium">
          {error}
        </p>
      )}
      
      {interestedCraftsmen.length > 0 && (
        <CardContent>
          <div className="mt-4 border-t border-slate-700/50 pt-4">
            <h3 className="text-lg font-bold text-amber-200 mb-3 tracking-wide">
              Interesserte Håndverkere:
            </h3>
            <ul className="space-y-3">
              {interestedCraftsmen.map((craftsman) => (
                <li key={craftsman.id} 
                    className="flex items-center justify-between p-3 rounded-md
                               bg-gradient-to-r from-slate-800/40 to-slate-900/40
                               border border-slate-700/30
                               backdrop-blur-sm
                               hover:border-amber-600/40 transition-all duration-200">
                  <span className="text-offwhite font-medium">
                    {craftsman.name} <span className="text-slate-400">({craftsman.email})</span>
                  </span>
                  <Button
                    onClick={() => handleSelectCraftsman(craftsman.id)}
                    disabled={!!selectedCraftsman}
                    size="sm"
                    className="bg-gradient-to-r from-amber-600 to-copper-600 hover:from-amber-500 hover:to-copper-500
                               text-white font-bold
                               disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400
                               shadow-[0_2px_8px_rgba(217,119,6,0.3)]
                               border border-amber-500/30
                               transition-all duration-300"
                  >
                    {selectedCraftsman === craftsman.id ? "Valgt" : "Velg"}
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
