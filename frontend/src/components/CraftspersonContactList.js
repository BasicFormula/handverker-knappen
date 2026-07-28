import { BadgeCheck, MessageSquareText, Send } from "lucide-react";

import { BankIdBadge, Stars } from "@/components/MarketplaceBits";


export function CraftspersonContactList({ people, onApproveContact, onPreferredContact }) {
  return (
    <div className="craft-list" data-testid="craftsperson-offers-list">
      {people.map((person) => (
        <article className="craft-card" key={person.id} data-testid={`craftsperson-card-${person.id}`}>
          <div className="avatar" data-testid={`craftsperson-avatar-${person.id}`}>{person.avatar}</div>
          <div className="craft-main">
            <div className="craft-name"><h3 data-testid={`craftsperson-name-${person.id}`}>{person.name}</h3><BankIdBadge /></div>
            <p data-testid={`craftsperson-company-${person.id}`}>{person.company} · {person.trade}</p>
            <Stars rating={person.rating} count={person.review_count} />
            <p className="craft-bio" data-testid={`craftsperson-bio-${person.id}`}>{person.bio}</p>
          </div>
          <div className="craft-actions">
            <button type="button" className="select-craft-button" onClick={() => onApproveContact(person)} data-testid={`approve-contact-${person.id}`}><MessageSquareText size={16} /> Godkjenn kontakt</button>
            <button type="button" className="preferred-button" onClick={() => onPreferredContact(person)} data-testid={`preferred-contact-${person.id}`}><Send size={15} /> Hurtigkontakt · 200 kr</button>
          </div>
        </article>
      ))}
    </div>
  );
}