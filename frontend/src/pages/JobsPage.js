import { Filter, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { JobCard } from "@/components/MarketplaceBits";
import { fetchJobs } from "@/lib/api";


export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Alle fag");

  useEffect(() => { fetchJobs().then(setJobs).catch(() => setJobs([])); }, []);
  const filteredJobs = useMemo(() => jobs.filter((job) => (category === "Alle fag" || job.category === category) && `${job.title} ${job.location}`.toLowerCase().includes(search.toLowerCase())), [jobs, search, category]);
  const categories = ["Alle fag", "Elektriker", "Rørlegger", "Tømrer"];
  return (
    <div className="page" data-testid="jobs-page">
      <section className="page-intro compact"><div><p className="eyebrow">OPPDRAGSTORGET</p><h1>Finn rett oppdrag.</h1><p>Alle oppdrag kommer fra BankID-verifiserte kunder.</p></div></section>
      <section className="filters" data-testid="job-filters"><div className="search-box"><Search size={18} /><input data-testid="job-search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Søk etter oppdrag eller område" /></div><div className="filter-buttons"><Filter size={17} />{categories.map((item) => <button key={item} type="button" data-testid={`job-filter-${item.toLowerCase().replace(" ", "-")}`} className={category === item ? "filter-button active" : "filter-button"} onClick={() => setCategory(item)}>{item}</button>)}</div></section>
      <div className="results-line" data-testid="job-results-count"><strong>{filteredJobs.length} oppdrag</strong> som matcher akkurat nå</div>
      <section className="job-list full" data-testid="all-jobs-list">{filteredJobs.map((job) => <JobCard key={job.id} job={job} />)}</section>
    </div>
  );
}