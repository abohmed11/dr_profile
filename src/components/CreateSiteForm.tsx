/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Stethoscope, Check, AlertCircle, ChevronDown, Camera, User, UserPlus, Building2, Globe, CheckCircle2, XCircle, Mail, Lock, Phone, Link as LinkIcon, ShieldCheck, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { SystemSpecialty, Doctor, LandingPageConfig } from '../types';
import { compressImage } from '../lib/imageUtils';
import LanguageSelector from './LanguageSelector';

interface CreateSiteFormProps {
  specialties: SystemSpecialty[];
  onRegisterSuccess: (newDoc: Doctor) => void;
  preselectedPlan?: '5months' | '1year';
  landingConfig?: LandingPageConfig;
  doctors?: Doctor[];
  currentLang?: 'ar' | 'en';
  onNavigate?: (view: string) => void;
}

export default function CreateSiteForm({ 
  specialties, 
  onRegisterSuccess, 
  preselectedPlan, 
  landingConfig, 
  doctors = [], 
  currentLang = 'ar',
  onNavigate 
}: CreateSiteFormProps) {
  // Form State
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [name, setName] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isOpenSpecialty, setIsOpenSpecialty] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // Real-time username check
  const cleanUsername = nameEn.trim().toLowerCase();
  const isUsernameTaken = cleanUsername.length > 0 && doctors.some(
    doc => (doc.nameEn?.toLowerCase() === cleanUsername) || (doc.id?.toLowerCase() === cleanUsername)
  );
  const isUsernameAvailable = cleanUsername.length > 0 && !isUsernameTaken;
  
  // Validation State
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validate Step 1
  const validateStep1 = () => {
    const tempErrors: { [key: string]: string } = {};

    if (!name.trim()) tempErrors.name = currentLang === 'en' ? 'Full name is required' : 'الاسم مطلوب';

    if (!email.trim()) {
      tempErrors.email = currentLang === 'en' ? 'Email is required' : 'البريد الإلكتروني مطلوب';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = currentLang === 'en' ? 'Invalid email format' : 'صيغة البريد الإلكتروني غير صالحة';
    }

    const hasLetters = /[a-zA-Z\u0600-\u06FF]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSymbols = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`^]/.test(password);

    if (!password) {
      tempErrors.password = currentLang === 'en' ? 'Password is required' : 'كلمة المرور مطلوبة';
    } else {
      const missingParts: string[] = [];
      if (!hasLetters) missingParts.push(currentLang === 'en' ? 'letters' : 'أحرف');
      if (!hasNumbers) missingParts.push(currentLang === 'en' ? 'numbers' : 'أرقام');
      if (!hasSymbols) missingParts.push(currentLang === 'en' ? 'symbols (e.g. @, #, $)' : 'رموز خاصة (مثل @ و # و $)');

      if (missingParts.length > 0) {
        tempErrors.password = currentLang === 'en'
          ? `Password must contain: ${missingParts.join(', ')}`
          : `كلمة المرور يجب أن تحتوي على ${missingParts.join(' و ')}`;
      } else if (password.length < 6) {
        tempErrors.password = currentLang === 'en' ? 'Password must be at least 6 characters' : 'كلمة المرور يجب أن تكون ٦ أحرف على الأقل';
      }
    }

    if (!confirmPassword) {
      tempErrors.confirmPassword = currentLang === 'en' ? 'Confirm password is required' : 'تأكيد كلمة المرور مطلوب';
    } else if (password !== confirmPassword) {
      tempErrors.confirmPassword = currentLang === 'en' ? 'Passwords do not match' : 'كلمة المرور غير متطابقة';
    }

    if (!agreedToTerms) {
      tempErrors.terms = currentLang === 'en'
        ? 'You must agree to the Terms of Use, Privacy Policy, and Disclaimer to proceed'
        : 'يجب الموافقة على شروط الاستخدام، سياسة الخصوصية، وإخلاء المسؤولية للمتابعة';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Validate Step 2
  const validateStep2 = () => {
    const tempErrors: { [key: string]: string } = {};

    if (!nameEn.trim()) {
      tempErrors.nameEn = currentLang === 'en' ? 'Profile link username is required' : 'رابط بروفايلك مطلوب';
    } else if (isUsernameTaken) {
      tempErrors.nameEn = currentLang === 'en' ? 'This username is taken' : 'هذا الاسم محجوز بالفعل';
    } else if (!/^[a-z0-9-]+$/.test(nameEn.toLowerCase())) {
      tempErrors.nameEn = currentLang === 'en' ? 'Username must contain lowercase letters and numbers' : 'يجب كتابة اسم المستخدم بحروف إنجليزية صغيرة وأرقام فقط';
    }

    if (!jobTitle.trim()) tempErrors.jobTitle = currentLang === 'en' ? 'Job title is required' : 'المسمى المهني مطلوب';

    if (!specialty) tempErrors.specialty = currentLang === 'en' ? 'Please select a medical specialty' : 'يرجى اختيار التخصص الطبي';

    if (!phone.trim()) {
      tempErrors.phone = currentLang === 'en' ? 'Phone number is required' : 'رقم الهاتف مطلوب';
    } else if (!/^[0-9]+$/.test(phone)) {
      tempErrors.phone = currentLang === 'en' ? 'Phone number must contain digits only' : 'رقم الهاتف يجب أن يحتوي على أرقام فقط';
    }

    if (!whatsapp.trim()) {
      tempErrors.whatsapp = currentLang === 'en' ? 'WhatsApp number is required' : 'رقم واتساب مطلوب';
    } else if (!/^[0-9]+$/.test(whatsapp)) {
      tempErrors.whatsapp = currentLang === 'en' ? 'WhatsApp number must contain digits only' : 'رقم واتساب يجب أن يحتوي على أرقام فقط';
    }

    if (!avatarUrl || !avatarUrl.trim()) {
      tempErrors.avatar = currentLang === 'en' 
        ? 'Profile photo is required. Please upload your photo to complete registration.' 
        : 'صورة البروفايل إجبارية. يرجى رفع صورة شخصية لإكمال إنشاء الحساب.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep1()) {
      setErrors({});
      setCurrentStep(2);
      // Auto-suggest english slug if empty
      if (!nameEn.trim()) {
        const arabicLettersToLatin: { [key: string]: string } = {
          'ا': 'a', 'أ': 'a', 'إ': 'e', 'آ': 'a', 'ب': 'b', 'ت': 't', 'ث': 'th',
          'ج': 'g', 'ح': 'h', 'خ': 'kh', 'د': 'd', 'ذ': 'z', 'ر': 'r', 'ز': 'z',
          'س': 's', 'ش': 'sh', 'ص': 's', 'ض': 'd', 'ط': 't', 'ظ': 'z', 'ع': 'a',
          'غ': 'gh', 'ف': 'f', 'ق': 'k', 'ك': 'k', 'ل': 'l', 'م': 'm', 'ن': 'n',
          'ه': 'h', 'و': 'w', 'ي': 'y', 'ى': 'a', 'ة': 'a', 'ء': 'a'
        };
        let suggested = name.trim().toLowerCase().split('').map(c => arabicLettersToLatin[c] || c).join('').replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
        if (suggested && !doctors.some(d => d.nameEn?.toLowerCase() === suggested)) {
          setNameEn(suggested);
        }
      }
      const el = document.getElementById('register-section');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePrevStep = () => {
    setErrors({});
    setCurrentStep(1);
    const el = document.getElementById('register-section');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleEnglishNameChange = (val: string) => {
    const formatted = val.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    setNameEn(formatted);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const compressed = await compressImage(file, 400, 400, 0.75);
      setAvatarUrl(compressed);
      setErrors(prev => {
        const next = { ...prev };
        delete next.avatar;
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    let finalAvatar = avatarUrl || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300';
    if (avatarUrl && avatarUrl.startsWith('data:image')) {
      finalAvatar = await compressImage(avatarUrl, 400, 400, 0.75);
    }

    const selectedSpecObj = specialties.find(s => s.id === specialty);
    const resolvedJobTitle = jobTitle.trim() || (selectedSpecObj ? `استشاري ${selectedSpecObj.name}` : 'طبيب');

    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const newDoctor: Doctor = {
      id: `doc-${Date.now()}`,
      name: name.trim(),
      nameEn: nameEn.toLowerCase().trim(),
      password: password,
      specialty,
      jobTitle: resolvedJobTitle,
      email: email.trim(),
      phone: phone.trim(),
      whatsapp: whatsapp.trim(),
      avatar: finalAvatar,
      bio: '',
      experience: 0,
      branches: [],
      services: [],
      workingHours: [],
      secretaries: [],
      gallery: [],
      galleryItems: [],
      videos: [],
      certificates: [],
      reviews: [],
      socials: {},
      isActiveSubscription: true,
      registeredAt: now.toISOString().split('T')[0],
      isTrial: true,
      trialStartDate: now.toISOString(),
      trialEndDate: trialEnd.toISOString(),
      subscriptionEndDate: trialEnd.toISOString(),
      isPaidSubscription: false,
      subscriptionType: 'annual',
      approvalStatus: 'approved',
      status: 'approved',
      isVerified: false,
      whiteLabel: true,
      siteType: 'profile'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onRegisterSuccess(newDoctor);
    }, 600);
  };

  const getSpecialtyName = (s: SystemSpecialty) => {
    if (currentLang === 'en') {
      const n = s.name;
      if (n.includes('أسنان')) return 'Dentistry';
      if (n.includes('جلدية')) return 'Dermatology';
      if (n.includes('عيون')) return 'Ophthalmology';
      if (n.includes('أطفال')) return 'Pediatrics';
      if (n.includes('قلب')) return 'Cardiology';
      if (n.includes('عظام')) return 'Orthopedics';
      if (n.includes('مخ') || n.includes('أعصاب')) return 'Neurology';
      if (n.includes('باطن')) return 'Internal Medicine';
      if (n.includes('أنف') || n.includes('أذن') || n.includes('حنجرة')) return 'Ear, Nose & Throat (ENT)';
      if (n.includes('نساء') || n.includes('توليد')) return 'Obstetrics & Gynecology';
      if (n.includes('جراحة')) return 'General Surgery';
      if (n.includes('مسالك')) return 'Urology';
      if (n.includes('علاج طبيعي')) return 'Physiotherapy';
      if (n.includes('تغذية')) return 'Clinical Nutrition';
      if (n.includes('أورام')) return 'Oncology';
    }
    return s.name;
  };

  // Password criteria evaluation
  const hasMinLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  const pwdRequirements = [
    { label: 'حرف كبير واحد على الأقل (A–Z)', labelEn: 'At least one uppercase letter (A–Z)', met: hasUpper },
    { label: 'حرف صغير واحد على الأقل (a–z)', labelEn: 'At least one lowercase letter (a–z)', met: hasLower },
    { label: 'رقم واحد على الأقل (0–9)', labelEn: 'At least one number (0–9)', met: hasNumber },
    { label: 'رمز خاص واحد على الأقل (! @ # $ %)', labelEn: 'At least one special character (! @ # $ %)', met: hasSpecial },
    { label: '8 أحرف على الأقل', labelEn: 'At least 8 characters', met: hasMinLength },
  ];

  const metCount = pwdRequirements.filter(r => r.met).length;

  let strengthText = currentLang === 'en' ? 'Weak' : 'ضعيفة';
  let strengthBadgeClass = 'text-red-500 bg-red-50 border-red-200';
  let barColorClass = 'bg-red-500';
  let barWidthClass = 'w-1/4';

  if (metCount >= 5) {
    strengthText = currentLang === 'en' ? 'Very Strong' : 'قوية جدًا';
    strengthBadgeClass = 'text-emerald-600 bg-emerald-50 border-emerald-200';
    barColorClass = 'bg-emerald-500';
    barWidthClass = 'w-full';
  } else if (metCount >= 4) {
    strengthText = currentLang === 'en' ? 'Strong' : 'قوية';
    strengthBadgeClass = 'text-blue-600 bg-blue-50 border-blue-200';
    barColorClass = 'bg-blue-500';
    barWidthClass = 'w-3/4';
  } else if (metCount >= 2) {
    strengthText = currentLang === 'en' ? 'Medium' : 'متوسطة';
    strengthBadgeClass = 'text-amber-600 bg-amber-50 border-amber-200';
    barColorClass = 'bg-amber-500';
    barWidthClass = 'w-1/2';
  } else {
    strengthText = currentLang === 'en' ? 'Weak' : 'ضعيفة';
    strengthBadgeClass = 'text-red-500 bg-red-50 border-red-200';
    barColorClass = 'bg-red-500';
    barWidthClass = 'w-1/4';
  }

  const isEn = currentLang === 'en';
  const formLogo = landingConfig?.createSite?.logoUrl || "https://d.top4top.io/p_3875rj4l41.png";
  const formTitle = (isEn ? 'Create Free Account' : landingConfig?.createSite?.title) || 'انشئ حساب مجاني';
  const step1Title = (isEn ? 'Create Free Account' : landingConfig?.createSite?.step1Title) || 'انشئ حساب مجاني';
  const step2Title = (isEn ? 'Profile Details' : landingConfig?.createSite?.step2Title) || 'بيانات البروفايل';
  const nextBtnText = (isEn ? 'Next Step' : landingConfig?.createSite?.nextButtonText) || 'التالي';
  const prevBtnText = (isEn ? 'Back' : landingConfig?.createSite?.backButtonText) || 'السابق';
  const submitBtnText = (isEn ? 'Create Free Account' : landingConfig?.createSite?.submitButtonText) || 'انشئ حساب مجاني';
  const submittingBtnText = (isEn ? 'Creating...' : landingConfig?.createSite?.submittingButtonText) || 'جاري إنشاء الحساب...';
  const loginPrompt = (isEn ? 'Already have an account?' : landingConfig?.createSite?.loginPromptText) || 'لديكم حساب بالفعل؟';
  const loginLink = (isEn ? 'Log In' : landingConfig?.createSite?.loginLinkText) || 'تسجيل الدخول';

  return (
    <section id="register-section" className="w-full py-8 sm:py-12 md:py-16 bg-[#F8FAFC] flex items-center justify-center min-h-[85vh] px-4 sm:px-6 lg:px-8 font-almarai" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="w-full max-w-xl lg:max-w-6xl mx-auto">
        
        {/* Container with Sidebar */}
        <div className="bg-white rounded-3xl md:rounded-[36px] shadow-[0_20px_50px_rgba(0,59,122,0.08)] border border-slate-200/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* ========================================================================= */}
          {/* SIDEBAR WITH BUTTON COLOR (#003B7A) AND IMAGE + STEPS (LAPTOP / DESKTOP ONLY) */}
          {/* ========================================================================= */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#003B7A] via-[#003366] to-[#00244C] text-white p-7 lg:p-9 flex-col justify-start relative overflow-hidden">
            
            {/* Subtle Background Glows */}
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

            {/* Content Section (Raised up, spacious lines, icons like login page) */}
            <div className="relative z-10 w-full mt-3">
              <h3 className="text-xl sm:text-2xl font-black text-white mb-5 text-center tracking-tight">
                {isEn ? 'Create Your Medical Profile' : 'أنشئ بروفايلك الطبي'}
              </h3>

              <div className="space-y-3.5">
                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.08] border border-white/12 shadow-sm transition-all hover:bg-white/[0.12]">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-sky-300 shadow-sm">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <span className="text-base font-bold text-white tracking-wide">
                    {isEn ? 'Create your account' : 'أنشئ حسابك'}
                  </span>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.08] border border-white/12 shadow-sm transition-all hover:bg-white/[0.12]">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-sky-300 shadow-sm">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <span className="text-base font-bold text-white tracking-wide">
                    {isEn ? 'Enter clinic & specialty info' : 'أدخل بيانات عيادتك وتخصصك'}
                  </span>
                </div>

                <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.08] border border-white/12 shadow-sm transition-all hover:bg-white/[0.12]">
                  <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center shrink-0 text-sky-300 shadow-sm">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-base font-bold text-white tracking-wide">
                    {isEn ? 'Get your medical profile' : 'احصل على بروفايلك الطبي'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* FORM CONTAINER ON THE OTHER SIDE */}
          {/* ========================================================================= */}
          <div className="col-span-12 lg:col-span-7 p-6 sm:p-9 md:p-11 relative overflow-hidden flex flex-col justify-center">
            
            {/* Language Selector inside Form */}
            <div className={`absolute top-5 sm:top-8 z-10 transition-all duration-300 ${isEn ? 'right-5 sm:right-8' : 'left-5 sm:left-8'}`}>
              <LanguageSelector currentLang={currentLang} />
            </div>

            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <img 
                src={formLogo} 
                alt="Logo" 
                referrerPolicy="no-referrer"
                className="h-16 sm:h-20 md:h-22 mx-auto mb-3 object-contain drop-shadow-sm transition-all duration-300"
              />
              <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
                {formTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold mt-1">
                {currentStep === 1 
                  ? (isEn ? 'Step 1 of 2: Account Details' : 'المرحلة الأولى: بيانات الحساب الأساسية')
                  : (isEn ? 'Step 2 of 2: Clinic & Profile Info' : 'المرحلة الثانية: بيانات البروفايل والعيادة')}
              </p>
            </div>

            {/* Step Progress Indicator */}
            <div className="mb-6 pb-2">
              <div className="flex items-center justify-between max-w-xs mx-auto relative">
                {/* Connector line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0" />
                <div 
                  className={`absolute top-1/2 left-0 h-1 bg-[#003B7A] -translate-y-1/2 z-0 transition-all duration-500 ${
                    currentStep === 2 ? 'w-full' : 'w-0'
                  }`} 
                />

                {/* Step 1 Node */}
                <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      currentStep === 1 
                        ? 'bg-[#003B7A] text-white ring-4 ring-blue-500/20 shadow-md' 
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {currentStep === 2 ? <Check className="w-5 h-5" /> : (isEn ? '1' : '١')}
                  </button>
                  <span className={`text-[11px] font-extrabold ${currentStep === 1 ? 'text-[#003B7A]' : 'text-slate-500'}`}>
                    {step1Title}
                  </span>
                </div>

                {/* Step 2 Node */}
                <div className="relative z-10 flex flex-col items-center gap-1.5 bg-white px-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) {
                        setCurrentStep(2);
                      }
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                      currentStep === 2 
                        ? 'bg-[#003B7A] text-white ring-4 ring-blue-500/20 shadow-md' 
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}
                  >
                    {isEn ? '2' : '٢'}
                  </button>
                  <span className={`text-[11px] font-extrabold ${currentStep === 2 ? 'text-[#003B7A]' : 'text-slate-400'}`}>
                    {step2Title}
                  </span>
                </div>
              </div>
            </div>

          {/* ========================================================================= */}
          {/* STEP 1: الاسم - البريد الإلكتروني - كلمة المرور - تأكيد كلمة المرور - الشروط - التالي */}
          {/* ========================================================================= */}
          {currentStep === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4 sm:space-y-5 text-right animate-in fade-in duration-300">
              
              {/* 1. Full Name (الاسم) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-extrabold text-[#1e293b] text-right">
                  {currentLang === 'en' ? 'Full Name' : 'الاسم'}
                </label>
                <div className={`relative flex items-center bg-white border ${errors.name ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10'} rounded-2xl overflow-hidden transition-all duration-200 px-3.5`}>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) {
                        setErrors(prev => {
                          const updated = { ...prev };
                          delete updated.name;
                          return updated;
                        });
                      }
                    }}
                    placeholder={currentLang === 'en' ? 'Enter your full name' : 'أدخل اسمك بالكامل'}
                    className="w-full py-3.5 text-slate-800 font-semibold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal text-right"
                  />
                  <User className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
                </div>
                {errors.name && (
                  <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 px-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.name}
                  </span>
                )}
              </div>

              {/* 2. Email (البريد الإلكتروني) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-extrabold text-[#1e293b] text-right">
                  {currentLang === 'en' ? 'Email Address' : 'البريد الإلكتروني'}
                </label>
                <div className={`relative flex items-center bg-white border ${errors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10'} rounded-2xl overflow-hidden transition-all duration-200 px-3.5`}>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) {
                        setErrors(prev => {
                          const updated = { ...prev };
                          delete updated.email;
                          return updated;
                        });
                      }
                    }}
                    dir="ltr"
                    placeholder={currentLang === 'en' ? 'Enter your email address' : 'أدخل بريدك الإلكتروني'}
                    className="w-full py-3.5 text-slate-800 font-semibold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal text-right"
                  />
                  <Mail className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
                </div>
                {errors.email && (
                  <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 px-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email}
                  </span>
                )}
              </div>

              {/* 3 & 4. Password & Confirm Password (كلمة المرور وتأكيد كلمة المرور) */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password (كلمة المرور) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-extrabold text-[#1e293b] text-right">
                      {currentLang === 'en' ? 'Password' : 'كلمة المرور'}
                    </label>
                    <div className={`relative flex items-center bg-white border ${errors.password ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10'} rounded-2xl overflow-hidden transition-all duration-200 px-3.5`}>
                      <input 
                        type="password" 
                        value={password}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPassword(val);
                          if (errors.password) {
                            const hasL = /[a-zA-Z\u0600-\u06FF]/.test(val);
                            const hasN = /[0-9]/.test(val);
                            const hasS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`^]/.test(val);
                            const missing: string[] = [];
                            if (!hasL) missing.push(currentLang === 'en' ? 'letters' : 'أحرف');
                            if (!hasN) missing.push(currentLang === 'en' ? 'numbers' : 'أرقام');
                            if (!hasS) missing.push(currentLang === 'en' ? 'symbols (e.g. @, #, $)' : 'رموز خاصة (مثل @ و # و $)');
                            if (missing.length === 0 && val.length >= 6) {
                              setErrors(prev => {
                                const updated = { ...prev };
                                delete updated.password;
                                return updated;
                              });
                            }
                          }
                        }}
                        placeholder={currentLang === 'en' ? '••••••••' : '••••••••'}
                        className="w-full py-3.5 text-slate-800 font-semibold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal text-right tracking-widest"
                      />
                      <Lock className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
                    </div>
                    {errors.password && (
                      <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 px-1 mt-1 leading-normal">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errors.password}
                      </span>
                    )}
                  </div>

                  {/* Confirm Password (تأكيد كلمة المرور) */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-extrabold text-[#1e293b] text-right">
                      {currentLang === 'en' ? 'Confirm Password' : 'تأكيد كلمة المرور'}
                    </label>
                    <div className={`relative flex items-center bg-white border ${errors.confirmPassword ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10'} rounded-2xl overflow-hidden transition-all duration-200 px-3.5`}>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => {
                          const val = e.target.value;
                          setConfirmPassword(val);
                          if (errors.confirmPassword && val === password) {
                            setErrors(prev => {
                              const updated = { ...prev };
                              delete updated.confirmPassword;
                              return updated;
                            });
                          }
                        }}
                        placeholder={currentLang === 'en' ? 'Repeat password' : 'كرر كلمة المرور'}
                        className="w-full py-3.5 text-slate-800 font-semibold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal text-right"
                      />
                      <Lock className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
                    </div>
                    {errors.confirmPassword && (
                      <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 px-1 mt-1 leading-normal">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        {errors.confirmPassword}
                      </span>
                    )}
                  </div>
                </div>

                {/* Password strength visual hint */}
                {password.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-xs space-y-2">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-600">{currentLang === 'en' ? 'Password strength:' : 'قوة كلمة المرور:'}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-[11px] ${strengthBadgeClass}`}>
                        {strengthText}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full transition-all duration-300 ${barColorClass} ${barWidthClass}`} />
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Terms and Privacy Policy Agreement Checkbox (الموافقة على الشروط) */}
              <div className="pt-1">
                <label className={`flex items-start gap-3 p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer select-none ${errors.terms ? 'border-red-400 bg-red-50/30' : agreedToTerms ? 'border-blue-200 bg-blue-50/20' : 'border-slate-200/80 hover:border-slate-300 bg-slate-50/40'}`}>
                  <input 
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setAgreedToTerms(checked);
                      if (checked && errors.terms) {
                        setErrors(prev => {
                          const updated = { ...prev };
                          delete updated.terms;
                          return updated;
                        });
                      }
                    }}
                    className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 rounded border-slate-300 text-[#003B7A] focus:ring-[#003B7A] shrink-0 cursor-pointer accent-[#003B7A]"
                  />
                  <div className="text-xs sm:text-[13px] leading-relaxed text-slate-700 font-semibold text-right">
                    {currentLang === 'en' ? (
                      <>
                        <span>I agree to the </span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); onNavigate?.('terms'); }}
                          className="text-[#0088cc] hover:underline font-extrabold cursor-pointer"
                        >
                          Terms of Service
                        </button>
                        <span>, </span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); onNavigate?.('privacy'); }}
                          className="text-[#0088cc] hover:underline font-extrabold cursor-pointer"
                        >
                          Privacy Policy
                        </button>
                        <span>, and </span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); onNavigate?.('disclaimer'); }}
                          className="text-[#0088cc] hover:underline font-extrabold cursor-pointer"
                        >
                          Disclaimer
                        </button>
                        <span>. I acknowledge that I am solely responsible for the content published on my medical profile.</span>
                      </>
                    ) : (
                      <>
                        <span>أوافق على </span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); onNavigate?.('terms'); }}
                          className="text-[#0088cc] hover:underline font-extrabold cursor-pointer"
                        >
                          شروط الاستخدام
                        </button>
                        <span>، </span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); onNavigate?.('privacy'); }}
                          className="text-[#0088cc] hover:underline font-extrabold cursor-pointer"
                        >
                          سياسة الخصوصية
                        </button>
                        <span>، و</span>
                        <button 
                          type="button" 
                          onClick={(e) => { e.stopPropagation(); onNavigate?.('disclaimer'); }}
                          className="text-[#0088cc] hover:underline font-extrabold cursor-pointer"
                        >
                          إخلاء المسؤولية
                        </button>
                        <span>. أقر بأنني المسؤول عن صحة البيانات والاعتمادات الطبية.</span>
                      </>
                    )}
                  </div>
                </label>
                {errors.terms && (
                  <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 px-1 mt-1.5 leading-normal">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.terms}
                  </span>
                )}
              </div>

              {/* 6. Next Button (زر التالي) */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#00244c] text-white font-extrabold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg shadow-lg shadow-blue-950/20 transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span>{nextBtnText}</span>
                  {currentLang === 'en' ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
                </button>
              </div>

              {/* Footer Login Link */}
              <div className="pt-2 text-center text-xs sm:text-sm text-slate-500 font-semibold">
                <span>{loginPrompt} </span>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('login');
                    } else {
                      window.location.href = '/login';
                    }
                  }}
                  className="text-[#0066FF] font-bold hover:underline cursor-pointer mr-1"
                >
                  {loginLink}
                </button>
              </div>

            </form>
          )}

          {/* ========================================================================= */}
          {/* STEP 2: رابط البروفايل - المسمى المهني - التخصص - الهاتف والواتساب - الباقة - السابق وإنشاء الحساب */}
          {/* ========================================================================= */}
          {currentStep === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 text-right animate-in fade-in duration-300">
              
              {/* Profile Link (رابط بروفايلك) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-extrabold text-[#1e293b] text-right">
                  {currentLang === 'en' ? 'Your Profile Link' : 'رابط بروفايلك'}
                </label>
                <div dir="ltr" className={`relative flex items-center bg-white border ${errors.nameEn || isUsernameTaken ? 'border-red-500 bg-red-50/20' : isUsernameAvailable ? 'border-emerald-500 bg-emerald-50/10' : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10'} rounded-2xl overflow-hidden transition-all duration-200`}>
                  {/* Prefix on the LEFT */}
                  <div dir="ltr" className="bg-slate-100/90 border-r border-slate-200/80 px-3.5 py-3.5 text-slate-600 font-mono text-xs sm:text-sm font-bold flex items-center shrink-0 select-none">
                    dr-profile.com/
                  </div>
                  {/* Input */}
                  <input 
                    type="text" 
                    value={nameEn}
                    onChange={(e) => handleEnglishNameChange(e.target.value)}
                    dir="ltr"
                    placeholder={currentLang === 'en' ? 'e.g. ahmed' : 'مثال: ahmed'}
                    className="w-full px-3.5 py-3.5 text-slate-800 font-semibold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal text-left"
                  />
                  <LinkIcon className="w-5 h-5 text-slate-400 shrink-0 mr-3.5 ml-1" />
                </div>

                {/* Real-time username availability notice */}
                {cleanUsername.length > 0 && (
                  <div className="mt-1 flex items-center justify-start gap-1.5 text-xs font-bold px-1">
                    {isUsernameTaken ? (
                      <span className="text-red-500 flex items-center gap-1">
                        <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                        {currentLang === 'en' ? 'Username is taken' : 'هذا الرابط محجوز بالفعل، يرجى اختيار اسم آخر.'}
                      </span>
                    ) : (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        {currentLang === 'en' ? 'Profile link is available.' : 'الرابط متاح للاستخدام ✓'}
                      </span>
                    )}
                  </div>
                )}
                {errors.nameEn && !isUsernameTaken && (
                  <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 px-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.nameEn}
                  </span>
                )}
              </div>

              {/* Job Title (المسمى المهني) */}
              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-extrabold text-[#1e293b] text-right">
                  {currentLang === 'en' ? 'Job Title' : 'المسمى المهني'}
                </label>
                <div className={`relative flex items-center bg-white border ${errors.jobTitle ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10'} rounded-2xl overflow-hidden transition-all duration-200 px-3.5`}>
                  <input 
                    type="text" 
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder={currentLang === 'en' ? 'e.g. Consultant Orthopedic Surgeon' : 'أدخل مسمّاك المهني (مثال: استشاري جراحة العظام)'}
                    className="w-full py-3.5 text-slate-800 font-semibold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal text-right"
                  />
                  <Stethoscope className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
                </div>
                {errors.jobTitle && (
                  <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 px-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.jobTitle}
                  </span>
                )}
              </div>

              {/* Specialty (التخصص) */}
              <div className="space-y-1.5 relative">
                <label className="block text-xs sm:text-sm font-extrabold text-[#1e293b] text-right">
                  {currentLang === 'en' ? 'Specialty' : 'التخصص'}
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsOpenSpecialty(!isOpenSpecialty)}
                    className={`w-full px-3.5 py-3.5 bg-white border ${errors.specialty ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus-within:border-blue-600'} rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none flex items-center justify-between transition-all duration-200`}
                  >
                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${isOpenSpecialty ? 'rotate-180' : ''}`} />
                    <span className={`font-semibold text-sm ${specialty ? 'text-slate-800' : 'text-slate-400 font-normal'}`}>
                      {specialty 
                        ? getSpecialtyName(specialties.find(s => s.id === specialty) || { id: specialty, name: specialty }) 
                        : (currentLang === 'en' ? 'Select your specialty' : 'اختر تخصصك')}
                    </span>
                  </button>

                  {isOpenSpecialty && (
                    <>
                      <div 
                        className="fixed inset-0 z-40 bg-transparent" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsOpenSpecialty(false);
                        }} 
                      />
                      <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-y-auto max-h-[280px] divide-y divide-slate-100 scrollbar-thin">
                        {specialties.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              setSpecialty(s.id);
                              setIsOpenSpecialty(false);
                            }}
                            className={`w-full px-4 py-3 text-sm font-semibold hover:bg-slate-50 transition-all flex items-center justify-between text-right ${specialty === s.id ? 'bg-blue-50/60 text-blue-700' : 'text-slate-800'}`}
                          >
                            <span>{getSpecialtyName(s)}</span>
                            {specialty === s.id && <Check className="w-4 h-4 text-blue-600 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
                {errors.specialty && (
                  <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 px-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.specialty}
                  </span>
                )}
              </div>

              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-extrabold text-[#1e293b] text-right">
                    {currentLang === 'en' ? 'Phone Number' : 'رقم الهاتف'}
                  </label>
                  <div className={`relative flex items-center bg-white border ${errors.phone ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10'} rounded-2xl overflow-hidden transition-all duration-200 px-3.5`}>
                    <input 
                      type="text" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      dir="ltr"
                      placeholder={currentLang === 'en' ? 'Enter phone number' : 'أدخل رقم هاتفك'}
                      className="w-full py-3.5 text-slate-800 font-semibold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal text-right"
                    />
                    <Phone className="w-5 h-5 text-slate-400 shrink-0 ml-3" />
                  </div>
                  {errors.phone && (
                    <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 px-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-extrabold text-[#1e293b] text-right">
                    {currentLang === 'en' ? 'WhatsApp Number' : 'رقم الواتساب'}
                  </label>
                  <div className={`relative flex items-center bg-white border ${errors.whatsapp ? 'border-red-500 bg-red-50/20' : 'border-slate-200 focus-within:border-blue-600 focus-within:ring-4 focus-within:ring-blue-500/10'} rounded-2xl overflow-hidden transition-all duration-200 px-3.5`}>
                    <input 
                      type="text" 
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      dir="ltr"
                      placeholder={currentLang === 'en' ? 'Enter WhatsApp number' : 'أدخل رقم واتسابك'}
                      className="w-full py-3.5 text-slate-800 font-semibold text-sm focus:outline-none placeholder:text-slate-400 placeholder:font-normal text-right"
                    />
                    <div className="shrink-0 ml-3 flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                      </svg>
                    </div>
                  </div>
                  {errors.whatsapp && (
                    <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 px-1 mt-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {errors.whatsapp}
                    </span>
                  )}
                </div>
              </div>

              {/* Avatar Upload */}
              <div className="space-y-1.5">
                <div className="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="avatar-file-upload"
                  />
                  <label 
                    htmlFor="avatar-file-upload"
                    className={`flex items-center justify-between border ${errors.avatar ? 'border-red-500 bg-red-50/20' : 'border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-slate-50'} rounded-2xl p-3.5 cursor-pointer transition-all duration-200`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Camera className={`w-5 h-5 ${errors.avatar ? 'text-red-500' : 'text-blue-600'}`} />
                      <span className="text-xs sm:text-sm font-bold text-slate-700">
                        {currentLang === 'en' ? 'Profile Photo (Required)' : 'صورة البروفايل (إجباري)'}
                      </span>
                    </div>
                    {avatarUrl ? (
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        {currentLang === 'en' ? 'Uploaded ✓' : 'تم الرفع ✓'}
                      </span>
                    ) : (
                      <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2.5 py-1 rounded-lg">
                        {currentLang === 'en' ? 'Choose file *' : 'اختر صورة *'}
                      </span>
                    )}
                  </label>
                </div>
                {errors.avatar && (
                  <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 px-1 mt-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.avatar}
                  </span>
                )}
              </div>

              {/* Action Buttons: Submit and Back */}
              <div className="pt-3 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="w-full sm:w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold py-3.5 rounded-xl sm:rounded-2xl text-sm sm:text-base transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 order-2 sm:order-1"
                >
                  {currentLang === 'en' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  <span>{prevBtnText}</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-2/3 bg-[#003B7A] hover:bg-[#002d5e] active:bg-[#00244c] text-white font-extrabold py-3.5 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg shadow-lg shadow-blue-950/20 transition-all duration-200 cursor-pointer active:scale-[0.99] flex items-center justify-center gap-2 order-1 sm:order-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{submittingBtnText}</span>
                    </>
                  ) : (
                    <span>{submitBtnText}</span>
                  )}
                </button>
              </div>

              {/* Footer Login Link */}
              <div className="pt-2 text-center text-xs sm:text-sm text-slate-500 font-semibold">
                <span>{loginPrompt} </span>
                <button
                  type="button"
                  onClick={() => {
                    if (onNavigate) {
                      onNavigate('login');
                    } else {
                      window.location.href = '/login';
                    }
                  }}
                  className="text-[#0066FF] font-bold hover:underline cursor-pointer mr-1"
                >
                  {loginLink}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>

    </section>
  );
}
