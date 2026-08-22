/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TranslatedFeatureCategory {
  id: string;
  title: string;
  imageUrl: string;
  items: string[];
}

export const DEFAULT_FEATURES_AR: TranslatedFeatureCategory[] = [
  {
    id: 'cat-1',
    title: 'بروفايلك الطبي متكامل',
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
    imageUrl: 'https://e.top4top.io/p_38742udfi1.png',
    items: [
      'حجز المواعيد بسهولة',
      'مواعيد العمل وجدول العيادة',
      'إدارة وتنظيم المواعيد',
      'تأكيد أو إلغاء الحجز',
      'إجازات الطبيب والاستثناءات',
      'تأكيد الحجز عبر واتساب',
      'إضافة أكثر من سكرتارية'
    ]
  },
  {
    id: 'cat-3',
    title: 'التسويق والثقة',
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
    imageUrl: 'https://g.top4top.io/p_3874u8tug1.png',
    items: [
      'لوحة تحكم سهلة الاستخدام',
      'يعمل على جميع الأجهزة',
      'دعم فني متواصل',
      'تحديثات وتطوير مستمر',
      'إدارة طلبات حجوزات المرضى',
      'تعديل بيانات البروفايل'
    ]
  }
];

export const DEFAULT_FEATURES_EN: TranslatedFeatureCategory[] = [
  {
    id: 'cat-1',
    title: 'Integrated Medical Profile',
    imageUrl: 'https://h.top4top.io/p_3874v0ld91.png',
    items: [
      'Bio and Medical Qualifications',
      'Services, Special Offers & Pricing',
      'Clinic Photo Gallery',
      'Dedicated Custom Link with Your Name',
      'Add Multiple Clinic Branches',
      'Multiple Templates & Modern Design'
    ]
  },
  {
    id: 'cat-2',
    title: 'Appointment Management',
    imageUrl: 'https://e.top4top.io/p_38742udfi1.png',
    items: [
      'Fast and Easy Appointment Booking',
      'Working Hours & Clinic Schedule',
      'Manage & Organize Daily Appointments',
      'Confirm or Cancel Bookings Instantly',
      'Doctor Leaves & Exception Days',
      'Instant WhatsApp Booking Confirmation',
      'Add Multiple Assistants / Receptionists'
    ]
  },
  {
    id: 'cat-3',
    title: 'Marketing & Patient Trust',
    imageUrl: 'https://i.top4top.io/p_3874myu051.png',
    items: [
      'Patient Reviews & Testimonials',
      'QR Code to Share Your Profile',
      'Google Maps Clinic Locations',
      'Direct Social Media Links',
      'Profile Verification Badge',
      'Certificates & Accreditations'
    ]
  },
  {
    id: 'cat-4',
    title: 'Management & Technical Support',
    imageUrl: 'https://g.top4top.io/p_3874u8tug1.png',
    items: [
      'Easy-to-Use Control Dashboard',
      'Fully Responsive on All Devices',
      'Continuous Technical Support',
      'Regular Upgrades & Feature Enhancements',
      'Manage Patient Booking Inquiries',
      'Real-Time Profile Data Updates'
    ]
  }
];

// Helper to translate arbitrary category item text from Arabic to English
export const featureItemTranslations: { [key: string]: string } = {
  'نبذة عنك ومؤهلاتك العلمية': 'Bio and Medical Qualifications',
  'الخدمات والعروض والأسعار': 'Services, Special Offers & Pricing',
  'معرض صور العيادة': 'Clinic Photo Gallery',
  'رابط شخصي باسمك': 'Dedicated Custom Link with Your Name',
  'إضافة أكثر من فرع للعيادة': 'Add Multiple Clinic Branches',
  'قوالب متعددة وتصميم احترافي': 'Multiple Templates & Modern Design',
  'حجز المواعيد بسهولة': 'Fast and Easy Appointment Booking',
  'مواعيد العمل وجدول العيادة': 'Working Hours & Clinic Schedule',
  'إدارة وتنظيم المواعيد': 'Manage & Organize Daily Appointments',
  'تأكيد أو إلغاء الحجز': 'Confirm or Cancel Bookings Instantly',
  'إجازات الطبيب والاستثناءات': 'Doctor Leaves & Exception Days',
  'تأكيد الحجز عبر واتساب': 'Instant WhatsApp Booking Confirmation',
  'إضافة أكثر من سكرتارية': 'Add Multiple Assistants / Receptionists',
  'تقييمات وآراء المرضى': 'Patient Reviews & Testimonials',
  'QR Code لمشاركة بروفايلك': 'QR Code to Share Your Profile',
  'خرائط Google لموقع العيادة': 'Google Maps Clinic Locations',
  'روابط السوشيال ميديا': 'Direct Social Media Links',
  'توثيق البروفايل': 'Profile Verification Badge',
  'إضافة الشهادات': 'Certificates & Accreditations',
  'لوحة تحكم سهلة الاستخدام': 'Easy-to-Use Control Dashboard',
  'يعمل على جميع الأجهزة': 'Fully Responsive on All Devices',
  'دعم فني متواصل': 'Continuous Technical Support',
  'تحديثات وتطوير مستمر': 'Regular Upgrades & Feature Enhancements',
  'إدارة طلبات حجوزات المرضى': 'Manage Patient Booking Inquiries',
  'تعديل بيانات البروفايل': 'Real-Time Profile Data Updates',
  'بروفايل طبي': 'Medical Profile',
  'رابط خاص': 'Dedicated Custom Link',
  'قوالب متعددة': 'Multiple Templates',
  'نبذة ومؤهلات': 'Bio & Qualifications',
  'تخصص وخدمات': 'Specialties & Services',
  'أسعار الخدمات': 'Service Pricing',
  'صور العيادة': 'Clinic Photos',
  'فيديوهات': 'Video Embeds',
  'مواعيد العمل': 'Working Hours',
  'لوكيشن العيادة': 'Clinic Map Location',
  'سوشيال ميديا': 'Social Media Links',
  'حجز مواعيد': 'Online Booking',
  'تقييمات المرضى': 'Patient Reviews',
  'اضافة سكرتارية متعددة': 'Multiple Secretary Accounts',
  'لوحة تحكم احترافية': 'Professional Control Panel',
  'متوافق مع الأجهزة': 'Responsive on All Devices',
  'دعم فني': 'Technical Support',
  'تحديثات مجانية': 'Free Feature Updates'
};

export const translateItemText = (text: string, isEn: boolean): string => {
  if (!isEn) return text;
  if (featureItemTranslations[text]) return featureItemTranslations[text];
  return text;
};
