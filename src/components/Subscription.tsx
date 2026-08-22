/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Contact, CalendarCheck, Clock, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { LandingPageConfig } from '../types';
import FAQ from './FAQ';
import CtaBanner from './CtaBanner';

interface SubscriptionProps {
  onStart: (plan: '5months' | '1year') => void;
  onNavigate?: (view: string) => void;
  landingConfig?: LandingPageConfig;
  currentLang?: 'ar' | 'en';
  showOverview?: boolean;
  showPricing?: boolean;
}

// Custom Premium Checked Icon matching the design
const CheckIcon = () => (
  <span className="w-5 h-5 bg-[#0051A8] rounded-full flex items-center justify-center shrink-0 shadow-sm mt-0.5">
    <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-none stroke-current stroke-[3.5]">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </span>
);

const CrossIcon = () => (
  <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0 shadow-sm">
    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-red-600 fill-none stroke-current stroke-[3.5]">
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  </span>
);

// Medical Device Mockup Component matching the prompt image - Redesigned sleek 3D style
export const MedicalDeviceMockup = () => (
  <div className="relative w-full max-w-[480px] lg:max-w-[540px] aspect-[16/10] flex items-center justify-center select-none pointer-events-none">
    {/* Soft background blue blur blob */}
    <div className="absolute inset-0 bg-gradient-to-tr from-[#38BDF8]/40 via-[#3B82F6]/50 to-[#60A5FA]/30 rounded-[50%] blur-3xl transform scale-110 rotate-12" />

    {/* SVG Graphic with pixel-perfect modern 3D style */}
    <svg viewBox="0 0 600 380" className="w-full h-full relative z-10 overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background glowing particles & rings */}
      <circle cx="300" cy="190" r="170" fill="url(#bg-glow)" opacity="0.6" />
      
      {/* Main Glass Tablet Device Frame */}
      <g id="main-tablet" transform="translate(90, 30)">
        {/* Soft Shadow underneath */}
        <ellipse cx="210" cy="285" rx="220" ry="18" fill="#030712" fillOpacity="0.25" filter="blur(8px)" />

        {/* Outer Metallic Bezel */}
        <rect x="0" y="0" width="420" height="270" rx="28" fill="url(#device-body)" stroke="#64748B" strokeWidth="2.5" />
        
        {/* Screen Bezel Inner Border */}
        <rect x="8" y="8" width="404" height="254" rx="22" fill="#0B132B" />

        {/* Front Camera Dot */}
        <circle cx="210" cy="18" r="3" fill="#334155" />
        <circle cx="210" cy="18" r="1.5" fill="#38BDF8" />

        {/* Display Glass Canvas */}
        <rect x="16" y="28" width="388" height="226" rx="16" fill="#F8FAFC" />

        {/* Top App Header Bar */}
        <rect x="16" y="28" width="388" height="38" rx="16" fill="url(#app-bar-grad)" />
        <rect x="16" y="50" width="388" height="16" fill="#0051A8" />
        
        {/* Medical Cross Logo in Header */}
        <rect x="32" y="38" width="18" height="18" rx="5" fill="#FFFFFF" />
        <path d="M41 41v12M35 47h12" stroke="#0051A8" strokeWidth="2.8" strokeLinecap="round" />
        
        {/* Header Text / Brand */}
        <rect x="58" y="42" width="90" height="10" rx="5" fill="#FFFFFF" fillOpacity="0.9" />

        {/* Status Dot + 'متاح للحجز' Badge */}
        <rect x="290" y="38" width="96" height="18" rx="9" fill="#10B981" fillOpacity="0.2" stroke="#10B981" strokeWidth="1" />
        <circle cx="302" cy="47" r="3.5" fill="#10B981" />
        <rect x="312" y="44" width="62" height="6" rx="3" fill="#10B981" />

        {/* Main Profile Header Inside Display */}
        <rect x="28" y="76" width="364" height="82" rx="14" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        
        {/* Doctor Avatar with Medical Ring */}
        <circle cx="70" cy="117" r="28" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
        {/* Stethoscope Silhouette Avatar */}
        <path d="M 70 102 C 63 102 58 107 58 114 C 58 121 63 126 70 126 C 77 126 82 121 82 114 C 82 107 77 102 70 102 Z" fill="#0284C7" />
        <path d="M 54 135 C 54 125 61 123 70 123 C 79 123 86 125 86 135 L 86 140 L 54 140 Z" fill="#0369A1" />
        {/* Verified Badge Icon */}
        <circle cx="88" cy="133" r="8" fill="#0EA5E9" />
        <path d="M84.5 133l2.5 2.5 5-5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {/* Doctor Info Placeholders */}
        <rect x="110" y="92" width="140" height="10" rx="5" fill="#0F172A" />
        <rect x="110" y="108" width="110" height="7" rx="3.5" fill="#64748B" />
        <rect x="110" y="122" width="160" height="6" rx="3" fill="#94A3B8" />

        {/* Rating Box */}
        <rect x="296" y="92" width="80" height="50" rx="10" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="1" />
        <text x="336" y="112" textAnchor="middle" fill="#0369A1" fontSize="13" fontWeight="900">5.0 ★</text>
        <text x="336" y="128" textAnchor="middle" fill="#0284C7" fontSize="9" fontWeight="700">1000+ مريض</text>

        {/* 2 Feature Shortcut Cards */}
        {/* Card A: Booking Calendar */}
        <rect x="28" y="168" width="176" height="72" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="56" cy="204" r="18" fill="#EFF6FF" />
        <rect x="46" y="194" width="20" height="20" rx="4" fill="#2563EB" />
        <path d="M50 198h12M50 203h12M50 208h8" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        <rect x="84" y="192" width="100" height="8" rx="4" fill="#1E293B" />
        <rect x="84" y="206" width="70" height="6" rx="3" fill="#3B82F6" />

        {/* Card B: E-Prescription */}
        <rect x="216" y="168" width="176" height="72" rx="12" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="1" />
        <circle cx="244" cy="204" r="18" fill="#ECFDF5" />
        <circle cx="244" cy="204" r="12" fill="#10B981" />
        <path d="M240 204h8M244 200v8" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
        <rect x="272" y="192" width="100" height="8" rx="4" fill="#1E293B" />
        <rect x="272" y="206" width="70" height="6" rx="3" fill="#10B981" />
      </g>

      {/* FLOATING WIDGET 1: Modern 3D Stethoscope / Medical Seal (Top Left) */}
      <g id="floating-seal" transform="translate(35, 20)">
        <ellipse cx="45" cy="45" rx="42" ry="42" fill="#FFFFFF" fillOpacity="0.9" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="45" cy="45" r="34" fill="url(#seal-grad)" />
        {/* Stethoscope / Caduceus White Icon */}
        <path d="M45 23v20M35 28h20M35 34c0 6 4.5 11 10 11s10-5 10-11" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <circle cx="35" cy="28" r="3" fill="#FFFFFF" />
        <circle cx="55" cy="28" r="3" fill="#FFFFFF" />
        <circle cx="45" cy="57" r="5" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
      </g>

      {/* FLOATING WIDGET 2: Success Booking Alert Card (Bottom Right) */}
      <g id="floating-alert" transform="translate(360, 240)">
        <rect x="0" y="0" width="205" height="68" rx="16" fill="#0F172A" fillOpacity="0.92" stroke="#334155" strokeWidth="1.5" />
        <circle cx="32" cy="34" r="16" fill="#10B981" />
        <path d="M25 34l5 5 10-10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <text x="58" y="30" fill="#FFFFFF" fontSize="11" fontWeight="800">تم حجز الموعد بنجاح</text>
        <text x="58" y="46" fill="#94A3B8" fontSize="9" fontWeight="600">عيادة دكتور أونلاين ⚡</text>
      </g>

      {/* FLOATING WIDGET 3: QR Code Medical Card (Bottom Left) */}
      <g id="floating-qr" transform="translate(25, 225)">
        <rect x="0" y="0" width="100" height="90" rx="14" fill="url(#qr-card-grad)" stroke="#60A5FA" strokeWidth="1.5" />
        {/* Mini QR Grid mockup */}
        <rect x="12" y="12" width="34" height="34" rx="6" fill="#FFFFFF" />
        <rect x="16" y="16" width="10" height="10" fill="#0051A8" />
        <rect x="32" y="16" width="10" height="10" fill="#0051A8" />
        <rect x="16" y="32" width="10" height="10" fill="#0051A8" />
        <rect x="28" y="28" width="6" height="6" fill="#0051A8" />
        {/* Prescription lines */}
        <line x1="54" y1="18" x2="88" y2="18" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
        <line x1="54" y1="28" x2="82" y2="28" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
        <line x1="54" y1="36" x2="76" y2="36" stroke="#FFFFFF" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
        <rect x="12" y="56" width="76" height="20" rx="6" fill="#FFFFFF" fillOpacity="0.2" />
        <text x="50" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontWeight="800">Rx MEDICAL</text>
      </g>

      <defs>
        <radialGradient id="bg-glow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="device-body" x1="0" y1="0" x2="420" y2="270" gradientUnits="userSpaceOnUse">
          <stop stopColor="#334155" />
          <stop offset="1" stopColor="#0F172A" />
        </linearGradient>
        <linearGradient id="app-bar-grad" x1="16" y1="28" x2="404" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#003B7A" />
          <stop offset="1" stopColor="#0051A8" />
        </linearGradient>
        <linearGradient id="seal-grad" x1="11" y1="11" x2="79" y2="79" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="qr-card-grad" x1="0" y1="0" x2="100" y2="90" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0051A8" />
          <stop offset="1" stopColor="#0284C7" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

export default function Subscription({ 
  onStart, 
  onNavigate, 
  landingConfig, 
  currentLang = 'ar',
  showOverview = true,
  showPricing = true
}: SubscriptionProps) {
  const sectionTitle = currentLang === 'en'
    ? 'Subscription Plans'
    : (landingConfig?.pricing?.title && landingConfig.pricing.title !== "باقات الاشتراك"
        ? landingConfig.pricing.title
        : "الباقات والأسعار");

  const sectionSubtitle = currentLang === 'en'
    ? 'Pay once and get your medical profile for a full year'
    : (landingConfig?.pricing?.subtitle && landingConfig.pricing.subtitle !== "اختر الباقة المناسبة لتفعيل بروفايلك الطبي"
        ? landingConfig.pricing.subtitle
        : "ادفع مرة واحدة واحصل على بروفايلك الطبي لمدة عام كامل");

  const ctaBtnText = currentLang === 'en'
    ? 'Subscribe Now'
    : ((landingConfig?.pricing?.ctaText === 'اشترك الآن' ? 'ابدأ الآن مجاناً' : landingConfig?.pricing?.ctaText) || 'ابدأ الآن مجاناً');

  const plan5Months = currentLang === 'en'
    ? {
        title: "6 Months Subscription",
        price: "1500",
        period: "EGP / 6 Months",
        discountText: "Special Offer",
        features: [
          "Medical Profile",
          "Custom Link",
          "Multiple Templates",
          "Bio & Qualifications",
          "Specialties & Services",
          "Service Pricing",
          "Clinic Photos",
          "Videos",
          "Working Hours",
          "Clinic Location",
          "Social Media",
          "Book Appointments",
          "Patient Reviews",
          "Multiple Secretaries",
          "Professional Dashboard",
          "Responsive Design",
          "Technical Support",
          "Free Updates"
        ]
      }
    : (landingConfig?.pricing?.plan5Months || {
        title: "اشتراك لمدة 6 أشهر",
        price: "1500",
        period: "ج.م / 6 أشهر",
        discountText: "عرض خاص",
        features: [
          "بروفايل طبي",
          "رابط خاص",
          "قوالب متعددة",
          "نبذة ومؤهلات",
          "تخصص وخدمات",
          "أسعار الخدمات",
          "صور العيادة",
          "فيديوهات",
          "مواعيد العمل",
          "لوكيشن العيادة",
          "سوشيال ميديا",
          "حجز مواعيد",
          "تقييمات المرضى",
          "اضافة سكرتارية متعددة",
          "لوحة تحكم احترافية",
          "متوافق مع الأجهزة",
          "دعم فني",
          "تحديثات مجانية"
        ]
      });

  const plan1YearRaw = currentLang === 'en'
    ? {
        title: "1 Year Subscription (Best Value)",
        price: "2500",
        period: "EGP / 1 Year",
        discountText: "",
        features: [
          "Medical Profile",
          "Custom Link",
          "Multiple Templates",
          "Bio & Qualifications",
          "Specialties & Services",
          "Service Pricing",
          "Clinic Photos",
          "Videos",
          "Working Hours",
          "Clinic Location",
          "Social Media",
          "Book Appointments",
          "Patient Reviews",
          "Multiple Secretaries",
          "Professional Dashboard",
          "Responsive Design",
          "Technical Support",
          "Free Updates"
        ]
      }
    : (landingConfig?.pricing?.plan1Year || {
        title: "اشتراك لمدة سنة",
        price: "2500",
        period: "ج.م / سنة",
        discountText: "",
        features: [
          "بروفايل طبي",
          "رابط خاص",
          "قوالب متعددة",
          "نبذة ومؤهلات",
          "تخصص وخدمات",
          "أسعار الخدمات",
          "صور العيادة",
          "فيديوهات",
          "مواعيد العمل",
          "لوكيشن العيادة",
          "سوشيال ميديا",
          "حجز مواعيد",
          "تقييمات المرضى",
          "اضافة سكرتارية متعددة",
          "لوحة تحكم احترافية",
          "متوافق مع الأجهزة",
          "دعم فني",
          "تحديثات مجانية"
        ]
      });

  const plan1Year = {
    ...plan1YearRaw,
    title: plan1YearRaw.title.replace(/\s*\(العرض الأوفر\)/g, "")
  };

  return (
    <section className={`w-full py-16 md:py-20 ${showPricing ? 'bg-[#F4F8FC]' : 'bg-white'} border-t border-neutral-100/70`} dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Overview Section Above "باقات الاشتراك" */}
        {showOverview && (
          <>
            {/* Two Framed Images Side by Side */}
            <div className="w-full max-w-6xl mx-auto mb-16 md:mb-20">
              {/* Main Title Above Two Framed Images */}
              <div className="text-center mb-8 md:mb-10">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#10244A] tracking-tight leading-snug select-text">
                  {currentLang === 'en' 
                    ? (landingConfig?.overview?.mainTitle && landingConfig.overview.mainTitle !== 'كل ما يحتاجه ملفك الطبي للحضور أونلاين' ? landingConfig.overview.mainTitle : 'Everything Your Medical Profile Needs to be Present Online') 
                    : (landingConfig?.overview?.mainTitle || 'كل ما يحتاجه ملفك الطبي للحضور أونلاين')}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch">
                {/* Right Image */}
                <div className="w-full bg-white p-4 md:p-6 rounded-2xl border-2 border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
                  <div className={`mb-4 ${currentLang === 'en' ? 'text-left' : 'text-right'}`}>
                    <h3 className="text-xl sm:text-2xl font-black text-[#10244A] mb-2 select-text">
                      {currentLang === 'en' ? 'Organized Bookings & Easier Experience' : (landingConfig?.overview?.rightTitle || 'حجوزات منظمة وتجربة أسهل')}
                    </h3>
                    <p className="text-sm sm:text-base text-black/75 font-semibold leading-relaxed select-text">
                      {currentLang === 'en'
                        ? 'Organize your clinic appointments and receive booking requests from your patients easily, with defined working hours and flexible timing for each booking.'
                        : (landingConfig?.overview?.rightSubtitle || 'نظّم مواعيد عياداتك واستقبل طلبات الحجز من مرضاك بسهولة، مع تحديد مواعيد العمل والوقت المناسب لكل حجز.')}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-col items-center">
                    <img 
                      src={landingConfig?.overview?.rightImage || "https://j.top4top.io/p_3875xod3p1.png"} 
                      alt="Clinic & Services Preview" 
                      className="w-full h-auto object-contain rounded-xl mb-4"
                      referrerPolicy="no-referrer"
                    />
                    <div className="w-full flex justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (onStart) {
                            onStart('1year');
                          }
                          const el = document.getElementById('register-section');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                          } else if (onNavigate) {
                            onNavigate('landing');
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 px-8 py-2.5 sm:py-3 border-2 border-[#0051A8] text-[#0051A8] hover:bg-[#0051A8] hover:text-white font-black text-sm sm:text-base rounded-xl shadow-xs transition-all duration-200 cursor-pointer active:scale-98"
                      >
                        <span>{currentLang === 'en' ? 'Start Free Now' : (landingConfig?.overview?.rightButtonText || 'ابدأ الآن مجاناً')}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Left Image */}
                <div className="w-full bg-white p-4 md:p-6 rounded-2xl border-2 border-neutral-200/80 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between">
                  <div className={`mb-4 ${currentLang === 'en' ? 'text-left' : 'text-right'}`}>
                    <h3 className="text-xl sm:text-2xl font-black text-[#10244A] mb-2 select-text">
                      {currentLang === 'en' ? 'Responsive on Any Device' : (landingConfig?.overview?.leftTitle || 'متناسق على أي جهاز')}
                    </h3>
                    <p className="text-sm sm:text-base text-black/75 font-semibold leading-relaxed select-text">
                      {currentLang === 'en'
                        ? 'A medical profile that automatically adapts to different devices, making your profile look professional and distinct on any screen'
                        : (landingConfig?.overview?.leftSubtitle || 'ملف طبي متجاوب تلقائيًا مع مختلف الأجهزة، ليظهر بروفايلك بشكل احترافي ومميز على أي جهاز')}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-col items-center">
                    <img 
                      src={landingConfig?.overview?.leftImage || "https://j.top4top.io/p_387540zrh1.png"} 
                      alt="Profile Preview" 
                      className="w-full h-auto object-contain rounded-xl mb-4"
                      referrerPolicy="no-referrer"
                    />
                    <div className="w-full flex justify-center pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (onStart) {
                            onStart('1year');
                          }
                          const el = document.getElementById('register-section');
                          if (el) {
                            el.scrollIntoView({ behavior: 'smooth' });
                          } else if (onNavigate) {
                            onNavigate('landing');
                          }
                        }}
                        className="inline-flex items-center justify-center gap-2 px-8 py-2.5 sm:py-3 border-2 border-[#0051A8] text-[#0051A8] hover:bg-[#0051A8] hover:text-white font-black text-sm sm:text-base rounded-xl shadow-xs transition-all duration-200 cursor-pointer active:scale-98"
                      >
                        <span>{currentLang === 'en' ? 'Start Free Now' : (landingConfig?.overview?.leftButtonText || 'ابدأ الآن مجاناً')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Control Everything Feature Block */}
            <div id="overview-section" className={`w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 scroll-mt-24 ${showPricing ? 'mb-12' : 'mb-4'}`}>
              {/* Text Content */}
              <div className={`flex-1 ${currentLang === 'en' ? 'text-left' : 'text-right'} space-y-4 md:space-y-5 z-10`}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#10244A] leading-tight select-text">
                  {currentLang === 'en'
                    ? 'Control Everything'
                    : (landingConfig?.overview?.controlTitle || 'تحكم في كل شيء')}
                </h2>

                {/* List of features */}
                <div className="pt-2 space-y-3.5">
                  {[
                    { text: currentLang === 'en' ? "Manage your medical profile easily" : (landingConfig?.overview?.controlFeature1 || "إدارة ملفك الطبي بسهولة"), icon: Contact },
                    { text: currentLang === 'en' ? "Receive and organize booking requests" : (landingConfig?.overview?.controlFeature2 || "استقبال وتنظيم طلبات الحجز"), icon: CalendarCheck },
                    { text: currentLang === 'en' ? "Organize your schedule and working hours" : (landingConfig?.overview?.controlFeature3 || "تنظيم مواعيدك وساعات العمل"), icon: Clock },
                    { text: currentLang === 'en' ? "Manage clinic photos and services" : (landingConfig?.overview?.controlFeature4 || "إدارة صور وخدمات عيادتك"), icon: ImageIcon }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3.5 sm:gap-4 group">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#0051A8]/10 border border-[#0051A8]/20 flex items-center justify-center text-[#0051A8] shrink-0 shadow-xs">
                        <item.icon className="w-5 h-5 stroke-[2.2]" />
                      </div>
                      <span className="text-base sm:text-lg font-bold text-[#10244A] select-text tracking-tight leading-snug">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Button to Features Section */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('features');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      } else if (onNavigate) {
                        onNavigate('features');
                      } else {
                        window.location.href = '/features';
                      }
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 bg-[#003B7A] hover:bg-[#002d5e] text-white font-bold text-sm sm:text-base rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer active:scale-98"
                  >
                    <span>{currentLang === 'en' ? 'Discover Features' : (landingConfig?.overview?.controlButtonText || 'اكتشف المميزات')}</span>
                    <ArrowLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
                  </button>
                </div>
              </div>

              {/* Image (Enlarged and aligned with the text block) */}
              <div className="flex-1 md:flex-[1.4] flex justify-center md:justify-start w-full">
                <img 
                  src={landingConfig?.overview?.controlImage || "https://a.top4top.io/p_3874614ld1.png"} 
                  alt="Control Dashboard" 
                  className="w-full h-auto max-w-2xl sm:max-w-3xl lg:max-w-4xl object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </>
        )}

        {/* Pricing Section Starting From "باقات الاشتراك" */}
        {showPricing && (
          <>
            {/* Section Heading */}
            <div className="flex flex-col items-center text-center mb-10 pt-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#10244A] tracking-wide leading-tight select-text">
                {sectionTitle}
              </h2>
              <div className="h-1 w-20 bg-[#10244A] rounded-full mt-3" />
              <p className="text-black font-semibold opacity-70 text-sm md:text-base mt-3 max-w-2xl leading-relaxed select-text">
                {sectionSubtitle}
              </p>
            </div>

            {/* Two Pricing Cards */}
            <div id="subscription" className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch scroll-mt-32">
              
              {/* Plan 5 Months */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
                className="relative w-full bg-white border-2 border-neutral-200 rounded-3xl p-8 shadow-lg flex flex-col justify-between group hover:border-[#0051A8]/50 transition-colors"
              >
                {plan5Months.discountText && (
                  <div className="absolute top-0 right-0 bg-blue-100 text-blue-800 text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-bl-xl rounded-tr-[22px]">
                    {plan5Months.discountText}
                  </div>
                )}
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#10244A] mb-2">{plan5Months.title}</h3>
                  <div className="my-6">
                    <span className="text-4xl sm:text-5xl font-black text-[#0051A8]">{plan5Months.price}</span>
                    <span className="text-sm font-bold text-neutral-500 mr-2">{plan5Months.period}</span>
                  </div>
                  <ul className={`grid grid-cols-2 gap-x-3 gap-y-2.5 mb-8 ${currentLang === 'en' ? 'text-left' : 'text-right'}`}>
                    {plan5Months.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[13px] sm:text-sm font-bold text-neutral-700">
                        <CheckIcon />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => onStart('5months')}
                  className="w-full py-3.5 bg-neutral-100 hover:bg-[#0051A8] text-[#10244A] hover:text-white font-black rounded-xl transition-colors duration-300"
                >
                  {ctaBtnText}
                </button>
              </motion.div>

              {/* Plan 1 Year (Highlighted) */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="relative w-full bg-[#0051A8] border-2 border-[#0051A8] rounded-3xl p-8 shadow-xl flex flex-col justify-between transform md:-translate-y-4 group"
              >
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs sm:text-sm font-black px-6 py-1.5 rounded-full shadow-md whitespace-nowrap">
                  {currentLang === 'en' ? 'Most Popular' : 'الأكثر طلباً'}
                </div>
                {plan1Year.discountText && (
                  <div className="absolute top-0 right-0 bg-white/20 text-white text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-bl-xl rounded-tr-[22px]">
                    {plan1Year.discountText}
                  </div>
                )}
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-2 mt-2">{plan1Year.title}</h3>
                  <div className="my-6 text-white">
                    <span className="text-4xl sm:text-5xl font-black">{plan1Year.price}</span>
                    <span className="text-sm font-bold text-blue-200 mr-2">{plan1Year.period}</span>
                  </div>
                  <ul className={`grid grid-cols-2 gap-x-3 gap-y-2.5 mb-8 ${currentLang === 'en' ? 'text-left' : 'text-right'}`}>
                    {plan1Year.features.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[13px] sm:text-sm font-bold text-white/90">
                        <span className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <svg viewBox="0 0 24 24" className="w-3 h-3 text-white fill-none stroke-current stroke-[3]">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => onStart('1year')}
                  className="w-full py-3.5 bg-white hover:bg-neutral-100 text-[#0051A8] font-black rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform active:scale-95"
                >
                  {ctaBtnText}
                </button>
              </motion.div>
            </div>

            {/* FAQ Section in Pricing */}
            <div className="mt-16 sm:mt-24 pt-8 -mx-6">
              <FAQ landingConfig={landingConfig} currentLang={currentLang} onNavigate={onNavigate} />
            </div>

            {/* Bottom Banner below FAQ Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="w-full mt-14 sm:mt-18 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-xl flex flex-col-reverse lg:flex-row items-center justify-between gap-6 lg:gap-10 rounded-xl sm:rounded-2xl border border-blue-800/40"
            >
              {/* Text & Action Column */}
              <div className="flex-1 text-right z-10 max-w-2xl">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug tracking-tight text-white select-text">
                  {currentLang === 'en' 
                    ? 'Everything you need to showcase your medical services online in one place' 
                    : (landingConfig?.pricing?.bottomBannerTitle || 'كل اللي محتاجه علشان تعرض خدماتك الطبية أونلاين في مكان واحد')}
                </h3>

                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      if (onStart) {
                        onStart('1year');
                      } else {
                        const el = document.getElementById('register-section') || document.getElementById('subscription');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }
                    }}
                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 active:scale-98 text-[#003B7A] font-black text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#003B7A] fill-none stroke-current stroke-[2.5] transform group-hover:-translate-x-1 transition-transform">
                      <polyline points="15 18 9 12 15 6" />
                    </svg>
                    <span>
                      {currentLang === 'en' 
                        ? 'Subscribe Now' 
                        : (landingConfig?.pricing?.bottomBannerButtonText || 'ابدأ الآن مجاناً')}
                    </span>
                  </button>
                </div>
              </div>

              {/* Mockup Graphic Column */}
              <div className="w-full lg:w-auto flex justify-center z-10">
                <MedicalDeviceMockup />
              </div>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}
