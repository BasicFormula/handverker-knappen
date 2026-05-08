import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiClient } from "app";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const BankidCallbackPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const code = searchParams.get("code");
      const state = searchParams.get("state");
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (errorParam) {
        setError(errorDescription || "Authentication failed.");
        setIsProcessing(false);
        return;
      }

      if (!code || !state) {
        setError("Missing required parameters (code or state).");
        setIsProcessing(false);
        return;
      }

      try {
        await apiClient.finalize_bankid_verification({ code, state });
        navigate("/craftsman-dashboard?bankid_verified=true");
      } catch (err: any) {
        console.error("Verification failed:", err);
        setError(err.body?.detail || "Failed to complete verification. Please try again.");
        setIsProcessing(false);
      }
    };

    processCallback();
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg border border-border text-center">
        {isProcessing ? (
          <>
            <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
            <h2 className="text-xl font-semibold">Verifiserer din identitet...</h2>
            <p className="text-muted-foreground">Vennligst vent mens vi fullfører verifiseringen via BankID/Vipps.</p>
          </>
        ) : error ? (
          <>
            <div className="text-destructive text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-destructive">Verifisering feilet</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate("/craftsman-dashboard")} variant="outline" className="mt-4">
              Gå tilbake til oversikten
            </Button>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default BankidCallbackPage;
