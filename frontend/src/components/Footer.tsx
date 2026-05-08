import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "utils/translations";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="w-full glass-surface-light border-t border-slate-400/20 bar-gradient-top">
      <div className="container mx-auto px-4 py-8 text-center text-slate-700">
        <div className="mb-4">
          <p className="font-semibold text-forest-900">{t('footer_delivered_by')}</p>
          <p className="text-sm">Org.nr: 933 637 687</p> 
          <p className="text-sm">Oslo, Norge</p>
        </div>
        
        <p className="text-sm">
          © {new Date().getFullYear()} Håndverker <span className="text-amber-500">Knappen</span>. {t('footer_rights')}
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Link to="/for-handverkere-page" className="text-xs hover:text-amber-600 transition-colors">
            {t('nav_for_craftsmen')}
          </Link>
          <Link to="/contact-us-page" className="text-xs hover:text-amber-600 transition-colors">
            {t('nav_contact')}
          </Link>
          <Link to="/find-craftsmen" className="text-xs hover:text-amber-600 transition-colors">
            {t('nav_market')}
          </Link>
        </div>
      </div>
    </footer>
  );
}
