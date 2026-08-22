import React from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';
import { MedicalDeviceMockup } from './Subscription';
import { LandingPageConfig } from '../types';

interface CtaBannerProps {
  landingConfig?: LandingPageConfig;
  currentLang?: 'ar' | 'en';
  onNavigate?: (view: string) => void;
}

export default function CtaBanner({ landingConfig, currentLang = 'ar', onNavigate }: CtaBannerProps) {
  const isEn = currentLang === 'en';

  const title = isEn 
    ? (landingConfig?.ctaBanner?.title && landingConfig.ctaBanner.title !== 'جاهز لإنشاء بروفايلك الطبي؟' ? landingConfig.ctaBanner.title : 'Ready to create your medical profile?')
    : (landingConfig?.ctaBanner?.title || 'جاهز لإنشاء بروفايلك الطبي؟');

  const subtitle = isEn
    ? (landingConfig?.ctaBanner?.subtitle && !landingConfig.ctaBanner.subtitle.includes('انضم إلى مئات الأطباء') ? landingConfig.ctaBanner.subtitle : 'Join hundreds of doctors who own professional profiles now. Fast and easy, and does not require any technical experience.')
    : (landingConfig?.ctaBanner?.subtitle || 'انضم إلى مئات الأطباء الذين يملكون بروفايلات احترافية الآن\nسريع وسهل ولا يتطلب أي خبرة تقنية');

  const primaryBtn = isEn
    ? (landingConfig?.ctaBanner?.primaryButtonText && landingConfig.ctaBanner.primaryButtonText !== 'ابدأ الآن مجاناً' ? landingConfig.ctaBanner.primaryButtonText : 'Subscribe Now')
    : (landingConfig?.ctaBanner?.primaryButtonText || 'ابدأ الآن مجاناً');

  const secondaryBtn = isEn
    ? (landingConfig?.ctaBanner?.secondaryButtonText && landingConfig.ctaBanner.secondaryButtonText !== 'لديك حساب؟ سجّل الدخول' ? landingConfig.ctaBanner.secondaryButtonText : 'Have an account? Log in')
    : (landingConfig?.ctaBanner?.secondaryButtonText || 'لديك حساب؟ سجّل الدخول');

  return (
    <section className="w-full py-8 sm:py-12 bg-white relative overflow-hidden" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="w-full bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-xl flex flex-col-reverse lg:flex-row items-center justify-between gap-6 lg:gap-10 rounded-xl sm:rounded-2xl border border-blue-800/40"
        >
          {/* Text & Action Column */}
          <div className={`flex-1 ${isEn ? 'text-left' : 'text-right'} z-10 max-w-2xl`}>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black leading-snug tracking-tight text-white select-text mb-3 sm:mb-4">
              {title}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-blue-100 font-bold leading-relaxed mb-6 sm:mb-7 opacity-95 whitespace-pre-line">
              {subtitle}
            </p>

            {/* Buttons Action Area */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {/* Primary Button: Subscribe Now */}
              <button
                type="button"
                onClick={() => onNavigate?.('create')}
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 active:scale-98 text-[#003B7A] font-black text-xs sm:text-sm px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <svg viewBox="0 0 24 24" className={`w-4 h-4 text-[#003B7A] fill-none stroke-current stroke-[2.5] transform transition-transform ${isEn ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                <span>{primaryBtn}</span>
              </button>

              {/* Secondary Button: Login */}
              <button
                type="button"
                onClick={() => onNavigate?.('login')}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-extrabold text-xs sm:text-sm px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl backdrop-blur-xs transition-all duration-200 cursor-pointer active:scale-98"
              >
                <User className="w-4 h-4 text-white shrink-0" />
                <span>{secondaryBtn}</span>
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

