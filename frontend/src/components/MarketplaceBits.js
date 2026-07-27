import { BadgeCheck, ChevronRight, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";


export function BankIdBadge() {
  return <span className="bankid-badge" data-testid="bankid-verified-badge"><BadgeCheck size={15} /> BankID</span>;
}

export function Stars({ rating, count }) {
  if (!rating || count === 0) {
    return <span className="new-craft-badge" data-testid="new-craftsperson-status">Ny på plattformen</span>;
  }
  return <span className="rating" data-testid="craftsperson-rating"><Star size={15} fill="currentColor" /> <strong>{rating}</strong><small>({count})</small></span>;
}

export function JobCard({ job }) {
  return <Link className="job-card" to={`/oppdrag/${job.id}`} data-testid={`job-card-${job.id}`}><img src={job.image} alt="" className="job-card-image" data-testid={`job-image-${job.id}`} /><div className="job-card-body"><div className="job-card-top"><span className="category-label" data-testid={`job-category-${job.id}`}>{job.category}</span><span className="job-time" data-testid={`job-date-${job.id}`}>{job.created_at}</span></div><h3 data-testid={`job-title-${job.id}`}>{job.title}</h3><p data-testid={`job-description-${job.id}`}>{job.description}</p><div className="job-card-meta"><span data-testid={`job-location-${job.id}`}><MapPin size={15} /> {job.location}</span><strong data-testid={`job-budget-${job.id}`}>{job.budget}</strong></div></div><ChevronRight className="job-chevron" size={20} aria-hidden="true" /></Link>;
}