import { Check, CreditCard, Send, ShieldCheck } from "lucide-react";


export function PreferredContactModal({ person, onClose, onChoosePayment }) {
  if (!person) return null;

  return (
    <div className="modal-backdrop" role="presentation" data-testid="preferred-contact-modal">
      <section className="payment-modal" role="dialog" aria-modal="true" aria-label="Foretrukket håndverker">
        <button className="modal-close" type="button" onClick={onClose} data-testid="close-preferred-modal-button">×</button>
        <Send size={28} />
        <p className="eyebrow">HURTIGKONTAKT</p>
        <h2>{person.name}</h2>
        <p>Vi sender en prioritert forespørsel. Hvis håndverkeren ikke gir positivt svar innen 4 arbeidstimer, refunderes 200 kr automatisk.</p>
        <div className="payment-methods">
          <button type="button" onClick={() => onChoosePayment("vipps")} data-testid="preferred-vipps-payment-button"><span className="vipps-mark">vipps</span><span><b>Vipps</b><small>Betal 200 kr ved forespørsel</small></span><Check size={19} /></button>
          <button type="button" onClick={() => onChoosePayment("stripe")} data-testid="preferred-stripe-payment-button"><CreditCard size={22} /><span><b>Kort med Stripe</b><small>Betal 200 kr ved forespørsel</small></span><Check size={19} /></button>
        </div>
        <div className="fee-row" data-testid="preferred-contact-fee"><span><ShieldCheck size={16} /> 4 arbeidstimers svarregel</span><strong>200 kr</strong></div>
      </section>
    </div>
  );
}