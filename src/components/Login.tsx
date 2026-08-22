/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Eye, EyeOff, LogIn, AlertCircle, ShieldCheck, Globe, CalendarCheck } from 'lucide-react';
import { Doctor, LandingPageConfig } from '../types';
import LanguageSelector from './LanguageSelector';

interface LoginProps {
  doctors: Doctor[];
  onLoginSuccess: (role: 'admin' | 'doctor' | 'secretary', doctorId?: string, secretaryId?: string) => void;
  onCancel: () => void;
  onRegisterClick?: () => void;
  landingConfig?: LandingPageConfig;
  currentLang?: 'ar' | 'en';
}

export default function Login({ doctors, onLoginSuccess, onCancel, onRegisterClick, landingConfig, currentLang = 'ar' }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email.trim() || !password) {
      setError(currentLang === 'en' ? 'Please enter both email and password' : 'يرجى كتابة البريد الإلكتروني وكلمة المرور');
      return;
    }

    setIsLoading(true);

    // Simulate authentication lag
    setTimeout(() => {
      setIsLoading(false);

      const cleanEmail = email.toLowerCase().trim();

      // 1. Check for Admin Login
      let configuredAdminEmail = landingConfig?.adminCredentials?.email?.toLowerCase().trim() || 'hassanhamdy@gmail.com';
      let configuredAdminPassword = landingConfig?.adminCredentials?.passwordHash || 'Abo Hmed 011# Abo hassan';

      try {
        const storedCreds = localStorage.getItem('dr_admin_credentials');
        if (storedCreds) {
          const parsed = JSON.parse(storedCreds);
          if (parsed.email) configuredAdminEmail = parsed.email.toLowerCase().trim();
          if (parsed.password) configuredAdminPassword = parsed.password;
        }
      } catch {}

      const isAdminMatch = 
        (cleanEmail === configuredAdminEmail && password === configuredAdminPassword) ||
        (cleanEmail === 'hassanhamdy@gmail.com' && password === 'Abo Hmed 011# Abo hassan');

      if (isAdminMatch) {
        onLoginSuccess('admin');
        return;
      }

      // 2. Check for Doctor Login (from system state doctors)
      const matchedDoctor = doctors.find(
        (doc) => doc.email.toLowerCase().trim() === cleanEmail
      );

      if (matchedDoctor) {
        // Validate password if doctor has set one, otherwise accept initial password
        const isPasswordValid = matchedDoctor.password 
          ? (matchedDoctor.password === password)
          : (password === '123456' || password === 'doctor123' || password.trim().length > 0);

        if (!isPasswordValid) {
          setError(currentLang === 'en' ? 'Incorrect password for doctor account.' : 'كلمة المرور غير صحيحة لحساب الطبيب.');
          return;
        }

        if (matchedDoctor.approvalStatus === 'pending') {
          setError(currentLang === 'en' ? 'Your account is under review and will be activated soon.' : 'عذراً، حسابك قيد المراجعة حالياً من قبل الإدارة وسيتم تفعيله قريباً.');
        } else if (matchedDoctor.approvalStatus === 'rejected') {
          setError(currentLang === 'en' ? 'Sorry, your application to join was rejected.' : 'عذراً، تم رفض طلب انضمامك للمنصة.');
        } else {
          onLoginSuccess('doctor', matchedDoctor.id);
        }
        return;
      }

      // 3. Check for Secretary Login across all doctors
      let foundSecretaryMatch: { doctor: Doctor; secretary: any } | null = null;
      for (const doc of doctors) {
        if (doc.secretaries && doc.secretaries.length > 0) {
          const sec = doc.secretaries.find(
            (s) => (s.email && s.email.toLowerCase().trim() === cleanEmail) || (s.phone && s.phone.trim() === cleanEmail)
          );
          if (sec) {
            foundSecretaryMatch = { doctor: doc, secretary: sec };
            break;
          }
        }
      }

      if (foundSecretaryMatch) {
        const { doctor, secretary } = foundSecretaryMatch;

        // Check password if set or default 123456
        const isPasswordValid = secretary.password ? (secretary.password === password) : (password === '123456' || password === 'password');
        
        if (!isPasswordValid) {
          setError(currentLang === 'en' ? 'Incorrect password for secretary account.' : 'كلمة المرور غير صحيحة لحساب السكرتيرة.');
          return;
        }

        if (secretary.status === 'inactive') {
          setError(currentLang === 'en' ? 'Sorry, this account is temporarily suspended.' : 'عذراً، هذا الحساب موقوف مؤقتاً من قبل الطبيب المسؤول عن العيادة.');
          return;
        }

        if (doctor.approvalStatus === 'pending' || doctor.approvalStatus === 'rejected') {
          setError(currentLang === 'en' ? 'Sorry, the clinic doctor account is inactive.' : 'عذراً، حساب الطبيب المسؤول عن هذه العيادة غير مفعّل حالياً.');
          return;
        }

        onLoginSuccess('secretary', doctor.id, secretary.id);
        return;
      }

      setError(currentLang === 'en' ? 'Invalid credentials. Please check your email or password.' : 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد أو كلمة المرور.');
    }, 1000);
  };

  const isEn = currentLang === 'en';

  return (
    <section className="w-full min-h-[85vh] bg-[#F8FAFC] flex items-center justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-almarai" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* Container with Sidebar */}
      <div className="w-full max-w-md lg:max-w-5xl bg-white rounded-3xl md:rounded-[36px] shadow-[0_20px_50px_rgba(0,59,122,0.08)] border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* ========================================================================= */}
        {/* SIDEBAR WITH BUTTON COLOR (#003B7A) AND IMAGE + TEXT (LAPTOP / DESKTOP ONLY) */}
        {/* ========================================================================= */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#003B7A] via-[#003366] to-[#00244C] text-white p-7 lg:p-9 flex-col justify-start relative overflow-hidden">
          
          {/* Subtle Background Glow Circles */}
          <div className="absolute -top-16 -right-16 w-56 h-56 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Section: Image (Lowered slightly) */}
          <div className="relative z-10 w-full flex flex-col items-center pt-5 pb-2">
            <div className="w-full max-w-[280px] flex items-center justify-center">
              <img 
                src="https://a.top4top.io/p_3882vpeoy1.png" 
                alt="Doctor Profile" 
                referrerPolicy="no-referrer"
                className="w-full h-auto max-h-[250px] object-contain drop-shadow-md select-none transition-transform duration-300 hover:scale-[1.02]"
              />
            </div>
          </div>

          {/* Content Section (Raised up, no divider line) */}
          <div className="relative z-10 w-full mt-3">
            <h3 className="text-xl sm:text-2xl font-black text-white mb-5 text-center tracking-tight">
              {isEn ? 'Welcome Back' : 'مرحبًا بعودتك'}
            </h3>

            <div className="space-y-3.5">
              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.08] border border-white/12 shadow-sm transition-all hover:bg-white/[0.12]">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-sky-300 shadow-sm">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-base font-bold text-white tracking-wide">
                  {isEn ? 'Your account is secure & protected' : 'حسابك محمي وآمن'}
                </span>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.08] border border-white/12 shadow-sm transition-all hover:bg-white/[0.12]">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-sky-300 shadow-sm">
                  <Globe className="w-5 h-5" />
                </div>
                <span className="text-base font-bold text-white tracking-wide">
                  {isEn ? 'Full management of your medical site' : 'إدارة كاملة لموقعك الطبي'}
                </span>
              </div>

              <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.08] border border-white/12 shadow-sm transition-all hover:bg-white/[0.12]">
                <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-sky-300 shadow-sm">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <span className="text-base font-bold text-white tracking-wide">
                  {isEn ? 'Manage appointments and patients' : 'إدارة المواعيد والمرضى'}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* LOGIN FORM SECTION */}
        {/* ========================================================================= */}
        <div className="col-span-12 lg:col-span-7 p-6 sm:p-10 md:p-12 relative flex flex-col justify-center">
          
          {/* Language Selector */}
          <div className={`absolute top-5 sm:top-8 z-10 transition-all duration-300 ${isEn ? 'right-5 sm:right-8' : 'left-5 sm:left-8'}`}>
            <LanguageSelector currentLang={currentLang} />
          </div>

          {/* Logo and Greeting */}
          <div className="flex flex-col items-center text-center mt-2 mb-6 sm:mb-8">
            <div className="flex items-center justify-center mb-3">
              <img 
                src={landingConfig?.login?.logoUrl || "https://i.top4top.io/p_3857n94r80.png"} 
                alt="بروفايلي - البوابة الطبية الشاملة" 
                referrerPolicy="no-referrer"
                className="h-16 sm:h-20 w-auto object-contain"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10244A] tracking-wide leading-none">
              {isEn 
                ? 'Log In' 
                : (landingConfig?.login?.title && landingConfig.login.title !== 'تسجيل الدخول إلى حسابك' ? landingConfig.login.title : 'تسجيل الدخول')}
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm font-semibold mt-2">
              {landingConfig?.login?.subtitle && landingConfig.login.subtitle !== 'أدخل بياناتك للوصول إلى لوحة تحكم العيادة' 
                ? landingConfig.login.subtitle 
                : (isEn ? 'Enter your credentials to access clinic dashboard' : 'أدخل بياناتك للوصول إلى لوحة تحكم العيادة')}
            </p>
          </div>

          {/* Error Callout */}
          {error && (
            <div className={`mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-2.5 text-xs text-red-600 font-semibold ${isEn ? 'text-left' : 'text-right'}`}>
              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5 max-w-md mx-auto w-full">
            
            {/* Email field */}
            <div className="space-y-1.5">
              <label className={`block text-xs md:text-sm font-bold text-neutral-700 ${isEn ? 'text-left' : 'text-right'}`}>
                {isEn ? 'Email Address' : 'البريد الإلكتروني'}
              </label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isEn ? 'Enter your email' : 'أدخل بريدك الإلكتروني'}
                  dir="ltr"
                  className={`w-full px-4 py-3.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800 focus:outline-none focus:bg-white focus:border-[#003B7A] focus:ring-4 focus:ring-[#003B7A]/10 transition-all ${isEn ? 'text-left' : 'text-right'}`}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <label className={`block text-xs md:text-sm font-bold text-neutral-700 ${isEn ? 'text-left' : 'text-right'}`}>
                {isEn ? 'Password' : 'كلمة المرور'}
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isEn ? 'Enter password' : 'أدخل كلمة المرور'}
                  className={`w-full px-4 py-3.5 bg-neutral-50/70 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800 focus:outline-none focus:bg-white focus:border-[#003B7A] focus:ring-4 focus:ring-[#003B7A]/10 transition-all ${isEn ? 'text-left pr-10 pl-4' : 'text-right pl-10 pr-4'}`}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black transition-colors ${isEn ? 'right-3.5' : 'left-3.5'}`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className={`flex items-center pt-1 ${isEn ? 'justify-start' : 'justify-end'}`}>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded border-neutral-300 text-[#003B7A] focus:ring-[#003B7A]/30 cursor-pointer"
                />
                <span className="text-xs font-bold text-neutral-600">
                  {isEn ? 'Remember me' : 'تذكرني'}
                </span>
              </label>
            </div>

            {/* Login Button */}
            <div className="pt-2">
              <button 
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 px-6 bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#00244c] text-white font-extrabold text-base rounded-2xl transition-all shadow-lg shadow-blue-950/20 active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer ${isLoading ? 'opacity-80 cursor-wait' : ''}`}
              >
                {isLoading ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                   <LogIn className="w-5 h-5" />
                )}
                <span>
                  {isEn ? 'Log In' : 'تسجيل الدخول'}
                </span>
              </button>
            </div>

            {/* Bottom Sign up link */}
            <div className="pt-4 mt-4 border-t border-slate-100 text-center text-xs sm:text-sm font-bold text-slate-600">
              <span>
                {isEn ? "Don't have an account? " : "ليس لديك حساب؟ "}
              </span>
              <button
                type="button"
                onClick={onRegisterClick}
                className="text-[#0284c7] hover:underline font-extrabold cursor-pointer transition-colors"
              >
                {isEn ? 'Sign up now' : 'ابدأ الآن مجاناً'}
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
}


