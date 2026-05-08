import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PaymentCanceledPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 nordic-pattern opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-forest-900/10 via-forest-700/5 to-transparent pointer-events-none"></div>

        <Card className="w-full max-w-md text-center glass-surface-light border-slate-500/10 shadow-2xl relative z-10 overflow-hidden">
          <div className="h-2 w-full bg-red-500"></div>
          <CardHeader className="bg-slate-50/50 border-b border-slate-500/5 pb-6">
            <div className="mx-auto bg-red-100 rounded-full p-3 w-fit mb-4 ring-4 ring-red-50">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-forest-900">Betaling Avbrutt</CardTitle>
            <CardDescription className="text-slate-600/70 text-lg mt-2">
              Betalingen ble ikke gjennomført. Du kan prøve igjen når som helst.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <p className="text-slate-600/80 mb-8">
              Hvis du opplever problemer, vennligst kontakt support.
            </p>
            <Button 
              onClick={() => navigate("/craftsman-dashboard")}
              className="w-full bg-slate-600 text-white hover:bg-forest-900 font-bold h-12 text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Tilbake til Min Side
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
