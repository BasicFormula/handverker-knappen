import { ArrowLeft, CheckCircle2, ImagePlus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { postJob } from "@/lib/api";


const fields = [
  ["title", "Hva trenger du hjelp til?", "For eksempel: Elektriker til nytt kjøkken"],
  ["location", "Hvor skal jobben gjøres?", "For eksempel: Tøyen, Oslo"],
  ["budget", "Budsjett", "For eksempel: 15 000–25 000 kr"],
];


export default function NewJobPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", category: "Elektriker", location: "", budget: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try { const job = await postJob(form); toast.success("Oppdraget er publisert"); navigate(`/oppdrag/${job.id}`); } catch { toast.error("Fyll inn litt mer informasjon før du publiserer."); } finally { setSubmitting(false); }
  };
  return (
    <div className="page form-page" data-testid="new-job-page">
      <Link to="/" className="back-link" data-testid="back-to-dashboard-link"><ArrowLeft size={17} /> Til oversikten</Link>
      <section className="form-layout"><div className="page-intro"><p className="eyebrow">NYTT OPPDRAG</p><h1>Beskriv det du trenger.</h1><p>Det tar bare et par minutter. Verifiserte fagfolk blir varslet når oppdraget publiseres.</p><div className="form-assurance" data-testid="job-posting-assurance"><CheckCircle2 size={18} /> Kun verifiserte håndverkere kan svare.</div></div>
      <form className="job-form" onSubmit={submit} data-testid="new-job-form">
        {fields.map(([key, label, placeholder]) => <label key={key}>{label}<input required data-testid={`new-job-${key}-input`} value={form[key]} onChange={(event) => update(key, event.target.value)} placeholder={placeholder} /></label>)}
        <label>Fagområde<select data-testid="new-job-category-select" value={form.category} onChange={(event) => update("category", event.target.value)}><option>Elektriker</option><option>Rørlegger</option><option>Tømrer</option><option>Maler</option></select></label>
        <label>Fortell litt mer<textarea required data-testid="new-job-description-input" value={form.description} onChange={(event) => update("description", event.target.value)} placeholder="Hva skal gjøres? Når passer det? Del gjerne detaljer som gjør det enklere å gi et godt tilbud." /></label>
        <button type="button" className="image-upload" data-testid="job-image-upload-button"><ImagePlus size={20} /> Legg til bilder <small>Valgfritt</small></button>
        <button className="primary-button submit-button" disabled={submitting} data-testid="publish-job-button">{submitting ? "Publiserer…" : "Publiser oppdrag"}</button>
      </form></section>
    </div>
  );
}