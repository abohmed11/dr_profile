/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Globe, Link, Share2, Clock, Monitor, Smartphone, CheckCircle2 } from 'lucide-react';
import { LandingPageConfig } from '../types';

interface HeroProps {
  onNavigate: (view: 'landing' | 'features' | 'subscription' | 'contact' | 'login' | 'dashboard' | 'admin' | 'dr' | 'create', docUsername?: string) => void;
  landingConfig?: LandingPageConfig;
  currentLang?: 'ar' | 'en';
}

export default function Hero({ onNavigate, landingConfig, currentLang = 'ar' }: HeroProps) {
  const handleCreateNow = () => {
    window.history.pushState(null, '', '/register');
    if (onNavigate) {
      onNavigate('create');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHowItWorks = () => {
    const target = document.getElementById('how-it-works-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.7, behavior: 'smooth' });
    }
  };

  const featurePillars = [
    {
      id: 'medical-link',
      title: currentLang === 'en' ? 'Your Own Medical Link' : (landingConfig?.hero?.pillar1Title || 'رابط طبي خاص بك'),
      icon: (
        <div className="relative w-20 h-20 mb-4 flex items-center justify-center shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#e0edff] to-[#f0f6ff] flex items-center justify-center shadow-inner relative overflow-visible">
            {/* Main browser card */}
            <div className="w-14 h-11 bg-white border border-[#93c5fd] rounded-xl shadow-md flex flex-col p-1 relative overflow-hidden">
              <div className="flex items-center gap-1 border-b border-blue-100 pb-0.5 mb-1 px-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-300"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
              </div>
              <div className="bg-[#eff6ff] rounded text-[9px] text-[#1d4ed8] font-bold px-1 text-center truncate border border-blue-100 shadow-xs">
                your.link
              </div>
            </div>

            {/* Bottom-right Link badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563eb] to-[#3b82f6] flex items-center justify-center text-white shadow-md border-2 border-white">
              <Link className="w-4 h-4" />
            </div>

            {/* Top-left Share badge */}
            <div className="absolute -top-1 -left-1 w-7 h-7 rounded-full bg-gradient-to-tr from-[#1d4ed8] to-[#60a5fa] flex items-center justify-center text-white shadow-sm border-2 border-white">
              <Share2 className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'easy-booking',
      title: currentLang === 'en' ? 'Easy Appointment Booking' : (landingConfig?.hero?.pillar2Title || 'حجز مواعيد بسهولة'),
      icon: (
        <div className="relative w-20 h-20 mb-4 flex items-center justify-center shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#e0edff] to-[#f0f6ff] flex items-center justify-center shadow-inner relative overflow-visible">
            {/* Main Calendar card */}
            <div className="w-12 h-12 bg-white border border-[#93c5fd] rounded-xl shadow-md flex flex-col p-1.5 relative">
              <div className="flex items-center justify-between border-b border-blue-100 pb-1 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#2563eb]"></div>
                <div className="w-2 h-2 rounded-full bg-[#2563eb]"></div>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="w-2 h-2 bg-blue-100 rounded-xs"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-xs"></div>
                <div className="w-2 h-2 bg-blue-200 rounded-xs"></div>
                <div className="w-2 h-2 bg-blue-600 rounded-xs"></div>
                <div className="w-2 h-2 bg-blue-100 rounded-xs"></div>
                <div className="w-2 h-2 bg-blue-200 rounded-xs"></div>
              </div>
            </div>

            {/* Bottom-right Clock badge */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-tr from-[#2563eb] to-[#3b82f6] flex items-center justify-center text-white shadow-md border-2 border-white">
              <Clock className="w-4 h-4" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'all-devices',
      title: currentLang === 'en' ? 'Works on All Devices' : (landingConfig?.hero?.pillar3Title || 'يعمل على كل الأجهزة'),
      icon: (
        <div className="relative w-20 h-20 mb-4 flex items-center justify-center shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#e0edff] to-[#f0f6ff] flex items-center justify-center shadow-inner relative overflow-visible">
            <div className="flex items-end gap-1">
              {/* Monitor */}
              <div className="w-10 h-8 bg-white border border-[#93c5fd] rounded-lg shadow-md flex flex-col items-center justify-center relative p-1">
                <Monitor className="w-5 h-5 text-[#2563eb]" />
              </div>

              {/* Smartphone */}
              <div className="w-5 h-9 bg-white border border-[#93c5fd] rounded-md shadow-md flex items-center justify-center p-0.5 -ml-2 -mb-1 z-10">
                <Smartphone className="w-3.5 h-3.5 text-[#2563eb]" />
              </div>
            </div>

            {/* Checkmark Badge */}
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-tr from-[#2563eb] to-[#3b82f6] flex items-center justify-center text-white shadow-md border-2 border-white">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'multi-lang',
      title: currentLang === 'en' ? 'Multi-Language Support' : (landingConfig?.hero?.pillar4Title || 'دعم لغات متعددة'),
      icon: (
        <div className="relative w-20 h-20 mb-4 flex items-center justify-center shrink-0">
          <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#e0edff] to-[#f0f6ff] flex items-center justify-center shadow-inner relative overflow-visible">
            {/* Globe Circle */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#2563eb] to-[#60a5fa] flex items-center justify-center text-white shadow-md">
              <Globe className="w-6 h-6" />
            </div>

            {/* "A" Badge */}
            <div className="absolute top-0 right-0 bg-white border border-blue-200 text-[#1d4ed8] font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">
              A
            </div>

            {/* "ع" Badge */}
            <div className="absolute bottom-0 left-0 bg-white border border-blue-200 text-[#1d4ed8] font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow-sm">
              ع
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <section id="hero" className="relative w-full flex flex-col items-center justify-center overflow-hidden bg-white text-[#10244A] pt-[68px] md:pt-[76px]">
      {/* Top Fold */}
      <div className="w-full min-h-[85vh] lg:min-h-screen flex flex-col lg:flex-row items-center lg:items-start justify-between p-0 m-0 z-20">
        
        {/* Right side: Texts */}
        <div className="flex-1 w-full lg:w-1/2 text-center lg:text-right flex flex-col items-center lg:items-start order-2 lg:order-1 pt-14 sm:pt-28 lg:pt-36 px-4 sm:px-8 lg:pr-12 xl:pr-20">
          <div className="max-w-xl xl:max-w-2xl flex flex-col items-center lg:items-start">
            <h1 className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold font-almarai tracking-wide text-[#10244A] mb-6 md:mb-8 leading-[1.15] ${currentLang === 'en' ? 'lg:text-left' : 'lg:text-right'}`}>
              {currentLang === 'en'
                ? 'Create Your Medical Profile in Minutes'
                : (landingConfig?.hero?.title && landingConfig.hero.title !== 'بروفايل احترافي يعكس خبرتك الطبية'
                    ? landingConfig.hero.title
                    : 'أنشئ بروفايلك الطبي في دقائق')}
            </h1>

            <p className={`text-black text-sm sm:text-lg md:text-xl lg:text-lg max-w-2xl mb-6 sm:mb-6 md:mb-8 lg:mb-10 leading-relaxed font-medium px-2 sm:px-0 opacity-70 ${currentLang === 'en' ? 'lg:text-left' : 'lg:text-right'}`}>
              {currentLang === 'en'
                ? 'Create a professional medical profile showcasing your expertise and services with an intelligent booking system and complete control dashboard with zero commission.'
                : (landingConfig?.hero?.subtitle || 'من خلال موقعنا يمكنك إنشاء بروفايل طبي احترافي يعرض خبراتك وخدماتك مع نظام حجز ذكي ولوحة تحكم متكاملة دون أي عمولات على الحجوزات')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto items-center justify-center lg:justify-start">
              <button 
                onClick={handleCreateNow}
                className="px-8 py-4 bg-[#003B7A] hover:bg-[#002d5e] active:scale-95 text-white font-extrabold text-base rounded-xl transition-all flex items-center justify-center gap-2 group shadow-xl cursor-pointer"
              >
                {currentLang === 'en' 
                  ? 'Start Free Now' 
                  : (landingConfig?.hero?.primaryCtaText === 'اشترك الآن' ? 'ابدأ الآن مجاناً' : landingConfig?.hero?.primaryCtaText) || 'ابدأ الآن مجاناً'}
              </button>
            </div>

            {/* Social Proof with 4 Doctor Avatars directly under 'ابدأ الآن مجاناً' */}
            <div className="mt-6 sm:mt-7 flex items-center gap-1.5 sm:gap-2.5 justify-center lg:justify-start w-full max-w-fit mx-auto lg:mx-0">
              {/* Overlapping 4 doctor avatar circles - tighter overlap on mobile */}
              <div className="flex -space-x-3.5 sm:-space-x-4 rtl:space-x-reverse shrink-0 items-center">
                <img 
                  className="inline-block h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 ring-white bg-slate-100 object-cover shrink-0 shadow-xs" 
                  src="https://b.top4top.io/p_3877muh0n1.png" 
                  alt="Doctor" 
                  referrerPolicy="no-referrer"
                />
                <img 
                  className="inline-block h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 ring-white bg-slate-100 object-cover shrink-0 shadow-xs" 
                  src="https://l.top4top.io/p_3877l7e661.png" 
                  alt="Doctor" 
                  referrerPolicy="no-referrer"
                />
                <img 
                  className="inline-block h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 ring-white bg-slate-100 object-cover shrink-0 shadow-xs" 
                  src="https://l.top4top.io/p_38774iynl1.png" 
                  alt="Doctor" 
                  referrerPolicy="no-referrer"
                />
                <img 
                  className="inline-block h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 ring-white bg-slate-100 object-cover shrink-0 shadow-xs" 
                  src="https://b.top4top.io/p_3877phl351.png" 
                  alt="Doctor" 
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Text */}
              <span className="font-black text-xs sm:text-base md:text-lg text-[#10244A] tracking-tight whitespace-nowrap">
                {currentLang === 'en' 
                  ? '+500 doctors using the platform' 
                  : (landingConfig?.hero?.doctorsCountText || '+500 طبيب يستخدمون المنصة')}
              </span>
            </div>
          </div>
        </div>

        {/* Left side: Image starting right from below the top header and starting from left edge */}
        <div className="flex-1 w-full lg:w-1/2 flex items-start justify-center lg:justify-start order-1 lg:order-2 [direction:ltr] p-0 m-0 pt-4 sm:pt-8 lg:pt-12">
          {/* Mobile & Tablet Image */}
          <img 
            src={landingConfig?.hero?.heroMobileImage || "https://k.top4top.io/p_3874k7cvg1.png"} 
            alt="Hero Visual" 
            referrerPolicy="no-referrer"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onError={(e) => {
              const target = e.currentTarget;
              if (landingConfig?.hero?.heroDesktopImage && target.src !== landingConfig.hero.heroDesktopImage) {
                target.src = landingConfig.hero.heroDesktopImage;
              } else if (target.src !== "https://k.top4top.io/p_3874k7cvg1.png") {
                target.src = "https://k.top4top.io/p_3874k7cvg1.png";
              }
            }}
            className="block lg:hidden w-full max-w-2xl md:max-w-3xl h-auto object-contain object-top max-h-none transition-transform duration-500 hover:scale-[1.01] select-none pointer-events-none"
            style={{ WebkitUserDrag: 'none', userSelect: 'none' } as React.CSSProperties}
          />
          {/* Desktop Image */}
          <img 
            src={landingConfig?.hero?.heroDesktopImage || landingConfig?.hero?.heroMobileImage || "https://h.top4top.io/p_3874d6cv31.png"} 
            alt="Hero Visual" 
            referrerPolicy="no-referrer"
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onError={(e) => {
              const target = e.currentTarget;
              if (landingConfig?.hero?.heroMobileImage && target.src !== landingConfig.hero.heroMobileImage) {
                target.src = landingConfig.hero.heroMobileImage;
              } else if (target.src !== "https://k.top4top.io/p_3874k7cvg1.png") {
                target.src = "https://k.top4top.io/p_3874k7cvg1.png";
              }
            }}
            className="hidden lg:block w-full h-auto object-contain object-top lg:object-left-top max-h-[calc(100vh-76px)] transition-transform duration-500 hover:scale-[1.01] select-none pointer-events-none"
            style={{ WebkitUserDrag: 'none', userSelect: 'none' } as React.CSSProperties}
          />
        </div>

      </div>

      {/* Feature Icons Bar (Right under Hero Image & Title) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-2 md:mt-4 mb-8 md:mb-12 z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-white py-2 px-2 md:py-4"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10 lg:gap-16">
            {featurePillars.map((item, idx) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center text-center px-2 sm:px-4 py-3"
              >
                {item.icon}
                <h3 className="text-[#10244A] font-extrabold text-lg md:text-xl tracking-tight select-text">
                  {item.title}
                </h3>
                {(item as any).subtitle ? (
                  <p className="text-[#4a5568] font-semibold text-sm md:text-base leading-relaxed max-w-xs opacity-90 select-text mt-2">
                    {(item as any).subtitle}
                  </p>
                ) : null}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sub-block directly below Hero: بروفايلك الطبي... هويتك */}
      <div className="w-full py-12 md:py-16 bg-white z-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: currentLang === 'en' ? 60 : -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full md:w-[420px] flex items-center shrink-0 ${currentLang === 'en' ? 'justify-center md:justify-start order-1 md:order-2' : 'justify-center md:justify-start'}`}
          >
            <img 
              src={landingConfig?.hero?.subHeroImage || "https://l.top4top.io/p_3874bibs21.png"} 
              alt="Medical Profile" 
              className="w-full max-w-sm md:max-w-[420px] h-auto object-contain rounded-xl transition-transform" 
              referrerPolicy="no-referrer"
            />
          </motion.div>

          {/* Heading & Description */}
          <motion.div 
            initial={{ opacity: 0, x: currentLang === 'en' ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className={`w-full md:w-[420px] flex flex-col justify-center ${currentLang === 'en' ? 'text-left order-2 md:order-1' : 'text-right'}`}
          >
            <h2 className="text-xl sm:text-2xl font-black text-[#10244A] leading-snug tracking-tight mb-4">
              {currentLang === 'en' 
                ? 'Your Medical Profile... Your Identity'
                : (landingConfig?.hero?.subHeroTitle || 'بروفايلك الطبي... هويتك')}
            </h2>
            <p className="text-black font-semibold opacity-60 text-base md:text-lg leading-loose md:leading-[2] mb-6">
              {currentLang === 'en'
                ? 'Instead of your profile being just another page among hundreds of doctors on another platform, own your personal medical profile with your identity, services, data, and direct communication channels with your patients.'
                : (landingConfig?.hero?.subHeroSubtitle || 'بدلًا من أن يكون بروفايلك مجرد صفحة وسط مئات الأطباء على منصة أخرى، امتلك بروفايلك الطبي الخاص بهويتك، وخدماتك، وبياناتك، ووسائل التواصل مع مرضاك')}
            </p>
            <div className="pt-2">
              <button 
                onClick={handleHowItWorks}
                className="group px-7 py-3 bg-[#003B7A] hover:bg-[#002d5e] active:scale-95 text-white font-extrabold text-base rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer inline-flex items-center gap-2.5"
              >
                <span>{currentLang === 'en' ? 'How It Works' : (landingConfig?.hero?.subHeroButtonText || 'كيف يعمل')}</span>
                <ArrowLeft className={`w-4 h-4 transition-transform stroke-[2.5] ${currentLang === 'en' ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* How It Works Section - 3 Steps */}
      <div id="how-it-works-section" className="w-full py-16 md:py-24 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] z-20 scroll-mt-20 relative overflow-hidden border-y border-blue-800/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Section Title & Subtitle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
              {currentLang === 'en' 
                ? 'Create Your Medical Profile in 3 Steps' 
                : (landingConfig?.hero?.howItWorksTitle || 'أنشئ بروفايلك الطبي في 3 خطوات')}
            </h2>
            <p className="text-blue-100 font-bold text-sm sm:text-base mt-2 sm:mt-3 opacity-95">
              {currentLang === 'en' 
                ? 'Simple & fast professional profile - no coding, no design, no hassle' 
                : (landingConfig?.hero?.howItWorksSubtitle || 'بروفايل احترافي بسيط وسريع لا برمجة لا تصميم لا تعقيد')}
            </p>
          </motion.div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 lg:gap-12 max-w-6xl mx-auto relative">
            
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl py-7 px-7 sm:py-8 sm:px-8 relative flex flex-col items-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              {/* Step Badge */}
              <div className="w-9 h-9 rounded-full bg-[#1d63ff] text-white font-extrabold text-base flex items-center justify-center absolute -top-4.5 left-1/2 -translate-x-1/2 shadow-sm">
                1
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-[#ebf3ff] flex items-center justify-center relative my-3 transition-transform group-hover:scale-105 shrink-0">
                <svg className="w-8 h-8 text-[#1d63ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                  <rect x="15" y="14" width="7" height="6" rx="1" fill="#ebf3ff" className="stroke-[#1d63ff]" />
                  <path d="M17 16h3" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-[#10244A] tracking-tight">
                {currentLang === 'en' 
                  ? 'Register as a Doctor' 
                  : (landingConfig?.hero?.step1Title || 'سجّل كطبيب')}
              </h3>

              {/* Description */}
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed mt-2 max-w-xs">
                {currentLang === 'en' 
                  ? 'Create your account in seconds using username and password.'
                  : (landingConfig?.hero?.step1Desc || 'أنشئ حسابك خلال ثوان باستخدام اسم المستخدم وكلمة المرور.')}
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl py-7 px-7 sm:py-8 sm:px-8 relative flex flex-col items-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              {/* Step Badge */}
              <div className="w-9 h-9 rounded-full bg-[#1d63ff] text-white font-extrabold text-base flex items-center justify-center absolute -top-4.5 left-1/2 -translate-x-1/2 shadow-sm">
                2
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-[#ebf3ff] flex items-center justify-center relative my-3 transition-transform group-hover:scale-105 shrink-0">
                <svg className="w-8 h-8 text-[#1d63ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                  <path d="M5 21h6" />
                </svg>
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-[#10244A] tracking-tight">
                {currentLang === 'en' 
                  ? 'Enter Your Details' 
                  : (landingConfig?.hero?.step2Title || 'أدخل بياناتك')}
              </h3>

              {/* Description */}
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed mt-2 max-w-xs">
                {currentLang === 'en' 
                  ? 'Add your name, specialty, services, working hours, and contact info.'
                  : (landingConfig?.hero?.step2Desc || 'أضف اسمك، تخصصك، خدماتك، ساعات العمل، وبيانات التواصل.')}
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl py-7 px-7 sm:py-8 sm:px-8 relative flex flex-col items-center text-center shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all group"
            >
              {/* Step Badge */}
              <div className="w-9 h-9 rounded-full bg-[#1d63ff] text-white font-extrabold text-base flex items-center justify-center absolute -top-4.5 left-1/2 -translate-x-1/2 shadow-sm">
                3
              </div>

              {/* Icon Container */}
              <div className="w-16 h-16 rounded-2xl bg-[#ebf3ff] flex items-center justify-center relative my-3 transition-transform group-hover:scale-105 shrink-0">
                <CheckCircle2 className="w-8 h-8 text-[#1d63ff] stroke-[2.2]" />
              </div>

              {/* Title */}
              <h3 className="text-xl font-black text-[#10244A] tracking-tight">
                {currentLang === 'en' 
                  ? 'Your Site is Ready!' 
                  : (landingConfig?.hero?.step3Title || 'موقعك جاهز!')}
              </h3>

              {/* Description */}
              <p className="text-slate-500 font-semibold text-sm sm:text-base leading-relaxed mt-2 max-w-xs">
                {currentLang === 'en' 
                  ? 'Get your professional profile link immediately and share it with patients.'
                  : (landingConfig?.hero?.step3Desc || 'احصل على رابط بروفايلك الاحترافي فوراً وشاركه مع مرضاك.')}
              </p>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}

