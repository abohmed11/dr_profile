/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LandingPageConfig } from '../types';
import { getEffectiveSocialLinks, SocialIcon } from './SocialLinks';
import { saveContactMessageInDb } from '../lib/firebase';

interface ContactWhatsAppProps {
  landingConfig?: LandingPageConfig;
  currentLang?: 'ar' | 'en';
  onNavigate?: (view: string) => void;
}

export default function ContactWhatsApp({ landingConfig, currentLang = 'ar', onNavigate }: ContactWhatsAppProps) {
  const [activeModal, setActiveModal] = useState<'none' | 'chat' | 'mail' | 'help'>('none');
  
  // Chat / WhatsApp State
  const [chatMessage, setChatMessage] = useState('');
  
  // Mail State
  const [mailForm, setMailForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [mailSent, setMailSent] = useState(false);

  // Direct Contact Form State (Bottom Form)
  const [directForm, setDirectForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetEmail = landingConfig?.contact?.targetEmail || 'drprofileweb@gmail.com';
  const targetWhatsapp = landingConfig?.contact?.whatsappNumber || '201111777251';
  const defaultWhatsAppMsg = landingConfig?.contact?.defaultMessage || 'مرحباً، أود الاستفسار عن خدماتكم ومنصة دكتور بروفايل.';

  const handleWhatsAppSend = (msgText?: string) => {
    const textToSend = msgText || chatMessage.trim() || defaultWhatsAppMsg;
    const encodedText = encodeURIComponent(textToSend);
    window.open(`https://wa.me/${targetWhatsapp}?text=${encodedText}`, '_blank', 'noopener,noreferrer');
  };

  const handleMailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mailForm.name || !mailForm.email || !mailForm.message) return;
    
    const newMsg = {
      id: 'msg_' + Date.now(),
      name: mailForm.name,
      email: mailForm.email,
      phone: mailForm.phone,
      message: mailForm.message,
      createdAt: new Date().toISOString(),
      read: false
    };

    try {
      const saved = localStorage.getItem('dr_admin_contact_messages');
      const messages = saved ? JSON.parse(saved) : [];
      messages.unshift(newMsg);
      localStorage.setItem('dr_admin_contact_messages', JSON.stringify(messages));
      window.dispatchEvent(new CustomEvent('dr_contact_message_sent', { detail: newMsg }));
    } catch {}

    saveContactMessageInDb(newMsg).catch(err => console.error('Failed to save message to Firebase', err));

    setMailSent(true);
    setTimeout(() => {
      setMailSent(false);
      setActiveModal('none');
      setMailForm({ name: '', email: '', phone: '', message: '' });
    }, 2500);
  };

  const handleDirectFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directForm.name || !directForm.email || !directForm.message) return;

    setIsSubmitting(true);

    const newMsg = {
      id: 'msg_' + Date.now(),
      name: directForm.name,
      email: directForm.email,
      phone: directForm.phone,
      message: directForm.message,
      createdAt: new Date().toISOString(),
      read: false
    };

    try {
      const saved = localStorage.getItem('dr_admin_contact_messages');
      const messages = saved ? JSON.parse(saved) : [];
      messages.unshift(newMsg);
      localStorage.setItem('dr_admin_contact_messages', JSON.stringify(messages));
      window.dispatchEvent(new CustomEvent('dr_contact_message_sent', { detail: newMsg }));
    } catch (err) {
      console.error('Failed to save message to local', err);
    }
    
    // Save to Firebase
    saveContactMessageInDb(newMsg).catch(err => console.error('Failed to save message to Firebase', err));

    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessPopup(true);
      setDirectForm({ name: '', email: '', phone: '', message: '' });
    }, 600);
  };

  const isEn = currentLang === 'en';

  return (
    <section id="contact" className="w-full py-12 sm:py-20 md:py-24 bg-[#F4F8FC] min-h-[85vh] flex flex-col justify-center items-center text-[#10244A] font-almarai relative overflow-hidden" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full">
        
        {/* TOP SECTION: ILLUSTRATION & HEADING WITH SOCIAL LINKS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-12 sm:mb-20">
          
          {/* Illustration Column */}
          <div className="flex justify-center order-2 lg:order-1">
            <div className="relative w-full max-w-md p-2">
              <svg viewBox="0 0 500 380" className="w-full h-auto drop-shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Shadow */}
                <ellipse cx="250" cy="350" rx="200" ry="14" fill="#E2E8F0" />
                
                {/* Mailbox Stand & Box */}
                <rect x="180" y="240" width="30" height="110" rx="4" fill="#002247" />
                <path d="M100 350 V190 C100 145 135 110 180 110 H220 C265 110 300 145 300 190 V350 H100 Z" fill="#003B7A" />
                <path d="M100 170 H300 C300 170 290 190 200 190 C110 190 100 170 100 170 Z" fill="#002d5e" />
                <rect x="120" y="200" width="160" height="12" rx="6" fill="#002247" />
                
                {/* Mailbox Red Flag */}
                <rect x="105" y="150" width="8" height="50" rx="4" fill="#1E293B" />
                <path d="M85 150 L105 150 L105 175 L85 170 Z" fill="#EF4444" />

                {/* Mail delivery person */}
                {/* Pants */}
                <path d="M330 240 L310 348 H332 L348 240 Z" fill="#1E293B" />
                <path d="M365 240 L378 348 H400 L378 240 Z" fill="#1E293B" />
                {/* Shoes */}
                <path d="M305 348 C305 348 315 340 335 348 L335 355 H295 Z" fill="#0F172A" />
                <path d="M370 348 C370 348 385 340 405 348 L405 355 H365 Z" fill="#0F172A" />
                
                {/* Blue Shirt */}
                <path d="M320 120 C320 120 350 105 385 120 L385 240 C360 245 330 245 320 240 Z" fill="#003B7A" />
                
                {/* Giant Envelope */}
                <g transform="rotate(-12 260 160)">
                  <rect x="160" y="110" width="160" height="100" rx="10" fill="#FFFFFF" stroke="#003B7A" strokeWidth="4" />
                  <path d="M160 110 L240 170 L320 110" fill="none" stroke="#003B7A" strokeWidth="4" strokeLinecap="round" />
                  <path d="M160 210 L215 160" stroke="#BFDBFE" strokeWidth="3" />
                  <path d="M320 210 L265 160" stroke="#BFDBFE" strokeWidth="3" />
                  <polygon points="240,150 220,180 260,180" fill="#003B7A" opacity="0.15" />
                </g>

                {/* Arms */}
                <path d="M375 140 L320 165 L270 150" fill="none" stroke="#FCA5A5" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M335 145 L285 175" fill="none" stroke="#FCA5A5" strokeWidth="14" strokeLinecap="round" />

                {/* Head / Cap */}
                <ellipse cx="355" cy="80" rx="20" ry="24" fill="#FCA5A5" />
                <path d="M330 75 C330 55 380 55 380 75 Z" fill="#003B7A" />
                <path d="M320 78 L360 78" stroke="#003B7A" strokeWidth="8" strokeLinecap="round" />
                <circle cx="348" cy="80" r="3" fill="#0F172A" />
              </svg>
            </div>
          </div>

          {/* Heading and text column */}
          <div className={`flex flex-col items-center ${isEn ? 'lg:items-start text-center lg:text-left' : 'lg:items-start text-center lg:text-right'} order-1 lg:order-2 space-y-4 sm:space-y-6`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#003B7A] tracking-tight">
              {isEn ? 'Contact Us' : (landingConfig?.contact?.title || 'تواصل معنا')}
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl font-bold text-slate-600 max-w-xl leading-relaxed">
              {isEn 
                ? 'Ready to assist you anytime, anywhere' 
                : (landingConfig?.contact?.subtitle || 'جاهزين لمساعدتك في أي شيء وأي وقت')}
            </p>

            {/* Social Media Circular Buttons */}
            {(() => {
              const socialLinks = getEffectiveSocialLinks(landingConfig?.footer);
              if (socialLinks.length === 0) return null;
              return (
                <div className="flex items-center justify-center lg:justify-start flex-wrap gap-3 pt-2">
                  {socialLinks.map((item) => (
                    <a 
                      key={item.id}
                      href={item.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label={item.title || item.platform}
                      title={item.title || item.platform}
                      className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#002247] text-white flex items-center justify-center transition-all duration-200 shadow-md shadow-blue-900/20 hover:shadow-lg hover:-translate-y-1"
                    >
                      <SocialIcon platform={item.platform} className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              );
            })()}
          </div>

        </div>

        {/* BOTTOM SECTION: 3 CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          
          {/* CARD 1: FAQ */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col items-center text-center justify-between group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#003B7A] text-white flex items-center justify-center font-black text-2xl mb-5 shadow-sm shadow-blue-900/20 group-hover:scale-110 transition-transform">
                ?
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#10244A] mb-3">
                {isEn ? 'FAQs' : (landingConfig?.contact?.cardFaqTitle || 'الأسئلة الشائعة')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed mb-8">
                {isEn 
                  ? 'Quick answers to top questions about Doctor Profile and our services.' 
                  : (landingConfig?.contact?.cardFaqSubtitle || 'إجابات سريعة على أهم الأسئلة حول دكتور بروفايل وخدماتنا.')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('landing');
                  setTimeout(() => {
                    const faqEl = document.getElementById('faq') || document.getElementById('subscription');
                    if (faqEl) faqEl.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  setActiveModal('help');
                }
              }}
              className="w-48 sm:w-52 h-10 sm:h-11 bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#002247] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-900/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center whitespace-nowrap"
            >
              {isEn ? 'View FAQs' : (landingConfig?.contact?.cardFaqButtonText || 'شاهد الأسئلة الشائعة')}
            </button>
          </div>

          {/* CARD 2: Contact Us / Chat */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col items-center text-center justify-between group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#003B7A] text-white flex items-center justify-center mb-5 shadow-sm shadow-blue-900/20 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z"/>
                  <path d="M7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#10244A] mb-3">
                {isEn ? 'Call Us' : (landingConfig?.contact?.cardCallTitle || 'اتصل بنا')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed mb-8">
                {isEn 
                  ? 'Have a query or problem? Chat with us or schedule a call with our support team.' 
                  : (landingConfig?.contact?.cardCallSubtitle || 'لديك استفسار أو مشكلة؟ دردش معنا أو حدد وقت لمكالمة هاتفية مع فريق الدعم.')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleWhatsAppSend()}
              className="w-48 sm:w-52 h-10 sm:h-11 bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#002247] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-900/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center whitespace-nowrap"
            >
              {isEn ? 'Call Us Now' : (landingConfig?.contact?.cardCallButtonText || 'كلمنا الآن')}
            </button>
          </div>

          {/* CARD 3: Leave Message */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_35px_rgba(0,0,0,0.07)] transition-all duration-300 flex flex-col items-center text-center justify-between group">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#003B7A] text-white flex items-center justify-center mb-5 shadow-sm shadow-blue-900/20 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#10244A] mb-3">
                {isEn ? 'Leave a Message' : (landingConfig?.contact?.cardMessageTitle || 'اترك لنا رسالة')}
              </h3>
              <p className="text-sm sm:text-base text-slate-600 font-semibold leading-relaxed mb-8">
                {isEn 
                  ? 'Have a query or problem? Message us now via email to resolve it.' 
                  : (landingConfig?.contact?.cardMessageSubtitle || 'لديك استفسار أو مشكلة؟ راسلنا الآن عبر البريد الإلكتروني لحلها.')}
              </p>
            </div>

            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodeURIComponent(isEn ? 'Doctor Profile Inquiry' : 'استفسار حول دكتور بروفايل')}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => {
                try {
                  const mailtoUrl = `mailto:${targetEmail}?subject=${encodeURIComponent(isEn ? 'Doctor Profile Inquiry' : 'استفسار حول دكتور بروفايل')}`;
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                  if (isMobile) {
                    window.location.href = mailtoUrl;
                  }
                } catch (err) {
                  console.error(err);
                }
              }}
              className="w-48 sm:w-52 h-10 sm:h-11 bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#002247] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-900/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center whitespace-nowrap"
            >
              {isEn ? 'Message Us' : (landingConfig?.contact?.cardMessageButtonText || 'راسلنا')}
            </a>
          </div>

        </div>

        {/* BOTTOM DIRECT CONTACT FORM */}
        <div className="mt-12 sm:mt-16 max-w-3xl mx-auto w-full bg-white rounded-3xl p-6 sm:p-10 md:p-12 border border-slate-200/90 shadow-[0_15px_40px_rgba(0,0,0,0.04)] relative">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-center text-[#10244A] mb-8 sm:mb-10">
            {isEn ? 'To contact management, please fill out the following form' : (landingConfig?.contact?.formTitle || 'للتواصل مع الادارة يرجى ملء النموذج التالي')}
          </h2>

          <form onSubmit={handleDirectFormSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <input
                type="text"
                required
                value={directForm.name}
                onChange={(e) => setDirectForm({ ...directForm, name: e.target.value })}
                placeholder={isEn ? 'Your Name' : 'اسمك'}
                className={`w-full bg-slate-50 border border-slate-200/90 focus:bg-white focus:border-[#003B7A] focus:ring-2 focus:ring-[#003B7A]/15 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 text-slate-800 placeholder:text-slate-400 font-semibold text-sm sm:text-base outline-none transition-all shadow-xs ${isEn ? 'text-left' : 'text-right'}`}
              />
            </div>

            <div>
              <input
                type="email"
                required
                value={directForm.email}
                onChange={(e) => setDirectForm({ ...directForm, email: e.target.value })}
                placeholder={isEn ? 'Email Address' : 'البريد الالكتروني'}
                className={`w-full bg-slate-50 border border-slate-200/90 focus:bg-white focus:border-[#003B7A] focus:ring-2 focus:ring-[#003B7A]/15 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 text-slate-800 placeholder:text-slate-400 font-semibold text-sm sm:text-base outline-none transition-all shadow-xs ${isEn ? 'text-left' : 'text-right'}`}
              />
            </div>

            <div>
              <input
                type="tel"
                required
                value={directForm.phone}
                onChange={(e) => setDirectForm({ ...directForm, phone: e.target.value })}
                placeholder={isEn ? 'Phone Number' : 'رقم الهاتف'}
                className={`w-full bg-slate-50 border border-slate-200/90 focus:bg-white focus:border-[#003B7A] focus:ring-2 focus:ring-[#003B7A]/15 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 text-slate-800 placeholder:text-slate-400 font-semibold text-sm sm:text-base outline-none transition-all shadow-xs ${isEn ? 'text-left' : 'text-right'}`}
              />
            </div>

            <div>
              <textarea
                rows={5}
                required
                value={directForm.message}
                onChange={(e) => setDirectForm({ ...directForm, message: e.target.value })}
                placeholder={isEn ? 'Message' : 'الرسالة'}
                className={`w-full bg-slate-50 border border-slate-200/90 focus:bg-white focus:border-[#003B7A] focus:ring-2 focus:ring-[#003B7A]/15 rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 text-slate-800 placeholder:text-slate-400 font-semibold text-sm sm:text-base outline-none transition-all shadow-xs resize-y ${isEn ? 'text-left' : 'text-right'}`}
              />
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-32 sm:w-36 h-10 sm:h-11 bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#002247] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-900/20 hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-60"
              >
                <span>{isSubmitting ? (isEn ? 'Sending...' : 'جاري الإرسال...') : (isEn ? 'Send' : 'إرسال')}</span>
                <svg className={`w-4 h-4 text-white fill-current transform ${isEn ? 'rotate-0' : 'rotate-180'}`} viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                </svg>
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* MODAL: CHAT WITH US (كلمنا الآن) */}
      {activeModal === 'chat' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-right font-almarai border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveModal('none')}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 font-bold text-xl p-1"
            >
              ✕
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 fill-current" viewBox="0 0 448 512">
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L3 480l117.7-30.9c32.4 17.7 68.9 27 106.3 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-117zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#10244A]">
                {currentLang === 'en' ? 'Chat with Support' : 'الدردشة المباشرة مع الدعم'}
              </h3>
            </div>
            
            <p className="text-sm text-slate-600 mb-4 font-semibold">
              {currentLang === 'en' ? 'Write your inquiry to start chatting on WhatsApp directly:' : 'اكتب استفسارك للبدء بالمحادثة المباشرة عبر الواتساب:'}
            </p>

            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder={currentLang === 'en' ? 'Type your message...' : 'اكتب تفاصيل استفسارك هنا...'}
              rows={4}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003B7A] mb-4 font-semibold"
            />

            <button
              onClick={() => {
                handleWhatsAppSend();
                setActiveModal('none');
              }}
              className="w-full bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#002247] text-white font-extrabold py-3 px-6 rounded-xl shadow-md shadow-blue-900/20 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{currentLang === 'en' ? 'Send via WhatsApp' : 'إرسال عبر الواتساب'}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL: LEAVE A MESSAGE FORM (راسلنا) */}
      {activeModal === 'mail' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-right font-almarai border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveModal('none')}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 font-bold text-xl p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#003B7A] text-white flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#10244A]">
                  {currentLang === 'en' ? 'Leave us a message' : 'راسلنا عبر البريد'}
                </h3>
                <p className="text-xs text-[#003B7A] font-bold dir-ltr text-right">
                  drprofileweb@gmail.com
                </p>
              </div>
            </div>

            {/* Quick Action Buttons for Mail */}
            <div className="grid grid-cols-2 gap-2 my-3">
              <a
                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${encodeURIComponent('استفسار حول دكتور بروفايل')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold py-2 px-3 rounded-xl transition-all"
              >
                <span>فتح في Gmail</span>
              </a>
              <a
                href={`mailto:${targetEmail}?subject=${encodeURIComponent('استفسار حول دكتور بروفايل')}`}
                className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-[#003B7A] border border-blue-200 text-xs font-bold py-2 px-3 rounded-xl transition-all"
              >
                <span>تطبيق البريد</span>
              </a>
            </div>

            {mailSent ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-2xl font-bold">
                  ✓
                </div>
                <h4 className="text-lg font-bold text-slate-800">
                  {currentLang === 'en' ? 'Message Sent Successfully!' : 'تم إرسال رسالتك بنجاح!'}
                </h4>
                <p className="text-sm text-slate-500">
                  {currentLang === 'en' ? 'Our team will contact you shortly.' : 'سيقوم فريق الدعم بالتواصل معك في أقرب وقت.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleMailSubmit} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'en' ? 'Full Name' : 'الاسم بالكامل'}
                  </label>
                  <input
                    type="text"
                    required
                    value={mailForm.name}
                    onChange={(e) => setMailForm({ ...mailForm, name: e.target.value })}
                    placeholder={currentLang === 'en' ? 'Dr. Ahmed Mohammed' : 'د. أحمد محمد'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003B7A] font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {currentLang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                    </label>
                    <input
                      type="email"
                      required
                      value={mailForm.email}
                      onChange={(e) => setMailForm({ ...mailForm, email: e.target.value })}
                      placeholder="doctor@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003B7A] font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {currentLang === 'en' ? 'Phone Number' : 'رقم الهاتف / الواتساب'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={mailForm.phone}
                      onChange={(e) => setMailForm({ ...mailForm, phone: e.target.value })}
                      placeholder="01000000000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003B7A] font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {currentLang === 'en' ? 'Your Message' : 'نص الرسالة أو الاستفسار'}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={mailForm.message}
                    onChange={(e) => setMailForm({ ...mailForm, message: e.target.value })}
                    placeholder={currentLang === 'en' ? 'Describe your issue or query...' : 'اكتب استفسارك التفصيلي هنا...'}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#003B7A] font-semibold"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#002247] text-white font-black py-3 rounded-xl shadow-md shadow-blue-900/20 transition-all active:scale-98 cursor-pointer text-sm sm:text-base mt-2"
                >
                  {currentLang === 'en' ? 'Send Message' : 'إرسال الرسالة'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: HELP CENTER QUICK GUIDE (مركز المساعدة) */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-right font-almarai border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setActiveModal('none')}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 font-bold text-xl p-1"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#003B7A] text-white flex items-center justify-center font-black text-xl shrink-0 shadow-sm shadow-blue-900/20">
                ?
              </div>
              <h3 className="text-xl font-bold text-[#10244A]">
                {currentLang === 'en' ? 'Help Center & Guides' : 'مركز المساعدة والإرشادات'}
              </h3>
            </div>

            <div className="space-y-3 my-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#003B7A] transition-all cursor-pointer">
                <h4 className="font-bold text-sm text-[#003B7A]">📘 كيف أقوم بإنشاء موقعي الطبي لأول مرة؟</h4>
                <p className="text-xs text-slate-500 mt-1">خطوات بسيطة وسريعة لإنشاء وإطلاق موقعك خلال دقيقتين فقط.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#003B7A] transition-all cursor-pointer">
                <h4 className="font-bold text-sm text-[#003B7A]">💳 ما هي طرق الدفع المتاحة للاشتراك؟</h4>
                <p className="text-xs text-slate-500 mt-1">نوفر الدفع عبر البطاقات البنكية، فودافون كاش، والمحافظ الإلكترونية.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#003B7A] transition-all cursor-pointer">
                <h4 className="font-bold text-sm text-[#003B7A]">📅 كيف يمكن للمرضى حجز المواعيد أونلاين؟</h4>
                <p className="text-xs text-slate-500 mt-1">نظام حجز ذكي ومستقل يدير مواعيد عيادتك بسهولة وبدون تعارض.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setActiveModal('none');
                if (onNavigate) onNavigate('landing');
              }}
              className="w-full bg-[#003B7A] hover:bg-[#002d5e] text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm shadow-md shadow-blue-900/20"
            >
              {currentLang === 'en' ? 'View All FAQs' : 'الانتقال للأسئلة الشائعة'}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: DIRECT FORM SUCCESS POPUP */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative text-center font-almarai border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 left-4 text-slate-400 hover:text-slate-600 font-bold text-xl p-1 cursor-pointer"
            >
              ✕
            </button>

            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 text-3xl font-bold shadow-inner">
              ✓
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-[#10244A] mb-3 leading-snug">
              {currentLang === 'en' ? 'Message Sent Successfully!' : 'تم إرسال الرسالة بنجاح.'}
            </h3>

            <p className="text-slate-600 font-semibold text-sm sm:text-base leading-relaxed mb-6">
              {currentLang === 'en'
                ? 'We will contact you soon. You can reach out to us anytime.'
                : 'سوف نقوم بالتواصل معك قريباً يمكنك التواصل معنا في أي وقت'}
            </p>

            <button
              type="button"
              onClick={() => setShowSuccessPopup(false)}
              className="w-full bg-[#003B7A] hover:bg-[#002d5e] text-white font-bold py-3 rounded-xl transition-all cursor-pointer text-sm shadow-md shadow-blue-900/20"
            >
              {currentLang === 'en' ? 'OK' : 'حسناً'}
            </button>
          </div>
        </div>
      )}

    </section>
  );
}

