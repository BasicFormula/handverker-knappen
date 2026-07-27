import { BriefcaseBusiness, CircleHelp, LayoutDashboard, Plus, UserRound } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";

import { BankIdBadge } from "@/components/MarketplaceBits";


const links = [
  { to: "/", label: "Oversikt", icon: LayoutDashboard },
  { to: "/oppdrag", label: "Oppdrag", icon: BriefcaseBusiness },
  { to: "/profil", label: "Min profil", icon: UserRound },
];


export function AppShell() {
  return (
    <div className="app-frame" data-testid="app-shell">
      <aside className="sidebar" data-testid="main-navigation">
        <Link to="/" className="brand" data-testid="brand-home-link"><span className="brand-mark">H</span><span>håndverker<span>knappen</span></span></Link>
        <nav className="nav-links" aria-label="Hovednavigasjon">
          {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === "/"} className="nav-link" data-testid={`nav-${label.toLowerCase().replace(" ", "-")}`}><Icon size={18} strokeWidth={1.8} />{label}</NavLink>)}
        </nav>
        <div className="sidebar-bottom"><div className="verified-mini" data-testid="customer-verification-status"><BankIdBadge /><span>Kari Johansen<br /><strong>Verifisert kunde</strong></span></div><button className="help-link" type="button" data-testid="help-button"><CircleHelp size={17} /> Hjelp og trygghet</button></div>
      </aside>
      <main className="main-content"><header className="topbar"><div className="mobile-brand" data-testid="mobile-brand">håndverker<span>knappen</span></div><div className="topbar-actions"><div className="trust-note" data-testid="bankid-protection-note"><BankIdBadge /> Alle er verifisert</div><Link className="primary-button" to="/oppdrag/ny" data-testid="topbar-create-job-button"><Plus size={18} /> Legg ut oppdrag</Link></div></header><Outlet /></main>
    </div>
  );
}