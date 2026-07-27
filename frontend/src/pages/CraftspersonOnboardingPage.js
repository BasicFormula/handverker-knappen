import { ArrowRight, BadgeCheck, Building2, CheckCircle2, MapPinned, ShieldCheck, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { fetchMarketCoverage, onboardCraftsperson } from "@/lib/api";


const trades = ["Elektriker", "Rørlegger", "Tømrer", "Maler", "Murer", "Annet"];


export default function CraftspersonOnboardingPage() {
  const [coverage, setCoverage] = useState({ launch_region: "Oslo", areas: [] });
  const [form, setForm] = useState({ name: "", company: "", trade: "Elektriker", location: "Oslo", service_areas: ["Oslo"], bio: "" });
  const [created, setCreated] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMarketCoverage().then(setCoverage).catch(() => undefined);
  }, []);

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const toggleArea = (area) => {
    setForm((current) => ({
      ...current,
      service_areas: current.service_areas.includes(area)
        ? current.service_areas.filter((item) => item !== area)
        : [...current.service_areas, area],
    }));
  };
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const profile = await onboardCraftsperson(form);
      setCreated(profile);
      toast.success("Fagprofilen er opprettet.");
    } catch {
      toast.error("Sjekk at alle felt er fylt ut før du fortsetter.");
    } finally {
      setSubmitting(false);
    }
  };

  if (created) {
    return (
      <div className="page professional-page" data-testid="craftsperson-onboarding-success">
        <section className="onboarding-success">
          <CheckCircle2 size={38} />
          <p className="eyebrow">FAGPROFIL OPPRETTET</p>
          <h1>Velkommen om bord, {created.name.split(" ")[0]}.</h1>
          <p>Profilen din er registrert med status <strong>Ny på plattformen</strong>. Du får ikke en kunstig stjernescore – kundevurderinger begynner etter første fullførte jobb.</p>
          <div className="onboarding-summary" data-testid="new-craftsperson-summary">
            <span><Building2 size={17} /> {created.company}</span>
            <span><MapPinned size={17} /> {created.service_areas.join(", ")}</span>
            <span><ShieldCheck size={17} /> BankID-steget er klart</span>
          </div>
          <button type="button" className="primary-button" onClick={() => setCreated(null)} data-testid="register-another-craftsperson-button">Registrer en til <ArrowRight size={17} /></button>
        </section>
      </div>
    );
  }

  return (
    <div className="page professional-page" data-testid="craftsperson-onboarding-page">
      <section className="professional-intro">
        <div>
          <p className="eyebrow">FOR HÅNDVERKERE · {coverage.launch_region.toUpperCase()}</p>
          <h1>Bygg tillit fra første oppdrag.</h1>
          <p>Start synlig i Oslo-området med fagprofil, områder og en ærlig ny-håndverkerstatus. Kundene ser dokumentert arbeid — ikke en kjøpt eller oppdiktet score.</p>
        </div>
        <div className="trust-meter" data-testid="new-craftsperson-trust-model">
          <span className="new-craft-badge">Ny på plattformen</span>
          <strong>0 kundevurderinger</strong>
          <small>Stjerner vises etter første fullførte oppdrag.</small>
        </div>
      </section>

      <section className="professional-grid">
        <aside className="reputation-guide" data-testid="reputation-guide">
          <p className="eyebrow">SLIK BYGGES PROFILEN</p>
          <div><ShieldCheck size={20} /><span><strong>1. BankID-verifisering</strong><small>Identitet må være bekreftet før profilen blir synlig.</small></span></div>
          <div><Star size={20} /><span><strong>2. Ekte kundestjerner</strong><small>Ingen stjerner før første verifiserte kundeomtale.</small></span></div>
          <div><Zap size={20} /><span><strong>3. Pålitelighet</strong><small>Svartid, gjennomføring og avlysninger vises separat fra stjerner.</small></span></div>
        </aside>
        <form className="craftsperson-form" onSubmit={submit} data-testid="craftsperson-onboarding-form">
          <div className="form-heading"><p className="eyebrow">OPPRETT FAGPROFIL</p><h2>Din virksomhet</h2></div>
          <label>Navn<input required data-testid="craftsperson-name-input" value={form.name} onChange={(event) => update("name", event.target.value)} placeholder="For- og etternavn" /></label>
          <label>Bedriftsnavn<input required data-testid="craftsperson-company-input" value={form.company} onChange={(event) => update("company", event.target.value)} placeholder="For eksempel: Olsen Elektro AS" /></label>
          <label>Fagområde<select data-testid="craftsperson-trade-select" value={form.trade} onChange={(event) => update("trade", event.target.value)}>{trades.map((trade) => <option key={trade}>{trade}</option>)}</select></label>
          <label>Base<input required data-testid="craftsperson-location-input" value={form.location} onChange={(event) => update("location", event.target.value)} placeholder="For eksempel: Oslo" /></label>
          <fieldset><legend>Områder du vil ha oppdrag i</legend><div className="area-chips" data-testid="craftsperson-area-options">{coverage.areas.map((area) => <button type="button" key={area} data-testid={`service-area-${area.toLowerCase().replace(" ", "-")}`} className={form.service_areas.includes(area) ? "area-chip active" : "area-chip"} onClick={() => toggleArea(area)}>{form.service_areas.includes(area) && <CheckCircle2 size={14} />}{area}</button>)}</div></fieldset>
          <label>Fortell kort om fagområdet ditt<textarea required data-testid="craftsperson-bio-input" value={form.bio} onChange={(event) => update("bio", event.target.value)} placeholder="Erfaring, sertifiseringer og hva du liker å hjelpe kunder med." /></label>
          <button className="accent-button craft-submit" disabled={submitting} data-testid="create-craftsperson-profile-button">{submitting ? "Oppretter…" : "Opprett fagprofil"}<ArrowRight size={17} /></button>
        </form>
      </section>
    </div>
  );
}