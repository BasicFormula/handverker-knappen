import React from "react";
import { useQuery } from "@tanstack/react-query";
import brain from "brain";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Check, Zap } from "lucide-react";

const fetchProducts = async () => {
    const response = await brain.list_products();
    if (!response.ok) {
        throw new Error("Could not load products.");
    }
    return await response.json();
};

const handlePurchase = async (productId: number) => {
    try {
        const response = await brain.create_checkout_session({ 
            product_id: productId,
            product_type: "lead_balance"
        });
        const data = await response.json();
        if (data.url) {
            // External redirect to Stripe - window.location is correct here
            window.location.assign(data.url);
        }
    } catch (error) {
        console.error("Error creating checkout session:", error);
    }
};

export default function PurchaseLeadsPage() {
    const { data: products, isLoading } = useQuery({
        queryKey: ["products"],
        queryFn: fetchProducts,
    });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-grow relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 nordic-pattern opacity-5 pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-forest-900/10 via-forest-700/5 to-transparent pointer-events-none"></div>

        <div className="container mx-auto relative z-10 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="type-headline-xl text-forest-900 mb-4">
              Oppdragstorget
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-sans">
              Invester i vekst for din bedrift. Kjøp tilgang til eksklusive potensielle kunder og fyll opp ordreboken.
            </p>
          </div>

          {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="h-96 glass-surface-light border-slate-600/10">
                      <CardContent className="p-6">
                         <Skeleton className="h-8 w-3/4 mb-4 bg-slate-600/10" />
                         <Skeleton className="h-4 w-full mb-2 bg-slate-600/10" />
                         <Skeleton className="h-4 w-2/3 bg-slate-600/10" />
                      </CardContent>
                    </Card>
                  ))}
              </div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {products?.map((product: any) => (
                      <Card key={product.id} className="flex flex-col glass-surface-light border border-slate-600/10 hover:border-amber-500/50 transition-all duration-300 kinetic-lift overflow-hidden">
                          <div className="h-2 w-full bg-gradient-to-r from-amber-500 to-copper-600"></div>
                          <CardHeader className="pb-4 text-center">
                              <Badge variant="outline" className="w-fit mx-auto mb-3 border-amber-500 text-forest-900 bg-amber-500/10">
                                <Zap className="w-3 h-3 mr-1 fill-amber-500 stroke-none" />
                                {product.lead_count} Kunder
                              </Badge>
                              <CardTitle className="text-2xl font-bold text-forest-900">{product.name}</CardTitle>
                              <CardDescription className="text-slate-600/80">
                                Perfekt for å komme i gang
                              </CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow flex flex-col items-center justify-center py-6">
                              <div className="text-4xl font-bold text-forest-900 mb-2">
                                {product.price},- <span className="text-lg font-normal text-slate-600/60">NOK</span>
                              </div>
                              <p className="text-sm text-slate-600/60 mb-6">Engangsbetaling</p>
                              
                              <div className="w-full space-y-2 mb-6">
                                <div className="flex items-center text-sm text-slate-600">
                                  <Check className="w-4 h-4 mr-2 text-green-600" />
                                  <span>Umiddelbar tilgang</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                  <Check className="w-4 h-4 mr-2 text-green-600" />
                                  <span>Verifiserte kunder</span>
                                </div>
                                <div className="flex items-center text-sm text-slate-600">
                                  <Check className="w-4 h-4 mr-2 text-green-600" />
                                  <span>Ingen bindingstid</span>
                                </div>
                              </div>
                          </CardContent>
                          <CardFooter className="pt-0 pb-8">
                              <Button 
                                onClick={() => handlePurchase(product.id)} 
                                className="w-full bg-brand-amber hover:bg-brand-copper text-white font-semibold h-12 rounded-lg shadow-lg hover:shadow-brand-amber/20 transition-all"
                              >
                                  Kjøp Nå
                              </Button>
                          </CardFooter>
                      </Card>
                  ))}
              </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
