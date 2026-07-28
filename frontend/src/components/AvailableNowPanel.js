import { BadgeCheck, Clock3, Send } from "lucide-react";

import { Stars } from "@/components/MarketplaceBits";


export function AvailableNowPanel({ availability, onQuickContact }) {
  if (!availability?.craftspeople?.length) return null;

  return (
    <section className="available-now-panel" data-testid="available-now-panel">
      <div className="available-heading"><div><p className="eyebrow">KLAR NÅ</p><h2>Verifiserte fagfolk med kapasitet</h2></div><span><Clock3 size={15} /> Svarer innen {availability.response_target}</span></div>
      <div className="available-cards">
        {availability.craftspeople.map((person) => <article key={person.id} className="available-card" data-testid={`available-craftsperson-${person.id}`}><div className="avatar">{person.avatar}</div><div><h3>{person.name} <BadgeCheck size={15} /></h3><p>{person.company}</p><Stars rating={person.rating} count={person.review_count} /></div><button type="button" onClick={() => onQuickContact(person)} data-testid={`quick-contact-${person.id}`}><Send size={15} /> Hurtigkontakt<br />200 kr</button></article>)}
      </div>
    </section>
  );
}