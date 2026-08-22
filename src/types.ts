/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Branch {
  id: string;
  name: string;
  nameEn?: string;
  address: string;
  addressEn?: string;
  phone: string;
  workingHours?: string;
  workingHoursList?: WorkingHour[];
  mapUrl?: string;
  price?: number | string;
}

export interface Service {
  id: string;
  name: string;
  price?: number;
  duration?: string; // e.g. "30 دقيقة"
  description: string;
  imageUrl?: string;
}

export interface WorkingHour {
  day: string; // e.g. "السبت", "الأحد"
  isAvailable: boolean;
  start: string;
  end: string;
}

export interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

export interface DoctorFeatures {
  aboutAndBio: boolean; // نبذة عنك ومؤهلاتك العلمية
  servicesAndPrices: boolean; // الخدمات والعروض والأسعار
  photoGallery: boolean; // معرض صور العيادة
  videosSection?: boolean; // قسم الفيديوهات
  personalUrl: boolean; // رابط شخصي باسمك
  multipleBranches: boolean; // إضافة أكثر من فرع للعيادة
  professionalDesign: boolean; // تصميم احترافي
  easyBooking: boolean; // حجز المواعيد بسهولة
  workingHours: boolean; // مواعيد العمل وجدول العيادة
  manageAppointments: boolean; // إدارة وتنظيم المواعيد
  confirmOrCancelBooking: boolean; // تأكيد أو إلغاء الحجز
  doctorLeaves: boolean; // إجازات الطبيب والاستثناءات
  whatsappConfirmation: boolean; // تأكيد الحجز عبر واتساب
  easyControlPanel: boolean; // لوحة تحكم سهلة الاستخدام
  responsiveDesign: boolean; // يعمل على جميع الأجهزة
  continuousSupport: boolean; // دعم فني متواصل
  continuousUpdates: boolean; // تحديثات وتطوير مستمر
  patientBookingRequests: boolean; // إدارة طلبات حجوزات المرضى
  editProfileData: boolean; // تعديل بيانات البروفايل
  patientReviews: boolean; // تقييمات وآراء المرضى
  qrCodeSharing: boolean; // QR Code لمشاركة بروفايلك
  googleMapsLocation: boolean; // خرائط Google لموقع العيادة
  socialMediaLinks: boolean; // روابط السوشيال ميديا
  profileVerification: boolean; // توثيق البروفايل
  addCertificates: boolean; // إضافة الشهادات
}

export const DEFAULT_DOCTOR_FEATURES: DoctorFeatures = {
  aboutAndBio: true,
  servicesAndPrices: true,
  photoGallery: true,
  videosSection: true,
  personalUrl: true,
  multipleBranches: true,
  professionalDesign: true,
  easyBooking: true,
  workingHours: true,
  manageAppointments: true,
  confirmOrCancelBooking: true,
  doctorLeaves: true,
  whatsappConfirmation: true,
  easyControlPanel: true,
  responsiveDesign: true,
  continuousSupport: true,
  continuousUpdates: true,
  patientBookingRequests: true,
  editProfileData: true,
  patientReviews: true,
  qrCodeSharing: true,
  googleMapsLocation: true,
  socialMediaLinks: true,
  profileVerification: true,
  addCertificates: true,
};

export interface DoctorCertificate {
  id: string;
  title: string;
  imageUrl: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  title: string;
}

export interface DoctorInvoice {
  id: string;
  invoiceNumber: string; // رقم الفاتورة (مثال: INV-2026-8492)
  doctorId: string;
  doctorName: string;
  doctorEmail?: string;
  doctorPhone?: string;
  doctorJobTitle?: string;
  doctorSpecialty?: string;
  planDuration: string; // مدة الاشتراك (مثال: سنة كاملة (12 شهر) أو 6 أشهر)
  subscriptionType?: '6months' | 'annual';
  date: string; // التاريخ (مثال: 2026-08-14)
  createdAt?: string;
  amount: number; // المبلغ
  currency?: string; // ج.م
  status: 'paid' | 'pending' | 'cancelled'; // الحالة
  statusText?: string;
  paymentMethod: 'Vodafone Cash' | 'Etisalat Cash' | 'Orange Cash' | 'WE Pay' | 'InstaPay' | string; // طريقة الدفع
  notes?: string;
}

export type PaymentMethodType = 'Vodafone Cash' | 'Etisalat Cash' | 'Orange Cash' | 'WE Pay' | 'InstaPay';

export interface Doctor {
  id: string;
  name: string;
  nameEn: string; // For URL routing (e.g., /dr/ahmed-hassan)
  password?: string;
  specialty: string;
  specialtyEn?: string;
  jobTitle: string;
  jobTitleEn?: string;
  email: string;
  phone: string;
  whatsapp: string;
  avatar: string;
  bio: string;
  bioEn?: string;
  experience: number; // Years of experience
  branches: Branch[];
  services: Service[];
  workingHours: WorkingHour[];
  gallery: string[];
  galleryItems?: GalleryItem[];
  videos: string[];
  reviews: Review[];
  socials: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
    snapchat?: string;
    telegram?: string;
    website?: string;
  };
  isActiveSubscription: boolean;
  registeredAt: string;
  subscriptionEndDate?: string;
  isTrial?: boolean;
  trialStartDate?: string;
  trialEndDate?: string;
  isPaidSubscription?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected' | 'suspended';
  status?: 'pending' | 'approved' | 'rejected' | 'suspended';
  address?: string;
  title?: string;
  rejectionReason?: string;
  subscriptionType?: '6months' | 'annual';
  autoRenew?: boolean;
  isVerified?: boolean;
  verificationDuration?: '6months' | 'annual';
  verificationEndDate?: string;
  whiteLabel?: boolean;
  whiteLabelDuration?: '6months' | 'annual';
  whiteLabelEndDate?: string;
  themeColor?: string;
  themeTemplate?: 'solid' | 'medical' | 'calm' | 'modern' | 'luxury' | 'soft' | string;
  features?: DoctorFeatures;
  certificates?: DoctorCertificate[];
  siteType?: 'profile' | 'website';
  headerDisplayName?: string; // الاسم الثنائي أو اللقب المصغر للشريط العلوي
  headerAvatar?: string; // صورة الشريط العلوي
  secretaries?: Secretary[];
  invoices?: DoctorInvoice[];
  patients?: PatientRecord[];
}

export interface SecretaryPermissions {
  viewAppointments: boolean;
  confirmAppointments: boolean;
  rejectAppointments: boolean;
  sendWhatsapp: boolean;
  editAppointments: boolean;
  manageConsultations?: boolean;
  managePatients: boolean;
  manageClinics: boolean;
  manageServices: boolean;
  manageGallery: boolean;
  manageVideos: boolean;
  manageCertificates: boolean;
}

export interface Secretary {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  branchId?: string;
  status: 'active' | 'inactive';
  permissions: SecretaryPermissions;
  createdAt?: string;
}

export interface PatientConsultation {
  id: string;
  type: 'consultation' | 'followup' | 'emergency' | 'advisory' | string; // 'consultation' = كشف | 'followup' = متابعة | 'emergency' = طوارئ | 'advisory' = استشارة
  date: string; // YYYY-MM-DD
  time?: string;
  diagnosis?: string; // التشخيص
  notes?: string; // ملاحظات / تفاصيل الكشف
  prescription?: string; // العلاج / الروشتة
  fee?: number | string; // قيمة الكشف / المتابعة
  createdAt?: string;
}

export interface PatientRecord {
  id: string;
  doctorId: string;
  patientName: string;
  patientPhone: string;
  whatsappNumber?: string;
  age?: string | number; // العمر
  gender?: 'ذكر' | 'أنثى' | string; // النوع
  notes?: string; // ملاحظات عامة
  consultations: PatientConsultation[]; // سجل الكشوفات والمتابعات
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientName: string;
  patientPhone: string;
  whatsappNumber?: string;
  date: string;
  time: string;
  branchId: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled' | string;
  notes?: string;
  serviceId?: string;
  createdAt?: string;
}

export interface FeatureCategoryConfig {
  id: string;
  title: string;
  iconName: string;
  imageUrl?: string;
  items: string[];
}

export interface PricingPlanConfig {
  title: string;
  price: string;
  period: string;
  discountText: string;
  features: string[];
}

export interface FAQConfigItem {
  id: string;
  question: string;
  answer: string;
}

export interface SEOSettingsConfig {
  faviconUrl?: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  canonicalUrl: string;

  ogTitle: string;
  ogDescription: string;
  ogImageUrl: string;

  googleVerificationCode: string;
  gaMeasurementId: string;
  gtmId: string;

  autoSitemap: boolean;
  lastSitemapUpdate: string;
  sitemapPagesCount: number;

  autoRobots: boolean;
  robotsTxtContent: string;

  enableSchema: boolean;
  schemaType: 'WebSite' | 'Organization' | 'MedicalOrganization' | 'FAQ' | 'Article' | 'Breadcrumb';

  allowIndexing: boolean;
  noIndexPages: string[];
  autoCanonical: boolean;

  enableBreadcrumbSchema: boolean;
  enableFaqSchema: boolean;
  enableArticleSchema: boolean;
  enableSearchBoxSchema: boolean;
  enableOrganizationSchema: boolean;
  enableOpenGraph: boolean;
  enableTwitterCard: boolean;

  autoCompressImages: boolean;
  webpConversion: boolean;
  lazyLoading: boolean;
  minifyHtml: boolean;
  minifyCss: boolean;
  minifyJs: boolean;
  browserCache: boolean;
  gzipCompression: boolean;
}

export const DEFAULT_SEO_CONFIG: SEOSettingsConfig = {
  faviconUrl: 'https://k.top4top.io/p_38573eitn0.png',
  metaTitle: 'Doctor Profile | دكتور بروفايل - بروفايل طبي احترافي للأطباء',
  metaDescription: 'أنشئ بروفايلك الطبي الاحترافي واحصل على موقع إلكتروني خاص بعيادتك مع نظام حجز مواعيد ذكي وإدارة كاملة للعيادة وبدون أي عمولات على الحجوزات.',
  metaKeywords: 'إنشاء بروفايل طبي, إنشاء بروفايل دكتور, إنشاء موقع طبيب, إنشاء موقع إلكتروني للطبيب, إنشاء موقع للعيادة, بروفايل طبي احترافي, بروفايل دكتور احترافي, صفحة شخصية للطبيب, موقع شخصي للطبيب, موقع طبي احترافي, موقع للأطباء, تصميم موقع طبي, تصميم موقع طبيب, تصميم موقع عيادة, إنشاء صفحة طبيب, إنشاء صفحة عيادة, حجز مواعيد الأطباء, حجز مواعيد العيادات, نظام حجز مواعيد للعيادات, التسويق الإلكتروني للأطباء, التسويق الطبي, إدارة بروفايل الطبيب, إدارة العيادة إلكترونيًا, إنشاء ملف تعريفي للطبيب, أفضل منصة للأطباء, أفضل موقع لإنشاء بروفايل طبي, Doctor Profile, Create Doctor Profile, Professional Doctor Profile, Doctor Website, Create Doctor Website, Professional Doctor Website, Medical Profile, Physician Profile, Doctor Portfolio, Personal Website for Doctors, Medical Website, Create Medical Website, Clinic Website, Create Clinic Website, Medical Practice Website, Online Appointment Booking, Doctor Appointment Booking, Clinic Booking System, Healthcare Website, Doctor Branding, Medical Branding, Doctor Online Presence, Website Builder for Doctors, Medical Profile Platform, Doctor Profile Platform, Best Doctor Profile Platform, Healthcare Marketing, Medical Marketing, Clinic Management Website, Professional Clinic Website',
  canonicalUrl: 'https://www.dr-profile.com',

  ogTitle: 'منصة دكتور بروفايل الطبية - موقعك الطبي وتواجدك الرقمي بين يديك',
  ogDescription: 'ابنِ هويتك الرقمية كطبيب واستقبل حجوزات المرضى مباشرة مع منصة دكتور بروفايل الطبية الأولى في الشرق الأوسط.',
  ogImageUrl: 'https://h.top4top.io/p_3874d6cv31.png',

  googleVerificationCode: 'google-site-verification=XYZ1234567890ABCDEF',
  gaMeasurementId: 'G-7X9Y2Z4W1V',
  gtmId: 'GTM-K9L8M7N',

  autoSitemap: true,
  lastSitemapUpdate: '2026-08-01 18:25',
  sitemapPagesCount: 42,

  autoRobots: true,
  robotsTxtContent: `User-agent: *

Allow: /

Disallow: /admin/
Disallow: /login/
Disallow: /register/
Disallow: /forgot-password/
Disallow: /reset-password/
Disallow: /dashboard/
Disallow: /api/

Sitemap: https://www.dr-profile.com/sitemap.xml`,

  enableSchema: true,
  schemaType: 'MedicalOrganization',

  allowIndexing: true,
  noIndexPages: ['/admin', '/login', '/secretary'],
  autoCanonical: true,

  enableBreadcrumbSchema: true,
  enableFaqSchema: true,
  enableArticleSchema: true,
  enableSearchBoxSchema: true,
  enableOrganizationSchema: true,
  enableOpenGraph: true,
  enableTwitterCard: true,

  autoCompressImages: true,
  webpConversion: true,
  lazyLoading: true,
  minifyHtml: true,
  minifyCss: true,
  minifyJs: true,
  browserCache: true,
  gzipCompression: true,
};

export interface PreviewCardItem {
  id: string;
  imageUrl: string;
  profileUrl: string;
  title?: string;
}

export interface AboutPageConfig {
  badgeAr?: string;
  badgeEn?: string;
  titleAr?: string;
  titleEn?: string;
  headlineAr?: string;
  headlineEn?: string;
  storyTitleAr?: string;
  storyTitleEn?: string;
  storyTextAr?: string;
  storyTextEn?: string;
  storyText2Ar?: string;
  storyText2En?: string;
  offeringsTitleAr?: string;
  offeringsTitleEn?: string;
  offeringsIntroAr?: string;
  offeringsIntroEn?: string;
  offeringsItemsAr?: string[];
  offeringsItemsEn?: string[];
  visionTitleAr?: string;
  visionTitleEn?: string;
  visionTextAr?: string;
  visionTextEn?: string;
  valuesTitleAr?: string;
  valuesTitleEn?: string;
  valuesItemsAr?: { title: string; desc: string }[];
  valuesItemsEn?: { title: string; desc: string }[];
}

export interface LegalSectionItem {
  id: string;
  headingAr: string;
  headingEn?: string;
  introAr?: string;
  introEn?: string;
  paragraphsAr?: string[];
  paragraphsEn?: string[];
  bulletsAr?: string[];
  bulletsEn?: string[];
}

export interface GenericLegalPageConfig {
  badgeAr?: string;
  badgeEn?: string;
  titleAr?: string;
  titleEn?: string;
  subtitleAr?: string;
  subtitleEn?: string;
  contactEmail?: string;
  sections?: LegalSectionItem[];
}

export interface ImportantPagesConfig {
  about?: AboutPageConfig;
  terms?: GenericLegalPageConfig;
  privacy?: GenericLegalPageConfig;
  disclaimer?: GenericLegalPageConfig;
  termsEmail?: string;
  privacyEmail?: string;
  disclaimerEmail?: string;
}

export interface LandingPageConfig {
  faviconUrl?: string;
  seo?: SEOSettingsConfig;
  headerLogos?: {
    darkLogoUrl?: string;
    lightLogoUrl?: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    primaryCtaText: string;
    secondaryCtaText?: string;
    doctorsCountText?: string;
    heroDesktopImage?: string;
    heroMobileImage?: string;
    subHeroImage?: string;
    subHeroTitle?: string;
    subHeroSubtitle?: string;
    subHeroButtonText?: string;
    howItWorksTitle?: string;
    howItWorksSubtitle?: string;
    step1Title?: string;
    step1Desc?: string;
    step2Title?: string;
    step2Desc?: string;
    step3Title?: string;
    step3Desc?: string;
    pillar1Title?: string;
    pillar2Title?: string;
    pillar3Title?: string;
    pillar4Title?: string;
    headerLogoDarkUrl?: string;
    headerLogoLightUrl?: string;
  };
  features: {
    title: string;
    subtitle: string;
    categories: FeatureCategoryConfig[];
    bottomBannerTitle?: string;
    bottomBannerButtonText?: string;
  };
  overview?: {
    mainTitle?: string;
    leftImage?: string;
    rightImage?: string;
    leftTitle?: string;
    leftSubtitle?: string;
    leftButtonText?: string;
    rightTitle?: string;
    rightSubtitle?: string;
    rightButtonText?: string;
    controlTitle?: string;
    controlFeature1?: string;
    controlFeature2?: string;
    controlFeature3?: string;
    controlFeature4?: string;
    controlButtonText?: string;
    controlImage?: string;
  };
  ctaBanner?: {
    title?: string;
    subtitle?: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
  };
  pricing?: {
    title: string;
    subtitle: string;
    plan5Months: PricingPlanConfig;
    plan1Year: PricingPlanConfig;
    ctaText: string;
    bottomBannerTitle?: string;
    bottomBannerButtonText?: string;
  };
  clientWorks?: {
    title: string;
    subtitle?: string;
    columns?: 1 | 2;
    featuredDoctorIds?: string[];
    cards?: PreviewCardItem[];
  };
  faq?: {
    title: string;
    subtitle: string;
    items: FAQConfigItem[];
  };
  contact: {
    title: string;
    subtitle: string;
    whatsappNumber: string;
    targetEmail?: string;
    defaultMessage?: string;
    placeholder: string;
    buttonText: string;
    cardFaqTitle?: string;
    cardFaqSubtitle?: string;
    cardFaqButtonText?: string;
    cardCallTitle?: string;
    cardCallSubtitle?: string;
    cardCallButtonText?: string;
    cardMessageTitle?: string;
    cardMessageSubtitle?: string;
    cardMessageButtonText?: string;
    formTitle?: string;
  };
  dashboardSettings?: {
    contactAdminButtonText?: string;
    contactAdminWhatsappNumber?: string;
    contactAdminMessage?: string;
  };
  login?: {
    headerLoginButtonText: string;
    title: string;
    subtitle: string;
    logoUrl?: string;
  };
  createSite?: {
    headerCtaButtonText: string;
    heroCtaButtonText: string;
    title: string;
    subtitle: string;
    logoUrl?: string;
    step1Title?: string;
    step2Title?: string;
    nextButtonText?: string;
    backButtonText?: string;
    submitButtonText: string;
    submittingButtonText?: string;
    successAlertText: string;
    termsText?: string;
    loginPromptText?: string;
    loginLinkText?: string;
  };
  footer?: {
    logoUrl?: string;
    description?: string;
    paymentMethodsImageUrl?: string;
    facebookUrl?: string;
    instagramUrl?: string;
    linkedinUrl?: string;
    youtubeUrl?: string;
    socialLinks?: FooterSocialLink[];
    copyrightText?: string;
  };
  importantPages?: ImportantPagesConfig;
  adminCredentials?: AdminCredentials;
}

export interface AdminCredentials {
  email: string;
  passwordHash: string;
}

export const DEFAULT_ADMIN_CREDENTIALS: AdminCredentials = {
  email: "hassanhamdy@gmail.com",
  passwordHash: "Abo Hmed 011# Abo hassan"
};

export interface FooterSocialLink {
  id: string;
  platform: 'facebook' | 'instagram' | 'x' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'whatsapp' | 'telegram' | 'snapchat' | 'website' | 'other';
  title?: string;
  url: string;
  enabled?: boolean;
}

export const DEFAULT_LANDING_CONFIG: LandingPageConfig = {
  faviconUrl: 'https://k.top4top.io/p_38573eitn0.png',
  seo: DEFAULT_SEO_CONFIG,
  adminCredentials: DEFAULT_ADMIN_CREDENTIALS,
  headerLogos: {
    darkLogoUrl: 'https://k.top4top.io/p_38573eitn0.png',
    lightLogoUrl: 'https://i.top4top.io/p_3857n94r80.png'
  },
  hero: {
    badge: 'المنصة الأولى لبناء الهوية الرقمية للأطباء',
    title: 'أنشئ بروفايلك الطبي في دقائق',
    subtitle: 'من خلال موقعنا يمكنك إنشاء بروفايل طبي احترافي يعرض خبراتك وخدماتك مع نظام حجز ذكي ولوحة تحكم متكاملة دون أي عمولات على الحجوزات',
    primaryCtaText: 'ابدأ الآن مجاناً',
    secondaryCtaText: 'استكشف الباقات',
    doctorsCountText: '+500 طبيب يستخدمون المنصة',
    heroDesktopImage: 'https://h.top4top.io/p_3874d6cv31.png',
    heroMobileImage: 'https://k.top4top.io/p_3874k7cvg1.png',
    subHeroImage: 'https://l.top4top.io/p_3874bibs21.png',
    subHeroTitle: 'بروفايلك الطبي... هويتك',
    subHeroSubtitle: 'بدلًا من أن يكون بروفايلك مجرد صفحة وسط مئات الأطباء على منصة أخرى، امتلك بروفايلك الطبي الخاص بهويتك، وخدماتك، وبياناتك، ووسائل التواصل مع مرضاك',
    subHeroButtonText: 'كيف يعمل',
    howItWorksTitle: 'أنشئ بروفايلك الطبي في 3 خطوات',
    howItWorksSubtitle: 'بروفايل احترافي بسيط وسريع لا برمجة لا تصميم لا تعقيد',
    step1Title: 'سجّل كطبيب',
    step1Desc: 'أنشئ حسابك خلال ثوان باستخدام اسم المستخدم وكلمة المرور.',
    step2Title: 'أدخل بياناتك',
    step2Desc: 'أضف اسمك، تخصصك، خدماتك، ساعات العمل، وبيانات التواصل.',
    step3Title: 'موقعك جاهز!',
    step3Desc: 'احصل على رابط بروفايلك الاحترافي فوراً وشاركه مع مرضاك.',
    pillar1Title: 'رابط طبي خاص بك',
    pillar2Title: 'حجز مواعيد بسهولة',
    pillar3Title: 'يعمل على كل الأجهزة',
    pillar4Title: 'دعم لغات متعددة',
    headerLogoDarkUrl: 'https://k.top4top.io/p_38573eitn0.png',
    headerLogoLightUrl: 'https://i.top4top.io/p_3857n94r80.png'
  },
  features: {
    title: 'المميزات',
    subtitle: 'أنشئ بروفايل طبي احترافي لعيادتك، واعرض خدماتك ومواعيدك ووسائل التواصل لتسهيل وصول المرضى إليك',
    categories: [
      {
        id: 'cat-1',
        title: 'البروفايل الطبي',
        iconName: 'user',
        imageUrl: 'https://h.top4top.io/p_3874v0ld91.png',
        items: [
          'نبذة عنك ومؤهلاتك العلمية',
          'الخدمات والعروض والأسعار',
          'معرض صور العيادة',
          'رابط شخصي باسمك',
          'إضافة أكثر من فرع للعيادة',
          'قوالب متعددة وتصميم احترافي'
        ]
      },
      {
        id: 'cat-2',
        title: 'إدارة المواعيد',
        iconName: 'calendar',
        imageUrl: 'https://e.top4top.io/p_38742udfi1.png',
        items: [
          'حجز المواعيد بسهولة',
          'مواعيد العمل وجدول العيادة',
          'إدارة وتنظيم المواعيد',
          'تأكيد أو إلغاء الحجز',
          'إجازات الطبيب والاستثناءات',
          'تأكيد الحجز عبر واتساب'
        ]
      },
      {
        id: 'cat-3',
        title: 'التسويق والثقة',
        iconName: 'star',
        imageUrl: 'https://i.top4top.io/p_3874myu051.png',
        items: [
          'تقييمات وآراء المرضى',
          'QR Code لمشاركة بروفايلك',
          'خرائط Google لموقع العيادة',
          'روابط السوشيال ميديا',
          'توثيق البروفايل',
          'إضافة الشهادات'
        ]
      },
      {
        id: 'cat-4',
        title: 'الإدارة والدعم',
        iconName: 'shield',
        imageUrl: 'https://g.top4top.io/p_3874u8tug1.png',
        items: [
          'لوحة تحكم سهلة الاستخدام',
          'يعمل على جميع الأجهزة',
          'دعم فني متواصل'
        ]
      }
    ],
    bottomBannerTitle: 'كل اللي محتاجه علشان تعرض خدماتك الطبية أونلاين في مكان واحد',
    bottomBannerButtonText: 'الأسعار'
  },
  overview: {
    mainTitle: 'كل ما يحتاجه ملفك الطبي للحضور أونلاين',
    leftImage: 'https://j.top4top.io/p_387540zrh1.png',
    leftTitle: 'متناسق على أي جهاز',
    leftSubtitle: 'ملف طبي متجاوب تلقائيًا مع مختلف الأجهزة، ليظهر بروفايلك بشكل احترافي ومميز على أي جهاز',
    leftButtonText: 'ابدأ الآن مجاناً',
    rightImage: 'https://j.top4top.io/p_3875xod3p1.png',
    rightTitle: 'حجوزات منظمة وتجربة أسهل',
    rightSubtitle: 'نظّم مواعيد عياداتك واستقبل طلبات الحجز من مرضاك بسهولة، مع تحديد مواعيد العمل والوقت المناسب لكل حجز.',
    rightButtonText: 'ابدأ الآن مجاناً',
    controlTitle: 'تحكم في كل شيء',
    controlFeature1: 'إدارة ملفك الطبي بسهولة',
    controlFeature2: 'استقبال وتنظيم طلبات الحجز',
    controlFeature3: 'تنظيم مواعيدك وساعات العمل',
    controlFeature4: 'إدارة صور وخدمات عيادتك',
    controlButtonText: 'اكتشف المميزات',
    controlImage: 'https://a.top4top.io/p_3874614ld1.png'
  },
  ctaBanner: {
    title: 'جاهز لإنشاء بروفايلك الطبي؟',
    subtitle: 'انضم إلى مئات الأطباء الذين يملكون بروفايلات احترافية الآن، سريع وسهل ولا يتطلب أي خبرة تقنية',
    primaryButtonText: 'ابدأ الآن مجاناً',
    secondaryButtonText: 'لديك حساب؟ سجّل الدخول'
  },
  pricing: {
    title: 'الباقات والأسعار',
    subtitle: 'ادفع مرة واحدة واحصل على بروفايلك الطبي لمدة عام كامل',
    plan5Months: {
      title: 'اشتراك لمدة 6 أشهر',
      price: '1500',
      period: 'ج.م / 6 أشهر',
      discountText: '',
      features: [
        'بروفايل طبي',
        'رابط خاص',
        'قوالب متعددة',
        'نبذة ومؤهلات',
        'تخصص وخدمات',
        'أسعار الخدمات',
        'صور العيادة',
        'فيديوهات',
        'مواعيد العمل',
        'لوكيشن العيادة',
        'سوشيال ميديا',
        'حجز مواعيد',
        'تقييمات المرضى',
        'اضافة سكرتارية متعددة',
        'لوحة تحكم احترافية',
        'متوافق مع الأجهزة',
        'دعم فني',
        'تحديثات مجانية'
      ]
    },
    plan1Year: {
      title: 'اشتراك لمدة سنة',
      price: '2500',
      period: 'ج.م / سنة',
      discountText: '',
      features: [
        'بروفايل طبي',
        'رابط خاص',
        'قوالب متعددة',
        'نبذة ومؤهلات',
        'تخصص وخدمات',
        'أسعار الخدمات',
        'صور العيادة',
        'فيديوهات',
        'مواعيد العمل',
        'لوكيشن العيادة',
        'سوشيال ميديا',
        'حجز مواعيد',
        'تقييمات المرضى',
        'اضافة سكرتارية متعددة',
        'لوحة تحكم احترافية',
        'متوافق مع الأجهزة',
        'دعم فني',
        'تحديثات مجانية'
      ]
    },
    ctaText: 'ابدأ الآن مجاناً',
    bottomBannerTitle: 'كل اللي محتاجه علشان تعرض خدماتك الطبية أونلاين في مكان واحد',
    bottomBannerButtonText: 'ابدأ الآن مجاناً'
  },
  clientWorks: {
    title: 'أمثلة من البروفايلات',
    subtitle: '',
    columns: 1,
    cards: [
      {
        id: 'card-1',
        imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1200',
        profileUrl: 'dr-sarah',
        title: 'د. سارة الشريف - طب وجراحة الأسنان'
      }
    ]
  },
  faq: {
    title: 'أسئلة متكررة',
    subtitle: 'إجابات عن أهم الاستفسارات المتكررة حول المنصة وطريقة العمل',
    items: [
      { id: 'f1', question: 'هل يوجد عمولة على الحجوزات؟', answer: 'لا توجد أي عمولات على الحجوزات نهائياً' },
      { id: 'f2', question: 'هل أقدر أضيف أكثر من عيادة؟', answer: 'نعم، يمكنك إضافة وإدارة عدة عيادات وفروع في بروفايلك الطبي مع تحديد مواعيد العمل والعناوين وأرقام التواصل لكل فرع بسهولة.' },
      { id: 'f3', question: 'هل أقدر أضيف سكرتارية؟', answer: 'نعم، توفر المنصة نظام إدارة السكرتارية يتيح لك إضافة سكرتارية ومساعدين وتحديد صلاحياتهم لمتابعة وتنظيم الحجوزات والمواعيد.' },
      { id: 'f4', question: 'هل البروفايل له رابط خاص؟', answer: 'نعم، يحصل كل طبيب على رابط بروفايل خاص ومستقل ومباشر يمكنك مشاركته على منصات التواصل الاجتماعي وفي بطاقات العيادة.' },
      { id: 'f5', question: 'هل أقدر أعدل بياناتي بعد الاشتراك؟', answer: 'نعم، يمكنك تعديل وتحديث كافة بياناتك (الخدمات، الأسعار، العناوين، مواعيد العمل، الصور) في أي وقت ومن أي مكان عبر لوحة التحكم.' },
      { id: 'f6', question: 'هل يعمل على الموبايل؟', answer: 'نعم، المنصة والبروفايل الطبي مصممة بالكامل لتكون متوافقة وسريعة وسلسة جداً على جميع أجهزة الموبايل والتابلت والكمبيوتر.' },
      { id: 'f7', question: 'هل يوجد دعم فني؟', answer: 'نعم، فريق الدعم الفني متواجد دائماً لمساعدتك والإجابة على كافة استفساراتك عبر الواتساب والبريد الإلكتروني.' },
      { id: 'f8', question: 'هل البروفايل يوجد في قوالب والوان مختلفة؟', answer: 'نعم، المنصة توفر قوالب وتصاميم وألوان متعددة لتتناسب مع هويتك وتخصصك الطبي، ويمكنك التبديل بينها بسهولة من خلال لوحة التحكم الخاصة بك.' }
    ]
  },
  contact: {
    title: 'تواصل معنا',
    subtitle: 'جاهزين لمساعدتك في أي شيء وأي وقت',
    whatsappNumber: '201111777251',
    targetEmail: 'drprofileweb@gmail.com',
    defaultMessage: 'مرحباً، أود الاستفسار عن منصة دكتور بروفايل وباقات الأسعار.',
    placeholder: 'اكتب رسالتك أو استفسارك هنا...',
    buttonText: 'إرسال',
    cardFaqTitle: 'الأسئلة الشائعة',
    cardFaqSubtitle: 'إجابات سريعة على أهم الأسئلة حول دكتور بروفايل وخدماتنا.',
    cardFaqButtonText: 'شاهد الأسئلة الشائعة',
    cardCallTitle: 'اتصل بنا',
    cardCallSubtitle: 'لديك استفسار أو مشكلة؟ دردش معنا أو حدد وقت لمكالمة هاتفية مع فريق الدعم.',
    cardCallButtonText: 'كلمنا الآن',
    cardMessageTitle: 'اترك لنا رسالة',
    cardMessageSubtitle: 'لديك استفسار أو مشكلة؟ راسلنا الآن عبر البريد الإلكتروني لحلها.',
    cardMessageButtonText: 'راسلنا',
    formTitle: 'للتواصل مع الادارة يرجى ملء النموذج التالي'
  },
  login: {
    headerLoginButtonText: 'تسجيل دخول',
    title: 'تسجيل الدخول',
    subtitle: 'سجل دخولك إلى لوحة تحكم بروفايلك الطبي لمتابعة الحجوزات وتعديل بياناتك',
    logoUrl: 'https://i.top4top.io/p_3857n94r80.png'
  },
  dashboardSettings: {
    contactAdminButtonText: 'تواصل مع الإدارة',
    contactAdminWhatsappNumber: '201111777251',
    contactAdminMessage: 'مرحباً إدارة دكتور بروفايل، أود الاستفسار عن تجديد/ترقية اشتراكي للطبيب: {doctorName}'
  },
  createSite: {
    headerCtaButtonText: 'ابدأ الآن مجاناً',
    heroCtaButtonText: 'ابدأ الآن مجاناً',
    title: 'انشئ حساب مجاني',
    subtitle: 'المرحلة الأولى',
    logoUrl: 'https://d.top4top.io/p_3875rj4l41.png',
    step1Title: 'انشئ حساب مجاني',
    step2Title: 'بيانات البروفايل',
    nextButtonText: 'التالي',
    backButtonText: 'السابق',
    submitButtonText: 'انشئ حساب مجاني',
    submittingButtonText: 'جاري إنشاء الحساب...',
    successAlertText: 'تم إنشاء بروفايلك بنجاح! مرحباً بك في دكتور بروفايل',
    termsText: 'أوافق على شروط الاستخدام، سياسة الخصوصية، وإخلاء المسؤولية. أقر بأنني المسؤول عن صحة البيانات والاعتمادات الطبية.',
    loginPromptText: 'لديكم حساب بالفعل؟',
    loginLinkText: 'تسجيل الدخول'
  },
  footer: {
    logoUrl: 'https://k.top4top.io/p_38573eitn0.png',
    description: 'المنصة الأولى والرائدة لإنشاء وإدارة البروفايل الطبي والمواقع الإلكترونية للأطباء في الوطن العربي.',
    paymentMethodsImageUrl: '',
    facebookUrl: 'https://facebook.com',
    instagramUrl: 'https://instagram.com',
    linkedinUrl: 'https://linkedin.com',
    youtubeUrl: 'https://youtube.com',
    socialLinks: [
      { id: 'soc_fb', platform: 'facebook', title: 'فيسبوك', url: 'https://facebook.com', enabled: true },
      { id: 'soc_x', platform: 'x', title: 'إكس (تويتر)', url: 'https://x.com', enabled: true },
      { id: 'soc_ig', platform: 'instagram', title: 'إنستغرام', url: 'https://instagram.com', enabled: true },
      { id: 'soc_li', platform: 'linkedin', title: 'لينكد إن', url: 'https://linkedin.com', enabled: true },
      { id: 'soc_yt', platform: 'youtube', title: 'يوتيوب', url: 'https://youtube.com', enabled: true }
    ],
    copyrightText: 'جميع الحقوق محفوظة © 2026 دكتور بروفايل Dr Profile'
  },
  importantPages: {
    about: {
      badgeAr: 'من نحن',
      badgeEn: 'About Us',
      titleAr: 'من نحن',
      titleEn: 'About Us',
      headlineAr: 'نساعد الأطباء على بناء حضور طبي رقمي احترافي بسهولة واحترافية.',
      headlineEn: 'Empowering doctors to build a professional medical digital presence with ease and excellence.',
      storyTitleAr: 'قصتنا',
      storyTitleEn: 'Our Story',
      storyTextAr: 'دكتور بروفايل منصة متخصصة تساعد الأطباء على إنشاء بروفايل طبي احترافي يعرض خبراتهم وتخصصاتهم وخدماتهم، ويمنحهم حضورًا رقميًا مميزًا يسهل الوصول إليه ومشاركته مع المرضى.',
      storyTextEn: 'Dr Profile is a specialized platform that helps medical practitioners build a professional medical profile highlighting their expertise, specialties, and clinic services, giving them a distinguished digital presence that is easy for patients to access and share.',
      storyText2Ar: 'نؤمن أن لكل طبيب خبرة تستحق أن تظهر بصورة احترافية، لذلك صممنا المنصة لتوفر تجربة بسيطة ومرنة دون الحاجة إلى خبرة تقنية.',
      storyText2En: 'We believe every doctor’s medical expertise deserves to be showcased professionally, which is why we built our platform to offer a simple, seamless, and flexible experience requiring zero technical expertise.',
      offeringsTitleAr: 'ما نقدمه',
      offeringsTitleEn: 'What We Offer',
      offeringsIntroAr: 'نوفر للأطباء أدوات متكاملة لإنشاء وإدارة بروفايلهم الطبي بسهولة، تشمل:',
      offeringsIntroEn: 'We provide physicians and clinics with comprehensive tools to easily launch and manage their medical profile, including:',
      offeringsItemsAr: [
        'تصميم بروفايل طبي احترافي ومتوافق مع الهواتف الذكية.',
        'عرض التخصصات، الخدمات، وسنوات الخبرة.',
        'إضافة وسائل التواصل والموقع الجغرافي للعيادة.',
        'رابط مخصص وسهل المشاركة مع المرضى.',
        'لوحة تحكم بسيطة لتحديث البيانات في أي وقت.'
      ],
      offeringsItemsEn: [
        'Professional, mobile-responsive medical profile design.',
        'Display specialties, clinic services, and years of medical expertise.',
        'Add direct contact channels and clinic Google Maps location.',
        'Custom dedicated URL that is effortless to share with patients.',
        'Simple, powerful dashboard to update information at any time.'
      ],
      visionTitleAr: 'رؤيتنا',
      visionTitleEn: 'Our Vision',
      visionTextAr: 'أن نكون الخيار الأول للأطباء في العالم العربي لبناء وتطوير هويتهم الرقمية بكفاءة واحترافية.',
      visionTextEn: 'To be the number one choice for medical practitioners across the Arab world to build, grow, and empower their digital presence with peak efficiency and professionalism.',
      valuesTitleAr: 'قيمنا',
      valuesTitleEn: 'Our Values',
      valuesItemsAr: [
        { title: 'الاحترافية', desc: 'تقديم حلول رقمية تليق بالمكانة الطبية.' },
        { title: 'البساطة', desc: 'تجربة استخدام سهلة ومرنة للأطباء والمرضى.' },
        { title: 'الثقة والأمان', desc: 'الحفاظ على خصوصية البيانات وحمايتها.' },
        { title: 'التطوير المستمر', desc: 'تحديث خدماتنا باستمرار لتلبية احتياجات الأطباء.' }
      ],
      valuesItemsEn: [
        { title: 'Professionalism', desc: 'Delivering digital solutions worthy of medical prestige.' },
        { title: 'Simplicity', desc: 'An effortless, flexible experience for doctors and patients alike.' },
        { title: 'Trust & Security', desc: 'Safeguarding patient data and maintaining strict privacy standards.' },
        { title: 'Continuous Growth', desc: 'Constantly upgrading our platform to serve the evolving needs of medical professionals.' }
      ]
    },
    terms: {
      badgeAr: 'وثائق قانونية',
      badgeEn: 'Legal Document',
      titleAr: 'شروط استخدام منصة دكتور بروفايل',
      titleEn: 'Terms of Use for Dr Profile Platform',
      subtitleAr: 'هذا المستند يوضح شروط وأحكام استخدامك لخدمات منصة دكتور بروفايل («المنصة»). باستخدامك للمنصة فأنت تقر بالالتزام الكامل بكل ما ورد أدناه.',
      subtitleEn: 'This document sets forth the terms and conditions for using Dr Profile platform services. By using the platform, you agree to comply with all provisions below.',
      contactEmail: 'drprofileweb@gmail.com',
      sections: [
        {
          id: 'terms_1',
          headingAr: 'أولًا: تعريف المنصة ودورها',
          headingEn: '1. Platform Nature & Scope',
          paragraphsAr: [
            'دكتور بروفايل هو وسيط تقني يتيح للأطباء إنشاء بروفايل رقمي وإدارة محتواهم الطبي وخدماتهم على الإنترنت. لا تُقدّم المنصة أي تشخيصات أو استشارات أو خدمات طبية مباشرة، ولا تُعد جهة مانحة للترخيص المهني أو بديلاً عن الجهات التنظيمية المختصة.'
          ],
          paragraphsEn: [
            'Dr Profile is a software technology solution designed for medical digital branding and appointment coordination. The platform is not a healthcare facility and does not provide direct medical advice or diagnostics.'
          ]
        },
        {
          id: 'terms_2',
          headingAr: 'ثانيًا: حساب الطبيب ومسؤولياته',
          headingEn: '2. Doctor Account & Legal Responsibility',
          paragraphsAr: [
            'الطبيب المستخدم مسؤول مسؤولية كاملة عن صحة ودقة كل البيانات، والصور، ووسائل التواصل، والمواعيد، وأي محتوى ينشره ضمن موقعه.',
            'يتوجب على الطبيب تحديث بياناته بشكل دوري والالتزام بأحدث المعايير المهنية والأخلاقية المعمول بها في نطاقه الجغرافي.',
            'يُمنع انتحال صفة طبيب أو استخدام بيانات أو مستندات غير صحيحة أو مضللة، ويُعد ذلك مخالفة جسيمة تتيح للمنصة اتخاذ الإجراءات اللازمة.',
            'أي تعامل بين الطبيب والمريض يتم خارج نطاق المنصة أو من خلالها يخضع للطرفين وحدهما، ويتحمل الطبيب كامل المسؤولية المهنية والقانونية عنه.'
          ],
          paragraphsEn: [
            'Registered medical practitioners agree to provide accurate and updated information regarding their identity, specialties, certificates, and clinic locations. Doctors bear full legal and medical responsibility for all content and prices listed on their profiles.'
          ]
        },
        {
          id: 'terms_3',
          headingAr: 'ثالثًا: حقوق المنصة وإدارتها',
          headingEn: '3. Platform Rights & Management',
          paragraphsAr: [
            'يحق للمنصة تعليق أو حذف أي حساب يثبت مخالفته لهذه الشروط أو تقديمه معلومات أو خدمات مضللة أو غير مطابقة للحقيقة.',
            'يحق للمنصة طلب أي مستندات أو معلومات إضافية للتحقق من صحة البيانات المهنية للطبيب.',
            'تحتفظ المنصة بالحق في تعديل الخدمات، أو تحديث الشروط، أو إضافة بنود جديدة في أي وقت. وسيتم إبلاغ المستخدمين بالتعديلات الجوهرية عبر القنوات المتاحة.',
            'استمرارك في استخدام المنصة بعد أي تحديثات يُعد موافقة ضمنية على الشروط المعدّلة.'
          ],
          paragraphsEn: [
            'Dr Profile reserves the right to modify these terms or suspend accounts that violate policy or present fraudulent credentials.'
          ]
        },
        {
          id: 'terms_4',
          headingAr: 'رابعًا: حدود المسؤولية والتنبيهات',
          headingEn: '4. Limitation of Liability',
          paragraphsAr: [
            'المنصة ليست مسؤولة عن الأخطاء الطبية أو الاستشارات أو التشخيصات أو الرسائل المتبادلة بين الطبيب والمرضى. كما لا تتحمل المنصة أي التزام تجاه نتائج العلاج أو جودة الخدمة الطبية المقدمة من الطبيب.',
            'لا يقدم المحتوى المنشور بواسطة الأطباء على مواقعهم أي توصية علاجية من المنصة، ولا يُعد بديلاً عن زيارة الطبيب المختص أو الحصول على استشارة طبية مباشرة.'
          ],
          paragraphsEn: [
            'The platform carries no liability for direct medical interactions, diagnoses, treatments, or agreements formed between doctor and patient.'
          ]
        },
        {
          id: 'terms_5',
          headingAr: 'خامسًا: الامتثال للقوانين واللوائح',
          headingEn: '5. Regulatory Compliance',
          paragraphsAr: [
            'يلتزم الطبيب بجميع القوانين واللوائح المنظمة لممارسة مهنة الطب في جمهورية مصر العربية وأي سلطات تنظيمية أخرى ذات علاقة. ويُعد أي استخدام غير قانوني أو غير مصرح به للمنصة مخالفة تستوجب إيقاف الخدمة واتخاذ الإجراءات اللازمة.'
          ],
          paragraphsEn: [
            'Users agree to strictly abide by applicable healthcare regulations and local licensing authorities.'
          ]
        },
        {
          id: 'terms_6',
          headingAr: 'سادسًا: التواصل والتعديلات',
          headingEn: '6. Inquiries & Contact',
          paragraphsAr: [
            'لأي استفسارات أو ملاحظات بخصوص شروط الاستخدام، يمكنك التواصل مع فريق دكتور بروفايل عبر البريد الإلكتروني المعتمد. سيتم مراجعة أي طلبات أو شكاوى وفق سياسات المنصة وضوابطها القانونية.'
          ],
          paragraphsEn: [
            'For questions regarding our terms of service, please contact our legal and support team.'
          ]
        }
      ]
    },
    privacy: {
      badgeAr: 'وثائق قانونية',
      badgeEn: 'Legal Document',
      titleAr: 'سياسة الخصوصية وحماية البيانات',
      titleEn: 'Privacy and Data Protection Policy',
      subtitleAr: 'نلتزم في منصة دكتور بروفايل بالتعامل مع بيانات الأطباء والزوار بطريقة مناسبة وبما يتوافق مع القوانين واللوائح المعمول بها. توضح هذه السياسة أنواع البيانات التي قد يتم جمعها وكيفية استخدامها وحمايتها.',
      subtitleEn: 'At Dr Profile platform, we are committed to handling doctor and visitor data appropriately and in compliance with applicable laws and regulations. This policy explains the types of data collected, used, and protected.',
      contactEmail: 'drprofileweb@gmail.com',
      sections: [
        {
          id: 'priv_1',
          headingAr: 'أولًا: البيانات التي نجمعها من الأطباء',
          headingEn: '1. Data Collected from Doctors',
          introAr: 'قد نجمع البيانات الأساسية التي يقدمها الطبيب عند إنشاء حسابه أو بروفايله، مثل:',
          introEn: 'We may collect basic data provided by doctors when creating an account or profile, including:',
          bulletsAr: [
            'الاسم والتخصص الطبي.',
            'رقم الهاتف والبريد الإلكتروني.',
            'بيانات العيادات والفروع ومواقعها الجغرافية.',
            'الخدمات الطبية والأسعار ومواعيد العمل.',
            'الصور والشعارات والمحتوى التعريفي.',
            'روابط وسائل التواصل الاجتماعي وقنوات الاتصال.'
          ],
          bulletsEn: [
            'Doctor name and medical specialty.',
            'Phone number and email address.',
            'Clinic addresses and Google Maps locations.',
            'Medical services, pricing, and clinic schedules.',
            'Photos, logos, and profile descriptions.',
            'Social media links and direct contact channels.'
          ]
        },
        {
          id: 'priv_2',
          headingAr: 'ثانيًا: البيانات التي قد تُجمع من الزوار أو المرضى',
          headingEn: '2. Data Collected from Visitors & Patients',
          paragraphsAr: [
            'عند استخدام نماذج الحجز أو التواصل الموجودة في بروفايل الطبيب، قد يتم جمع بيانات أساسية يقدمها الزائر، مثل الاسم ورقم الهاتف والبريد الإلكتروني وبيانات الحجز أو سبب الزيارة إذا كان النموذج يتضمن ذلك.',
            'تُستخدم هذه البيانات بالقدر اللازم لتنفيذ طلب الحجز أو التواصل مع الطبيب أو العيادة.'
          ],
          paragraphsEn: [
            'When using booking or contact forms on a doctor profile, basic visitor data may be collected such as name, phone number, and appointment reason to process bookings.'
          ]
        },
        {
          id: 'priv_3',
          headingAr: 'ثالثًا: كيفية استخدام البيانات',
          headingEn: '3. How We Use Your Data',
          introAr: 'نستخدم البيانات بالقدر اللازم من أجل:',
          introEn: 'We use data as necessary to:',
          bulletsAr: [
            'تقديم خدمات المنصة وتشغيل البروفايلات الطبية.',
            'إدارة الحسابات والمواعيد والحجوزات.',
            'تمكين الطبيب من إدارة وتحديث بيانات بروفايله.',
            'تحسين أداء المنصة وتجربة المستخدم.',
            'تقديم الدعم الفني ومعالجة طلبات المستخدمين.',
            'إرسال الإشعارات المتعلقة بالخدمة أو الحساب.'
          ],
          bulletsEn: [
            'Provide platform services and power medical profiles.',
            'Manage accounts, appointments, and bookings.',
            'Enable doctors to update profile details effortlessly.',
            'Optimize platform performance and user experience.',
            'Deliver reliable technical support and assistance.'
          ]
        },
        {
          id: 'priv_4',
          headingAr: 'رابعًا: مشاركة البيانات وأمن المعلومات',
          headingEn: '4. Data Sharing & Security Standards',
          paragraphsAr: [
            'لا نقوم ببيع البيانات الشخصية للأطباء أو الزوار على الإطلاق.',
            'نتخذ إجراءات تقنية وتنظيمية مناسبة للمساعدة في حماية البيانات من الوصول غير المصرح به أو الفقد أو التعديل أو سوء الاستخدام وفق أعلى المعايير الرقمية.'
          ],
          paragraphsEn: [
            'We strictly never sell personal data of doctors or visitors.',
            'We employ modern technical and organizational measures to safeguard data against unauthorized access, loss, or misuse.'
          ]
        },
        {
          id: 'priv_5',
          headingAr: 'خامسًا: حقوقك وكيفية التواصل',
          headingEn: '5. User Rights & Contact',
          paragraphsAr: [
            'يحق للمستخدم طلب تحديث بياناته أو تعديلها أو حذفها وفق ما تسمح به القوانين واللوائح المعمول بها عبر مراسلتنا بالبريد الإلكتروني المعتمد.'
          ],
          paragraphsEn: [
            'Users may request data modification, updates, or erasure in accordance with applicable data protection laws.'
          ]
        }
      ]
    },
    disclaimer: {
      badgeAr: 'وثائق قانونية',
      badgeEn: 'Legal Document',
      titleAr: 'إخلاء المسؤولية والتنبيه الطبي',
      titleEn: 'Disclaimer & Medical Notice',
      subtitleAr: 'منصة دكتور بروفايل هي منصة تقنية تتيح للأطباء إنشاء وإدارة بروفايلاتهم الطبية وحضورهم الرقمي، بالإضافة إلى إدارة المواعيد وطلبات الحجز والتواصل مع المرضى. يوضح هذا المستند حدود مسؤولية المنصة والطبيب تجاه المحتوى والخدمات المقدمة من خلال بروفايل الطبيب.',
      subtitleEn: 'Dr Profile is a technical platform for doctors to manage medical profiles and appointment requests. This document sets out the limitations of liability for the platform and doctors.',
      contactEmail: 'drprofileweb@gmail.com',
      sections: [
        {
          id: 'disc_1',
          headingAr: 'أولًا: عدم تقديم خدمات طبية مباشرة',
          headingEn: '1. No Direct Medical Services',
          paragraphsAr: [
            'دكتور بروفايل لا يقدم تشخيصات أو استشارات أو علاجات طبية، ولا يحل محل الطبيب أو العيادة أو أي جهة طبية مختصة.',
            'جميع المعلومات والمحتويات الطبية التي ينشرها الطبيب في بروفايله يتم إدخالها وإدارتها من خلال الطبيب نفسه، ولا تمثل بالضرورة رأيًا أو توصية طبية صادرة عن المنصة.'
          ],
          paragraphsEn: [
            'Dr Profile does not provide direct medical diagnoses, consultations, or treatments, and does not replace licensed medical practitioners or healthcare institutions.'
          ]
        },
        {
          id: 'disc_2',
          headingAr: 'ثانيًا: مسؤولية المحتوى المنشور',
          headingEn: '2. Published Content Responsibility',
          paragraphsAr: [
            'يتحمل الطبيب المسؤولية الكاملة عن صحة ودقة المعلومات والصور والخدمات والأسعار وأي محتوى يقوم بإضافته إلى بروفايله.',
            'المنصة لا تتحمل مسؤولية الأخطاء أو المعلومات غير الدقيقة التي قد يتم نشرها من خلال حساب الطبيب.'
          ],
          paragraphsEn: [
            'Doctors bear full professional and legal responsibility for the accuracy of information, services, and pricing published on their profiles.'
          ]
        },
        {
          id: 'disc_3',
          headingAr: 'ثالثًا: عدم ضمان النتائج والقرارات الطبية',
          headingEn: '3. Medical Outcomes Disclaimer',
          paragraphsAr: [
            'لا تضمن المنصة أي نتائج علاجية أو تحسن صحي ناتج عن الخدمات الطبية التي يقدمها الطبيب.',
            'أي تشخيص أو توصية أو خطة علاجية يقدمها الطبيب تكون مسؤوليته المهنية الخاصة، ويجب على المريض الرجوع إلى الطبيب المختص للحصول على التقييم والاستشارة الطبية المناسبة.'
          ],
          paragraphsEn: [
            'The platform does not guarantee clinical outcomes resulting from medical services. Clinical judgment remains the sole responsibility of the practitioner.'
          ]
        },
        {
          id: 'disc_4',
          headingAr: 'رابعًا: العلاقة بين الطبيب والمريض',
          headingEn: '4. Direct Doctor-Patient Relationship',
          paragraphsAr: [
            'تتم العلاقة الطبية وأي اتفاقات أو تعاملات مالية أو علاجية بين الطبيب والمريض بشكل مباشر بين الطرفين، ولا تتحمل المنصة مسؤولية الاتفاقات أو النتائج بينهما.'
          ],
          paragraphsEn: [
            'The medical and financial relationship is formed directly between physician and patient.'
          ]
        },
        {
          id: 'disc_5',
          headingAr: 'خامسًا: التواصل والإبلاغ',
          headingEn: '5. Inquiries & Reporting',
          paragraphsAr: [
            'للاستفسارات أو الإبلاغ عن محتوى غير دقيق أو مشكلة متعلقة بأحد البروفايلات، يمكن التواصل مع فريق الدعم عبر البريد الإلكتروني المعتمد.'
          ],
          paragraphsEn: [
            'For questions or reporting concerns, please reach out to our team.'
          ]
        }
      ]
    },
    termsEmail: 'drprofileweb@gmail.com',
    privacyEmail: 'drprofileweb@gmail.com',
    disclaimerEmail: 'drprofileweb@gmail.com'
  }
};

import { DEMO_DOCTORS } from './data/demoDoctors';

export type SystemSpecialty = SpecialtyItem;

export const INITIAL_DOCTORS: Doctor[] = DEMO_DOCTORS;

export const INITIAL_APPOINTMENTS: Appointment[] = [];

export interface SpecialtyItem {
  id: string;
  name: string;
  icon?: string;
  count?: number;
}

export const INITIAL_SPECIALTIES: SpecialtyItem[] = [
  { id: 'dentist', name: 'طب وجراحة الأسنان' },
  { id: 'derma', name: 'الجلدية والتجميل والليزر' },
  { id: 'pediatric', name: 'طب الأطفال الحديثي الولادة' },
  { id: 'cardio', name: 'أمراض القلب والأوعية الدموية' },
  { id: 'ortho', name: 'جراحة العظام والمفاصل' },
  { id: 'ophthalmology', name: 'طب وجراحة العيون' },
  { id: 'neurology', name: 'أمراض المخ والأعصاب' },
  { id: 'psychiatry', name: 'الطب النفسي وعلاج الإدمان' },
  { id: 'internal', name: 'الأمراض الباطنية والجهاز الهضمي' },
  { id: 'ent', name: 'أنف وأذن وحنجرة' },
  { id: 'obs', name: 'نساء وتوليد' }
];

export interface DoctorBanner {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  icon?: string;
  color: 'blue' | 'emerald' | 'amber' | 'red' | 'indigo' | 'purple';
  buttonText?: string;
  buttonUrl?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  priority: number;
  isPinned?: boolean;
  targetAudience: 'all' | 'specific_specialty' | 'specific_doctors' | 'active' | 'trial' | 'expired' | 'whitelabel_enabled' | 'whitelabel_disabled';
  targetDoctorIds?: string[];
  targetSpecialty?: string;
  createdAt?: string;
  sentDate?: string;
  recipientCount?: number;
  readBy?: string[];
  readCount?: number;
}

// -------------------------------------------------------------
// Calendar & Subscription Date Calculations Rules
// السنة = 12 شهر | السنة = 365 يوم | السنة الكبيسة = 366 يوم | الـ 6 شهور = 183 يوم | الشهر المبسط = 30 يوم
// -------------------------------------------------------------
export const DAYS_IN_MONTH = 30;
export const DAYS_IN_6_MONTHS = 183;
export const DAYS_IN_YEAR = 365;
export const DAYS_IN_LEAP_YEAR = 366;
export const MONTHS_IN_YEAR = 12;

/**
 * فحص السنة الكبيسة (366 يوم بدلاً من 365 يوم)
 */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}

/**
 * حساب إجمالي عدد أيام سنة معينة (366 يوم للكبيسة أو 365 يوم للعادية)
 */
export function getDaysInYear(year: number): number {
  return isLeapYear(year) ? DAYS_IN_LEAP_YEAR : DAYS_IN_YEAR;
}

/**
 * إضافة مدة اشتراك دقيقة إلى تاريخ معين:
 * - 'annual': سنة كاملة (12 شهراً = 365/366 يوم)
 * - '6months': 6 أشهر = 183 يوماً بالتمام والكمال
 * - 'trial': 7 أيام تجريبية مجانية
 * - number: عدد أشهر محدد
 */
export function addSubscriptionDuration(
  baseDate: Date,
  durationType: 'annual' | '6months' | 'trial' | number
): Date {
  const result = new Date(baseDate);
  if (durationType === 'annual' || durationType === 12) {
    result.setFullYear(result.getFullYear() + 1);
  } else if (durationType === '6months' || durationType === 6) {
    result.setDate(result.getDate() + 183);
  } else if (durationType === 'trial') {
    result.setDate(result.getDate() + 7);
  } else if (typeof durationType === 'number') {
    result.setDate(result.getDate() + (durationType * 30));
  }
  return result;
}

/**
 * تنظيف وتصحيح تواريخ الطبيب لمنع أي تواريخ مفرطة أو مكررة عن طريق الخطأ
 */
export function sanitizeDoctorDates(doc: Doctor): Doctor {
  if (!doc) return doc;
  const regDate = doc.registeredAt ? new Date(doc.registeredAt) : new Date();
  const subType = doc.subscriptionType || 'annual';

  // إذا كان الحساب مدفوعاً
  if (doc.isPaidSubscription) {
    let correctedEndDate = doc.subscriptionEndDate;
    if (correctedEndDate) {
      const parsedEnd = new Date(correctedEndDate);
      if (!isNaN(parsedEnd.getTime())) {
        // تصحيح أي خطأ تاريخ مسبق (مثل 2028 بدلاً من 2027 أو 737 يوم بدلاً من 365 يوم)
        if (subType === 'annual') {
          const expectedAnnualEnd = addSubscriptionDuration(regDate, 'annual');
          const diffDays = Math.round((parsedEnd.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
          // إذا كان الفرق يزيد عن سنة واحدة (أكثر من 370 يوم)
          if (diffDays > 370 || parsedEnd.getFullYear() >= regDate.getFullYear() + 2 || parsedEnd.getTime() > expectedAnnualEnd.getTime() + 15 * 24 * 60 * 60 * 1000) {
            correctedEndDate = expectedAnnualEnd.toISOString().slice(0, 10);
          }
        } else if (subType === '6months') {
          const expected6mEnd = addSubscriptionDuration(regDate, '6months');
          const diffDays = Math.round((parsedEnd.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays !== 183 || diffDays < 175 || diffDays > 195 || parsedEnd.getTime() > expected6mEnd.getTime() + 10 * 24 * 60 * 60 * 1000) {
            correctedEndDate = expected6mEnd.toISOString().slice(0, 10);
          }
        }
      }
    } else {
      correctedEndDate = addSubscriptionDuration(regDate, subType).toISOString().slice(0, 10);
    }

    return {
      ...doc,
      subscriptionType: subType,
      subscriptionEndDate: correctedEndDate
    };
  }

  // إذا كان في الفترة التجريبية المجانية (7 أيام)
  const trialEndDate = addSubscriptionDuration(regDate, 'trial').toISOString();
  return {
    ...doc,
    trialEndDate: doc.trialEndDate || trialEndDate
  };
}

/**
 * الحصول على تاريخ انتهاء اشتراك أو تجربة الطبيب بدقة
 * السنة = 12 شهر = 365 يوم (أو 366 يوم للسنة الكبيسة) | الـ 6 شهور = 183 يوم
 */
export function getDoctorExpiryDate(doc: Doctor): Date {
  if (!doc) return new Date();
  const regDate = doc.registeredAt ? new Date(doc.registeredAt) : new Date();
  const subType = doc.subscriptionType || 'annual';

  // 1. إذا كان اشتراكاً مدفوعاً
  if (doc.isPaidSubscription) {
    if (doc.subscriptionEndDate) {
      const parsed = new Date(doc.subscriptionEndDate);
      if (!isNaN(parsed.getTime())) {
        // حماية ودقة: إذا كان اشتراك سنوي (سنة كاملة)، يتم الحساب كسنة من تاريخ التسجيل (14 أغسطس 2026 -> 14 أغسطس 2027)
        if (subType === 'annual') {
          const expectedAnnualEnd = addSubscriptionDuration(regDate, 'annual');
          const diffDays = Math.round((parsed.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays > 370 || parsed.getFullYear() >= regDate.getFullYear() + 2 || parsed.getTime() > expectedAnnualEnd.getTime() + 15 * 24 * 60 * 60 * 1000) {
            return expectedAnnualEnd;
          }
        } else if (subType === '6months') {
          const expected6mEnd = addSubscriptionDuration(regDate, '6months');
          const diffDays = Math.round((parsed.getTime() - regDate.getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays !== 183 || diffDays < 175 || diffDays > 195 || parsed.getTime() > expected6mEnd.getTime() + 10 * 24 * 60 * 60 * 1000) {
            return expected6mEnd;
          }
        }
        return parsed;
      }
    }
    return addSubscriptionDuration(regDate, subType);
  }

  // 2. إذا كان حساباً في الفترة التجريبية المجانية (7 أيام)
  if (doc.trialEndDate) {
    const parsed = new Date(doc.trialEndDate);
    if (!isNaN(parsed.getTime())) return parsed;
  }
  return addSubscriptionDuration(regDate, 'trial');
}

/**
 * حساب الأيام المتبقية حتى تاريخ انتهاء الاشتراك بدقة
 */
export function getDoctorDaysRemaining(doc: Doctor): number {
  if (!doc) return 0;
  const subType = doc.subscriptionType || 'annual';
  
  if (doc.isPaidSubscription || doc.isActiveSubscription) {
    if (subType === '6months') {
      return 183;
    }
    
    if (subType === 'annual') {
      return 365;
    }
  }
  
  const expiry = getDoctorExpiryDate(doc);
  const now = new Date();
  const d1 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const d2 = new Date(expiry.getFullYear(), expiry.getMonth(), expiry.getDate()).getTime();
  const diffTime = d2 - d1;
  const days = Math.round(diffTime / (1000 * 60 * 60 * 24));
  return days > 0 ? days : 0;
}

export const INITIAL_BANNERS: DoctorBanner[] = [];

/**
 * قائمة الـ 18 لون سادة المعتمدة للهوية البصرية للبروفايل
 */
export interface SolidThemeColor {
  color: string;
  name: string;
  icon: string;
}

export const SOLID_THEME_COLORS: SolidThemeColor[] = [
  { color: '#2563EB', name: 'أزرق طبي', icon: '🔵' },
  { color: '#0891B2', name: 'سماوي', icon: '🩵' },
  { color: '#059669', name: 'أخضر طبي', icon: '🟢' },
  { color: '#10B981', name: 'أخضر نعناعي', icon: '🌿' },
  { color: '#7C3AED', name: 'بنفسجي', icon: '🟣' },
  { color: '#DB2777', name: 'وردي طبي', icon: '🌸' },
  { color: '#EA580C', name: 'برتقالي هادئ', icon: '🟠' },
  { color: '#1E3A8A', name: 'كحلي', icon: '🔷' },
  { color: '#0D9488', name: 'تركواز طبي', icon: '🌊' },
  { color: '#4D7C0F', name: 'أخضر زيتي', icon: '🍃' },
  { color: '#881337', name: 'عنابي راقي', icon: '🍇' },
  { color: '#D97706', name: 'كهرماني دافئ', icon: '🍂' },
  { color: '#9333EA', name: 'لافندر طبي', icon: '🪻' },
  { color: '#0284C7', name: 'أزرق جليدي', icon: '🧊' },
  { color: '#78350F', name: 'بني موكا', icon: '🪵' },
  { color: '#334155', name: 'كربوني وقور', icon: '🌑' },
  { color: '#10244A', name: 'كحلي ملكي', icon: '💎' },
  { color: '#0F766E', name: 'بترولي عميق', icon: '🪸' },
];

/**
 * بنية بيانات القالب الجاهز (الهوية البصرية المتكاملة)
 */
export interface ReadyThemeTemplate {
  id: 'blue_medical' | 'cyan_calm' | 'green_health' | 'purple_tech' | 'pink_care' | string;
  name: string;
  personality: string;
  icon: string;
  description: string;
  bgDescription: string;
  motifDescription: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgClass: string;
  cardBorder: string;
  patternType: 'blue_medical' | 'cyan_calm' | 'green_health' | 'purple_tech' | 'pink_care' | string;
  badgeStyle: { bg: string; text: string; border: string };
  previewColorBar: string[];
}

export const READY_THEME_TEMPLATES: ReadyThemeTemplate[] = [
  {
    id: 'blue_medical',
    name: 'الأزرق الطبي',
    personality: 'احترافي، طبي، موثوق',
    icon: '🩺',
    description: 'أزرق طبي موثوق مع رسومات سماعة طبيب، نبض ECG، قلب، وكبسولات طبية',
    bgDescription: 'أبيض مائل للأزرق (#F8FAFC)',
    motifDescription: 'سماعة، نبض، قلب، كبسولات',
    primaryColor: '#2563EB',
    secondaryColor: '#1D4ED8',
    accentColor: '#60A5FA',
    bgClass: 'bg-[#F8FAFC]',
    cardBorder: 'border-blue-200/70',
    patternType: 'blue_medical',
    badgeStyle: { bg: 'bg-blue-100/90', text: 'text-blue-800', border: 'border-blue-300' },
    previewColorBar: ['#2563EB', '#60A5FA', '#F8FAFC']
  },
  {
    id: 'cyan_calm',
    name: 'السماوي الهادئ',
    personality: 'هادئ، نظيف، عصري',
    icon: '🩵',
    description: 'سماوي هادئ ونظيف مع رسومات رئتان، سماعة طبيب، نبض ECG، وقطرات طبية ناعمة',
    bgDescription: 'سماوي فاتح جدًا (#F0FDFA)',
    motifDescription: 'رئتان، سماعة، قطرات، نبض',
    primaryColor: '#0891B2',
    secondaryColor: '#0E7490',
    accentColor: '#22D3EE',
    bgClass: 'bg-[#F0FDFA]',
    cardBorder: 'border-cyan-200/70',
    patternType: 'cyan_calm',
    badgeStyle: { bg: 'bg-cyan-100/90', text: 'text-cyan-800', border: 'border-cyan-300' },
    previewColorBar: ['#0891B2', '#22D3EE', '#F0FDFA']
  },
  {
    id: 'green_health',
    name: 'الأخضر الصحي',
    personality: 'صحي، طبيعي، مريح',
    icon: '🌿',
    description: 'أخضر صحي طبيعي مع رسومات قلب، سماعة، كبسولات، وأوراق طبية',
    bgDescription: 'أخضر فاتح جدًا (#F0FDF4)',
    motifDescription: 'قلب، سماعة، كبسولات، أوراق',
    primaryColor: '#059669',
    secondaryColor: '#047857',
    accentColor: '#34D399',
    bgClass: 'bg-[#F0FDF4]',
    cardBorder: 'border-emerald-200/70',
    patternType: 'green_health',
    badgeStyle: { bg: 'bg-emerald-100/90', text: 'text-emerald-800', border: 'border-emerald-300' },
    previewColorBar: ['#059669', '#34D399', '#F0FDF4']
  },
  {
    id: 'purple_tech',
    name: 'البنفسجي الطبي',
    personality: 'حديث، مميز، تقني',
    icon: '🧬',
    description: 'بنفسجي طبي متطور مع رسومات مخ، خلايا، DNA، أعصاب، ونبض ECG',
    bgDescription: 'بنفسجي فاتح جدًا (#FAF5FF)',
    motifDescription: 'مخ، خلايا، DNA، أعصاب، نبض',
    primaryColor: '#7C3AED',
    secondaryColor: '#6D28D9',
    accentColor: '#A78BFA',
    bgClass: 'bg-[#FAF5FF]',
    cardBorder: 'border-purple-200/70',
    patternType: 'purple_tech',
    badgeStyle: { bg: 'bg-purple-100/90', text: 'text-purple-800', border: 'border-purple-300' },
    previewColorBar: ['#7C3AED', '#A78BFA', '#FAF5FF']
  },
  {
    id: 'pink_care',
    name: 'الوردي الطبي',
    personality: 'أنيق، ناعم، طبي',
    icon: '🌸',
    description: 'وردي طبي أنيق وناعم مع رسومات قلب، خلايا، عين، وعناصر جلدية وعناية',
    bgDescription: 'وردي فاتح جدًا (#FDF2F8)',
    motifDescription: 'قلب، خلايا، عين، أدوات عناية',
    primaryColor: '#DB2777',
    secondaryColor: '#BE185D',
    accentColor: '#F472B6',
    bgClass: 'bg-[#FDF2F8]',
    cardBorder: 'border-pink-200/70',
    patternType: 'pink_care',
    badgeStyle: { bg: 'bg-pink-100/90', text: 'text-pink-800', border: 'border-pink-300' },
    previewColorBar: ['#DB2777', '#F472B6', '#FDF2F8']
  },
  {
    id: 'black_clinical',
    name: 'الأسود الوقور',
    personality: 'فخم، هادئ، وعميق',
    icon: '🌑',
    description: 'أسود كربوني وقور مع رسومات سماعة طبية، نبض ECG، ومسارات تشخيص دقيقة',
    bgDescription: 'خلفية كربونية هادئة (#F8FAFC)',
    motifDescription: 'سماعة، نبض ECG، مسارات تشخيص',
    primaryColor: '#0F172A',
    secondaryColor: '#334155',
    accentColor: '#64748B',
    bgClass: 'bg-[#F8FAFC]',
    cardBorder: 'border-slate-300/70',
    patternType: 'black_clinical',
    badgeStyle: { bg: 'bg-slate-200', text: 'text-slate-900', border: 'border-slate-400' },
    previewColorBar: ['#0F172A', '#64748B', '#F1F5F9']
  },
  {
    id: 'navy_royal',
    name: 'الكحلي الملكي',
    personality: 'وقور، راقي، وملكـي',
    icon: '💎',
    description: 'كحلي كلاسيكي عميق مع رسومات شارات نبض، خلايا سريرية، وأدوات تشخيص',
    bgDescription: 'أبيض ثلجي كحلي (#F1F5F9)',
    motifDescription: 'شارات نبض، سماعة، مسارات كحلية',
    primaryColor: '#10244A',
    secondaryColor: '#1E3A8A',
    accentColor: '#3B82F6',
    bgClass: 'bg-[#F1F5F9]',
    cardBorder: 'border-indigo-200/70',
    patternType: 'navy_royal',
    badgeStyle: { bg: 'bg-indigo-100/90', text: 'text-indigo-900', border: 'border-indigo-300' },
    previewColorBar: ['#10244A', '#3B82F6', '#F1F5F9']
  },
  {
    id: 'amber_warm',
    name: 'العنبري الدافئ',
    personality: 'دافئ، مريح، ومشرق',
    icon: '🍂',
    description: 'عنبري ذهبي دافئ مع رسومات شمس حيوية، نبضات قلب، وكبسولات علاجية',
    bgDescription: 'عنبري دافئ فاتح (#FFFBEB)',
    motifDescription: 'شمس حيوية، نبض، كبسولات',
    primaryColor: '#D97706',
    secondaryColor: '#B45309',
    accentColor: '#F59E0B',
    bgClass: 'bg-[#FFFBEB]',
    cardBorder: 'border-amber-200/70',
    patternType: 'amber_warm',
    badgeStyle: { bg: 'bg-amber-100/90', text: 'text-amber-900', border: 'border-amber-300' },
    previewColorBar: ['#D97706', '#F59E0B', '#FFFBEB']
  },
  {
    id: 'teal_deep',
    name: 'البترولي العميق',
    personality: 'طبي متوازن ومريح',
    icon: '🪸',
    description: 'أخضر بترولي عميق مع رسومات موجات فحص، سماعة، وأدوات طبية انسيابية',
    bgDescription: 'بترولي فاتح هادئ (#F0FDFA)',
    motifDescription: 'موجات فحص، سماعة، كبسولات',
    primaryColor: '#0F766E',
    secondaryColor: '#115E59',
    accentColor: '#14B8A6',
    bgClass: 'bg-[#F0FDFA]',
    cardBorder: 'border-teal-200/70',
    patternType: 'teal_deep',
    badgeStyle: { bg: 'bg-teal-100/90', text: 'text-teal-900', border: 'border-teal-300' },
    previewColorBar: ['#0F766E', '#14B8A6', '#F0FDFA']
  },
  {
    id: 'lavender_prestige',
    name: 'اللافندر الراقي',
    personality: 'أنيق، هادئ المشاعر',
    icon: '🪻',
    description: 'لافندر ناعم مع رسومات تراكيب خلوية دقيقة، نبض، وشبكات طبية مريحة',
    bgDescription: 'لافندر فاتح جدًا (#FAF5FF)',
    motifDescription: 'تراكيب خلوية، نبض، شبكة مريحة',
    primaryColor: '#9333EA',
    secondaryColor: '#7E22CE',
    accentColor: '#C084FC',
    bgClass: 'bg-[#FAF5FF]',
    cardBorder: 'border-purple-200/70',
    patternType: 'lavender_prestige',
    badgeStyle: { bg: 'bg-purple-100/90', text: 'text-purple-900', border: 'border-purple-300' },
    previewColorBar: ['#9333EA', '#C084FC', '#FAF5FF']
  }
];

export function getThemeTemplate(templateId?: string): ReadyThemeTemplate | null {
  if (!templateId || templateId === 'solid' || templateId === 'default') return null;
  // Handle legacy ids or new ids
  const mapLegacy: Record<string, string> = {
    'medical': 'blue_medical',
    'calm': 'cyan_calm',
    'modern': 'purple_tech',
    'luxury': 'navy_royal',
    'soft': 'pink_care'
  };
  const targetId = mapLegacy[templateId] || templateId;
  return READY_THEME_TEMPLATES.find(t => t.id === targetId) || null;
}

/**
 * إرجاع لون النص المناسب (أبيض أو كحلي غامق) بناءً على لون الهوية المختار
 */
export function getThemeTextColor(themeColor?: string): string {
  const c = (themeColor || '').toUpperCase().trim();
  switch (c) {
    case '#0891B2': // 🩵 سماوي
    case '#059669': // 🟢 أخضر طبي
    case '#10B981': // 🌿 أخضر نعناعي
    case '#EA580C': // 🟠 برتقالي هادئ
    case '#0D9488': // 🌊 تركواز طبي
    case '#D97706': // 🍂 كهرماني دافئ
    case '#0284C7': // 🧊 أزرق جليدي
      return '#0F172A'; // كحلي غامق
    case '#2563EB': // 🔵 أزرق طبي
    case '#7C3AED': // 🟣 بنفسجي
    case '#DB2777': // 🌸 وردي طبي
    case '#1E3A8A': // 🔷 كحلي
    case '#4D7C0F': // 🍃 أخضر زيتي
    case '#881337': // 🍇 عنابي راقي
    case '#9333EA': // 🪻 لافندر طبي
    case '#78350F': // 🪵 بني موكا
    case '#334155': // 🌑 كربوني وقور
    case '#10244A': // 💎 كحلي ملكي
    case '#0F766E': // 🪸 بترولي عميق
    case '#4F46E5': // ⚡ نيلي عصري
      return '#FFFFFF'; // أبيض
    default:
      return '#FFFFFF'; // أبيض
  }
}



export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: string;
  read: boolean;
}
