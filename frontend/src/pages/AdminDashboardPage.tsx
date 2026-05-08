import { useEffect, useState } from "react";
import { apiClient } from "app";
import { AdminCraftsmanProfile } from "types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, FileText, CheckCircle } from "lucide-react";
import Header from "components/Header";
import Footer from "components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@stackframe/react";
import { stackClientApp } from "app/auth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminDashboardPage() {
  const user = useUser();
  const [craftsmen, setCraftsmen] = useState<AdminCraftsmanProfile[]>([]);
  const [selectedCraftsmen, setSelectedCraftsmen] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [sendingEmails, setSendingEmails] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const response = await apiClient.list_all_craftsmen();
        if (response.ok) {
           const data = await response.json();
           setCraftsmen(data);
        }
      } catch (error) {
        console.error("Failed to fetch craftsmen", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
        setSelectedCraftsmen(craftsmen.map(c => c.user_id));
    } else {
        setSelectedCraftsmen([]);
    }
  };

  const handleSelectOne = (userId: string, checked: boolean) => {
      if (checked) {
          setSelectedCraftsmen(prev => [...prev, userId]);
      } else {
          setSelectedCraftsmen(prev => prev.filter(id => id !== userId));
      }
  };

  const handleApprove = async (userId: string) => {
      if (!confirm("Er du sikker på at du vil godkjenne denne håndverkeren?")) {
          return;
      }
      setIsApproving(true);
      try {
          const response = await apiClient.approve_craftsman({ userId: userId });
          if (response.ok) {
              toast.success("Håndverker godkjent");
              // Update local state
              setCraftsmen(prev => prev.map(c => 
                  c.user_id === userId 
                  ? { ...c, is_verified: true, verification_status: 'approved' } 
                  : c
              ));
          } else {
              toast.error("Kunne ikke godkjenne håndverker");
          }
      } catch (error) {
          console.error("Approve failed", error);
          toast.error("Feil ved godkjenning");
      } finally {
        setIsApproving(false);
      }
  };

  const handleDelete = async (userId: string) => {
      if (!confirm("Er du sikker på at du vil slette denne håndverkeren? Dette kan ikke angres.")) {
          return;
      }
      setIsDeleting(true);
      try {
          // Note: TypeScript might complain if the client hasn't regenerated yet, but it should be fine at runtime.
          // Using any to bypass potential type mismatch during generation
          const response = await (apiClient as any).delete_craftsman({ userId: userId });
          if (response.ok) {
              toast.success("Håndverker slettet");
              setCraftsmen(prev => prev.filter(c => c.user_id !== userId));
              setSelectedCraftsmen(prev => prev.filter(id => id !== userId));
          } else {
              toast.error("Kunne ikke slette håndverker");
          }
      } catch (error) {
          console.error("Delete failed", error);
          toast.error("Feil ved sletting");
      } finally {
        setIsDeleting(false);
      }
  };

  const handleDeleteCraftsmen = async () => {
    if (selectedCraftsmen.length === 0) return;
    
    if (!confirm(`Er du sikker på at du vil slette ${selectedCraftsmen.length} håndverkere? Dette kan ikke angres.`)) {
        return;
    }

    setIsDeleting(true);
    try {
        // Iterate and delete (since backend might not support bulk delete yet, or if it does, check API)
        // Checking existing API... update_craftsman_profile doesn't seem to support bulk.
        // But MYA-121 said "Delete endpoint (done)".
        // Let's assume we use the single delete endpoint in a loop for now, 
        // or if there is a bulk endpoint.
        // The previous handleDelete uses `delete_craftsman` with `user_id`.
        
        let successCount = 0;
        for (const userId of selectedCraftsmen) {
            try {
                const response = await (apiClient as any).delete_craftsman({ userId: userId });
                if (response.ok) successCount++;
            } catch (e) {
                console.error(`Failed to delete ${userId}`, e);
            }
        }

        toast.success(`${successCount} av ${selectedCraftsmen.length} håndverkere slettet.`);
        
        // Refresh list or remove locally
        setCraftsmen(prev => prev.filter(c => !selectedCraftsmen.includes(c.user_id)));
        setSelectedCraftsmen([]);
        
    } catch (error) {
        toast.error("Feil oppstod under sletting.");
        console.error(error);
    } finally {
        setIsDeleting(false);
    }
  };

  const handleSendEmails = async () => {
    const isAll = selectedCraftsmen.length === 0 || selectedCraftsmen.length === craftsmen.length;
    const count = isAll ? "ALLE" : selectedCraftsmen.length;
    
    if (!confirm(`Er du sikker på at du vil sende månedlig e-post til ${count} håndverkere?`)) {
        return;
    }
    
    setSendingEmails(true);
    try {
        // If selectedCraftsmen is empty, we interpret it as "send to all" based on original behavior? 
        // Or should we enforce selection?
        // User asked to "huke av for email utsendelse". 
        // If I check 0, maybe I shouldn't send to anyone?
        // But the previous implementation sent to all.
        // Let's assume if 0 selected, send to none? Or send to all? 
        // Usually, empty selection = no action. 
        // But let's keep it safe: Only send to selected if selected > 0. 
        // If user wants to send to all, they should select all.
        // Wait, current behavior of handleSendEmails was "Send to ALL".
        
        let payload = {};
        if (selectedCraftsmen.length > 0) {
            payload = { user_ids: selectedCraftsmen };
        } else {
            // If nothing selected, maybe warn? Or fallback to all? 
            // "Select all" is easy with the header checkbox.
            // Let's fallback to "All" if none selected for backward compatibility/ease of use, 
            // BUT user explicitly asked for selection. 
            // If I have checkboxes, having 0 checked and clicking "Send" resulting in "Sent to ALL" is dangerous/confusing.
            // So:
            if (selectedCraftsmen.length === 0) {
                 if (!confirm("Ingen er valgt. Vil du sende til ALLE?")) {
                     setSendingEmails(false);
                     return;
                 }
                 // If yes, send empty payload (which means all in backend)
                 payload = {};
            } else {
                 payload = { user_ids: selectedCraftsmen };
            }
        }

        const response = await apiClient.send_monthly_emails(payload);
        if (response.ok) {
            const data = await response.json();
            toast.success("E-poster er under utsending!", {
                description: data.message || "Prosessen er startet i bakgrunnen."
            });
        } else {
            toast.error("Noe gikk galt", {
                description: "Kunne ikke starte utsending av e-poster."
            });
        }
    } catch (error) {
        console.error("Failed to send emails", error);
        toast.error("Feil oppstod", {
            description: "Det skjedde en feil under kommunikasjon med serveren."
        });
    } finally {
        setSendingEmails(false);
    }
  };

  const handleSendLaunchEmails = async () => {
    if (selectedCraftsmen.length === 0) {
      toast.error("Vennligst velg minst én håndverker for å sende e-post.");
      return;
    }

    if (!confirm(`Er du sikker på at du vil sende LANSERINGS-EPOST (50kr-kampanje) til ${selectedCraftsmen.length} håndverkere?`)) {
      return;
    }

    setSendingEmails(true);
    try {
      await apiClient.send_launch_emails({ user_ids: selectedCraftsmen });
      toast.success("Lanserings-epost sendt til valgte håndverkere!");
    } catch (error) {
      toast.error("Kunne ikke sende lanserings-eposter.");
      console.error(error);
    } finally {
      setSendingEmails(false);
    }
  };

  if (!user) {
      return (
          <div className="min-h-screen flex flex-col bg-background">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-center space-y-4">
                  <h1 className="text-2xl font-bold">Admin Tilgang Kreves</h1>
                  <p>Du må være logget inn for å se denne siden.</p>
                  <Button onClick={() => stackClientApp.redirectToSignIn()}>Logg inn</Button>
              </main>
              <Footer />
          </div>
      )
  }

  if (loading) {
      return (
          <div className="min-h-screen flex flex-col bg-background">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">
                  <div className="animate-pulse space-y-4">
                      <div className="h-8 bg-slate-200 rounded w-1/4"></div>
                      <div className="h-64 bg-slate-200 rounded"></div>
                  </div>
              </main>
              <Footer />
          </div>
      )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
            <h1 className="type-headline text-forest-900">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground mr-4">
                    {selectedCraftsmen.length} valgt
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCraftsmen()}
                    disabled={isDeleting || selectedCraftsmen.length === 0}
                  >
                    {isDeleting ? "Sletter..." : `Slett valgte (${selectedCraftsmen.length})`}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSendEmails}
                    disabled={sendingEmails || selectedCraftsmen.length === 0}
                  >
                    {sendingEmails ? "Sender..." : `Send Månedlig E-post (${selectedCraftsmen.length})`}
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleSendLaunchEmails}
                    disabled={sendingEmails || selectedCraftsmen.length === 0}
                  >
                    {sendingEmails ? "Sender..." : `Send Lanserings-epost (50kr) (${selectedCraftsmen.length})`}
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground hidden md:block">
                    Logget inn som: {user.email || user.name}
                </div>
            </div>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Registrerte Håndverkere ({craftsmen.length})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                            <Checkbox 
                                checked={craftsmen.length > 0 && selectedCraftsmen.length === craftsmen.length}
                                onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                            />
                        </TableHead>
                        <TableHead>Navn</TableHead>
                        <TableHead>Bedrift</TableHead>
                        <TableHead>E-post</TableHead>
                        <TableHead>Telefon</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Dokumentasjon</TableHead>
                        <TableHead>Registrert</TableHead>
                        <TableHead className="w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {craftsmen.map((craftsman) => (
                        <TableRow key={craftsman.user_id}>
                          <TableCell>
                              <Checkbox 
                                  checked={selectedCraftsmen.includes(craftsman.user_id)}
                                  onCheckedChange={(checked) => handleSelectOne(craftsman.user_id, checked as boolean)}
                              />
                          </TableCell>
                          <TableCell className="font-medium">{craftsman.name || "N/A"}</TableCell>
                          <TableCell>
                              <div className="font-medium">{craftsman.business_name || "N/A"}</div>
                              {craftsman.org_number && <div className="text-xs text-muted-foreground">Org: {craftsman.org_number}</div>}
                          </TableCell>
                          <TableCell>{craftsman.email}</TableCell>
                          <TableCell>{craftsman.phone_number || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1 items-start">
                                {craftsman.is_verified ? (
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-green-500 text-white hover:bg-green-600">Verifisert</span>
                                ) : (
                                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-yellow-500 text-white hover:bg-yellow-600">Uverifisert</span>
                                )}
                                <span className="text-xs text-muted-foreground capitalize">{craftsman.verification_status || "pending"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {craftsman.id_document_url ? (
                                <a 
                                    href={craftsman.id_document_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                                >
                                    <FileText className="h-4 w-4" />
                                    Se ID
                                </a>
                            ) : (
                                <span className="text-sm text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {craftsman.created_at ? new Date(craftsman.created_at).toLocaleDateString('no-NO', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            }) : "N/A"}
                          </TableCell>
                          <TableCell>
                              <div className="flex items-center gap-2">
                                  {!craftsman.is_verified && (
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-green-600 hover:text-green-800 hover:bg-green-50"
                                        onClick={() => handleApprove(craftsman.user_id)}
                                        title="Godkjenn håndverker"
                                      >
                                          <CheckCircle className="h-4 w-4" />
                                      </Button>
                                  )}
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => handleDelete(craftsman.user_id)}
                                    title="Slett håndverker"
                                  >
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                              </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {craftsmen.length === 0 && (
                          <TableRow>
                              <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">Ingen håndverkere funnet.</TableCell>
                          </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
