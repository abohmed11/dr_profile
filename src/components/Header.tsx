/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Menu, X, LogIn, Plus, Globe } from 'lucide-react';
import { LandingPageConfig } from '../types';

interface HeaderProps {
  onNavigate: (view: 'landing' | 'features' | 'subscription' | 'contact' | 'login' | 'dashboard' | 'admin' | 'dr' | 'create' | 'clientWorks' | string, docUsername?: string) => void;
  currentView?: string;
  userRole?: 'admin' | 'doctor' | 'secretary' | null;
  doctorId?: string | null;
  doctors?: any[];
  landingConfig?: LandingPageConfig;
  currentLang?: 'ar' | 'en';
}

export default function Header({ onNavigate, currentView = 'landing', userRole, doctorId, doctors, landingConfig, currentLang: propLang }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  // Language state: 'ar' | 'en'
  const [currentLang, setCurrentLang] = useState<'ar' | 'en'>(() => {
    if (propLang) return propLang;
    try {
      return (localStorage.getItem('app_lang') as 'ar' | 'en') || 'ar';
    } catch {
      return 'ar';
    }
  });

  useEffect(() => {
    if (propLang && propLang !== currentLang) {
      setCurrentLang(propLang);
    }
  }, [propLang]);

  useEffect(() => {
    const handleLangChange = (e: any) => {
      const nextLang = e?.detail || (localStorage.getItem('app_lang') as 'ar' | 'en') || 'ar';
      setCurrentLang(nextLang);
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  const toggleLang = () => {
    const next = currentLang === 'ar' ? 'en' : 'ar';
    setCurrentLang(next);
    try {
      localStorage.setItem('app_lang', next);
    } catch (e) {}
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = next;
    window.dispatchEvent(new CustomEvent('languageChange', { detail: next }));
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (currentView !== 'landing') return;

    // Initialize from URL hash if available
    if (window.location.hash) {
      const hashId = window.location.hash.substring(1);
      const sections = ['hero', 'specialties', 'features', 'subscription', 'pricing', 'client-works', 'faq', 'reviews', 'contact'];
      if (sections.includes(hashId)) {
        setActiveSection(hashId);
        window.dispatchEvent(new CustomEvent('landing_section_change', { detail: hashId }));
      }
    }

    const sections = ['hero', 'specialties', 'features', 'subscription', 'pricing', 'client-works', 'faq', 'reviews', 'contact'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          window.dispatchEvent(new CustomEvent('landing_section_change', { detail: entry.target.id }));
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, [currentView]);

  const isTransparent = !isScrolled && currentView === 'landing';

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    if (targetId === 'features') {
      window.history.pushState(null, '', '/features');
      onNavigate('features');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'subscription' || targetId === 'pricing') {
      window.history.pushState(null, '', '/pricing');
      onNavigate('subscription');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'client-works' || targetId === 'clientWorks' || targetId === 'demos') {
      window.history.pushState(null, '', '/demos');
      onNavigate('clientWorks');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'contact') {
      window.history.pushState(null, '', '/contact');
      onNavigate('contact');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'create' || targetId === 'register' || targetId === 'register-section') {
      window.history.pushState(null, '', '/register');
      onNavigate('create');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'hero') {
      if (currentView === 'features' || currentView === 'subscription' || currentView === 'contact' || currentView === 'create') {
        window.history.pushState(null, '', '/');
        onNavigate('landing');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Update hash smoothly
    window.history.pushState(null, '', `#${targetId}`);
    setActiveSection(targetId);
    window.dispatchEvent(new CustomEvent('landing_section_change', { detail: targetId }));
    
    // If not in landing page, navigate to landing first
    if (currentView !== 'landing') {
      onNavigate('landing');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const hasArabic = (text?: string) => text ? /[\u0600-\u06FF]/.test(text) : false;

  const labels = currentLang === 'ar' ? {
    hero: 'الرئيسية',
    features: 'المميزات',
    subscription: 'الأسعار',
    clientWorks: 'نموذج',
    create: 'ابدأ الآن مجاناً',
    contact: 'تواصل معنا',
    login: landingConfig?.login?.headerLoginButtonText || 'تسجيل دخول',
    freeTrial: (landingConfig?.createSite?.headerCtaButtonText && landingConfig.createSite.headerCtaButtonText !== 'ابدأ تجربتك المجانية' && landingConfig.createSite.headerCtaButtonText !== 'أنشئ الآن' && landingConfig.createSite.headerCtaButtonText !== 'اشترك الآن') ? landingConfig.createSite.headerCtaButtonText : 'ابدأ الآن مجاناً',
  } : {
    hero: 'Home',
    features: 'Features',
    subscription: 'Pricing',
    clientWorks: 'Demo Model',
    create: 'Subscribe Now',
    contact: 'Contact Us',
    login: (landingConfig?.login?.headerLoginButtonText && !hasArabic(landingConfig.login.headerLoginButtonText)) ? landingConfig.login.headerLoginButtonText : 'Log In',
    freeTrial: (landingConfig?.createSite?.headerCtaButtonText && !hasArabic(landingConfig.createSite.headerCtaButtonText) && landingConfig.createSite.headerCtaButtonText !== 'Create Now' && landingConfig.createSite.headerCtaButtonText !== 'Start Free Trial') ? landingConfig.createSite.headerCtaButtonText : 'Subscribe Now',
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      <div 
        className={`w-full mx-auto rounded-none transition-all duration-300 border-b px-4 md:px-8 lg:px-12 py-3.5 md:py-4 flex items-center justify-between ${
          isTransparent 
            ? 'border-neutral-200/60 bg-white/80 backdrop-blur-md shadow-none text-[#10244A]' 
            : 'border-neutral-200 bg-white/95 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.04)] text-[#10244A]'
        }`}
        id="navbar-capsule"
      >
        <div className="w-full flex items-center justify-between">
          {/* Right/Start side: Logo & Navigation links together */}
          <div className="flex items-center gap-6 lg:gap-8 xl:gap-10">
            {/* Logo Image */}
            {(() => {
              const lightLogo = landingConfig?.headerLogos?.lightLogoUrl || landingConfig?.hero?.headerLogoLightUrl || "https://i.top4top.io/p_3857n94r80.png";
              return (
                <div 
                  onClick={() => onNavigate('landing')} 
                  className="flex items-center cursor-pointer group shrink-0 transition-all duration-300"
                  title={labels.hero}
                >
                  <img 
                    src={lightLogo} 
                    alt="بروفايلي - البوابة الطبية الشاملة" 
                    width="160"
                    height="48"
                    decoding="async"
                    className="h-9 sm:h-11 md:h-12 lg:h-13 max-h-[52px] w-auto object-contain transition-all duration-300 group-hover:scale-105"
                  />
                </div>
              );
            })()}

            {/* Navigation links grouped near logo */}
            <nav className="hidden lg:flex items-center gap-3 lg:gap-4 xl:gap-6 font-black text-xs lg:text-sm xl:text-base text-black">
              <a 
                href="#hero" 
                onClick={(e) => handleLinkClick(e, 'hero')}
                className={`whitespace-nowrap transition-all duration-200 font-black ${
                  activeSection === 'hero'
                    ? 'text-black'
                    : 'text-black/85 hover:text-black'
                }`}
              >
                {labels.hero}
              </a>
              <a 
                href="/features" 
                onClick={(e) => handleLinkClick(e, 'features')}
                className={`whitespace-nowrap transition-all duration-200 font-black ${
                  currentView === 'features' || (currentView === 'landing' && activeSection === 'features')
                    ? 'text-[#0051A8]'
                    : 'text-black/85 hover:text-black'
                }`}
              >
                {labels.features}
              </a>
              <a 
                href="/pricing" 
                onClick={(e) => handleLinkClick(e, 'subscription')}
                className={`whitespace-nowrap transition-all duration-200 font-black ${
                  currentView === 'subscription' || (currentView === 'landing' && activeSection === 'subscription')
                    ? 'text-[#0051A8]'
                    : 'text-black/85 hover:text-black'
                }`}
              >
                {labels.subscription}
              </a>
              <a 
                href="/demos" 
                onClick={(e) => handleLinkClick(e, 'clientWorks')}
                className={`whitespace-nowrap transition-all duration-200 font-black ${
                  currentView === 'clientWorks' || (currentView === 'landing' && activeSection === 'client-works')
                    ? 'text-[#0051A8]'
                    : 'text-black/85 hover:text-black'
                }`}
              >
                {labels.clientWorks}
              </a>

              <a 
                href="/contact" 
                onClick={(e) => handleLinkClick(e, 'contact')}
                className={`whitespace-nowrap transition-all duration-200 font-black ${
                  currentView === 'contact' || (currentView === 'landing' && activeSection === 'contact')
                    ? 'text-[#0051A8]'
                    : 'text-black/85 hover:text-black'
                }`}
              >
                {labels.contact}
              </a>
            </nav>
          </div>

          {/* Left side: Buttons & Language Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              {/* Language Selector Button */}
              <button
                type="button"
                onClick={toggleLang}
                className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold text-[#10244A] hover:bg-neutral-100 border border-neutral-200 rounded-xl transition-all cursor-pointer"
                title={currentLang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
              >
                <Globe className="w-4 h-4 text-[#10244A]" />
                <span className="font-sans">{currentLang === 'ar' ? 'English' : 'العربية'}</span>
              </button>

              {/* Free Trial / CTA Button: Navy Solid Rounded-xl */}
              <button 
                onClick={() => {
                  window.history.pushState(null, '', '/register');
                  onNavigate('create');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all whitespace-nowrap bg-[#003B7A] hover:bg-[#002d5e] active:scale-95 text-white shadow-md hover:shadow-lg cursor-pointer"
              >
                {labels.freeTrial}
              </button>

              {/* Login Button / Link */}
              <button 
                onClick={() => {
                  window.history.pushState(null, '', '/login');
                  onNavigate('login');
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-[#10244A] border border-[#10244A]/20 hover:bg-[#10244A] hover:text-white rounded-xl transition-all whitespace-nowrap cursor-pointer"
              >
                {labels.login}
              </button>
            </div>

            {/* Mobile & Tablet menu button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              aria-label="القائمة الرئيسية"
              className="lg:hidden p-2 rounded-xl transition-colors hover:bg-neutral-100 text-[#10244A] border border-neutral-200 cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Drawer Menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 w-full bg-white/98 backdrop-blur-md border-b border-neutral-200 rounded-none p-6 shadow-xl flex flex-col gap-5 z-40 transition-all duration-300">
          <div className={`flex flex-col gap-4 ${currentLang === 'en' ? 'text-left' : 'text-right'}`}>
            <a 
              href="#hero" 
              onClick={(e) => handleLinkClick(e, 'hero')}
              className={`font-black text-base py-1 transition-all ${
                activeSection === 'hero' ? 'text-black' : 'text-black/85 hover:text-black'
              }`}
            >
              {labels.hero}
            </a>
            <a 
              href="/features" 
              onClick={(e) => handleLinkClick(e, 'features')}
              className={`font-black text-base py-1 transition-all ${
                currentView === 'features' || (currentView === 'landing' && activeSection === 'features') ? 'text-[#0051A8]' : 'text-black/85 hover:text-black'
              }`}
            >
              {labels.features}
            </a>
            <a 
              href="/pricing" 
              onClick={(e) => handleLinkClick(e, 'subscription')}
              className={`font-black text-base py-1 transition-all ${
                currentView === 'subscription' || (currentView === 'landing' && activeSection === 'subscription') ? 'text-[#0051A8]' : 'text-black/85 hover:text-black'
              }`}
            >
              {labels.subscription}
            </a>
            <a 
              href="/demos" 
              onClick={(e) => handleLinkClick(e, 'clientWorks')}
              className={`font-black text-base py-1 transition-all ${
                currentView === 'clientWorks' || (currentView === 'landing' && activeSection === 'client-works') ? 'text-[#0051A8]' : 'text-black/85 hover:text-black'
              }`}
            >
              {labels.clientWorks}
            </a>

            <a 
              href="/contact" 
              onClick={(e) => handleLinkClick(e, 'contact')}
              className={`font-black text-base py-1 transition-all ${
                currentView === 'contact' || (currentView === 'landing' && activeSection === 'contact') ? 'text-[#0051A8]' : 'text-black/85 hover:text-black'
              }`}
            >
              {labels.contact}
            </a>
          </div>

          <div className="flex flex-col gap-3 pt-2 border-t border-neutral-100">
            <button 
              type="button"
              onClick={toggleLang}
              className="w-full py-2.5 text-center text-sm font-bold border border-neutral-200 rounded-xl text-[#10244A] hover:bg-neutral-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#10244A]" />
              <span>{currentLang === 'ar' ? 'English Language' : 'اللغة العربية'}</span>
            </button>

            <button 
              onClick={() => {
                setIsOpen(false);
                window.history.pushState(null, '', '/register');
                onNavigate('create');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3 text-center text-sm font-extrabold bg-[#003B7A] hover:bg-[#002d5e] active:scale-98 text-white rounded-xl transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              {labels.freeTrial}
            </button>

            <button 
              onClick={() => {
                setIsOpen(false);
                window.history.pushState(null, '', '/login');
                onNavigate('login');
              }}
              className="w-full py-2.5 text-center text-sm font-bold text-[#10244A] border border-[#10244A]/20 hover:bg-[#10244A] hover:text-white rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {labels.login}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
