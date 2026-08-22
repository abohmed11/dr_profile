export interface ProfileTranslation {
  home: string;
  services: string;
  gallery: string;
  videos: string;
  certificates: string;
  reviews: string;
  booking: string;
  quickBook: string;
  callNow: string;
  navTitle: string;
  verifiedDoctor: string;
  ratingCount: string;
  whatsappClinic: string;
  facebookPage: string;
  instagramAccount: string;
  tiktokAccount: string;
  youtubeChannel: string;
  linkedinAccount: string;
  twitterAccount: string;
  telegramAccount: string;
  website: string;
  shareLocation: string;
  copied: string;
  downloadProfile: string;
  aboutDoctor: string;
  drPrefix: string;
  noBio: string;
  noServices: string;
  currency: string;
  noGallery: string;
  noVideos: string;
  noCertificates: string;
  noReviews: string;
  clinics: string;
  times: string;
  noSlots: string;
  fullName: string;
  phone: string;
  whatsappBooking: string;
  datePlaceholder: string;
  notesPlaceholder: string;
  confirmBooking: string;
  bookingSent: string;
  bookingSentDesc: string;
  bookingDetails: string;
  patientName: string;
  patientPhone: string;
  patientWhatsapp: string;
  clinicBranch: string;
  selectedTime: string;
  notes: string;
  done: string;
  allRightsReserved: string;
  backToHome: string;
  toggleLangTitle: string;
  verificationProtocol: string;
  verifiedAccredited: string;
  clinicEquipment: string;
  clinicOf: string;
  close: string;
  requiredFieldsAlert: string;
  phoneValidationAlert: string;
  doctorCardHeading: string;
}

export const profileTranslations: Record<'ar' | 'en', ProfileTranslation> = {
  ar: {
    home: 'الرئيسية',
    services: 'الخدمات',
    gallery: 'معرض الصور',
    videos: 'الفيديوهات',
    certificates: 'الشهادات',
    reviews: 'آراء المرضى',
    booking: 'حجز موعد',
    quickBook: 'احجز الآن',
    callNow: 'اتصل الآن',
    navTitle: 'أقسام الصفحة',
    verifiedDoctor: 'طبيب موثوق',
    ratingCount: 'تقييم',
    whatsappClinic: 'واتساب العيادة',
    facebookPage: 'صفحة الفيسبوك',
    instagramAccount: 'حساب الانستجرام',
    tiktokAccount: 'تيك توك',
    youtubeChannel: 'قناة اليوتيوب',
    linkedinAccount: 'لينكد إن',
    twitterAccount: 'تويتر (X)',
    telegramAccount: 'تيليجرام',
    website: 'الموقع الإلكتروني',
    shareLocation: 'مشاركة الموقع والصفحة',
    copied: 'تم النسخ بنجاح!',
    downloadProfile: 'تحميل الملف التعريفي (CV)',
    aboutDoctor: 'عن الدكتور',
    drPrefix: 'دكتور',
    noBio: 'لا توجد سيرة ذاتية مضافة حالياً.',
    noServices: 'لا توجد خدمات مضافة حالياً',
    currency: 'جنيه',
    noGallery: 'لا توجد صور مضافة حالياً في المعرض',
    noVideos: 'لا توجد فيديوهات مضافة حالياً',
    noCertificates: 'لا توجد شهادات مضافة حالياً',
    noReviews: 'لا توجد آراء للمرضى مضافة حالياً',
    clinics: 'العيادات',
    times: 'المواعيد',
    noSlots: 'لا توجد مواعيد متاحة للحجز حالياً',
    fullName: 'الاسم الكامل',
    phone: 'رقم الجوال',
    whatsappBooking: 'رقم الواتساب لتاكيد الحجز',
    datePlaceholder: 'يوم - شهر - سنة',
    notesPlaceholder: 'ملاحظات إضافية...',
    confirmBooking: 'تأكيد الحجز',
    bookingSent: 'تم إرسال طلب الحجز',
    bookingSentDesc: 'تم إرسال طلب الحجز إلى العيادة. سيتم مراجعة طلبك والتواصل معك في أقرب وقت لتأكيد الحجز',
    bookingDetails: 'تفاصيل الحجز:',
    patientName: 'اسم المريض:',
    patientPhone: 'رقم الجوال:',
    patientWhatsapp: 'رقم الواتساب:',
    clinicBranch: 'العيادة / الفرع:',
    selectedTime: 'الموعد المحدد:',
    notes: 'ملاحظات:',
    done: 'تم',
    allRightsReserved: 'جميع الحقوق محفوظة',
    backToHome: 'الانتقال إلى الصفحة الرئيسية',
    toggleLangTitle: 'Switch to English',
    verificationProtocol: 'بروتوكول التحقق الطبي المستمر من الهوية والمؤهلات',
    verifiedAccredited: 'تم التوثيق والاعتماد',
    clinicEquipment: 'تجهيزات العيادة الطبية المتطورة',
    clinicOf: 'عيادة دكتور',
    close: 'إغلاق',
    requiredFieldsAlert: 'يرجى ملء كافة خانات الحجز الإجبارية',
    phoneValidationAlert: 'يرجى إدخال رقم هاتف صحيح مكون من 11 رقم يبدأ بـ 01',
    doctorCardHeading: 'العيادات:'
  },
  en: {
    home: 'Home',
    services: 'Services',
    gallery: 'Gallery',
    videos: 'Videos',
    certificates: 'Certificates',
    reviews: 'Reviews',
    booking: 'Book Appointment',
    quickBook: 'Book Now',
    callNow: 'Call Now',
    navTitle: 'Navigation Menu',
    verifiedDoctor: 'Verified Doctor',
    ratingCount: 'reviews',
    whatsappClinic: 'Clinic WhatsApp',
    facebookPage: 'Facebook Page',
    instagramAccount: 'Instagram',
    tiktokAccount: 'TikTok',
    youtubeChannel: 'YouTube Channel',
    linkedinAccount: 'LinkedIn',
    twitterAccount: 'Twitter (X)',
    telegramAccount: 'Telegram',
    website: 'Official Website',
    shareLocation: 'Share Location & Page',
    copied: 'Link Copied Successfully!',
    downloadProfile: 'Download Profile Card',
    aboutDoctor: 'About the Doctor',
    drPrefix: 'Dr.',
    noBio: 'No biography added yet.',
    noServices: 'No medical services listed yet.',
    currency: 'EGP',
    noGallery: 'No clinic photos available in the gallery yet.',
    noVideos: 'No videos available yet.',
    noCertificates: 'No certificates added yet.',
    noReviews: 'No patient reviews yet.',
    clinics: 'Clinics',
    times: 'Schedules',
    noSlots: 'No available appointment slots at this time.',
    fullName: 'Full Name',
    phone: 'Mobile Number',
    whatsappBooking: 'WhatsApp for Confirmation',
    datePlaceholder: 'Day - Month - Year',
    notesPlaceholder: 'Additional Notes...',
    confirmBooking: 'Confirm Booking',
    bookingSent: 'Booking Request Sent',
    bookingSentDesc: 'Your appointment request has been submitted. The clinic will review and contact you shortly for confirmation.',
    bookingDetails: 'Booking Details:',
    patientName: 'Patient Name:',
    patientPhone: 'Phone Number:',
    patientWhatsapp: 'WhatsApp Number:',
    clinicBranch: 'Clinic / Branch:',
    selectedTime: 'Selected Time:',
    notes: 'Notes:',
    done: 'Done',
    allRightsReserved: 'All Rights Reserved',
    backToHome: 'Back to Home Portal',
    toggleLangTitle: 'التحويل للعربية',
    verificationProtocol: 'Continuous medical verification of credentials & identity',
    verifiedAccredited: 'Verified & Accredited',
    clinicEquipment: 'Advanced Medical Clinic Facilities',
    clinicOf: 'Clinic of Dr.',
    close: 'Close',
    requiredFieldsAlert: 'Please fill in all mandatory booking fields',
    phoneValidationAlert: 'Please enter a valid 11-digit phone number starting with 01',
    doctorCardHeading: 'Clinics:'
  }
};

/**
 * Normalizes Arabic text for flexible dictionary matching.
 */
function normalizeArabic(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove tashkeel
    .replace(/[أإآآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ـ/g, '')
    .replace(/\s+/g, ' ');
}

const MEDICAL_EXACT_MAP: Record<string, string> = {
  'طبيبه اسنان': 'Dentist',
  'طبيبة اسنان': 'Dentist',
  'طبيب اسنان': 'Dentist',
  'طبيب الاسنان': 'Dentist',
  'طبيبه الاسنان': 'Dentist',
  'دكتور اسنان': 'Dentist',
  'دكتوره اسنان': 'Dentist',
  'دكتور الاسنان': 'Dentist',
  'دكتوره الاسنان': 'Dentist',
  'اخصائي اسنان': 'Dental Specialist',
  'اخصائيه اسنان': 'Dental Specialist',
  'استشاري اسنان': 'Dental Consultant',
  'استشاريه اسنان': 'Dental Consultant',
  'جراحه الفم والاسنان': 'Oral & Dental Surgery',
  'طب وجراحه الفم والاسنان': 'Oral & Dental Medicine & Surgery',
  'اخصائي طب وجراحه الفم والاسنان': 'Specialist of Oral & Dental Medicine & Surgery',
  'استشاري طب وجراحه الفم والاسنان': 'Consultant of Oral & Dental Medicine & Surgery',
  'اخصائي تقويم الاسنان': 'Orthodontics Specialist',
  'استشاري تقويم الاسنان': 'Orthodontics Consultant',
  'اخصائي زراعه الاسنان': 'Dental Implantology Specialist',
  'استشاري زراعه الاسنان': 'Dental Implantology Consultant',
  'اخصائي تركيبات الاسنان': 'Prosthodontics Specialist',
  'اخصائي علاج الجذور': 'Endodontics Specialist',
  'اخصائي طب اسنان الاطفال': 'Pediatric Dentistry Specialist',

  // Orthopedics
  'طبيب عظام': 'Orthopedic Doctor',
  'دكتور عظام': 'Orthopedist',
  'اخصائي عظام': 'Orthopedics Specialist',
  'اخصائي جراحه العظام': 'Orthopedic Surgery Specialist',
  'استشاري عظام': 'Orthopedics Consultant',
  'استشاري جراحه العظام': 'Consultant of Orthopedic Surgery',
  'استشاري جراحه العظام والمفاصل': 'Consultant of Orthopedic & Joint Surgery',
  'جراحه العظام والمفاصل والعمود الفقري': 'Orthopedic, Joint & Spine Surgery',

  // Dermatology
  'طبيب جلديه': 'Dermatologist',
  'طبيبه جلديه': 'Dermatologist',
  'دكتور جلديه': 'Dermatologist',
  'دكتوره جلديه': 'Dermatologist',
  'اخصائي جلديه': 'Dermatology Specialist',
  'اخصائيه جلديه': 'Dermatology Specialist',
  'اخصائي الجلديه والتجميل': 'Dermatology & Cosmetology Specialist',
  'اخصائيه الجلديه والتجميل': 'Dermatology & Cosmetology Specialist',
  'استشاري جلديه': 'Dermatology Consultant',
  'استشاريه جلديه': 'Dermatology Consultant',
  'استشاري الجلديه والتناسليه والتجميل': 'Consultant of Dermatology, Venereology & Cosmetology',
  'استشاريه الجلديه والتناسليه والتجميل': 'Consultant of Dermatology, Venereology & Cosmetology',
  'استشاري الجلديه والتناسليه والتجميل والليزر': 'Consultant of Dermatology, Venereology, Cosmetology & Laser',

  // Cardiology
  'طبيب قلب': 'Cardiologist',
  'دكتور قلب': 'Cardiologist',
  'اخصائي قلب': 'Cardiology Specialist',
  'اخصائي امراض القلب': 'Cardiology Specialist',
  'استشاري قلب': 'Cardiology Consultant',
  'استشاري امراض القلب': 'Consultant of Cardiology',
  'استشاري امراض القلب والاوعيه الدمويه': 'Consultant of Cardiology & Vascular Diseases',
  'استشاري جراحه القلب والصدر': 'Consultant of Cardiothoracic Surgery',

  // Pediatrics
  'طبيب اطفال': 'Pediatrician',
  'طبيبه اطفال': 'Pediatrician',
  'دكتور اطفال': 'Pediatrician',
  'دكتوره اطفال': 'Pediatrician',
  'اخصائي اطفال': 'Pediatrics Specialist',
  'اخصائيه اطفال': 'Pediatrics Specialist',
  'اخصائي طب الاطفال': 'Pediatrics Specialist',
  'اخصائي طب الاطفال وحديثي الولاده': 'Pediatrics & Neonatology Specialist',
  'استشاري اطفال': 'Pediatrics Consultant',
  'استشاريه اطفال': 'Pediatrics Consultant',
  'استشاري طب الاطفال': 'Consultant of Pediatrics',
  'استشاري طب الاطفال وحديثي الولاده': 'Consultant of Pediatrics & Neonatology',

  // Ophthalmology
  'طبيب عيون': 'Ophthalmologist',
  'دكتور عيون': 'Ophthalmologist',
  'اخصائي عيون': 'Ophthalmology Specialist',
  'اخصائي طب وجراحه العيون': 'Specialist of Ophthalmology & Eye Surgery',
  'استشاري عيون': 'Ophthalmology Consultant',
  'استشاري طب وجراحه العيون': 'Consultant of Ophthalmology & Eye Surgery',
  'استشاري جراحه الشبكيه والجسم الزجاجي': 'Consultant of Vitreoretinal Surgery',

  // Obstetrics & Gynecology
  'طبيب نساء وتوليد': 'Obstetrician & Gynecologist',
  'طبيبه نساء وتوليد': 'Obstetrician & Gynecologist',
  'دكتور نساء وتوليد': 'Obstetrician & Gynecologist',
  'دكتوره نساء وتوليد': 'Obstetrician & Gynecologist',
  'اخصائي نساء وتوليد': 'Obstetrics & Gynecology Specialist',
  'اخصائيه نساء وتوليد': 'Obstetrics & Gynecology Specialist',
  'استشاري نساء وتوليد': 'Obstetrics & Gynecology Consultant',
  'استشاريه نساء وتوليد': 'Obstetrics & Gynecology Consultant',
  'استشاري امراض النساء والتوليد وعلاج العقم': 'Consultant of Obstetrics, Gynecology & Infertility',
  'استشاريه امراض النساء والتوليد وعلاج العقم': 'Consultant of Obstetrics, Gynecology & Infertility',
  'استشاري جراحه المناظير والحقن المجهري': 'Consultant of Laparoscopy & IVF/ICSI',

  // Internal Medicine & GI
  'طبيب باطنه': 'Internist',
  'دكتور باطنه': 'Internist',
  'اخصائي باطنه': 'Internal Medicine Specialist',
  'اخصائي الامراض الباطنيه': 'Internal Medicine Specialist',
  'استشاري باطنه': 'Internal Medicine Consultant',
  'استشاري الامراض الباطنيه': 'Consultant of Internal Medicine',
  'استشاري الباطنه والجهاز الهضمي والكبد': 'Consultant of Internal Medicine, Gastroenterology & Hepatology',
  'استشاري الجهاز الهضمي والكبد والمناظير': 'Consultant of Gastroenterology, Hepatology & Endoscopy',
  'استشاري السكر والغدد الصماء': 'Consultant of Diabetes & Endocrinology',
  'استشاري امراض الكلي': 'Consultant of Nephrology',

  // ENT
  'طبيب انف واذن وحنجره': 'ENT Specialist',
  'دكتور انف واذن وحنجره': 'ENT Specialist',
  'اخصائي انف واذن وحنجره': 'ENT Specialist',
  'استشاري انف واذن وحنجره': 'ENT Consultant',
  'استشاري جراحه الانف والاذن والحنجره': 'Consultant of ENT & Head and Neck Surgery',

  // Neurology & Neurosurgery
  'طبيب مخ واعصاب': 'Neurologist',
  'دكتور مخ واعصاب': 'Neurologist',
  'اخصائي مخ واعصاب': 'Neurology Specialist',
  'استشاري مخ واعصاب': 'Neurology Consultant',
  'استشاري امراض المخ والاعصاب والطب النفسي': 'Consultant of Neurology & Psychiatry',
  'استشاري جراحه المخ والاعصاب والعمود الفقري': 'Consultant of Neurosurgery & Spine Surgery',

  // General Surgery & Plastic Surgery
  'جراح عام': 'General Surgeon',
  'اخصائي جراحه عامه': 'General Surgery Specialist',
  'استشاري جراحه عامه': 'General Surgery Consultant',
  'استشاري الجراحه العامه والمناظير': 'Consultant of General & Laparoscopic Surgery',
  'استشاري جراحه الاورام': 'Consultant of Surgical Oncology',
  'اخصائي جراحه التجميل': 'Plastic Surgery Specialist',
  'استشاري جراحه التجميل والحروق': 'Consultant of Plastic & Reconstructive Surgery',

  // Urology
  'طبيب مسالك بوليه': 'Urologist',
  'دكتور مسالك بوليه': 'Urologist',
  'اخصائي مسالك بوليه': 'Urology Specialist',
  'استشاري مسالك بوليه': 'Urology Consultant',
  'استشاري جراحه المسالك البوليه والتناسليه وعقم الذكوره': 'Consultant of Urology, Andrology & Male Infertility',

  // Physiotherapy & Nutrition
  'دكتور علاج طبيعي': 'Physiotherapist',
  'دكتوره علاج طبيعي': 'Physiotherapist',
  'اخصائي علاج طبيعي': 'Physical Therapy Specialist',
  'اخصائيه علاج طبيعي': 'Physical Therapy Specialist',
  'استشاري علاج طبيعي': 'Physical Therapy Consultant',
  'استشاري العلاج الطبيعي والتاهيل': 'Consultant of Physical Therapy & Rehabilitation',
  'اخصائي تغذيه علاجيه': 'Clinical Nutrition Specialist',
  'اخصائيه تغذيه علاجيه': 'Clinical Nutrition Specialist',
  'استشاري تغذيه علاجيه': 'Clinical Nutrition Consultant',
  'اخصائي تغذيه علاجيه وعلاج السمنه والنحافه': 'Clinical Nutrition & Weight Management Specialist',

  // Psychiatry
  'طبيب نفسي': 'Psychiatrist',
  'دكتور نفسي': 'Psychiatrist',
  'اخصائي طب نفسي': 'Psychiatry Specialist',
  'استشاري الطب النفسي وعلاج الادمان': 'Consultant of Psychiatry & Addiction Treatment',

  // Pulmonology
  'طبيب صدر وجهاز تنفسي': 'Pulmonologist',
  'اخصائي امراض الصدر': 'Pulmonology Specialist',
  'استشاري الامراض الصدريه والحساسيه': 'Consultant of Pulmonology & Allergy'
};

const TITLE_PREFIX_MAP: Array<{ ar: string; en: string }> = [
  { ar: 'استاذ دكتور', en: 'Prof. Dr. of ' },
  { ar: 'استاذ مساعد', en: 'Assoc. Prof. of ' },
  { ar: 'استاذ', en: 'Professor of ' },
  { ar: 'مدرس', en: 'Lecturer of ' },
  { ar: 'استشاري اول', en: 'Senior Consultant of ' },
  { ar: 'استشاريه اولي', en: 'Senior Consultant of ' },
  { ar: 'استشاري', en: 'Consultant of ' },
  { ar: 'استشاريه', en: 'Consultant of ' },
  { ar: 'اخصائي اول', en: 'Senior Specialist of ' },
  { ar: 'اخصائيه اولي', en: 'Senior Specialist of ' },
  { ar: 'اخصائي', en: 'Specialist of ' },
  { ar: 'اخصائيه', en: 'Specialist of ' },
  { ar: 'طبيب مقيم', en: 'Resident of ' },
  { ar: 'طبيبه مقيمه', en: 'Resident of ' },
  { ar: 'طبيب', en: 'Doctor of ' },
  { ar: 'طبيبه', en: 'Doctor of ' },
  { ar: 'دكتور', en: 'Dr. of ' },
  { ar: 'دكتوره', en: 'Dr. of ' }
];

const SPECIALTY_KEYWORD_MAP: Array<{ ar: string; en: string }> = [
  { ar: 'اسنان', en: 'Dentistry' },
  { ar: 'طب وجراحه الفم والاسنان', en: 'Oral & Dental Medicine and Surgery' },
  { ar: 'جراحه الفم والاسنان', en: 'Oral and Maxillofacial Surgery' },
  { ar: 'تقويم الاسنان', en: 'Orthodontics' },
  { ar: 'زراعه الاسنان', en: 'Dental Implantology' },
  { ar: 'عظام', en: 'Orthopedics & Joint Surgery' },
  { ar: 'جراحه العظام', en: 'Orthopedic Surgery' },
  { ar: 'جلديه', en: 'Dermatology & Cosmetology' },
  { ar: 'الجلديه والتناسليه', en: 'Dermatology & Venereology' },
  { ar: 'قلب', en: 'Cardiology' },
  { ar: 'امراض القلب والاوعيه الدمويه', en: 'Cardiology & Vascular Diseases' },
  { ar: 'اطفال', en: 'Pediatrics' },
  { ar: 'طب الاطفال وحديثي الولاده', en: 'Pediatrics & Neonatology' },
  { ar: 'عيون', en: 'Ophthalmology' },
  { ar: 'طب وجراحه العيون', en: 'Ophthalmology & Eye Surgery' },
  { ar: 'نساء وتوليد', en: 'Obstetrics & Gynecology' },
  { ar: 'امراض النساء والتوليد', en: 'Obstetrics & Gynecology' },
  { ar: 'باطنه', en: 'Internal Medicine' },
  { ar: 'الامراض الباطنيه', en: 'Internal Medicine' },
  { ar: 'الجهاز الهضمي والكبد', en: 'Gastroenterology & Hepatology' },
  { ar: 'انف واذن وحنجره', en: 'ENT (Ear, Nose & Throat)' },
  { ar: 'مخ واعصاب', en: 'Neurology' },
  { ar: 'جراحه المخ والاعصاب', en: 'Neurosurgery' },
  { ar: 'جراحه عامه', en: 'General Surgery' },
  { ar: 'جراحه التجميل', en: 'Plastic & Reconstructive Surgery' },
  { ar: 'مسالك بوليه', en: 'Urology' },
  { ar: 'علاج طبيعي', en: 'Physical Therapy' },
  { ar: 'تغذيه علاجيه', en: 'Clinical Nutrition' },
  { ar: 'طب نفسي', en: 'Psychiatry' },
  { ar: 'امراض الصدر', en: 'Pulmonology' },
  { ar: 'اورام', en: 'Oncology' },
  { ar: 'كلي', en: 'Nephrology' },
  { ar: 'روماتيزم ومناعه', en: 'Rheumatology & Immunology' },
  { ar: 'تخدير وعلاج الالم', en: 'Anesthesiology & Pain Management' },
  { ar: 'اشعه تشخيصيه', en: 'Diagnostic Radiology' },
  { ar: 'تحاليل طبيه', en: 'Clinical Pathology' }
];

/**
 * Automatically translates Arabic medical job titles and specialties to English.
 */
export function translateMedicalJobTitle(arabicTitle: string): string {
  if (!arabicTitle || arabicTitle.trim() === '') return '';
  
  // If already mostly English (contains latin alphabet)
  if (/[a-zA-Z]/.test(arabicTitle)) {
    return arabicTitle;
  }

  const normalized = normalizeArabic(arabicTitle);

  // 1. Direct exact dictionary match
  if (MEDICAL_EXACT_MAP[normalized]) {
    return MEDICAL_EXACT_MAP[normalized];
  }

  // Check substrings for direct keys
  for (const [key, val] of Object.entries(MEDICAL_EXACT_MAP)) {
    if (normalized === key || normalized.includes(key)) {
      return val;
    }
  }

  // 2. Pattern based match: Prefix + Specialty
  for (const prefix of TITLE_PREFIX_MAP) {
    if (normalized.startsWith(prefix.ar)) {
      const rest = normalized.slice(prefix.ar.length).trim();
      for (const spec of SPECIALTY_KEYWORD_MAP) {
        if (rest.includes(spec.ar)) {
          return `${prefix.en}${spec.en}`;
        }
      }
      return `${prefix.en}${rest}`;
    }
  }

  // 3. Specialty alone
  for (const spec of SPECIALTY_KEYWORD_MAP) {
    if (normalized.includes(spec.ar)) {
      return spec.en;
    }
  }

  return arabicTitle;
}

const BRANCH_EXACT_MAP: Record<string, string> = {
  'العيادة الرئيسية': 'Main Clinic',
  'العياده الرئيسيه': 'Main Clinic',
  'الفرع الرئيسي': 'Main Branch',
  'الفرع الرئسي': 'Main Branch',
  'فرع رئيسي': 'Main Branch',
  'العيادة': 'Clinic',
  'العياده': 'Clinic',
  'العيادة الخاصة': 'Private Clinic',
  'العياده الخاصه': 'Private Clinic',
  'فرع المهندسين': 'Mohandessin Branch',
  'فرع المعادي': 'Maadi Branch',
  'فرع التجمع': 'New Cairo Branch',
  'فرع التجمع الخامس': 'Fifth Settlement Branch',
  'فرع التجمع الاول': 'First Settlement Branch',
  'فرع القاهرة الجديدة': 'New Cairo Branch',
  'فرع القاهره الجديده': 'New Cairo Branch',
  'فرع الشيخ زايد': 'Sheikh Zayed Branch',
  'فرع زايد': 'Sheikh Zayed Branch',
  'فرع 6 اكتوبر': '6th of October Branch',
  'فرع السادس من اكتوبر': '6th of October Branch',
  'فرع مدينة نصر': 'Nasr City Branch',
  'فرع مدينه نصر': 'Nasr City Branch',
  'فرع مصر الجديدة': 'Heliopolis Branch',
  'فرع مصر الجديده': 'Heliopolis Branch',
  'فرع الدقي': 'Dokki Branch',
  'فرع الهرم': 'Haram Branch',
  'فرع فيصل': 'Faisal Branch',
  'فرع شبرا': 'Shubra Branch',
  'فرع شبرا مصر': 'Shubra Branch',
  'فرع شبرا الخيمة': 'Shubra El Kheima Branch',
  'فرع شبرا الخيمه': 'Shubra El Kheima Branch',
  'فرع الزمالك': 'Zamalek Branch',
  'فرع وسط البلد': 'Downtown Branch',
  'فرع المقطم': 'Mokattam Branch',
  'فرع حلوان': 'Helwan Branch',
  'فرع المعصرة': 'Maasara Branch',
  'فرع الشروق': 'El Shorouk Branch',
  'فرع مدينتي': 'Madinaty Branch',
  'فرع الرحاب': 'Rehab City Branch',
  'فرع العاشر من رمضان': '10th of Ramadan Branch',
  'فرع العبور': 'Obour City Branch',
  'فرع بدر': 'Badr City Branch',
  'فرع الاسكندرية': 'Alexandria Branch',
  'فرع الإسكندرية': 'Alexandria Branch',
  'فرع اسكندرية': 'Alexandria Branch',
  'فرع سموحة': 'Smouha Branch',
  'فرع سموحه': 'Smouha Branch',
  'فرع لوران': 'Loran Branch',
  'فرع جناكليس': 'Ginaklis Branch',
  'فرع سيدي جابر': 'Sidi Gaber Branch',
  'فرع محطة الرمل': 'Raml Station Branch',
  'فرع طنطا': 'Tanta Branch',
  'فرع المنصورة': 'Mansoura Branch',
  'فرع المنصوره': 'Mansoura Branch',
  'فرع الزقازيق': 'Zagazig Branch',
  'فرع بنها': 'Benha Branch',
  'فرع الاسماعيلية': 'Ismailia Branch',
  'فرع الإسماعيلية': 'Ismailia Branch',
  'فرع اسماعلية': 'Ismailia Branch',
  'فرع بورسعيد': 'Port Said Branch',
  'فرع السويس': 'Suez Branch',
  'فرع دمياط': 'Damietta Branch',
  'فرع دمياط الجديدة': 'New Damietta Branch',
  'فرع كفر الشيخ': 'Kafr El Sheikh Branch',
  'فرع دمنهور': 'Damanhour Branch',
  'فرع المحلة': 'El Mahalla Branch',
  'فرع المحلة الكبرى': 'El Mahalla El Kubra Branch',
  'فرع شبين الكوم': 'Shebin El Koum Branch',
  'فرع الفيوم': 'Fayoum Branch',
  'فرع بني سويف': 'Beni Suef Branch',
  'فرع المنيا': 'Minya Branch',
  'فرع اسيوط': 'Assiut Branch',
  'فرع أسيوط': 'Assiut Branch',
  'فرع سوهاج': 'Sohag Branch',
  'فرع قنا': 'Qena Branch',
  'فرع الاقصر': 'Luxor Branch',
  'فرع الأقصر': 'Luxor Branch',
  'فرع اسوان': 'Aswan Branch',
  'فرع أسوان': 'Aswan Branch',
  'فرع الغردقة': 'Hurghada Branch',
  'فرع الغردقه': 'Hurghada Branch',
  'فرع شرم الشيخ': 'Sharm El Sheikh Branch',
  'فرع مرسى مطروح': 'Marsa Matrouh Branch'
};

const DISTRICT_NAMES_MAP: Array<{ ar: string; en: string }> = [
  { ar: 'الرئيسية', en: 'Main' },
  { ar: 'الرئيسي', en: 'Main' },
  { ar: 'التجمع الخامس', en: 'Fifth Settlement' },
  { ar: 'التجمع الاول', en: 'First Settlement' },
  { ar: 'التجمع الثالث', en: 'Third Settlement' },
  { ar: 'التجمع', en: 'New Cairo' },
  { ar: 'القاهرة الجديدة', en: 'New Cairo' },
  { ar: 'القاهره الجديده', en: 'New Cairo' },
  { ar: 'الشيخ زايد', en: 'Sheikh Zayed' },
  { ar: 'مدينة نصر', en: 'Nasr City' },
  { ar: 'مدينه نصر', en: 'Nasr City' },
  { ar: 'مصر الجديدة', en: 'Heliopolis' },
  { ar: 'مصر الجديده', en: 'Heliopolis' },
  { ar: 'المهندسين', en: 'Mohandessin' },
  { ar: 'المعادي', en: 'Maadi' },
  { ar: 'الدقي', en: 'Dokki' },
  { ar: 'الزمالك', en: 'Zamalek' },
  { ar: 'الهرم', en: 'Haram' },
  { ar: 'فيصل', en: 'Faisal' },
  { ar: 'وسط البلد', en: 'Downtown' },
  { ar: 'شبرا', en: 'Shubra' },
  { ar: 'حلوان', en: 'Helwan' },
  { ar: 'المقطم', en: 'Mokattam' },
  { ar: 'الشروق', en: 'El Shorouk' },
  { ar: 'مدينتي', en: 'Madinaty' },
  { ar: 'الرحاب', en: 'Rehab City' },
  { ar: 'العاشر من رمضان', en: '10th of Ramadan' },
  { ar: 'العبور', en: 'Obour City' },
  { ar: 'بدر', en: 'Badr City' },
  { ar: '6 اكتوبر', en: '6th of October' },
  { ar: 'السادس من اكتوبر', en: '6th of October' },
  { ar: 'اكتوبر', en: '6th of October' },
  { ar: 'الاسكندرية', en: 'Alexandria' },
  { ar: 'الإسكندرية', en: 'Alexandria' },
  { ar: 'اسكندرية', en: 'Alexandria' },
  { ar: 'سموحة', en: 'Smouha' },
  { ar: 'طنطا', en: 'Tanta' },
  { ar: 'المنصورة', en: 'Mansoura' },
  { ar: 'المنصوره', en: 'Mansoura' },
  { ar: 'الزقازيق', en: 'Zagazig' },
  { ar: 'بنها', en: 'Benha' },
  { ar: 'الاسماعيلية', en: 'Ismailia' },
  { ar: 'الإسماعيلية', en: 'Ismailia' },
  { ar: 'بورسعيد', en: 'Port Said' },
  { ar: 'السويس', en: 'Suez' },
  { ar: 'دمياط', en: 'Damietta' },
  { ar: 'كفر الشيخ', en: 'Kafr El Sheikh' },
  { ar: 'دمنهور', en: 'Damanhour' },
  { ar: 'المحلة', en: 'El Mahalla' },
  { ar: 'شبين الكوم', en: 'Shebin El Koum' },
  { ar: 'الفيوم', en: 'Fayoum' },
  { ar: 'بني سويف', en: 'Beni Suef' },
  { ar: 'المنيا', en: 'Minya' },
  { ar: 'اسيوط', en: 'Assiut' },
  { ar: 'أسيوط', en: 'Assiut' },
  { ar: 'سوهاج', en: 'Sohag' },
  { ar: 'قنا', en: 'Qena' },
  { ar: 'الاقصر', en: 'Luxor' },
  { ar: 'الأقصر', en: 'Luxor' },
  { ar: 'اسوان', en: 'Aswan' },
  { ar: 'أسوان', en: 'Aswan' },
  { ar: 'الغردقة', en: 'Hurghada' },
  { ar: 'شرم الشيخ', en: 'Sharm El Sheikh' },
  { ar: 'مطروح', en: 'Marsa Matrouh' },
  { ar: 'القاهرة', en: 'Cairo' },
  { ar: 'القاهره', en: 'Cairo' },
  { ar: 'الجيزة', en: 'Giza' },
  { ar: 'الجيزه', en: 'Giza' },
  { ar: 'الرياض', en: 'Riyadh' },
  { ar: 'جدة', en: 'Jeddah' },
  { ar: 'جده', en: 'Jeddah' },
  { ar: 'مكة', en: 'Makkah' },
  { ar: 'المدينة', en: 'Madinah' },
  { ar: 'الدمام', en: 'Dammam' },
  { ar: 'الخبر', en: 'Khobar' },
  { ar: 'دبي', en: 'Dubai' },
  { ar: 'ابوظبي', en: 'Abu Dhabi' },
  { ar: 'الشارقة', en: 'Sharjah' }
];

/**
 * Translates branch names (e.g., "العيادة الرئيسية" -> "Main Clinic", "فرع المهندسين" -> "Mohandessin Branch")
 */
export function translateBranchName(arabicName?: string): string {
  if (!arabicName || arabicName.trim() === '') return 'Main Clinic';
  
  if (/[a-zA-Z]/.test(arabicName)) {
    return arabicName;
  }

  const normalized = normalizeArabic(arabicName);

  if (BRANCH_EXACT_MAP[normalized]) {
    return BRANCH_EXACT_MAP[normalized];
  }

  for (const [key, val] of Object.entries(BRANCH_EXACT_MAP)) {
    if (normalized === key || normalized.includes(key)) {
      return val;
    }
  }

  // Check if starts with "فرع "
  if (normalized.startsWith('فرع ')) {
    const rest = normalized.slice(5).trim();
    for (const dist of DISTRICT_NAMES_MAP) {
      if (rest.includes(normalizeArabic(dist.ar))) {
        return `${dist.en} Branch`;
      }
    }
    return `${rest} Branch`;
  }

  // Check if starts with "عيادة "
  if (normalized.startsWith('عيادة ') || normalized.startsWith('عياده ')) {
    const rest = normalized.slice(6).trim();
    for (const dist of DISTRICT_NAMES_MAP) {
      if (rest.includes(normalizeArabic(dist.ar))) {
        return `${dist.en} Clinic`;
      }
    }
    return `${rest} Clinic`;
  }

  for (const dist of DISTRICT_NAMES_MAP) {
    if (normalized.includes(normalizeArabic(dist.ar))) {
      return `${dist.en} Branch`;
    }
  }

  return arabicName;
}

const ADDRESS_WORDS_MAP: Array<{ ar: string; en: string }> = [
  { ar: 'العنوان الرئيسي', en: 'Main Address' },
  { ar: 'العنوان الرئسي', en: 'Main Address' },
  { ar: 'العنوان', en: 'Address' },
  { ar: 'شارع', en: 'St.' },
  { ar: 'ش.', en: 'St.' },
  { ar: 'ش ', en: 'St. ' },
  { ar: 'طريق', en: 'Road' },
  { ar: 'ميدان', en: 'Square' },
  { ar: 'برج', en: 'Tower' },
  { ar: 'عمارة', en: 'Bldg.' },
  { ar: 'عماره', en: 'Bldg.' },
  { ar: 'مبنى', en: 'Building' },
  { ar: 'الدور', en: 'Floor' },
  { ar: 'شقة', en: 'Apt.' },
  { ar: 'شقه', en: 'Apt.' },
  { ar: 'بجوار', en: 'near' },
  { ar: 'أمام', en: 'in front of' },
  { ar: 'امام', en: 'in front of' },
  { ar: 'خلف', en: 'behind' },
  { ar: 'فوق', en: 'above' },
  { ar: 'تقاطع', en: 'intersection' },
  { ar: 'مركز', en: 'Center' },
  { ar: 'مستشفى', en: 'Hospital' },
  { ar: 'مستشفي', en: 'Hospital' },
  { ar: 'محطة', en: 'Station' },
  { ar: 'محطه', en: 'Station' },
  { ar: 'مترو', en: 'Metro' },
  { ar: 'مول', en: 'Mall' },
  { ar: 'كمبوند', en: 'Compound' },
  { ar: 'حي', en: 'District' },
  { ar: 'الحي', en: 'District' },
  { ar: 'المنطقة', en: 'Zone' },
  { ar: 'المنطقه', en: 'Zone' },
  { ar: 'قطعة', en: 'Plot' },
  { ar: 'قطعه', en: 'Plot' },
  { ar: 'محافظة', en: 'Gov.' },
  { ar: 'محافظه', en: 'Gov.' },
  { ar: 'مدينة', en: 'City' },
  { ar: 'مدينه', en: 'City' }
];

/**
 * Translates Arabic clinic addresses into readable English addresses
 */
export function translateClinicAddress(arabicAddress?: string): string {
  if (!arabicAddress || arabicAddress.trim() === '') return 'Main Address';

  if (/[a-zA-Z]/.test(arabicAddress) && !/[\u0600-\u06FF]/.test(arabicAddress)) {
    return arabicAddress;
  }

  let result = arabicAddress;

  // Replace common district & city names
  for (const item of DISTRICT_NAMES_MAP) {
    const regex = new RegExp(item.ar, 'g');
    result = result.replace(regex, item.en);
  }

  // Replace address keywords
  for (const item of ADDRESS_WORDS_MAP) {
    const regex = new RegExp(item.ar, 'g');
    result = result.replace(regex, item.en);
  }

  // Clean up any remaining artifacts
  return result.replace(/\s+/g, ' ').trim();
}

const DAY_MAP: Record<string, string> = {
  'السبت': 'Saturday',
  'سبت': 'Saturday',
  'الأحد': 'Sunday',
  'الاحد': 'Sunday',
  'أحد': 'Sunday',
  'احد': 'Sunday',
  'الإثنين': 'Monday',
  'الاثنين': 'Monday',
  'إثنين': 'Monday',
  'اثنين': 'Monday',
  'الثلاثاء': 'Tuesday',
  'ثلاثاء': 'Tuesday',
  'الأربعاء': 'Wednesday',
  'الاربعاء': 'Wednesday',
  'أربعاء': 'Wednesday',
  'اربعاء': 'Wednesday',
  'الخميس': 'Thursday',
  'خميس': 'Thursday',
  'الجمعة': 'Friday',
  'الجمعه': 'Friday',
  'جمعة': 'Friday',
  'جمعه': 'Friday',
  'يومياً': 'Daily',
  'يوميا': 'Daily',
  'طوال الأسبوع': 'All Week',
  'طوال الاسبوع': 'All Week'
};

/**
 * Translates Arabic day names to English
 */
export function translateDayName(day?: string): string {
  if (!day || day.trim() === '') return '';
  const trimmed = day.trim();
  if (DAY_MAP[trimmed]) return DAY_MAP[trimmed];

  const normalized = normalizeArabic(trimmed);
  if (DAY_MAP[normalized]) return DAY_MAP[normalized];

  for (const [ar, en] of Object.entries(DAY_MAP)) {
    if (normalized.includes(normalizeArabic(ar))) {
      return en;
    }
  }

  return day;
}

/**
 * Translates time ranges like "10:00 ص - 08:00 م" to "10:00 AM - 08:00 PM"
 */
export function translateTimeSlot(timeStr?: string): string {
  if (!timeStr || timeStr.trim() === '') return '';

  return timeStr
    .replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d).toString())
    .replace(/صباحاً|صباحا/g, 'AM')
    .replace(/مساءً|مساء/g, 'PM')
    .replace(/\bص\b/g, 'AM')
    .replace(/\bم\b/g, 'PM')
    .replace(/ص(?=[^\w]|$)/g, 'AM')
    .replace(/م(?=[^\w]|$)/g, 'PM')
    .trim();
}

