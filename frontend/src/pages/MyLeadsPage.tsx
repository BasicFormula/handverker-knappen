import React from "react";
import { useQuery } from "@tanstack/react-query";
import brain from "brain";
import { useUserGuardContext } from "app/auth";

interface PaymentHistoryItem {
  id: number;
  user_id: string;
  product_id: number;
  stripe_charge_id: string;
  amount: number;
  created_at: string;
}

export default function MyLeadsPage() {
  const { user } = useUserGuardContext();

  const { data: craftsmanProfile, isLoading: profileLoading } = useQuery({
    queryKey: ["craftsmanProfile", user.id],
    queryFn: () => brain.get_current_craftsman_profile().then((res) => res.json()),
  });

  const { data: paymentHistory, isLoading: historyLoading } = useQuery<PaymentHistoryItem[]>({
    queryKey: ["paymentHistory", user.id],
    queryFn: () => brain.get_payment_history().then((res) => res.json()),
  });
  
  const isLoading = profileLoading || historyLoading;

  return (
    <div className="container mx-auto p-8">
      <h1 className="type-headline mb-8">Mine Leads</h1>

      <div className="mb-8 p-6 glass-surface-light border border-slate-500/20 rounded-lg shadow-md">
        <h2 className="type-headline-md text-forest-900 mb-2">Nåværende lead-saldo</h2>
        {isLoading ? (
          <p className="text-3xl font-bold text-slate-600/70">Laster...</p>
        ) : (
          <p className="type-number text-forest-900">{craftsmanProfile?.lead_balance ?? 0}</p>
        )}
      </div>

      <div>
        <h2 className="type-headline-md text-forest-900 mb-4">Kjøpshistorikk</h2>
        {isLoading ? (
          <p className="text-slate-600/80">Laster historikk...</p>
        ) : (
          <div className="space-y-4">
            {paymentHistory?.map((payment) => (
              <div key={payment.id} className="p-4 glass-surface-light border border-slate-500/20 rounded-lg">
                <p className="text-slate-600/80"><strong>Dato:</strong> {new Date(payment.created_at).toLocaleDateString()}</p>
                <p className="text-slate-600/80"><strong>Beløp:</strong> {payment.amount / 100} NOK</p>
                <p className="text-slate-600/80"><strong>Stripe Charge ID:</strong> {payment.stripe_charge_id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
