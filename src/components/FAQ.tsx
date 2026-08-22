/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LandingPageConfig } from '../types';

interface FAQProps {
  landingConfig?: LandingPageConfig;
  currentLang?: 'ar' | 'en';
  showInlineContact?: boolean;
  onNavigate?: (view: string) => void;
}

export default function FAQ({ landingConfig, currentLang = 'ar', showInlineContact = false, onNavigate }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [showContactInput, setShowContactInput] = useState(false);
  const [contactMessage, setContactMessage] = useState('');

  const title = currentLang === 'en'
    ? 'Frequently Asked Questions'
    : (landingConfig?.faq?.title || "أسئلة متكررة");

  const subtitle = currentLang === 'en'
    ? 'Answers to the most common questions about the platform and how it works'
    : (landingConfig?.faq?.subtitle || "إجابات عن أهم الاستفسارات المتكررة حول المنصة وطريقة العمل");

  const defaultAr = [
    { id: 'f1', question: 'هل يوجد عمولة على الحجوزات؟', answer: 'لا توجد أي عمولات على الحجوزات نهائياً' },
    { id: 'f2', question: 'هل أقدر أضيف أكثر من عيادة؟', answer: 'نعم، يمكنك إضافة وإدارة عدة عيادات وفروع في بروفايلك الطبي مع تحديد مواعيد العمل والعناوين وأرقام التواصل لكل فرع بسهولة.' },
    { id: 'f3', question: 'هل أقدر أضيف سكرتارية؟', answer: 'نعم، توفر المنصة نظام إدارة السكرتارية يتيح لك إضافة سكرتارية ومساعدين وتحديد صلاحياتهم لمتابعة وتنظيم الحجوزات والمواعيد.' },
    { id: 'f4', question: 'هل البروفايل له رابط خاص؟', answer: 'نعم، يحصل كل طبيب على رابط بروفايل خاص ومستقل ومباشر يمكنك مشاركته على منصات التواصل الاجتماعي وفي بطاقات العيادة.' },
    { id: 'f5', question: 'هل أقدر أعدل بياناتي بعد الاشتراك؟', answer: 'نعم، يمكنك تعديل وتحديث كافة بياناتك (الخدمات، الأسعار، العناوين، مواعيد العمل، الصور) في أي وقت ومن أي مكان عبر لوحة التحكم.' },
    { id: 'f6', question: 'هل يعمل على الموبايل؟', answer: 'نعم، المنصة والبروفايل الطبي مصممة بالكامل لتكون متوافقة وسريعة وسلسة جداً على جميع أجهزة الموبايل والتابلت والكمبيوتر.' },
    { id: 'f7', question: 'هل يوجد دعم فني؟', answer: 'نعم، فريق الدعم الفني متواجد دائماً لمساعدتك والإجابة على كافة استفساراتك عبر الواتساب والبريد الإلكتروني.' },
    { id: 'f8', question: 'هل البروفايل يوجد في قوالب والوان مختلفة؟', answer: 'نعم، المنصة توفر قوالب وتصاميم وألوان متعددة لتتناسب مع هويتك وتخصصك الطبي، ويمكنك التبديل بينها بسهولة من خلال لوحة التحكم الخاصة بك.' }
  ];

  const defaultEn = [
    { id: 'f1', question: 'Is there any commission on bookings?', answer: 'No, there are zero commissions on bookings (0% commission). All booking payments go directly to the doctor or clinic.' },
    { id: 'f2', question: 'Can I add multiple clinics or branches?', answer: 'Yes, you can easily add and manage multiple clinics and branches with specific addresses, schedules, and contacts for each branch.' },
    { id: 'f3', question: 'Can I add assistants or receptionists?', answer: 'Yes, the platform includes a secretary management module allowing you to add staff and assign custom permissions to manage bookings.' },
    { id: 'f4', question: 'Does the profile have a custom unique link?', answer: 'Yes, every doctor gets a unique dedicated profile link to share on social media, business cards, or WhatsApp.' },
    { id: 'f5', question: 'Can I update my info after subscribing?', answer: 'Yes, you can modify all profile details (services, fees, working hours, photos) anytime from your control dashboard.' },
    { id: 'f6', question: 'Does it work on mobile phones?', answer: 'Yes, all doctor profiles and dashboards are fully responsive and optimized for seamless use on mobile phones, tablets, and desktops.' },
    { id: 'f7', question: 'Is customer support available?', answer: 'Yes, our customer support team is available via WhatsApp and email to assist you with any questions.' },
    { id: 'f8', question: 'Does the profile have different templates and colors?', answer: 'Yes, the platform offers multiple templates, designs, and colors to match your brand and medical specialty, which you can easily switch between from your dashboard.' }
  ];

  const hasOldDefaults = landingConfig?.faq?.items?.length === 4 && landingConfig?.faq?.items[0]?.question?.includes('جميع الأجهزة');

  const faqItems = currentLang === 'en' 
    ? defaultEn 
    : ((landingConfig?.faq?.items && !hasOldDefaults) ? landingConfig.faq.items : defaultAr);

  return (
    <section id="faq" className="w-full py-16 md:py-24 bg-white border-b border-neutral-200/50 scroll-mt-20" dir={currentLang === 'en' ? 'ltr' : 'rtl'}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 lg:gap-16">
          
          {/* Header Info */}
          <div className={`w-full md:w-5/12 lg:w-1/3 ${currentLang === 'en' ? 'text-left' : 'text-right'} flex flex-col items-start pt-2`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#10244A] tracking-tight leading-tight mb-4 select-text">
              {title}
            </h2>
            <p className="text-base sm:text-lg text-black/70 font-semibold leading-relaxed mb-6 max-w-md select-text">
              {subtitle}
            </p>
            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('contact');
                } else if (showInlineContact) {
                  setShowContactInput(!showContactInput);
                } else {
                  const el = document.getElementById('contact');
                  if (el) {
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className="inline-flex items-center justify-center px-8 py-2.5 sm:py-3 rounded-xl border-2 border-[#0051A8] text-[#0051A8] hover:bg-[#0051A8] hover:text-white font-black text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-xs active:scale-98"
            >
              {currentLang === 'en' ? 'Contact Us' : 'تواصل معنا'}
            </button>

            {/* Inline WhatsApp Box */}
            <AnimatePresence>
              {showContactInput && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -8 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="w-full max-w-md mt-4"
                >
                  <div className="w-full bg-white border border-neutral-200/90 rounded-2xl p-1.5 sm:p-2 flex items-center justify-between gap-2 shadow-[0_8px_25px_rgba(0,0,0,0.05)] focus-within:border-[#25D366] transition-all">
                    {/* Input Field */}
                    <input
                      type="text"
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder={currentLang === 'en' ? 'Type your message here...' : 'اكتب رسالتك هنا...'}
                      dir={currentLang === 'en' ? 'ltr' : 'rtl'}
                      className={`w-full bg-transparent border-none ${currentLang === 'en' ? 'text-left' : 'text-right'} text-xs sm:text-sm font-semibold px-3 py-1.5 text-neutral-800 placeholder:text-neutral-400 focus:outline-hidden focus:ring-0`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const whatsappNum = landingConfig?.contact?.whatsappNumber || '201111777251';
                          const defaultMsg = currentLang === 'en' ? 'Hello, I would like to ask about the subscription plans.' : (landingConfig?.contact?.defaultMessage || 'مرحباً، أود الاستفسار عن باقات الأسعار.');
                          const encodedText = encodeURIComponent(contactMessage.trim() || defaultMsg);
                          window.open(`https://wa.me/${whatsappNum}?text=${encodedText}`, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    />

                    {/* WhatsApp Button */}
                    <button
                      type="button"
                      onClick={() => {
                        const whatsappNum = landingConfig?.contact?.whatsappNumber || '201111777251';
                        const defaultMsg = currentLang === 'en' ? 'Hello, I would like to ask about the subscription plans.' : (landingConfig?.contact?.defaultMessage || 'مرحباً، أود الاستفسار عن باقات الأسعار.');
                        const encodedText = encodeURIComponent(contactMessage.trim() || defaultMsg);
                        window.open(`https://wa.me/${whatsappNum}?text=${encodedText}`, '_blank', 'noopener,noreferrer');
                      }}
                      className="shrink-0 bg-[#25D366] hover:bg-[#20ba5a] active:scale-95 text-white font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all duration-200 cursor-pointer select-none font-almarai"
                    >
                      <span>{currentLang === 'en' ? 'WhatsApp' : 'واتساب'}</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 448 512" 
                        className="w-4 h-4 text-white fill-current shrink-0"
                      >
                        <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.3 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-117zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                      </svg>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Questions Accordion Card Container */}
          <div className="w-full md:w-7/12 lg:w-2/3">
            <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-neutral-100">
              <div className="divide-y divide-neutral-200/70">
                {faqItems.map((item, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div key={item.id || index} className="py-5 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => setOpenIndex(isOpen ? null : index)}
                        className={`w-full flex items-center justify-between ${currentLang === 'en' ? 'text-left' : 'text-right'} gap-4 cursor-pointer group py-1 select-none focus:outline-hidden`}
                      >
                        <span className="font-black text-base sm:text-lg md:text-xl text-[#10244A] group-hover:text-[#0051A8] transition-colors leading-snug">
                          {item.question}
                        </span>
                        <div className="shrink-0 text-[#10244A] group-hover:text-[#0051A8] transition-colors">
                          <ChevronLeft className={`w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 ${currentLang === 'en' ? 'rotate-180' : 'rotate-0'} ${isOpen ? (currentLang === 'en' ? 'rotate-90 text-[#0051A8]' : '-rotate-90 text-[#0051A8]') : ''}`} />
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <p className={`text-black/75 text-sm sm:text-base leading-relaxed font-semibold pt-3 pb-1 ${currentLang === 'en' ? 'text-left' : 'text-right'}`}>
                              {item.answer}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

