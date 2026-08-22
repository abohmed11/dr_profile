import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Doctor, Appointment, LandingPageConfig, DoctorBanner } from '../types';

export const DEFAULT_SUPABASE_URL = 'https://yzkswkqdsqbspnpysesv.supabase.co';
export const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6a3N3a3Fkc3Fic3BucHlzZXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxNjExMTksImV4cCI6MjEwMDczNzExOX0.6khA0PLjbyFoZhvTrA3NO5SvuLiLSH5NXeWRBGg2MdE';

// Retrieve credentials from environment, localStorage, or user-provided defaults
export function getSupabaseCredentials(): { url: string; anonKey: string } {
  const metaEnv = (import.meta as unknown as { env: Record<string, string> }).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = localStorage.getItem('supabase_url') || '';
  const localKey = localStorage.getItem('supabase_key') || '';

  return {
    url: localUrl || envUrl || DEFAULT_SUPABASE_URL,
    anonKey: localKey || envKey || DEFAULT_SUPABASE_ANON_KEY,
  };
}

export function isSupabaseConfigured(): boolean {
  const metaEnv = (import.meta as unknown as { env: Record<string, string> }).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const localUrl = localStorage.getItem('supabase_url') || '';
  const url = localUrl || envUrl;

  if (!url) return false;
  if (url === DEFAULT_SUPABASE_URL || url.includes('yzkswkqdsqbspnpysesv')) {
    return false;
  }
  return true;
}

export function saveSupabaseCredentials(url: string, anonKey: string) {
  localStorage.setItem('supabase_url', url.trim());
  localStorage.setItem('supabase_key', anonKey.trim());
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const { url, anonKey } = getSupabaseCredentials();
  if (!url || !anonKey) {
    return null;
  }
  // Remove any trailing slash /rest/v1/ if user pasted endpoint path
  const cleanUrl = url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
  if (!cachedClient) {
    cachedClient = createClient(cleanUrl, anonKey);
  }
  return cachedClient;
}

// ----------------------------------------------------
// Supabase Database Sync Operations
// ----------------------------------------------------

export async function saveDoctorToSupabase(doctor: Doctor): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return 'العميل غير متصل بـ Supabase';
  try {
    const fullRow = {
      id: doctor.id,
      name: doctor.name || 'طبيب بدون اسم',
      name_en: doctor.nameEn || doctor.id || 'doctor',
      specialty: doctor.specialty || 'عام',
      job_title: doctor.jobTitle || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      whatsapp: doctor.whatsapp || '',
      avatar: doctor.avatar || '',
      bio: doctor.bio || '',
      experience: doctor.experience || 0,
      branches: doctor.branches || [],
      services: doctor.services || [],
      working_hours: doctor.workingHours || [],
      gallery: doctor.gallery || [],
      gallery_items: doctor.galleryItems || [],
      videos: doctor.videos || [],
      reviews: doctor.reviews || [],
      socials: doctor.socials || {},
      secretaries: doctor.secretaries || [],
      is_active_subscription: doctor.isActiveSubscription ?? true,
      registered_at: doctor.registeredAt || new Date().toISOString(),
      subscription_end_date: doctor.subscriptionEndDate || '',
      approval_status: doctor.approvalStatus || 'approved',
      rejection_reason: doctor.rejectionReason || '',
      subscription_type: doctor.subscriptionType || '6months',
      is_verified: doctor.isVerified ?? false,
      white_label: doctor.whiteLabel ?? false,
      features: doctor.features || {},
      certificates: doctor.certificates || [],
      site_type: doctor.siteType || 'profile',
      header_display_name: doctor.headerDisplayName || '',
      header_avatar: doctor.headerAvatar || '',
    };

    const { error: fullError } = await client.from('doctors').upsert(fullRow, { onConflict: 'id' });
    if (!fullError) return null;

    console.warn('Full doctor row upsert warning, trying core fields:', fullError.message);

    // Tier 2 fallback: standard core fields
    const coreRow = {
      id: doctor.id,
      name: doctor.name || 'طبيب بدون اسم',
      name_en: doctor.nameEn || doctor.id || 'doctor',
      specialty: doctor.specialty || 'عام',
      job_title: doctor.jobTitle || '',
      email: doctor.email || '',
      phone: doctor.phone || '',
      whatsapp: doctor.whatsapp || '',
      avatar: doctor.avatar || '',
      bio: doctor.bio || '',
      experience: doctor.experience || 0,
      branches: doctor.branches || [],
      services: doctor.services || [],
      working_hours: doctor.workingHours || [],
      gallery: doctor.gallery || [],
      videos: doctor.videos || [],
      reviews: doctor.reviews || [],
      socials: doctor.socials || {},
      secretaries: doctor.secretaries || [],
      is_active_subscription: doctor.isActiveSubscription ?? true,
      registered_at: doctor.registeredAt || new Date().toISOString(),
      approval_status: doctor.approvalStatus || 'approved',
      subscription_type: doctor.subscriptionType || '6months',
    };

    const { error: coreError } = await client.from('doctors').upsert(coreRow, { onConflict: 'id' });
    if (!coreError) return null;

    console.warn('Core doctor row upsert warning, trying minimal fields:', coreError.message);

    // Tier 3 fallback: absolute essential fields to guarantee insertion even on basic tables
    const minimalRow = {
      id: doctor.id,
      name: doctor.name || 'طبيب',
      specialty: doctor.specialty || 'عام',
      email: doctor.email || '',
      phone: doctor.phone || '',
    };
    const { error: minError } = await client.from('doctors').upsert(minimalRow, { onConflict: 'id' });
    if (minError) return `فشل الحفظ بـ Supabase: ${minError.message}`;
    return null;
  } catch (e: any) {
    console.error('Error saving doctor to Supabase:', e);
    return e.message || String(e);
  }
}

export async function deleteDoctorFromSupabase(doctorId: string): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return 'العميل غير متصل';
  try {
    const { error } = await client.from('doctors').delete().eq('id', doctorId);
    if (error) return error.message;
    return null;
  } catch (e: any) {
    console.error('Error deleting doctor from Supabase:', e);
    return e.message || String(e);
  }
}

export async function saveAppointmentToSupabase(appointment: Appointment): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return 'العميل غير متصل';
  try {
    const row = {
      id: appointment.id,
      doctor_id: appointment.doctorId || '',
      patient_name: appointment.patientName || 'مريض',
      patient_phone: appointment.patientPhone || '0000',
      whatsapp_number: appointment.whatsappNumber || '',
      date: appointment.date || new Date().toISOString().split('T')[0],
      time: appointment.time || '12:00',
      branch_id: appointment.branchId || '',
      status: appointment.status || 'pending',
      notes: appointment.notes || '',
      created_at: appointment.createdAt || new Date().toISOString(),
    };
    const { error } = await client.from('appointments').upsert(row, { onConflict: 'id' });
    if (error) return error.message;
    return null;
  } catch (e: any) {
    console.error('Error saving appointment to Supabase:', e);
    return e.message || String(e);
  }
}

export async function deleteAppointmentFromSupabase(appointmentId: string): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return 'العميل غير متصل';
  try {
    const { error } = await client.from('appointments').delete().eq('id', appointmentId);
    if (error) return error.message;
    return null;
  } catch (e: any) {
    console.error('Error deleting appointment from Supabase:', e);
    return e.message || String(e);
  }
}

export async function saveLandingConfigToSupabase(config: LandingPageConfig): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return 'العميل غير متصل';
  try {
    const row = {
      id: 'main_config',
      hero: config.hero,
      features: config.features,
      pricing: config.pricing,
      faq: config.faq,
      contact: config.contact,
      seo: config.seo,
    };
    const { error } = await client.from('landing_config').upsert(row, { onConflict: 'id' });
    if (error) return error.message;
    return null;
  } catch (e: any) {
    console.error('Error saving landing config to Supabase:', e);
    return e.message || String(e);
  }
}

export async function saveBannersToSupabase(banners: DoctorBanner[]): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return 'العميل غير متصل';
  try {
    for (const banner of banners) {
      const extra = {
        targetAudience: banner.targetAudience,
        targetSpecialty: banner.targetSpecialty,
        targetDoctorIds: banner.targetDoctorIds,
        startDate: banner.startDate,
        endDate: banner.endDate,
        icon: banner.icon,
        imageUrl: banner.imageUrl,
        buttonText: banner.buttonText,
        buttonUrl: banner.buttonUrl,
        isPinned: banner.isPinned,
        sentDate: banner.sentDate
      };
      const row = {
        id: banner.id,
        title: banner.title,
        description: (banner.description || '') + '|||JSON|||' + JSON.stringify(extra),
        color: banner.color || 'blue',
        is_active: banner.isActive ?? true,
        priority: banner.priority || 1,
      };
      const { error } = await client.from('banners').upsert(row, { onConflict: 'id' });
      if (error) return error.message;
    }
    return null;
  } catch (e: any) {
    console.error('Error saving banners to Supabase:', e);
    return e.message || String(e);
  }
}

export async function deleteBannerFromSupabase(bannerId: string): Promise<string | null> {
  const client = getSupabaseClient();
  if (!client) return 'العميل غير متصل';
  try {
    const { error } = await client.from('banners').delete().eq('id', bannerId);
    if (error) return error.message;
    return null;
  } catch (e: any) {
    console.error('Error deleting banner from Supabase:', e);
    return e.message || String(e);
  }
}

export async function fetchDoctorsFromSupabase(): Promise<Doctor[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client.from('doctors').select('*');
    if (error || !data) {
      if (error) console.warn('Error fetching doctors from Supabase:', error.message);
      return [];
    }
    return data.map((row: any) => ({
      id: row.id,
      name: row.name,
      nameEn: row.name_en || row.nameEn || row.id,
      specialty: row.specialty,
      jobTitle: row.job_title || row.jobTitle || '',
      email: row.email || '',
      phone: row.phone || '',
      whatsapp: row.whatsapp || '',
      avatar: row.avatar || '',
      bio: row.bio || '',
      experience: row.experience || 0,
      branches: Array.isArray(row.branches) ? row.branches : [],
      services: Array.isArray(row.services) ? row.services : [],
      workingHours: Array.isArray(row.working_hours) ? row.working_hours : [],
      gallery: Array.isArray(row.gallery) ? row.gallery : [],
      galleryItems: Array.isArray(row.gallery_items) ? row.gallery_items : [],
      videos: Array.isArray(row.videos) ? row.videos : [],
      reviews: Array.isArray(row.reviews) ? row.reviews : [],
      socials: row.socials || {},
      secretaries: Array.isArray(row.secretaries) ? row.secretaries : [],
      isActiveSubscription: row.is_active_subscription ?? true,
      registeredAt: row.registered_at || new Date().toISOString(),
      subscriptionEndDate: row.subscription_end_date || '',
      approvalStatus: row.approval_status || 'approved',
      rejectionReason: row.rejection_reason || '',
      subscriptionType: row.subscription_type || '6months',
      isVerified: row.is_verified ?? false,
      whiteLabel: row.white_label ?? false,
      features: row.features || {},
      certificates: Array.isArray(row.certificates) ? row.certificates : [],
      siteType: row.site_type || 'profile',
      headerDisplayName: row.header_display_name || '',
      headerAvatar: row.header_avatar || ''
    })) as Doctor[];
  } catch (e: any) {
    console.error('Failed to fetch doctors from Supabase:', e);
    return [];
  }
}

export async function fetchAppointmentsFromSupabase(): Promise<Appointment[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client.from('appointments').select('*');
    if (error || !data) return [];
    return data.map((row: any) => ({
      id: row.id,
      doctorId: row.doctor_id || row.doctorId || '',
      patientName: row.patient_name || row.patientName || '',
      patientPhone: row.patient_phone || row.patientPhone || '',
      whatsappNumber: row.whatsapp_number || row.whatsappNumber || '',
      date: row.date || '',
      time: row.time || '',
      branchId: row.branch_id || row.branchId || '',
      status: row.status || 'pending',
      notes: row.notes || '',
      createdAt: row.created_at || row.createdAt || new Date().toISOString()
    })) as Appointment[];
  } catch (e: any) {
    console.error('Failed to fetch appointments from Supabase:', e);
    return [];
  }
}

export async function fetchLandingConfigFromSupabase(): Promise<LandingPageConfig | null> {
  const client = getSupabaseClient();
  if (!client) return null;
  try {
    const { data, error } = await client.from('landing_config').select('*').eq('id', 'main_config').single();
    if (error || !data) return null;
    return {
      hero: data.hero,
      features: data.features,
      pricing: data.pricing,
      faq: data.faq,
      contact: data.contact,
      seo: data.seo
    } as LandingPageConfig;
  } catch (e: any) {
    return null;
  }
}

export async function fetchBannersFromSupabase(): Promise<DoctorBanner[]> {
  const client = getSupabaseClient();
  if (!client) return [];
  try {
    const { data, error } = await client.from('banners').select('*');
    if (error || !data) return [];
    return data.map((row: any) => {
      let desc = row.description || '';
      let extra: any = {};
      if (desc.includes('|||JSON|||')) {
        const parts = desc.split('|||JSON|||');
        desc = parts[0];
        try { extra = JSON.parse(parts[1]); } catch(e){}
      }
      return {
        id: row.id,
        title: row.title,
        description: desc,
        color: row.color || 'blue',
        isActive: row.is_active ?? true,
        priority: row.priority || 1,
        targetAudience: extra.targetAudience || 'all',
        targetSpecialty: extra.targetSpecialty,
        targetDoctorIds: extra.targetDoctorIds,
        startDate: extra.startDate,
        endDate: extra.endDate,
        icon: extra.icon,
        imageUrl: extra.imageUrl,
        buttonText: extra.buttonText,
        buttonUrl: extra.buttonUrl,
        isPinned: extra.isPinned,
        sentDate: extra.sentDate
      };
    }) as DoctorBanner[];
  } catch (e: any) {
    return [];
  }
}

export async function seedAllDataToSupabase(doctors: Doctor[], appointments: Appointment[], config: LandingPageConfig, banners: DoctorBanner[]): Promise<{ success: boolean; message: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { success: false, message: 'مفاتيح Supabase غير متصلة (يرجى إدخال رابط ومفتاح Supabase الخاص بك في خانة الإعدادات أولاً)' };
  }
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'مفاتيح Supabase غير متصلة' };
  }
  try {
    // Check if doctors table exists by doing a light select
    const { error: testErr } = await client.from('doctors').select('id').limit(1);
    if (testErr) {
      if (testErr.message.includes('does not exist') || testErr.code === '42P01') {
        return {
          success: false,
          message: 'الجداول غير موجودة في قاعدة بيانات Supabase الخاصة بك حتى الآن.',
          error: 'يرجى تشغيل كود SQL الموجود بالأسفل بداخل SQL Editor في Supabase لإنشاء الجداول أولاً.'
        };
      }
    }

    for (const doc of doctors) {
      const err = await saveDoctorToSupabase(doc);
      if (err) throw new Error(err);
    }
    for (const apt of appointments) {
      const err = await saveAppointmentToSupabase(apt);
      if (err) throw new Error(err);
    }
    const configErr = await saveLandingConfigToSupabase(config);
    if (configErr) throw new Error(configErr);

    const bannerErr = await saveBannersToSupabase(banners);
    if (bannerErr) throw new Error(bannerErr);

    return {
      success: true,
      message: `تم رفع وتغذية ${doctors.length} طبيب و ${appointments.length} حجز ومُعاملات المنصة إلى Supabase بنجاح!`
    };
  } catch (e: any) {
    console.warn('Supabase auto seed failed:', e.message || e);
    return {
      success: false,
      message: 'فشل رفع البيانات إلى Supabase',
      error: e.message || String(e)
    };
  }
}

// SQL Schema script for user to copy-paste into Supabase SQL Editor:
export const SUPABASE_SQL_SCHEMA = `
-- =========================================================
-- 1. Create or Upgrade Doctors Table (إنشاء أو تحديث جدول الأطباء)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL DEFAULT 'doctor',
  specialty TEXT NOT NULL DEFAULT 'عام'
);

-- Ensure ALL columns exist on existing table:
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS name_en TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS whatsapp TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS avatar TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS experience INT DEFAULT 0;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS branches JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS services JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS working_hours JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS gallery JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS gallery_items JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS videos JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS reviews JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS socials JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS secretaries JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS is_active_subscription BOOLEAN DEFAULT TRUE;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS registered_at TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS subscription_end_date TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'approved';
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS subscription_type TEXT DEFAULT '6months';
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS white_label BOOLEAN DEFAULT FALSE;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS features JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS certificates JSONB;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS site_type TEXT DEFAULT 'profile';
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS header_display_name TEXT;
ALTER TABLE public.doctors ADD COLUMN IF NOT EXISTS header_avatar TEXT;

-- =========================================================
-- 2. Create or Upgrade Appointments Table (إنشاء أو تحديث جدول الحجوزات)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  doctor_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL
);

ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS doctor_id TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS patient_name TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS patient_phone TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS date TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS time TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS branch_id TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS created_at TEXT;

-- =========================================================
-- 3. Landing Config Table
-- =========================================================
CREATE TABLE IF NOT EXISTS public.landing_config (
  id TEXT PRIMARY KEY,
  hero JSONB,
  features JSONB,
  pricing JSONB,
  faq JSONB,
  contact JSONB,
  seo JSONB
);

-- =========================================================
-- 4. Banners Table
-- =========================================================
CREATE TABLE IF NOT EXISTS public.banners (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  priority INT DEFAULT 1
);

-- =========================================================
-- 5. Row Level Security & Access Permissions (حل مشكلة Row-Level Security Policy)
-- =========================================================
ALTER TABLE public.doctors DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.landing_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners DISABLE ROW LEVEL SECURITY;

-- Remove any old blocking policies if present
DROP POLICY IF EXISTS "Allow public all doctors" ON public.doctors;
DROP POLICY IF EXISTS "Allow public all appointments" ON public.appointments;

-- Grant permissions to public anon API key
GRANT ALL ON TABLE public.doctors TO anon, authenticated, service_role, postgres;
GRANT ALL ON TABLE public.appointments TO anon, authenticated, service_role, postgres;
GRANT ALL ON TABLE public.landing_config TO anon, authenticated, service_role, postgres;
GRANT ALL ON TABLE public.banners TO anon, authenticated, service_role, postgres;

-- Create permissive fallback policies in case RLS is re-enabled
CREATE POLICY "Allow public all doctors" ON public.doctors FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all appointments" ON public.appointments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all landing" ON public.landing_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public all banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);
`;
