import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import brain from "brain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Define the type for an individual assignment, matching the backend response
interface Assignment {
  id: number;
  headline: string;
  location: string;
  status: string;
  created_at: string;
}

const AssignmentList: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await brain.list_assignments();
        if (response.ok) {
          const data = await response.json();
          setAssignments(data);
        } else {
          const errorText = await response.text();
          setError(errorText || "Failed to fetch assignments.");
          toast.error("Error", { description: "Could not load available jobs." });
        }
      } catch (e) {
        setError("An unexpected error occurred.");
        toast.error("Error", { description: "Could not connect to the server." });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="glass-surface-light border-slate-400/20">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  const handleCardClick = (id: number) => {
    navigate(`/assignment-details-page?id=${id}`);
  };

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-forest-900">Tilgjengelige oppdrag</h2>
        {assignments.length === 0 ? (
            <p className="text-slate-600">Ingen oppdrag tilgjengelig akkurat nå. Sjekk igjen senere.</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assignments.map((assignment) => (
                    <Card 
                        key={assignment.id} 
                        className="glass-surface-light border-slate-400/20 hover:border-amber-500/40 transition-all cursor-pointer hover:shadow-lg"
                        onClick={() => handleCardClick(assignment.id)}
                    >
                        <CardHeader>
                            <CardTitle className="text-forest-900">{assignment.headline}</CardTitle>
                            <CardDescription className="text-slate-600">{assignment.location}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-slate-600">
                                    Lagt ut: {new Date(assignment.created_at).toLocaleDateString()}
                                </span>
                                <Button variant="link">Se detaljer</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}
    </div>
  );
};

export { AssignmentList };
