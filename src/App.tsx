/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';

import Features from './components/Features';
import Subscription from './components/Subscription';
import ClientWorks from './components/ClientWorks';
import FAQ from './components/FAQ';
import CtaBanner from './components/CtaBanner';
import CreateSiteForm from './components/CreateSiteForm';
import ContactWhatsApp from './components/ContactWhatsApp';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import DoctorProfile from './components/DoctorProfile';
import AdminPanel from './components/AdminPanel';
import LegalPage from './components/LegalPage';

import { 
  Doctor, Appointment, Review, LandingPageConfig, DEFAULT_LANDING_CONFIG,
  INITIAL_DOCTORS, INITIAL_APPOINTMENTS, INITIAL_SPECIALTIES,
  DoctorBanner, INITIAL_BANNERS, sanitizeDoctorDates, SystemSpecialty
} from './types';
import { DEMO_DOCTORS } from './data/demoDoctors';
import { AlertCircle, Stethoscope, Clock, ShieldCheck, Check, Sparkles, X } from 'lucide-react';
import {
  isDoctorTrialActive,
  isDoctorTrialExpired,
  getDoctorRemainingTrialDays,
  isDoctorProfilePubliclyVisible,
  createPaidSubscriptionUpdate
} from './lib/subscriptionUtils';
import {
  subscribeDoctors, saveDoctorInDb, deleteDoctorFromDb, seedDoctorsIfEmpty,
  subscribeAppointments, saveAppointmentInDb, seedAppointmentsIfEmpty,
  subscribeLandingConfig, saveLandingConfigInDb, seedLandingConfigIfEmpty,
  subscribeBanners, saveBannersInDb, deleteBannerFromDb, seedBannersIfEmpty,
  subscribeSpecialties, saveSpecialtiesInDb, seedSpecialtiesIfEmpty
} from './lib/firebase';
import {
  saveDoctorToSupabase,
  saveAppointmentToSupabase,
  saveLandingConfigToSupabase,
  saveBannersToSupabase,
  deleteDoctorFromSupabase,
  deleteBannerFromSupabase,
  seedAllDataToSupabase,
  fetchDoctorsFromSupabase,
  fetchAppointmentsFromSupabase,
  fetchLandingConfigFromSupabase,
  fetchBannersFromSupabase
} from './lib/supabase';


const sanitizeLandingConfig = (config: LandingPageConfig): LandingPageConfig => {
  if (!config) return DEFAULT_LANDING_CONFIG;
  const FORCED_FEATURES = [
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
  ];
  
  const mergedPricing = {
    ...DEFAULT_LANDING_CONFIG.pricing,
    ...(config.pricing || {}),
    plan5Months: {
      ...(config.pricing?.plan5Months || {}),
      title: config.pricing?.plan5Months?.title || "اشتراك لمدة 6 أشهر",
      price: config.pricing?.plan5Months?.price || "1500",
      period: config.pricing?.plan5Months?.period || "ج.م / 6 أشهر",
      discountText: config.pricing?.plan5Months?.discountText !== undefined ? config.pricing.plan5Months.discountText : "",
      features: (config.pricing?.plan5Months?.features && config.pricing.plan5Months.features.length > 0)
        ? config.pricing.plan5Months.features
        : FORCED_FEATURES
    },
    plan1Year: {
      ...(config.pricing?.plan1Year || {}),
      title: (config.pricing?.plan1Year?.title || "اشتراك لمدة سنة").replace(/\s*\(العرض الأوفر\)/g, ""),
      price: config.pricing?.plan1Year?.price || "2500",
      period: config.pricing?.plan1Year?.period || "ج.م / سنة",
      discountText: config.pricing?.plan1Year?.discountText !== undefined ? config.pricing.plan1Year.discountText : "",
      features: (config.pricing?.plan1Year?.features && config.pricing.plan1Year.features.length > 0)
        ? config.pricing.plan1Year.features
        : FORCED_FEATURES
    },
    ctaText: config.pricing?.ctaText || "ابدأ الآن مجاناً",
    bottomBannerTitle: config.pricing?.bottomBannerTitle || DEFAULT_LANDING_CONFIG.pricing?.bottomBannerTitle || "كل اللي محتاجه علشان تعرض خدماتك الطبية أونلاين في مكان واحد",
    bottomBannerButtonText: config.pricing?.bottomBannerButtonText || DEFAULT_LANDING_CONFIG.pricing?.bottomBannerButtonText || "ابدأ الآن مجاناً"
  };

  if (mergedPricing.ctaText === 'اشترك الآن') {
    mergedPricing.ctaText = 'ابدأ الآن مجاناً';
  }

  const mergedCreateSite = {
    ...DEFAULT_LANDING_CONFIG.createSite,
    ...(config.createSite || {})
  };
  if (!mergedCreateSite.headerCtaButtonText || mergedCreateSite.headerCtaButtonText === 'ابدأ تجربتك المجانية' || mergedCreateSite.headerCtaButtonText === 'أنشئ الآن' || mergedCreateSite.headerCtaButtonText === 'اشترك الآن') {
    mergedCreateSite.headerCtaButtonText = 'ابدأ الآن مجاناً';
  }
  if (!mergedCreateSite.heroCtaButtonText || mergedCreateSite.heroCtaButtonText === 'أنشئ الآن' || mergedCreateSite.heroCtaButtonText === 'اشترك الآن') {
    mergedCreateSite.heroCtaButtonText = 'ابدأ الآن مجاناً';
  }
  if (!mergedCreateSite.logoUrl) {
    mergedCreateSite.logoUrl = 'https://d.top4top.io/p_3875rj4l41.png';
  }
  if (!mergedCreateSite.title) {
    mergedCreateSite.title = 'انشئ حساب مجاني';
  }
  if (!mergedCreateSite.step1Title) {
    mergedCreateSite.step1Title = 'انشئ حساب مجاني';
  }
  if (!mergedCreateSite.step2Title) {
    mergedCreateSite.step2Title = 'بيانات البروفايل';
  }
  if (!mergedCreateSite.nextButtonText) {
    mergedCreateSite.nextButtonText = 'التالي';
  }
  if (!mergedCreateSite.backButtonText) {
    mergedCreateSite.backButtonText = 'السابق';
  }
  if (!mergedCreateSite.submitButtonText || mergedCreateSite.submitButtonText === 'أنشئ الآن' || mergedCreateSite.submitButtonText === 'اشترك الآن') {
    mergedCreateSite.submitButtonText = 'انشئ حساب مجاني';
  }
  if (!mergedCreateSite.submittingButtonText) {
    mergedCreateSite.submittingButtonText = 'جاري إنشاء الحساب...';
  }
  if (!mergedCreateSite.loginPromptText) {
    mergedCreateSite.loginPromptText = 'لديكم حساب بالفعل؟';
  }
  if (!mergedCreateSite.loginLinkText) {
    mergedCreateSite.loginLinkText = 'تسجيل الدخول';
  }

  const mergedHero = {
    ...DEFAULT_LANDING_CONFIG.hero,
    ...(config.hero || {}),
    heroDesktopImage: config.hero?.heroDesktopImage || DEFAULT_LANDING_CONFIG.hero.heroDesktopImage,
    heroMobileImage: config.hero?.heroMobileImage || DEFAULT_LANDING_CONFIG.hero.heroMobileImage,
  };
  if (!mergedHero.primaryCtaText || mergedHero.primaryCtaText === 'أنشئ الآن' || mergedHero.primaryCtaText === 'اشترك الآن') {
    mergedHero.primaryCtaText = 'ابدأ الآن مجاناً';
  }

  const mergedClientWorks = {
    ...DEFAULT_LANDING_CONFIG.clientWorks,
    ...(config.clientWorks || {})
  };
  if (!mergedClientWorks.title || mergedClientWorks.title === 'سابقة الأعمال' || mergedClientWorks.title === 'معاينة' || mergedClientWorks.title === 'نماذج تجريبية' || mergedClientWorks.title === 'نماذج من بروفايلات الأطباء') {
    mergedClientWorks.title = 'أمثلة من البروفايلات';
  }

  const mergedLogin = {
    ...DEFAULT_LANDING_CONFIG.login,
    ...(config.login || {})
  };
  if (!mergedLogin.title || mergedLogin.title === 'تسجيل الدخول إلى حسابك') {
    mergedLogin.title = 'تسجيل الدخول';
  }
  if (mergedLogin.subtitle === 'أدخل بياناتك للوصول إلى لوحة تحكم العيادة') {
    mergedLogin.subtitle = '';
  }

  const mergedFeatures = {
    ...DEFAULT_LANDING_CONFIG.features,
    ...(config.features || {}),
    categories: (config.features?.categories && config.features.categories.length > 0)
      ? config.features.categories.map((cat, idx) => {
          const defaultCat = DEFAULT_LANDING_CONFIG.features.categories[idx];
          return {
            ...(defaultCat || {}),
            ...cat,
            items: (cat.items && Array.isArray(cat.items)) ? cat.items : (defaultCat?.items || []),
            imageUrl: cat.imageUrl || defaultCat?.imageUrl
          };
        })
      : DEFAULT_LANDING_CONFIG.features.categories
  };

  const mergedOverview = {
    ...DEFAULT_LANDING_CONFIG.overview,
    ...(config.overview || {})
  };

  const mergedCtaBanner = {
    ...DEFAULT_LANDING_CONFIG.ctaBanner,
    ...(config.ctaBanner || {})
  };

  const hasOldFaqDefaults = config.faq?.items?.length === 4 && config.faq?.items[0]?.question?.includes('جميع الأجهزة');
  const mergedFaq = {
    ...DEFAULT_LANDING_CONFIG.faq,
    ...(config.faq || {}),
    title: config.faq?.title || DEFAULT_LANDING_CONFIG.faq?.title || 'أسئلة متكررة',
    subtitle: config.faq?.subtitle || DEFAULT_LANDING_CONFIG.faq?.subtitle || 'إجابات عن أهم الاستفسارات المتكررة حول المنصة وطريقة العمل',
    items: (config.faq?.items && config.faq.items.length > 0 && !hasOldFaqDefaults) ? config.faq.items : DEFAULT_LANDING_CONFIG.faq?.items || []
  };

  const mergedFooter = {
    ...DEFAULT_LANDING_CONFIG.footer,
    ...(config.footer || {})
  };

  const mergedContact = {
    ...DEFAULT_LANDING_CONFIG.contact,
    ...(config.contact || {})
  };

  const mergedImportantPages = {
    ...DEFAULT_LANDING_CONFIG.importantPages,
    ...(config.importantPages || {}),
    about: {
      ...DEFAULT_LANDING_CONFIG.importantPages?.about,
      ...(config.importantPages?.about || {})
    }
  };

  return {
    ...DEFAULT_LANDING_CONFIG,
    ...config,
    pricing: mergedPricing,
    hero: mergedHero,
    features: mergedFeatures,
    overview: mergedOverview,
    ctaBanner: mergedCtaBanner,
    faq: mergedFaq,
    contact: mergedContact,
    footer: mergedFooter,
    createSite: mergedCreateSite,
    clientWorks: mergedClientWorks,
    login: mergedLogin,
    importantPages: mergedImportantPages
  };
};


export default function App() {
  // Auth state initialized from localStorage so session survives browser reloads
  const [currentUserRole, setCurrentUserRole] = useState<'admin' | 'doctor' | 'secretary' | null>(() => {
    try {
      const saved = localStorage.getItem('dr_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.role || null;
      }
    } catch (e) {
      console.error("Failed to load session role", e);
    }
    return null;
  });

  const [currentDoctorId, setCurrentDoctorId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('dr_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.doctorId || null;
      }
    } catch (e) {
      console.error("Failed to load session doctorId", e);
    }
    return null;
  });

  const [currentSecretaryId, setCurrentSecretaryId] = useState<string | null>(() => {
    try {
      const saved = localStorage.getItem('dr_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.secretaryId || null;
      }
    } catch (e) {
      console.error("Failed to load session secretaryId", e);
    }
    return null;
  });

  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'features' | 'subscription' | 'contact' | 'login' | 'dashboard' | 'admin' | 'dr' | 'create' | 'clientWorks' | 'terms' | 'privacy' | 'disclaimer' | 'about'>(() => {
    try {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path === '/login' || hash === '#login') return 'login';
      if (path === '/register' || path === '/create' || hash === '#register' || hash === '#create' || hash === '#/register' || hash === '#/create' || hash === '#create-site' || hash === '#register-section') return 'create';
      if (path === '/features' || hash === '#features' || hash === '#/features') return 'features';
      if (path === '/pricing' || path === '/subscription' || hash === '#pricing' || hash === '#subscription' || hash === '#/pricing' || hash === '#/subscription') return 'subscription';
      if (path === '/contact' || hash === '#contact' || hash === '#/contact') return 'contact';
      if (path === '/demos' || path === '/client-works' || hash === '#demos' || hash === '#client-works' || hash === '#/demos' || hash === '#/client-works') return 'clientWorks';
      if (path === '/about' || hash === '#about' || hash === '#/about') return 'about';
      if (path === '/terms' || hash === '#terms' || hash === '#/terms') return 'terms';
      if (path === '/privacy' || hash === '#privacy' || hash === '#/privacy') return 'privacy';
      if (path === '/disclaimer' || hash === '#disclaimer' || hash === '#/disclaimer') return 'disclaimer';
      if (path.includes('/dr/') || path.includes('/doctor/') || hash.includes('dr/') || hash.includes('doctor/')) return 'dr';

      const saved = localStorage.getItem('dr_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.role === 'admin') return 'admin';
        if ((parsed.role === 'doctor' || parsed.role === 'secretary') && parsed.doctorId) return 'dashboard';
      }
    } catch (e) {
      console.error("Failed to load session view", e);
    }
    return 'landing';
  });
  
  // Public viewing slug/English username (e.g. "mohamed-jaber")
  const [viewingDoctorEn, setViewingDoctorEn] = useState<string | null>(null);

  // Global dynamic states
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem('dr_appointments');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.error("Failed to load saved appointments", e);
    }
    return [];
  });

  const [currentLang, setCurrentLang] = useState<'ar' | 'en'>(() => {
    try {
      return (localStorage.getItem('app_lang') as 'ar' | 'en') || 'ar';
    } catch {
      return 'ar';
    }
  });

  useEffect(() => {
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;

    const handleLangChange = (e: any) => {
      const nextLang = e?.detail || (localStorage.getItem('app_lang') as 'ar' | 'en') || 'ar';
      setCurrentLang(nextLang);
    };

    window.addEventListener('languageChange', handleLangChange);
    return () => {
      window.removeEventListener('languageChange', handleLangChange);
    };
  }, [currentLang]);

  // Active section tracking on landing page for dynamic tab title
  const [activeLandingSection, setActiveLandingSection] = useState<string>(() => {
    try {
      const hash = window.location.hash.replace('#', '');
      return hash || 'hero';
    } catch {
      return 'hero';
    }
  });

  useEffect(() => {
    const handleSectionChange = (e: any) => {
      if (e?.detail) {
        setActiveLandingSection(e.detail);
      }
    };
    const handleHash = () => {
      const h = window.location.hash.replace('#', '');
      if (h) setActiveLandingSection(h);
    };

    window.addEventListener('landing_section_change', handleSectionChange);
    window.addEventListener('hashchange', handleHash);
    return () => {
      window.removeEventListener('landing_section_change', handleSectionChange);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  const [preselectedPlan, setPreselectedPlan] = useState<'5months' | '1year'>('5months');
  const [landingConfig, setLandingConfig] = useState<LandingPageConfig>(() => {
    try {
      const saved = localStorage.getItem('dr_landing_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        return sanitizeLandingConfig(parsed);
      }
    } catch (e) {
      console.error("Failed to load saved landing config", e);
    }
    return DEFAULT_LANDING_CONFIG;
  });

  const [doctorBanners, setDoctorBanners] = useState<DoctorBanner[]>(() => {
    try {
      const saved = localStorage.getItem('dr_banners');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load saved banners", e);
    }
    return INITIAL_BANNERS;
  });

  const [specialties, setSpecialties] = useState<SystemSpecialty[]>(() => {
    try {
      const saved = localStorage.getItem('dr_specialties');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error("Failed to load saved specialties", e);
    }
    return INITIAL_SPECIALTIES;
  });

  // Sync doctors & appointments to localStorage
  useEffect(() => {
    try {
      if (doctors) {
        localStorage.setItem('dr_doctors', JSON.stringify(doctors));
      }
    } catch (e) {
      console.error("Failed to sync doctors to localStorage", e);
    }
  }, [doctors]);

  // Listen for storage events (e.g. registration in another tab) and custom events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dr_doctors' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            setDoctors(parsed.map(d => sanitizeDoctorDates(d)));
          }
        } catch {}
      }
    };

    const handleCustomDoctorUpdate = (e: any) => {
      if (e?.detail) {
        setDoctors(prev => {
          const newDoc = sanitizeDoctorDates(e.detail);
          const filtered = prev.filter(d => d.id !== newDoc.id);
          const updated = [newDoc, ...filtered];
          return updated;
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('dr_doctors_updated', handleCustomDoctorUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('dr_doctors_updated', handleCustomDoctorUpdate);
    };
  }, []);

  useEffect(() => {
    try {
      if (appointments) {
        localStorage.setItem('dr_appointments', JSON.stringify(appointments));
      }
    } catch (e) {
      console.error("Failed to sync appointments to localStorage", e);
    }
  }, [appointments]);

  // Fetch real data from Supabase on mount - OPTIMIZED: Only fetch initial config/specialties if needed, fetch doctor/appointments on-demand or with pagination.
  useEffect(() => {
    const loadCoreData = async () => {
      try {
        // Just fetch essential data initially.
        const supaConfig = await fetchLandingConfigFromSupabase();
        if (supaConfig) {
          const sanitized = sanitizeLandingConfig(supaConfig);
          setLandingConfig(sanitized);
          localStorage.setItem('dr_landing_config', JSON.stringify(sanitized));
        }
      } catch (err) {
        console.warn('Error loading core data on mount:', err);
      }
    };
    loadCoreData();
  }, []);


  // Firestore Real-time Subscriptions and Auto-seeding
  useEffect(() => {
    // Seed initial data to Firestore if empty
    seedDoctorsIfEmpty(INITIAL_DOCTORS);
    seedAppointmentsIfEmpty(INITIAL_APPOINTMENTS);
    seedLandingConfigIfEmpty(DEFAULT_LANDING_CONFIG);
    seedBannersIfEmpty(INITIAL_BANNERS);
    seedSpecialtiesIfEmpty(INITIAL_SPECIALTIES);

    // Auto-sync any existing local doctors to Firestore and Supabase
    try {
      const savedDocsStr = localStorage.getItem('dr_doctors');
      if (savedDocsStr) {
        const savedDocs = JSON.parse(savedDocsStr);
        if (Array.isArray(savedDocs)) {
          savedDocs.forEach(d => {
            if (d && d.id) {
              saveDoctorInDb(sanitizeDoctorDates(d));
              saveDoctorToSupabase(sanitizeDoctorDates(d));
            }
          });
        }
      }
    } catch (e) {
      console.warn('Local doctors sync error:', e);
    }

    // Auto-seed to user's Supabase database initially
    seedAllDataToSupabase(INITIAL_DOCTORS, INITIAL_APPOINTMENTS, DEFAULT_LANDING_CONFIG, INITIAL_BANNERS);

    // Subscribe to Firestore collections in real-time
    const unsubDoctors = subscribeDoctors((fireDocs) => {
      setDoctors(prev => {
        return fireDocs.map(d => sanitizeDoctorDates(d));
      });
      // Automatically ensure every real doctor in the database is synced to Supabase
      fireDocs.forEach(doc => {
        saveDoctorToSupabase(doc);
      });
    });

    const unsubAppointments = subscribeAppointments((fireApts) => {
      if (fireApts.length > 0) {
        setAppointments(prev => {
          const map = new Map<string, Appointment>();
          prev.forEach(a => map.set(a.id, a));
          fireApts.forEach(a => map.set(a.id, a));
          const merged = Array.from(map.values());
          try {
            localStorage.setItem('dr_appointments', JSON.stringify(merged));
          } catch (e) {}
          return merged;
        });
        // Automatically ensure every appointment is synced to Supabase
        fireApts.forEach(apt => {
          saveAppointmentToSupabase(apt);
        });
      }
    });

    const unsubConfig = subscribeLandingConfig((fireConfig) => {
      if (fireConfig) {
        const sanitized = sanitizeLandingConfig(fireConfig);
        setLandingConfig(sanitized);
        try {
          localStorage.setItem('dr_landing_config', JSON.stringify(sanitized));
        } catch (e) {
          console.error("Failed to sync landing config to localStorage", e);
        }
      }
    });

    const unsubBanners = subscribeBanners((fireBanners) => {
      setDoctorBanners(fireBanners);
      try {
        localStorage.setItem('dr_banners', JSON.stringify(fireBanners));
      } catch (e) {}
    });

    const unsubSpecialties = subscribeSpecialties((fireSpecialties) => {
      if (fireSpecialties && fireSpecialties.length > 0) {
        setSpecialties(fireSpecialties);
        try {
          localStorage.setItem('dr_specialties', JSON.stringify(fireSpecialties));
        } catch (e) {}
      }
    });

    return () => {
      unsubDoctors();
      unsubAppointments();
      unsubConfig();
      unsubBanners();
      unsubSpecialties();
    };
  }, []);

  useEffect(() => {
    const isEn = currentLang === 'en';
    const siteBrand = isEn ? 'Doctor Profile' : 'دكتور بروفايل';
    let newTitle = '';

    // Find doctors if needed
    const viewingDoc = viewingDoctorEn ? doctors.find(d => 
      (d.nameEn && d.nameEn.toLowerCase() === viewingDoctorEn.toLowerCase()) || 
      d.id.toLowerCase() === viewingDoctorEn.toLowerCase() ||
      (d.name && d.name.toLowerCase() === viewingDoctorEn.toLowerCase()) ||
      (d.name && d.name.replace(/\s+/g, '-').toLowerCase() === viewingDoctorEn.toLowerCase())
    ) : undefined;

    const currentDoc = currentDoctorId ? doctors.find(d => d.id === currentDoctorId) : undefined;

    switch (currentView) {
      case 'features':
        newTitle = isEn ? `Features | ${siteBrand}` : `المميزات | ${siteBrand}`;
        break;
      case 'subscription':
        newTitle = isEn ? `Pricing & Subscriptions | ${siteBrand}` : `باقات الاشتراك والأسعار | ${siteBrand}`;
        break;
      case 'clientWorks':
        newTitle = isEn ? `Doctor Profiles & Demos | ${siteBrand}` : `أطباء المنصة والنماذج | ${siteBrand}`;
        break;
      case 'contact':
        newTitle = isEn ? `Contact Us | ${siteBrand}` : `تواصل معنا | ${siteBrand}`;
        break;
      case 'create':
        newTitle = isEn ? `Join as Doctor | ${siteBrand}` : `انضمام كطبيب جديد | ${siteBrand}`;
        break;
      case 'login':
        newTitle = isEn ? `Login | ${siteBrand}` : `تسجيل الدخول | ${siteBrand}`;
        break;
      case 'admin':
        newTitle = isEn ? `Admin Dashboard | ${siteBrand}` : `لوحة إدارة المنصة | ${siteBrand}`;
        break;
      case 'dashboard':
        if (currentDoc) {
          const docName = isEn ? (currentDoc.nameEn || currentDoc.name) : currentDoc.name;
          newTitle = isEn ? `Dashboard - Dr. ${docName} | ${siteBrand}` : `لوحة تحكم الطبيب - د. ${docName} | ${siteBrand}`;
        } else {
          newTitle = isEn ? `Medical Dashboard | ${siteBrand}` : `لوحة التحكم الطبية | ${siteBrand}`;
        }
        break;
      case 'dr':
        if (viewingDoc) {
          const docName = isEn ? (viewingDoc.nameEn || viewingDoc.name) : viewingDoc.name;
          const titleOrSpecialty = viewingDoc.jobTitle || viewingDoc.specialty || (isEn ? 'Medical Clinic' : 'عيادة طبية');
          newTitle = isEn ? `Dr. ${docName} - ${titleOrSpecialty} | ${siteBrand}` : `د. ${docName} - ${titleOrSpecialty} | ${siteBrand}`;
        } else {
          newTitle = isEn ? `Doctor Profile | ${siteBrand}` : `الصفحة الشخصية للطبيب | ${siteBrand}`;
        }
        break;
      case 'about':
        newTitle = isEn ? `About Us | ${siteBrand}` : `من نحن | ${siteBrand}`;
        break;
      case 'terms':
        newTitle = isEn ? `Terms & Conditions | ${siteBrand}` : `الشروط والأحكام | ${siteBrand}`;
        break;
      case 'privacy':
        newTitle = isEn ? `Privacy Policy | ${siteBrand}` : `سياسة الخصوصية | ${siteBrand}`;
        break;
      case 'disclaimer':
        newTitle = isEn ? `Disclaimer | ${siteBrand}` : `إخلاء المسؤولية | ${siteBrand}`;
        break;
      case 'landing':
      default: {
        const sec = (activeLandingSection || '').toLowerCase().replace('#', '');
        if (sec === 'features') {
          newTitle = isEn ? `Features | ${siteBrand}` : `المميزات | ${siteBrand}`;
        } else if (sec === 'subscription' || sec === 'pricing') {
          newTitle = isEn ? `Pricing & Subscriptions | ${siteBrand}` : `باقات الاشتراك والأسعار | ${siteBrand}`;
        } else if (sec === 'client-works' || sec === 'clientworks' || sec === 'demos') {
          newTitle = isEn ? `Doctor Profiles & Demos | ${siteBrand}` : `نماذج أعمال الأطباء | ${siteBrand}`;
        } else if (sec === 'specialties') {
          newTitle = isEn ? `Medical Specialties | ${siteBrand}` : `التخصصات الطبية | ${siteBrand}`;
        } else if (sec === 'faq') {
          newTitle = isEn ? `FAQ | ${siteBrand}` : `الأسئلة الشائعة | ${siteBrand}`;
        } else if (sec === 'contact') {
          newTitle = isEn ? `Contact Us | ${siteBrand}` : `تواصل معنا | ${siteBrand}`;
        } else if (sec === 'reviews') {
          newTitle = isEn ? `Doctor Reviews | ${siteBrand}` : `آراء وتقييمات الأطباء | ${siteBrand}`;
        } else if (sec === 'about') {
          newTitle = isEn ? `About Us | ${siteBrand}` : `عن المنصة | ${siteBrand}`;
        } else {
          const seo = landingConfig?.seo;
          const customMeta = seo?.metaTitle;
          if (customMeta && customMeta.trim() && customMeta !== 'منصة شفاء الطبية | بروفايل طبي احترافي للأطباء وحجز مواعيد العيادات') {
            newTitle = customMeta;
          } else {
            newTitle = isEn 
              ? `Doctor Profile | Professional Medical Profile for Doctors` 
              : `الرئيسية | دكتور بروفايل - بروفايل طبي احترافي للأطباء`;
          }
        }
        break;
      }
    }

    document.title = newTitle;

    const seo = landingConfig?.seo;
    if (seo?.metaKeywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement('meta');
        keywordsMeta.setAttribute('name', 'keywords');
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute('content', seo.metaKeywords);
    }

    if (seo?.metaDescription) {
      let descMeta = document.querySelector('meta[name="description"]');
      if (!descMeta) {
        descMeta = document.createElement('meta');
        descMeta.setAttribute('name', 'description');
        document.head.appendChild(descMeta);
      }
      descMeta.setAttribute('content', seo.metaDescription);
    }

    // Dynamic Favicon Update for Browser Tab
    const faviconUrl = seo?.faviconUrl || landingConfig?.faviconUrl || 'https://k.top4top.io/p_38573eitn0.png';
    if (faviconUrl) {
      let iconLinks = document.querySelectorAll<HTMLLinkElement>("link[rel*='icon']");
      if (iconLinks.length > 0) {
        iconLinks.forEach(link => {
          link.href = faviconUrl;
        });
      } else {
        const iconLink = document.createElement('link');
        iconLink.rel = 'shortcut icon';
        iconLink.href = faviconUrl;
        document.head.appendChild(iconLink);
      }
    }
  }, [
    currentView,
    activeLandingSection,
    currentLang,
    viewingDoctorEn,
    currentDoctorId,
    doctors,
    landingConfig?.seo?.metaTitle,
    landingConfig?.seo?.metaKeywords,
    landingConfig?.seo?.metaDescription,
    landingConfig?.seo?.faviconUrl,
    landingConfig?.faviconUrl
  ]);

  // Persist session changes to localStorage so session survives browser refresh
  useEffect(() => {
    try {
      if (currentUserRole) {
        localStorage.setItem('dr_session', JSON.stringify({
          role: currentUserRole,
          doctorId: currentDoctorId,
          secretaryId: currentSecretaryId,
          view: currentView
        }));
      } else {
        localStorage.removeItem('dr_session');
      }
    } catch (e) {
      console.error("Failed to save session to localStorage", e);
    }
  }, [currentUserRole, currentDoctorId, currentSecretaryId, currentView]);

  const handleUpdateLandingConfig = (newConfig: LandingPageConfig) => {
    const sanitized = sanitizeLandingConfig(newConfig);
    setLandingConfig(sanitized);
    saveLandingConfigInDb(sanitized);
    saveLandingConfigToSupabase(sanitized);
    try {
      localStorage.setItem('dr_landing_config', JSON.stringify(sanitized));
    } catch (e) {
      console.error("Failed to save landing config", e);
    }
  };

  const handleUpdateDoctors = (updatedDocs: Doctor[]) => {
    // Delete doctors that were removed
    const newIds = new Set(updatedDocs.map(d => d.id));
    doctors.forEach(d => {
      if (!newIds.has(d.id)) {
        deleteDoctorFromDb(d.id);
        deleteDoctorFromSupabase(d.id);
      }
    });

    const oldDoctorsMap = new Map(doctors.map(d => [d.id, d]));
    
    setDoctors(updatedDocs);
    updatedDocs.forEach(d => {
      const oldDoc = oldDoctorsMap.get(d.id);
      if (!oldDoc || JSON.stringify(oldDoc) !== JSON.stringify(d)) {
        saveDoctorInDb(d);
        saveDoctorToSupabase(d);
      }
    });
    try {
      localStorage.setItem('dr_doctors', JSON.stringify(updatedDocs));
    } catch (e) {
      console.error("Failed to save doctors", e);
    }
  };

  const handleUpdateSpecialties = (newSpecs: SystemSpecialty[]) => {
    setSpecialties(newSpecs);
    // Only save changed
    const oldSpecsMap = new Map(specialties.map(s => [s.id, s]));
    newSpecs.forEach(s => {
       const oldS = oldSpecsMap.get(s.id);
       if (!oldS || JSON.stringify(oldS) !== JSON.stringify(s)) {
          // It's technically saveSpecialtiesInDb which takes an array... wait.
          // In firebase.ts, saveSpecialtiesInDb loops over array and saves each.
          // So passing a filtered array is better.
       }
    });
    // Actually, I'll just filter it
    const changedSpecs = newSpecs.filter(s => {
       const oldS = oldSpecsMap.get(s.id);
       return !oldS || JSON.stringify(oldS) !== JSON.stringify(s);
    });
    if (changedSpecs.length > 0) {
      saveSpecialtiesInDb(changedSpecs);
    }
    
    try {
      localStorage.setItem('dr_specialties', JSON.stringify(newSpecs));
    } catch (e) {
      console.error("Failed to save specialties", e);
    }
  };

  const handleUpdateBanners = (newBanners: DoctorBanner[]) => {
    // Permanently remove any banner that was deleted
    const newIds = new Set(newBanners.map(b => b.id));
    doctorBanners.forEach(b => {
      if (!newIds.has(b.id)) {
        deleteBannerFromDb(b.id);
        deleteBannerFromSupabase(b.id);
      }
    });

    setDoctorBanners(newBanners);
    
    const oldBannersMap = new Map(doctorBanners.map(b => [b.id, b]));
    const changedBanners = newBanners.filter(b => {
      const oldB = oldBannersMap.get(b.id);
      return !oldB || JSON.stringify(oldB) !== JSON.stringify(b);
    });
    
    if (changedBanners.length > 0) {
      saveBannersInDb(changedBanners);
      saveBannersToSupabase(changedBanners);
    }
    
    try {
      localStorage.setItem('dr_banners', JSON.stringify(newBanners));
    } catch (e) {
      console.error("Failed to save banners", e);
    }
  };

  // Synchronize state with URL routing on load and back/forward navigation
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const searchParams = new URLSearchParams(window.location.search);

      // Check /login or #login
      if (path === '/login' || hash === '#login' || hash === '#/login') {
        setCurrentView('login');
        return;
      }

      // Check /features or #features
      if (path === '/features' || hash === '#features' || hash === '#/features') {
        setCurrentView('features');
        return;
      }

      // Check /pricing or /subscription or #pricing or #subscription
      if (path === '/pricing' || path === '/subscription' || hash === '#pricing' || hash === '#subscription' || hash === '#/pricing' || hash === '#/subscription') {
        setCurrentView('subscription');
        return;
      }

      // Check /demos or /client-works or #demos or #client-works
      if (path === '/demos' || path === '/client-works' || hash === '#demos' || hash === '#client-works' || hash === '#/demos' || hash === '#/client-works') {
        setCurrentView('clientWorks');
        return;
      }

      // Check /contact or #contact
      if (path === '/contact' || hash === '#contact' || hash === '#/contact') {
        setCurrentView('contact');
        return;
      }

      // Check /register or /create or #register or #create-site
      if (path === '/register' || path === '/create' || hash === '#register' || hash === '#/register' || hash === '#create' || hash === '#/create' || hash === '#create-site' || hash === '#register-section') {
        setCurrentView('create');
        return;
      }

      // Check legal routes (/about, /terms, /privacy, /disclaimer)
      if (path === '/about' || hash === '#about' || hash === '#/about') {
        setCurrentView('about');
        return;
      }
      if (path === '/terms' || hash === '#terms' || hash === '#/terms') {
        setCurrentView('terms');
        return;
      }
      if (path === '/privacy' || hash === '#privacy' || hash === '#/privacy') {
        setCurrentView('privacy');
        return;
      }
      if (path === '/disclaimer' || hash === '#disclaimer' || hash === '#/disclaimer') {
        setCurrentView('disclaimer');
        return;
      }

      // Check /dr/username or /doctor/username pattern
      const pathMatch = path.match(/\/(?:dr|doctor)\/([^/]+)/i);
      const hashMatch = hash.match(/#(?:\/)?(?:dr|doctor)\/([^/]+)/i);
      const queryMatch = searchParams.get('dr') || searchParams.get('doctor');

      const matchedUsername = pathMatch?.[1] || hashMatch?.[1] || queryMatch;

      if (matchedUsername) {
        const decoded = decodeURIComponent(matchedUsername).toLowerCase().trim();
        const cleanDecoded = decoded.replace(/^[@/]+/, '').replace(/^dr\//, '').replace(/^dr-/, '');
        // Find if doctor exists
        const matchedDoc = doctors.find(d => 
          (d.nameEn && d.nameEn.toLowerCase() === decoded) || 
          d.id.toLowerCase() === decoded ||
          (d.name && d.name.toLowerCase() === decoded) ||
          (d.name && d.name.replace(/\s+/g, '-').toLowerCase() === decoded) ||
          (d.nameEn && d.nameEn.toLowerCase().replace(/^dr-?/, '') === cleanDecoded) ||
          (d.name && d.name.toLowerCase().replace(/\s+/g, '-') === cleanDecoded)
        );
        if (matchedDoc) {
          setViewingDoctorEn(matchedDoc.nameEn || matchedDoc.id);
          setCurrentView('dr');
          return;
        }
      }

      // If the URL is home but we are in dr mode or login mode, go to landing (unless logged in)
      if ((currentView === 'dr' || currentView === 'login') && !matchedUsername && path !== '/login' && hash !== '#login') {
        if (currentUserRole === 'doctor') {
          setCurrentView('dashboard');
        } else if (currentUserRole === 'admin') {
          setCurrentView('admin');
        } else {
          setCurrentView('landing');
        }
      }
    };

    handleUrlRouting();

    window.addEventListener('popstate', handleUrlRouting);
    window.addEventListener('hashchange', handleUrlRouting);

    return () => {
      window.removeEventListener('popstate', handleUrlRouting);
      window.removeEventListener('hashchange', handleUrlRouting);
    };
  }, [doctors, currentUserRole, currentView]);

  // Force scroll to top or maintain routing section hash on initial reload/refresh
  useEffect(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();

    if (path === '/login' || hash === '#login' || hash === '#/login') {
      setCurrentView('login');
    } else if (path === '/register' || path === '/create' || hash === '#register' || hash === '#/register' || hash === '#create' || hash === '#/create' || hash === '#create-site' || hash === '#register-section') {
      setCurrentView('create');
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (hash && !hash.includes('dr/') && !hash.includes('doctor/')) {
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }
  }, []);

  // Auto-scroll to top or target section hash when view shifts
  useEffect(() => {
    if (currentView === 'landing' && window.location.hash) {
      const hashVal = window.location.hash;
      if (hashVal.toLowerCase().includes('dr/') || hashVal.toLowerCase().includes('doctor/')) {
        window.scrollTo({ top: 0, behavior: 'instant' });
        return;
      }
      const targetId = hashVal.substring(1);
      const timer = setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 180);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentView, viewingDoctorEn]);

  // Login handler
  const handleLoginSuccess = (role: 'admin' | 'doctor' | 'secretary', doctorId?: string, secretaryId?: string) => {
    setCurrentUserRole(role);
    if (role === 'admin') {
      setCurrentView('admin');
      try {
        localStorage.setItem('dr_session', JSON.stringify({
          role: 'admin',
          doctorId: null,
          secretaryId: null,
          view: 'admin'
        }));
      } catch (e) {}
    } else if ((role === 'doctor' || role === 'secretary') && doctorId) {
      setCurrentDoctorId(doctorId);
      setCurrentSecretaryId(secretaryId || null);
      setCurrentView('dashboard');
      try {
        localStorage.setItem('dr_session', JSON.stringify({
          role,
          doctorId,
          secretaryId: secretaryId || null,
          view: 'dashboard'
        }));
      } catch (e) {}
    }
    window.history.pushState(null, '', '/');
  };

  // Subscription modal state for instant trial activation/renewal
  const [subscriptionModalDoctor, setSubscriptionModalDoctor] = useState<Doctor | null>(null);
  const [isActivatingPlan, setIsActivatingPlan] = useState(false);

  // Register success handler: Immediately activates 7-day free trial and automatically logs into dashboard
  const handleRegisterSuccess = (newDoc: Doctor) => {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const activeDoc: Doctor = { 
      ...newDoc, 
      approvalStatus: 'approved',
      status: 'approved',
      isActiveSubscription: true,
      isTrial: true,
      trialStartDate: now.toISOString(),
      trialEndDate: trialEnd.toISOString(),
      subscriptionEndDate: trialEnd.toISOString(),
      isPaidSubscription: false,
      subscriptionType: 'annual'
    };
    setDoctors(prev => {
      const filtered = prev.filter(d => d.id !== activeDoc.id);
      const updated = [activeDoc, ...filtered];
      try {
        localStorage.setItem('dr_doctors', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    saveDoctorInDb(activeDoc);
    saveDoctorToSupabase(activeDoc);

    try {
      window.dispatchEvent(new CustomEvent('dr_doctors_updated', { detail: activeDoc }));
    } catch {}

    // Automatically log into doctor dashboard
    setCurrentUserRole('doctor');
    setCurrentDoctorId(activeDoc.id);
    setCurrentSecretaryId(null);
    setCurrentView('dashboard');
    try {
      localStorage.setItem('dr_session', JSON.stringify({
        role: 'doctor',
        doctorId: activeDoc.id,
        secretaryId: null,
        view: 'dashboard'
      }));
    } catch (e) {}
    window.history.pushState({ doctor: activeDoc.nameEn || activeDoc.id }, '', '/dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Handler to upgrade/renew doctor to full annual paid subscription
  const handleActivatePaidSubscription = (doctor: Doctor) => {
    setIsActivatingPlan(true);
    setTimeout(() => {
      const updatedDoc = createPaidSubscriptionUpdate(doctor);
      setDoctors(prev => {
        const nextDocs = prev.map(d => d.id === updatedDoc.id ? updatedDoc : d);
        try {
          localStorage.setItem('dr_doctors', JSON.stringify(nextDocs));
        } catch (e) {}
        return nextDocs;
      });
      saveDoctorInDb(updatedDoc);
      saveDoctorToSupabase(updatedDoc);
      setIsActivatingPlan(false);
      setSubscriptionModalDoctor(null);
    }, 600);
  };

  // Logouts
  const handleLogout = () => {
    try {
      localStorage.removeItem('dr_session');
    } catch (e) {}
    setCurrentUserRole(null);
    setCurrentDoctorId(null);
    setCurrentSecretaryId(null);
    setCurrentView('landing');
    window.history.pushState(null, '', '/');
  };

  // Patient added appointment from doctor's public site
  const handleAddAppointment = (newApt: Appointment) => {
    setAppointments(prev => {
      const updated = [newApt, ...prev.filter(a => a.id !== newApt.id)];
      try {
        localStorage.setItem('dr_appointments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    saveAppointmentInDb(newApt);
    saveAppointmentToSupabase(newApt);
  };

  // Review added from doctor's public site
  const handleAddReview = (doctorId: string, newReview: Review) => {
    setDoctors(prev => prev.map(doc => {
      if (doc.id === doctorId) {
        const updatedDoc = {
          ...doc,
          reviews: [...doc.reviews, newReview]
        };
        saveDoctorInDb(updatedDoc);
        saveDoctorToSupabase(updatedDoc);
        return updatedDoc;
      }
      return doc;
    }));
  };

  // Navigating to a specific doctor's public page
  const handleVisitDoctor = (usernameEn: string) => {
    setViewingDoctorEn(usernameEn);
    setCurrentView('dr');
    window.history.pushState({ doctor: usernameEn }, '', `/dr/${usernameEn}`);
  };

  // Render logic
  return (
    <div className="w-full min-h-screen bg-white text-neutral-900 selection:bg-black selection:text-white" dir="rtl">
      <div className="fixed top-0 left-0 z-[9999] bg-red-500 text-white p-4">DEBUG: APP RENDERING</div>
      
      {/* 1. LANDING VIEW */}
      {currentView === 'landing' && (
        <div className="w-full flex flex-col">
          <Header 
            onNavigate={(view) => {
              if (view === 'landing') {
                setCurrentView('landing');
                if (window.location.hash !== '#register') {
                  window.history.pushState(null, '', '/');
                }
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'dashboard' && currentUserRole === 'doctor' && currentDoctorId) {
                setCurrentView('dashboard');
                window.history.pushState(null, '', '/dashboard');
              } else if (view === 'admin' && currentUserRole === 'admin') {
                setCurrentView('admin');
                window.history.pushState(null, '', '/admin');
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            currentView={currentView}
            userRole={currentUserRole}
            doctorId={currentDoctorId}
            doctors={doctors}
            landingConfig={landingConfig}
            currentLang={currentLang}
          />
          
          <main className="flex-1">
            <Hero 
              onNavigate={(view) => {
                if (view === 'login') {
                  setCurrentView('login');
                  window.history.pushState(null, '', '/login');
                } else if (view === 'features') {
                  setCurrentView('features');
                  window.history.pushState(null, '', '/features');
                } else if (view === 'subscription') {
                  setCurrentView('subscription');
                  window.history.pushState(null, '', '/pricing');
                } else if (view === 'contact') {
                  setCurrentView('contact');
                  window.history.pushState(null, '', '/contact');
                } else if (view === 'create') {
                  setCurrentView('create');
                  window.history.pushState(null, '', '/register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setCurrentView(view);
                }
              }} 
              landingConfig={landingConfig} 
              currentLang={currentLang}
            />
            <Subscription 
              showOverview={true}
              showPricing={false}
              onStart={(plan) => {
                setPreselectedPlan(plan);
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              onNavigate={(view) => {
                if (view === 'features') {
                  setCurrentView('features');
                  window.history.pushState(null, '', '/features');
                } else if (view === 'subscription') {
                  setCurrentView('subscription');
                  window.history.pushState(null, '', '/pricing');
                } else if (view === 'contact') {
                  setCurrentView('contact');
                  window.history.pushState(null, '', '/contact');
                } else if (view === 'create') {
                  setCurrentView('create');
                  window.history.pushState(null, '', '/register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              landingConfig={landingConfig}
              currentLang={currentLang}
            />
            <CtaBanner 
              landingConfig={landingConfig}
              currentLang={currentLang} 
              onNavigate={(view) => {
                if (view === 'login') {
                  setCurrentView('login');
                  window.history.pushState(null, '', '/login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'create') {
                  setCurrentView('create');
                  window.history.pushState(null, '', '/register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setCurrentView(view as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
            <FAQ 
              landingConfig={landingConfig} 
              currentLang={currentLang} 
              onNavigate={(view) => {
                if (view === 'contact') {
                  setCurrentView('contact');
                  window.history.pushState(null, '', '/contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'features') {
                  setCurrentView('features');
                  window.history.pushState(null, '', '/features');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'subscription') {
                  setCurrentView('subscription');
                  window.history.pushState(null, '', '/pricing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'create') {
                  setCurrentView('create');
                  window.history.pushState(null, '', '/register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </main>

          <Footer 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
              } else if (['terms', 'privacy', 'disclaimer', 'about'].includes(view)) {
                setCurrentView(view as any);
                window.history.pushState(null, '', `/${view}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            landingConfig={landingConfig} 
            currentLang={currentLang} 
          />
        </div>
      )}

      {/* 1.5 DEDICATED FEATURES PAGE VIEW */}
      {currentView === 'features' && (
        <div className="min-h-screen flex flex-col bg-[#F4F8FC] text-[#10244A]">
          <Header 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'dashboard' && currentUserRole) {
                setCurrentView('dashboard');
              } else if (view === 'admin' && currentUserRole === 'admin') {
                setCurrentView('admin');
                window.history.pushState(null, '', '/admin');
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            currentView={currentView}
            userRole={currentUserRole}
            doctorId={currentDoctorId}
            doctors={doctors}
            landingConfig={landingConfig}
            currentLang={currentLang}
          />
          
          <main className="flex-1 pt-[80px] md:pt-[96px] bg-[#F4F8FC]">
            <Features 
              landingConfig={landingConfig} 
              currentLang={currentLang} 
              onNavigate={(view) => {
                if (view === 'subscription') {
                  setCurrentView('subscription');
                  window.history.pushState(null, '', '/pricing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'features') {
                  setCurrentView('features');
                  window.history.pushState(null, '', '/features');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                  setCurrentView('clientWorks');
                  window.history.pushState(null, '', '/demos');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setCurrentView(view as any);
                }
              }}
            />
          </main>

          <Footer 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
              } else if (['terms', 'privacy', 'disclaimer', 'about'].includes(view)) {
                setCurrentView(view as any);
                window.history.pushState(null, '', `/${view}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            landingConfig={landingConfig} 
            currentLang={currentLang} 
          />
        </div>
      )}

      {/* 1.6 DEDICATED PRICING/SUBSCRIPTION PAGE VIEW */}
      {currentView === 'subscription' && (
        <div className="min-h-screen flex flex-col bg-[#F4F8FC] text-[#10244A]">
          <Header 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'dashboard' && currentUserRole) {
                setCurrentView('dashboard');
              } else if (view === 'admin' && currentUserRole === 'admin') {
                setCurrentView('admin');
                window.history.pushState(null, '', '/admin');
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            currentView={currentView}
            userRole={currentUserRole}
            doctorId={currentDoctorId}
            doctors={doctors}
            landingConfig={landingConfig}
            currentLang={currentLang}
          />
          
          <main className="flex-1 pt-[80px] md:pt-[96px] pb-16">
            <Subscription 
              showOverview={false}
              showPricing={true}
              onStart={(plan) => {
                setPreselectedPlan(plan);
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              onNavigate={(view) => {
                if (view === 'features') {
                  setCurrentView('features');
                  window.history.pushState(null, '', '/features');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'contact') {
                  setCurrentView('contact');
                  window.history.pushState(null, '', '/contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                  setCurrentView('clientWorks');
                  window.history.pushState(null, '', '/demos');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'landing') {
                  setCurrentView('landing');
                  window.history.pushState(null, '', '/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'create') {
                  setCurrentView('create');
                  window.history.pushState(null, '', '/register');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setCurrentView(view as any);
                }
              }}
              landingConfig={landingConfig}
              currentLang={currentLang}
            />
          </main>

          <Footer 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
              } else if (['terms', 'privacy', 'disclaimer', 'about'].includes(view)) {
                setCurrentView(view as any);
                window.history.pushState(null, '', `/${view}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            landingConfig={landingConfig} 
            currentLang={currentLang} 
          />
        </div>
      )}

      {/* 1.7 DEDICATED CONTACT PAGE VIEW */}
      {currentView === 'contact' && (
        <div className="min-h-screen flex flex-col bg-[#F4F8FC] text-[#10244A]">
          <Header 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'dashboard' && currentUserRole) {
                setCurrentView('dashboard');
              } else if (view === 'admin' && currentUserRole === 'admin') {
                setCurrentView('admin');
                window.history.pushState(null, '', '/admin');
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            currentView={currentView}
            userRole={currentUserRole}
            doctorId={currentDoctorId}
            doctors={doctors}
            landingConfig={landingConfig}
            currentLang={currentLang}
          />
          
          <main className="flex-1 pt-[80px] md:pt-[96px]">
            <ContactWhatsApp 
              landingConfig={landingConfig} 
              currentLang={currentLang} 
              onNavigate={(view) => {
                if (view === 'login') {
                  setCurrentView('login');
                  window.history.pushState(null, '', '/login');
                } else if (view === 'features') {
                  setCurrentView('features');
                  window.history.pushState(null, '', '/features');
                } else if (view === 'subscription') {
                  setCurrentView('subscription');
                  window.history.pushState(null, '', '/pricing');
                } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                  setCurrentView('clientWorks');
                  window.history.pushState(null, '', '/demos');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'create') {
                  setCurrentView('create');
                  window.history.pushState(null, '', '/register');
                } else {
                  setCurrentView('landing');
                  window.history.pushState(null, '', '/');
                }
              }}
            />
          </main>

          <Footer 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
              } else if (['terms', 'privacy', 'disclaimer', 'about'].includes(view)) {
                setCurrentView(view as any);
                window.history.pushState(null, '', `/${view}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            landingConfig={landingConfig} 
            currentLang={currentLang} 
          />
        </div>
      )}

      {/* 1.8 DEDICATED CREATE SITE PAGE VIEW */}
      {currentView === 'create' && (
        <div className="min-h-screen flex flex-col bg-white text-[#10244A]">
          <Header 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
              } else if (view === 'dashboard' && currentUserRole) {
                setCurrentView('dashboard');
              } else if (view === 'admin' && currentUserRole === 'admin') {
                setCurrentView('admin');
                window.history.pushState(null, '', '/admin');
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            currentView={currentView}
            userRole={currentUserRole}
            doctorId={currentDoctorId}
            doctors={doctors}
            landingConfig={landingConfig}
            currentLang={currentLang}
          />
          
          <main className="flex-1 pt-[80px] md:pt-[96px] pb-16">
            <CreateSiteForm 
              specialties={specialties} 
              doctors={doctors}
              onRegisterSuccess={handleRegisterSuccess} 
              preselectedPlan={preselectedPlan}
              landingConfig={landingConfig}
              currentLang={currentLang}
              onNavigate={(view) => {
                if (view === 'login') {
                  setCurrentView('login');
                  window.history.pushState(null, '', '/login');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (['terms', 'privacy', 'disclaimer', 'about'].includes(view)) {
                  setCurrentView(view as any);
                  window.history.pushState(null, '', `/${view}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'features') {
                  setCurrentView('features');
                  window.history.pushState(null, '', '/features');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'subscription') {
                  setCurrentView('subscription');
                  window.history.pushState(null, '', '/pricing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'contact') {
                  setCurrentView('contact');
                  window.history.pushState(null, '', '/contact');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                  setCurrentView('clientWorks');
                  window.history.pushState(null, '', '/demos');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'landing') {
                  setCurrentView('landing');
                  window.history.pushState(null, '', '/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setCurrentView(view as any);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            />
          </main>
        </div>
      )}

      {/* 1.9 DEDICATED DEMO MODELS PAGE VIEW */}
      {currentView === 'clientWorks' && (
        <div className="min-h-screen flex flex-col bg-[#F4F8FC] text-[#10244A]">
          <Header 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
              } else if (view === 'dashboard' && currentUserRole) {
                setCurrentView('dashboard');
              } else if (view === 'admin' && currentUserRole === 'admin') {
                setCurrentView('admin');
                window.history.pushState(null, '', '/admin');
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            currentView={currentView}
            userRole={currentUserRole}
            doctorId={currentDoctorId}
            doctors={doctors}
            landingConfig={landingConfig}
            currentLang={currentLang}
          />
          
          <main className="flex-1 pt-[80px] md:pt-[96px] pb-16">
            <ClientWorks 
              doctors={doctors} 
              onVisitDoctor={handleVisitDoctor} 
              landingConfig={landingConfig} 
              currentLang={currentLang} 
              isPage={true}
              onNavigate={(view) => {
                if (view === 'landing') {
                  setCurrentView('landing');
                  window.history.pushState(null, '', '/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setCurrentView(view as any);
                }
              }}
            />
          </main>

          <Footer 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
              } else if (['terms', 'privacy', 'disclaimer', 'about'].includes(view)) {
                setCurrentView(view as any);
                window.history.pushState(null, '', `/${view}`);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            landingConfig={landingConfig} 
            currentLang={currentLang} 
          />
        </div>
      )}

      {/* 1.10 DEDICATED FULL LEGAL & IMPORTANT PAGES VIEW */}
      {(currentView === 'terms' || currentView === 'privacy' || currentView === 'disclaimer' || currentView === 'about') && (
        <div className="min-h-screen flex flex-col bg-slate-50 text-[#10244A]">
          <Header 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
              } else if (view === 'dashboard' && currentUserRole) {
                setCurrentView('dashboard');
              } else if (view === 'admin' && currentUserRole === 'admin') {
                setCurrentView('admin');
                window.history.pushState(null, '', '/admin');
              } else if (['terms', 'privacy', 'disclaimer', 'about'].includes(view)) {
                setCurrentView(view as any);
                window.history.pushState(null, '', `/${view}`);
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            currentView={currentView}
            userRole={currentUserRole}
            doctorId={currentDoctorId}
            doctors={doctors}
            landingConfig={landingConfig}
            currentLang={currentLang}
          />
          
          <main className="flex-1">
            <LegalPage 
              initialDoc={
                currentView === 'about' ? 'about' :
                currentView === 'privacy' ? 'privacy' : 
                currentView === 'disclaimer' ? 'disclaimer' : 
                'terms'
              } 
              onNavigate={(view) => {
                if (view === 'landing') {
                  setCurrentView('landing');
                  window.history.pushState(null, '', '/');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else if (view === 'create') {
                  setCurrentView('create');
                  window.history.pushState(null, '', '/register');
                } else {
                  setCurrentView(view as any);
                  window.history.pushState(null, '', `/${view}`);
                }
              }}
              currentLang={currentLang} 
              landingConfig={landingConfig}
            />
          </main>

          <Footer 
            onNavigate={(view) => {
              if (view === 'login') {
                setCurrentView('login');
                window.history.pushState(null, '', '/login');
              } else if (view === 'features') {
                setCurrentView('features');
                window.history.pushState(null, '', '/features');
              } else if (view === 'subscription') {
                setCurrentView('subscription');
                window.history.pushState(null, '', '/pricing');
              } else if (view === 'contact') {
                setCurrentView('contact');
                window.history.pushState(null, '', '/contact');
              } else if (view === 'clientWorks' || view === 'client-works' || view === 'demos') {
                setCurrentView('clientWorks');
                window.history.pushState(null, '', '/demos');
              } else if (view === 'create') {
                setCurrentView('create');
                window.history.pushState(null, '', '/register');
              } else if (['terms', 'privacy', 'disclaimer', 'about'].includes(view)) {
                setCurrentView(view as any);
                window.history.pushState(null, '', `/${view}`);
              } else {
                setCurrentView('landing');
                window.history.pushState(null, '', '/');
              }
            }}
            landingConfig={landingConfig} 
            currentLang={currentLang} 
          />
        </div>
      )}

      {/* 2. LOGIN VIEW */}
      {currentView === 'login' && (
          <div className="min-h-screen flex flex-col bg-white text-[#10244A]">
            <Header 
              onNavigate={(view) => {
                if (view === 'login') {
                  setCurrentView('login');
                  window.history.pushState(null, '', '/login');
                } else if (view === 'features') {
                  setCurrentView('features');
                  window.history.pushState(null, '', '/features');
                } else if (view === 'subscription') {
                  setCurrentView('subscription');
                  window.history.pushState(null, '', '/pricing');
                } else if (view === 'contact') {
                  setCurrentView('contact');
                  window.history.pushState(null, '', '/contact');
                } else if (view === 'create') {
                  setCurrentView('create');
                  window.history.pushState(null, '', '/register');
                } else if (view === 'dashboard' && currentUserRole) {
                  setCurrentView('dashboard');
                } else if (view === 'admin' && currentUserRole === 'admin') {
                  setCurrentView('admin');
                  window.history.pushState(null, '', '/admin');
                } else {
                  setCurrentView('landing');
                  window.history.pushState(null, '', '/');
                }
              }}
              currentView={currentView}
              userRole={currentUserRole}
              doctorId={currentDoctorId}
              doctors={doctors}
              landingConfig={landingConfig}
              currentLang={currentLang}
            />

            <main className="flex-1 pt-[80px] md:pt-[96px] pb-12">
              <Login 
                doctors={doctors} 
                onLoginSuccess={handleLoginSuccess}
                onCancel={() => {
                  setCurrentView('landing');
                  window.history.pushState(null, '', '/');
                }}
                onRegisterClick={() => {
                  setCurrentView('create');
                  window.history.pushState(null, '', '/register');
                }}
                landingConfig={landingConfig}
                currentLang={currentLang}
              />
            </main>
          </div>
        )}

        {/* 3. DOCTOR & SECRETARY PRIVATE DASHBOARD */}
        {currentView === 'dashboard' && (currentUserRole === 'doctor' || currentUserRole === 'secretary') && currentDoctorId && (
          (() => {
            const loggedDoctor = doctors.find(d => d.id === currentDoctorId);
            if (!loggedDoctor) return <div className="p-12 text-center">جاري تحميل بيانات لوحة التحكم...</div>;
            
            const loggedSecretary = currentUserRole === 'secretary' && currentSecretaryId && loggedDoctor.secretaries
              ? loggedDoctor.secretaries.find(s => s.id === currentSecretaryId) || null
              : null;

            const trialExpired = isDoctorTrialExpired(loggedDoctor);
            const trialActive = isDoctorTrialActive(loggedDoctor);
            const remainingTrialDays = getDoctorRemainingTrialDays(loggedDoctor);

            return (
              <div className="min-h-screen flex flex-col bg-slate-50">
                <div className="flex-1">
                  <Dashboard 
                    doctor={loggedDoctor}
                    loggedSecretary={loggedSecretary}
                    userRole={currentUserRole}
                    appointments={appointments}
                    banners={doctorBanners}
                    onUpdateDoctor={(updatedDoc) => {
                      saveDoctorInDb(updatedDoc);
                      saveDoctorToSupabase(updatedDoc);
                    }}
                    onUpdateAppointments={(updatedApts) => {
                      const oldMap = new Map(appointments.map(a => [a.id, a]));
                      setAppointments(updatedApts);
                      updatedApts.forEach(apt => {
                        const oldApt = oldMap.get(apt.id);
                        if (!oldApt || JSON.stringify(oldApt) !== JSON.stringify(apt)) {
                          saveAppointmentInDb(apt);
                          saveAppointmentToSupabase(apt);
                        }
                      });
                    }}
                    onLogout={handleLogout}
                    onPreviewPublicSite={(username) => {
                      setViewingDoctorEn(username);
                      setCurrentView('dr');
                      window.history.pushState({ doctor: username }, '', `/dr/${username}`);
                    }}
                  />
                </div>
              </div>
            );
          })()
        )}

        {/* 4. PLATFORM ADMINISTRATIVE DASHBOARD */}
        {currentView === 'admin' && currentUserRole === 'admin' && (
          <AdminPanel 
            doctors={doctors}
            appointments={appointments}
            specialties={specialties}
            onUpdateSpecialties={handleUpdateSpecialties}
            banners={doctorBanners}
            onUpdateBanners={handleUpdateBanners}
            onUpdateDoctors={handleUpdateDoctors}
            onLogout={handleLogout}
            onVisitDoctor={(username) => {
              setViewingDoctorEn(username);
              setCurrentView('dr');
              window.history.pushState({ doctor: username }, '', `/dr/${username}`);
            }}
            onLoginAsDoctor={(docId) => {
              setCurrentDoctorId(docId);
              setCurrentUserRole('doctor');
              setCurrentView('dashboard');
            }}
            landingConfig={landingConfig}
            onUpdateLandingConfig={handleUpdateLandingConfig}
          />
        )}

        {/* 5. LIVE PUBLIC DOCTOR PORTFOLIO VIEW */}
        {currentView === 'dr' && viewingDoctorEn && (
          (() => {
            const cleanQuery = viewingDoctorEn.toLowerCase().trim().replace(/^[@/]+/, '').replace(/^dr\//, '').replace(/^dr-/, '');
            const currentDoctor = doctors.find(d => 
              d.nameEn === viewingDoctorEn || 
              d.id === viewingDoctorEn || 
              d.nameEn?.toLowerCase() === viewingDoctorEn?.toLowerCase() ||
              d.id?.toLowerCase() === viewingDoctorEn?.toLowerCase() ||
              (d.nameEn && d.nameEn.toLowerCase().replace(/^dr-?/, '') === cleanQuery) ||
              d.name?.toLowerCase() === viewingDoctorEn?.toLowerCase()
            );
            
            if (!currentDoctor) {
              return (
                <div className="w-full min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-6 text-center text-neutral-800">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                  <h2 className="text-xl font-bold">عذراً، لم نتمكن من العثور على هذا الملف الطبي!</h2>
                  <button 
                    onClick={() => {
                      setCurrentView('landing');
                      window.history.pushState(null, '', '/');
                    }} 
                    className="mt-4 px-6 py-2 bg-black text-white rounded-xl text-xs font-bold"
                  >
                    العودة للرئيسية
                  </button>
                </div>
              );
            }

            // Check if 7-day trial has expired and subscription is not paid
            if (isDoctorTrialExpired(currentDoctor) && !currentDoctor.isPaidSubscription) {
              return (
                <div className="w-full min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
                  <div className="w-20 h-20 bg-rose-500/10 border-2 border-rose-500/30 rounded-full flex items-center justify-center text-rose-400 shadow-xl">
                    <Clock className="w-10 h-10" />
                  </div>
                  <div className="space-y-3 max-w-md">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">انتهت الفترة التجريبية المجانية</h2>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
                      انتهت الفترة التجريبية المجانية لبروفايل <span className="font-bold text-white">{currentDoctor.name}</span>. تم إخفاء البروفايل عن الزوار تلقائياً حتى يتم تجديد أو تفعيل الاشتراك.
                    </p>
                    <p className="text-xs text-slate-400">
                      يستطيع الطبيب تسجيل الدخول إلى لوحة التحكم والاطلاع على بياناته وتفعيل الاشتراك لإعادة ظهور البروفايل فوراً.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <button 
                      onClick={() => {
                        setCurrentView('login');
                        window.history.pushState(null, '', '/login');
                      }} 
                      className="w-full sm:w-auto px-7 py-3 bg-[#0051A8] hover:bg-[#003B7A] text-white font-extrabold text-sm rounded-xl transition-all shadow-lg cursor-pointer"
                    >
                      تسجيل الدخول كطبيب لتفعيل الاشتراك
                    </button>
                    <button 
                      onClick={() => {
                        setCurrentView('landing');
                        window.history.pushState(null, '', '/');
                      }} 
                      className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-slate-200 font-bold text-sm rounded-xl transition-all cursor-pointer"
                    >
                      الذهاب للصفحة الرئيسية
                    </button>
                  </div>
                </div>
              );
            }

            // If Admin has deactivated this doctor's subscription
            if (!currentDoctor.isActiveSubscription) {
              return (
                <div className="w-full min-h-screen bg-neutral-950 text-white flex flex-col items-center justify-center p-6 text-center space-y-6">
                  <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center text-yellow-500 shadow-xl">
                    <Stethoscope className="w-10 h-10" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-2xl font-black tracking-tight text-white">عذراً، هذا الموقع الطبي معطل مؤقتاً</h2>
                    <p className="text-neutral-400 text-sm leading-relaxed font-normal">
                      الموقع الطبي للأستاذ دكتور <span className="font-bold text-white">{currentDoctor.name}</span> معطل مؤقتاً لمراجعة الاشتراك وتحديثات النطاق المعتمدة من قبل إدارة المنصة.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      if (currentUserRole === 'admin') {
                        setCurrentView('admin');
                      } else if (currentUserRole === 'doctor') {
                        setCurrentView('dashboard');
                      } else {
                        setCurrentView('landing');
                      }
                      window.history.pushState(null, '', '/');
                    }} 
                    className="px-6 py-3 bg-white text-black hover:bg-neutral-200 font-extrabold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    الذهاب للصفحة الرئيسية
                  </button>
                </div>
              );
            }

            return (
              <DoctorProfile 
                doctorId={currentDoctor.id}
                doctor={currentDoctor}
                appointments={appointments}
                onAddAppointment={handleAddAppointment}
                onAddReview={handleAddReview}
                onBackToPortal={() => {
                  // If logged in as Doctor or Admin, return them back to dashboard/admin instead of pure landing
                  if (currentUserRole === 'doctor') {
                    setCurrentView('dashboard');
                  } else if (currentUserRole === 'admin') {
                    setCurrentView('admin');
                  } else {
                    setCurrentView('landing');
                  }
                  window.history.pushState(null, '', '/');
                }}
              />
            );
          })()
        )}

        {/* 6. INSTANT SUBSCRIPTION UPGRADE & RENEWAL MODAL */}
        {subscriptionModalDoctor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-neutral-150 relative animate-in fade-in zoom-in-95 duration-200 text-right">
              <button
                type="button"
                onClick={() => setSubscriptionModalDoctor(null)}
                className="absolute top-4 left-4 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-150 flex items-center justify-center text-[#0051A8] shrink-0">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#10244A]">تفعيل الاشتراك السنوي</h3>
                  <p className="text-xs text-neutral-500 font-medium">دكتور / {subscriptionModalDoctor.name}</p>
                </div>
              </div>

              <div className="bg-[#F4F8FC] border border-[#0051A8]/20 rounded-2xl p-5 mb-6 text-center">
                <span className="text-xs font-bold text-neutral-500 block mb-1">الخطة السنوية الشاملة</span>
                <div className="text-4xl font-black text-[#0051A8] tracking-tight">2500 <span className="text-lg font-bold">ج.م</span></div>
                <span className="text-xs font-bold text-emerald-600 block mt-1">سنة كاملة بدون أي عمولات على الحجوزات</span>
              </div>

              <ul className="space-y-2.5 mb-6 text-xs sm:text-sm font-bold text-[#10244A]">
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>ظهور بروفايلك لجميع الزوار والمرضى بدون انقطاع</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>نظام حجز مواعيد ذكي ومتكامل مع العيادة</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>إدارة السكرتارية وتأكيد الحجوزات عبر الواتساب</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>دعم فني مخصص ونسخ احتياطي يومي</span>
                </li>
              </ul>

              <button
                type="button"
                disabled={isActivatingPlan}
                onClick={() => handleActivatePaidSubscription(subscriptionModalDoctor)}
                className="w-full py-3.5 bg-[#003B7A] hover:bg-[#002d5e] text-white font-black text-base rounded-xl shadow-lg shadow-blue-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isActivatingPlan ? (
                  <span>جاري تفعيل الاشتراك...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>تأكيد الاشتراك وتفعيل البروفايل</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

    </div>
  );
}
