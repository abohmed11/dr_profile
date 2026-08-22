/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LandingPageConfig } from '../types';
import { getEffectiveSocialLinks, SocialIcon } from './SocialLinks';

interface FooterProps {
  onNavigate?: (view: 'landing' | 'features' | 'subscription' | 'contact' | 'login' | 'dashboard' | 'admin' | 'dr' | 'create' | 'clientWorks' | string, docUsername?: string) => void;
  landingConfig?: LandingPageConfig;
  currentLang?: 'ar' | 'en';
}

export default function Footer({ onNavigate, landingConfig, currentLang = 'ar' }: FooterProps) {

  const handleOpenLegal = (e: React.MouseEvent, docType: string, pathSlug: string) => {
    e.preventDefault();
    window.history.pushState(null, '', `/${pathSlug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (onNavigate) {
      onNavigate(docType);
    }
  };

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (targetId === 'features') {
      window.history.pushState(null, '', '/features');
      if (onNavigate) {
        onNavigate('features');
      } else {
        window.location.href = '/features';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'subscription' || targetId === 'pricing') {
      window.history.pushState(null, '', '/pricing');
      if (onNavigate) {
        onNavigate('subscription');
      } else {
        window.location.href = '/pricing';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'client-works' || targetId === 'clientWorks' || targetId === 'demos') {
      window.history.pushState(null, '', '/demos');
      if (onNavigate) {
        onNavigate('clientWorks');
      } else {
        window.location.href = '/demos';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'contact') {
      window.history.pushState(null, '', '/contact');
      if (onNavigate) {
        onNavigate('contact');
      } else {
        window.location.href = '/contact';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'create' || targetId === 'register' || targetId === 'register-section') {
      window.history.pushState(null, '', '/register');
      if (onNavigate) {
        onNavigate('create');
      } else {
        window.location.href = '/register';
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (targetId === 'hero') {
      window.history.pushState(null, '', '/');
      if (onNavigate) {
        onNavigate('landing');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const logoUrl = landingConfig?.footer?.logoUrl || "https://k.top4top.io/p_38573eitn0.png";
  const paymentMethodsImageUrl = landingConfig?.footer?.paymentMethodsImageUrl;

  const description = currentLang === 'en'
    ? 'An integrated platform for creating professional doctor profiles and managing digital presence effortlessly.'
    : (landingConfig?.footer?.description || "منصة متكاملة لإنشاء بروفايلات احترافية للأطباء وإدارة حضورهم الرقمي بسهولة.");

  const socialLinks = getEffectiveSocialLinks(landingConfig?.footer);
  const copyrightText = landingConfig?.footer?.copyrightText || "© 2026 Dr Profile. All rights reserved.";

  const importantLinksHeader = currentLang === 'en' ? 'Important Links' : 'روابط مهمة';
  const importantLinks = currentLang === 'en'
    ? {
        about: 'About Us',
        terms: 'Terms of Use',
        privacy: 'Privacy Policy',
        disclaimer: 'Disclaimer'
      }
    : {
        about: 'من نحن',
        terms: 'شروط الاستخدام',
        privacy: 'سياسة الخصوصية',
        disclaimer: 'إخلاء المسؤولية'
      };

  return (
    <footer 
      id="footer"
      className="w-full bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] text-white py-8 sm:py-10 md:py-12 scroll-mt-24 relative overflow-hidden"
      dir={currentLang === 'en' ? 'ltr' : 'rtl'}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col gap-6">
        
        {/* Main Row: Logo & Description + Important Links */}
        <div className={`flex flex-row items-start justify-between gap-6 md:gap-8 ${currentLang === 'en' ? 'text-left' : 'text-right'}`}>
          
          {/* Logo & Description */}
          <div className={`flex flex-col items-start ${currentLang === 'en' ? 'text-left' : 'text-right'} max-w-md`}>
            <a 
              href="#hero" 
              onClick={(e) => handleScroll(e, 'hero')}
              className="inline-block transition-transform duration-300 hover:scale-105 mb-2"
              title="Dr Profile"
            >
              <img 
                src={logoUrl} 
                alt="Dr Profile Logo" 
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                width="185"
                height="50"
                className="w-[140px] sm:w-[185px] h-auto object-contain"
              />
            </a>
            <p className="text-[13px] sm:text-[15px] font-medium text-[rgba(255,255,255,0.85)] leading-relaxed">
              {description}
            </p>

            {/* Payment Methods Icons / Image */}
            {paymentMethodsImageUrl && (
              <div className="mt-4 flex items-center">
                <img 
                  src={paymentMethodsImageUrl} 
                  alt="Payment Methods" 
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="max-h-16 sm:max-h-20 md:max-h-24 w-auto max-w-[280px] sm:max-w-[360px] object-contain rounded-lg drop-shadow-md"
                />
              </div>
            )}
          </div>

          {/* Important Links Column */}
          <div className={`flex flex-col items-start ${currentLang === 'en' ? 'text-left' : 'text-right'} space-y-2.5 min-w-[200px]`}>
            <h4 className={`text-sm sm:text-base font-black text-white uppercase tracking-wider w-full ${currentLang === 'en' ? 'text-left' : 'text-right'}`}>
              {importantLinksHeader}
            </h4>
            <nav className="flex flex-col gap-2.5 text-[13px] sm:text-[14px] font-semibold text-white/90">
              <a 
                href="/about" 
                onClick={(e) => handleOpenLegal(e, 'about', 'about')}
                className="transition-colors duration-200 hover:text-blue-300 cursor-pointer"
              >
                {importantLinks.about}
              </a>
              <a 
                href="/terms" 
                onClick={(e) => handleOpenLegal(e, 'terms', 'terms')}
                className="transition-colors duration-200 hover:text-blue-300 cursor-pointer"
              >
                {importantLinks.terms}
              </a>
              <a 
                href="/privacy" 
                onClick={(e) => handleOpenLegal(e, 'privacy', 'privacy')}
                className="transition-colors duration-200 hover:text-blue-300 cursor-pointer"
              >
                {importantLinks.privacy}
              </a>
              <a 
                href="/disclaimer" 
                onClick={(e) => handleOpenLegal(e, 'disclaimer', 'disclaimer')}
                className="transition-colors duration-200 hover:text-blue-300 cursor-pointer"
              >
                {importantLinks.disclaimer}
              </a>
            </nav>
          </div>

        </div>

        {/* Center: Social Icons & Copyright */}
        <div className="flex flex-col items-center justify-center text-center gap-2.5">
          {/* Social Icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center justify-center flex-wrap gap-3">
              {socialLinks.map((item) => (
                <a 
                  key={item.id}
                  href={item.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={item.title || item.platform}
                  title={item.title || item.platform}
                  className="w-[34px] h-[34px] sm:w-[38px] sm:h-[38px] rounded-full border border-white/40 text-white flex items-center justify-center transition-all duration-300 hover:border-blue-300 hover:text-blue-300 hover:bg-white/10 hover:scale-110 shadow-sm"
                >
                  <SocialIcon platform={item.platform} className="w-4 h-4" />
                </a>
              ))}
            </div>
          )}

          {/* Copyright */}
          <p className="text-[12px] sm:text-[14px] font-normal text-[rgba(255,255,255,0.7)]">
            {copyrightText}
          </p>
        </div>

      </div>
    </footer>
  );
}

