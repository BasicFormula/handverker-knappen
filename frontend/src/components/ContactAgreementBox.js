import { CheckCircle2, MessageSquareText, ShieldCheck } from "lucide-react";


export function ContactAgreementBox({ contactFlow }) {
  if (!contactFlow) return null;

  return (
    <section className="contact-agreement-box" data-testid="contact-agreement-box">
      <div className="agreement-title">
        <CheckCircle2 size={22} />
        <div>
          <p className="eyebrow">KONTAKT GODKJENT</p>
          <h2>Snakk sammen før dere avtaler.</h2>
        </div>
      </div>
      <p data-testid="contact-approved-message">{contactFlow.message}</p>
      <div className="agreement-steps" data-testid="agreement-steps">
        {contactFlow.next_steps.map((step, index) => (
          <div key={step}>
            <span>{index + 1}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>
      <div className="agreement-footer">
        <MessageSquareText size={17} />
        <span>Avtal pris og praktiske detaljer direkte med håndverkeren.</span>
        <ShieldCheck size={17} />
      </div>
    </section>
  );
}