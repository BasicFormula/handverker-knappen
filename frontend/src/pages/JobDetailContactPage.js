import { ArrowLeft, MapPin, MessageSquare, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { ContactAgreementBox } from "@/components/ContactAgreementBox";
import { CraftspersonContactList } from "@/components/CraftspersonContactList";
import { BankIdBadge } from "@/components/MarketplaceBits";
import { PreferredContactModal } from "@/components/PreferredContactModal";
import { createContactRequest, fetchAffiliateProducts, fetchCraftspeople, fetchJob, postOffer } from "@/lib/api";


export default function JobDetailContactPage() {
  const { jobId } = useParams();
  const [detail, setDetail] = useState(null);
  const [people, setPeople] = useState([]);
  const [products, setProducts] = useState([]);
  const [showOffer, setShowOffer] = useState(false);
  const [offer, setOffer] = useState({ amount: "", message: "" });
  const [contactFlow, setContactFlow] = useState(null);
  const [preferredPerson, setPreferredPerson] = useState(null);

  useEffect(() => {
    fetchJob(jobId).then(setDetail).catch(() => setDetail(null));
    fetchCraftspeople().then(setPeople).catch(() => setPeople([]));
    fetchAffiliateProducts().then(setProducts).catch(() => setProducts([]));
  }, [jobId]);

  const sendOffer = async (event) => {
    event.preventDefault();
    try {
      await postOffer(jobId, { craftsperson_id: "craft-ida", ...offer });
      setShowOffer(false);
      toast.success("Interessen er sendt til kunden.");
    } catch {
      toast.error("Fyll inn beløp og melding.");
    }
  };

  const approveContact = async (person) => {
    try {
      const result = await createContactRequest(jobId, { craftsperson_id: person.id, request_type: "standard" });
      setContactFlow(result);
      toast.success("Kontakt er godkjent.");
    } catch {
      toast.error("Kunne ikke godkjenne kontakt akkurat nå.");
    }
  };

  const createPreferredContact = async (paymentMethod) => {
    try {
      const result = await createContactRequest(jobId, { craftsperson_id: preferredPerson.id, request_type: "preferred", payment_method: paymentMethod });
      setPreferredPerson(null);
      toast.success(result.message);
    } catch {
      toast.error("Kunne ikke sende prioritert forespørsel akkurat nå.");
    }
  };

  if (!detail) {
    return <div className="page loading-state" data-testid="job-detail-loading">Laster oppdrag…</div>;
  }

  const { job, offers } = detail;
  return (
    <div className="page job-detail-page" data-testid="job-detail-page">
      <Link to="/oppdrag" className="back-link" data-testid="back-to-jobs-link"><ArrowLeft size={17} /> Alle oppdrag</Link>
      <section className="detail-hero">
        <img src={job.image} alt="" data-testid="job-detail-image" />
        <div className="detail-hero-copy">
          <div className="detail-tags"><span className="category-label" data-testid="job-detail-category">{job.category}</span><span className="open-label" data-testid="job-detail-status">{job.status}</span></div>
          <h1 data-testid="job-detail-title">{job.title}</h1>
          <p data-testid="job-detail-description">{job.description}</p>
          <div className="detail-meta"><span data-testid="job-detail-location"><MapPin size={17} /> {job.location}</span><strong data-testid="job-detail-budget">{job.budget}</strong></div>
          <div className="customer-verified" data-testid="customer-verified-info"><BankIdBadge /> Lagt ut av {job.customer}</div>
        </div>
      </section>
      <section className="detail-layout">
        <div>
          <section className="detail-section">
            <div className="section-heading"><div><p className="eyebrow">HENVENDELSER</p><h2>{offers.length + job.offer_count} håndverkere vil hjelpe</h2></div><button className="secondary-button" type="button" onClick={() => setShowOffer(!showOffer)} data-testid="send-offer-toggle-button"><MessageSquare size={17} /> Meld interesse</button></div>
            {showOffer && <form className="offer-form" onSubmit={sendOffer} data-testid="send-offer-form"><input required data-testid="offer-amount-input" value={offer.amount} onChange={(event) => setOffer({ ...offer, amount: event.target.value })} placeholder="Cirka pris, for eksempel 22 500 kr" /><textarea required data-testid="offer-message-input" value={offer.message} onChange={(event) => setOffer({ ...offer, message: event.target.value })} placeholder="Skriv en kort, konkret melding til kunden" /><button className="primary-button" data-testid="submit-offer-button">Send interesse</button></form>}
            <ContactAgreementBox contactFlow={contactFlow} />
            <CraftspersonContactList people={people} onApproveContact={approveContact} onPreferredContact={setPreferredPerson} />
          </section>
        </div>
        <aside className="context-sidebar">
          <div className="price-policy" data-testid="assignment-fee-info"><ShieldCheck size={20} /><strong>Kontakt på kundens premisser</strong><p>Godkjenn kontakt når du er klar. Kontaktinformasjon deles først når begge kan gå videre med oppdraget.</p></div>
          <div className="products-panel" data-testid="affiliate-products-panel"><p className="eyebrow">RELEVANT FOR DEG</p><h3>Materialer til jobben</h3>{products.filter((product) => product.category === job.category).map((product) => <button key={product.id} type="button" data-testid={`affiliate-product-${product.id}`} onClick={() => toast.success("Produktklikk registrert.")}><span>{product.title}<small>{product.shop}</small></span><b>{product.price}</b></button>)}</div>
        </aside>
      </section>
      <PreferredContactModal person={preferredPerson} onClose={() => setPreferredPerson(null)} onChoosePayment={createPreferredContact} />
    </div>
  );
}