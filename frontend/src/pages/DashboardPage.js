import { ArrowUpRight, BriefcaseBusiness, CheckCircle2, Mail, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { JobCard } from "@/components/MarketplaceBits";
import { fetchDashboard, fetchEmailTemplates } from "@/lib/api";


export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    fetchDashboard().then(setDashboard).catch(() => setDashboard({ recent_jobs: [] }));
    fetchEmailTemplates().then(setTemplates).catch(() => setTemplates([]));
  }, []);

  const stats = dashboard?.stats || { open_jobs: 3, received_offers: 10, completed: 3 };
  return (
    <div className="page dashboard-page" data-testid="customer-dashboard">
      <section className="page-intro">
        <div><p className="eyebrow">KUNDEOVERSIKT</p><h1>Hei, Kari.</h1><p>Her har du oversikten over oppdragene dine og håndverkerne som venter.</p></div>
        <Link className="accent-button" to="/oppdrag/ny" data-testid="dashboard-create-job-button"><Plus size={18} /> Nytt oppdrag</Link>
      </section>
      <section className="stat-grid" aria-label="Oversiktstall">
        <div className="stat-block" data-testid="open-jobs-stat"><BriefcaseBusiness /><span>Åpne oppdrag</span><strong>{stats.open_jobs}</strong></div>
        <div className="stat-block" data-testid="received-offers-stat"><ArrowUpRight /><span>Mottatte tilbud</span><strong>{stats.received_offers}</strong></div>
        <div className="stat-block" data-testid="completed-jobs-stat"><CheckCircle2 /><span>Fullførte oppdrag</span><strong>{stats.completed}</strong></div>
      </section>
      <section className="section-heading"><div><p className="eyebrow">AKTIVT NÅ</p><h2>Oppdragene dine</h2></div><Link to="/oppdrag" data-testid="view-all-jobs-link">Se alle <ArrowUpRight size={17} /></Link></section>
      <section className="job-list" data-testid="recent-jobs-list">{dashboard?.recent_jobs?.map((job) => <JobCard key={job.id} job={job} />)}</section>
      <section className="lower-grid">
        <div className="trust-panel" data-testid="trust-panel"><div className="panel-icon"><CheckCircle2 size={22} /></div><div><p className="eyebrow">TRYGG MARKEDSPLASS</p><h2>Et godt valg starter med tillit.</h2><p>Alle kunder og håndverkere verifiseres med BankID før de kan bruke markedsplassen.</p></div></div>
        <div className="automation-panel" data-testid="email-automation-panel"><Mail size={22} /><div><p className="eyebrow">AUTOMATISERING</p><h3>{templates.length || 5} e-postløp er klare</h3><p>Varsler, kvitteringer og påminnelser sendes automatisk når de aktiveres.</p></div></div>
      </section>
      <section className="reputation-explainer" data-testid="customer-reputation-explainer">
        <div><p className="eyebrow">SLIK LESER DU PROFILER</p><h2>Stjerner er opptjent, ikke gitt på forhånd.</h2></div>
        <div className="reputation-rules"><div><span>01</span><p><strong>Ny på plattformen</strong> betyr at håndverkeren ennå ikke har kundevurderinger, ikke at kvaliteten er vurdert lavere.</p></div><div><span>02</span><p><strong>BankID</strong> bekrefter identiteten før en profil kan bli synlig for kunder.</p></div><div><span>03</span><p><strong>Pålitelighet</strong> følger gjennomføring, svartid og avlysninger – separat fra kundens stjerner.</p></div></div>
      </section>
    </div>
  );
}