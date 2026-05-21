import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserNav } from "components/UserNav";
import { useUser } from "@stackframe/react";
import { stackClientApp } from "app/auth";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Globe } from "lucide-react";
import { useTranslation } from "utils/translations";
import { useLanguageStore } from "utils/languageStore";

export default function Header() {
  const user = useUser();
  const [isOpen, setIsOpen] = React.useState(false);
  const { t } = useTranslation();
  const { language, toggleLanguage } = useLanguageStore();

  return (
    <header className="sticky top-0 left-0 right-0 glass-surface-light backdrop-blur-xl z-50 border-b border-border bar-gradient-bottom">
      <div className="container mx-auto px-4 h-20 sm:h-24 md:h-28 lg:h-32 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-forest-900 group-hover:opacity-90 transition-all origin-left uppercase">
            Håndverker<span className="text-amber-500">Knappen</span>
          </span>
        </Link>
        <nav className="hidden md:flex gap-4 items-center">
          <Button asChild variant="ghost" className="h-11 px-5 rounded-xl">
            <Link to="/for-handverkere-page" className="font-display text-lg uppercase tracking-wider text-slate-600 hover:text-amber-600 transition-colors">
              {t('nav_for_craftsmen')}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-11 px-5 rounded-xl">
            <Link to="/find-craftsmen" className="font-display text-lg uppercase tracking-wider text-slate-600 hover:text-amber-600 transition-colors">
              {t('nav_market')}
            </Link>
          </Button>
          <Button asChild variant="ghost" className="h-11 px-5 rounded-xl">
            <Link to="/contact-us-page" className="font-display text-lg uppercase tracking-wider text-slate-600 hover:text-amber-600 transition-colors">
              {t('nav_contact')}
            </Link>
          </Button>
        </nav>
        <div className="flex items-center gap-2">

          {/* Language Toggle */}
          <Button
            onClick={toggleLanguage}
            variant="ghost"
            size="icon"
            className="hidden md:flex text-slate-600 hover:text-forest-800"
            title={language === 'no' ? 'Switch to English' : 'Bytt til Norsk'}
          >
            <img
              src={language === 'no' ? 'https://flagcdn.com/w80/no.png' : 'https://flagcdn.com/w80/gb.png'}
              alt={language === 'no' ? 'Norsk' : 'English'}
              className="w-7 h-auto rounded shadow-md border border-slate-400/30"
            />
          </Button>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <UserNav />
            ) : (
              <>
                <Button
                  onClick={() => stackClientApp.redirectToSignIn()}
                  variant="ghost"
                  className="h-11 px-4 rounded-xl text-slate-600 hover:text-forest-800 transition-colors font-semibold tracking-[0.02em]"
                >
                  {t('nav_login')}
                </Button>
                <Button
                  onClick={() => stackClientApp.redirectToSignUp()}
                  className="h-11 px-5 rounded-xl bg-amber-500 text-white font-semibold hover:bg-copper-500 transition-all hover:shadow-lg hover:shadow-amber-500/20 tracking-wide"
                >
                  {t('nav_register')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-2">
            <Button
              onClick={toggleLanguage}
              variant="ghost"
              size="icon"
              className="text-slate-600 hover:text-forest-800 mr-1"
            >
              <img
                src={language === 'no' ? 'https://flagcdn.com/w80/no.png' : 'https://flagcdn.com/w80/gb.png'}
                alt={language === 'no' ? 'Norsk' : 'English'}
                className="w-7 h-auto rounded shadow-md border border-slate-400/30"
              />
            </Button>

            {user && <UserNav />}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-forest-900 hover:bg-forest-900/10">
                  <Menu className="h-7 w-7" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-md">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    to="/for-handverkere-page"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-semibold text-forest-900 hover:text-amber-500 transition-colors"
                  >
                    {t('nav_for_craftsmen')}
                  </Link>
                  <Link
                    to="/find-craftsmen"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-semibold text-forest-900 hover:text-amber-500 transition-colors"
                  >
                    {t('nav_market')}
                  </Link>
                  {user && (
                    <>
                      <Link
                        to="/my-assignments-page"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-semibold text-forest-900 hover:text-amber-500 transition-colors"
                      >
                        {t('nav_my_assignments')}
                      </Link>
                      <Link
                        to="/craftsman-dashboard"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-semibold text-forest-900 hover:text-amber-500 transition-colors"
                      >
                        {t('nav_craftsman_dashboard')}
                      </Link>
                      <Link
                        to="/admin-dashboard-page"
                        onClick={() => setIsOpen(false)}
                        className="text-lg font-semibold text-forest-900 hover:text-amber-500 transition-colors"
                      >
                        {t('nav_admin_dashboard')}
                      </Link>
                    </>
                  )}
                  <Link
                    to="/contact-us-page"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-semibold text-forest-900 hover:text-amber-500 transition-colors"
                  >
                    {t('nav_contact')}
                  </Link>
                  {!user && (
                    <>
                      <div className="h-px bg-slate-400/20 my-2" />
                      <Button
                        onClick={() => {
                          stackClientApp.redirectToSignIn();
                          setIsOpen(false);
                        }}
                        variant="ghost"
                        className="justify-start text-lg font-semibold text-forest-900 hover:text-amber-500 px-0"
                      >
                        {t('nav_login')}
                      </Button>
                      <Button
                        onClick={() => {
                          stackClientApp.redirectToSignUp();
                          setIsOpen(false);
                        }}
                        className="bg-amber-500 text-white font-semibold hover:bg-copper-500 transition-all hover:shadow-lg hover:shadow-amber-500/20"
                      >
                        {t('nav_register')}
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
