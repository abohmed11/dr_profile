/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, Tag, Image as ImageIcon, Globe, Building2, Sparkles, 
  CalendarCheck, Clock, CalendarDays, CheckCircle2, CalendarX, MessageSquare, Users, 
  Star, QrCode, MapPin, Share2, BadgeCheck, Award, 
  LayoutDashboard, Smartphone, Headphones, RefreshCw, ClipboardList, UserCog, Check
} from 'lucide-react';
import { LandingPageConfig } from '../types';
import { MedicalDeviceMockup } from './Subscription';
import { DEFAULT_FEATURES_AR, DEFAULT_FEATURES_EN, translateItemText } from '../lib/translations';

interface FeaturesProps {
  landingConfig?: LandingPageConfig;
  currentLang?: 'ar' | 'en';
  onNavigate?: (view: string) => void;
}

const getFeatureIcon = (text: string, index: number) => {
  if (!text) return CheckCircle2;
  const lower = text.toLowerCase();
  if (lower.includes('مؤهل') || lower.includes('علمي') || lower.includes('شهادة') || lower.includes('qualification') || lower.includes('degree') || lower.includes('bio')) return GraduationCap;
  if (lower.includes('سعر') || lower.includes('عرض') || lower.includes('عروض') || lower.includes('price') || lower.includes('offer')) return Tag;
  if (lower.includes('صور') || lower.includes('معرض') || lower.includes('gallery') || lower.includes('photo')) return ImageIcon;
  if (lower.includes('رابط') || lower.includes('دومين') || lower.includes('link') || lower.includes('web') || lower.includes('domain')) return Globe;
  if (lower.includes('فرع') || lower.includes('عياد') || lower.includes('موقع') || lower.includes('branch') || lower.includes('clinic')) return Building2;
  if (lower.includes('قالب') || lower.includes('قوالب') || lower.includes('تصميم') || lower.includes('template') || lower.includes('design')) return Sparkles;
  if (lower.includes('حجز') || lower.includes('booking') || lower.includes('ميعاد') || lower.includes('موعد')) return CalendarCheck;
  if (lower.includes('وقت') || lower.includes('ساعة') || lower.includes('جدول') || lower.includes('hours') || lower.includes('time') || lower.includes('schedule')) return Clock;
  if (lower.includes('إدارة') || lower.includes('تنظيم') || lower.includes('manage') || lower.includes('calendar')) return CalendarDays;
  if (lower.includes('تأكيد') || lower.includes('إلغاء') || lower.includes('confirm') || lower.includes('cancel')) return CheckCircle2;
  if (lower.includes('إجاز') || lower.includes('استثناء') || lower.includes('vacation') || lower.includes('holiday') || lower.includes('leave')) return CalendarX;
  if (lower.includes('واتساب') || lower.includes('whatsapp') || lower.includes('رسال') || lower.includes('chat')) return MessageSquare;
  if (lower.includes('سكرتار') || lower.includes('مساعد') || lower.includes('secretary') || lower.includes('staff') || lower.includes('assistant')) return Users;
  if (lower.includes('تقييم') || lower.includes('آراء') || lower.includes('review') || lower.includes('rating') || lower.includes('star')) return Star;
  if (lower.includes('qr') || lower.includes('باركود') || lower.includes('كود')) return QrCode;
  if (lower.includes('خريط') || lower.includes('خرائط') || lower.includes('map') || lower.includes('location')) return MapPin;
  if (lower.includes('سوشيال') || lower.includes('ميديا') || lower.includes('مشاركة') || lower.includes('share') || lower.includes('social')) return Share2;
  if (lower.includes('توثيق') || lower.includes('verify') || lower.includes('badge')) return BadgeCheck;
  if (lower.includes('لوحة') || lower.includes('dashboard') || lower.includes('control')) return LayoutDashboard;
  if (lower.includes('جهاز') || lower.includes('أجهزة') || lower.includes('موبايل') || lower.includes('device') || lower.includes('mobile') || lower.includes('phone')) return Smartphone;
  if (lower.includes('دعم') || lower.includes('فني') || lower.includes('support') || lower.includes('help')) return Headphones;
  if (lower.includes('تحديث') || lower.includes('تطوير') || lower.includes('update') || lower.includes('sync')) return RefreshCw;
  if (lower.includes('طلب') || lower.includes('طلبات') || lower.includes('list') || lower.includes('order')) return ClipboardList;
  if (lower.includes('بيانات') || lower.includes('بروفايل') || lower.includes('profile') || lower.includes('user')) return UserCog;
  
  const fallbackIcons = [CheckCircle2, Sparkles, Star, BadgeCheck, Award, Tag];
  return fallbackIcons[index % fallbackIcons.length];
};

export default function Features({ landingConfig, currentLang = 'ar', onNavigate }: FeaturesProps) {
  const isEn = currentLang === 'en';

  const defaultCategories = isEn ? DEFAULT_FEATURES_EN : DEFAULT_FEATURES_AR;

  const categories = (landingConfig?.features?.categories && landingConfig.features.categories.length > 0)
    ? (isEn
        ? landingConfig.features.categories.map((cat, idx) => ({
            ...cat,
            title: DEFAULT_FEATURES_EN[idx]?.title || cat.title,
            items: (cat.items || []).map((item) => translateItemText(item, true))
          }))
        : landingConfig.features.categories)
    : defaultCategories;

  const defaultFallbackImages = [
    'https://h.top4top.io/p_3874v0ld91.png',
    'https://e.top4top.io/p_38742udfi1.png',
    'https://i.top4top.io/p_3874myu051.png',
    'https://g.top4top.io/p_3874u8tug1.png'
  ];

  return (
    <section id="features" className="w-full pt-12 pb-16 bg-[#F4F8FC] scroll-mt-24 space-y-12 md:space-y-16" dir={isEn ? 'ltr' : 'rtl'}>
      {/* Page Main Header */}
      <div className="max-w-4xl mx-auto px-6 text-center pt-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl sm:text-3xl md:text-4xl font-black text-[#10244A] leading-tight mb-3"
        >
          {isEn
            ? 'Everything Your Profile Needs for Your Online Presence'
            : (landingConfig?.features?.title || 'كل ما يحتاجه بروفايلك لحضورك أونلاين')}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-base sm:text-lg text-black/70 font-semibold leading-relaxed max-w-2xl mx-auto"
        >
          {isEn
            ? 'Tools and features that help you present professionally, making it easy for your patients to reach and communicate with you.'
            : (landingConfig?.features?.subtitle || 'أدوات ومميزات تساعدك تظهر بشكل احترافي، وتسهّل على مرضاك الوصول إليك والتواصل معك.')}
        </motion.p>
      </div>

      {/* Dynamic Categories List */}
      {categories.map((cat, catIdx) => {
        const isEven = catIdx % 2 === 0;
        const imgUrl = cat.imageUrl || defaultFallbackImages[catIdx % defaultFallbackImages.length];
        const itemsList = cat.items || [];

        return (
          <div 
            key={cat.id || catIdx} 
            className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8"
          >
            {isEven ? (
              <>
                {/* Content Block */}
                <div className={`w-full md:w-[420px] lg:w-[460px] flex flex-col justify-center ${isEn ? 'text-left order-2 md:order-1' : 'text-right order-2 md:order-1'}`}>
                  <motion.h2 
                    initial={{ opacity: 0, x: isEn ? -60 : -60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xl sm:text-2xl font-black text-[#10244A] leading-snug tracking-tight mb-4 sm:mb-6"
                  >
                    {cat.title}
                  </motion.h2>

                  <motion.ul 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.35 }}
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.15,
                        }
                      }
                    }}
                    className="space-y-3.5 sm:space-y-4.5 my-auto"
                  >
                    {itemsList.map((itemText, itemIdx) => {
                      const IconComp = getFeatureIcon(itemText, itemIdx);
                      return (
                        <motion.li
                          key={itemIdx}
                          variants={{
                            hidden: { opacity: 0, x: isEn ? -60 : -60 },
                            visible: { 
                              opacity: 1, 
                              x: 0, 
                              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } 
                            }
                          }}
                          className="flex items-center justify-start gap-3 sm:gap-3.5"
                        >
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#E8F1FC] border border-[#CBDDF5] flex items-center justify-center shrink-0 shadow-sm">
                            <IconComp className="w-4 h-4 sm:w-5 sm:h-5 text-[#0051A8]" />
                          </div>
                          <span className="text-base sm:text-lg font-bold text-[#10244A] tracking-tight">
                            {itemText}
                          </span>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>

                {/* Image Block */}
                <motion.div 
                  initial={{ opacity: 0, x: isEn ? 60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full md:w-[420px] lg:w-[480px] flex justify-center ${isEn ? 'md:justify-end order-1 md:order-2' : 'md:justify-end order-1 md:order-2'} items-center shrink-0`}
                >
                  <img 
                    src={imgUrl} 
                    alt={cat.title || `Features ${catIdx + 1}`} 
                    className="w-full max-w-sm md:max-w-[420px] lg:max-w-[480px] h-auto object-contain rounded-xl transition-transform" 
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
              </>
            ) : (
              <>
                {/* Image Block */}
                <motion.div 
                  initial={{ opacity: 0, x: isEn ? -60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className={`w-full md:w-[420px] lg:w-[480px] flex justify-center ${isEn ? 'md:justify-start order-1 md:order-1' : 'md:justify-start order-1 md:order-1'} items-center shrink-0`}
                >
                  <img 
                    src={imgUrl} 
                    alt={cat.title || `Features ${catIdx + 1}`} 
                    className="w-full max-w-sm md:max-w-[420px] lg:max-w-[480px] h-auto object-contain rounded-xl transition-transform" 
                    referrerPolicy="no-referrer"
                  />
                </motion.div>
                
                {/* Content Block */}
                <div className={`w-full md:w-[420px] lg:w-[460px] flex flex-col justify-center ${isEn ? 'text-left order-2 md:order-2' : 'text-right order-2 md:order-2'}`}>
                  <motion.h2 
                    initial={{ opacity: 0, x: isEn ? 60 : 60 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                    className="text-xl sm:text-2xl font-black text-[#10244A] leading-snug tracking-tight mb-4 sm:mb-6"
                  >
                    {cat.title}
                  </motion.h2>

                  <motion.ul 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.35 }}
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.15,
                        }
                      }
                    }}
                    className="space-y-3.5 sm:space-y-4.5 my-auto"
                  >
                    {itemsList.map((itemText, itemIdx) => {
                      const IconComp = getFeatureIcon(itemText, itemIdx);
                      return (
                        <motion.li
                          key={itemIdx}
                          variants={{
                            hidden: { opacity: 0, x: isEn ? 60 : 60 },
                            visible: { 
                              opacity: 1, 
                              x: 0, 
                              transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } 
                            }
                          }}
                          className="flex items-center justify-start gap-3 sm:gap-3.5"
                        >
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-[#E8F1FC] border border-[#CBDDF5] flex items-center justify-center shrink-0 shadow-sm">
                            <IconComp className="w-4 h-4 sm:w-5 sm:h-5 text-[#0051A8]" />
                          </div>
                          <span className="text-base sm:text-lg font-bold text-[#10244A] tracking-tight">
                            {itemText}
                          </span>
                        </motion.li>
                      );
                    })}
                  </motion.ul>
                </div>
              </>
            )}
          </div>
        );
      })}

      {/* Bottom Banner Card in Features Section */}
      <div className="max-w-6xl mx-auto px-6 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-xl flex flex-col-reverse lg:flex-row items-center justify-between gap-6 lg:gap-10 rounded-xl sm:rounded-2xl border border-blue-800/40"
        >
          {/* Text & Action Column */}
          <div className={`flex-1 ${isEn ? 'text-left' : 'text-right'} z-10 max-w-2xl`}>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug tracking-tight text-white select-text">
              {isEn 
                ? 'Everything you need to showcase your medical services online in one place' 
                : (landingConfig?.features?.bottomBannerTitle || 'كل اللي محتاجه علشان تعرض خدماتك الطبية أونلاين في مكان واحد')}
            </h3>

            <div className="mt-5 sm:mt-6">
              <button
                type="button"
                onClick={() => {
                  if (onNavigate) {
                    onNavigate('subscription');
                  } else {
                    const el = document.getElementById('subscription');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.location.hash = '#subscription';
                    }
                  }
                }}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 active:scale-98 text-[#003B7A] font-black text-xs sm:text-sm px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <svg viewBox="0 0 24 24" className={`w-4 h-4 text-[#003B7A] fill-none stroke-current stroke-[2.5] transform ${isEn ? 'group-hover:translate-x-1 rotate-180' : 'group-hover:-translate-x-1'} transition-transform`}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>{isEn ? 'Pricing' : (landingConfig?.features?.bottomBannerButtonText || 'الأسعار')}</span>
              </button>
            </div>
          </div>

          {/* Mockup Graphic Column */}
          <div className="w-full lg:w-auto flex justify-center z-10">
            <MedicalDeviceMockup />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

