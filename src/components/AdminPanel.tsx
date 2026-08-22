/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Doctor, Appointment, SystemSpecialty, DoctorFeatures, DEFAULT_DOCTOR_FEATURES,
  LandingPageConfig, DEFAULT_LANDING_CONFIG, FAQConfigItem, FeatureCategoryConfig,
  DEFAULT_SEO_CONFIG, DoctorBanner, INITIAL_BANNERS, getDoctorExpiryDate, getDoctorDaysRemaining,
  addSubscriptionDuration, PreviewCardItem, DoctorInvoice, PaymentMethodType, FooterSocialLink
, ContactMessage} from '../types';
import { 
  subscribeContactMessages, 
  saveContactMessageInDb, 
  deleteContactMessageFromDb 
} from '../lib/firebase';
import { SOCIAL_PLATFORMS, SocialIcon, getEffectiveSocialLinks } from './SocialLinks';
import SEOSettings from './SEOSettings';
import ImageUploader from './ImageUploader';
import DatabaseStatus from './DatabaseStatus';
import ImportantPagesSettings from './ImportantPagesSettings';
import InvoiceModal from './InvoiceModal';
import { downloadInvoiceDirectly } from '../lib/invoiceUtils';
import { compressImage } from '../lib/imageUtils';
import { 
  Shield, Users, CreditCard, Calendar, Check, X, Eye, EyeOff, Menu, Moon, Sun,
  Trash2, Plus, Sparkles, BarChart, LogOut, Search, Settings, Mail,
  LayoutTemplate, Globe, Save, HelpCircle, Phone, Lock, UserPlus,
  Layers, ChevronLeft, ChevronDown, AlertCircle, Upload, Database, Clock,
  MoreVertical, ExternalLink, Megaphone, Pin, ArrowUp, ArrowDown, Crown, Bell, Tag, Edit3, Flag, Gift, Zap,
  FileText, Download, Loader2, Filter, MapPin, Activity, CheckCircle2, XCircle, RotateCcw, Building2,
  Stethoscope, UserCheck, UserX, CalendarDays, SlidersHorizontal, ShieldCheck
} from 'lucide-react';

interface AdminPanelProps {
  doctors: Doctor[];
  appointments: Appointment[];
  specialties: SystemSpecialty[];
  onUpdateSpecialties?: (updatedSpecs: SystemSpecialty[]) => void;
  banners?: DoctorBanner[];
  onUpdateBanners?: (updatedBanners: DoctorBanner[]) => void;
  onUpdateDoctors: (updatedDocs: Doctor[]) => void;
  onLogout: () => void;
  onVisitDoctor: (username: string) => void;
  onLoginAsDoctor?: (docId: string) => void;
  landingConfig?: LandingPageConfig;
  onUpdateLandingConfig?: (newConfig: LandingPageConfig) => void;
}

type LandingSubTab = 'hero' | 'features' | 'pricing' | 'clientWorks' | 'contact' | 'login' | 'createSite' | 'footer' | 'dashboardSettings' | 'importantPages';

// Helper: Convert any specialty name/code (English, IDs, or varied Arabic) to standardized pure Arabic
export const normalizeSpecialtyToArabic = (specialty: string): string => {
  if (!specialty || !specialty.trim()) return '';
  const trimmed = specialty.trim();
  const lower = trimmed.toLowerCase();

  // English & ID mappings to Standard Arabic
  if (lower === 'dentist' || lower === 'dentistry' || lower === 'dental' || lower === 'teeth') return 'طب وجراحة الأسنان';
  if (lower === 'derma' || lower === 'dermatology' || lower === 'dermatologist' || lower === 'skin') return 'الجلدية والتجميل والليزر';
  if (lower === 'pediatric' || lower === 'pediatrics' || lower === 'pediatrician' || lower === 'children') return 'طب الأطفال وحديثي الولادة';
  if (lower === 'cardio' || lower === 'cardiology' || lower === 'cardiologist' || lower === 'heart') return 'أمراض القلب والأوعية الدموية';
  if (lower === 'ortho' || lower === 'orthopedics' || lower === 'orthopedic' || lower === 'orthopedist' || lower === 'bones') return 'جراحة العظام والمفاصل';
  if (lower === 'ophthalmology' || lower === 'ophthalmic' || lower === 'ophthalmologist' || lower === 'eyes' || lower === 'eye') return 'طب وجراحة العيون';
  if (lower === 'neurology' || lower === 'neurologist' || lower === 'neuro' || lower === 'neurosurgery') return 'أمراض المخ والأعصاب';
  if (lower === 'psychiatry' || lower === 'psychiatrist' || lower === 'psychology' || lower === 'mental health') return 'الطب النفسي وعلاج الإدمان';
  if (lower === 'internal' || lower === 'internal medicine' || lower === 'internist') return 'الأمراض الباطنية والجهاز الهضمي';
  if (lower === 'ent' || lower === 'ear nose throat' || lower === 'otolaryngology') return 'أنف وأذن وحنجرة';
  if (lower === 'obs' || lower === 'obstetrics' || lower === 'gynecology' || lower === 'obgyn' || lower === 'women') return 'طب النساء والتوليد';
  if (lower === 'surgery' || lower === 'general surgery' || lower === 'surgeon') return 'الجراحة العامة والمناظير';
  if (lower === 'urology' || lower === 'urologist') return 'جراحة المسالك البولية والتناسلية';
  if (lower === 'physiotherapy' || lower === 'physical therapy' || lower === 'rehabilitation') return 'العلاج الطبيعي والتأهيل الطبي';
  if (lower === 'radiology' || lower === 'radiologist' || lower === 'xray') return 'الأشعة التشخيصية والتداخلية';
  if (lower === 'oncology' || lower === 'oncologist' || lower === 'cancer') return 'طب وجراحة الأورام';
  if (lower === 'nutrition' || lower === 'clinical nutrition' || lower === 'dietetics') return 'التغذية العلاجية وعلاج السمنة';
  if (lower === 'anesthesia' || lower === 'anesthesiology') return 'التخدير وعلاج الألم';
  if (lower === 'pathology' || lower === 'lab' || lower === 'laboratories') return 'التحاليل الطبية والباثولوجيا الإكلينيكية';
  if (lower === 'endocrinology' || lower === 'diabetes' || lower === 'endocrine') return 'الغدد الصماء وعلاج السكري';
  if (lower === 'pulmonology' || lower === 'chest' || lower === 'respiratory') return 'أمراض الصدر والجهاز التنفسي';
  if (lower === 'nephrology' || lower === 'kidney') return 'أمراض الكلى والغسيل الكلوي';
  if (lower === 'rheumatology' || lower === 'rheumatism') return 'الروماتيزم وأمراض المفاصل المناعية';
  if (lower === 'hematology' || lower === 'blood') return 'أمراض الدم والأورام';
  if (lower === 'vascular' || lower === 'vascular surgery') return 'جراحة الأوعية الدموية والقسطرة';
  if (lower === 'plastic' || lower === 'plastic surgery') return 'جراحة التجميل والحروق';
  if (lower === 'andrology') return 'أمراض الذكورة والعقم';
  if (lower === 'audiology') return 'السمعيات والتخاطب';
  if (lower === 'family medicine' || lower === 'general practitioner' || lower === 'gp') return 'طب الأسرة والطب العام';

  // Common simple Arabic variations to full clean Arabic
  if (trimmed === 'اسنان' || trimmed === 'أسنان' || trimmed === 'طبيب اسنان' || trimmed === 'طبيب أسنان') return 'طب وجراحة الأسنان';
  if (trimmed === 'جلديه' || trimmed === 'جلدية' || trimmed === 'تجميل') return 'الجلدية والتجميل والليزر';
  if (trimmed === 'اطفال' || trimmed === 'أطفال' || trimmed === 'طب اطفال' || trimmed === 'طب الأطفال الحديثي الولادة') return 'طب الأطفال وحديثي الولادة';
  if (trimmed === 'قلب' || trimmed === 'امراض قلب' || trimmed === 'أمراض قلب') return 'أمراض القلب والأوعية الدموية';
  if (trimmed === 'عظام' || trimmed === 'جراحة عظام' || trimmed === 'جراحه عظام') return 'جراحة العظام والمفاصل';
  if (trimmed === 'عيون' || trimmed === 'رمد') return 'طب وجراحة العيون';
  if (trimmed === 'مخ واعصاب' || trimmed === 'مخ وأعصاب') return 'أمراض المخ والأعصاب';
  if (trimmed === 'نفسي' || trimmed === 'طب نفسي') return 'الطب النفسي وعلاج الإدمان';
  if (trimmed === 'باطنه' || trimmed === 'باطنة' || trimmed === 'باطنية') return 'الأمراض الباطنية والجهاز الهضمي';
  if (trimmed === 'انف واذن' || trimmed === 'أنف وأذن' || trimmed === 'انف واذن وحنجرة' || trimmed === 'أنف وأذن وحنجرة') return 'أنف وأذن وحنجرة';
  if (trimmed === 'نساء' || trimmed === 'نساء وتوليد' || trimmed === 'توليد') return 'طب النساء والتوليد';
  if (trimmed === 'جراحة' || trimmed === 'جراحه' || trimmed === 'جراحة عامة') return 'الجراحة العامة والمناظير';
  if (trimmed === 'مسالك' || trimmed === 'مسالك بولية') return 'جراحة المسالك البولية والتناسلية';
  if (trimmed === 'علاج طبيعي') return 'العلاج الطبيعي والتأهيل الطبي';
  if (trimmed === 'اورام' || trimmed === 'أورام') return 'طب وجراحة الأورام';
  if (trimmed === 'تغذية' || trimmed === 'تغذيه') return 'التغذية العلاجية وعلاج السمنة';
  if (trimmed === 'اشعة' || trimmed === 'أشعة') return 'الأشعة التشخيصية والتداخلية';
  if (trimmed === 'تحاليل' || trimmed === 'معامل') return 'التحاليل الطبية والباثولوجيا الإكلينيكية';
  if (trimmed === 'غدد صماء' || trimmed === 'سكر') return 'الغدد الصماء وعلاج السكري';
  if (trimmed === 'صدر' || trimmed === 'جهاز تنفسي') return 'أمراض الصدر والجهاز التنفسي';
  if (trimmed === 'كلى') return 'أمراض الكلى والغسيل الكلوي';

  return trimmed;
};

// Helper component for Image fields with file upload option
const ImageInputWithUpload = ({
  label,
  value,
  onChange,
  placeholder = "رابط الصورة أو ارفع ملف من جهازك..."
}: {
  label: string;
  value: string;
  onChange: (newVal: string) => void;
  placeholder?: string;
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      try {
        const compressed = await compressImage(file, 600, 600, 0.7);
        if (compressed) {
          onChange(compressed);
        }
      } catch (err) {
        console.error("Failed to compress image upload:", err);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-extrabold text-neutral-700">{label}</label>
      <div className="space-y-2">
        <input 
          type="text" 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
        />
        <div className="flex items-center gap-2">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-extrabold rounded-lg transition-all flex items-center gap-1.5 border border-neutral-300 shadow-sm cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 text-neutral-600 animate-spin" />
                <span>جاري معالجة وضغط الصورة...</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-neutral-600" />
                <span>رفع صورة من الجهاز</span>
              </>
            )}
          </button>
          {value && (
            <div className="flex items-center gap-2 bg-neutral-50 px-2 py-1 rounded-lg border border-neutral-200">
              <div className="preview-image-container">
                <img src={value} alt="Preview" className="high-res-img" />
              </div>
              <span className="text-[10px] text-emerald-600 font-bold">معاينة الصورة</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Helper component for Video fields supporting Youtube URLs/IDs and direct MP4/WebM links
const VideoInputWithUpload = ({
  label,
  value,
  onChange,
  placeholder = "ضع رابط فيديو يوتيوب، أو معرف المعاينة (مثل 5xMVNCTwwPo)، أو رابط MP4 مباشر..."
}: {
  label: string;
  value: string;
  onChange: (newVal: string) => void;
  placeholder?: string;
}) => {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-extrabold text-neutral-700">{label}</label>
      <div className="space-y-2">
        <input 
          type="text" 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-extrabold rounded-lg transition-all border border-red-200 cursor-pointer"
              title="مسح الفيديو"
            >
              مسح الرابط
            </button>
          )}
          <span className="text-[11px] text-neutral-500 font-medium">يدعم: رابط فيديو YouTube، معرّف يوتيوب (مثل 5xMVNCTwwPo)، أو رابط فيديو MP4/WebM مباشر.</span>
        </div>
      </div>
    </div>
  );
};

export default function AdminPanel({ 
  doctors, appointments, specialties, onUpdateSpecialties, banners, onUpdateBanners, onUpdateDoctors, onLogout, onVisitDoctor,
  onLoginAsDoctor,
  landingConfig = DEFAULT_LANDING_CONFIG,
  onUpdateLandingConfig
}: AdminPanelProps) {
  
  // State for Admin Sidebar Visibility (3 horizontal lines toggle)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Expanded doctor details state
  const [expandedDoctorIds, setExpandedDoctorIds] = useState<Record<string, boolean>>({});

  const toggleExpandDoctor = (docId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDoctorIds(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  // State for Admin Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('admin_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('admin_dark_mode', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  // Set default active tab to 'landing-settings' as requested (First section)
  const [activeTab, setActiveTab] = useState<'landing-settings' | 'seo-settings' | 'db-status' | 'subscriptions' | 'doctors' | 'banners' | 'settings' | 'messages'>('landing-settings');
  const [landingSubTab, setLandingSubTab] = useState<LandingSubTab>('hero');
  
  // Subscriptions management state
  const [subscriptionsSubTab, setSubscriptionsSubTab] = useState<'all' | 'invoices'>('all');
  const [subscriptionSearchTerm, setSubscriptionSearchTerm] = useState('');
  const [subscriptionStatusFilter, setSubscriptionStatusFilter] = useState<'all' | 'active' | 'trial' | 'expired'>('all');
  const [invoiceSearchTerm, setInvoiceSearchTerm] = useState('');
  const [invoiceMethodFilter, setInvoiceMethodFilter] = useState<string>('all');

  // Subscription Activation Modal state
  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [activatingDoctor, setActivatingDoctor] = useState<Doctor | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethodType>('Vodafone Cash');
  const [selectedDurationType, setSelectedDurationType] = useState<'annual' | '6months'>('annual');

  // View / Print Invoice Modal state
  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<DoctorInvoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Trash state for subscriptions & invoices
  const [deletedDoctors, setDeletedDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem('admin_deleted_doctors');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [deletedInvoices, setDeletedInvoices] = useState<DoctorInvoice[]>(() => {
    try {
      const saved = localStorage.getItem('admin_deleted_invoices');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isTrashModalOpen, setIsTrashModalOpen] = useState(false);
  const [trashActiveTab, setTrashActiveTab] = useState<'doctors' | 'invoices'>('doctors');

  useEffect(() => {
    try {
      localStorage.setItem('admin_deleted_doctors', JSON.stringify(deletedDoctors));
    } catch {}
  }, [deletedDoctors]);

  useEffect(() => {
    try {
      localStorage.setItem('admin_deleted_invoices', JSON.stringify(deletedInvoices));
    } catch {}
  }, [deletedInvoices]);
  
  // Local editable landing page config state
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() => {
    try {
      const saved = localStorage.getItem('dr_admin_contact_messages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    // 1. Initial read & sync of any local messages to Firestore
    try {
      const saved = localStorage.getItem('dr_admin_contact_messages');
      if (saved) {
        const localList: ContactMessage[] = JSON.parse(saved);
        if (Array.isArray(localList) && localList.length > 0) {
          localList.forEach(m => {
            saveContactMessageInDb(m).catch(() => {});
          });
        }
      }
    } catch {}

    // 2. Realtime subscription to Firestore
    const unsubscribeMessages = subscribeContactMessages((dbMsgs) => {
      setContactMessages(prev => {
        let localMsgs: ContactMessage[] = [];
        try {
          const s = localStorage.getItem('dr_admin_contact_messages');
          if (s) localMsgs = JSON.parse(s);
        } catch {}

        const map = new Map<string, ContactMessage>();
        localMsgs.forEach(m => map.set(m.id, m));
        dbMsgs.forEach(m => map.set(m.id, m));

        const merged = Array.from(map.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        try {
          localStorage.setItem('dr_admin_contact_messages', JSON.stringify(merged));
        } catch {}

        return merged;
      });
    });

    // 3. Listen to local storage and custom send events
    const handleStorageOrSend = () => {
      try {
        const s = localStorage.getItem('dr_admin_contact_messages');
        if (s) {
          const list = JSON.parse(s);
          setContactMessages(list);
        }
      } catch {}
    };

    window.addEventListener('storage', handleStorageOrSend);
    window.addEventListener('dr_contact_message_sent', handleStorageOrSend);

    return () => {
      unsubscribeMessages();
      window.removeEventListener('storage', handleStorageOrSend);
      window.removeEventListener('dr_contact_message_sent', handleStorageOrSend);
    };
  }, []);
  const [localLanding, setLocalLanding] = useState<LandingPageConfig>(() => {
    const cfg = landingConfig || DEFAULT_LANDING_CONFIG;
    const createSite = {
      ...DEFAULT_LANDING_CONFIG.createSite,
      ...(cfg.createSite || {})
    };
    if (!createSite.headerCtaButtonText || createSite.headerCtaButtonText === 'ابدأ تجربتك المجانية' || createSite.headerCtaButtonText === 'أنشئ الآن') {
      createSite.headerCtaButtonText = 'ابدأ الآن مجاناً';
    }
    if (!createSite.heroCtaButtonText || createSite.heroCtaButtonText === 'أنشئ الآن') {
      createSite.heroCtaButtonText = 'ابدأ الآن مجاناً';
    }
    if (!createSite.logoUrl) {
      createSite.logoUrl = 'https://d.top4top.io/p_3875rj4l41.png';
    }
    if (!createSite.title) {
      createSite.title = 'انشئ حساب مجاني';
    }
    if (!createSite.step1Title) {
      createSite.step1Title = 'انشئ حساب مجاني';
    }
    if (!createSite.step2Title) {
      createSite.step2Title = 'بيانات البروفايل';
    }
    if (!createSite.nextButtonText) {
      createSite.nextButtonText = 'التالي';
    }
    if (!createSite.backButtonText) {
      createSite.backButtonText = 'السابق';
    }
    if (!createSite.submitButtonText || createSite.submitButtonText === 'أنشئ الآن') {
      createSite.submitButtonText = 'انشئ حساب مجاني';
    }
    if (!createSite.submittingButtonText) {
      createSite.submittingButtonText = 'جاري إنشاء الحساب...';
    }
    if (!createSite.loginPromptText) {
      createSite.loginPromptText = 'لديكم حساب بالفعل؟';
    }
    if (!createSite.loginLinkText) {
      createSite.loginLinkText = 'تسجيل الدخول';
    }

    const hasOldFaqDefaults = cfg.faq?.items?.length === 4 && cfg.faq?.items[0]?.question?.includes('جميع الأجهزة');
    const faqItems = (cfg.faq?.items && cfg.faq.items.length > 0 && !hasOldFaqDefaults)
      ? cfg.faq.items
      : (DEFAULT_LANDING_CONFIG.faq?.items || []);

    const defaultPlanFeatures = [
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

    const plan5Features = (cfg.pricing?.plan5Months?.features && cfg.pricing.plan5Months.features.length > 0)
      ? cfg.pricing.plan5Months.features
      : defaultPlanFeatures;

    const plan1YearFeatures = (cfg.pricing?.plan1Year?.features && cfg.pricing.plan1Year.features.length > 0)
      ? cfg.pricing.plan1Year.features
      : defaultPlanFeatures;

    return {
      ...DEFAULT_LANDING_CONFIG,
      ...cfg,
      createSite,
      pricing: {
        ...DEFAULT_LANDING_CONFIG.pricing,
        ...(cfg.pricing || {}),
        plan5Months: {
          ...DEFAULT_LANDING_CONFIG.pricing.plan5Months,
          ...(cfg.pricing?.plan5Months || {}),
          features: plan5Features
        },
        plan1Year: {
          ...DEFAULT_LANDING_CONFIG.pricing.plan1Year,
          ...(cfg.pricing?.plan1Year || {}),
          features: plan1YearFeatures
        }
      },
      faq: {
        title: cfg.faq?.title || DEFAULT_LANDING_CONFIG.faq?.title || 'أسئلة متكررة',
        subtitle: cfg.faq?.subtitle || DEFAULT_LANDING_CONFIG.faq?.subtitle || 'إجابات عن أهم الاستفسارات المتكررة حول المنصة وطريقة العمل',
        items: faqItems
      }
    };
  });
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  // Sync localLanding if parent landingConfig changes on external updates
  useEffect(() => {
    if (landingConfig) {
      const defaultPlanFeatures = [
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

      const hasOldFaqDefaults = landingConfig.faq?.items?.length === 4 && landingConfig.faq?.items[0]?.question?.includes('جميع الأجهزة');
      const faqItems = (landingConfig.faq?.items && landingConfig.faq.items.length > 0 && !hasOldFaqDefaults)
        ? landingConfig.faq.items
        : (DEFAULT_LANDING_CONFIG.faq?.items || []);

      const plan5Features = (landingConfig.pricing?.plan5Months?.features && landingConfig.pricing.plan5Months.features.length > 0)
        ? landingConfig.pricing.plan5Months.features
        : defaultPlanFeatures;

      const plan1YearFeatures = (landingConfig.pricing?.plan1Year?.features && landingConfig.pricing.plan1Year.features.length > 0)
        ? landingConfig.pricing.plan1Year.features
        : defaultPlanFeatures;

      setLocalLanding({
        ...landingConfig,
        pricing: {
          ...DEFAULT_LANDING_CONFIG.pricing,
          ...(landingConfig.pricing || {}),
          plan5Months: {
            ...DEFAULT_LANDING_CONFIG.pricing.plan5Months,
            ...(landingConfig.pricing?.plan5Months || {}),
            features: plan5Features
          },
          plan1Year: {
            ...DEFAULT_LANDING_CONFIG.pricing.plan1Year,
            ...(landingConfig.pricing?.plan1Year || {}),
            features: plan1YearFeatures
          }
        },
        faq: {
          title: landingConfig.faq?.title || DEFAULT_LANDING_CONFIG.faq?.title || 'أسئلة متكررة',
          subtitle: landingConfig.faq?.subtitle || DEFAULT_LANDING_CONFIG.faq?.subtitle || 'إجابات عن أهم الاستفسارات المتكررة حول المنصة وطريقة العمل',
          items: faqItems
        }
      });
    }
  }, [landingConfig]);

  // Banner management state
  const currentBanners = banners || INITIAL_BANNERS;

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);

  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerDesc, setBannerDesc] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [bannerIcon, setBannerIcon] = useState('sparkles');
  const [bannerColor, setBannerColor] = useState<'blue' | 'emerald' | 'amber' | 'red' | 'indigo' | 'purple'>('blue');
  const [bannerButtonText, setBannerButtonText] = useState('');
  const [bannerButtonUrl, setBannerButtonUrl] = useState('');
  const [bannerStartDate, setBannerStartDate] = useState('');
  const [bannerEndDate, setBannerEndDate] = useState('');
  const [bannerIsActive, setBannerIsActive] = useState(true);
  const [bannerIsPinned, setBannerIsPinned] = useState(false);
  const [bannerPriority, setBannerPriority] = useState(1);
  const [bannerTargetAudience, setBannerTargetAudience] = useState<'all' | 'specific_specialty' | 'specific_doctors' | 'active' | 'trial' | 'expired' | 'whitelabel_enabled' | 'whitelabel_disabled'>('all');
  const [bannerTargetSpecialty, setBannerTargetSpecialty] = useState<string>('');
  const [bannerTargetDoctorIds, setBannerTargetDoctorIds] = useState<string[]>([]);

  // Banner Actions
  const handleOpenAddBanner = () => {
    setEditingBannerId(null);
    setBannerTitle('');
    setBannerDesc('');
    setBannerImageUrl('');
    setBannerIcon('sparkles');
    setBannerColor('blue');
    setBannerButtonText('');
    setBannerButtonUrl('');
    setBannerStartDate('');
    setBannerEndDate('');
    setBannerIsActive(true);
    setBannerIsPinned(false);
    setBannerPriority(currentBanners.length + 1);
    setBannerTargetAudience('all');
    setBannerTargetSpecialty('');
    setBannerTargetDoctorIds([]);
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: DoctorBanner) => {
    setEditingBannerId(b.id);
    setBannerTitle(b.title || '');
    setBannerDesc(b.description || '');
    setBannerImageUrl(b.imageUrl || '');
    setBannerIcon(b.icon || 'sparkles');
    setBannerColor(b.color || 'blue');
    setBannerButtonText(b.buttonText || '');
    setBannerButtonUrl(b.buttonUrl || '');
    setBannerStartDate(b.startDate || '');
    setBannerEndDate(b.endDate || '');
    setBannerIsActive(b.isActive);
    setBannerIsPinned(!!b.isPinned);
    setBannerPriority(b.priority || 1);
    setBannerTargetAudience(b.targetAudience || 'all');
    setBannerTargetSpecialty(b.targetSpecialty || '');
    setBannerTargetDoctorIds(b.targetDoctorIds || []);
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim()) return;

    let updated: DoctorBanner[];

    // Calculate recipient count
    let recipientCount = 0;
    if (bannerTargetAudience === 'all') recipientCount = doctors.length;
    else if (bannerTargetAudience === 'specific_specialty') {
      const sp = bannerTargetSpecialty.toLowerCase().trim();
      recipientCount = doctors.filter(d => (d.specialty || '').toLowerCase().includes(sp)).length;
    }
    else if (bannerTargetAudience === 'specific_doctors') recipientCount = bannerTargetDoctorIds.length;
    else if (bannerTargetAudience === 'active') recipientCount = doctors.filter(d => d.isActiveSubscription && d.isPaidSubscription).length;
    else if (bannerTargetAudience === 'trial') recipientCount = doctors.filter(d => d.isTrial || !d.isPaidSubscription).length;
    else if (bannerTargetAudience === 'expired') {
      recipientCount = doctors.filter(d => {
        const exp = getDoctorExpiryDate(d);
        return exp < new Date() || (!d.isActiveSubscription && !d.isTrial);
      }).length;
    }
    else if (bannerTargetAudience === 'whitelabel_enabled') recipientCount = doctors.filter(d => d.whiteLabel).length;
    else if (bannerTargetAudience === 'whitelabel_disabled') recipientCount = doctors.filter(d => !d.whiteLabel).length;

    if (editingBannerId) {
      updated = currentBanners.map(b => b.id === editingBannerId ? {
        ...b,
        title: bannerTitle.trim(),
        description: bannerDesc.trim(),
        imageUrl: bannerImageUrl || undefined,
        icon: bannerIcon || 'sparkles',
        color: bannerColor,
        buttonText: bannerButtonText.trim() || undefined,
        buttonUrl: bannerButtonUrl.trim() || undefined,
        startDate: bannerStartDate || undefined,
        endDate: bannerEndDate || undefined,
        isActive: bannerIsActive,
        isPinned: bannerIsPinned,
        priority: Number(bannerPriority) || 1,
        targetAudience: bannerTargetAudience,
        targetSpecialty: bannerTargetSpecialty,
        targetDoctorIds: bannerTargetDoctorIds,
        recipientCount: recipientCount,
      } : b);
    } else {
      const nowIso = new Date().toISOString();
      const newBanner: DoctorBanner = {
        id: `banner-${Date.now()}`,
        title: bannerTitle.trim(),
        description: bannerDesc.trim(),
        imageUrl: bannerImageUrl || undefined,
        icon: bannerIcon || 'sparkles',
        color: bannerColor,
        buttonText: bannerButtonText.trim() || undefined,
        buttonUrl: bannerButtonUrl.trim() || undefined,
        startDate: bannerStartDate || undefined,
        endDate: bannerEndDate || undefined,
        isActive: bannerIsActive,
        isPinned: bannerIsPinned,
        priority: Number(bannerPriority) || 1,
        targetAudience: bannerTargetAudience,
        targetSpecialty: bannerTargetSpecialty,
        targetDoctorIds: bannerTargetDoctorIds,
        createdAt: nowIso.slice(0, 10),
        sentDate: nowIso,
        readBy: [],
        readCount: 0,
        recipientCount: recipientCount
      };
      updated = [newBanner, ...currentBanners];
    }

    if (onUpdateBanners) {
      onUpdateBanners(updated);
    }
    setIsBannerModalOpen(false);
  };

  const handleDeleteBanner = (id: string) => {
    const updated = currentBanners.filter(b => b.id !== id);
    if (onUpdateBanners) onUpdateBanners(updated);
  };

  const handleToggleBannerActive = (id: string) => {
    const updated = currentBanners.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b);
    if (onUpdateBanners) onUpdateBanners(updated);
  };

  const handleToggleBannerPinned = (id: string) => {
    const updated = currentBanners.map(b => b.id === id ? { ...b, isPinned: !b.isPinned } : b);
    if (onUpdateBanners) onUpdateBanners(updated);
  };

  const handleMoveBannerPriority = (id: string, direction: 'up' | 'down') => {
    const sorted = [...currentBanners].sort((a, b) => (a.priority || 0) - (b.priority || 0));
    const index = sorted.findIndex(b => b.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const tempP = sorted[index].priority;
      sorted[index].priority = sorted[index - 1].priority;
      sorted[index - 1].priority = tempP;
    } else if (direction === 'down' && index < sorted.length - 1) {
      const tempP = sorted[index].priority;
      sorted[index].priority = sorted[index + 1].priority;
      sorted[index + 1].priority = tempP;
    }

    if (onUpdateBanners) onUpdateBanners(sorted);
  };

  // Doctors management sub-navigation & filter states
  const [doctorsSubTab, setDoctorsSubTab] = useState<'list' | 'expiring' | 'stats'>('list');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'suspended' | 'expiring'>('approved');
  const [expiringDaysFilter, setExpiringDaysFilter] = useState<15 | 30 | 60 | 'all'>(30);
  const [searchTerm, setSearchTerm] = useState('');

  // Enhanced Doctor Filters
  const [doctorSpecialtyFilter, setDoctorSpecialtyFilter] = useState<string>('all');
  const [doctorAccountStatusFilter, setDoctorAccountStatusFilter] = useState<'all' | 'active' | 'trial' | 'expired'>('all');
  const [doctorCityFilter, setDoctorCityFilter] = useState<string>('');
  const [doctorDateFilter, setDoctorDateFilter] = useState<'all' | 'today' | '7days' | '30days' | 'month' | 'year' | 'custom'>('all');
  const [doctorCustomStartDate, setDoctorCustomStartDate] = useState<string>('');
  const [doctorCustomEndDate, setDoctorCustomEndDate] = useState<string>('');
  
  // Rejection modal state
  const [rejectionModalDocId, setRejectionModalDocId] = useState<string | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Editing doctor state
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    jobTitle: string;
    email: string;
    phone: string;
    whatsapp: string;
    specialty: string;
    subscriptionType: '6months' | 'annual';
    isVerified: boolean;
    whiteLabel: boolean;
    isActiveSubscription: boolean;
  } | null>(null);

  const [newSpecialtyName, setNewSpecialtyName] = useState('');
  const [localSpecialties, setLocalSpecialties] = useState<SystemSpecialty[]>(specialties || []);

  // Admin Credentials Reset State
  const currentAdminEmail = landingConfig?.adminCredentials?.email || 'hassanhamdy@gmail.com';
  const [adminUsernameInput, setAdminUsernameInput] = useState(currentAdminEmail);
  const [adminCurrentPasswordInput, setAdminCurrentPasswordInput] = useState('');
  const [adminNewPasswordInput, setAdminNewPasswordInput] = useState('');
  const [adminConfirmPasswordInput, setAdminConfirmPasswordInput] = useState('');
  const [showAdminCurrentPass, setShowAdminCurrentPass] = useState(false);
  const [showAdminNewPass, setShowAdminNewPass] = useState(false);
  const [showAdminConfirmPass, setShowAdminConfirmPass] = useState(false);
  const [adminCredsSuccessMsg, setAdminCredsSuccessMsg] = useState<string | null>(null);
  const [adminCredsErrorMsg, setAdminCredsErrorMsg] = useState<string | null>(null);
  const [isAdminCredsSaving, setIsAdminCredsSaving] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');

  useEffect(() => {
    if (landingConfig?.adminCredentials?.email) {
      setAdminUsernameInput(landingConfig.adminCredentials.email);
    }
  }, [landingConfig?.adminCredentials?.email]);

  const handleSaveAdminCredentials = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAdminCredsErrorMsg(null);
    setAdminCredsSuccessMsg(null);

    const cleanEmail = adminUsernameInput.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@') || cleanEmail.length < 5) {
      setAdminCredsErrorMsg('يرجى كتابة بريد إلكتروني صالح ومكتمل لمدير المنصة.');
      return;
    }

    const isChangingPassword = adminNewPasswordInput.trim().length > 0;
    if (isChangingPassword) {
      if (adminNewPasswordInput.trim().length < 6) {
        setAdminCredsErrorMsg('يجب أن تتكون كلمة المرور الجديدة من 6 خانات/أحرف على الأقل لضمان الأمان.');
        return;
      }
      if (adminNewPasswordInput !== adminConfirmPasswordInput) {
        setAdminCredsErrorMsg('كلمة المرور الجديدة وتأكيد كلمة المرور غير متطابقين، يرجى إعادة التحقق.');
        return;
      }
      const activeCurrentPass = landingConfig?.adminCredentials?.passwordHash || 'Abo Hmed 011# Abo hassan';
      if (adminCurrentPasswordInput && adminCurrentPasswordInput !== activeCurrentPass) {
        setAdminCredsErrorMsg('كلمة المرور الحالية المدخلة غير صحيحة، يرجى كتابة كلمة المرور الحالية للتأكيد.');
        return;
      }
    }

    setIsAdminCredsSaving(true);

    try {
      const finalPassword = isChangingPassword 
        ? adminNewPasswordInput 
        : (landingConfig?.adminCredentials?.passwordHash || 'Abo Hmed 011# Abo hassan');

      const updatedCreds = {
        email: cleanEmail,
        passwordHash: finalPassword
      };

      // 1. Update in LocalStorage
      try {
        localStorage.setItem('dr_admin_credentials', JSON.stringify({
          email: cleanEmail,
          password: finalPassword
        }));
      } catch (err) {}

      // 2. Update via landingConfig prop
      if (onUpdateLandingConfig) {
        onUpdateLandingConfig({
          ...landingConfig,
          adminCredentials: updatedCreds
        });
      }

      setAdminCredsSuccessMsg('تم حفظ وتحديث بيانات حساب المشرف (اسم المستخدم وكلمة السر) بنجاح!');
      setAdminCurrentPasswordInput('');
      setAdminNewPasswordInput('');
      setAdminConfirmPasswordInput('');
      setTimeout(() => {
        setAdminCredsSuccessMsg(null);
      }, 7000);
    } catch (err: any) {
      setAdminCredsErrorMsg('حدث خطأ أثناء حفظ البيانات: ' + (err?.message || 'يرجى المحاولة مجدداً'));
    } finally {
      setIsAdminCredsSaving(false);
    }
  };

  useEffect(() => {
    if (specialties && specialties.length > 0) {
      setLocalSpecialties(specialties);
    }
  }, [specialties]);
  const [editingFeaturesDocId, setEditingFeaturesDocId] = useState<string | null>(null);
  const [openDropdownDocId, setOpenDropdownDocId] = useState<string | null>(null);
  const [visibleDoctorsCount, setVisibleDoctorsCount] = useState<number>(5);

  // Verification Duration Modal State
  const [verificationModalDoctor, setVerificationModalDoctor] = useState<Doctor | null>(null);
  const [selectedVerificationDuration, setSelectedVerificationDuration] = useState<'6months' | 'annual'>('annual');

  // White Label Duration Modal State
  const [whiteLabelModalDoctor, setWhiteLabelModalDoctor] = useState<Doctor | null>(null);
  const [selectedWhiteLabelDuration, setSelectedWhiteLabelDuration] = useState<'6months' | 'annual'>('annual');

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (openDropdownDocId && !(e.target as HTMLElement).closest('.doctor-actions-menu')) {
        setOpenDropdownDocId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownDocId]);
  const [cwSearchQuery, setCwSearchQuery] = useState('');
  const [cwLinkInput, setCwLinkInput] = useState('');
  const [newCardImage, setNewCardImage] = useState('');
  const [newCardProfileUrl, setNewCardProfileUrl] = useState('');
  const [newCardTitle, setNewCardTitle] = useState('');

  // Open / View doctor public profile
  const handleViewProfile = (nameEn: string) => {
    if (onVisitDoctor) {
      onVisitDoctor(nameEn);
    } else {
      const origin = window.location.origin;
      const pathname = window.location.pathname;
      const profileUrl = `${origin}${pathname}#/dr/${nameEn}`;
      window.open(profileUrl, '_blank');
    }
  };

  // Generate WhatsApp contact link for confirming subscription with new doctor
  const getWhatsAppContactUrl = (doc: Doctor) => {
    const rawPhone = doc.whatsapp || doc.phone || '';
    let cleanPhone = rawPhone.replace(/[^\d]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '20' + cleanPhone.slice(1);
    }
    const doctorName = doc.name || 'الدكتور';
    const doctorSlug = doc.nameEn || '';
    const message = `مرحباً د. ${doctorName}، معك إدارة منصة بروفايلي 👋\nتم استلام طلبكم لإنشاء موقعكم الطبي (${doctorSlug}).\nيرجى تأكيد تفاصيل باقة الاشتراك لتفعيل الحساب فوراً.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  };

  // Handle saving landing config
  const handleSaveLandingConfig = () => {
    if (onUpdateLandingConfig) {
      onUpdateLandingConfig(localLanding);
    }
    setSaveSuccessMsg(true);
    setTimeout(() => setSaveSuccessMsg(false), 3000);
  };

  const handleToggleFeature = (docId: string, featureKey: keyof DoctorFeatures) => {
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        const currentFeatures = doc.features || { ...DEFAULT_DOCTOR_FEATURES };
        return {
          ...doc,
          features: {
            ...currentFeatures,
            [featureKey]: !currentFeatures[featureKey]
          }
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
  };

  // Open Subscription Activation & Invoice Modal
  const handleOpenActivateModal = (doc: Doctor) => {
    setActivatingDoctor(doc);
    setSelectedPaymentMethod('Vodafone Cash');
    setSelectedDurationType(doc.subscriptionType || 'annual');
    setIsActivateModalOpen(true);
  };

  // Confirm Subscription Activation & Generate Official Invoice
  const handleConfirmActivation = () => {
    if (!activatingDoctor) return;
    const doc = activatingDoctor;
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10);
    const durationMonths = selectedDurationType === '6months' ? 6 : 12;
    const planDurationText = selectedDurationType === '6months' ? '6 أشهر' : 'سنة كاملة (12 شهر)';
    const amountVal = selectedDurationType === '6months' ? 1500 : 2500;

    // Calculate new expiry date (extend from current active paid expiry if still valid, or start from today)
    let baseDate = now;
    if (doc.isPaidSubscription && !doc.isTrial && doc.subscriptionEndDate) {
      const existingPaidExpiry = new Date(doc.subscriptionEndDate);
      if (!isNaN(existingPaidExpiry.getTime()) && existingPaidExpiry > now) {
        baseDate = existingPaidExpiry;
      }
    }
    const newExpiry = addSubscriptionDuration(baseDate, selectedDurationType);
    const expiryFormatted = newExpiry.toISOString().slice(0, 10);

    // Generate unique invoice number: INV-YYYY-XXXX
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const invoiceNumber = `INV-${now.getFullYear()}-${randomCode}`;

    const newInvoice: DoctorInvoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber,
      doctorId: doc.id,
      doctorName: doc.name,
      doctorEmail: doc.email,
      doctorPhone: doc.phone,
      doctorJobTitle: doc.jobTitle,
      doctorSpecialty: doc.specialty,
      planDuration: planDurationText,
      subscriptionType: selectedDurationType,
      date: dateStr,
      createdAt: now.toISOString(),
      amount: amountVal,
      currency: 'ج.م',
      status: 'paid',
      statusText: 'مدفوعة ومكتملة',
      paymentMethod: selectedPaymentMethod,
      notes: `تم تفعيل الاشتراك رسمياً عبر لوحة الإدارة بواسطة وسيلة الدفع: ${selectedPaymentMethod}`
    };

    const updated = doctors.map(d => {
      if (d.id === doc.id) {
        const existingInvoices = d.invoices || [];
        return {
          ...d,
          isActiveSubscription: true,
          isPaidSubscription: true,
          isTrial: false,
          approvalStatus: 'approved' as const,
          subscriptionType: selectedDurationType,
          subscriptionEndDate: expiryFormatted,
          isVerified: d.isVerified ?? false,
          rejectionReason: undefined,
          invoices: [newInvoice, ...existingInvoices]
        };
      }
      return d;
    });

    onUpdateDoctors(updated);
    setIsActivateModalOpen(false);
    setActivatingDoctor(null);

    // Auto open invoice preview modal with the newly generated invoice
    setSelectedInvoiceForModal(newInvoice);
    setIsInvoiceModalOpen(true);
  };

  // Toggle Subscription state in real-time
  const handleToggleSubscription = (docId: string) => {
    const targetDoc = doctors.find(d => d.id === docId);
    if (targetDoc && !targetDoc.isActiveSubscription) {
      handleOpenActivateModal(targetDoc);
      return;
    }
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        const newActiveState = !doc.isActiveSubscription;
        return { 
          ...doc, 
          isActiveSubscription: newActiveState
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
  };

  // Approve Doctor Registration
  const handleApproveDoctor = (docId: string) => {
    const targetDoc = doctors.find(d => d.id === docId);
    if (targetDoc) {
      handleOpenActivateModal(targetDoc);
      return;
    }
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        const subType = doc.subscriptionType || 'annual';
        return { 
          ...doc, 
          approvalStatus: 'approved' as const,
          isActiveSubscription: true,
          subscriptionType: subType,
          isVerified: doc.isVerified ?? false,
          rejectionReason: undefined
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
  };

  // Open rejection modal
  const handleOpenRejectModal = (docId: string) => {
    setRejectionModalDocId(docId);
    setRejectionReasonInput('');
  };

  // Confirm and Save Rejection
  const handleSaveRejection = () => {
    if (!rejectionModalDocId) return;
    const updated = doctors.map(doc => {
      if (doc.id === rejectionModalDocId) {
        return { 
          ...doc, 
          approvalStatus: 'rejected' as const,
          isActiveSubscription: false,
          rejectionReason: rejectionReasonInput.trim() || 'البيانات غير مكتملة أو غير دقيقة.'
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
    setRejectionModalDocId(null);
    setRejectionReasonInput('');
  };

  // Open Verification Duration Modal
  const handleOpenVerificationModal = (doc: Doctor) => {
    setVerificationModalDoctor(doc);
    setSelectedVerificationDuration(doc.verificationDuration || 'annual');
  };

  // Confirm Verification with selected duration
  const handleConfirmVerification = () => {
    if (!verificationModalDoctor) return;
    const now = new Date();
    const expiry = addSubscriptionDuration(now, selectedVerificationDuration).toISOString().slice(0, 10);
    const dateStr = now.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const invNumber = `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: DoctorInvoice = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      invoiceNumber: invNumber,
      doctorId: verificationModalDoctor.id,
      doctorName: verificationModalDoctor.name,
      doctorEmail: verificationModalDoctor.email,
      doctorPhone: verificationModalDoctor.phone,
      doctorJobTitle: verificationModalDoctor.jobTitle,
      doctorSpecialty: verificationModalDoctor.specialty,
      planDuration: selectedVerificationDuration === 'annual' ? 'توثيق الحساب (سنة كاملة)' : 'توثيق الحساب (6 أشهر)',
      subscriptionType: selectedVerificationDuration,
      date: dateStr,
      createdAt: now.toISOString(),
      amount: 250,
      currency: 'ج.م',
      status: 'paid',
      statusText: 'مدفوعة ومكتملة',
      paymentMethod: 'InstaPay',
      notes: 'رسوم خدمة توثيق الحساب (الشارة الزرقاء) - تم التفعيل بنجاح عبر لوحة الإدارة بسعر 250 ج.م'
    };

    const updated = doctors.map(doc => {
      if (doc.id === verificationModalDoctor.id) {
        const existingInvoices = doc.invoices || [];
        return {
          ...doc,
          isVerified: true,
          verificationDuration: selectedVerificationDuration,
          verificationEndDate: expiry,
          invoices: [newInvoice, ...existingInvoices]
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
    setVerificationModalDoctor(null);
  };

  // Revoke/Cancel Verification
  const handleRevokeVerification = () => {
    if (!verificationModalDoctor) return;
    const updated = doctors.map(doc => {
      if (doc.id === verificationModalDoctor.id) {
        return {
          ...doc,
          isVerified: false,
          verificationEndDate: undefined,
          verificationDuration: undefined
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
    setVerificationModalDoctor(null);
  };

  // Open White Label Duration Modal
  const handleOpenWhiteLabelModal = (doc: Doctor) => {
    setWhiteLabelModalDoctor(doc);
    setSelectedWhiteLabelDuration(doc.whiteLabelDuration || 'annual');
  };

  // Confirm White Label with selected duration
  const handleConfirmWhiteLabel = () => {
    if (!whiteLabelModalDoctor) return;
    const now = new Date();
    const expiry = addSubscriptionDuration(now, selectedWhiteLabelDuration).toISOString().slice(0, 10);
    const dateStr = now.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });
    const invNumber = `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newInvoice: DoctorInvoice = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      invoiceNumber: invNumber,
      doctorId: whiteLabelModalDoctor.id,
      doctorName: whiteLabelModalDoctor.name,
      doctorEmail: whiteLabelModalDoctor.email,
      doctorPhone: whiteLabelModalDoctor.phone,
      doctorJobTitle: whiteLabelModalDoctor.jobTitle,
      doctorSpecialty: whiteLabelModalDoctor.specialty,
      planDuration: selectedWhiteLabelDuration === 'annual' ? 'إخفاء حقوق المنصة (سنة كاملة)' : 'إخفاء حقوق المنصة (6 أشهر)',
      subscriptionType: selectedWhiteLabelDuration,
      date: dateStr,
      createdAt: now.toISOString(),
      amount: 350,
      currency: 'ج.م',
      status: 'paid',
      statusText: 'مدفوعة ومكتملة',
      paymentMethod: 'InstaPay',
      notes: 'رسوم خدمة إخفاء حقوق المنصة (White Label) - تم التفعيل بنجاح عبر لوحة الإدارة بسعر 350 ج.م سنوياً'
    };

    const updated = doctors.map(doc => {
      if (doc.id === whiteLabelModalDoctor.id) {
        const existingInvoices = doc.invoices || [];
        return {
          ...doc,
          whiteLabel: true,
          whiteLabelDuration: selectedWhiteLabelDuration,
          whiteLabelEndDate: expiry,
          invoices: [newInvoice, ...existingInvoices]
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
    setWhiteLabelModalDoctor(null);
  };

  // Revoke/Cancel White Label
  const handleRevokeWhiteLabel = () => {
    if (!whiteLabelModalDoctor) return;
    const updated = doctors.map(doc => {
      if (doc.id === whiteLabelModalDoctor.id) {
        return {
          ...doc,
          whiteLabel: false,
          whiteLabelEndDate: undefined,
          whiteLabelDuration: undefined
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
    setWhiteLabelModalDoctor(null);
  };

  // Legacy fallback toggle if needed
  const handleToggleVerification = (docId: string) => {
    const doc = doctors.find(d => d.id === docId);
    if (doc) {
      handleOpenVerificationModal(doc);
    }
  };

  const handleToggleWhiteLabel = (docId: string) => {
    const doc = doctors.find(d => d.id === docId);
    if (doc) {
      handleOpenWhiteLabelModal(doc);
    }
  };

  // Toggle Subscription Package type
  const handleToggleSubscriptionPackage = (docId: string, type: '6months' | 'annual') => {
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        const regDate = doc.registeredAt ? new Date(doc.registeredAt) : new Date();
        const newExpiry = addSubscriptionDuration(regDate, type).toISOString().slice(0, 10);
        return {
          ...doc,
          subscriptionType: type,
          subscriptionEndDate: newExpiry,
          isVerified: doc.isVerified ?? false
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
  };

  // Reset Password action
  const handleResetPassword = (docId: string) => {
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          password: '123456'
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
    alert('تم إعادة تعيين كلمة مرور الطبيب بنجاح إلى: 123456');
  };

  // Extend subscription
  const handleExtendSubscription = (docId: string, months: number) => {
    const updated = doctors.map(doc => {
      if (doc.id === docId) {
        const now = new Date();
        let baseDate = now;
        if (doc.isPaidSubscription && !doc.isTrial && doc.subscriptionEndDate) {
          const existingPaidExpiry = new Date(doc.subscriptionEndDate);
          if (!isNaN(existingPaidExpiry.getTime()) && existingPaidExpiry > now) {
            baseDate = existingPaidExpiry;
          }
        }
        const newExpiry = addSubscriptionDuration(baseDate, months);
        return {
          ...doc,
          isActiveSubscription: true,
          isPaidSubscription: true,
          isTrial: false,
          subscriptionEndDate: newExpiry.toISOString().slice(0, 10)
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
    alert(`تم تمديد اشتراك الطبيب بنجاح لمدة ${months} شهر وتنشيط حسابه!`);
  };

  // Edit form logic
  const handleStartEditing = (doc: Doctor) => {
    setEditingDoctorId(doc.id);
    setEditFormData({
      name: doc.name,
      jobTitle: doc.jobTitle,
      email: doc.email,
      phone: doc.phone,
      whatsapp: doc.whatsapp,
      specialty: doc.specialty,
      subscriptionType: doc.subscriptionType || 'annual',
      isVerified: doc.isVerified ?? false,
      whiteLabel: doc.whiteLabel ?? false,
      isActiveSubscription: doc.isActiveSubscription
    });
  };

  const renderSubscriptionsTab = () => {
    // Aggregates
    const allInvoices = doctors
      .flatMap(d => d.invoices || [])
      .sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
    
    const activeSubDocs = doctors.filter(d => d.isActiveSubscription && d.isPaidSubscription);
    const trialSubDocs = doctors.filter(d => d.isTrial || !d.isPaidSubscription);
    const expiredSubDocs = doctors.filter(d => {
      const exp = getDoctorExpiryDate(d);
      return exp < new Date() || (!d.isActiveSubscription && !d.isTrial);
    });
    const annualSubDocs = doctors.filter(d => d.subscriptionType === 'annual' && d.isActiveSubscription);
    const sixMonthsSubDocs = doctors.filter(d => d.subscriptionType === '6months' && d.isActiveSubscription);
    const totalInvoicedRevenue = allInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);

    // Filter doctors
    const filteredSubDocs = doctors.filter(d => {
      const matchesSearch = !subscriptionSearchTerm.trim() || 
        d.name.toLowerCase().includes(subscriptionSearchTerm.toLowerCase()) ||
        d.phone.includes(subscriptionSearchTerm) ||
        d.specialty.toLowerCase().includes(subscriptionSearchTerm.toLowerCase()) ||
        (d.jobTitle && d.jobTitle.toLowerCase().includes(subscriptionSearchTerm.toLowerCase()));
      
      if (!matchesSearch) return false;

      if (subscriptionStatusFilter === 'active') return d.isActiveSubscription && d.isPaidSubscription;
      if (subscriptionStatusFilter === 'trial') return d.isTrial || !d.isPaidSubscription;
      if (subscriptionStatusFilter === 'expired') {
        const exp = getDoctorExpiryDate(d);
        return exp < new Date() || (!d.isActiveSubscription && !d.isTrial);
      }
      return true;
    });

    // Filter invoices
    const filteredInvoices = allInvoices.filter(inv => {
      const matchesSearch = !invoiceSearchTerm.trim() ||
        inv.invoiceNumber.toLowerCase().includes(invoiceSearchTerm.toLowerCase()) ||
        inv.doctorName.toLowerCase().includes(invoiceSearchTerm.toLowerCase()) ||
        (inv.doctorPhone && inv.doctorPhone.includes(invoiceSearchTerm));
      
      if (!matchesSearch) return false;

      if (invoiceMethodFilter !== 'all') {
        return inv.paymentMethod === invoiceMethodFilter;
      }
      return true;
    });

    return (
      <div className="space-y-6 text-right animate-fadeIn">
        
        {/* Header Title & Description */}
        <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2.5 rounded-2xl bg-blue-50 text-[#0051A8] border border-blue-200">
                <CreditCard className="w-5 h-5" />
              </span>
              <h2 className="text-xl md:text-2xl font-black text-neutral-900">
                الاشتراكات والفواتير
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-neutral-500 font-semibold mt-1">
              تفعيل وتجديد اشتراكات الأطباء مع تحديد طريقة الدفع، وتوليد الفواتير الإلكترونية المعتمدة في نفس اللحظة
            </p>
          </div>

          {/* Trash Button & Sub-tabs toggle buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsTrashModalOpen(true)}
              className="p-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-2xl transition-all cursor-pointer flex items-center justify-center border border-neutral-200 shadow-2xs relative"
              title="سلة المحذوفات"
              aria-label="سلة المحذوفات"
            >
              <Trash2 className="w-5 h-5 text-neutral-700" />
              {deletedDoctors.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs">
                  {deletedDoctors.length}
                </span>
              )}
            </button>

            <div className="flex items-center gap-2 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => setSubscriptionsSubTab('all')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  subscriptionsSubTab === 'all'
                    ? 'bg-[#10244A] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                👥 قائمة الأطباء ({doctors.length})
              </button>

              <button
                type="button"
                onClick={() => setSubscriptionsSubTab('invoices')}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  subscriptionsSubTab === 'invoices'
                    ? 'bg-[#10244A] text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                📄 سجل الفواتير ({allInvoices.length})
              </button>
            </div>
          </div>
        </div>

        {/* STATS OVERVIEW CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl border border-neutral-200/70 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-400">إجمالي إيرادات الفواتير</span>
              <h3 className="text-xl md:text-2xl font-black text-emerald-600">{totalInvoicedRevenue.toLocaleString('ar-EG')} ج.م</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200/70 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-400">الاشتراكات النشطة (مدفوعة)</span>
              <h3 className="text-xl md:text-2xl font-black text-[#10244A]">{activeSubDocs.length} طبيب</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#10244A] flex items-center justify-center border border-blue-200">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200/70 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-400">باقات سنوية كاملة</span>
              <h3 className="text-xl md:text-2xl font-black text-indigo-600">{annualSubDocs.length} طبيب</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-200">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-neutral-200/70 p-5 shadow-xs flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-neutral-400">باقات نصف سنوية (6 شهور)</span>
              <h3 className="text-xl md:text-2xl font-black text-amber-600">{sixMonthsSubDocs.length} طبيب</h3>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Search className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* VIEW 1: Doctors Subscriptions Table / Cards */}
        {subscriptionsSubTab === 'all' && (
          <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-xs space-y-6">
            
            {/* Search & Filter Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={subscriptionSearchTerm}
                  onChange={(e) => setSubscriptionSearchTerm(e.target.value)}
                  placeholder="بحث باسم الطبيب، رقم الجوال، التخصص، أو المدينة..."
                  className="w-full pl-4 pr-11 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-black transition-all text-right"
                />
              </div>

              {/* Status Filters & PDF Report Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: `الكل (${doctors.length})` },
                  { id: 'active', label: `نشط ومفعل (${activeSubDocs.length})` },
                  { id: 'trial', label: `فترة تجريبية (${trialSubDocs.length})` },
                  { id: 'expired', label: `منتهي (${expiredSubDocs.length})` },
                ].map(f => {
                  const handleDownloadDoctorsPdf = (statusId: string, statusLabel: string) => {
                    let targetDocs = doctors;
                    if (statusId === 'active') targetDocs = activeSubDocs;
                    else if (statusId === 'trial') targetDocs = trialSubDocs;
                    else if (statusId === 'expired') targetDocs = expiredSubDocs;

                    const rowsHtml = targetDocs.map(d => 
                      '<tr>' +
                      '<td>' + d.name + '</td>' +
                      '<td>' + d.email + '</td>' +
                      '<td>' + d.phone + '</td>' +
                      '<td>' + (d.whatsapp || d.phone) + '</td>' +
                      '<td>' + d.specialty + '</td>' +
                      '<td>' + (d.isActiveSubscription && d.isPaidSubscription ? 'مدفوع ومفعل' : 'تجريبي / غير مفعل') + '</td>' +
                      '</tr>'
                    ).join('');

                    const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>منصة دكتور بروفايل dr Profile - قائمة الأطباء (${statusLabel})</title>
  <style>
    body { font-family: 'Cairo', Tahoma, sans-serif; padding: 30px; color: #111; direction: rtl; }
    h1 { font-size: 20px; color: #10244A; margin-bottom: 5px; }
    p { font-size: 12px; color: #666; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
    th, td { border: 1px solid #ddd; padding: 10px 12px; font-size: 11px; text-align: right; }
    th { background-color: #10244A; color: white; }
    tr:nth-child(even) { background-color: #f9f9f9; }
  </style>
</head>
<body>
  <h1>منصة دكتور بروفايل dr Profile</h1>
  <p>قائمة الأطباء - التصنيف: ${statusLabel} | تاريخ التقرير: ${new Date().toLocaleDateString('ar-EG')}</p>
  <table>
    <thead>
      <tr>
        <th>الاسم</th>
        <th>البريد الإلكتروني</th>
        <th>رقم الجوال</th>
        <th>الواتساب</th>
        <th>التخصص</th>
        <th>حالة الاشتراك</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>
</body>
</html>`;

                    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `dr-profile-doctors-${statusId}-${Date.now()}.html`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  };

                  return (
                    <div key={f.id} className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                      <button
                        type="button"
                        onClick={() => setSubscriptionStatusFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          subscriptionStatusFilter === f.id
                            ? 'bg-[#10244A] text-white shadow-2xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                      >
                        {f.label}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadDoctorsPdf(f.id, f.label)}
                        className="p-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer flex items-center justify-center shadow-2xs"
                        title={`تحميل تقرير أطباء (${f.label})`}
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Doctors List */}
            <div className="space-y-3">
              {filteredSubDocs.length === 0 ? (
                <div className="p-12 text-center text-neutral-400 space-y-2">
                  <Users className="w-8 h-8 mx-auto text-neutral-300" />
                  <p className="text-xs font-bold">لا يوجد أطباء مطابقين لخيارات البحث</p>
                </div>
              ) : (
                filteredSubDocs.map(doc => {
                  const expiryDate = getDoctorExpiryDate(doc);
                  const daysRemaining = getDoctorDaysRemaining(doc);
                  const isExpired = expiryDate < new Date();
                  const docInvoices = doc.invoices || [];
                  const isExpanded = expandedDoctorIds[doc.id] ?? false;

                  return (
                    <div
                      key={doc.id}
                      className="border-b border-neutral-100 bg-white last:border-0 hover:bg-neutral-50/40 transition-colors"
                    >
                      {/* Main row info */}
                      <div className="p-4 sm:p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          {/* Right Side: Doctor Avatar, Name, Badges, Downward Arrow */}
                          <div className="flex items-center gap-3.5 flex-wrap">
                            <img
                              src={doc.avatar || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=200'}
                              alt={doc.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-neutral-200 shadow-xs shrink-0"
                            />
                            
                            <div className="space-y-1">
                              <div className="flex items-center gap-2.5 flex-wrap">
                                {/* Doctor Name */}
                                <h4 className="font-black text-sm text-neutral-900">{doc.name}</h4>

                                {/* Expand / Collapse Toggle Arrow Button next to Name */}
                                <button
                                  type="button"
                                  onClick={(e) => toggleExpandDoctor(doc.id, e)}
                                  className={`p-1.5 rounded-xl border transition-all flex items-center gap-1 text-xs font-extrabold cursor-pointer ${
                                    isExpanded 
                                      ? 'bg-[#10244A] text-white border-[#10244A]' 
                                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200'
                                  }`}
                                  title={isExpanded ? 'إخفاء البيانات' : 'عرض البيانات'}
                                  aria-label="عرض أو إخفاء بيانات الطبيب"
                                >
                                  <span className="text-[10px]">التفاصيل</span>
                                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Subscription Status Badge */}
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                                  doc.isActiveSubscription && doc.isPaidSubscription
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : doc.isTrial 
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-red-50 text-red-800 border-red-200'
                                }`}>
                                  {doc.isActiveSubscription && doc.isPaidSubscription ? '● مدفوع نشط' : doc.isTrial ? '⏳ فترة تجريبية' : '⚠️ منتهي'}
                                </span>

                                {/* Plan Type Badge */}
                                {doc.subscriptionType && (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-[#0051A8] border border-blue-200">
                                    {doc.subscriptionType === 'annual' ? 'سنة كاملة' : '6 شهور'}
                                  </span>
                                )}

                                {/* 3 Dots Actions Menu Button (for Subscriptions) */}
                                <div className="relative doctor-actions-menu shrink-0 inline-block mr-1">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenDropdownDocId(openDropdownDocId === doc.id ? null : doc.id);
                                    }}
                                    className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                                      openDropdownDocId === doc.id 
                                        ? 'bg-[#10244A] text-white border-[#10244A] shadow-xs' 
                                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                                    }`}
                                    title="إجراءات الاشتراك"
                                    aria-label="قائمة الخيارات"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  {/* Dropdown Menu Popup */}
                                  {openDropdownDocId === doc.id && (
                                    <div 
                                      onClick={(e) => e.stopPropagation()}
                                      className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-2xl shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-right divide-y divide-neutral-100"
                                    >
                                      <div className="py-1">
                                        {docInvoices.length > 0 && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenDropdownDocId(null);
                                              setSelectedInvoiceForModal(docInvoices[0]);
                                              setIsInvoiceModalOpen(true);
                                            }}
                                            className="w-full px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-blue-600 flex items-center justify-between gap-2 transition-colors cursor-pointer text-right"
                                          >
                                            <span>معاينة آخر فاتورة</span>
                                            <FileText className="w-3.5 h-3.5 text-blue-500" />
                                          </button>
                                        )}

                                        {/* توثيق الحساب / إلغاء التوثيق */}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setOpenDropdownDocId(null);
                                            handleToggleVerification(doc.id);
                                          }}
                                          className={`w-full px-3.5 py-2 text-xs font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer text-right ${
                                            Boolean(doc.isVerified)
                                              ? 'text-amber-700 hover:bg-amber-50'
                                              : 'text-blue-600 hover:bg-blue-50'
                                          }`}
                                        >
                                          <span>{Boolean(doc.isVerified) ? 'إلغاء التوثيق (إخفاء الشارة)' : 'توثيق الطبيب (الشارة الزرقاء)'}</span>
                                          <ShieldCheck className={`w-3.5 h-3.5 ${Boolean(doc.isVerified) ? 'text-amber-500' : 'text-blue-500'}`} />
                                        </button>

                                        {doc.isActiveSubscription && doc.isPaidSubscription ? (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenDropdownDocId(null);
                                              handleOpenActivateModal(doc);
                                            }}
                                            className="w-full px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between gap-2 transition-colors cursor-pointer text-right"
                                          >
                                            <span>تغيير خطة الاشتراك</span>
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                          </button>
                                        ) : (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenDropdownDocId(null);
                                              handleOpenActivateModal(doc);
                                            }}
                                            className="w-full px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between gap-2 transition-colors cursor-pointer text-right"
                                          >
                                            <span>تفعيل الاشتراك وإصدار فاتورة</span>
                                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                                          </button>
                                        )}
                                      </div>

                                      {doc.isActiveSubscription && doc.isPaidSubscription && (
                                        <div className="pt-1">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenDropdownDocId(null);
                                              handleCancelSubscription(doc.id);
                                            }}
                                            className="w-full px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center justify-between gap-2 transition-colors cursor-pointer text-right"
                                          >
                                            <span>إلغاء الاشتراك</span>
                                            <XCircle className="w-3.5 h-3.5 text-red-500" />
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="text-[11px] font-semibold text-neutral-400">
                                تاريخ انتهاء الباقة: <span className="font-bold text-neutral-700">{expiryDate.toLocaleDateString('ar-EG')}</span> ({daysRemaining} يوم متبقي)
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details Section */}
                        {isExpanded && (
                          <div className="mt-2 pt-3 border-t border-neutral-100 bg-neutral-50/80 p-3.5 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-700 font-semibold">
                              {doc.phone && (
                                <span className="inline-flex items-center gap-1.5">
                                  <span>📞</span>
                                  <span>رقم الهاتف: {doc.phone}</span>
                                </span>
                              )}
                              {doc.whatsapp && (
                                <span className="inline-flex items-center gap-1.5 text-emerald-600">
                                  <span>💬</span>
                                  <span>واتساب: {doc.whatsapp}</span>
                                </span>
                              )}
                              {doc.email && (
                                <span className="inline-flex items-center gap-1.5">
                                  <span>📧</span>
                                  <span>البريد: {doc.email}</span>
                                </span>
                              )}
                              {doc.specialty && (
                                <span className="inline-flex items-center gap-1.5 text-blue-700">
                                  <span>🩺</span>
                                  <span>التخصص: {normalizeSpecialtyToArabic(doc.specialty)}</span>
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: All System Invoices Log */}
        {subscriptionsSubTab === 'invoices' && (
          <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-xs space-y-6">
            
            {/* Toolbar for Invoices */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  value={invoiceSearchTerm}
                  onChange={(e) => setInvoiceSearchTerm(e.target.value)}
                  placeholder="بحث برقم الفاتورة، اسم الطبيب، أو وسيلة الدفع..."
                  className="w-full pl-4 pr-11 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-black transition-all text-right"
                />
              </div>

              {/* Payment Method Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200">
                {[
                  { id: 'all', label: 'جميع وسائل الدفع' },
                  { id: 'Vodafone Cash', label: 'Vodafone Cash' },
                  { id: 'InstaPay', label: 'InstaPay' },
                  { id: 'Etisalat Cash', label: 'Etisalat Cash' },
                  { id: 'Orange Cash', label: 'Orange Cash' },
                  { id: 'WE Pay', label: 'WE Pay' },
                ].map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setInvoiceMethodFilter(m.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      invoiceMethodFilter === m.id
                        ? 'bg-[#10244A] text-white shadow-2xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-3">
              {filteredInvoices.length === 0 ? (
                <div className="p-12 text-center text-neutral-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-neutral-300" />
                  <p className="text-xs font-bold">لا توجد فواتير مسجلة مطابقة للبحث</p>
                </div>
              ) : (
                filteredInvoices.map((inv) => (
                  <div
                    key={inv.id || inv.invoiceNumber}
                    className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-neutral-50/50 border border-neutral-200/90 transition-all shadow-2xs space-y-3 text-right"
                  >
                    {/* Top Header: Invoice Number & Doctor (Right) and Action Icons (Left) */}
                    <div className="flex items-center justify-between gap-3">
                      
                      {/* Right: Icon + Invoice Number + Doctor Name */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200/70 flex items-center justify-center text-neutral-700 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm sm:text-base font-black text-neutral-900 font-mono tracking-tight">
                              {inv.invoiceNumber}
                            </h4>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {inv.statusText || 'مدفوعة'}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-500 font-bold">
                            الطبيب: {inv.doctorName}
                          </p>
                        </div>
                      </div>

                      {/* Left: Action Icon Buttons (Icons only, no text) */}
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedInvoiceForModal(inv);
                            setIsInvoiceModalOpen(true);
                          }}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all cursor-pointer active:scale-95 shadow-2xs"
                          title="معاينة الفاتورة"
                          aria-label="معاينة الفاتورة"
                        >
                          <FileText className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            downloadInvoiceDirectly(inv);
                          }}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-[#0f1f3d] hover:bg-[#182e56] text-white transition-all cursor-pointer active:scale-95 shadow-2xs"
                          title="تحميل الفاتورة تلقائياً"
                          aria-label="تحميل الفاتورة تلقائياً"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteInvoice(inv.id || inv.invoiceNumber, inv.doctorId)}
                          className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all cursor-pointer active:scale-95 shadow-2xs"
                          title="حذف الفاتورة وإرسالها إلى سلة المحذوفات"
                          aria-label="حذف الفاتورة"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                    </div>

                    {/* Bottom Row: 4 Divided Columns */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-neutral-100 sm:divide-x sm:divide-x-reverse sm:divide-neutral-200/70 text-right">
                      
                      {/* Col 1: تاريخ الإصدار */}
                      <div className="space-y-0.5">
                        <span className="text-[11px] text-neutral-400 font-bold block">
                          📅 تاريخ الإصدار
                        </span>
                        <span className="text-xs sm:text-sm font-black text-neutral-800 block">
                          {inv.date}
                        </span>
                      </div>

                      {/* Col 2: مدة الاشتراك */}
                      <div className="space-y-0.5 sm:pr-3">
                        <span className="text-[11px] text-neutral-400 font-bold block">
                          ⏰ مدة الاشتراك
                        </span>
                        <span className="text-xs sm:text-sm font-black text-neutral-800 block">
                          {inv.planDuration}
                        </span>
                      </div>

                      {/* Col 3: المبلغ */}
                      <div className="space-y-0.5 sm:pr-3">
                        <span className="text-[11px] text-neutral-400 font-bold block">
                          👛 المبلغ
                        </span>
                        <span className="text-xs sm:text-sm font-black text-emerald-600 block">
                          {inv.amount.toLocaleString('ar-EG')} {inv.currency || 'ج.م'}
                        </span>
                      </div>

                      {/* Col 4: طريقة الدفع */}
                      <div className="space-y-0.5 sm:pr-3">
                        <span className="text-[11px] text-neutral-400 font-bold block">
                          💳 طريقة الدفع
                        </span>
                        <span className="text-xs sm:text-sm font-black text-neutral-800 block">
                          {inv.paymentMethod}
                        </span>
                      </div>

                    </div>

                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    );
  };

  const handleSaveDoctorEdit = () => {
    if (!editingDoctorId || !editFormData) return;
    const now = new Date();
    const dateStr = now.toLocaleDateString('ar-EG', { year: 'numeric', month: '2-digit', day: '2-digit' });

    const updated = doctors.map(doc => {
      if (doc.id === editingDoctorId) {
        let newEnd = doc.subscriptionEndDate;
        if (doc.subscriptionType !== editFormData.subscriptionType) {
          const regDate = doc.registeredAt ? new Date(doc.registeredAt) : new Date();
          newEnd = addSubscriptionDuration(regDate, editFormData.subscriptionType).toISOString().slice(0, 10);
        }

        const newInvoices: DoctorInvoice[] = [...(doc.invoices || [])];

        // If verification was newly enabled
        if (!doc.isVerified && editFormData.isVerified) {
          const invNumber = `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          newInvoices.unshift({
            id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            invoiceNumber: invNumber,
            doctorId: doc.id,
            doctorName: editFormData.name || doc.name,
            doctorEmail: editFormData.email || doc.email,
            doctorPhone: editFormData.phone || doc.phone,
            doctorJobTitle: editFormData.jobTitle || doc.jobTitle,
            doctorSpecialty: editFormData.specialty || doc.specialty,
            planDuration: 'خدمة توثيق الحساب (الشارة الزرقاء)',
            subscriptionType: doc.verificationDuration || 'annual',
            date: dateStr,
            createdAt: now.toISOString(),
            amount: 250,
            currency: 'ج.م',
            status: 'paid',
            statusText: 'مدفوعة ومكتملة',
            paymentMethod: 'InstaPay',
            notes: 'رسوم خدمة توثيق الحساب (الشارة الزرقاء) - تم التفعيل بنجاح عبر تعديل بيانات الطبيب'
          });
        }

        // If white label was newly enabled
        if (!doc.whiteLabel && editFormData.whiteLabel) {
          const invNumber = `INV-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
          newInvoices.unshift({
            id: `inv-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            invoiceNumber: invNumber,
            doctorId: doc.id,
            doctorName: editFormData.name || doc.name,
            doctorEmail: editFormData.email || doc.email,
            doctorPhone: editFormData.phone || doc.phone,
            doctorJobTitle: editFormData.jobTitle || doc.jobTitle,
            doctorSpecialty: editFormData.specialty || doc.specialty,
            planDuration: 'خدمة إخفاء حقوق المنصة (White Label)',
            subscriptionType: doc.whiteLabelDuration || 'annual',
            date: dateStr,
            createdAt: now.toISOString(),
            amount: 350,
            currency: 'ج.م',
            status: 'paid',
            statusText: 'مدفوعة ومكتملة',
            paymentMethod: 'InstaPay',
            notes: 'رسوم خدمة إخفاء حقوق المنصة (White Label) - تم التفعيل بنجاح عبر تعديل بيانات الطبيب'
          });
        }

        return {
          ...doc,
          name: editFormData.name,
          jobTitle: editFormData.jobTitle,
          email: editFormData.email,
          phone: editFormData.phone,
          whatsapp: editFormData.whatsapp,
          specialty: editFormData.specialty,
          subscriptionType: editFormData.subscriptionType,
          subscriptionEndDate: newEnd,
          isVerified: editFormData.isVerified,
          whiteLabel: editFormData.whiteLabel,
          isActiveSubscription: editFormData.isActiveSubscription,
          invoices: newInvoices
        };
      }
      return doc;
    });
    onUpdateDoctors(updated);
    setEditingDoctorId(null);
    setEditFormData(null);
  };

  // Remove a doctor from the system and send to trash
  const handleRemoveDoctor = (docId: string) => {
    const docToRemove = doctors.find(doc => doc.id === docId || doc.nameEn === docId);
    if (docToRemove) {
      setDeletedDoctors(prev => {
        if (prev.some(d => d.id === docToRemove.id)) return prev;
        const next = [...prev, docToRemove];
        try {
          localStorage.setItem('admin_deleted_doctors', JSON.stringify(next));
        } catch {}
        return next;
      });
      const updated = doctors.filter(doc => doc.id !== docToRemove.id && doc.nameEn !== docToRemove.nameEn);
      onUpdateDoctors(updated);
    } else {
      const updated = doctors.filter(doc => doc.id !== docId);
      onUpdateDoctors(updated);
    }
  };

  const handleRestoreDoctor = (doc: Doctor) => {
    setDeletedDoctors(prev => {
      const next = prev.filter(d => d.id !== doc.id && d.nameEn !== doc.nameEn);
      try {
        localStorage.setItem('admin_deleted_doctors', JSON.stringify(next));
      } catch {}
      return next;
    });

    const now = new Date();
    const oneYearLater = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

    const restoredDoc: Doctor = {
      ...doc,
      isActiveSubscription: true,
      approvalStatus: 'approved',
      status: 'approved',
      isPaidSubscription: true,
      isTrial: false,
      subscriptionEndDate: doc.subscriptionEndDate && new Date(doc.subscriptionEndDate) > now 
        ? doc.subscriptionEndDate 
        : oneYearLater,
      trialEndDate: oneYearLater,
    };

    if (doctors.some(d => d.id === doc.id || d.nameEn === doc.nameEn)) {
      const updated = doctors.map(d => (d.id === doc.id || d.nameEn === doc.nameEn) ? restoredDoc : d);
      onUpdateDoctors(updated);
    } else {
      onUpdateDoctors([...doctors, restoredDoc]);
    }
  };

  const handleDeleteInvoice = (invoiceId: string, doctorId: string) => {
    const doc = doctors.find(d => d.id === doctorId);
    if (!doc || !doc.invoices) return;
    const invToRemove = doc.invoices.find(inv => (inv.id || inv.invoiceNumber) === invoiceId);
    if (invToRemove) {
      setDeletedInvoices(prev => [...prev, invToRemove]);
      const updatedInvoices = doc.invoices.filter(inv => (inv.id || inv.invoiceNumber) !== invoiceId);
      const updatedDoctors = doctors.map(d => d.id === doctorId ? { ...d, invoices: updatedInvoices } : d);
      onUpdateDoctors(updatedDoctors);
    }
  };

  const handleRestoreInvoice = (inv: DoctorInvoice) => {
    setDeletedInvoices(prev => prev.filter(i => (i.id || i.invoiceNumber) !== (inv.id || inv.invoiceNumber)));
    const doc = doctors.find(d => d.name === inv.doctorName || d.id === inv.doctorId);
    if (doc) {
      const updatedInvoices = [...(doc.invoices || []), inv];
      const updatedDoctors = doctors.map(d => d.id === doc.id ? { ...d, invoices: updatedInvoices } : d);
      onUpdateDoctors(updatedDoctors);
    } else if (doctors.length > 0) {
      const firstDoc = doctors[0];
      const updatedInvoices = [...(firstDoc.invoices || []), inv];
      const updatedDoctors = doctors.map((d, i) => i === 0 ? { ...d, invoices: updatedInvoices } : d);
      onUpdateDoctors(updatedDoctors);
    }
  };

  const handleCancelSubscription = (docId: string) => {
    handleRemoveDoctor(docId);
  };

  // Add Specialty
  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSpecialtyName.trim()) return;
    
    const formattedName = normalizeSpecialtyToArabic(newSpecialtyName.trim());
    const newSpec: SystemSpecialty = {
      id: `spec-${Date.now()}`,
      name: formattedName,
      count: 0
    };
    
    const updated = [...localSpecialties, newSpec];
    setLocalSpecialties(updated);
    setNewSpecialtyName('');
    if (onUpdateSpecialties) {
      onUpdateSpecialties(updated);
    }
  };

  // Delete Specialty
  const handleDeleteSpecialty = (specId: string) => {
    const updated = localSpecialties.filter(s => s.id !== specId);
    setLocalSpecialties(updated);
    if (onUpdateSpecialties) {
      onUpdateSpecialties(updated);
    }
  };

  // Statistics Metrics
  const totalDoctorsCount = doctors.length;
  const activeDoctorsCount = doctors.filter(d => (d.approvalStatus === 'approved' || !d.approvalStatus) && d.isActiveSubscription).length;
  const pendingDoctorsCount = doctors.filter(d => d.approvalStatus === 'pending').length;
  const rejectedDoctorsCount = doctors.filter(d => d.approvalStatus === 'rejected').length;
  
  const activeSubscriptionsCount = doctors.filter(d => d.isActiveSubscription).length;
  const expiredSubscriptionsCount = doctors.filter(d => !d.isActiveSubscription && (d.approvalStatus === 'approved' || !d.approvalStatus)).length;
  const expiringDoctorsCount = doctors.filter(d => getDoctorDaysRemaining(d) <= 30 && getDoctorDaysRemaining(d) > 0).length;
  
  const totalAppointmentsCount = appointments.length;
  const todayDateStr = '2026-07-15'; // Defined in initial appointments or current dynamic date
  const todayAppointmentsCount = appointments.filter(a => a.date === todayDateStr || a.date === new Date().toISOString().split('T')[0]).length;

  const totalRevenueVal = doctors.filter(d => d.isActiveSubscription).reduce((sum, d) => sum + (d.subscriptionType === '6months' ? 1500 : 2500), 0);
  const monthlyRevenueVal = Math.round(doctors.filter(d => d.isActiveSubscription).reduce((sum, d) => sum + (d.subscriptionType === '6months' ? 250 : 208.3), 0));

  // Latest registered doctors (last 5)
  const latestRegisteredDoctors = [...doctors]
    .sort((a, b) => (b.registeredAt || '').localeCompare(a.registeredAt || ''))
    .slice(0, 5);

  // Latest bookings (last 5)
  const latestAppointments = [...appointments]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, 5);

  // Dynamic Specialties list - All in Arabic & automatically syncs with System Specialties
  const availableDoctorSpecialties = React.useMemo(() => {
    const specSet = new Set<string>();

    // 1. All system specialties from local state
    if (localSpecialties && Array.isArray(localSpecialties)) {
      localSpecialties.forEach(s => {
        if (s.name && s.name.trim()) {
          const arName = normalizeSpecialtyToArabic(s.name.trim());
          if (arName) specSet.add(arName);
        }
      });
    }

    // 2. All system specialties from prop
    if (specialties && Array.isArray(specialties)) {
      specialties.forEach(s => {
        if (s.name && s.name.trim()) {
          const arName = normalizeSpecialtyToArabic(s.name.trim());
          if (arName) specSet.add(arName);
        }
      });
    }

    // 3. All specialties from registered doctors
    doctors.forEach(d => {
      if (d.specialty && d.specialty.trim()) {
        const arName = normalizeSpecialtyToArabic(d.specialty.trim());
        if (arName) specSet.add(arName);
      }
    });

    // 4. Fallback defaults if list is somehow empty
    if (specSet.size === 0) {
      [
        'طب وجراحة الأسنان',
        'الجلدية والتجميل والليزر',
        'طب الأطفال وحديثي الولادة',
        'أمراض القلب والأوعية الدموية',
        'جراحة العظام والمفاصل',
        'طب وجراحة العيون',
        'أمراض المخ والأعصاب',
        'الطب النفسي وعلاج الإدمان',
        'الأمراض الباطنية والجهاز الهضمي',
        'أنف وأذن وحنجرة',
        'طب النساء والتوليد'
      ].forEach(s => specSet.add(s));
    }

    return Array.from(specSet).sort((a, b) => a.localeCompare(b, 'ar'));
  }, [localSpecialties, specialties, doctors]);

  // Dynamic Cities & Governorates list
  const availableDoctorCities = React.useMemo(() => {
    const citySet = new Set<string>();
    const commonGovs = [
      'القاهرة', 'الجيزة', 'الإسكندرية', 'القليوبية', 'الدقهلية', 'المنصورة', 'طنطا', 'الغربية',
      'المنوفية', 'الشرقية', 'الزقازيق', 'البحيرة', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية',
      'السويس', 'الفيوم', 'بني سويف', 'المنيا', 'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان',
      'البحر الأحمر', 'الغردقة', 'شرم الشيخ', 'مطروح', 'الوادي الجديد', 'شمال سيناء', 'جنوب سيناء'
    ];

    doctors.forEach(doc => {
      const fullText = `${doc.address || ''} ${(doc.branches || []).map(b => `${b.name || ''} ${b.address || ''}`).join(' ')}`;
      commonGovs.forEach(gov => {
        if (fullText.includes(gov)) {
          citySet.add(gov);
        }
      });
      // Also extract simple city tokens from address
      if (doc.address) {
        doc.address.split(/[-–,،\n/]/).forEach(part => {
          const t = part.trim();
          if (t.length >= 3 && t.length <= 20 && !t.includes('شارع') && !t.includes('عمارة') && !t.includes('برج') && !t.includes('ميدان')) {
            citySet.add(t);
          }
        });
      }
      if (doc.branches) {
        doc.branches.forEach(b => {
          if (b.address) {
            b.address.split(/[-–,،\n/]/).forEach(part => {
              const t = part.trim();
              if (t.length >= 3 && t.length <= 20 && !t.includes('شارع') && !t.includes('عمارة') && !t.includes('برج') && !t.includes('ميدان')) {
                citySet.add(t);
              }
            });
          }
        });
      }
    });

    if (citySet.size === 0) {
      ['القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'المنصورة', 'طنطا', 'الغربية', 'الشرقية', 'أسيوط'].forEach(c => citySet.add(c));
    }

    return Array.from(citySet).sort();
  }, [doctors]);

  // Filtered lists for rendering management table with enhanced multi-criteria filters
  const filteredDoctors = doctors.filter(doc => {
    // 1. Text Search Term (Strictly: Name, English Name/Slug, Email, Phone/WhatsApp only)
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      const matchesSearch = 
        (doc.name || '').toLowerCase().includes(term) || 
        (doc.nameEn || '').toLowerCase().includes(term) || 
        (doc.email || '').toLowerCase().includes(term) ||
        (doc.phone || '').toLowerCase().includes(term) ||
        (doc.whatsapp || '').toLowerCase().includes(term);

      if (!matchesSearch) return false;
    }

    // 2. Specialty Filter (Strict Arabic / Multi-format matching)
    if (doctorSpecialtyFilter !== 'all') {
      const targetSpec = doctorSpecialtyFilter.trim();
      const docSpecNormalized = normalizeSpecialtyToArabic(doc.specialty || '');
      const docSpecRaw = (doc.specialty || '').trim();

      const isMatch = 
        docSpecNormalized === targetSpec ||
        docSpecRaw === targetSpec ||
        docSpecNormalized.toLowerCase() === targetSpec.toLowerCase() ||
        docSpecRaw.toLowerCase() === targetSpec.toLowerCase();

      if (!isMatch) {
        return false;
      }
    }

    // 2.5 Status Filter
    if (doctorAccountStatusFilter !== 'all') {
      const isSuspended = doc.approvalStatus === 'suspended' || doc.status === 'suspended';
      const expDate = getDoctorExpiryDate(doc);
      const isExpired = expDate < new Date() || (!doc.isActiveSubscription && !doc.isTrial);
      
      let currentStatus = 'suspended';
      if (!isSuspended) {
        if (isExpired) {
          currentStatus = 'expired';
        } else if (doc.isActiveSubscription && doc.isPaidSubscription) {
          currentStatus = 'active';
        } else if (doc.isTrial || !doc.isPaidSubscription) {
          currentStatus = 'trial';
        }
      }

      if (currentStatus !== doctorAccountStatusFilter) {
        return false;
      }
    }

    // 3. Governorate / City Filter (Manual text search)
    if (doctorCityFilter.trim() !== '') {
      const cityQuery = doctorCityFilter.toLowerCase().trim();
      const docAddress = (doc.address || '').toLowerCase();
      const branchesAddress = (doc.branches || []).map(b => `${b.name || ''} ${b.address || ''}`).join(' ').toLowerCase();
      const fullLocText = `${docAddress} ${branchesAddress}`;
      if (!fullLocText.includes(cityQuery)) {
        return false;
      }
    }

    // 4. Registration Date Filter
    if (doctorDateFilter !== 'all') {
      if (!doc.registeredAt) {
        return false;
      }
      const regDate = new Date(doc.registeredAt);
      if (isNaN(regDate.getTime())) {
        return true;
      }

      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (doctorDateFilter === 'today') {
        const regDay = new Date(regDate.getFullYear(), regDate.getMonth(), regDate.getDate());
        if (regDay.getTime() !== startOfToday.getTime()) return false;
      } else if (doctorDateFilter === '7days') {
        const past7 = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (regDate < past7) return false;
      } else if (doctorDateFilter === '30days') {
        const past30 = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (regDate < past30) return false;
      } else if (doctorDateFilter === 'month') {
        if (regDate.getFullYear() !== now.getFullYear() || regDate.getMonth() !== now.getMonth()) return false;
      } else if (doctorDateFilter === 'year') {
        if (regDate.getFullYear() !== now.getFullYear()) return false;
      } else if (doctorDateFilter === 'custom') {
        if (doctorCustomStartDate) {
          const start = new Date(doctorCustomStartDate);
          if (!isNaN(start.getTime()) && regDate < start) return false;
        }
        if (doctorCustomEndDate) {
          const end = new Date(doctorCustomEndDate);
          end.setHours(23, 59, 59, 999);
          if (!isNaN(end.getTime()) && regDate > end) return false;
        }
      }
    }

    return true;
  }).sort((a, b) => {
    const dateA = a.registeredAt || '';
    const dateB = b.registeredAt || '';
    return dateB.localeCompare(dateA);
  });

  const hasActiveDoctorFilters = 
    searchTerm.trim() !== '' || 
    doctorSpecialtyFilter !== 'all' || 
    doctorCityFilter.trim() !== '' || 
    doctorDateFilter !== 'all';

  const handleResetDoctorFilters = () => {
    setSearchTerm('');
    setDoctorSpecialtyFilter('all');
    setDoctorAccountStatusFilter('all');
    setDoctorCityFilter('');
    setDoctorDateFilter('all');
    setDoctorCustomStartDate('');
    setDoctorCustomEndDate('');
    setVisibleDoctorsCount(5);
  };

  // Export filtered doctors list as PDF Report
  const handleExportFilteredDoctors = () => {
    if (filteredDoctors.length === 0) return;

    const rowsHtml = filteredDoctors.map((doc, idx) => {
      const isDocActive = doc.isActiveSubscription === true && doc.approvalStatus !== 'suspended' && doc.status !== 'suspended';
      const mainAddress = doc.branches?.[0]?.address || doc.address || '—';
      const expiryDate = getDoctorExpiryDate(doc) || '—';
      const subType = doc.subscriptionType === '6months' ? '6 أشهر' : 'سنوي (12 شهر)';
      const statusText = isDocActive ? 'نشط ومفعل' : 'موقوف / غير نشط';
      const specialtyAr = normalizeSpecialtyToArabic(doc.specialty || '') || '—';

      return `
        <tr>
          <td style="text-align:center;font-weight:bold;">${idx + 1}</td>
          <td style="font-weight:bold;color:#10244A;">${doc.name || '—'}</td>
          <td>${specialtyAr}</td>
          <td dir="ltr" style="text-align:right;">${doc.phone || '—'}</td>
          <td dir="ltr" style="text-align:right;">${doc.whatsapp || doc.phone || '—'}</td>
          <td>${mainAddress}</td>
          <td>${subType}</td>
          <td><span class="${isDocActive ? 'status-active' : 'status-inactive'}">${statusText}</span></td>
          <td>${doc.registeredAt ? doc.registeredAt.slice(0, 10) : '—'}</td>
          <td>${expiryDate}</td>
        </tr>
      `;
    }).join('');

    const filterDetails = [
      doctorSpecialtyFilter !== 'all' ? `التخصص: ${normalizeSpecialtyToArabic(doctorSpecialtyFilter)}` : null,
      doctorCityFilter.trim() !== '' ? `المدينة/المحافظة: ${doctorCityFilter}` : null,
      doctorDateFilter !== 'all' ? `الفترة: ${doctorDateFilter}` : null,
    ].filter(Boolean).join(' | ') || 'جميع الأطباء بدون استثناء';

    const reportHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تقرير الأطباء المفلترين - دكتور بروفايل</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Cairo', Tahoma, sans-serif;
      padding: 24px;
      color: #1e293b;
      background: #fff;
      direction: rtl;
      font-size: 11px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #009bb9;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .title { font-size: 18px; font-weight: 900; color: #10244A; margin-bottom: 4px; }
    .subtitle { font-size: 11px; color: #64748b; font-weight: 600; }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
    }
    .meta-item strong { color: #10244A; font-weight: 800; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; }
    th {
      background-color: #10244A;
      color: #fff;
      padding: 8px 6px;
      font-size: 10px;
      font-weight: 800;
      border: 1px solid #0f172a;
      text-align: right;
    }
    td {
      padding: 7px 6px;
      font-size: 10px;
      border: 1px solid #cbd5e1;
      text-align: right;
    }
    tr:nth-child(even) { background-color: #f8fafc; }
    .status-active {
      display: inline-block;
      padding: 2px 6px;
      background: #dcfce7;
      color: #166534;
      border-radius: 4px;
      font-weight: 700;
      font-size: 9px;
    }
    .status-inactive {
      display: inline-block;
      padding: 2px 6px;
      background: #fee2e2;
      color: #991b1b;
      border-radius: 4px;
      font-weight: 700;
      font-size: 9px;
    }
    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94a3b8;
    }
    @media print {
      body { padding: 10px; }
      .no-print { display: none; }
      @page { size: landscape; margin: 10mm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">منصة دكتور بروفايل | dr Profile</div>
      <div class="subtitle">تقرير شامل للأطباء المفلترين بنظام إدارة المنصة</div>
    </div>
    <div style="text-align:left;">
      <div style="font-weight:800;color:#009bb9;font-size:12px;">لوحة تحكم الإدارة العامة</div>
      <div style="font-size:10px;color:#64748b;">تاريخ الإصدار: ${new Date().toLocaleDateString('ar-EG')}</div>
    </div>
  </div>

  <div class="meta-box">
    <div class="meta-item">إجمالي الأطباء المفلترين: <strong>${filteredDoctors.length} طبيب</strong></div>
    <div class="meta-item">الفلاتر المطبقة: <strong>${filterDetails}</strong></div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:25px;text-align:center;">#</th>
        <th>اسم الطبيب</th>
        <th>التخصص</th>
        <th>الهاتف</th>
        <th>الواتساب</th>
        <th>المحافظة / العنوان</th>
        <th>نوع الاشتراك</th>
        <th>الحالة</th>
        <th>تاريخ التسجيل</th>
        <th>انتهاء الاشتراك</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="footer">
    <div>تم استخراج هذا التقرير تلقائياً من نظام dr Profile لإدارة المنصات الطبية</div>
    <div>الصفحة 1 من 1</div>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 400);
    });
  </script>
</body>
</html>`;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHtml);
      printWindow.document.close();
    } else {
      // Fallback: download as HTML with print auto-trigger
      const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير_الأطباء_المفلترين_${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className={`w-full min-h-screen flex flex-col md:flex-row text-right transition-colors duration-200 ${
      isDarkMode ? 'bg-[#000000] text-white admin-dark-mode' : 'bg-neutral-100 text-neutral-900'
    }`}>
      {/* Dark Mode Custom CSS Rules */}
      {isDarkMode && (
        <style>{`
          .admin-dark-mode {
            background-color: #000000 !important;
            color: #ffffff !important;
          }
          .admin-dark-mode aside {
            background-color: #0d0e12 !important;
            border-color: #222634 !important;
            color: #ffffff !important;
          }
          .admin-dark-mode main {
            background-color: #000000 !important;
            color: #ffffff !important;
          }
          .admin-dark-mode .border-neutral-200,
          .admin-dark-mode .border-neutral-300,
          .admin-dark-mode .border-neutral-100 {
            border-color: #222634 !important;
          }
          .admin-dark-mode .bg-white,
          .admin-dark-mode .bg-neutral-50,
          .admin-dark-mode .bg-neutral-100,
          .admin-dark-mode .bg-neutral-50\\/80 {
            background-color: #0d0e12 !important;
            color: #ffffff !important;
            border-color: #222634 !important;
          }
          /* Cards inside main content get a subtle light border */
          .admin-dark-mode main .bg-white,
          .admin-dark-mode main .bg-neutral-50,
          .admin-dark-mode main .rounded-2xl,
          .admin-dark-mode main .rounded-3xl,
          .admin-dark-mode main .rounded-xl {
            border: 1px solid #222634 !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
          }
          .admin-dark-mode h1,
          .admin-dark-mode h2,
          .admin-dark-mode h3,
          .admin-dark-mode h4,
          .admin-dark-mode h5,
          .admin-dark-mode h6,
          .admin-dark-mode .text-neutral-900,
          .admin-dark-mode .text-neutral-800,
          .admin-dark-mode .text-black,
          .admin-dark-mode .text-\\[\\#10244A\\] {
            color: #ffffff !important;
          }
          .admin-dark-mode .text-neutral-700,
          .admin-dark-mode .text-neutral-600,
          .admin-dark-mode .text-neutral-500 {
            color: #a1a1aa !important;
          }
          .admin-dark-mode input:not([type="checkbox"]):not([type="radio"]),
          .admin-dark-mode textarea,
          .admin-dark-mode select {
            background-color: #161822 !important;
            color: #ffffff !important;
            border-color: #2e3448 !important;
          }
          .admin-dark-mode input::placeholder,
          .admin-dark-mode textarea::placeholder {
            color: #71717a !important;
          }
          .admin-dark-mode .fixed.inset-0 .bg-white {
            background-color: #0d0e12 !important;
            border: 1px solid #2e3448 !important;
          }
          .admin-dark-mode .hover\\:bg-neutral-100:hover,
          .admin-dark-mode .hover\\:bg-neutral-50:hover {
            background-color: #1a1d29 !important;
          }
          .admin-dark-mode tr:hover {
            background-color: #161822 !important;
          }
          .admin-dark-mode th {
            background-color: #0d0e12 !important;
            color: #e4e4e7 !important;
          }
          .admin-dark-mode td {
            border-color: #222634 !important;
            color: #f4f4f5 !important;
          }
        `}</style>
      )}
      
      {/* Admin Sidebar */}
      {isSidebarOpen && (
        <aside className="w-full md:w-72 bg-white border-l border-neutral-200 text-neutral-800 p-6 flex flex-col justify-between z-10 shadow-sm shrink-0 transition-all">
          <div className="space-y-8">
            
            {/* Admin Header */}
            <div className="flex items-center gap-3 pb-6 border-b border-neutral-200">
              <div className="w-10 h-10 rounded-full bg-[#10244A]/10 border border-[#10244A]/20 flex items-center justify-center text-[#10244A]">
                <Shield className="w-5 h-5 text-[#10244A]" />
              </div>
              <div className="flex flex-col text-right">
                <h3 className="font-extrabold text-sm text-neutral-900">إدارة المنصة الطبية</h3>
                <span className="text-[9px] text-[#10244A] font-extrabold uppercase mt-1">مسؤول النظام الرئيسي</span>
              </div>
            </div>

          {/* Nav Items - FIRST ITEM: Landing Page Settings */}
          <nav className="flex flex-col gap-1.5 text-xs font-bold">
            
            {/* FIRST TAB: Landing Page Settings */}
            <button 
              onClick={() => setActiveTab('landing-settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                activeTab === 'landing-settings' 
                  ? 'bg-[#10244A] text-white font-extrabold shadow-md' 
                  : 'text-neutral-900 hover:bg-neutral-100 font-extrabold'
              }`}
            >
              <LayoutTemplate className={`w-4 h-4 flex-shrink-0 ${activeTab === 'landing-settings' ? 'text-white' : 'text-[#10244A]'}`} />
              <span>إعدادات الصفحة الرئيسية</span>
            </button>

            {/* SEO SETTINGS TAB */}
            <button 
              onClick={() => setActiveTab('seo-settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                activeTab === 'seo-settings' 
                  ? 'bg-[#10244A] text-white font-extrabold shadow-md' 
                  : 'text-neutral-900 hover:bg-neutral-100 font-extrabold'
              }`}
            >
              <Search className={`w-4 h-4 flex-shrink-0 ${activeTab === 'seo-settings' ? 'text-white' : 'text-[#10244A]'}`} />
              <span>إعدادات تحسين محركات البحث (SEO)</span>
            </button>

            {/* REAL-TIME DATABASE STATUS TAB */}
            <button 
              onClick={() => setActiveTab('db-status')}
              className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                activeTab === 'db-status' 
                  ? 'bg-[#10244A] text-white font-extrabold shadow-md' 
                  : 'text-neutral-900 hover:bg-neutral-100 font-extrabold'
              }`}
            >
              <div className="flex items-center gap-3">
                <Database className={`w-4 h-4 flex-shrink-0 ${activeTab === 'db-status' ? 'text-white' : 'text-[#10244A]'}`} />
                <span>حالة قاعدة البيانات المباشرة</span>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full animate-ping ${activeTab === 'db-status' ? 'bg-white' : 'bg-[#10244A]'}`}></span>
            </button>

            {/* SUBSCRIPTIONS & INVOICES TAB */}
            <button 
              onClick={() => setActiveTab('subscriptions')}
              className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                activeTab === 'subscriptions' 
                  ? 'bg-[#10244A] text-white font-extrabold shadow-md' 
                  : 'text-neutral-900 hover:bg-neutral-100 font-extrabold'
              }`}
            >
              <div className="flex items-center gap-3">
                <CreditCard className={`w-4 h-4 flex-shrink-0 ${activeTab === 'subscriptions' ? 'text-white' : 'text-[#10244A]'}`} />
                <span>الاشتراكات والفواتير</span>
              </div>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                activeTab === 'subscriptions' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {doctors.filter(d => d.isActiveSubscription && d.isPaidSubscription).length} نشط
              </span>
            </button>

            <button 
              onClick={() => setActiveTab('doctors')}
              className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                activeTab === 'doctors' 
                  ? 'bg-[#10244A] text-white font-extrabold shadow-md' 
                  : 'text-neutral-900 hover:bg-neutral-100 font-extrabold'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className={`w-4 h-4 flex-shrink-0 ${activeTab === 'doctors' ? 'text-white' : 'text-[#10244A]'}`} />
                <span>إدارة الأطباء</span>
              </div>
              {doctors.filter(d => d.approvalStatus === 'pending').length > 0 && (
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold font-almarai ${
                  activeTab === 'doctors' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'
                }`}>
                  {doctors.filter(d => d.approvalStatus === 'pending').length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('banners')}
              className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                activeTab === 'banners' 
                  ? 'bg-[#10244A] text-white font-extrabold shadow-md' 
                  : 'text-neutral-900 hover:bg-neutral-100 font-extrabold'
              }`}
            >
              <div className="flex items-center gap-3">
                <Megaphone className={`w-4 h-4 flex-shrink-0 ${activeTab === 'banners' ? 'text-white' : 'text-[#10244A]'}`} />
                <span>إشعارات الأطباء</span>
              </div>
              {currentBanners.filter(b => b.isActive).length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                  activeTab === 'banners' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'
                }`}>
                  {currentBanners.filter(b => b.isActive).length} نشط
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                activeTab === 'messages' 
                  ? 'bg-[#10244A] text-white font-extrabold shadow-md' 
                  : 'text-neutral-900 hover:bg-neutral-100 font-extrabold'
              }`}
            >
              <div className="flex items-center gap-3 flex-1">
                <Mail className={`w-4 h-4 flex-shrink-0 ${activeTab === 'messages' ? 'text-white' : 'text-[#10244A]'}`} />
                <span>رسائل الزوار</span>
              </div>
              {contactMessages.filter(m => !m.read).length > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${activeTab === 'messages' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                  {contactMessages.filter(m => !m.read).length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-[#10244A] text-white font-extrabold shadow-md' 
                  : 'text-neutral-900 hover:bg-neutral-100 font-extrabold'
              }`}
            >
              <Settings className={`w-4 h-4 flex-shrink-0 ${activeTab === 'settings' ? 'text-white' : 'text-[#10244A]'}`} />
              <span>إعدادات وتخصصات النظام</span>
            </button>
          </nav>

        </div>

        <button 
          onClick={onLogout}
          className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 mt-8 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-red-600" />
          <span>تسجيل خروج المشرف</span>
        </button>
      </aside>
      )}

      {/* Admin Content Area */}
      <main className="flex-1 p-6 md:p-10 space-y-6 overflow-y-auto">
        
        {/* Header bar with 3 Horizontal Lines Button to toggle Sidebar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-white border border-neutral-300 hover:bg-neutral-100 rounded-2xl text-neutral-900 transition-all shadow-xs flex items-center justify-center cursor-pointer active:scale-95"
              title={isSidebarOpen ? "إخفاء أقسام اللوحة" : "إظهار أقسام اللوحة"}
            >
              <Menu className="w-6 h-6 text-neutral-900" strokeWidth={2.5} />
            </button>

            <div className="text-right">
              <h1 className="text-2xl font-black text-black tracking-tight">لوحة تحكم المشرف</h1>
              <p className="text-neutral-500 text-xs font-bold mt-1">مرحباً بك، أنت مسجل كمدير رئيسي للمنصة</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`px-3.5 py-2.5 border rounded-2xl transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-95 ${
                isDarkMode 
                  ? 'bg-neutral-900 border-amber-500/40 text-amber-400 hover:bg-neutral-800' 
                  : 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-100'
              }`}
              title={isDarkMode ? "التحويل للوضع الفاتح" : "تشغيل الوضع المظلم"}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-5 h-5 text-amber-400 fill-amber-400/20" />
                  <span className="text-xs font-extrabold text-amber-300">الوضع الفاتح</span>
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5 text-neutral-800" />
                  <span className="text-xs font-extrabold text-neutral-800">الوضع المظلم</span>
                </>
              )}
            </button>

            {activeTab === 'landing-settings' && (
              <button
                onClick={handleSaveLandingConfig}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full transition-all flex items-center gap-2 shadow-md active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ تعديلات الصفحة الرئيسية</span>
              </button>
            )}
          </div>
        </div>

        {saveSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 shadow-sm animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>تم حفظ جميع إعدادات ونصوص الصفحة الرئيسية بنجاح! وستظهر فوراً في الواجهة العامة.</span>
          </div>
        )}



        {/* TAB REAL-TIME DATABASE STATUS (قسم حالة قاعدة البيانات) */}
        {activeTab === 'db-status' && (
          <DatabaseStatus 
            doctors={doctors}
            appointments={appointments}
            landingConfig={localLanding}
            banners={currentBanners}
          />
        )}

        {/* TAB SEO: SEO SETTINGS (قسم إعدادات SEO) */}
        {activeTab === 'seo-settings' && (
          <SEOSettings 
            config={localLanding.seo || DEFAULT_SEO_CONFIG}
            onChange={(updatedSeo) => {
              const updatedLanding = {
                ...localLanding,
                seo: updatedSeo
              };
              setLocalLanding(updatedLanding);
              if (onUpdateLandingConfig) {
                onUpdateLandingConfig(updatedLanding);
              }
            }}
            onSave={handleSaveLandingConfig}
          />
        )}

        {/* TAB 0: LANDING PAGE SETTINGS (القسم الأول) */}
        {activeTab === 'landing-settings' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start text-right">
            
            {/* Inner Side Menu for Landing Sub-sections */}
            <div className="w-full lg:w-60 bg-white p-3 rounded-3xl border border-neutral-200/70 shadow-sm flex flex-col gap-1 text-xs font-extrabold shrink-0">
              <div className="px-3 py-2 text-[11px] font-black text-neutral-400 border-b border-neutral-100 mb-1">
                أقسام الصفحة الرئيسية
              </div>
              {[
                { id: 'hero' as const, label: 'الرئيسية', icon: LayoutTemplate },
                { id: 'features' as const, label: 'المميزات', icon: Sparkles },
                { id: 'pricing' as const, label: 'الأسعار', icon: CreditCard },
                { id: 'clientWorks' as const, label: 'نموذج', icon: Globe },
                { id: 'contact' as const, label: 'تواصل معنا', icon: Phone },
                { id: 'login' as const, label: 'تسجيل الدخول', icon: Lock },
                { id: 'createSite' as const, label: 'ابدأ الآن مجاناً', icon: UserPlus },
                { id: 'dashboardSettings' as const, label: 'لوحة الطبيب (الاشتراكات)', icon: Settings },
                { id: 'footer' as const, label: 'الفوتر', icon: Layers },
                { id: 'importantPages' as const, label: 'روابط مهمة (من نحن)', icon: FileText },
              ].map((st) => {
                const Icon = st.icon;
                const isActive = landingSubTab === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setLandingSubTab(st.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl transition-all text-right w-full cursor-pointer ${
                      isActive 
                        ? 'bg-[#10244A] text-white font-extrabold shadow-sm' 
                        : 'text-neutral-700 hover:bg-neutral-100 font-bold'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#10244A]'}`} />
                    <span>{st.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Landing Sub-tab Content Area */}
            <div className="flex-1 w-full space-y-6">

            {/* Sub-section 1: الرئيسية */}
            {landingSubTab === 'hero' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-8 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل كافة نصوص، صور، أزرار، وأقسام الصفحة الرئيسية</span>
                  <h3 className="text-base font-black text-[#10244A]">1. قسم الصفحة الرئيسية (Hero)</h3>
                </div>

                <div className="space-y-6">
                  {/* 1. Main Hero Content */}
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-extrabold text-sm text-[#10244A] flex items-center gap-1.5">
                        <span>الواجهة العلوية (الهيرو الرئيسي)</span>
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-medium">العنوان الرئيسي، الوصف، زر البداية المجانية، وإحصائية الأطباء.</p>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">العنوان الرئيسي (Hero Title)</label>
                      <textarea 
                        rows={2}
                        value={localLanding.hero.title || 'أنشئ بروفايلك الطبي في دقائق'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          hero: { ...localLanding.hero, title: e.target.value }
                        })}
                        placeholder="أنشئ بروفايلك الطبي في دقائق"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف التعريفي للرئيسية (Hero Subtitle)</label>
                      <textarea 
                        rows={3}
                        value={localLanding.hero.subtitle || 'من خلال موقعنا يمكنك إنشاء بروفايل طبي احترافي يعرض خبراتك وخدماتك مع نظام حجز ذكي ولوحة تحكم متكاملة دون أي عمولات على الحجوزات'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          hero: { ...localLanding.hero, subtitle: e.target.value }
                        })}
                        placeholder="من خلال موقعنا يمكنك إنشاء بروفايل طبي احترافي..."
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص الزر الرئيسي (Primary CTA Text)</label>
                        <input 
                          type="text" 
                          value={localLanding.hero.primaryCtaText || 'ابدأ الآن مجاناً'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            hero: { ...localLanding.hero, primaryCtaText: e.target.value }
                          })}
                          placeholder="ابدأ الآن مجاناً"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص شارة وإحصائية الأطباء (Social Proof)</label>
                        <input 
                          type="text" 
                          value={localLanding.hero.doctorsCountText || '+500 طبيب يستخدمون المنصة'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            hero: { ...localLanding.hero, doctorsCountText: e.target.value }
                          })}
                          placeholder="+500 طبيب يستخدمون المنصة"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <ImageInputWithUpload 
                        label="صورة الهيرو للشاشات والكمبيوتر (Desktop Hero Image)"
                        value={localLanding.hero.heroDesktopImage || "https://h.top4top.io/p_3874d6cv31.png"}
                        onChange={(newVal) => setLocalLanding({
                          ...localLanding,
                          hero: { 
                            ...localLanding.hero, 
                            heroDesktopImage: newVal
                          }
                        })}
                        placeholder="رابط أو رفع صورة الهيرو للكمبيوتر..."
                      />

                      <ImageInputWithUpload 
                        label="صورة الهيرو للموبايل والهواتف (Mobile Hero Image)"
                        value={localLanding.hero.heroMobileImage || "https://k.top4top.io/p_3874k7cvg1.png"}
                        onChange={(newVal) => setLocalLanding({
                          ...localLanding,
                          hero: { 
                            ...localLanding.hero, 
                            heroMobileImage: newVal
                          }
                        })}
                        placeholder="رابط أو رفع صورة الهيرو للموبايل..."
                      />
                    </div>
                  </div>

                  {/* 2. Feature Pillars */}
                  <div className="pt-6 border-t border-neutral-100 space-y-4">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-extrabold text-sm text-[#10244A] flex items-center gap-1.5">
                        <span>أعمدة ومميزات الهيرو الأربعة السريعة (4 Feature Pillars)</span>
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-medium">العناوين المعروضة أسفل صورة الهيرو مباشرة لتعزيز سرعة الإقناع.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">العمود 1: الرابط الطبي</label>
                        <input 
                          type="text" 
                          value={localLanding.hero.pillar1Title || 'رابط طبي خاص بك'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            hero: { ...localLanding.hero, pillar1Title: e.target.value }
                          })}
                          placeholder="رابط طبي خاص بك"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">العمود 2: حجز المواعيد</label>
                        <input 
                          type="text" 
                          value={localLanding.hero.pillar2Title || 'حجز مواعيد بسهولة'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            hero: { ...localLanding.hero, pillar2Title: e.target.value }
                          })}
                          placeholder="حجز مواعيد بسهولة"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">العمود 3: الأجهزة</label>
                        <input 
                          type="text" 
                          value={localLanding.hero.pillar3Title || 'يعمل على كل الأجهزة'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            hero: { ...localLanding.hero, pillar3Title: e.target.value }
                          })}
                          placeholder="يعمل على كل الأجهزة"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">العمود 4: دعم اللغات</label>
                        <input 
                          type="text" 
                          value={localLanding.hero.pillar4Title || 'دعم لغات متعددة'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            hero: { ...localLanding.hero, pillar4Title: e.target.value }
                          })}
                          placeholder="دعم لغات متعددة"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Sub-hero Section: بروفايلك الطبي... هويتك */}
                  <div className="pt-6 border-t border-neutral-100 space-y-4">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-extrabold text-sm text-[#10244A] flex items-center gap-1.5">
                        <span>قسم "بروفايلك الطبي... هويتك" (Sub-Hero)</span>
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-medium">القسم التوضيحي الأول مع الصورة وزر "كيف يعمل".</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان القسم الترحيبي</label>
                        <input 
                          type="text" 
                          value={localLanding.hero.subHeroTitle || 'بروفايلك الطبي... هويتك'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            hero: { ...localLanding.hero, subHeroTitle: e.target.value }
                          })}
                          placeholder="بروفايلك الطبي... هويتك"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر التوجيه (CTA Button)</label>
                        <input 
                          type="text" 
                          value={localLanding.hero.subHeroButtonText || 'كيف يعمل'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            hero: { ...localLanding.hero, subHeroButtonText: e.target.value }
                          })}
                          placeholder="كيف يعمل"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <ImageInputWithUpload 
                      label="الصورة التوضيحية للقسم الترحيبي"
                      value={localLanding.hero.subHeroImage || "https://l.top4top.io/p_3874bibs21.png"}
                      onChange={(newVal) => setLocalLanding({
                        ...localLanding,
                        hero: { ...localLanding.hero, subHeroImage: newVal }
                      })}
                      placeholder="رابط أو رفع الصورة التوضيحية..."
                    />

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف والنص التعريفي للقسم</label>
                      <textarea 
                        rows={2}
                        value={localLanding.hero.subHeroSubtitle || 'بدلًا من أن يكون بروفايلك مجرد صفحة وسط مئات الأطباء على منصة أخرى، امتلك بروفايلك الطبي الخاص بهويتك، وخدماتك، وبياناتك، ووسائل التواصل مع مرضاك'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          hero: { ...localLanding.hero, subHeroSubtitle: e.target.value }
                        })}
                        placeholder="بدلًا من أن يكون بروفايلك مجرد صفحة..."
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* 4. How It Works Section: أنشئ بروفايلك الطبي في 3 خطوات */}
                  <div className="pt-6 border-t border-neutral-100 space-y-4">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-extrabold text-sm text-[#10244A] flex items-center gap-1.5">
                        <span>قسم "أنشئ بروفايلك الطبي في 3 خطوات" (How It Works)</span>
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-medium">تعديل عنوان ووصف وخطوات الشرح الثلاث بالكامل.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان قسم الخطوات</label>
                        <input 
                          type="text" 
                          value={localLanding.hero.howItWorksTitle || 'أنشئ بروفايلك الطبي في 3 خطوات'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            hero: { ...localLanding.hero, howItWorksTitle: e.target.value }
                          })}
                          placeholder="أنشئ بروفايلك الطبي في 3 خطوات"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي لقسم الخطوات</label>
                        <input 
                          type="text" 
                          value={localLanding.hero.howItWorksSubtitle || 'بروفايل احترافي بسيط وسريع لا برمجة لا تصميم لا تعقيد'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            hero: { ...localLanding.hero, howItWorksSubtitle: e.target.value }
                          })}
                          placeholder="بروفايل احترافي بسيط وسريع لا برمجة لا تصميم لا تعقيد"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {/* Step 1 */}
                      <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/70 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                          <span className="text-[10px] font-black bg-[#003B7A] text-white px-2 py-0.5 rounded-full">الخطوة 1</span>
                          <span className="text-xs font-black text-[#10244A]">سجّل كطبيب</span>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">عنوان الخطوة 1</label>
                          <input 
                            type="text" 
                            value={localLanding.hero.step1Title || 'سجّل كطبيب'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              hero: { ...localLanding.hero, step1Title: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">وصف الخطوة 1</label>
                          <textarea 
                            rows={2}
                            value={localLanding.hero.step1Desc || 'أنشئ حسابك خلال ثوان باستخدام اسم المستخدم وكلمة المرور.'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              hero: { ...localLanding.hero, step1Desc: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      {/* Step 2 */}
                      <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/70 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                          <span className="text-[10px] font-black bg-[#003B7A] text-white px-2 py-0.5 rounded-full">الخطوة 2</span>
                          <span className="text-xs font-black text-[#10244A]">أدخل بياناتك</span>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">عنوان الخطوة 2</label>
                          <input 
                            type="text" 
                            value={localLanding.hero.step2Title || 'أدخل بياناتك'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              hero: { ...localLanding.hero, step2Title: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">وصف الخطوة 2</label>
                          <textarea 
                            rows={2}
                            value={localLanding.hero.step2Desc || 'أضف اسمك، تخصصك، خدماتك، ساعات العمل، وبيانات التواصل.'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              hero: { ...localLanding.hero, step2Desc: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>

                      {/* Step 3 */}
                      <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200/70 space-y-2.5">
                        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                          <span className="text-[10px] font-black bg-[#003B7A] text-white px-2 py-0.5 rounded-full">الخطوة 3</span>
                          <span className="text-xs font-black text-[#10244A]">موقعك جاهز!</span>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">عنوان الخطوة 3</label>
                          <input 
                            type="text" 
                            value={localLanding.hero.step3Title || 'موقعك جاهز!'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              hero: { ...localLanding.hero, step3Title: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-600 mb-1">وصف الخطوة 3</label>
                          <textarea 
                            rows={2}
                            value={localLanding.hero.step3Desc || 'احصل على رابط بروفايلك الاحترافي فوراً وشاركه مع مرضاك.'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              hero: { ...localLanding.hero, step3Desc: e.target.value }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 5. Header Logo & Favicon Section */}
                  <div className="pt-6 border-t border-neutral-100 space-y-4">
                    <div className="flex flex-col gap-1">
                      <h4 className="font-extrabold text-sm text-[#10244A] flex items-center gap-1.5">
                        <span>لوجو المنصة والأيقونة المصغرة (Logo & Favicon)</span>
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-medium">تعديل الشعار الرسمي للمنصة في الشريط العلوي والأيقونة المصغرة للمتصفح.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ImageInputWithUpload 
                        label="شعار المنصة للشريط العلوي (Header Logo)"
                        value={localLanding.headerLogos?.lightLogoUrl || localLanding.hero?.headerLogoLightUrl || "https://i.top4top.io/p_3857n94r80.png"}
                        onChange={(newVal) => setLocalLanding({
                          ...localLanding,
                          headerLogos: {
                            ...localLanding.headerLogos,
                            lightLogoUrl: newVal,
                            darkLogoUrl: newVal
                          },
                          hero: {
                            ...localLanding.hero,
                            headerLogoLightUrl: newVal,
                            headerLogoDarkUrl: newVal
                          }
                        })}
                        placeholder="رابط أو رفع شعار المنصة..."
                      />

                      <ImageInputWithUpload 
                        label="الأيقونة المصغرة لتبويب المتصفح (Favicon 16x16)"
                        value={localLanding.faviconUrl || localLanding.seo?.faviconUrl || "https://k.top4top.io/p_38573eitn0.png"}
                        onChange={(newVal) => setLocalLanding({
                          ...localLanding,
                          faviconUrl: newVal,
                          seo: {
                            ...localLanding.seo,
                            faviconUrl: newVal
                          } as any
                        })}
                        placeholder="رابط أو رفع الأيقونة المصغرة (16x16 / 32x32)..."
                      />
                    </div>
                  </div>

                  {/* 6. قسم كل ما يحتاجه ملفك الطبي للحضور أونلاين */}
                  <div className="space-y-4 pt-6 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400 font-bold">تعديل الكروت الترويجية والصور المؤطرة بالصفحة الرئيسية</span>
                      <h4 className="font-extrabold text-xs text-[#10244A]">6. قسم "كل ما يحتاجه ملفك الطبي للحضور أونلاين"</h4>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان القسم الرئيسي</label>
                      <input 
                        type="text" 
                        value={localLanding.overview?.mainTitle ?? 'كل ما يحتاجه ملفك الطبي للحضور أونلاين'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          overview: {
                            ...localLanding.overview,
                            mainTitle: e.target.value
                          }
                        })}
                        placeholder="كل ما يحتاجه ملفك الطبي للحضور أونلاين"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      {/* الكرت الأول (الأيمن) */}
                      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
                        <span className="text-xs font-black text-[#10244A] block">الكرت 1: حجوزات منظمة وتجربة أسهل</span>
                        
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1.5">عنوان الكرت</label>
                          <input 
                            type="text"
                            value={localLanding.overview?.rightTitle ?? 'حجوزات منظمة وتجربة أسهل'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              overview: {
                                ...localLanding.overview,
                                rightTitle: e.target.value
                              }
                            })}
                            placeholder="حجوزات منظمة وتجربة أسهل"
                            className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1.5">وصف الكرت</label>
                          <textarea 
                            rows={3}
                            value={localLanding.overview?.rightSubtitle ?? 'نظّم مواعيد عياداتك واستقبل طلبات الحجز من مرضاك بسهولة، مع تحديد مواعيد العمل والوقت المناسب لكل حجز.'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              overview: {
                                ...localLanding.overview,
                                rightSubtitle: e.target.value
                              }
                            })}
                            placeholder="نظّم مواعيد عياداتك واستقبل طلبات الحجز..."
                            className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1.5">نص الزر</label>
                          <input 
                            type="text"
                            value={localLanding.overview?.rightButtonText ?? 'ابدأ الآن مجاناً'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              overview: {
                                ...localLanding.overview,
                                rightButtonText: e.target.value
                              }
                            })}
                            placeholder="ابدأ الآن مجاناً"
                            className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>

                        <ImageInputWithUpload 
                          label="صورة الكرت الأيمن (معاينة العيادة والحجوزات)"
                          value={localLanding.overview?.rightImage || "https://j.top4top.io/p_3875xod3p1.png"}
                          onChange={(newVal) => setLocalLanding({
                            ...localLanding,
                            overview: {
                              ...localLanding.overview,
                              rightImage: newVal
                            }
                          })}
                          placeholder="رابط أو رفع الصورة..."
                        />
                      </div>

                      {/* الكرت الثاني (الأيسر) */}
                      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
                        <span className="text-xs font-black text-[#10244A] block">الكرت 2: متناسق على أي جهاز</span>
                        
                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1.5">عنوان الكرت</label>
                          <input 
                            type="text"
                            value={localLanding.overview?.leftTitle ?? 'متناسق على أي جهاز'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              overview: {
                                ...localLanding.overview,
                                leftTitle: e.target.value
                              }
                            })}
                            placeholder="متناسق على أي جهاز"
                            className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1.5">وصف الكرت</label>
                          <textarea 
                            rows={3}
                            value={localLanding.overview?.leftSubtitle ?? 'ملف طبي متجاوب تلقائيًا مع مختلف الأجهزة، ليظهر بروفايلك بشكل احترافي ومميز على أي جهاز'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              overview: {
                                ...localLanding.overview,
                                leftSubtitle: e.target.value
                              }
                            })}
                            placeholder="ملف طبي متجاوب تلقائيًا مع مختلف الأجهزة..."
                            className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-neutral-700 mb-1.5">نص الزر</label>
                          <input 
                            type="text"
                            value={localLanding.overview?.leftButtonText ?? 'ابدأ الآن مجاناً'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              overview: {
                                ...localLanding.overview,
                                leftButtonText: e.target.value
                              }
                            })}
                            placeholder="ابدأ الآن مجاناً"
                            className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>

                        <ImageInputWithUpload 
                          label="صورة الكرت الأيسر (معاينة التجاوب والأجهزة)"
                          value={localLanding.overview?.leftImage || "https://j.top4top.io/p_387540zrh1.png"}
                          onChange={(newVal) => setLocalLanding({
                            ...localLanding,
                            overview: {
                              ...localLanding.overview,
                              leftImage: newVal
                            }
                          })}
                          placeholder="رابط أو رفع الصورة..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* 7. قسم تحكم في كل شيء */}
                  <div className="space-y-4 pt-6 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400 font-bold">تعديل نصوص ومميزات وصورة قسم التحكم</span>
                      <h4 className="font-extrabold text-xs text-[#10244A]">7. قسم "تحكم في كل شيء"</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان القسم</label>
                        <input 
                          type="text" 
                          value={localLanding.overview?.controlTitle ?? 'تحكم في كل شيء'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            overview: {
                              ...localLanding.overview,
                              controlTitle: e.target.value
                            }
                          })}
                          placeholder="تحكم في كل شيء"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر التوجيه للمميزات</label>
                        <input 
                          type="text" 
                          value={localLanding.overview?.controlButtonText ?? 'اكتشف المميزات'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            overview: {
                              ...localLanding.overview,
                              controlButtonText: e.target.value
                            }
                          })}
                          placeholder="اكتشف المميزات"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="block text-xs font-extrabold text-neutral-700">قائمة مميزات ونقاط التحكم (4 عناصر)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1">الميزة الأولى</label>
                          <input 
                            type="text"
                            value={localLanding.overview?.controlFeature1 ?? 'إدارة ملفك الطبي بسهولة'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              overview: {
                                ...localLanding.overview,
                                controlFeature1: e.target.value
                              }
                            })}
                            placeholder="إدارة ملفك الطبي بسهولة"
                            className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1">الميزة الثانية</label>
                          <input 
                            type="text"
                            value={localLanding.overview?.controlFeature2 ?? 'استقبال وتنظيم طلبات الحجز'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              overview: {
                                ...localLanding.overview,
                                controlFeature2: e.target.value
                              }
                            })}
                            placeholder="استقبال وتنظيم طلبات الحجز"
                            className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1">الميزة الثالثة</label>
                          <input 
                            type="text"
                            value={localLanding.overview?.controlFeature3 ?? 'تنظيم مواعيدك وساعات العمل'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              overview: {
                                ...localLanding.overview,
                                controlFeature3: e.target.value
                              }
                            })}
                            placeholder="تنظيم مواعيدك وساعات العمل"
                            className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 mb-1">الميزة الرابعة</label>
                          <input 
                            type="text"
                            value={localLanding.overview?.controlFeature4 ?? 'إدارة صور وخدمات عيادتك'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              overview: {
                                ...localLanding.overview,
                                controlFeature4: e.target.value
                              }
                            })}
                            placeholder="إدارة صور وخدمات عيادتك"
                            className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <ImageInputWithUpload 
                        label="صورة قسم تحكم في كل شيء (لوحة التحكم)"
                        value={localLanding.overview?.controlImage || "https://a.top4top.io/p_3874614ld1.png"}
                        onChange={(newVal) => setLocalLanding({
                          ...localLanding,
                          overview: {
                            ...localLanding.overview,
                            controlImage: newVal
                          }
                        })}
                        placeholder="رابط أو رفع صورة لوحة التحكم..."
                      />
                    </div>
                  </div>

                  {/* 8. قسم جاهز لإنشاء بروفايلك الطبي؟ */}
                  <div className="space-y-4 pt-6 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400 font-bold">تعديل بانر الدعوة للتسجيل (CTA Banner)</span>
                      <h4 className="font-extrabold text-xs text-[#10244A]">8. قسم "جاهز لإنشاء بروفايلك الطبي؟"</h4>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان البانر الرئيسي</label>
                      <input 
                        type="text" 
                        value={localLanding.ctaBanner?.title ?? 'جاهز لإنشاء بروفايلك الطبي؟'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          ctaBanner: {
                            ...localLanding.ctaBanner,
                            title: e.target.value
                          }
                        })}
                        placeholder="جاهز لإنشاء بروفايلك الطبي؟"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف والنص الإضافي للبانر</label>
                      <textarea 
                        rows={2}
                        value={localLanding.ctaBanner?.subtitle ?? 'انضم إلى مئات الأطباء الذين يملكون بروفايلات احترافية الآن\nسريع وسهل ولا يتطلب أي خبرة تقنية'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          ctaBanner: {
                            ...localLanding.ctaBanner,
                            subtitle: e.target.value
                          }
                        })}
                        placeholder="انضم إلى مئات الأطباء الذين يملكون بروفايلات احترافية الآن..."
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص الزر الأساسي (الاشتراك)</label>
                        <input 
                          type="text" 
                          value={localLanding.ctaBanner?.primaryButtonText ?? 'ابدأ الآن مجاناً'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            ctaBanner: {
                              ...localLanding.ctaBanner,
                              primaryButtonText: e.target.value
                            }
                          })}
                          placeholder="ابدأ الآن مجاناً"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر تسجيل الدخول</label>
                        <input 
                          type="text" 
                          value={localLanding.ctaBanner?.secondaryButtonText ?? 'لديك حساب؟ سجّل الدخول'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            ctaBanner: {
                              ...localLanding.ctaBanner,
                              secondaryButtonText: e.target.value
                            }
                          })}
                          placeholder="لديك حساب؟ سجّل الدخول"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 9. قسم أسئلة متكررة (FAQ) */}
                  <div className="space-y-4 pt-6 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400 font-bold">تعديل وإضافة وإدارة جميع الأسئلة الشائعة وإجاباتها في الموقع</span>
                      <h4 className="font-extrabold text-xs text-[#10244A]">9. قسم "الأسئلة الشائعة"</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان قسم الأسئلة</label>
                        <input 
                          type="text" 
                          value={localLanding.faq?.title ?? 'أسئلة متكررة'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            faq: { ...(localLanding.faq || { title: 'أسئلة متكررة', subtitle: '', items: [] }), title: e.target.value }
                          })}
                          placeholder="أسئلة متكررة"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي لقسم الأسئلة</label>
                        <input 
                          type="text" 
                          value={localLanding.faq?.subtitle ?? 'إجابات عن أهم الاستفسارات المتكررة حول المنصة وطريقة العمل'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            faq: { ...(localLanding.faq || { title: 'أسئلة متكررة', subtitle: '', items: [] }), subtitle: e.target.value }
                          })}
                          placeholder="إجابات عن أهم الاستفسارات..."
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const newFaqs: FAQConfigItem[] = [
                                ...(localLanding.faq?.items || []),
                                {
                                  id: `faq-${Date.now()}`,
                                  question: 'سؤال شائع جديد؟',
                                  answer: 'إجابة توضيحية كاملة عن السؤال المضاف حديثاً.'
                                }
                              ];
                              setLocalLanding({
                                ...localLanding,
                                faq: { ...(localLanding.faq || { title: 'أسئلة متكررة', subtitle: '', items: [] }), items: newFaqs }
                              });
                            }}
                            className="px-4 py-2 bg-[#10244A] hover:bg-[#091A3A] text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>إضافة سؤال جديد</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setLocalLanding({
                                ...localLanding,
                                faq: {
                                  title: 'أسئلة متكررة',
                                  subtitle: 'إجابات عن أهم الاستفسارات المتكررة حول المنصة وطريقة العمل',
                                  items: DEFAULT_LANDING_CONFIG.faq?.items || []
                                }
                              });
                            }}
                            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#003B7A] border border-blue-200 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                            title="استعادة كافة الأسئلة الشائعة الافتراضية الثمانية"
                          >
                            <span>استعادة الأسئلة الافتراضية كاملة (8 أسئلة)</span>
                          </button>
                        </div>

                        <h4 className="font-extrabold text-xs text-neutral-800">
                          قائمة الأسئلة الشائعة ({localLanding.faq?.items?.length || 0})
                        </h4>
                      </div>

                      <div className="space-y-3">
                        {((localLanding.faq?.items && localLanding.faq.items.length > 0)
                          ? localLanding.faq.items
                          : (DEFAULT_LANDING_CONFIG.faq?.items || [])
                        ).map((item, fIdx, arr) => (
                          <div key={item.id || `faq-item-${fIdx}`} className="p-4 bg-neutral-50 border border-neutral-200/90 rounded-2xl space-y-3">
                            <div className="flex items-center justify-between gap-2 border-b border-neutral-200/60 pb-2.5">
                              <span className="text-[11px] font-black text-[#003B7A] bg-blue-100/70 px-2.5 py-0.5 rounded-lg">
                                سؤال #{fIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newFaqs = arr.filter((_, i) => i !== fIdx);
                                  setLocalLanding({
                                    ...localLanding,
                                    faq: { ...(localLanding.faq || { title: 'أسئلة متكررة', subtitle: '', items: [] }), items: newFaqs }
                                  });
                                }}
                                className="px-2 py-1 text-red-500 hover:bg-red-100 rounded-lg transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                                title="حذف السؤال"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </div>

                            <div>
                              <label className="block text-[11px] font-extrabold text-neutral-600 mb-1">نص السؤال</label>
                              <input 
                                type="text" 
                                value={item.question}
                                onChange={(e) => {
                                  const newFaqs = [...arr];
                                  newFaqs[fIdx] = { ...newFaqs[fIdx], question: e.target.value };
                                  setLocalLanding({
                                    ...localLanding,
                                    faq: { ...(localLanding.faq || { title: 'أسئلة متكررة', subtitle: '', items: [] }), items: newFaqs }
                                  });
                                }}
                                placeholder="السؤال الشائع..."
                                className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-right focus:outline-none focus:border-black"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-extrabold text-neutral-600 mb-1">الإجابة</label>
                              <textarea 
                                rows={2}
                                value={item.answer}
                                onChange={(e) => {
                                  const newFaqs = [...arr];
                                  newFaqs[fIdx] = { ...newFaqs[fIdx], answer: e.target.value };
                                  setLocalLanding({
                                    ...localLanding,
                                    faq: { ...(localLanding.faq || { title: 'أسئلة متكررة', subtitle: '', items: [] }), items: newFaqs }
                                  });
                                }}
                                placeholder="الإجابة التفصيلية..."
                                className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-medium text-right focus:outline-none focus:border-black leading-relaxed"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 2: المميزات */}
            {landingSubTab === 'features' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل عنوان وعناصر قسم المميزات بالصفحة الرئيسية</span>
                  <h3 className="text-base font-black text-[#10244A]">2. قسم المميزات</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان قسم المميزات (Section Title)</label>
                    <input 
                      type="text" 
                      value={localLanding.features.title}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        features: { ...localLanding.features, title: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي للمميزات (Section Subtitle)</label>
                    <textarea 
                      rows={2}
                      value={localLanding.features.subtitle}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        features: { ...localLanding.features, subtitle: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="font-extrabold text-xs text-[#009bb9] mb-4">فئات المميزات والأعمدة</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {localLanding.features.categories.map((cat, cIdx) => (
                        <div key={cat.id || cIdx} className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full">عمود {cIdx + 1}</span>
                            <input 
                              type="text"
                              value={cat.title}
                              onChange={(e) => {
                                const newCats = [...localLanding.features.categories];
                                newCats[cIdx] = { ...newCats[cIdx], title: e.target.value };
                                setLocalLanding({
                                  ...localLanding,
                                  features: { ...localLanding.features, categories: newCats }
                                });
                              }}
                              className="font-extrabold text-xs text-[#10244A] bg-white px-3 py-1.5 border border-neutral-300 rounded-lg text-right flex-1 ml-2 focus:outline-none focus:border-black"
                            />
                          </div>

                          <ImageInputWithUpload 
                            label={`الصورة التوضيحية لعمود (${cat.title || cIdx + 1})`}
                            value={cat.imageUrl || ''}
                            onChange={(newVal) => {
                              const newCats = [...localLanding.features.categories];
                              newCats[cIdx] = { ...newCats[cIdx], imageUrl: newVal };
                              setLocalLanding({
                                ...localLanding,
                                features: { ...localLanding.features, categories: newCats }
                              });
                            }}
                            placeholder="رابط أو رفع الصورة التوضيحية..."
                          />

                          <div className="space-y-2">
                            <label className="block text-[10px] font-extrabold text-neutral-500">عناصر الخصائص:</label>
                            {cat.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newCats = [...localLanding.features.categories];
                                    newCats[cIdx].items = newCats[cIdx].items.filter((_, i) => i !== itemIdx);
                                    setLocalLanding({
                                      ...localLanding,
                                      features: { ...localLanding.features, categories: newCats }
                                    });
                                  }}
                                  className="p-1.5 text-red-500 hover:bg-red-100 rounded-lg transition-colors"
                                  title="حذف الميزة"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                                <input 
                                  type="text"
                                  value={item}
                                  onChange={(e) => {
                                    const newCats = [...localLanding.features.categories];
                                    const newItems = [...newCats[cIdx].items];
                                    newItems[itemIdx] = e.target.value;
                                    newCats[cIdx].items = newItems;
                                    setLocalLanding({
                                      ...localLanding,
                                      features: { ...localLanding.features, categories: newCats }
                                    });
                                  }}
                                  className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium text-right focus:outline-none focus:border-black"
                                />
                              </div>
                            ))}

                            <button
                              type="button"
                              onClick={() => {
                                const newCats = [...localLanding.features.categories];
                                newCats[cIdx].items.push('ميزة جديدة');
                                setLocalLanding({
                                  ...localLanding,
                                  features: { ...localLanding.features, categories: newCats }
                                });
                              }}
                              className="px-3 py-1 bg-[#10244A] text-white hover:bg-[#091A3A] text-[10px] font-extrabold rounded-lg transition-all flex items-center gap-1 mt-2"
                            >
                              <Plus className="w-3 h-3" />
                              <span>إضافة ميزة للعمود</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* البانر الترويجي السفلي في قسم المميزات */}
                  <div className="pt-6 border-t border-neutral-100 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400 font-bold">تعديل البانر الأزرق أسفل قسم المميزات (دعوة للانتقال للأسعار)</span>
                      <h4 className="font-extrabold text-xs text-[#10244A]">البانر السفلي لقسم المميزات</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان البانر الرئيسي</label>
                        <input 
                          type="text" 
                          value={localLanding.features.bottomBannerTitle ?? 'كل اللي محتاجه علشان تعرض خدماتك الطبية أونلاين في مكان واحد'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            features: {
                              ...localLanding.features,
                              bottomBannerTitle: e.target.value
                            }
                          })}
                          placeholder="كل اللي محتاجه علشان تعرض خدماتك الطبية أونلاين في مكان واحد"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر البانر</label>
                        <input 
                          type="text" 
                          value={localLanding.features.bottomBannerButtonText ?? 'الأسعار'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            features: {
                              ...localLanding.features,
                              bottomBannerButtonText: e.target.value
                            }
                          })}
                          placeholder="الأسعار"
                          className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 3: الأسعار */}
            {landingSubTab === 'pricing' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل باقات الاشتراك والأسعار المعروضة بالصفحة الرئيسية</span>
                  <h3 className="text-base font-black text-[#10244A]">3. قسم الأسعار والاشتراكات</h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان قسم الأسعار (Section Title)</label>
                      <input 
                        type="text" 
                        value={localLanding.pricing.title}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          pricing: { ...localLanding.pricing, title: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي (Section Subtitle)</label>
                      <input 
                        type="text" 
                        value={localLanding.pricing.subtitle}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          pricing: { ...localLanding.pricing, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر التفعيل الرئيسي (CTA Button Text)</label>
                    <input 
                      type="text" 
                      value={localLanding.pricing.ctaText}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        pricing: { ...localLanding.pricing, ctaText: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Plan 1 & Plan 2 Side-by-Side */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                    
                    {/* Plan 1: 6 Months */}
                    <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
                      <h4 className="font-extrabold text-xs text-[#009bb9]">باقة 6 أشهر</h4>
                      <div>
                        <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">اسم الباقة</label>
                        <input 
                          type="text" 
                          value={localLanding.pricing.plan5Months.title}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            pricing: {
                              ...localLanding.pricing,
                              plan5Months: { ...localLanding.pricing.plan5Months, title: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">السعر الرقمي (EGP)</label>
                          <input 
                            type="text" 
                            value={localLanding.pricing.plan5Months.price}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              pricing: {
                                ...localLanding.pricing,
                                plan5Months: { ...localLanding.pricing.plan5Months, price: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">المدة والشراء</label>
                          <input 
                            type="text" 
                            value={localLanding.pricing.plan5Months.period}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              pricing: {
                                ...localLanding.pricing,
                                plan5Months: { ...localLanding.pricing.plan5Months, period: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">نص الشارة أو العرض</label>
                        <input 
                          type="text" 
                          value={localLanding.pricing.plan5Months.discountText ?? ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            pricing: {
                              ...localLanding.pricing,
                              plan5Months: { ...localLanding.pricing.plan5Months, discountText: e.target.value }
                            }
                          })}
                          placeholder="فارغ (أو اكتب نص الشارة)"
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      {/* Features List for Plan 1 */}
                      <div className="pt-3 border-t border-neutral-200/70 space-y-3">
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              const default18 = [
                                "بروفايل طبي", "رابط خاص", "قوالب متعددة", "نبذة ومؤهلات",
                                "تخصص وخدمات", "أسعار الخدمات", "صور العيادة", "فيديوهات",
                                "مواعيد العمل", "لوكيشن العيادة", "سوشيال ميديا", "حجز مواعيد",
                                "تقييمات المرضى", "اضافة سكرتارية متعددة", "لوحة تحكم احترافية",
                                "متوافق مع الأجهزة", "دعم فني", "تحديثات مجانية"
                              ];
                              setLocalLanding({
                                ...localLanding,
                                pricing: {
                                  ...localLanding.pricing,
                                  plan5Months: {
                                    ...localLanding.pricing.plan5Months,
                                    features: default18
                                  }
                                }
                              });
                            }}
                            className="text-[10px] font-bold text-neutral-500 hover:text-[#009bb9] transition-colors"
                          >
                            استعادة الـ 18 ميزة الافتراضية
                          </button>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] bg-[#009bb9]/10 text-[#009bb9] px-2 py-0.5 rounded-full font-black">
                              {(localLanding.pricing.plan5Months.features || []).length} مميزات
                            </span>
                            <label className="text-[11px] font-black text-neutral-800">قائمة المميزات</label>
                          </div>
                        </div>

                        {/* List of features */}
                        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                          {(localLanding.pricing.plan5Months.features || []).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-neutral-200/80">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (localLanding.pricing.plan5Months.features || []).filter((_, i) => i !== fIdx);
                                  setLocalLanding({
                                    ...localLanding,
                                    pricing: {
                                      ...localLanding.pricing,
                                      plan5Months: { ...localLanding.pricing.plan5Months, features: updated }
                                    }
                                  });
                                }}
                                className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="حذف الميزة"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <input 
                                type="text"
                                value={feat}
                                onChange={(e) => {
                                  const updated = [...(localLanding.pricing.plan5Months.features || [])];
                                  updated[fIdx] = e.target.value;
                                  setLocalLanding({
                                    ...localLanding,
                                    pricing: {
                                      ...localLanding.pricing,
                                      plan5Months: { ...localLanding.pricing.plan5Months, features: updated }
                                    }
                                  });
                                }}
                                className="flex-1 px-2 py-1 bg-transparent text-xs font-semibold text-neutral-800 focus:outline-none focus:bg-neutral-50 rounded"
                              />
                              <span className="text-[10px] text-neutral-400 font-mono w-4 text-center">{fIdx + 1}</span>
                            </div>
                          ))}
                        </div>

                        {/* Add Feature Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(localLanding.pricing.plan5Months.features || []), 'ميزة جديدة'];
                            setLocalLanding({
                              ...localLanding,
                              pricing: {
                                ...localLanding.pricing,
                                plan5Months: { ...localLanding.pricing.plan5Months, features: updated }
                              }
                            });
                          }}
                          className="w-full py-1.5 px-3 bg-white border border-dashed border-[#009bb9]/50 hover:border-[#009bb9] text-[#009bb9] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة ميزة لباقة 6 أشهر</span>
                        </button>
                      </div>
                    </div>

                    {/* Plan 2: 1 Year */}
                    <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
                      <h4 className="font-extrabold text-xs text-amber-600">الباقة السنوية</h4>
                      <div>
                        <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">اسم الباقة</label>
                        <input 
                          type="text" 
                          value={localLanding.pricing.plan1Year.title}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            pricing: {
                              ...localLanding.pricing,
                              plan1Year: { ...localLanding.pricing.plan1Year, title: e.target.value }
                            }
                          })}
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">السعر الرقمي (EGP)</label>
                          <input 
                            type="text" 
                            value={localLanding.pricing.plan1Year.price}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              pricing: {
                                ...localLanding.pricing,
                                plan1Year: { ...localLanding.pricing.plan1Year, price: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">المدة والشراء</label>
                          <input 
                            type="text" 
                            value={localLanding.pricing.plan1Year.period}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              pricing: {
                                ...localLanding.pricing,
                                plan1Year: { ...localLanding.pricing.plan1Year, period: e.target.value }
                              }
                            })}
                            className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">نص الخصم أو التوفير</label>
                        <input 
                          type="text" 
                          value={localLanding.pricing.plan1Year.discountText ?? ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            pricing: {
                              ...localLanding.pricing,
                              plan1Year: { ...localLanding.pricing.plan1Year, discountText: e.target.value }
                            }
                          })}
                          placeholder="فارغ (أو اكتب نص الخصم)"
                          className="w-full px-3 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold"
                        />
                      </div>

                      {/* Features List for Plan 2 */}
                      <div className="pt-3 border-t border-neutral-200/70 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                const featuresFrom6m = localLanding.pricing.plan5Months.features || [];
                                setLocalLanding({
                                  ...localLanding,
                                  pricing: {
                                    ...localLanding.pricing,
                                    plan1Year: {
                                      ...localLanding.pricing.plan1Year,
                                      features: [...featuresFrom6m]
                                    }
                                  }
                                });
                              }}
                              className="text-[10px] font-bold text-neutral-500 hover:text-amber-600 transition-colors"
                            >
                              نسخ من باقة 6 أشهر
                            </button>
                            <span className="text-neutral-300">|</span>
                            <button
                              type="button"
                              onClick={() => {
                                const default18 = [
                                  "بروفايل طبي", "رابط خاص", "قوالب متعددة", "نبذة ومؤهلات",
                                  "تخصص وخدمات", "أسعار الخدمات", "صور العيادة", "فيديوهات",
                                  "مواعيد العمل", "لوكيشن العيادة", "سوشيال ميديا", "حجز مواعيد",
                                  "تقييمات المرضى", "اضافة سكرتارية متعددة", "لوحة تحكم احترافية",
                                  "متوافق مع الأجهزة", "دعم فني", "تحديثات مجانية"
                                ];
                                setLocalLanding({
                                  ...localLanding,
                                  pricing: {
                                    ...localLanding.pricing,
                                    plan1Year: {
                                      ...localLanding.pricing.plan1Year,
                                      features: default18
                                    }
                                  }
                                });
                              }}
                              className="text-[10px] font-bold text-neutral-500 hover:text-amber-600 transition-colors"
                            >
                              استعادة الافتراضي
                            </button>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-black">
                              {(localLanding.pricing.plan1Year.features || []).length} مميزات
                            </span>
                            <label className="text-[11px] font-black text-neutral-800">قائمة المميزات</label>
                          </div>
                        </div>

                        {/* List of features */}
                        <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                          {(localLanding.pricing.plan1Year.features || []).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-center gap-1.5 bg-white p-1.5 rounded-lg border border-neutral-200/80">
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (localLanding.pricing.plan1Year.features || []).filter((_, i) => i !== fIdx);
                                  setLocalLanding({
                                    ...localLanding,
                                    pricing: {
                                      ...localLanding.pricing,
                                      plan1Year: { ...localLanding.pricing.plan1Year, features: updated }
                                    }
                                  });
                                }}
                                className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                                title="حذف الميزة"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                              <input 
                                type="text"
                                value={feat}
                                onChange={(e) => {
                                  const updated = [...(localLanding.pricing.plan1Year.features || [])];
                                  updated[fIdx] = e.target.value;
                                  setLocalLanding({
                                    ...localLanding,
                                    pricing: {
                                      ...localLanding.pricing,
                                      plan1Year: { ...localLanding.pricing.plan1Year, features: updated }
                                    }
                                  });
                                }}
                                className="flex-1 px-2 py-1 bg-transparent text-xs font-semibold text-neutral-800 focus:outline-none focus:bg-neutral-50 rounded"
                              />
                              <span className="text-[10px] text-neutral-400 font-mono w-4 text-center">{fIdx + 1}</span>
                            </div>
                          ))}
                        </div>

                        {/* Add Feature Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...(localLanding.pricing.plan1Year.features || []), 'ميزة جديدة'];
                            setLocalLanding({
                              ...localLanding,
                              pricing: {
                                ...localLanding.pricing,
                                plan1Year: { ...localLanding.pricing.plan1Year, features: updated }
                              }
                            });
                          }}
                          className="w-full py-1.5 px-3 bg-white border border-dashed border-amber-500/50 hover:border-amber-500 text-amber-600 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>إضافة ميزة للباقة السنوية</span>
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* بنر أسفل قسم الأسعار والاشتراكات */}
                  <div className="pt-6 border-t border-neutral-200/80 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-400 font-bold">تعديل النص والزر في البنر الأزرق الترويجي أسفل الأسعار والأسئلة الشائعة</span>
                      <h4 className="font-black text-sm text-[#10244A]">البنر الترويجي أسفل صفحة الأسعار</h4>
                    </div>

                    <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان البنر الرئيسي</label>
                        <textarea 
                          rows={2}
                          value={localLanding.pricing.bottomBannerTitle ?? 'كل اللي محتاجه علشان تعرض خدماتك الطبية أونلاين في مكان واحد'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            pricing: { ...localLanding.pricing, bottomBannerTitle: e.target.value }
                          })}
                          placeholder="كل اللي محتاجه علشان تعرض خدماتك الطبية أونلاين في مكان واحد"
                          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر البنر</label>
                        <input 
                          type="text" 
                          value={localLanding.pricing.bottomBannerButtonText ?? 'ابدأ الآن مجاناً'}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            pricing: { ...localLanding.pricing, bottomBannerButtonText: e.target.value }
                          })}
                          placeholder="ابدأ الآن مجاناً"
                          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Sub-section 4: نموذج */}
            {landingSubTab === 'clientWorks' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">إدارة نماذج البروفايلات المعروضة في قسم نموذج</span>
                  <h3 className="text-base font-black text-[#10244A]">4. قسم نموذج</h3>
                </div>

                <div className="space-y-6">
                  {/* Section Title */}
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان قسم النموذج (Section Title)</label>
                    <input 
                      type="text" 
                      value={(!localLanding.clientWorks?.title || localLanding.clientWorks?.title === 'سابقة الأعمال' || localLanding.clientWorks?.title === 'معاينة' || localLanding.clientWorks?.title === 'نماذج من بروفايلات الأطباء') ? 'أمثلة من البروفايلات' : localLanding.clientWorks.title}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        clientWorks: { 
                          ...(localLanding.clientWorks || { title: 'أمثلة من البروفايلات', cards: [] }), 
                          title: e.target.value 
                        }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Display Layout Switch: 1 model or 2 side-by-side */}
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-neutral-500 font-medium">اختر طريقة عرض النماذج في الصفحة الرئيسية</span>
                      <label className="block text-xs font-black text-[#10244A]">تخطيط العرض (عدد النماذج في الصف)</label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setLocalLanding({
                          ...localLanding,
                          clientWorks: {
                            ...(localLanding.clientWorks || { title: 'أمثلة من البروفايلات', cards: [] }),
                            columns: 1
                          }
                        })}
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          (localLanding.clientWorks?.columns || 1) === 1
                            ? 'bg-[#003B7A] border-[#003B7A] text-white shadow-sm'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            (localLanding.clientWorks?.columns || 1) === 1 ? 'border-white bg-white' : 'border-neutral-400'
                          }`}>
                            {(localLanding.clientWorks?.columns || 1) === 1 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#003B7A]" />
                            )}
                          </div>
                          <span className="text-xs font-extrabold">نموذج واحد (كرت كبير وعريض)</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-white/20">1 كرت</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLocalLanding({
                          ...localLanding,
                          clientWorks: {
                            ...(localLanding.clientWorks || { title: 'أمثلة من البروفايلات', cards: [] }),
                            columns: 2
                          }
                        })}
                        className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          (localLanding.clientWorks?.columns || 1) === 2
                            ? 'bg-[#003B7A] border-[#003B7A] text-white shadow-sm'
                            : 'bg-white border-neutral-200 text-neutral-700 hover:border-neutral-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                            (localLanding.clientWorks?.columns || 1) === 2 ? 'border-white bg-white' : 'border-neutral-400'
                          }`}>
                            {(localLanding.clientWorks?.columns || 1) === 2 && (
                              <div className="w-1.5 h-1.5 rounded-full bg-[#003B7A]" />
                            )}
                          </div>
                          <span className="text-xs font-extrabold">نموذجين جنب بعض (2 كروت في الصف)</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-bold bg-white/20">2 كروت</span>
                      </button>
                    </div>
                  </div>

                  {/* Models / Cards List */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          const currentCards = localLanding.clientWorks?.cards || [
                            {
                              id: 'card-1',
                              imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200',
                              profileUrl: 'dr-sarah',
                              title: 'د. سارة الشريف - طب وجراحة الأسنان'
                            }
                          ];
                          const newCard: PreviewCardItem = {
                            id: `card-${Date.now()}`,
                            imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=1200',
                            profileUrl: '',
                            title: ''
                          };
                          setLocalLanding({
                            ...localLanding,
                            clientWorks: {
                              ...(localLanding.clientWorks || { title: 'أمثلة من البروفايلات', columns: 1 }),
                              cards: [...currentCards, newCard]
                            }
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#003B7A] hover:bg-[#002d5e] text-white text-xs font-black rounded-xl transition-all shadow-sm cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>إضافة نموذج جديد</span>
                      </button>
                      <h4 className="font-extrabold text-xs text-[#10244A]">
                        النماذج المضافة ({((localLanding.clientWorks?.cards && localLanding.clientWorks.cards.length > 0) ? localLanding.clientWorks.cards : [
                          {
                            id: 'card-1',
                            imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200',
                            profileUrl: 'dr-sarah',
                            title: 'د. سارة الشريف - طب وجراحة الأسنان'
                          }
                        ]).length})
                      </h4>
                    </div>

                    <div className="space-y-4">
                      {(((localLanding.clientWorks?.cards && localLanding.clientWorks.cards.length > 0) 
                        ? localLanding.clientWorks.cards 
                        : [
                            {
                              id: 'card-1',
                              imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200',
                              profileUrl: 'dr-sarah',
                              title: 'د. سارة الشريف - طب وجراحة الأسنان'
                            }
                          ]
                      )).map((card, cardIdx, arr) => (
                        <div key={card.id || `card-${cardIdx}`} className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between border-b border-neutral-200/80 pb-3">
                            {arr.length > 1 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedCards = arr.filter((_, i) => i !== cardIdx);
                                  setLocalLanding({
                                    ...localLanding,
                                    clientWorks: {
                                      ...(localLanding.clientWorks || { title: 'أمثلة من البروفايلات', columns: 1 }),
                                      cards: updatedCards
                                    }
                                  });
                                }}
                                className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف هذا النموذج</span>
                              </button>
                            ) : <div />}
                            <span className="text-xs font-black text-[#003B7A] bg-blue-100/70 px-2.5 py-1 rounded-lg">
                              النموذج #{cardIdx + 1}
                            </span>
                          </div>

                          {/* Image Upload / URL */}
                          <div>
                            <ImageInputWithUpload
                              label="تحميل صورة البروفايل (رابط مباشر أو رفع صورة من جهازك)"
                              value={card.imageUrl || ''}
                              onChange={(val) => {
                                const newCards = [...arr];
                                newCards[cardIdx] = { ...newCards[cardIdx], imageUrl: val };
                                setLocalLanding({
                                  ...localLanding,
                                  clientWorks: {
                                    ...(localLanding.clientWorks || { title: 'أمثلة من البروفايلات', columns: 1 }),
                                    cards: newCards
                                  }
                                });
                              }}
                              placeholder="ضع رابط صورة البروفايل أو ارفع صورة..."
                            />
                          </div>

                          {/* Profile Username and link */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-extrabold text-neutral-700">
                                  يوزر البروفايل (Doctor Username) <span className="text-red-500">*</span>
                                </label>
                                {onVisitDoctor && card.profileUrl && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (card.profileUrl) onVisitDoctor(card.profileUrl);
                                    }}
                                    className="text-[11px] font-black text-blue-600 hover:text-blue-800 underline flex items-center gap-1 cursor-pointer"
                                  >
                                    <span>معاينة البروفايل</span>
                                    <ExternalLink className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                              <input
                                type="text"
                                value={card.profileUrl || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const newCards = [...arr];
                                  newCards[cardIdx] = { ...newCards[cardIdx], profileUrl: val };
                                  setLocalLanding({
                                    ...localLanding,
                                    clientWorks: {
                                      ...(localLanding.clientWorks || { title: 'أمثلة من البروفايلات', columns: 1 }),
                                      cards: newCards
                                    }
                                  });
                                }}
                                placeholder="مثال: dr-ahmed أو ahmed-hassan"
                                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black text-left font-mono"
                                dir="ltr"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-extrabold text-neutral-700 mb-1.5">
                                اسم أو عنوان الطبيب (اختياري)
                              </label>
                              <input
                                type="text"
                                value={card.title || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const newCards = [...arr];
                                  newCards[cardIdx] = { ...newCards[cardIdx], title: val };
                                  setLocalLanding({
                                    ...localLanding,
                                    clientWorks: {
                                      ...(localLanding.clientWorks || { title: 'أمثلة من البروفايلات', columns: 1 }),
                                      cards: newCards
                                    }
                                  });
                                }}
                                placeholder="مثال: د. أحمد سليمان - أمراض القلب"
                                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 5: تواصل معنا */}
            {landingSubTab === 'contact' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل بيانات الاتصال، البريد، الواتساب، الكروت، ونموذج المراسلة</span>
                  <h3 className="text-base font-black text-[#10244A]">5. قسم تواصل معنا</h3>
                </div>

                <div className="space-y-6">
                  {/* Main Header */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان قسم التواصل (Section Title)</label>
                      <input 
                        type="text" 
                        value={localLanding.contact.title || 'تواصل معنا'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          contact: { ...localLanding.contact, title: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الترحيبي (Subtitle)</label>
                      <input 
                        type="text" 
                        value={localLanding.contact.subtitle || 'جاهزين لمساعدتك في أي شيء وأي وقت'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          contact: { ...localLanding.contact, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Synchronized Social Media Notice Banner */}
                  <div className="bg-blue-50/60 border border-blue-200/80 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#003B7A] text-white flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-[#003B7A]">أيقونات وسائل التواصل والمواقع</h5>
                        <p className="text-[11px] text-neutral-500 font-medium">أيقونات التواصل متزامنة تلقائياً بين الفوتر وقسم تواصل معنا، ويمكنك إضافة مواقع أخرى وتعديلها من قسم الفوتر.</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLandingSubTab('footer')}
                      className="px-3 py-1.5 bg-[#003B7A] hover:bg-[#002d5e] text-white rounded-xl text-xs font-bold transition-all shrink-0"
                    >
                      إدارة الأيقونات في الفوتر ←
                    </button>
                  </div>

                  {/* Contact Channels */}
                  <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">رقم الواتساب مع كود الدولة (WhatsApp Number)</label>
                      <input 
                        type="text" 
                        value={localLanding.contact.whatsappNumber || '201111777251'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          contact: { ...localLanding.contact, whatsappNumber: e.target.value }
                        })}
                        placeholder="مثال: 201111777251"
                        dir="ltr"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">البريد الإلكتروني للإدارة والدعم (Email Address)</label>
                      <input 
                        type="email" 
                        value={localLanding.contact.targetEmail || 'drprofileweb@gmail.com'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          contact: { ...localLanding.contact, targetEmail: e.target.value }
                        })}
                        placeholder="drprofileweb@gmail.com"
                        dir="ltr"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black text-right"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">محتوى الرسالة المرسلة (Default Message Content)</label>
                      <input 
                        type="text" 
                        value={localLanding.contact.defaultMessage || ''}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          contact: { ...localLanding.contact, defaultMessage: e.target.value }
                        })}
                        placeholder="مرحباً، أود الاستفسار عن منصة دكتور بروفايل..."
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black text-right"
                      />
                    </div>
                  </div>

                  {/* 3 Contact Cards Settings */}
                  <div className="pt-4 border-t border-neutral-100 space-y-4">
                    <h4 className="font-extrabold text-xs text-[#10244A]">تخصيص كروت التواصل الثلاثة (الأسئلة الشائعة - الاتصال - المراسلة)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Card 1: FAQs */}
                      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                        <span className="text-[10px] font-extrabold bg-blue-100 text-[#003B7A] px-2 py-0.5 rounded-full inline-block">1. كرت الأسئلة الشائعة</span>
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">العنوان</label>
                          <input 
                            type="text" 
                            value={localLanding.contact.cardFaqTitle || 'الأسئلة الشائعة'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              contact: { ...localLanding.contact, cardFaqTitle: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">الوصف</label>
                          <textarea 
                            rows={2}
                            value={localLanding.contact.cardFaqSubtitle || 'إجابات سريعة على أهم الأسئلة حول دكتور بروفايل وخدماتنا.'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              contact: { ...localLanding.contact, cardFaqSubtitle: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">نص الزر</label>
                          <input 
                            type="text" 
                            value={localLanding.contact.cardFaqButtonText || 'شاهد الأسئلة الشائعة'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              contact: { ...localLanding.contact, cardFaqButtonText: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                      </div>

                      {/* Card 2: Call Us */}
                      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                        <span className="text-[10px] font-extrabold bg-green-100 text-green-800 px-2 py-0.5 rounded-full inline-block">2. كرت اتصل بنا (واتساب)</span>
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">العنوان</label>
                          <input 
                            type="text" 
                            value={localLanding.contact.cardCallTitle || 'اتصل بنا'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              contact: { ...localLanding.contact, cardCallTitle: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">الوصف</label>
                          <textarea 
                            rows={2}
                            value={localLanding.contact.cardCallSubtitle || 'لديك استفسار أو مشكلة؟ دردش معنا أو حدد وقت لمكالمة هاتفية مع فريق الدعم.'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              contact: { ...localLanding.contact, cardCallSubtitle: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">نص الزر</label>
                          <input 
                            type="text" 
                            value={localLanding.contact.cardCallButtonText || 'كلمنا الآن'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              contact: { ...localLanding.contact, cardCallButtonText: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                      </div>

                      {/* Card 3: Mail */}
                      <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                        <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full inline-block">3. كرت اترك لنا رسالة (بريد)</span>
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">العنوان</label>
                          <input 
                            type="text" 
                            value={localLanding.contact.cardMessageTitle || 'اترك لنا رسالة'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              contact: { ...localLanding.contact, cardMessageTitle: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">الوصف</label>
                          <textarea 
                            rows={2}
                            value={localLanding.contact.cardMessageSubtitle || 'لديك استفسار أو مشكلة؟ راسلنا الآن عبر البريد الإلكتروني لحلها.'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              contact: { ...localLanding.contact, cardMessageSubtitle: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-medium"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-extrabold text-neutral-600 mb-1">نص الزر</label>
                          <input 
                            type="text" 
                            value={localLanding.contact.cardMessageButtonText || 'راسلنا'}
                            onChange={(e) => setLocalLanding({
                              ...localLanding,
                              contact: { ...localLanding.contact, cardMessageButtonText: e.target.value }
                            })}
                            className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-xs font-bold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Direct Contact Form Title & Submit Button */}
                  <div className="pt-4 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان نموذج المراسلة المباشرة</label>
                      <input 
                        type="text" 
                        value={localLanding.contact.formTitle || 'للتواصل مع الادارة يرجى ملء النموذج التالي'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          contact: { ...localLanding.contact, formTitle: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر إرسال النموذج (Submit Button)</label>
                      <input 
                        type="text" 
                        value={localLanding.contact.buttonText || 'إرسال'}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          contact: { ...localLanding.contact, buttonText: e.target.value }
                        })}
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section Dashboard Settings: لوحة الطبيب */}
            {landingSubTab === 'dashboardSettings' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل نصوص زر الإدارة في لوحة الطبيب (الاشتراكات)</span>
                  <h3 className="text-base font-black text-[#10244A]">قسم لوحة الطبيب</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر تواصل مع الإدارة (Contact Admin Button)</label>
                    <input 
                      type="text" 
                      value={localLanding.dashboardSettings?.contactAdminButtonText || 'تواصل مع الإدارة'}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        dashboardSettings: { ...(localLanding.dashboardSettings || {}), contactAdminButtonText: e.target.value }
                      } as any)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">رقم الواتساب للتواصل مع الإدارة (WhatsApp Number)</label>
                    <input 
                      type="text" 
                      value={localLanding.dashboardSettings?.contactAdminWhatsappNumber || '201111777251'}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        dashboardSettings: { ...(localLanding.dashboardSettings || {}), contactAdminWhatsappNumber: e.target.value }
                      } as any)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">رسالة الواتساب الافتراضية (استخدم {'{doctorName}'} لاسم الطبيب)</label>
                    <textarea 
                      rows={3}
                      value={localLanding.dashboardSettings?.contactAdminMessage || 'مرحباً إدارة دكتور بروفايل، أود الاستفسار عن تجديد/ترقية اشتراكي للطبيب: {doctorName}'}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        dashboardSettings: { ...(localLanding.dashboardSettings || {}), contactAdminMessage: e.target.value }
                      } as any)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 6: تسجيل الدخول */}
            {landingSubTab === 'login' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل نصوص وأزرار ولوجو صفحة تسجيل الدخول</span>
                  <h3 className="text-base font-black text-[#10244A]">6. قسم تسجيل الدخول</h3>
                </div>

                <div className="space-y-4">
                  <ImageInputWithUpload 
                    label="لوجو صفحة تسجيل الدخول (Login Page Logo)"
                    value={localLanding.login.logoUrl || "https://i.top4top.io/p_3857n94r80.png"}
                    onChange={(newVal) => setLocalLanding({
                      ...localLanding,
                      login: { ...localLanding.login, logoUrl: newVal }
                    })}
                  />

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر تسجيل الدخول للشريط العلوي (Header Login Text)</label>
                    <input 
                      type="text" 
                      value={localLanding.login.headerLoginButtonText}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        login: { ...localLanding.login, headerLoginButtonText: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان صفحة تسجيل الدخول (Page Title)</label>
                    <input 
                      type="text" 
                      value={localLanding.login.title}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        login: { ...localLanding.login, title: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي لصفحة تسجيل الدخول (Subtitle)</label>
                    <textarea 
                      rows={2}
                      value={localLanding.login.subtitle}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        login: { ...localLanding.login, subtitle: e.target.value }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 7: ابدأ الآن مجاناً */}
            {landingSubTab === 'createSite' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">التحكم بجميع تفاصيل ونصوص ومراحل صفحة "ابدأ الآن مجاناً" وشعارها وأزرارها</span>
                  <h3 className="text-base font-black text-[#10244A]">7. صفحة ابدأ الآن مجاناً (إنشاء حساب)</h3>
                </div>

                <div className="space-y-6">
                  {/* Page Logo */}
                  <ImageInputWithUpload 
                    label="لوجو صفحة إنشاء الحساب (Register Page Logo)"
                    value={localLanding.createSite.logoUrl || "https://d.top4top.io/p_3875rj4l41.png"}
                    onChange={(newVal) => setLocalLanding({
                      ...localLanding,
                      createSite: { ...localLanding.createSite, logoUrl: newVal }
                    })}
                  />

                  {/* Main Title & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">عنوان صفحة / نموذج التسجيل (Page Title)</label>
                      <input 
                        type="text" 
                        value={localLanding.createSite.title || ''}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          createSite: { ...localLanding.createSite, title: e.target.value }
                        })}
                        placeholder="انشئ حساب مجاني"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">الوصف الفرعي لنموذج التسجيل (Form Subtitle)</label>
                      <input 
                        type="text"
                        value={localLanding.createSite.subtitle || ''}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          createSite: { ...localLanding.createSite, subtitle: e.target.value }
                        })}
                        placeholder="المرحلة الأولى"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Header & Hero CTA Buttons */}
                  <div className="bg-neutral-50/60 p-4 rounded-2xl border border-neutral-100 space-y-3">
                    <h4 className="text-xs font-black text-[#003B7A]">أزرار الدعوة للإجراء المرتبطة بالصفحة (CTA Buttons)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر "ابدأ الآن مجاناً" في الشريط العلوي (Header CTA)</label>
                        <input 
                          type="text" 
                          value={localLanding.createSite.headerCtaButtonText || ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            createSite: { ...localLanding.createSite, headerCtaButtonText: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر "ابدأ الآن مجاناً" في قسم البطل (Hero CTA)</label>
                        <input 
                          type="text" 
                          value={localLanding.createSite.heroCtaButtonText || ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            createSite: { ...localLanding.createSite, heroCtaButtonText: e.target.value }
                          })}
                          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2-Step Registration Wizard Details */}
                  <div className="border border-blue-100 bg-blue-50/30 p-4 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#003B7A] text-white flex items-center justify-center text-xs font-bold">1</div>
                      <h4 className="text-xs font-black text-[#003B7A]">المرحلة الأولى: إنشاء الحساب الأساسي (Step 1)</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">اسم المرحلة الأولى (Step 1 Name)</label>
                        <input 
                          type="text" 
                          value={localLanding.createSite.step1Title || ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            createSite: { ...localLanding.createSite, step1Title: e.target.value }
                          })}
                          placeholder="انشئ حساب مجاني"
                          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر الانتقال للمرحلة التالية (Next Button)</label>
                        <input 
                          type="text" 
                          value={localLanding.createSite.nextButtonText || ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            createSite: { ...localLanding.createSite, nextButtonText: e.target.value }
                          })}
                          placeholder="التالي"
                          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-blue-100 bg-blue-50/30 p-4 rounded-2xl space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#003B7A] text-white flex items-center justify-center text-xs font-bold">2</div>
                      <h4 className="text-xs font-black text-[#003B7A]">المرحلة الثانية: بيانات البروفايل والصورة (Step 2)</h4>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">اسم المرحلة الثانية (Step 2 Name)</label>
                        <input 
                          type="text" 
                          value={localLanding.createSite.step2Title || ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            createSite: { ...localLanding.createSite, step2Title: e.target.value }
                          })}
                          placeholder="بيانات البروفايل"
                          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر العودة للسابق (Back Button)</label>
                        <input 
                          type="text" 
                          value={localLanding.createSite.backButtonText || ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            createSite: { ...localLanding.createSite, backButtonText: e.target.value }
                          })}
                          placeholder="السابق"
                          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر إنشاء الحساب النهائي (Submit Button)</label>
                        <input 
                          type="text" 
                          value={localLanding.createSite.submitButtonText || ''}
                          onChange={(e) => setLocalLanding({
                            ...localLanding,
                            createSite: { ...localLanding.createSite, submitButtonText: e.target.value }
                          })}
                          placeholder="انشئ حساب مجاني"
                          className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص حالة جاري الإنشاء (Submitting Loading Text)</label>
                      <input 
                        type="text" 
                        value={localLanding.createSite.submittingButtonText || ''}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          createSite: { ...localLanding.createSite, submittingButtonText: e.target.value }
                        })}
                        placeholder="جاري إنشاء الحساب..."
                        className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>

                  {/* Footer Login Link & Prompt */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص سؤال تسجيل الدخول السفلي (Login Prompt)</label>
                      <input 
                        type="text" 
                        value={localLanding.createSite.loginPromptText || ''}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          createSite: { ...localLanding.createSite, loginPromptText: e.target.value }
                        })}
                        placeholder="لديكم حساب بالفعل؟"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص رابط تسجيل الدخول (Login Link Text)</label>
                      <input 
                        type="text" 
                        value={localLanding.createSite.loginLinkText || ''}
                        onChange={(e) => setLocalLanding({
                          ...localLanding,
                          createSite: { ...localLanding.createSite, loginLinkText: e.target.value }
                        })}
                        placeholder="تسجيل الدخول"
                        className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 8: الفوتر */}
            {landingSubTab === 'footer' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل لوجو ووصف وروابط وسائل التواصل ومواقع الفوتر وقسم تواصل معنا</span>
                  <h3 className="text-base font-black text-[#10244A]">8. قسم الفوتر ووسائل التواصل</h3>
                </div>

                <div className="space-y-6">
                  <ImageInputWithUpload 
                    label="لوجو الفوتر (Footer Logo)"
                    value={localLanding.footer?.logoUrl || "https://k.top4top.io/p_38573eitn0.png"}
                    onChange={(newVal) => setLocalLanding({
                      ...localLanding,
                      footer: {
                        ...(localLanding.footer || {}),
                        logoUrl: newVal
                      }
                    })}
                  />

                  <ImageInputWithUpload 
                    label="أيقونات / صورة شركات وطرق الدفع (Payment Methods Icons)"
                    value={localLanding.footer?.paymentMethodsImageUrl || ""}
                    onChange={(newVal) => setLocalLanding({
                      ...localLanding,
                      footer: {
                        ...(localLanding.footer || {}),
                        paymentMethodsImageUrl: newVal
                      }
                    })}
                    placeholder="رابط أو رفع صورة أيقونات الدفع (تظهر في الفوتر أسفل اللوجو)"
                  />

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">وصف المنصة في الفوتر (Footer Description)</label>
                    <textarea 
                      rows={2}
                      value={localLanding.footer?.description || ''}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        footer: {
                          ...(localLanding.footer || {}),
                          description: e.target.value
                        }
                      })}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Dynamic Social & Website Links Manager */}
                  <div className="pt-4 border-t border-neutral-100 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#003B7A] flex items-center gap-2">
                          <Globe className="w-4 h-4 text-[#009bb9]" />
                          أيقونات وروابط التواصل والمواقع (Social Media & Websites)
                        </h4>
                        <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                          تظهر هذه الروابط والأيقونات تلقائياً في كل من **الفوتر السفلي** و **قسم تواصل معنا**. يمكنك تعديلها أو حذفها أو إضافة أي موقع آخر.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const currentLinks = localLanding.footer?.socialLinks && localLanding.footer.socialLinks.length > 0 
                            ? [...localLanding.footer.socialLinks] 
                            : getEffectiveSocialLinks(localLanding.footer);
                          
                          const newLink: FooterSocialLink = {
                            id: 'soc_' + Date.now(),
                            platform: 'website',
                            title: 'موقع إلكتروني',
                            url: 'https://',
                            enabled: true
                          };

                          const updatedLinks = [...currentLinks, newLink];
                          setLocalLanding({
                            ...localLanding,
                            footer: {
                              ...(localLanding.footer || {}),
                              socialLinks: updatedLinks
                            }
                          });
                        }}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#003B7A] hover:bg-[#002d5e] text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        إضافة موقع / منصة أخرى
                      </button>
                    </div>

                    {/* Quick Add Bar for Popular Platforms if not already added */}
                    {(() => {
                      const currentLinks = localLanding.footer?.socialLinks && localLanding.footer.socialLinks.length > 0 
                        ? localLanding.footer.socialLinks 
                        : getEffectiveSocialLinks(localLanding.footer);
                      
                      const existingPlatforms = new Set(currentLinks.map(l => l.platform));
                      const unadded = SOCIAL_PLATFORMS.filter(p => !existingPlatforms.has(p.id) && p.id !== 'other');

                      if (unadded.length === 0) return null;

                      return (
                        <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-2xl">
                          <span className="text-[11px] font-extrabold text-neutral-600 mb-2 block">
                            إضافة سريعة لمنصات شائعة:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {unadded.map(platform => (
                              <button
                                key={platform.id}
                                type="button"
                                onClick={() => {
                                  const newLink: FooterSocialLink = {
                                    id: 'soc_' + platform.id + '_' + Date.now(),
                                    platform: platform.id,
                                    title: platform.defaultTitleAr,
                                    url: platform.placeholder,
                                    enabled: true
                                  };
                                  const updatedLinks = [...currentLinks, newLink];
                                  setLocalLanding({
                                    ...localLanding,
                                    footer: {
                                      ...(localLanding.footer || {}),
                                      socialLinks: updatedLinks
                                    }
                                  });
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-blue-50 hover:border-blue-300 border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 transition-all shadow-2xs"
                              >
                                <SocialIcon platform={platform.id} className="w-3.5 h-3.5 text-[#003B7A]" />
                                + {platform.nameEn}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
        */

                    {/* List of configured links */}
                    {(() => {
                      const currentLinks = localLanding.footer?.socialLinks && localLanding.footer.socialLinks.length > 0 
                        ? localLanding.footer.socialLinks 
                        : getEffectiveSocialLinks(localLanding.footer);

                      if (currentLinks.length === 0) {
                        return (
                          <div className="text-center py-8 border-2 border-dashed border-neutral-200 rounded-2xl">
                            <p className="text-xs text-neutral-500 font-bold mb-3">لا توجد مواقع أو وسائل تواصل مضافة حالياً.</p>
                            <button
                              type="button"
                              onClick={() => {
                                setLocalLanding({
                                  ...localLanding,
                                  footer: {
                                    ...(localLanding.footer || {}),
                                    socialLinks: DEFAULT_LANDING_CONFIG.footer?.socialLinks || []
                                  }
                                });
                              }}
                              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                            >
                              استعادة المواقع الافتراضية
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-3">
                          {currentLinks.map((linkItem, idx) => {
                            const platformMeta = SOCIAL_PLATFORMS.find(p => p.id === linkItem.platform) || {
                              id: 'other',
                              nameAr: 'موقع آخر',
                              nameEn: 'Other',
                              placeholder: 'https://...',
                              defaultTitleAr: 'رابط إضافي',
                              defaultTitleEn: 'Link'
                            };

                            return (
                              <div 
                                key={linkItem.id || `soc-item-${idx}`}
                                className={`p-4 rounded-2xl border transition-all ${
                                  linkItem.enabled !== false 
                                    ? 'bg-white border-neutral-200 shadow-2xs' 
                                    : 'bg-neutral-50 border-neutral-200/60 opacity-60'
                                }`}
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                  
                                  {/* Icon & Platform Select */}
                                  <div className="sm:col-span-4 flex items-center gap-2.5">
                                    <div className="w-9 h-9 rounded-xl bg-[#003B7A] text-white flex items-center justify-center shrink-0 shadow-2xs">
                                      <SocialIcon platform={linkItem.platform} className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                      <label className="block text-[10px] font-bold text-neutral-400 mb-0.5">نوع المنصة / الموقع</label>
                                      <select
                                        value={linkItem.platform}
                                        onChange={(e) => {
                                          const newPlatform = e.target.value as FooterSocialLink['platform'];
                                          const pMeta = SOCIAL_PLATFORMS.find(p => p.id === newPlatform);
                                          const updated = currentLinks.map((l, i) => {
                                            if (i === idx) {
                                              return {
                                                ...l,
                                                platform: newPlatform,
                                                title: l.title && l.title !== platformMeta.defaultTitleAr ? l.title : (pMeta?.defaultTitleAr || l.title),
                                                url: l.url && l.url !== platformMeta.placeholder ? l.url : (pMeta?.placeholder || l.url)
                                              };
                                            }
                                            return l;
                                          });
                                          setLocalLanding({
                                            ...localLanding,
                                            footer: {
                                              ...(localLanding.footer || {}),
                                              socialLinks: updated
                                            }
                                          });
                                        }}
                                        className="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#003B7A]"
                                      >
                                        {SOCIAL_PLATFORMS.map(p => (
                                          <option key={p.id} value={p.id}>{p.nameAr}</option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  {/* Custom Label / Title */}
                                  <div className="sm:col-span-3">
                                    <label className="block text-[10px] font-bold text-neutral-400 mb-0.5">الاسم / العنوان الظاهر</label>
                                    <input 
                                      type="text"
                                      value={linkItem.title || ''}
                                      onChange={(e) => {
                                        const updated = currentLinks.map((l, i) => i === idx ? { ...l, title: e.target.value } : l);
                                        setLocalLanding({
                                          ...localLanding,
                                          footer: {
                                            ...(localLanding.footer || {}),
                                            socialLinks: updated
                                          }
                                        });
                                      }}
                                      placeholder={platformMeta.defaultTitleAr}
                                      className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:border-[#003B7A]"
                                    />
                                  </div>

                                  {/* URL Input */}
                                  <div className="sm:col-span-3">
                                    <label className="block text-[10px] font-bold text-neutral-400 mb-0.5">الرابط (URL)</label>
                                    <input 
                                      type="text"
                                      value={linkItem.url || ''}
                                      onChange={(e) => {
                                        const updated = currentLinks.map((l, i) => i === idx ? { ...l, url: e.target.value } : l);
                                        setLocalLanding({
                                          ...localLanding,
                                          footer: {
                                            ...(localLanding.footer || {}),
                                            socialLinks: updated
                                          }
                                        });
                                      }}
                                      placeholder={platformMeta.placeholder}
                                      className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-[#003B7A]"
                                      dir="ltr"
                                    />
                                  </div>

                                  {/* Controls: Active Toggle, Move, Delete */}
                                  <div className="sm:col-span-2 flex items-center justify-end gap-1.5 pt-2 sm:pt-4">
                                    {/* Enable / Disable toggle */}
                                    <button
                                      type="button"
                                      title={linkItem.enabled !== false ? 'تعطيل / إخفاء' : 'تفعيل'}
                                      onClick={() => {
                                        const updated = currentLinks.map((l, i) => i === idx ? { ...l, enabled: l.enabled === false ? true : false } : l);
                                        setLocalLanding({
                                          ...localLanding,
                                          footer: {
                                            ...(localLanding.footer || {}),
                                            socialLinks: updated
                                          }
                                        });
                                      }}
                                      className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold transition-all ${
                                        linkItem.enabled !== false 
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                          : 'bg-neutral-200 text-neutral-600'
                                      }`}
                                    >
                                      {linkItem.enabled !== false ? 'مفعل' : 'معطل'}
                                    </button>

                                    {/* Move Up */}
                                    {idx > 0 && (
                                      <button
                                        type="button"
                                        title="تحريك لأعلى"
                                        onClick={() => {
                                          const updated = [...currentLinks];
                                          const temp = updated[idx - 1];
                                          updated[idx - 1] = updated[idx];
                                          updated[idx] = temp;
                                          setLocalLanding({
                                            ...localLanding,
                                            footer: {
                                              ...(localLanding.footer || {}),
                                              socialLinks: updated
                                            }
                                          });
                                        }}
                                        className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                                      >
                                        <ArrowUp className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    {/* Move Down */}
                                    {idx < currentLinks.length - 1 && (
                                      <button
                                        type="button"
                                        title="تحريك لأسفل"
                                        onClick={() => {
                                          const updated = [...currentLinks];
                                          const temp = updated[idx + 1];
                                          updated[idx + 1] = updated[idx];
                                          updated[idx] = temp;
                                          setLocalLanding({
                                            ...localLanding,
                                            footer: {
                                              ...(localLanding.footer || {}),
                                              socialLinks: updated
                                            }
                                          });
                                        }}
                                        className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
                                      >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    {/* Delete */}
                                    <button
                                      type="button"
                                      title="حذف هذا الرابط"
                                      onClick={() => {
                                        const updated = currentLinks.filter((_, i) => i !== idx);
                                        setLocalLanding({
                                          ...localLanding,
                                          footer: {
                                            ...(localLanding.footer || {}),
                                            socialLinks: updated
                                          }
                                        });
                                      }}
                                      className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}

                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص حقوق الملكية (Copyright Text)</label>
                    <input 
                      type="text" 
                      value={localLanding.footer?.copyrightText || ''}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        footer: {
                          ...(localLanding.footer || {}),
                          copyrightText: e.target.value
                        }
                      })}
                      placeholder="© 2026 Dr Profile. All rights reserved."
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 9: روابط مهمة (من نحن) */}
            {landingSubTab === 'importantPages' && (
              <ImportantPagesSettings 
                config={localLanding}
                onChange={(updated) => {
                  setLocalLanding(updated);
                  if (onUpdateLandingConfig) {
                    onUpdateLandingConfig(updated);
                  }
                }}
                onSave={handleSaveLandingConfig}
                onPreviewPage={(path) => {
                  window.open(path, '_blank');
                }}
              />
            )}

            {/* Bottom Floating Save Bar */}
            <div className="w-full p-4 bg-[#10244A] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-xl mt-6">
              <div className="text-right">
                <h4 className="font-extrabold text-sm">تطبيق الإعدادات والتعديلات الحالية</h4>
                <p className="text-neutral-300 text-xs">اضغط على زر الحفظ لحفظ التغييرات وتطبيقها مباشرة على الموقع الرئيسي للم المنصة.</p>
              </div>

              <button
                onClick={handleSaveLandingConfig}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ تعديلات الصفحة الرئيسية</span>
              </button>
            </div>

          </div>
        </div>
      )}


        {activeTab === 'subscriptions' && renderSubscriptionsTab()}

        {/* TAB 1: Manage Doctors */}
        {activeTab === 'doctors' && (
          <div className="space-y-6 text-right w-full">
            {/* Searching Bar & Trash Bin Icon */}
            <div className="bg-white p-5 rounded-3xl border border-neutral-200/60 shadow-sm flex items-center gap-3">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="ابحث عن طبيب بالاسم، البريد الإلكتروني، أو رقم الهاتف فقط..." 
                  className="w-full px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold text-black focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right pr-12"
                />
                <Search className="absolute top-1/2 right-5 -translate-y-1/2 w-4.5 h-4.5 text-neutral-400" />
              </div>

              {/* Trash Bin Icon / Button */}
              <button
                type="button"
                onClick={() => {
                  setTrashActiveTab('doctors');
                  setIsTrashModalOpen(true);
                }}
                className="relative p-3.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-2xl transition-all flex items-center justify-center cursor-pointer group shrink-0"
                title={`سلة المحذوفات (${deletedDoctors.length} طبيب محذوف)`}
              >
                <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                {deletedDoctors.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {deletedDoctors.length}
                  </span>
                )}
              </button>
            </div>

            {/* Doctors Multi-Criteria Filters Bar */}
            <div className="bg-white p-5 md:p-6 rounded-3xl border border-neutral-200/60 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-[#009bb9]/10 text-[#009bb9] flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-sm text-neutral-900">تصفية وفرز قائمة الأطباء</h4>
                    <p className="text-[11px] text-neutral-400 font-semibold">فلترة دقيقة حسب التخصص، المحافظة/المدينة، وتاريخ التسجيل</p>
                  </div>
                </div>

                {hasActiveDoctorFilters && (
                  <button
                    type="button"
                    onClick={handleResetDoctorFilters}
                    className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>إعادة ضبط الفلاتر</span>
                  </button>
                )}
              </div>

              {/* Grid of 4 Filters (حالة الحساب، التخصص، المحافظة/المدينة، تاريخ التسجيل) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                
                {/* 0. حالة الحساب */}
                <div className="space-y-1.5 text-right">
                  <label className="text-[11px] font-extrabold text-neutral-700 flex items-center gap-1.5 justify-start">
                    <Activity className="w-3.5 h-3.5 text-emerald-600" />
                    <span>حالة الحساب:</span>
                  </label>
                  <div className="relative">
                    <select
                      value={doctorAccountStatusFilter}
                      onChange={(e) => setDoctorAccountStatusFilter(e.target.value as any)}
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 hover:bg-white border rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-right cursor-pointer ${
                        doctorAccountStatusFilter !== 'all' ? 'border-emerald-600 bg-emerald-50/40 font-black text-emerald-800' : 'border-neutral-200'
                      }`}
                    >
                      <option value="all">جميع الحالات</option>
                      <option value="active">نشط ومفعل</option>
                      <option value="trial">فترة تجريبية</option>
                      <option value="expired">منتهي</option>
                    </select>
                  </div>
                </div>

                {/* 1. التخصص */}
                <div className="space-y-1.5 text-right">
                  <label className="text-[11px] font-extrabold text-neutral-700 flex items-center gap-1.5 justify-start">
                    <Stethoscope className="w-3.5 h-3.5 text-[#009bb9]" />
                    <span>التخصص الطبي:</span>
                  </label>
                  <div className="relative">
                    <select
                      value={doctorSpecialtyFilter}
                      onChange={(e) => setDoctorSpecialtyFilter(e.target.value)}
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 hover:bg-white border rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right cursor-pointer ${
                        doctorSpecialtyFilter !== 'all' ? 'border-[#009bb9] bg-[#009bb9]/5 font-black text-[#009bb9]' : 'border-neutral-200'
                      }`}
                    >
                      <option value="all">جميع التخصصات ({availableDoctorSpecialties.length})</option>
                      {availableDoctorSpecialties.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 2. المحافظة / المدينة */}
                <div className="space-y-1.5 text-right">
                  <label className="text-[11px] font-extrabold text-neutral-700 flex items-center gap-1.5 justify-start">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>المحافظة / المدينة:</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={doctorCityFilter}
                      onChange={(e) => setDoctorCityFilter(e.target.value)}
                      placeholder="اكتب اسم المحافظة أو المدينة..."
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 hover:bg-white border rounded-xl text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right ${
                        doctorCityFilter.trim() !== '' ? 'border-amber-500 bg-amber-50/40 font-black text-amber-900' : 'border-neutral-200'
                      }`}
                    />
                    {doctorCityFilter && (
                      <button
                        type="button"
                        onClick={() => setDoctorCityFilter('')}
                        className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
                        title="مسح"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 3. تاريخ التسجيل */}
                <div className="space-y-1.5 text-right">
                  <label className="text-[11px] font-extrabold text-neutral-700 flex items-center gap-1.5 justify-start">
                    <CalendarDays className="w-3.5 h-3.5 text-purple-600" />
                    <span>تاريخ التسجيل:</span>
                  </label>
                  <div className="relative">
                    <select
                      value={doctorDateFilter}
                      onChange={(e) => setDoctorDateFilter(e.target.value as any)}
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 hover:bg-white border rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right cursor-pointer ${
                        doctorDateFilter !== 'all' ? 'border-purple-500 bg-purple-50/40 font-black text-purple-800' : 'border-neutral-200'
                      }`}
                    >
                      <option value="all">الكل (جميع تواريخ التسجيل)</option>
                      <option value="today">اليوم 📅</option>
                      <option value="7days">آخر 7 أيام</option>
                      <option value="30days">آخر 30 يوم</option>
                      <option value="month">هذا الشهر الحالي</option>
                      <option value="year">هذا العام</option>
                      <option value="custom">تحديد نطاق زمني مخصص...</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Sub-row: Custom date range & File download action */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                {/* Custom Date Inputs if 'custom' is selected */}
                {doctorDateFilter === 'custom' && (
                  <div className="flex flex-wrap items-center gap-2 p-3 bg-purple-50/60 border border-purple-200 rounded-2xl">
                    <span className="text-[11px] font-black text-purple-900">تحديد الفترة:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-neutral-600">من:</span>
                      <input 
                        type="date"
                        value={doctorCustomStartDate}
                        onChange={(e) => setDoctorCustomStartDate(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-neutral-600">إلى:</span>
                      <input 
                        type="date"
                        value={doctorCustomEndDate}
                        onChange={(e) => setDoctorCustomEndDate(e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}

                {/* PDF File Download Button with Icon Only */}
                <div className={`flex items-center gap-3 ${doctorDateFilter !== 'custom' ? 'w-full justify-between' : 'justify-end'}`}>
                  {doctorDateFilter !== 'custom' && (
                    <span className="text-xs font-bold text-neutral-500">
                      عدد الأطباء المطابقين للفلتر: <strong className="text-neutral-900 font-black">{filteredDoctors.length}</strong> طبيب
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleExportFilteredDoctors}
                    disabled={filteredDoctors.length === 0}
                    className="p-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed text-white rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95 shrink-0"
                    title={`تحميل تقرير الأطباء المفلترين كملف PDF (${filteredDoctors.length} طبيب)`}
                    aria-label="تحميل تقرير PDF"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Table list */}
            <div className="bg-white rounded-3xl border border-neutral-200/60 overflow-visible shadow-sm">
              <div className="p-6 border-b border-neutral-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-neutral-50/50 rounded-t-3xl">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-extrabold text-neutral-600 bg-neutral-100 border border-neutral-200 px-3 py-1 rounded-full">
                    معروض: {Math.min(visibleDoctorsCount, filteredDoctors.length)} من إجمالي {filteredDoctors.length} طبيب
                  </span>
                  {hasActiveDoctorFilters && (
                    <span className="text-[10px] font-extrabold text-[#009bb9] bg-[#009bb9]/10 px-2.5 py-0.5 rounded-full">
                      مفلتر
                    </span>
                  )}
                </div>
                <h3 className="font-extrabold text-sm text-neutral-900">قائمة وبيانات الأطباء في النظام</h3>
              </div>

              <div className="divide-y divide-neutral-100">
                {filteredDoctors.length === 0 ? (
                  <div className="p-16 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto text-xl">
                      🔍
                    </div>
                    <div className="text-neutral-600 font-extrabold text-xs">لا توجد نتائج مطابقة لشروط البحث والفلترة المحددة.</div>
                    {hasActiveDoctorFilters && (
                      <button
                        type="button"
                        onClick={handleResetDoctorFilters}
                        className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-extrabold hover:bg-neutral-800 transition-all cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>إلغاء جميع الفلاتر</span>
                      </button>
                    )}
                  </div>
                ) : (
                  filteredDoctors.slice(0, visibleDoctorsCount).map(doc => {
                    const isWhiteLabel = doc.whiteLabel ?? false;
                    const isDocActive = doc.isActiveSubscription === true && doc.approvalStatus !== 'suspended' && doc.status !== 'suspended';
                    const mainLocation = doc.branches?.[0]?.address || doc.address || '';
                    const isExpanded = expandedDoctorIds[doc.id] ?? false;

                    return (
                      <div key={doc.id} className="border-b border-neutral-100 bg-white last:border-0 hover:bg-neutral-50/40 transition-colors">
                        
                        {/* Main row info */}
                        <div className="p-4 sm:p-5 flex flex-col gap-3">
                          
                          <div className="flex items-center justify-between gap-4 flex-wrap">
                            {/* Right Side: Doctor Avatar, Name, Specialty, Status, 3 Dots Menu, and Downward Arrow */}
                            <div className="flex items-center gap-3.5 flex-wrap">
                              {/* Doctor Avatar */}
                              <img 
                                src={doc.avatar} 
                                alt={doc.name} 
                                className="w-12 h-12 rounded-2xl object-cover border border-neutral-200 shrink-0 shadow-xs"
                              />

                              <div className="space-y-1">
                                <div className="flex items-center gap-2.5 flex-wrap">
                                  {/* Doctor Name */}
                                  <h4 className="font-black text-sm text-neutral-900">{doc.name}</h4>

                                  {/* Expand / Collapse Toggle Arrow Button next to Name */}
                                  <button
                                    type="button"
                                    onClick={(e) => toggleExpandDoctor(doc.id, e)}
                                    className={`p-1.5 rounded-xl border transition-all flex items-center gap-1 text-xs font-extrabold cursor-pointer ${
                                      isExpanded 
                                        ? 'bg-[#10244A] text-white border-[#10244A]' 
                                        : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200'
                                    }`}
                                    title={isExpanded ? 'إخفاء البيانات' : 'عرض البيانات'}
                                    aria-label="عرض أو إخفاء بيانات الطبيب"
                                  >
                                    <span className="text-[10px]">التفاصيل</span>
                                    <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                  </button>

                                  {/* Specialty Badge */}
                                  {doc.specialty && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                                      🩺 {normalizeSpecialtyToArabic(doc.specialty)}
                                    </span>
                                  )}

                                  {/* Account Status Badge */}
                                  {(() => {
                                    const isSuspended = doc.approvalStatus === 'suspended' || doc.status === 'suspended';
                                    const expDate = getDoctorExpiryDate(doc);
                                    const isExpired = expDate < new Date() || (!doc.isActiveSubscription && !doc.isTrial);

                                    if (isSuspended) {
                                      return (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                                          موقوف
                                        </span>
                                      );
                                    }
                                    if (isExpired) {
                                      return (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                                          منتهي
                                        </span>
                                      );
                                    }
                                    if (doc.isActiveSubscription && doc.isPaidSubscription) {
                                      return (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                          نشط ومفعل
                                        </span>
                                      );
                                    }
                                    if (doc.isTrial || !doc.isPaidSubscription) {
                                      return (
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                                          فترة تجريبية
                                        </span>
                                      );
                                    }
                                    return null;
                                  })()}

                                  {/* 3 Dots Actions Menu Button */}
                                  <div className="relative doctor-actions-menu shrink-0 inline-block mr-1">
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setOpenDropdownDocId(openDropdownDocId === doc.id ? null : doc.id);
                                      }}
                                      className={`p-1.5 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
                                        openDropdownDocId === doc.id 
                                          ? 'bg-[#10244A] text-white border-[#10244A] shadow-xs' 
                                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                                      }`}
                                      title="خيارات وإجراءات الطبيب"
                                      aria-label="قائمة الخيارات"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </button>

                                    {/* Dropdown Menu Popup */}
                                    {openDropdownDocId === doc.id && (
                                      <div 
                                        onClick={(e) => e.stopPropagation()}
                                        className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl border border-neutral-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 text-right divide-y divide-neutral-100"
                                      >
                                        <div className="py-1">
                                          {/* 1. عرض البروفايل */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenDropdownDocId(null);
                                              handleViewProfile(doc.nameEn);
                                            }}
                                            className="w-full px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-50 hover:text-[#009bb9] flex items-center justify-between gap-2 transition-colors cursor-pointer text-right"
                                          >
                                            <span>عرض البروفايل</span>
                                            <ExternalLink className="w-3.5 h-3.5 text-[#009bb9]" />
                                          </button>

                                          {/* 2. دخول كطبيب */}
                                          {onLoginAsDoctor && (
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setOpenDropdownDocId(null);
                                                onLoginAsDoctor(doc.id);
                                              }}
                                              className="w-full px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between gap-2 transition-colors cursor-pointer text-right"
                                            >
                                              <span>دخول كطبيب</span>
                                              <Shield className="w-3.5 h-3.5 text-emerald-600" />
                                            </button>
                                          )}

                                          {/* 3. توثيق الحساب / إلغاء التوثيق */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenDropdownDocId(null);
                                              handleToggleVerification(doc.id);
                                            }}
                                            className={`w-full px-3.5 py-2 text-xs font-bold flex items-center justify-between gap-2 transition-colors cursor-pointer text-right ${
                                              Boolean(doc.isVerified)
                                                ? 'text-amber-700 hover:bg-amber-50'
                                                : 'text-blue-600 hover:bg-blue-50'
                                            }`}
                                          >
                                            <span>{Boolean(doc.isVerified) ? 'إلغاء التوثيق (إخفاء الشارة)' : 'توثيق الطبيب (الشارة الزرقاء)'}</span>
                                            <ShieldCheck className={`w-3.5 h-3.5 ${Boolean(doc.isVerified) ? 'text-amber-500' : 'text-blue-500'}`} />
                                          </button>

                                          {/* 4. إخفاء علامة الحقوق / إظهار علامة الحقوق */}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenDropdownDocId(null);
                                              handleToggleWhiteLabel(doc.id);
                                            }}
                                            className="w-full px-3.5 py-2 text-xs font-bold text-neutral-700 hover:bg-purple-50 hover:text-purple-700 flex items-center justify-between gap-2 transition-colors cursor-pointer text-right"
                                          >
                                            <span>{isWhiteLabel ? 'إظهار علامة الحقوق' : 'إخفاء علامة الحقوق'}</span>
                                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                          </button>
                                        </div>

                                        {/* 5. حذف */}
                                        <div className="pt-1">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenDropdownDocId(null);
                                              handleRemoveDoctor(doc.id);
                                            }}
                                            className="w-full px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center justify-between gap-2 transition-colors cursor-pointer text-right"
                                          >
                                            <span>حذف</span>
                                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {doc.jobTitle && (
                                  <div className="text-xs text-neutral-400 font-semibold text-right">
                                    {doc.jobTitle.split('-')[0]}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Expanded Details Section (Shown under doctor name when arrow is clicked) */}
                          {isExpanded && (
                            <div className="mt-2 pt-3 border-t border-neutral-100 bg-neutral-50/80 p-3.5 rounded-2xl animate-in fade-in slide-in-from-top-1 duration-200">
                              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-neutral-700 font-semibold">
                                {doc.phone && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <span>📱</span>
                                    <span>رقم الهاتف: {doc.phone}</span>
                                  </span>
                                )}
                                {doc.email && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <span>📧</span>
                                    <span>البريد: {doc.email}</span>
                                  </span>
                                )}
                                {doc.specialty && (
                                  <span className="inline-flex items-center gap-1.5">
                                    <span>🩺</span>
                                    <span>التخصص: {normalizeSpecialtyToArabic(doc.specialty)}</span>
                                  </span>
                                )}
                                {mainLocation && (
                                  <span className="inline-flex items-center gap-1.5 text-amber-700">
                                    <span>📍</span>
                                    <span>العنوان: {mainLocation}</span>
                                  </span>
                                )}
                                {doc.registeredAt && (
                                  <span className="inline-flex items-center gap-1.5 text-neutral-500">
                                    <span>📅</span>
                                    <span>تاريخ التسجيل: {doc.registeredAt.slice(0, 10)}</span>
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                        </div>

                      </div>
                    );
                  })
                )}
              </div>

              {/* Show More Button under the 5 doctors */}
              {filteredDoctors.length > 5 && (
                <div className="p-4 bg-neutral-50/70 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-neutral-500 font-bold">
                    عرض {Math.min(visibleDoctorsCount, filteredDoctors.length)} من إجمالي {filteredDoctors.length} طبيب
                  </span>

                  <div className="flex items-center gap-2">
                    {visibleDoctorsCount < filteredDoctors.length ? (
                      <button
                        type="button"
                        onClick={() => setVisibleDoctorsCount(prev => prev + 5)}
                        className="px-5 py-2.5 bg-[#10244A] hover:bg-[#1a3668] text-white rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer shadow-xs active:scale-95"
                      >
                        <ChevronDown className="w-4 h-4" />
                        <span>عرض المزيد (+5 أطباء)</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setVisibleDoctorsCount(5)}
                        className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <span>عرض أول 5 أطباء فقط</span>
                      </button>
                    )}

                    {visibleDoctorsCount < filteredDoctors.length && (
                      <button
                        type="button"
                        onClick={() => setVisibleDoctorsCount(filteredDoctors.length)}
                        className="px-3.5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        عرض الكل ({filteredDoctors.length})
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB: Doctor Dashboard Notifications */}
        {activeTab === 'banners' && (
          <div className="space-y-6">
            
            {/* Header & Create Notification Button Card */}
            <div className="bg-gradient-to-l from-amber-500/10 via-amber-50/60 to-white p-6 md:p-8 rounded-3xl border border-amber-200/80 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-right">
              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-end">
                  <span className="px-3 py-1 bg-amber-500 text-white text-xs font-black rounded-full shadow-xs">
                    {currentBanners.filter(b => b.isActive).length} إشعارات مفعلة
                  </span>
                  <h2 className="text-xl font-black text-neutral-900 flex items-center gap-2">
                    <span>إشعارات الأطباء</span>
                    <Megaphone className="w-5 h-5 text-amber-600" />
                  </h2>
                </div>
                <p className="text-xs text-neutral-600 font-semibold max-w-2xl leading-relaxed">
                  أنشئ وإدارة الإشعارات والتنبيهات التي تظهر للأطباء للإعلان عن التحديثات، المميزات الجديدة، العروض والخصومات، أو إشعارات النظام.
                </p>
              </div>

              <button
                onClick={handleOpenAddBanner}
                className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-black text-xs rounded-2xl transition-all shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>إرسال إشعار جديد</span>
              </button>
            </div>

            {/* Notifications List */}
            {currentBanners.length === 0 ? (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-12 text-center space-y-3 shadow-xs">
                <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black">
                  📢
                </div>
                <h4 className="font-extrabold text-sm text-neutral-800">لا توجد إشعارات مضافة حالياً</h4>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  قم بإنشاء أول إشعار ليظهر للأطباء.
                </p>
                <button
                  onClick={handleOpenAddBanner}
                  className="mt-2 px-4 py-2 bg-neutral-900 text-white font-extrabold text-xs rounded-xl shadow-xs"
                >
                  + إرسال إشعار الآن
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {currentBanners
                  .sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return (a.priority || 0) - (b.priority || 0);
                  })
                  .map((b, idx) => {
                    const badgeColorClasses = 'bg-amber-100 text-amber-800';
                    return (
                      <div 
                        key={b.id} 
                        className={`bg-white rounded-2xl border p-4 shadow-sm hover:shadow-md transition-all space-y-4 text-right ${
                          b.isActive ? 'border-neutral-200' : 'border-neutral-200 opacity-60'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                          
                          {/* Banner Info */}
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-xl shadow-xs ${badgeColorClasses}`}>
                              {b.imageUrl ? (
                                <img src={b.imageUrl} alt={b.title} loading="lazy" decoding="async" className="w-full h-full object-cover rounded-2xl" />
                              ) : (
                                <span>
                                  {b.icon === 'crown' ? '👑' : b.icon === 'gift' ? '🎁' : b.icon === 'bell' ? '🔔' : b.icon === 'alert' ? '⚠️' : b.icon === 'star' ? '⭐' : '✨'}
                                </span>
                              )}
                            </div>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2 justify-end">
                                

                                <span className={`px-2.5 py-0.5 text-[10px] font-black rounded-full ${b.isActive ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-neutral-200 text-neutral-700'}`}>
                                  {b.isActive ? '🟢 مفعل' : '⚪ مسودة'}
                                </span>
                                <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold rounded-full">
                                  🎯 المستهدفون: {
                                    b.targetAudience === 'all' ? 'جميع الأطباء' :
                                    b.targetAudience === 'specific_specialty' ? `تخصص: ${b.targetSpecialty || 'غير محدد'}` :
                                    b.targetAudience === 'active' ? 'نشط ومفعل' :
                                    b.targetAudience === 'trial' ? 'فترة تجريبية' :
                                    b.targetAudience === 'expired' ? 'منتهي' :
                                    b.targetAudience === 'whitelabel_enabled' ? 'لديهم علامة الحقوق' :
                                    b.targetAudience === 'whitelabel_disabled' ? 'ليس لديهم علامة الحقوق' :
                                    `أطباء محددون (${b.targetDoctorIds?.length || 0})`
                                  }
                                </span>
                                {b.sentDate && (
                                  <span className="px-2.5 py-0.5 bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10px] font-bold rounded-full">
                                    تاريخ الإرسال: {new Date(b.sentDate).toLocaleDateString('ar-EG')}
                                  </span>
                                )}
                                <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold rounded-full">
                                  👥 المستلمين: {b.recipientCount || 0}
                                </span>
                                <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold rounded-full">
                                  👀 القراءات: {b.readCount || 0}
                                </span>
                              </div>

                              <h3 className="font-extrabold text-base text-neutral-900 pt-1">{b.title}</h3>
                              <p className="text-xs text-neutral-600 leading-relaxed font-semibold">{b.description}</p>


                            </div>
                          </div>

                          {/* Controls & Actions */}
                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            {/* Toggle Active */}
                            <button
                              onClick={() => handleToggleBannerActive(b.id)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                b.isActive ? 'bg-amber-100 hover:bg-amber-200 text-amber-900' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              {b.isActive ? 'إيقاف الإشعار' : 'تفعيل الإشعار'}
                            </button>

                            {/* Toggle Pin */}
                            <button
                              onClick={() => handleToggleBannerPinned(b.id)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                                b.isPinned ? 'bg-rose-100 text-rose-800 hover:bg-rose-200' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                              }`}
                              title={b.isPinned ? 'إلغاء التثبيت' : 'تثبيت الإشعار في الأعلى'}
                            >
                              <Pin className="w-3.5 h-3.5" />
                              <span>{b.isPinned ? 'إلغاء التثبيت' : 'تثبيت'}</span>
                            </button>

                            {/* Up / Down Priority */}
                            <button
                              onClick={() => handleMoveBannerPriority(b.id, 'up')}
                              disabled={idx === 0}
                              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg disabled:opacity-30 cursor-pointer"
                              title="رفع الأولوية للأعلى"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMoveBannerPriority(b.id, 'down')}
                              disabled={idx === currentBanners.length - 1}
                              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg disabled:opacity-30 cursor-pointer"
                              title="تخفيض الأولوية للأسفل"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEditBanner(b)}
                              className="px-3 py-1.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>تعديل</span>
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteBanner(b.id)}
                              className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all cursor-pointer"
                              title="حذف الإشعار"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>
                      </div>
                    );
                  })}
              </div>
            )}

          </div>
        )}

        {/* TAB 3: Settings & specialties */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-6 rounded-3xl border border-neutral-200/60 shadow-sm">
              <h2 className="text-xl font-black text-[#10244A] flex items-center gap-3">
                <Mail className="w-6 h-6" />
                <span>رسائل تواصل الزوار</span>
              </h2>
              <div className="px-4 py-2 bg-neutral-100 rounded-xl text-sm font-bold text-neutral-700">
                إجمالي الرسائل: {contactMessages.length}
              </div>
            </div>

            <div className="space-y-4">
              {contactMessages.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-neutral-200/60 shadow-sm text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-8 h-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-2">لا توجد رسائل</h3>
                  <p className="text-neutral-500 font-medium">لم يقم أحد بالتواصل معك بعد عبر نموذج التواصل.</p>
                </div>
              ) : (
                contactMessages.map(msg => (
                  <div key={msg.id} className={`bg-white rounded-3xl border ${msg.read ? 'border-neutral-200/60' : 'border-[#003B7A] ring-1 ring-[#003B7A]/20'} p-6 md:p-8 shadow-sm transition-all`}>
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-100 pb-4 mb-4 text-right">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 justify-end flex-row-reverse">
                          <h3 className="text-lg font-black text-neutral-900">{msg.name}</h3>
                          {!msg.read && <span className="bg-[#003B7A] text-white text-[10px] font-bold px-2 py-1 rounded-md">جديدة</span>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-neutral-600 font-semibold justify-end flex-row-reverse">
                          <span dir="ltr">{msg.phone}</span>
                          <span>•</span>
                          <span dir="ltr">{msg.email}</span>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-neutral-400 text-right shrink-0">
                        {new Date(msg.createdAt).toLocaleString('ar-EG', { dateStyle: 'long', timeStyle: 'short' })}
                      </div>
                    </div>
                    
                    <div className="bg-neutral-50 p-4 rounded-2xl text-right">
                      <p className="text-neutral-800 text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-6 justify-between">
                      {/* Left: Quick Reply Actions */}
                      <div className="flex items-center gap-2">
                        {msg.phone && (
                          <a
                            href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`مرحباً أستاذ ${msg.name}، بخصوص رسالتكم إلى إدارة المنصة الطبية:`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                          >
                            <span>رد واتساب</span>
                          </a>
                        )}
                        {msg.email && (
                          <a
                            href={`mailto:${msg.email}?subject=${encodeURIComponent('رد على رسالتكم - منصة دكتور بروفايل')}&body=${encodeURIComponent(`مرحباً أستاذ ${msg.name}،\n\nبخصوص رسالتكم الكريمة:\n"${msg.message}"\n\n`)}`}
                            className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                          >
                            <span>رد إيميل</span>
                          </a>
                        )}
                      </div>

                      {/* Right: Management Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={async () => {
                            if(confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
                              setContactMessages(prev => {
                                const filtered = prev.filter(m => m.id !== msg.id);
                                try {
                                  localStorage.setItem('dr_admin_contact_messages', JSON.stringify(filtered));
                                } catch {}
                                return filtered;
                              });
                              await deleteContactMessageFromDb(msg.id);
                            }
                          }}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          حذف الرسالة
                        </button>
                        {!msg.read ? (
                          <button
                            onClick={async () => {
                              const updated = { ...msg, read: true };
                              setContactMessages(prev => {
                                const list = prev.map(m => m.id === msg.id ? updated : m);
                                try {
                                  localStorage.setItem('dr_admin_contact_messages', JSON.stringify(list));
                                } catch {}
                                return list;
                              });
                              await saveContactMessageInDb(updated);
                            }}
                            className="px-5 py-2 bg-[#10244A] hover:bg-[#091A3A] text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            تحديد كمقروءة
                          </button>
                        ) : (
                          <button
                            onClick={async () => {
                              const updated = { ...msg, read: false };
                              setContactMessages(prev => {
                                const list = prev.map(m => m.id === msg.id ? updated : m);
                                try {
                                  localStorage.setItem('dr_admin_contact_messages', JSON.stringify(list));
                                } catch {}
                                return list;
                              });
                              await saveContactMessageInDb(updated);
                            }}
                            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                          >
                            تحديد كغير مقروءة
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8">
            
            {/* 1. Admin Credentials & Security Card (إعادة تعيين اسم المستخدم وكلمة السر لمدير المنصة) */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8 shadow-sm text-right space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-[#10244A] text-white flex items-center justify-center shadow-md shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-neutral-900">إعادة تعيين اسم المستخدم وكلمة السر لمدير المنصة</h2>
                    <p className="text-neutral-500 text-xs font-semibold mt-0.5">
                      تحديث بيانات الدخول الخاصة بحساب المشرف الرئيسي والأدمن لتأمين لوحة التحكم
                    </p>
                  </div>
                </div>

                <div className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>الحساب الرئيسي مفعل</span>
                </div>
              </div>

              {/* Current Status Info Box */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 text-neutral-700">
                  <Mail className="w-4 h-4 text-[#10244A]" />
                  <span>اسم المستخدم / البريد الحالي:</span>
                  <span className="font-mono font-black text-neutral-900 dir-ltr select-all bg-white px-2.5 py-1 rounded-lg border border-neutral-200">
                    {landingConfig?.adminCredentials?.email || 'hassanhamdy@gmail.com'}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 font-medium">
                  🔒 الصلاحية: مدير كامل الصلاحيات (Super Admin)
                </span>
              </div>

              {/* Feedback Alerts */}
              {adminCredsSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-3 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{adminCredsSuccessMsg}</span>
                </div>
              )}

              {adminCredsErrorMsg && (
                <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>{adminCredsErrorMsg}</span>
                </div>
              )}

              {/* Edit Credentials Form */}
              <form onSubmit={handleSaveAdminCredentials} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Admin Username / Email */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-extrabold text-neutral-800 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#10244A]" />
                      <span>اسم المستخدم / البريد الإلكتروني الجديد للمدير:</span>
                    </label>
                    <input 
                      type="email"
                      value={adminUsernameInput}
                      onChange={(e) => setAdminUsernameInput(e.target.value)}
                      placeholder="hassanhamdy@gmail.com"
                      required
                      className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#10244A] focus:bg-white transition-all text-left dir-ltr"
                    />
                    <span className="text-[11px] text-neutral-400 font-medium block">
                      * هذا هو البريد الذي ستستخدمه لتسجيل الدخول كأدمن للمنصة.
                    </span>
                  </div>

                  {/* Current Password for confirmation */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="block text-xs font-extrabold text-neutral-800 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-neutral-500" />
                      <span>كلمة المرور الحالية (للتأكيد عند التغيير):</span>
                    </label>
                    <div className="relative">
                      <input 
                        type={showAdminCurrentPass ? "text" : "password"}
                        value={adminCurrentPasswordInput}
                        onChange={(e) => setAdminCurrentPasswordInput(e.target.value)}
                        placeholder="أدخل كلمة المرور الحالية للتأكيد..."
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#10244A] focus:bg-white transition-all text-left dir-ltr pl-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminCurrentPass(!showAdminCurrentPass)}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-1"
                        title={showAdminCurrentPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      >
                        {showAdminCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold text-neutral-800 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#10244A]" />
                      <span>كلمة المرور الجديدة:</span>
                    </label>
                    <div className="relative">
                      <input 
                        type={showAdminNewPass ? "text" : "password"}
                        value={adminNewPasswordInput}
                        onChange={(e) => setAdminNewPasswordInput(e.target.value)}
                        placeholder="اكتب كلمة المرور الجديدة (6 خانات على الأقل)..."
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#10244A] focus:bg-white transition-all text-left dir-ltr pl-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminNewPass(!showAdminNewPass)}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-1"
                        title={showAdminNewPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      >
                        {showAdminNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium block">
                      * اتركها فارغة إذا كنت ترغب فقط في تعديل اسم المستخدم / البريد.
                    </span>
                  </div>

                  {/* Confirm New Password */}
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold text-neutral-800 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#10244A]" />
                      <span>تأكيد كلمة المرور الجديدة:</span>
                    </label>
                    <div className="relative">
                      <input 
                        type={showAdminConfirmPass ? "text" : "password"}
                        value={adminConfirmPasswordInput}
                        onChange={(e) => setAdminConfirmPasswordInput(e.target.value)}
                        placeholder="أعد كتابة كلمة المرور الجديدة..."
                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#10244A] focus:bg-white transition-all text-left dir-ltr pl-11"
                      />
                      <button
                        type="button"
                        onClick={() => setShowAdminConfirmPass(!showAdminConfirmPass)}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer p-1"
                        title={showAdminConfirmPass ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                      >
                        {showAdminConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {adminNewPasswordInput && adminConfirmPasswordInput && (
                      <span className={`text-[11px] font-bold block ${adminNewPasswordInput === adminConfirmPasswordInput ? 'text-emerald-600' : 'text-red-500'}`}>
                        {adminNewPasswordInput === adminConfirmPasswordInput ? '✓ كلمتا المرور متطابقتان' : '✗ كلمتا المرور غير متطابقتين'}
                      </span>
                    )}
                  </div>

                </div>

                {/* Submit Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => {
                      setAdminUsernameInput(currentAdminEmail);
                      setAdminCurrentPasswordInput('');
                      setAdminNewPasswordInput('');
                      setAdminConfirmPasswordInput('');
                      setAdminCredsErrorMsg(null);
                      setAdminCredsSuccessMsg(null);
                    }}
                    className="w-full sm:w-auto px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-extrabold text-xs rounded-2xl transition-all cursor-pointer"
                  >
                    تفريغ وإلغاء
                  </button>

                  <button
                    type="submit"
                    disabled={isAdminCredsSaving}
                    className="w-full sm:w-auto px-8 py-3 bg-[#10244A] hover:bg-[#091A3A] text-white font-black text-xs rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isAdminCredsSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>جاري الحفظ والتأمين...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>حفظ وتحديث بيانات الدخول</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* 2. Image Uploader Section */}
            <div className="bg-white rounded-3xl border border-neutral-200/80 p-6 md:p-8 shadow-sm text-right space-y-6">
              <h2 className="text-lg font-black text-neutral-900">رفع الصور (عالية الجودة)</h2>
              <ImageUploader onUploadSuccess={(url) => setUploadedImageUrl(url)} />
              {uploadedImageUrl && (
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
                  <p className="text-xs font-bold text-neutral-700">رابط الصورة المرفوعة:</p>
                  <input type="text" readOnly value={uploadedImageUrl} className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono" />
                </div>
              )}
            </div>

            {/* 2. Add Medical Specialty */}
            <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm text-right space-y-6">
              <h2 className="text-lg font-black text-black">إضافة تخصص طبي جديد للنظام</h2>
              
              <form onSubmit={handleAddSpecialty} className="flex flex-col sm:flex-row items-center gap-4 text-right">
                <button 
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-[#10244A] hover:bg-[#091A3A] text-white font-extrabold text-xs rounded-full transition-all shadow-sm"
                >
                  إضافة التخصص الطبي
                </button>
                <input 
                  type="text" 
                  value={newSpecialtyName}
                  onChange={(e) => setNewSpecialtyName(e.target.value)}
                  placeholder="مثال: طب وجراحة الأورام"
                  className="flex-1 w-full px-5 py-3 bg-neutral-50 border border-neutral-200 rounded-full text-xs font-semibold text-black focus:outline-none focus:border-black transition-all text-right"
                />
              </form>
            </div>

            {/* 3. List of active specialties */}
            <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm text-right">
              <h3 className="font-extrabold text-sm text-neutral-900 mb-4">التخصصات الطبية المعولمة حالياً في النظام</h3>
              <div className="flex flex-wrap gap-3 justify-start">
                {localSpecialties.map((spec) => (
                  <span 
                    key={spec.id}
                    className="px-3.5 py-1.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200/80 rounded-full text-xs font-bold text-neutral-800 flex items-center gap-2 transition-all shadow-2xs"
                  >
                    <span>🩺 {spec.name}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSpecialty(spec.id)}
                      className="p-0.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                      title="حذف هذا التخصص"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODAL 1: Rejection Reason Dialog */}
      {rejectionModalDocId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl border border-neutral-200/80 max-w-lg w-full p-6 text-right shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <button 
                onClick={() => setRejectionModalDocId(null)}
                className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-sm font-black text-red-700 flex items-center gap-2">
                <span>⚠️</span> كتابة سبب رفض طلب انضمام الطبيب
              </h3>
            </div>

            <p className="text-xs font-semibold text-neutral-500 leading-relaxed">
              يرجى تحديد وكتابة سبب الرفض بدقة ووضوح. سيظهر هذا السبب مباشرة للطبيب داخل لوحة تحكمه الخاصة به فور دخوله ليتمكن من مراجعة بياناته، تعديلها، ثم إعادة إرسال الطلب للمراجعة والتدقيق مجدداً.
            </p>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-700">سبب الرفض الموجه للطبيب:</label>
              <textarea
                rows={4}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="مثال: يرجى كتابة المؤهل العلمي بشكل كامل وإضافة رقم ترخيص مزاولة المهنة ليتسنى لنا تفعيل الحساب."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-red-500 focus:bg-white transition-all text-right"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
              <button
                onClick={() => setRejectionModalDocId(null)}
                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-extrabold rounded-xl transition-colors"
              >
                إلغاء التراجع
              </button>
              <button
                onClick={handleSaveRejection}
                className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl transition-colors shadow-sm"
              >
                حفظ سبب الرفض ورفض الطبيب
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Comprehensive Doctor Data Editing Form */}
      {editingDoctorId && editFormData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-neutral-200/80 max-w-2xl w-full p-6 text-right shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <button 
                onClick={() => { setEditingDoctorId(null); setEditFormData(null); }}
                className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-black text-[#10244A] flex items-center gap-2">
                🩺 مراجعة وتعديل بيانات الطبيب واشتراكه
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Field 1: Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">الاسم بالكامل:</label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 2: Job Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">المسمى الوظيفي والدرجة العلمية:</label>
                <input
                  type="text"
                  value={editFormData.jobTitle}
                  onChange={(e) => setEditFormData({ ...editFormData, jobTitle: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 3: Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">البريد الإلكتروني:</label>
                <input
                  type="email"
                  value={editFormData.email}
                  onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 4: Phone */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">رقم الهاتف الأساسي:</label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 5: Whatsapp */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">رقم الواتساب:</label>
                <input
                  type="text"
                  value={editFormData.whatsapp || ''}
                  onChange={(e) => setEditFormData({ ...editFormData, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 6: Specialty */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">التخصص الطبي الرئيسي:</label>
                <input
                  type="text"
                  value={editFormData.specialty}
                  onChange={(e) => setEditFormData({ ...editFormData, specialty: e.target.value })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 7: Subscription type dropdown */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">باقة الاشتراك المعتمدة:</label>
                <select
                  value={editFormData.subscriptionType}
                  onChange={(e) => {
                    const type = e.target.value as '6months' | 'annual';
                    setEditFormData({
                      ...editFormData,
                      subscriptionType: type
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                >
                  <option value="annual">الباقة السنوية (سنة كاملة) 👑</option>
                  <option value="6months">باقة 6 أشهر ⏳</option>
                </select>
              </div>

              {/* Field 8: Verification Badge */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">توثيق الطبيب (الشارة الزرقاء الرسمية):</label>
                <select
                  value={editFormData.isVerified ? 'true' : 'false'}
                  onChange={(e) => setEditFormData({ ...editFormData, isVerified: e.target.value === 'true' })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-blue-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                >
                  <option value="true">✓ موثق بشارة التوثيق الزرقاء المعتمدة</option>
                  <option value="false">✘ غير موثق (بدون شارة توثيق)</option>
                </select>
              </div>

              {/* Field 9: White Label */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">إزالة العلامة التجارية (White Label):</label>
                <select
                  value={editFormData.whiteLabel ? 'true' : 'false'}
                  onChange={(e) => setEditFormData({ ...editFormData, whiteLabel: e.target.value === 'true' })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-purple-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                >
                  <option value="true">✓ إزالة شعار ورابط المنصة (White Label نشط)</option>
                  <option value="false">✘ إظهار شعار المنصة في فوتر بروفايل الطبيب</option>
                </select>
              </div>

              {/* Field 10: Subscription Active */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">حالة نشاط الاشتراك الإداري:</label>
                <select
                  value={editFormData.isActiveSubscription ? 'true' : 'false'}
                  onChange={(e) => setEditFormData({ ...editFormData, isActiveSubscription: e.target.value === 'true' })}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right"
                >
                  <option value="true">🟢 نشط وصالح للتشغيل الفوري</option>
                  <option value="false">🔴 موقوف / منتهي الصلاحية</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100">
              <button
                onClick={() => { setEditingDoctorId(null); setEditFormData(null); }}
                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-extrabold rounded-xl transition-colors"
              >
                تراجع وإلغاء
              </button>
              <button
                onClick={handleSaveDoctorEdit}
                className="px-6 py-2.5 bg-[#10244A] hover:bg-[#091A3A] text-white text-xs font-black rounded-xl transition-colors shadow-sm"
              >
                حفظ التغييرات الجديدة
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Doctor Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-neutral-200/80 max-w-2xl w-full p-6 text-right shadow-2xl space-y-6 my-8 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <button 
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="p-1 hover:bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <h3 className="text-base font-black text-[#10244A] flex items-center gap-2">
                <span>📢</span>
                <span>{editingBannerId ? 'تعديل الإشعار' : 'إرسال إشعار جديد'}</span>
              </h3>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              {/* Field 1: Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">عنوان الإشعار <span className="text-red-500">*</span>:</label>
                <input
                  type="text"
                  required
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  placeholder="مثال: 🎉 ميزة جديدة: نظام الحجوزات المتقدم عبر الواتساب!"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 2: Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">نص الإشعار:</label>
                <textarea
                  rows={3}
                  value={bannerDesc}
                  onChange={(e) => setBannerDesc(e.target.value)}
                  placeholder="مثال: يمكنك الآن إضافة وتعيين سكرتيرة لعيادتك..."
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                />
              </div>

              {/* Field 3: Icon */}
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-700">أيقونة الإشعار السريعة:</label>
                <select
                  value={bannerIcon}
                  onChange={(e) => setBannerIcon(e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                >
                  <option value="sparkles">✨ نجوم وتحديثات (Sparkles)</option>
                  <option value="crown">👑 باقة بريميوم (Crown)</option>
                  <option value="bell">🔔 تنبيه وإشعار (Bell)</option>
                  <option value="gift">🎁 عرض وهدية (Gift)</option>
                  <option value="alert">⚠️ تحذير مهم (Alert)</option>
                  <option value="star">⭐ تميز وتقييم (Star)</option>
                </select>
              </div>

              {/* Field 4: Button Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-neutral-700">نص الزر (اختياري):</label>
                  <input
                    type="text"
                    value={bannerButtonText}
                    onChange={(e) => setBannerButtonText(e.target.value)}
                    placeholder="مثال: استعراض التفاصيل"
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-extrabold text-neutral-700">رابط الزر (رابط داخلي أو خارجي):</label>
                  <input
                    type="text"
                    value={bannerButtonUrl}
                    onChange={(e) => setBannerButtonUrl(e.target.value)}
                    placeholder="مثال: https://..."
                    className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                  />
                </div>
              </div>

              {/* Field 7: Target Audience */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-neutral-700">إرسال لكل الأطباء أو فئة محددة:</label>
                <select
                  value={bannerTargetAudience}
                  onChange={(e) => setBannerTargetAudience(e.target.value as any)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500 focus:bg-white transition-all text-right"
                >
                  <option value="all">إرسال لكل الأطباء</option>
                  <option value="specific_specialty">تحديد تخصص معين</option>
                  <option value="specific_doctors">إشعار لطبيب محدد</option>
                  <option value="active">نشط ومفعل</option>
                  <option value="trial">فترة تجريبية</option>
                  <option value="expired">منتهي</option>
                  <option value="whitelabel_enabled">الناس ال عندها علامه الحقوق</option>
                  <option value="whitelabel_disabled">الناس ال معندهاش علامه الحقوق</option>
                </select>

                {bannerTargetAudience === 'specific_specialty' && (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2 text-right">
                    <label className="text-xs font-bold text-neutral-700 block">اكتب التخصص المستهدف:</label>
                    <input
                      type="text"
                      value={bannerTargetSpecialty}
                      onChange={(e) => setBannerTargetSpecialty(e.target.value)}
                      placeholder="مثال: أسنان، أطفال..."
                      className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-amber-500"
                    />
                  </div>
                )}

                {/* Specific Doctors Checklist */}
                {bannerTargetAudience === 'specific_doctors' && (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2 max-h-48 overflow-y-auto text-right">
                    <span className="text-xs font-bold text-neutral-700 block">اختر الأطباء المستهدفين بالإشعار:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {doctors.map(doc => {
                        const isChecked = bannerTargetDoctorIds.includes(doc.id);
                        return (
                          <label key={doc.id} className="flex items-center gap-2 text-xs font-semibold text-neutral-800 cursor-pointer p-1.5 rounded-lg hover:bg-neutral-100">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setBannerTargetDoctorIds([...bannerTargetDoctorIds, doc.id]);
                                } else {
                                  setBannerTargetDoctorIds(bannerTargetDoctorIds.filter(id => id !== doc.id));
                                }
                              }}
                              className="rounded border-neutral-300 text-amber-600 focus:ring-amber-500"
                            />
                            <img src={doc.avatar} alt={doc.name} className="w-6 h-6 rounded-full object-cover border" />
                            <span className="truncate">{doc.name} ({doc.subscriptionType === 'annual' ? 'سنوي' : '6 أشهر'})</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Field 8: Options (Active, Pinned, Priority) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <label className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-extrabold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerIsActive}
                    onChange={(e) => setBannerIsActive(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <span>🟢 الإشعار مفعل حالياً</span>
                </label>

                <label className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-extrabold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannerIsPinned}
                    onChange={(e) => setBannerIsPinned(e.target.checked)}
                    className="w-4 h-4 text-rose-600 rounded"
                  />
                  <span>📌 تثبيت في أعلى القائمة</span>
                </label>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-600">رقم الأولوية (Priority):</label>
                  <input
                    type="number"
                    min={1}
                    value={bannerPriority}
                    onChange={(e) => setBannerPriority(Number(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-center"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-extrabold rounded-xl transition-colors"
                >
                  إلغاء التراجع
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 text-xs font-black rounded-xl transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>إرسال الإشعار</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBSCRIPTION ACTIVATION & PAYMENT METHOD MODAL */}
      {isActivateModalOpen && activatingDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden my-8 text-right p-6 sm:p-8 space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <button
                type="button"
                onClick={() => {
                  setIsActivateModalOpen(false);
                  setActivatingDoctor(null);
                }}
                className="p-2 hover:bg-neutral-100 rounded-xl text-neutral-400 hover:text-neutral-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-right space-y-0.5">
                <h3 className="text-base sm:text-lg font-black text-neutral-900 flex items-center gap-2 justify-end">
                  <span>تفعيل الاشتراك وإصدار الفاتورة</span>
                  <span className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                  </span>
                </h3>
                <p className="text-xs text-neutral-500 font-semibold">
                  حدد طريقة الدفع لتفعيل الحساب وإصدار الفاتورة الإلكترونية المعتمدة للطبيب
                </p>
              </div>
            </div>

            {/* Doctor Info Card */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-3.5">
              <img
                src={activatingDoctor.avatar}
                alt={activatingDoctor.name}
                className="w-12 h-12 rounded-2xl object-cover border border-neutral-200 shadow-2xs shrink-0"
              />
              <div className="space-y-0.5 text-right flex-1">
                <h4 className="text-sm font-black text-neutral-900">{activatingDoctor.name}</h4>
                <p className="text-xs text-neutral-500 font-semibold">
                  {activatingDoctor.jobTitle.split('-')[0]} • 📱 {activatingDoctor.phone}
                </p>
              </div>
            </div>

            {/* Step 1: Duration Selection */}
            <div className="space-y-2">
              <label className="block text-xs font-black text-neutral-800">
                1. مدة وباقة الاشتراك:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedDurationType('annual')}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                    selectedDurationType === 'annual'
                      ? 'border-[#0051A8] bg-blue-50/80 ring-2 ring-[#0051A8]/20 shadow-xs'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedDurationType === 'annual' ? 'border-[#0051A8] bg-[#0051A8]' : 'border-neutral-300'}`}>
                      {selectedDurationType === 'annual' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <span className="text-xs font-black text-neutral-900">سنة كاملة (12 شهر)</span>
                  </div>
                  <div className="mt-2 text-left">
                    <span className="text-xs font-black text-emerald-700">2,500 ج.م</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedDurationType('6months')}
                  className={`p-3.5 rounded-2xl border text-right transition-all cursor-pointer ${
                    selectedDurationType === '6months'
                      ? 'border-[#0051A8] bg-blue-50/80 ring-2 ring-[#0051A8]/20 shadow-xs'
                      : 'border-neutral-200 bg-white hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedDurationType === '6months' ? 'border-[#0051A8] bg-[#0051A8]' : 'border-neutral-300'}`}>
                      {selectedDurationType === '6months' && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                    </span>
                    <span className="text-xs font-black text-neutral-900">6 أشهر (نصف سنوي)</span>
                  </div>
                  <div className="mt-2 text-left">
                    <span className="text-xs font-black text-emerald-700">1,500 ج.م</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Step 2: Payment Method Selection (المحدد الوحيد من قِبل المدير) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-neutral-400 font-bold">حدد الطريقة المستخدمة في التحصيل:</span>
                <label className="block text-xs font-black text-neutral-800">
                  2. طريقة الدفع:
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { id: 'Vodafone Cash' as const, label: 'Vodafone Cash', color: 'border-rose-300 bg-rose-50/40 text-rose-900' },
                  { id: 'Etisalat Cash' as const, label: 'Etisalat Cash', color: 'border-emerald-300 bg-emerald-50/40 text-emerald-900' },
                  { id: 'Orange Cash' as const, label: 'Orange Cash', color: 'border-orange-300 bg-orange-50/40 text-orange-900' },
                  { id: 'WE Pay' as const, label: 'WE Pay', color: 'border-purple-300 bg-purple-50/40 text-purple-900' },
                  { id: 'InstaPay' as const, label: 'InstaPay', color: 'border-indigo-300 bg-indigo-50/40 text-indigo-900', fullWidth: true },
                ].map((method) => {
                  const isSelected = selectedPaymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-3 rounded-xl border text-right transition-all flex items-center justify-between cursor-pointer ${
                        method.fullWidth ? 'sm:col-span-2' : ''
                      } ${
                        isSelected 
                          ? 'border-[#10244A] bg-[#10244A] text-white shadow-xs' 
                          : 'border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-white bg-white' : 'border-neutral-300'}`}>
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#10244A]"></span>}
                        </span>
                        <span className="text-xs font-black">{method.label}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isSelected ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                        ○ محفظة إلكترونية
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notice */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl text-xs text-blue-950 leading-relaxed font-semibold">
              💡 <strong>توليد تلقائي:</strong> بعد اختيار وسيلة الدفع والضغط على زر التفعيل، يقوم النظام تلقائياً بتحديد رقم الفاتورة، تاريخ اليوم، المبلغ، والحالة (مدفوعة ومكتملة)، وتفعيل حساب الطبيب وإرسال الفاتورة الرسمية له فوراً في لوحة تحكمه.
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
              <button
                type="button"
                onClick={() => {
                  setIsActivateModalOpen(false);
                  setActivatingDoctor(null);
                }}
                className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-black rounded-xl transition-all cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleConfirmActivation}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>تأكيد وتفعيل الاشتراك فوراً</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* INVOICE PREVIEW & PRINT MODAL */}
      <InvoiceModal
        invoice={selectedInvoiceForModal}
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedInvoiceForModal(null);
        }}
      />

      {/* TRASH MODAL (سلة المحذوفات) */}
      {isTrashModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-right shadow-2xl animate-scaleUp max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl border border-red-200">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-neutral-900">سلة محذوفات الأطباء</h3>
                  <p className="text-xs text-neutral-500 font-semibold">قائمة الأطباء المحذوفين (يمكنك استعادة الطبيب أو حذفه نهائياً)</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsTrashModalOpen(false)}
                className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 min-h-[200px]">
              {deletedDoctors.length === 0 ? (
                <div className="py-16 text-center text-neutral-400 space-y-2">
                  <Users className="w-10 h-10 mx-auto text-neutral-300" />
                  <p className="text-xs font-bold">لا يوجد أطباء في سلة المحذوفات</p>
                </div>
              ) : (
                deletedDoctors.map(doc => (
                  <div key={doc.id} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <h4 className="font-black text-sm text-neutral-900">{doc.name}</h4>
                        <p className="text-xs text-neutral-500 font-semibold">{doc.jobTitle} • {doc.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRestoreDoctor(doc)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        استعادة
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletedDoctors(prev => prev.filter(d => d.id !== doc.id))}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
                      >
                        حذف نهائي
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-bold">
              <span>🔒 سلة المحذوفات نظامية ودائمة</span>
              <button
                type="button"
                onClick={() => setIsTrashModalOpen(false)}
                className="px-5 py-2.5 bg-[#10244A] text-white rounded-xl font-black hover:bg-[#1a3668] transition-all cursor-pointer"
              >
                إغلاق
              </button>
            </div>

          </div>
        </div>
      )}

      {/* VERIFICATION DURATION SELECTOR MODAL */}
      {verificationModalDoctor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 text-right shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-[#1877F2] rounded-2xl border border-blue-200">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-neutral-900">توثيق حساب الطبيب</h3>
                  <p className="text-xs text-neutral-500 font-semibold">تحديد مدة الشارة الزرقاء المعتمدة</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setVerificationModalDoctor(null)}
                className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3.5">
              <img 
                src={verificationModalDoctor.avatar} 
                alt={verificationModalDoctor.name} 
                className="w-12 h-12 rounded-xl object-cover border border-neutral-200" 
              />
              <div className="space-y-0.5">
                <h4 className="font-black text-sm text-neutral-900">{verificationModalDoctor.name}</h4>
                <p className="text-xs text-neutral-500 font-semibold">{verificationModalDoctor.jobTitle} • {verificationModalDoctor.specialty}</p>
                {Boolean(verificationModalDoctor.isVerified) && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-blue-600 pt-0.5">
                    <span>✓ الحساب موثق حالياً</span>
                    {verificationModalDoctor.verificationEndDate && (
                      <span className="text-neutral-500">({verificationModalDoctor.verificationEndDate})</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-neutral-700">اختر مدة التوثيق المعتمدة:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedVerificationDuration('annual')}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    selectedVerificationDuration === 'annual'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg">👑</span>
                    <input
                      type="radio"
                      checked={selectedVerificationDuration === 'annual'}
                      onChange={() => setSelectedVerificationDuration('annual')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="font-black text-xs">سنة كاملة (12 شهر)</div>
                    <div className="text-[10px] text-neutral-500 font-bold">365 يوماً من اليوم</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedVerificationDuration('6months')}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    selectedVerificationDuration === '6months'
                      ? 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg">⏳</span>
                    <input
                      type="radio"
                      checked={selectedVerificationDuration === '6months'}
                      onChange={() => setSelectedVerificationDuration('6months')}
                      className="accent-blue-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="font-black text-xs">6 أشهر (نصف سنة)</div>
                    <div className="text-[10px] text-neutral-500 font-bold">183 يوماً من اليوم</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
              <span className="text-neutral-600 font-bold">تاريخ انتهاء التوثيق الجديد:</span>
              <span className="font-black text-blue-800">
                {addSubscriptionDuration(new Date(), selectedVerificationDuration).toISOString().slice(0, 10)}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2.5">
              {Boolean(verificationModalDoctor.isVerified) && (
                <button
                  type="button"
                  onClick={handleRevokeVerification}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black rounded-xl border border-rose-200 transition-all cursor-pointer"
                >
                  إلغاء التوثيق وإخفاء الشارة
                </button>
              )}

              <div className="flex items-center gap-2 mr-auto">
                <button
                  type="button"
                  onClick={() => setVerificationModalDoctor(null)}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmVerification}
                  className="px-5 py-2.5 bg-[#1877F2] hover:bg-[#1565C0] text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>تأكيد التوثيق</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* WHITE LABEL DURATION SELECTOR MODAL */}
      {whiteLabelModalDoctor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-5 text-right shadow-2xl animate-scaleUp">
            
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-200">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-neutral-900">إخفاء العلامة التجارية (White Label)</h3>
                  <p className="text-xs text-neutral-500 font-semibold">تحديد مدة إزالة شعار ورابط المنصة من البروفايل</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setWhiteLabelModalDoctor(null)}
                className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex items-center gap-3.5">
              <img 
                src={whiteLabelModalDoctor.avatar} 
                alt={whiteLabelModalDoctor.name} 
                className="w-12 h-12 rounded-xl object-cover border border-neutral-200" 
              />
              <div className="space-y-0.5">
                <h4 className="font-black text-sm text-neutral-900">{whiteLabelModalDoctor.name}</h4>
                <p className="text-xs text-neutral-500 font-semibold">{whiteLabelModalDoctor.jobTitle} • {whiteLabelModalDoctor.specialty}</p>
                {Boolean(whiteLabelModalDoctor.whiteLabel) && (
                  <div className="flex items-center gap-1 text-[11px] font-bold text-purple-600 pt-0.5">
                    <span>✓ ميزة White Label مفعلة حالياً</span>
                    {whiteLabelModalDoctor.whiteLabelEndDate && (
                      <span className="text-neutral-500">({whiteLabelModalDoctor.whiteLabelEndDate})</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-neutral-700">اختر مدة إخفاء حقوق المنصة:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedWhiteLabelDuration('annual')}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    selectedWhiteLabelDuration === 'annual'
                      ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg">👑</span>
                    <input
                      type="radio"
                      checked={selectedWhiteLabelDuration === 'annual'}
                      onChange={() => setSelectedWhiteLabelDuration('annual')}
                      className="accent-purple-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="font-black text-xs">سنة كاملة (12 شهر)</div>
                    <div className="text-[10px] text-neutral-500 font-bold">365 يوماً من اليوم</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedWhiteLabelDuration('6months')}
                  className={`p-3.5 rounded-2xl border text-right transition-all flex flex-col justify-between gap-2 cursor-pointer ${
                    selectedWhiteLabelDuration === '6months'
                      ? 'border-purple-600 bg-purple-50/70 text-purple-900 shadow-xs'
                      : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-700'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-lg">⏳</span>
                    <input
                      type="radio"
                      checked={selectedWhiteLabelDuration === '6months'}
                      onChange={() => setSelectedWhiteLabelDuration('6months')}
                      className="accent-purple-600 cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="font-black text-xs">6 أشهر (نصف سنة)</div>
                    <div className="text-[10px] text-neutral-500 font-bold">183 يوماً من اليوم</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100 flex items-center justify-between text-xs">
              <span className="text-neutral-600 font-bold">تاريخ انتهاء إخفاء الحقوق:</span>
              <span className="font-black text-purple-800">
                {addSubscriptionDuration(new Date(), selectedWhiteLabelDuration).toISOString().slice(0, 10)}
              </span>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2.5">
              {Boolean(whiteLabelModalDoctor.whiteLabel) && (
                <button
                  type="button"
                  onClick={handleRevokeWhiteLabel}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-black rounded-xl border border-rose-200 transition-all cursor-pointer"
                >
                  إلغاء الميزة وإظهار الشعار
                </button>
              )}

              <div className="flex items-center gap-2 mr-auto">
                <button
                  type="button"
                  onClick={() => setWhiteLabelModalDoctor(null)}
                  className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-extrabold rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleConfirmWhiteLabel}
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-black rounded-xl transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تأكيد تفعيل الميزة</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
