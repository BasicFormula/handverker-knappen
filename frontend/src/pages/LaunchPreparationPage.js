import { CheckCircle2, CircleAlert, Copy, FileCheck2, Mail, Send, ShieldCheck, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { fetchLaunchCampaign } from "@/lib/api";


export default function LaunchPreparationPage() {
  const [data, setData] = useState(null);
  const [selectedSegments, setSelectedSegments] = useState([]);

  useEffect(() => {
    fetchLaunchCampaign().then(setData).catch(() => setData(null));
  }, []);

  const toggleSegment = (id) => {
    setSelectedSegments((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  if (!data) return <div className="page loading-state" data-testid="launch-page-loading">Laster lanseringsplan…</div>;
  const { campaign, segments, required_fields: requiredFields, templates } = data;
  return (
    <div className="page launch-page" data-testid="launch-preparation-page">
      <section className="launch-intro">
        <div><p className="eyebrow">OSLO-LANSERING</p><h1>Gjør interessen klar før utsendelse.</h1><p>Fagfolk inviteres 14 dager før kundelansering. Listen kan klargjøres, men import og sending holdes låst til samtykkegrunnlag og avsender er på plass.</p></div>
        <div className="launch-status" data-testid="launch-consent-status"><CircleAlert size={22} /><div><strong>Utsending er låst</strong><span>Venter på dokumentert samtykke</span></div></div>
      </section>
      <section className="launch-stat-grid" aria-label="Lanseringsstatus"><div data-testid="launch-contacts-stat"><UsersRound size={20} /><span>Importerte kontakter</span><strong>{campaign.contacts_imported}</strong></div><div data-testid="launch-timing-stat"><Mail size={20} /><span>Før kundelansering</span><strong>14 dager</strong></div><div data-testid="launch-sender-stat"><Send size={20} /><span>Avsender</span><strong>{campaign.sender_status}</strong></div></section>
      <section className="launch-grid"><div><div className="section-heading"><div><p className="eyebrow">SEGMENTER</p><h2>Planlegg hvem som skal få hva</h2></div><span className="segment-count" data-testid="selected-segment-count">{selectedSegments.length} valgt</span></div><div className="segment-list" data-testid="launch-segment-list">{segments.map((segment) => <button type="button" key={segment.id} className={selectedSegments.includes(segment.id) ? "segment-card selected" : "segment-card"} onClick={() => toggleSegment(segment.id)} data-testid={`launch-segment-${segment.id}`}><span className="segment-check">{selectedSegments.includes(segment.id) && <CheckCircle2 size={17} />}</span><span><strong>{segment.label}</strong><small>{segment.trade} · {segment.area}</small></span></button>)}</div></div><aside className="import-guard" data-testid="consent-import-guard"><ShieldCheck size={24} /><p className="eyebrow">FØR IMPORT</p><h2>Samtykke må kunne dokumenteres.</h2><p>Listen blir ikke lastet opp eller sendt før hver kontakt har et tydelig grunnlag for kommunikasjonen.</p><div className="required-fields"><p>Filen må inneholde:</p>{requiredFields.map((field) => <span key={field}><FileCheck2 size={14} /> {field}</span>)}</div></aside></section>
      <section className="template-section" data-testid="launch-email-templates"><div className="section-heading"><div><p className="eyebrow">E-POSTLØP</p><h2>Utkast for håndverkerlanseringen</h2></div><button type="button" className="secondary-button" onClick={() => toast.success("Påmeldingslenke er kopiert.")} data-testid="copy-signup-link-button"><Copy size={16} /> Kopier påmeldingslenke</button></div><div className="launch-template-grid">{templates.map((template, index) => <article key={template.id} className="launch-template" data-testid={`launch-template-${template.id}`}><span className="template-day">{index === 0 ? "Dag −14" : index === 1 ? "Dag −7" : "Dag 0"}</span><h3>{template.title}</h3><strong>{template.subject}</strong><p>{template.preview}</p></article>)}</div></section>
    </div>
  );
}