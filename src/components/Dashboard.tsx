/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Doctor, Appointment, Branch, WorkingHour, INITIAL_SPECIALTIES, DEFAULT_DOCTOR_FEATURES, DoctorCertificate, GalleryItem, Service, Review, Secretary, SecretaryPermissions, DoctorBanner, DoctorInvoice, PatientRecord, PatientConsultation, getDoctorDaysRemaining, getDoctorExpiryDate, sanitizeDoctorDates, getThemeTextColor, SOLID_THEME_COLORS, READY_THEME_TEMPLATES, getThemeTemplate } from '../types';
import { isDoctorTrialActive, isDoctorTrialExpired, getDoctorRemainingTrialDays } from '../lib/subscriptionUtils';
import { downloadInvoiceDirectly } from '../lib/invoiceUtils';
import InvoiceModal from './InvoiceModal';
import DoctorProfile from './DoctorProfile';
import { 
  LogOut, Eye, EyeOff, User, Sparkles, LayoutDashboard, Settings, Upload, 
  Trash2, CheckCircle2, Save, Phone, Mail, Award, FileText,
  Building2, Calendar, Globe, AlertCircle, Camera, Clock,
  Plus, Edit3, MapPin, DollarSign, X, Check, Copy, Share2,
  Facebook, Instagram, Linkedin, Twitter, Youtube, ExternalLink,
  MessageSquare, Send, Link2, MessageCircle, Star, Video, Image as ImageIcon,
  ToggleLeft, ToggleRight, Search, XCircle, Filter, Download, TrendingUp, BarChart2,
  Users, UserCheck, ShieldCheck, Lock, UserPlus, Menu, Moon, Sun,
  ShoppingBag, ShoppingCart, Palette, Info, CreditCard, Crown, RefreshCw,
  Monitor, Smartphone, Bell, SlidersHorizontal, Activity, CalendarDays, RotateCcw, Stethoscope, Pill, ClipboardList
} from 'lucide-react';

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.87 2.89 2.89 0 0 1-2.89-2.87 2.89 2.89 0 0 1 2.89-2.88c.28 0 .55.04.81.12v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.7a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 4.76 1.5v-3.4a4.84 4.84 0 0 1-1-.46z"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.35-.01-1.02-.2-1.52-.37-.62-.2-1.11-.31-1.07-.65.02-.18.27-.36.75-.55 2.94-1.28 4.9-2.12 5.88-2.53 2.8-1.16 3.38-1.36 3.76-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

interface DashboardProps {
  doctor: Doctor;
  loggedSecretary?: Secretary | null;
  userRole?: 'admin' | 'doctor' | 'secretary' | null;
  appointments: Appointment[];
  banners?: DoctorBanner[];
  landingConfig?: any;
  onUpdateDoctor: (updatedDoc: Doctor) => void;
  onUpdateAppointments: (updatedApts: Appointment[]) => void;
  onLogout: () => void;
  onPreviewPublicSite: (username: string) => void;
}

const getTwoWordName = (fullName: string) => {
  if (!fullName) return 'دكتور';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  if (['د.', 'دكتور', 'دكتورة', 'أ.د', 'أ.د.', 'استشاري', 'استشارية', 'د'].includes(parts[0])) {
    return parts.slice(0, 3).join(' ');
  }
  return parts.slice(0, 2).join(' ');
};

const DEFAULT_WEEK_DAYS = [
  'السبت',
  'الأحد',
  'الإثنين',
  'الثلاثاء',
  'الأربعاء',
  'الخميس',
  'الجمعة',
];

export default function Dashboard({ 
  doctor, 
  loggedSecretary,
  userRole,
  appointments, 
  banners,
  landingConfig,
  onUpdateDoctor, 
  onUpdateAppointments, 
  onLogout, 
  onPreviewPublicSite 
}: DashboardProps) {

  // Helper to calculate initial allowed tab for secretary or doctor
  const getInitialTab = (): 'subscription' | 'account' | 'bookings' | 'consultations' | 'secretaries' | 'services' | 'gallery' | 'videos' | 'certificates' | 'reviews' | 'schedules' | 'contact' => {
    if (!loggedSecretary) return 'bookings';
    if (loggedSecretary.permissions?.viewAppointments !== false) return 'bookings';
    if (loggedSecretary.permissions?.manageConsultations !== false) return 'consultations';
    if (loggedSecretary.permissions?.manageServices) return 'services';
    if (loggedSecretary.permissions?.manageGallery) return 'gallery';
    if (loggedSecretary.permissions?.manageVideos) return 'videos';
    if (loggedSecretary.permissions?.manageCertificates) return 'certificates';
    if (loggedSecretary.permissions?.managePatients) return 'reviews';
    if (loggedSecretary.permissions?.manageClinics) return 'schedules';
    if (loggedSecretary.permissions?.sendWhatsapp) return 'contact';
    return 'bookings';
  };

  // Active section tab
  const [activeTab, setActiveTab] = useState<
    'subscription' | 'account' | 'appearance' | 'perks' | 'bookings' | 'consultations' | 'secretaries' | 'services' | 'gallery' | 'videos' | 'certificates' | 'reviews' | 'schedules' | 'contact' | 'content'
  >(getInitialTab());

  // Mobile navigation drawer toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // State for Doctor/Secretary Dark Mode
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('doctor_dark_mode') === 'true';
    } catch {
      return false;
    }
  });

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Calculate Active Banners/Notifications
  const [dismissedBannerIds, setDismissedBannerIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dismissed_banners');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [readInvoiceIds, setReadInvoiceIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('read_invoice_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const activeBanners = (banners || []).filter(banner => {
    if (!banner.isActive) return false;
    
    const today = new Date().toISOString().slice(0, 10);
    if (banner.startDate && today < banner.startDate) return false;
    if (banner.endDate && today > banner.endDate) return false;

    const docSub = doctor.subscriptionType || 'annual';
    const isWL = !!doctor.whiteLabel;
    const isPaid = doctor.isActiveSubscription && doctor.isPaidSubscription;
    const isTrial = doctor.isTrial || !doctor.isPaidSubscription;
    const exp = getDoctorExpiryDate(doctor);
    const isExpired = exp < new Date() || (!doctor.isActiveSubscription && !doctor.isTrial);

    if (banner.targetAudience === 'active' && !isPaid) return false;
    if (banner.targetAudience === 'trial' && !isTrial) return false;
    if (banner.targetAudience === 'expired' && !isExpired) return false;
    if (banner.targetAudience === 'whitelabel_enabled' && !isWL) return false;
    if (banner.targetAudience === 'whitelabel_disabled' && isWL) return false;
    if (banner.targetAudience === 'specific_specialty') {
      const sp = (banner.targetSpecialty || '').toLowerCase().trim();
      if (!(doctor.specialty || '').toLowerCase().includes(sp)) return false;
    }
    if (banner.targetAudience === 'specific_doctors') {
      if (!banner.targetDoctorIds || !banner.targetDoctorIds.includes(doctor.id)) return false;
    }

    return true;
  }).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return (a.priority || 0) - (b.priority || 0);
  });

  const unreadBannerCount = activeBanners.filter(b => !dismissedBannerIds.includes(b.id)).length;

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('doctor_dark_mode', String(next));
      } catch (e) {
        // ignore
      }
      return next;
    });
  };
  
  // Invoices Modal state
  const [selectedInvoice, setSelectedInvoice] = useState<DoctorInvoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  // Appearance live preview device switcher state
  const [appearancePreviewDevice, setAppearancePreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (loggedSecretary) {
      if (activeTab === 'subscription' || activeTab === 'account' || activeTab === 'appearance' || activeTab === 'perks' || activeTab === 'secretaries') {
        setActiveTab(getInitialTab());
      } else if (activeTab === 'consultations') {
        if (loggedSecretary.permissions?.manageConsultations === false) {
          setActiveTab(getInitialTab());
        }
      } else if (activeTab === 'schedules') {
        if (!loggedSecretary.permissions?.manageClinics) {
          setActiveTab(getInitialTab());
        }
      } else if (activeTab === 'contact') {
        if (!loggedSecretary.permissions?.sendWhatsapp) {
          setActiveTab(getInitialTab());
        }
      } else if (activeTab === 'services') {
        if (!loggedSecretary.permissions?.manageServices) setActiveTab(getInitialTab());
      } else if (activeTab === 'gallery') {
        if (!loggedSecretary.permissions?.manageGallery) setActiveTab(getInitialTab());
      } else if (activeTab === 'videos') {
        if (!loggedSecretary.permissions?.manageVideos) setActiveTab(getInitialTab());
      } else if (activeTab === 'certificates') {
        if (!loggedSecretary.permissions?.manageCertificates) setActiveTab(getInitialTab());
      } else if (activeTab === 'reviews') {
        if (!loggedSecretary.permissions?.managePatients) setActiveTab(getInitialTab());
      } else if (activeTab === 'bookings') {
        if (loggedSecretary.permissions?.viewAppointments === false) {
          setActiveTab(getInitialTab());
        }
      }
    }
  }, [loggedSecretary, activeTab]);

  // --- Patient Records & Consultations State ---
  const [patientRecords, setPatientRecords] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`doctor_patients_${doctor.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
      if (doctor.patients && Array.isArray(doctor.patients)) {
        return doctor.patients;
      }
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Keep localStorage and doctor synced whenever patientRecords change
  useEffect(() => {
    try {
      localStorage.setItem(`doctor_patients_${doctor.id}`, JSON.stringify(patientRecords));
    } catch (e) {
      console.error(e);
    }
  }, [patientRecords, doctor.id]);

  // Consultation Modal States
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationModalType, setConsultationModalType] = useState<'consultation' | 'followup' | 'emergency' | 'advisory'>('consultation');
  const [consultationTypeFilter, setConsultationTypeFilter] = useState<'all' | 'consultation' | 'followup' | 'emergency' | 'advisory'>('all');
  const [consultationDateFilter, setConsultationDateFilter] = useState<'all' | 'today' | 'this_week' | 'this_month' | 'custom'>('all');
  const [consultationCustomStartDate, setConsultationCustomStartDate] = useState<string>('');
  const [consultationCustomEndDate, setConsultationCustomEndDate] = useState<string>('');
  const [consultationGenderFilter, setConsultationGenderFilter] = useState<'all' | 'ذكر' | 'أنثى'>('all');
  const [selectedPatientForConsultation, setSelectedPatientForConsultation] = useState<string>('new');

  // Patient Form States
  const [patientNameInput, setPatientNameInput] = useState('');
  const [patientPhoneInput, setPatientPhoneInput] = useState('');
  const [patientWhatsappInput, setPatientWhatsappInput] = useState('');
  const [patientAgeInput, setPatientAgeInput] = useState('');
  const [patientGenderInput, setPatientGenderInput] = useState<'ذكر' | 'أنثى'>('ذكر');
  const [patientGeneralNotesInput, setPatientGeneralNotesInput] = useState('');

  // Expanded Patient Cards State
  const [expandedPatientIds, setExpandedPatientIds] = useState<string[]>([]);

  const toggleExpandPatient = (id: string) => {
    setExpandedPatientIds(prev => prev.includes(id) ? prev.filter(pId => pId !== id) : [...prev, id]);
  };

  // Delete Patient Confirmation State
  const [patientToDelete, setPatientToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleDeletePatientRecord = (patientId: string) => {
    const p = patientRecords.find(item => item.id === patientId);
    if (p) {
      setPatientToDelete({ id: p.id, name: p.patientName });
    } else {
      setPatientRecords(prev => prev.filter(item => item.id !== patientId));
    }
  };

  const handleConfirmDeletePatient = () => {
    if (patientToDelete) {
      const updated = patientRecords.filter(p => p.id !== patientToDelete.id);
      setPatientRecords(updated);
      try {
        localStorage.setItem(`doctor_patients_${doctor.id}`, JSON.stringify(updated));
      } catch (e) {}
      onUpdateDoctor({ ...doctor, patients: updated });
      setFormData(prev => ({ ...prev, patients: updated }));
      setPatientToDelete(null);
    }
  };

  // Edit Patient Modal State
  const [isEditPatientModalOpen, setIsEditPatientModalOpen] = useState(false);
  const [editingPatientId, setEditingPatientId] = useState<string | null>(null);
  const [editPatientNameInput, setEditPatientNameInput] = useState('');
  const [editPatientPhoneInput, setEditPatientPhoneInput] = useState('');
  const [editPatientAgeInput, setEditPatientAgeInput] = useState('');
  const [editPatientGenderInput, setEditPatientGenderInput] = useState<'ذكر' | 'أنثى'>('ذكر');
  const [editPatientNotesInput, setEditPatientNotesInput] = useState('');

  const handleOpenEditPatientModal = (patient: PatientRecord) => {
    setEditingPatientId(patient.id);
    setEditPatientNameInput(patient.patientName);
    setEditPatientPhoneInput(patient.patientPhone);
    setEditPatientAgeInput(patient.age ? String(patient.age) : '');
    setEditPatientGenderInput(patient.gender === 'أنثى' ? 'أنثى' : 'ذكر');
    setEditPatientNotesInput(patient.notes || '');
    setIsEditPatientModalOpen(true);
  };

  const handleSaveEditPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPatientId || !editPatientNameInput.trim() || !editPatientPhoneInput.trim()) {
      alert('يرجى كتابة اسم المريض ورقم الهاتف الإجباريين');
      return;
    }

    const updated = patientRecords.map(p => {
      if (p.id === editingPatientId) {
        return {
          ...p,
          patientName: editPatientNameInput.trim(),
          patientPhone: editPatientPhoneInput.trim(),
          whatsappNumber: editPatientPhoneInput.trim(),
          age: editPatientAgeInput.trim(),
          gender: editPatientGenderInput,
          notes: editPatientNotesInput.trim(),
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    });

    setPatientRecords(updated);
    try {
      localStorage.setItem(`doctor_patients_${doctor.id}`, JSON.stringify(updated));
    } catch (e) {}
    onUpdateDoctor({ ...doctor, patients: updated });
    setFormData(prev => ({ ...prev, patients: updated }));

    setIsEditPatientModalOpen(false);
    setEditingPatientId(null);
  };

  // Consultation Form States
  const [consultationDateInput, setConsultationDateInput] = useState('');
  const [consultationTimeInput, setConsultationTimeInput] = useState('');
  const [consultationDiagnosisInput, setConsultationDiagnosisInput] = useState('');
  const [consultationPrescriptionInput, setConsultationPrescriptionInput] = useState('');
  const [consultationFeeInput, setConsultationFeeInput] = useState('');
  const [consultationNotesInput, setConsultationNotesInput] = useState('');

  const handleOpenConsultationModal = (type: 'consultation' | 'followup' | 'emergency' | 'advisory' = 'consultation', targetPatientId?: string) => {
    setConsultationModalType(type);
    if (targetPatientId) {
      setSelectedPatientForConsultation(targetPatientId);
      const targetP = patientRecords.find(p => p.id === targetPatientId);
      if (targetP) {
        setPatientNameInput(targetP.patientName);
        setPatientPhoneInput(targetP.patientPhone);
        setPatientWhatsappInput(targetP.whatsappNumber || targetP.patientPhone);
        setPatientAgeInput(targetP.age ? String(targetP.age) : '');
        setPatientGenderInput(targetP.gender === 'أنثى' ? 'أنثى' : 'ذكر');
        setPatientGeneralNotesInput(targetP.notes || '');
      }
    } else {
      setSelectedPatientForConsultation('new');
      setPatientNameInput('');
      setPatientPhoneInput('');
      setPatientWhatsappInput('');
      setPatientAgeInput('');
      setPatientGenderInput('ذكر');
      setPatientGeneralNotesInput('');
    }
    setConsultationDateInput(getLocalDateStr());
    setConsultationTimeInput('06:00 م');
    setConsultationDiagnosisInput('');
    setConsultationPrescriptionInput('');
    setConsultationFeeInput(type === 'consultation' ? '300' : type === 'followup' ? '100' : type === 'emergency' ? '500' : '200');
    setConsultationNotesInput('');
    setIsConsultationModalOpen(true);
  };

  const handlePatientSelectChange = (patientId: string) => {
    setSelectedPatientForConsultation(patientId);
    if (patientId === 'new') {
      setPatientNameInput('');
      setPatientPhoneInput('');
      setPatientWhatsappInput('');
      setPatientAgeInput('');
      setPatientGenderInput('ذكر');
      setPatientGeneralNotesInput('');
    } else {
      const targetP = patientRecords.find(p => p.id === patientId);
      if (targetP) {
        setPatientNameInput(targetP.patientName);
        setPatientPhoneInput(targetP.patientPhone);
        setPatientWhatsappInput(targetP.whatsappNumber || targetP.patientPhone);
        setPatientAgeInput(targetP.age ? String(targetP.age) : '');
        setPatientGenderInput(targetP.gender === 'أنثى' ? 'أنثى' : 'ذكر');
        setPatientGeneralNotesInput(targetP.notes || '');
      }
    }
  };

  const handleSaveConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientNameInput.trim() || !patientPhoneInput.trim()) {
      alert('يرجى إدخال اسم المريض ورقم الهاتف الإجباريين');
      return;
    }

    const newConsultationItem: PatientConsultation = {
      id: `c-${Date.now()}`,
      type: consultationModalType,
      date: consultationDateInput || getLocalDateStr(),
      time: consultationTimeInput.trim() || '05:00 م',
      diagnosis: consultationDiagnosisInput.trim(),
      prescription: consultationPrescriptionInput.trim(),
      notes: consultationNotesInput.trim(),
      fee: consultationFeeInput.trim(),
      createdAt: new Date().toISOString()
    };

    let updated: PatientRecord[];
    if (selectedPatientForConsultation !== 'new') {
      updated = patientRecords.map(p => {
        if (p.id === selectedPatientForConsultation) {
          return {
            ...p,
            patientName: patientNameInput.trim(),
            patientPhone: patientPhoneInput.trim(),
            whatsappNumber: patientWhatsappInput.trim() || patientPhoneInput.trim(),
            age: patientAgeInput.trim(),
            gender: patientGenderInput,
            notes: patientGeneralNotesInput.trim(),
            consultations: [newConsultationItem, ...(p.consultations || [])],
            updatedAt: new Date().toISOString()
          };
        }
        return p;
      });
    } else {
      const newPatient: PatientRecord = {
        id: `pat-${Date.now()}`,
        doctorId: doctor.id,
        patientName: patientNameInput.trim(),
        patientPhone: patientPhoneInput.trim(),
        whatsappNumber: patientWhatsappInput.trim() || patientPhoneInput.trim(),
        age: patientAgeInput.trim(),
        gender: patientGenderInput,
        notes: patientGeneralNotesInput.trim(),
        consultations: [newConsultationItem],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      updated = [newPatient, ...patientRecords];
    }

    setPatientRecords(updated);
    try {
      localStorage.setItem(`doctor_patients_${doctor.id}`, JSON.stringify(updated));
    } catch (e) {}
    onUpdateDoctor({ ...doctor, patients: updated });
    setFormData(prev => ({ ...prev, patients: updated }));

    setIsConsultationModalOpen(false);
  };

  const handleDeleteConsultationItem = (patientId: string, consultationId: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الكشف من سجل المريض؟')) {
      const updated = patientRecords.map(p => {
        if (p.id === patientId) {
          return {
            ...p,
            consultations: (p.consultations || []).filter(c => c.id !== consultationId)
          };
        }
        return p;
      });
      setPatientRecords(updated);
      try {
        localStorage.setItem(`doctor_patients_${doctor.id}`, JSON.stringify(updated));
      } catch (e) {}
      onUpdateDoctor({ ...doctor, patients: updated });
      setFormData(prev => ({ ...prev, patients: updated }));
    }
  };

  // Helper to get local date as YYYY-MM-DD
  const getLocalDateStr = (d: Date = new Date()): string => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper to normalize any date input (YYYY-MM-DD, DD/MM/YYYY, ISO, etc.) to YYYY-MM-DD
  const parseToStandardDateStr = (input?: string | null): string => {
    if (!input) return '';
    const trimmed = input.trim();
    if (!trimmed) return '';

    // Match YYYY-MM-DD or YYYY/MM/DD anywhere in string
    const ymdMatch = trimmed.match(/(\d{4})[\-\/](\d{1,2})[\-\/](\d{1,2})/);
    if (ymdMatch) {
      const [, y, m, d] = ymdMatch;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    // Match DD-MM-YYYY or DD/MM/YYYY anywhere in string
    const dmyMatch = trimmed.match(/(\d{1,2})[\-\/](\d{1,2})[\-\/](\d{4})/);
    if (dmyMatch) {
      const [, d, m, y] = dmyMatch;
      return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    }

    // Try standard JS Date constructor
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) {
      return getLocalDateStr(parsed);
    }

    return '';
  };

  const todayStr = getLocalDateStr(new Date());

  const tomorrowObj = new Date();
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrowStr = getLocalDateStr(tomorrowObj);

  // Middle East week starting Saturday
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const dayOfWeek = now.getDay(); // 0 = Sun, 6 = Sat
  const diffToSat = (dayOfWeek + 1) % 7;
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - diffToSat);
  const startOfWeekStr = getLocalDateStr(startOfWeek);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  const endOfWeekStr = getLocalDateStr(endOfWeek);

  const currentYearMonth = todayStr.slice(0, 7); // "YYYY-MM"

  const filteredPatientRecords = patientRecords.filter(p => {
    // 1. Search term filter
    if (patientSearchTerm.trim()) {
      const term = patientSearchTerm.trim().toLowerCase();
      const nameMatch = p.patientName?.toLowerCase().includes(term);
      const phoneMatch = p.patientPhone?.includes(term);
      const whatsappMatch = p.whatsappNumber?.includes(term);
      const notesMatch = p.notes?.toLowerCase().includes(term);
      const diagMatch = p.consultations?.some(c => 
        c.diagnosis?.toLowerCase().includes(term) || 
        c.prescription?.toLowerCase().includes(term) ||
        c.notes?.toLowerCase().includes(term)
      );
      if (!nameMatch && !phoneMatch && !whatsappMatch && !notesMatch && !diagMatch) return false;
    }

    // 2. Consultation type filter
    if (consultationTypeFilter !== 'all') {
      const hasType = p.consultations?.some(c => c.type === consultationTypeFilter);
      if (!hasType) return false;
    }

    // 3. Gender filter
    if (consultationGenderFilter !== 'all') {
      if (p.gender !== consultationGenderFilter) return false;
    }

    // 4. Date filter
    if (consultationDateFilter !== 'all') {
      const hasMatchingDate = p.consultations?.some(c => {
        const cDate = parseToStandardDateStr(c.date || c.createdAt);
        if (!cDate) return false;
        if (consultationDateFilter === 'today') {
          return cDate === todayStr;
        }
        if (consultationDateFilter === 'this_week') {
          return cDate >= startOfWeekStr && cDate <= endOfWeekStr;
        }
        if (consultationDateFilter === 'this_month') {
          return cDate.startsWith(currentYearMonth);
        }
        if (consultationDateFilter === 'custom') {
          if (consultationCustomStartDate && cDate < consultationCustomStartDate) return false;
          if (consultationCustomEndDate && cDate > consultationCustomEndDate) return false;
          return true;
        }
        return true;
      });
      if (!hasMatchingDate && p.consultations && p.consultations.length > 0) return false;
    }

    return true;
  });

  // --- Booking Requests Filters & Handlers ---
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | 'pending' | 'approved' | 'completed' | 'cancelled' | 'rejected'>('all');
  const [bookingDateFilter, setBookingDateFilter] = useState<'all' | 'today' | 'this_week' | 'this_month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [bookingSearchTerm, setBookingSearchTerm] = useState('');
  const [bookingBranchFilter, setBookingBranchFilter] = useState<string>(
    loggedSecretary && loggedSecretary.branchId ? loggedSecretary.branchId : 'all'
  );

  const doctorAppointments = appointments.filter(apt => 
    apt.doctorId === doctor.id || 
    (doctor.nameEn && apt.doctorId === doctor.nameEn) || 
    (doctor.name && apt.doctorId === doctor.name)
  );
  const pendingBookingsCount = doctorAppointments.filter(apt => apt.status === 'pending').length;
  const approvedBookingsCount = doctorAppointments.filter(apt => apt.status === 'approved').length;
  const completedBookingsCount = doctorAppointments.filter(apt => apt.status === 'completed').length;
  const cancelledBookingsCount = doctorAppointments.filter(apt => apt.status === 'cancelled').length;
  const rejectedBookingsCount = doctorAppointments.filter(apt => apt.status === 'rejected').length;

  const filteredBookings = doctorAppointments.filter(apt => {
    // 1. Status Filter
    if (bookingStatusFilter !== 'all' && apt.status !== bookingStatusFilter) return false;
    
    // 2. Branch Filter
    if (bookingBranchFilter !== 'all' && apt.branchId && apt.branchId !== bookingBranchFilter && apt.branchId !== 'main-clinic') return false;

    // 3. Search Term
    if (bookingSearchTerm.trim()) {
      const term = bookingSearchTerm.trim().toLowerCase();
      const nameMatch = apt.patientName?.toLowerCase().includes(term);
      const phoneMatch = apt.patientPhone?.includes(term);
      const whatsappMatch = apt.whatsappNumber?.includes(term);
      const dateMatch = apt.date?.includes(term) || apt.createdAt?.includes(term);
      const notesMatch = apt.notes?.toLowerCase().includes(term);
      if (!nameMatch && !phoneMatch && !whatsappMatch && !dateMatch && !notesMatch) return false;
    }

    // 4. Date Filter - Check both scheduled date (apt.date) and creation date (apt.createdAt)
    if (bookingDateFilter !== 'all') {
      const scheduledDateStr = parseToStandardDateStr(apt.date);
      const createdDateStr = parseToStandardDateStr(apt.createdAt);

      const arDayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
      const enDayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const todayDayIdx = new Date().getDay();
      const todayArDay = arDayNames[todayDayIdx];
      const todayEnDay = enDayNames[todayDayIdx];

      if (bookingDateFilter === 'today') {
        const isToday = 
          scheduledDateStr === todayStr ||
          createdDateStr === todayStr ||
          (apt.createdAt && new Date(apt.createdAt).toDateString() === new Date().toDateString()) ||
          (apt.createdAt && getLocalDateStr(new Date(apt.createdAt)) === todayStr) ||
          (apt.date && (apt.date.includes(todayStr) || apt.date.includes(todayArDay) || apt.date.toLowerCase().includes(todayEnDay) || apt.date.includes('اليوم'))) ||
          (apt.createdAt && apt.createdAt.includes(todayStr));

        if (!isToday) return false;
      } else if (bookingDateFilter === 'this_week') {
        const isThisWeek =
          (scheduledDateStr && scheduledDateStr >= startOfWeekStr && scheduledDateStr <= endOfWeekStr) ||
          (createdDateStr && createdDateStr >= startOfWeekStr && createdDateStr <= endOfWeekStr) ||
          (apt.createdAt && new Date(apt.createdAt).getTime() >= startOfWeek.getTime() && new Date(apt.createdAt).getTime() <= (endOfWeek.getTime() + 86400000)) ||
          (apt.date && arDayNames.some(d => apt.date.includes(d)));

        if (!isThisWeek) return false;
      } else if (bookingDateFilter === 'this_month') {
        const isThisMonth =
          (scheduledDateStr && scheduledDateStr.startsWith(currentYearMonth)) ||
          (createdDateStr && createdDateStr.startsWith(currentYearMonth)) ||
          (apt.createdAt && new Date(apt.createdAt).getMonth() === now.getMonth() && new Date(apt.createdAt).getFullYear() === now.getFullYear());

        if (!isThisMonth) return false;
      } else if (bookingDateFilter === 'custom') {
        const targetDate = scheduledDateStr || createdDateStr;
        if (customStartDate && targetDate && targetDate < customStartDate) return false;
        if (customEndDate && targetDate && targetDate > customEndDate) return false;
      }
    }

    return true;
  });

  const handleUpdateAppointmentStatus = (id: string, newStatus: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled') => {
    const updated = appointments.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt);
    onUpdateAppointments(updated);
  };

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف طلب الحجز هذا؟')) {
      const updated = appointments.filter(apt => apt.id !== id);
      onUpdateAppointments(updated);
    }
  };

  const handleSendWhatsAppConfirmation = (apt: Appointment) => {
    const targetPhone = apt.whatsappNumber || apt.patientPhone || '';
    let cleanPhone = targetPhone.replace(/[\s\+\-]/g, '');
    if (cleanPhone.startsWith('01') && cleanPhone.length === 11) {
      cleanPhone = '2' + cleanPhone;
    } else if (cleanPhone.startsWith('00')) {
      cleanPhone = cleanPhone.substring(2);
    }

    const branchObj = formData.branches?.find(b => b.id === apt.branchId);
    const branchName = branchObj ? branchObj.name : '';

    const msg = `السلام عليكم أ./ ${apt.patientName} 🌷\n\nتم تأكيد حجز حضرتك عند د. ${formData.name}. ✅\n\n📅 التاريخ: ${apt.date}\n🕒 الميعاد: ${apt.time}${branchName ? `\n🏥 الفرع: ${branchName}` : ''}\n\nنتمنى لحضرتك دوام الصحة والعافية. 🌹`;
    
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  const handleDownloadBookingsReport = () => {
    if (filteredBookings.length === 0) {
      alert('لا توجد بيانات مواعيد مطابقة للفلتر المحدد لتحميلها حالياً.');
      return;
    }

    const filterDetails = [
      bookingStatusFilter !== 'all' ? `الحالة: ${
        bookingStatusFilter === 'pending' ? 'قيد الانتظار' :
        bookingStatusFilter === 'approved' ? 'مؤكد' :
        bookingStatusFilter === 'completed' ? 'مكتمل' :
        bookingStatusFilter === 'cancelled' ? 'ملغي' : 'مرفوض'
      }` : null,
      bookingBranchFilter !== 'all' ? `الفرع/العيادة: ${formData.branches?.find(b => b.id === bookingBranchFilter)?.name || 'محدد'}` : null,
      bookingDateFilter !== 'all' ? `التاريخ: ${
        bookingDateFilter === 'today' ? 'اليوم' :
        bookingDateFilter === 'this_week' ? 'هذا الأسبوع' :
        bookingDateFilter === 'this_month' ? 'هذا الشهر' : 'نطاق مخصص'
      }` : null,
      bookingSearchTerm.trim() !== '' ? `البحث: ${bookingSearchTerm}` : null
    ].filter(Boolean).join(' | ') || 'جميع طلبات الحجز والمواعيد';

    const rowsHtml = filteredBookings.map((apt, index) => {
      const branchObj = formData.branches?.find(b => b.id === apt.branchId);
      const branchName = branchObj ? branchObj.name : 'الفرع الرئيسي';
      
      let statusBadge = `<span class="status-pending">قيد الانتظار</span>`;
      if (apt.status === 'approved') statusBadge = `<span class="status-approved">مؤكد</span>`;
      else if (apt.status === 'completed') statusBadge = `<span class="status-completed">مكتمل</span>`;
      else if (apt.status === 'cancelled') statusBadge = `<span class="status-cancelled">ملغي</span>`;
      else if (apt.status === 'rejected') statusBadge = `<span class="status-rejected">مرفوض</span>`;

      return `
        <tr>
          <td style="text-align:center;font-weight:bold;">${index + 1}</td>
          <td style="font-weight:bold;">${apt.patientName || '-'}</td>
          <td dir="ltr" style="text-align:right;">${apt.patientPhone || '-'}</td>
          <td dir="ltr" style="text-align:right;">${apt.whatsappNumber || apt.patientPhone || '-'}</td>
          <td style="font-weight:bold;color:#003B7A;">${apt.date || '-'}</td>
          <td>${apt.time || '-'}</td>
          <td>${branchName}</td>
          <td style="text-align:center;">${statusBadge}</td>
          <td>${apt.createdAt ? new Date(apt.createdAt).toLocaleDateString('ar-EG') : '-'}</td>
          <td style="font-size:9px;color:#64748b;">${apt.notes || '-'}</td>
        </tr>
      `;
    }).join('');

    const reportHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تقرير طلبات الحجز والمواعيد - د. ${formData.name}</title>
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
      border-bottom: 2px solid #10244A;
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
    .status-pending { display: inline-block; padding: 2px 6px; background: #fef3c7; color: #92400e; border-radius: 4px; font-weight: 700; font-size: 9px; }
    .status-approved { display: inline-block; padding: 2px 6px; background: #dbeafe; color: #1e40af; border-radius: 4px; font-weight: 700; font-size: 9px; }
    .status-completed { display: inline-block; padding: 2px 6px; background: #dcfce7; color: #166534; border-radius: 4px; font-weight: 700; font-size: 9px; }
    .status-cancelled { display: inline-block; padding: 2px 6px; background: #f3f4f6; color: #374151; border-radius: 4px; font-weight: 700; font-size: 9px; }
    .status-rejected { display: inline-block; padding: 2px 6px; background: #fee2e2; color: #991b1b; border-radius: 4px; font-weight: 700; font-size: 9px; }
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
      <div class="title">تقرير طلبات الحجز والمواعيد</div>
      <div class="subtitle">د. ${formData.name} - ${formData.specialty || 'عيادة طبية'}</div>
    </div>
    <div style="text-align:left;">
      <div style="font-weight:800;color:#10244A;font-size:12px;">منصة دكتور بروفايل</div>
      <div style="font-size:10px;color:#64748b;">تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-EG')}</div>
    </div>
  </div>

  <div class="meta-box">
    <div class="meta-item">إجمالي المواعيد المفلترة: <strong>${filteredBookings.length} طلب</strong></div>
    <div class="meta-item">الفلاتر المطبقة: <strong>${filterDetails}</strong></div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:25px;text-align:center;">#</th>
        <th>اسم المريض</th>
        <th>رقم الهاتف</th>
        <th>الواتساب</th>
        <th>تاريخ الموعد</th>
        <th>الوقت</th>
        <th>الفرع / العيادة</th>
        <th>حالة الحجز</th>
        <th>تاريخ الطلب</th>
        <th>الملاحظات</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="footer">
    <div>تم استخراج هذا التقرير من عيادة د. ${formData.name} عبر منصة دكتور بروفايل</div>
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
      const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير_المواعيد_${formData.name.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadConsultationsReport = () => {
    if (filteredPatientRecords.length === 0) {
      alert('لا توجد سجلات مرضى أو كشوفات مطابقة للفلتر المحدد لتحميلها حالياً.');
      return;
    }

    const filterDetails = [
      consultationTypeFilter !== 'all' ? `نوع الكشف: ${
        consultationTypeFilter === 'consultation' ? 'كشف' :
        consultationTypeFilter === 'followup' ? 'متابعة' :
        consultationTypeFilter === 'emergency' ? 'طوارئ' : 'استشارة'
      }` : null,
      consultationDateFilter !== 'all' ? `الفترة: ${
        consultationDateFilter === 'today' ? 'اليوم' :
        consultationDateFilter === 'this_week' ? 'هذا الأسبوع' :
        consultationDateFilter === 'this_month' ? 'هذا الشهر' : 'تاريخ مخصص'
      }` : null,
      consultationGenderFilter !== 'all' ? `النوع: ${consultationGenderFilter}` : null,
      patientSearchTerm.trim() !== '' ? `البحث: ${patientSearchTerm}` : null
    ].filter(Boolean).join(' | ') || 'جميع سجلات المرضى والكشوفات الطبية';

    let rowNum = 1;
    const totalFees = filteredPatientRecords.reduce((acc, p) => {
      return acc + (p.consultations || []).reduce((fAcc, c) => fAcc + (parseFloat(String(c.fee || '0')) || 0), 0);
    }, 0);

    const rowsHtml = filteredPatientRecords.flatMap((patient) => {
      const consultations = patient.consultations || [];
      if (consultations.length === 0) {
        return `
          <tr>
            <td style="text-align:center;font-weight:bold;">${rowNum++}</td>
            <td style="font-weight:bold;">${patient.patientName || '-'}</td>
            <td dir="ltr" style="text-align:right;">${patient.patientPhone || '-'}</td>
            <td>${patient.gender || '-'}</td>
            <td>${patient.age ? patient.age + ' سنة' : '-'}</td>
            <td style="text-align:center;">-</td>
            <td style="text-align:center;">-</td>
            <td style="text-align:center;">0 ج.م</td>
            <td style="font-size:9px;color:#64748b;">${patient.notes || '-'}</td>
          </tr>
        `;
      }

      return consultations.map((c) => {
        const typeLabel = c.type === 'consultation' ? 'كشف' :
                          c.type === 'followup' ? 'متابعة' :
                          c.type === 'emergency' ? 'طوارئ' : 'استشارة';
        
        return `
          <tr>
            <td style="text-align:center;font-weight:bold;">${rowNum++}</td>
            <td style="font-weight:bold;">${patient.patientName || '-'}</td>
            <td dir="ltr" style="text-align:right;">${patient.patientPhone || '-'}</td>
            <td>${patient.gender || '-'}</td>
            <td>${patient.age ? patient.age + ' سنة' : '-'}</td>
            <td style="text-align:center;font-weight:bold;color:#009bb9;">${typeLabel}</td>
            <td style="font-weight:bold;">${c.date || '-'}</td>
            <td style="font-weight:bold;color:#10244A;text-align:center;">${c.fee ? c.fee + ' ج.م' : '0 ج.م'}</td>
            <td style="font-size:9px;color:#64748b;">${c.notes || patient.notes || '-'}</td>
          </tr>
        `;
      });
    }).join('');

    const reportHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <title>تقرير سجلات المرضى والكشوفات - د. ${formData.name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Cairo', Tahoma, sans-serif;
      padding: 20px;
      color: #0f172a;
      background: #fff;
      direction: rtl;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #009bb9;
      padding-bottom: 12px;
      margin-bottom: 15px;
    }
    .title { font-size: 18px; font-weight: 900; color: #10244A; }
    .subtitle { font-size: 11px; color: #64748b; font-weight: 600; }
    .meta-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px 12px;
      margin-bottom: 14px;
      font-size: 11px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    th {
      background-color: #10244A;
      color: #ffffff;
      padding: 8px;
      font-size: 11px;
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
    .footer {
      margin-top: 20px;
      padding-top: 10px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">تقرير سجلات المرضى والكشوفات الطبية</div>
      <div class="subtitle">عيادة د. ${formData.name} ${formData.title ? `(${formData.title})` : ''}</div>
    </div>
    <div style="text-align:left;">
      <div style="font-weight:800;color:#009bb9;font-size:12px;">تاريخ الاستخراج: ${todayStr}</div>
      <div style="font-size:10px;color:#64748b;">إجمالي المرضى بالمستند: ${filteredPatientRecords.length}</div>
    </div>
  </div>

  <div class="meta-box">
    <div style="margin-bottom:4px;"><strong>محددات التقرير:</strong> ${filterDetails}</div>
    <div>إجمالي الرسوم المحصلة: <strong>${totalFees.toLocaleString('ar-EG')} ج.م</strong> | إجمالي الحالات بالمستند: <strong>${filteredPatientRecords.length} مريض</strong></div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width:25px;text-align:center;">#</th>
        <th>اسم المريض</th>
        <th>رقم الهاتف</th>
        <th>النوع</th>
        <th>العمر</th>
        <th>نوع الكشف</th>
        <th>تاريخ الكشف</th>
        <th>الرسوم</th>
        <th>الملاحظات</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
    <tfoot>
      <tr style="background-color: #f8fafc; font-weight: 800; border-top: 2px solid #10244A;">
        <td colspan="7" style="text-align: left; padding: 9px 8px; font-size: 11px; font-weight: 900; color: #10244A;">إجمالي الرسوم المحصلة:</td>
        <td style="text-align: center; color: #10244A; font-size: 11px; font-weight: 900; background-color: #e2e8f0;">${totalFees.toLocaleString('ar-EG')} ج.م</td>
        <td></td>
      </tr>
    </tfoot>
  </table>

  <div class="footer">
    <div>تم استخراج هذا التقرير من عيادة د. ${formData.name} عبر منصة دكتور بروفايل</div>
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
      const blob = new Blob([reportHtml], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير_الكشوفات_${formData.name.replace(/\s+/g, '_')}_${todayStr}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // --- Profile Content Form States & Edit States ---
  // 1. Services
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceDuration, setNewServiceDuration] = useState('');
  const [newServiceImage, setNewServiceImage] = useState('');

  // 2. Gallery
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [newGalleryTitle, setNewGalleryTitle] = useState('');
  const [newGalleryImage, setNewGalleryImage] = useState('');

  // 3. Videos
  const [editingVideoIndex, setEditingVideoIndex] = useState<number | null>(null);
  const [newVideoUrl, setNewVideoUrl] = useState('');

  // 4. Certificates
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertImage, setNewCertImage] = useState('');

  // 5. Patient Reviews
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewAvatar, setNewReviewAvatar] = useState('');

  // --- Image Upload Handlers ---
  const handleServiceImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewServiceImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleGalleryImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewGalleryImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleCertImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewCertImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleReviewAvatarUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => setNewReviewAvatar(reader.result as string);
    reader.readAsDataURL(file);
  };

  // --- Section Action Handlers ---
  // Services
  const handleEditServiceStart = (srv: Service) => {
    setEditingServiceId(srv.id);
    setNewServiceName(srv.name || '');
    setNewServiceDesc(srv.description || '');
    setNewServicePrice(srv.price !== undefined ? String(srv.price) : '');
    setNewServiceDuration(srv.duration || '');
    setNewServiceImage(srv.imageUrl || '');
  };

  const handleCancelEditService = () => {
    setEditingServiceId(null);
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServicePrice('');
    setNewServiceDuration('');
    setNewServiceImage('');
  };

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    let updatedServices: Service[] = [];
    if (editingServiceId) {
      updatedServices = (formData.services || []).map(s => s.id === editingServiceId ? {
        ...s,
        name: newServiceName.trim(),
        description: newServiceDesc.trim(),
        price: newServicePrice ? parseFloat(newServicePrice) : undefined,
        duration: newServiceDuration.trim() || undefined,
        imageUrl: newServiceImage || undefined
      } : s);
      setEditingServiceId(null);
    } else {
      const srv: Service = {
        id: `srv-${Date.now()}`,
        name: newServiceName.trim(),
        description: newServiceDesc.trim(),
        price: newServicePrice ? parseFloat(newServicePrice) : undefined,
        duration: newServiceDuration.trim() || undefined,
        imageUrl: newServiceImage || undefined
      };
      updatedServices = [...(formData.services || []), srv];
    }

    const updatedDoc = { ...formData, services: updatedServices };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setNewServiceName('');
    setNewServiceDesc('');
    setNewServicePrice('');
    setNewServiceDuration('');
    setNewServiceImage('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleDeleteService = (id: string) => {
    if (editingServiceId === id) {
      handleCancelEditService();
    }
    const updatedServices = (formData.services || []).filter(s => s.id !== id);
    const updatedDoc = { ...formData, services: updatedServices };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Gallery
  const handleEditGalleryStart = (item: GalleryItem) => {
    setEditingGalleryId(item.id);
    setNewGalleryTitle(item.title || '');
    setNewGalleryImage(item.imageUrl || '');
  };

  const handleCancelEditGallery = () => {
    setEditingGalleryId(null);
    setNewGalleryTitle('');
    setNewGalleryImage('');
  };

  const handleAddGalleryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryImage) return;

    let updatedItems: GalleryItem[] = [];
    let updatedGallery: string[] = [];
    if (editingGalleryId) {
      updatedItems = (formData.galleryItems || []).map(g => g.id === editingGalleryId ? {
        ...g,
        title: newGalleryTitle.trim() || 'صورة العيادة',
        imageUrl: newGalleryImage
      } : g);
      updatedGallery = (formData.gallery || []).map((img, idx) => (formData.galleryItems || [])[idx]?.id === editingGalleryId ? newGalleryImage : img);
      setEditingGalleryId(null);
    } else {
      const item: GalleryItem = {
        id: `gal-${Date.now()}`,
        title: newGalleryTitle.trim() || 'صورة العيادة',
        imageUrl: newGalleryImage
      };
      updatedItems = [...(formData.galleryItems || []), item];
      updatedGallery = [...(formData.gallery || []), newGalleryImage];
    }

    const updatedDoc = { ...formData, galleryItems: updatedItems, gallery: updatedGallery };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setNewGalleryTitle('');
    setNewGalleryImage('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleDeleteGalleryItem = (id: string) => {
    if (editingGalleryId === id) {
      handleCancelEditGallery();
    }
    const updatedItems = (formData.galleryItems || []).filter(g => g.id !== id);
    const updatedGallery = (formData.gallery || []).filter((_, idx) => (formData.galleryItems || [])[idx]?.id !== id);
    const updatedDoc = { ...formData, galleryItems: updatedItems, gallery: updatedGallery };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleToggleGallery = () => {
    const updatedFeatures = {
      ...(formData.features || DEFAULT_DOCTOR_FEATURES),
      photoGallery: !(formData.features?.photoGallery ?? true)
    };
    const updatedDoc = {
      ...formData,
      features: updatedFeatures
    };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setSavedSuccess(false);
  };

  // Videos
  const handleEditVideoStart = (index: number, vUrl: string) => {
    setEditingVideoIndex(index);
    setNewVideoUrl(vUrl);
  };

  const handleCancelEditVideo = () => {
    setEditingVideoIndex(null);
    setNewVideoUrl('');
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideoUrl.trim()) return;

    let updatedVideos: string[] = [];
    if (editingVideoIndex !== null) {
      updatedVideos = (formData.videos || []).map((v, i) => i === editingVideoIndex ? newVideoUrl.trim() : v);
      setEditingVideoIndex(null);
    } else {
      updatedVideos = [...(formData.videos || []), newVideoUrl.trim()];
    }

    const updatedDoc = { ...formData, videos: updatedVideos };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setNewVideoUrl('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleDeleteVideo = (index: number) => {
    if (editingVideoIndex === index) {
      handleCancelEditVideo();
    }
    const updatedVideos = (formData.videos || []).filter((_, i) => i !== index);
    const updatedDoc = { ...formData, videos: updatedVideos };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleToggleVideos = () => {
    const updatedFeatures = {
      ...(formData.features || DEFAULT_DOCTOR_FEATURES),
      videosSection: !(formData.features?.videosSection ?? true)
    };
    const updatedDoc = {
      ...formData,
      features: updatedFeatures
    };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setSavedSuccess(false);
  };

  // Certificates
  const handleEditCertificateStart = (cert: DoctorCertificate) => {
    setEditingCertId(cert.id);
    setNewCertTitle(cert.title || '');
    setNewCertImage(cert.imageUrl || '');
  };

  const handleCancelEditCert = () => {
    setEditingCertId(null);
    setNewCertTitle('');
    setNewCertImage('');
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCertTitle.trim() || !newCertImage) return;

    let updatedCerts: DoctorCertificate[] = [];
    if (editingCertId) {
      updatedCerts = (formData.certificates || []).map(c => typeof c !== 'string' && c.id === editingCertId ? {
        ...c,
        title: newCertTitle.trim(),
        imageUrl: newCertImage
      } : c);
      setEditingCertId(null);
    } else {
      const cert: DoctorCertificate = {
        id: `cert-${Date.now()}`,
        title: newCertTitle.trim(),
        imageUrl: newCertImage
      };
      updatedCerts = [...(formData.certificates || []), cert];
    }

    const updatedDoc = { ...formData, certificates: updatedCerts };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setNewCertTitle('');
    setNewCertImage('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleDeleteCertificate = (id: string) => {
    if (editingCertId === id) {
      handleCancelEditCert();
    }
    const updatedCerts = (formData.certificates || []).filter(c => typeof c === 'string' ? true : c.id !== id);
    const updatedDoc = { ...formData, certificates: updatedCerts };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleToggleCertificates = () => {
    const updatedFeatures = {
      ...(formData.features || DEFAULT_DOCTOR_FEATURES),
      addCertificates: !(formData.features?.addCertificates ?? true)
    };
    const updatedDoc = {
      ...formData,
      features: updatedFeatures
    };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setSavedSuccess(false);
  };

  const handleToggleServices = () => {
    const updatedFeatures = {
      ...(formData.features || DEFAULT_DOCTOR_FEATURES),
      servicesAndPrices: !(formData.features?.servicesAndPrices ?? true)
    };
    const updatedDoc = {
      ...formData,
      features: updatedFeatures
    };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setSavedSuccess(false);
  };

  const handleToggleReviews = () => {
    const updatedFeatures = {
      ...(formData.features || DEFAULT_DOCTOR_FEATURES),
      patientReviews: !(formData.features?.patientReviews ?? true)
    };
    const updatedDoc = {
      ...formData,
      features: updatedFeatures
    };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setSavedSuccess(false);
  };

  // Patient Reviews
  const handleEditReviewStart = (rev: Review) => {
    setEditingReviewId(rev.id);
    setNewReviewName(rev.patientName || '');
    setNewReviewComment(rev.comment || '');
    setNewReviewRating(rev.rating || 5);
    setNewReviewAvatar(rev.avatar || '');
  };

  const handleCancelEditReview = () => {
    setEditingReviewId(null);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setNewReviewAvatar('');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) return;

    let updatedReviews: Review[] = [];
    if (editingReviewId) {
      updatedReviews = (formData.reviews || []).map(r => r.id === editingReviewId ? {
        ...r,
        patientName: newReviewName.trim(),
        comment: newReviewComment.trim(),
        rating: newReviewRating,
        avatar: newReviewAvatar || undefined
      } : r);
      setEditingReviewId(null);
    } else {
      const rev: Review = {
        id: `rev-${Date.now()}`,
        patientName: newReviewName.trim(),
        comment: newReviewComment.trim(),
        rating: newReviewRating,
        avatar: newReviewAvatar || undefined,
        date: new Date().toISOString().split('T')[0]
      };
      updatedReviews = [...(formData.reviews || []), rev];
    }

    const updatedDoc = { ...formData, reviews: updatedReviews };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setNewReviewName('');
    setNewReviewComment('');
    setNewReviewRating(5);
    setNewReviewAvatar('');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleDeleteReview = (id: string) => {
    if (editingReviewId === id) {
      handleCancelEditReview();
    }
    const updatedReviews = (formData.reviews || []).filter(r => r.id !== id);
    const updatedDoc = { ...formData, reviews: updatedReviews };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Form State initialized with Doctor props
  const sanitizedDoc = sanitizeDoctorDates(doctor);
  const [formData, setFormData] = useState<Doctor>({
    ...sanitizedDoc,
    isVerified: sanitizedDoc.isVerified ?? false,
    whiteLabel: sanitizedDoc.whiteLabel ?? true,
    branches: sanitizedDoc.branches || [],
    secretaries: sanitizedDoc.secretaries && sanitizedDoc.secretaries.length > 0 ? sanitizedDoc.secretaries : [
      {
        id: 'sec-1',
        name: 'سارة أحمد',
        email: 'sara@clinic.com',
        phone: '01012345678',
        status: 'active',
        permissions: {
          viewAppointments: true,
          confirmAppointments: true,
          rejectAppointments: true,
          sendWhatsapp: true,
          editAppointments: true,
          manageConsultations: true,
          managePatients: true,
          manageClinics: false,
          manageServices: false,
          manageGallery: false,
          manageVideos: false,
          manageCertificates: false,
        }
      },
      {
        id: 'sec-2',
        name: 'منى محمد',
        email: 'mona@clinic.com',
        phone: '01198765432',
        status: 'active',
        permissions: {
          viewAppointments: true,
          confirmAppointments: true,
          rejectAppointments: true,
          sendWhatsapp: true,
          editAppointments: true,
          manageConsultations: true,
          managePatients: true,
          manageClinics: false,
          manageServices: false,
          manageGallery: false,
          manageVideos: false,
          manageCertificates: false,
        }
      }
    ],
    socials: {
      facebook: '',
      instagram: '',
      linkedin: '',
      twitter: '',
      youtube: '',
      tiktok: '',
      snapchat: '',
      telegram: '',
      website: '',
      ...(sanitizedDoc.socials || {})
    }
  });
  
  // Perks Section local demo states (purely preview in Perks tab)
  const [demoVerified, setDemoVerified] = useState<boolean>(false);
  const [demoHideRights, setDemoHideRights] = useState<boolean>(false);

  // Keep local formData in sync if the doctor prop changes from the parent
  useEffect(() => {
    const sDoc = sanitizeDoctorDates(doctor);
    setFormData(prev => ({
      ...prev,
      ...sDoc,
      branches: sDoc.branches || prev.branches || [],
      socials: {
        ...(prev.socials || {}),
        ...(sDoc.socials || {})
      },
      features: {
        ...(prev.features || DEFAULT_DOCTOR_FEATURES),
        ...(doctor.features || {})
      }
    }));
  }, [doctor]);

  const doctorInvoicesList = formData.invoices || [];
  const unreadInvoicesCount = doctorInvoicesList.filter(inv => !readInvoiceIds.includes(inv.id || inv.invoiceNumber)).length;
  const unreadNotificationsCount = unreadBannerCount + unreadInvoicesCount;

  // --- Password Change State & Handlers (إعدادات كلمة المرور) ---
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Helper validation matching registration password criteria
  const validateDoctorPassword = (pass: string): string | null => {
    const clean = pass.trim();
    if (!clean) return 'يرجى إدخال كلمة المرور الجديدة';

    const hasL = /[a-zA-Z\u0600-\u06FF]/.test(clean);
    const hasN = /[0-9]/.test(clean);
    const hasS = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`^]/.test(clean);

    const missing: string[] = [];
    if (!hasL) missing.push('أحرف');
    if (!hasN) missing.push('أرقام');
    if (!hasS) missing.push('رموز خاصة (مثل @ و # و $)');

    if (missing.length > 0) {
      return `كلمة المرور يجب أن تحتوي على ${missing.join(' و ')}`;
    }
    if (clean.length < 6) {
      return 'كلمة المرور يجب أن تتكون من 6 خانات على الأقل';
    }
    return null;
  };

  const handleUpdatePassword = () => {
    setPasswordStatus(null);
    const cleanPass = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    const validationError = validateDoctorPassword(cleanPass);
    if (validationError) {
      setPasswordStatus({ type: 'error', message: validationError });
      return;
    }
    if (cleanPass !== cleanConfirm) {
      setPasswordStatus({ type: 'error', message: 'كلمة المرور وتأكيدها غير متطابقين' });
      return;
    }

    const updatedDoc: Doctor = {
      ...formData,
      password: cleanPass
    };
    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setPasswordStatus({ type: 'success', message: 'تم تحديث وحفظ كلمة المرور بنجاح!' });
    setNewPassword('');
    setConfirmPassword('');
    triggerSaveNotification('تم تغيير كلمة المرور');
    setTimeout(() => {
      setPasswordStatus(null);
    }, 4000);
  };

  // --- Copy Profile Link State & Handler ---
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyDoctorLink = async () => {
    try {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const docSlug = formData.nameEn || doctor.nameEn || '';
      const fullUrl = `${origin}/dr/${docSlug}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy doctor link:', err);
    }
  };

  const renderProfileQuickBar = () => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const docSlug = formData.nameEn || doctor.nameEn || '';
    const fullUrl = `${origin}/dr/${docSlug}`;
    const displayUrl = fullUrl.replace(/^https?:\/\//, '');

    return (
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-3.5 sm:p-4 shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div 
          className="w-full sm:flex-1 px-4 py-2.5 bg-neutral-50/80 border border-neutral-200 rounded-xl text-xs sm:text-sm font-semibold text-neutral-800 text-left truncate font-mono select-all"
          dir="ltr"
          title={fullUrl}
        >
          {displayUrl}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={handleCopyDoctorLink}
            className={`px-4 py-2.5 border rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-xs font-bold shrink-0 ${
              copiedLink
                ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-300 text-neutral-800'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-neutral-600 shrink-0" />
                <span>نسخ العنوان</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onPreviewPublicSite(formData.nameEn)}
            className="px-5 py-2.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs shrink-0"
          >
            <span>معاينة البروفايل</span>
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // --- Secretary Management Modal State & Handlers ---
  const [isSecretaryModalOpen, setIsSecretaryModalOpen] = useState(false);
  const [editingSecretaryId, setEditingSecretaryId] = useState<string | null>(null);

  const [secName, setSecName] = useState('');
  const [secEmail, setSecEmail] = useState('');
  const [secPhone, setSecPhone] = useState('');
  const [secPassword, setSecPassword] = useState('');
  const [secBranchId, setSecBranchId] = useState('all');
  const [secStatus, setSecStatus] = useState<'active' | 'inactive'>('active');
  const [secPermissions, setSecPermissions] = useState<SecretaryPermissions>({
    viewAppointments: true,
    confirmAppointments: true,
    rejectAppointments: true,
    sendWhatsapp: true,
    editAppointments: true,
    manageConsultations: true,
    managePatients: true,
    manageClinics: false,
    manageServices: false,
    manageGallery: false,
    manageVideos: false,
    manageCertificates: false,
  });

  const handleOpenAddSecretary = () => {
    setEditingSecretaryId(null);
    setSecName('');
    setSecEmail('');
    setSecPhone('');
    setSecPassword('');
    setSecBranchId('all');
    setSecStatus('active');
    setSecPermissions({
      viewAppointments: true,
      confirmAppointments: true,
      rejectAppointments: true,
      sendWhatsapp: true,
      editAppointments: true,
      manageConsultations: true,
      managePatients: true,
      manageClinics: false,
      manageServices: false,
      manageGallery: false,
      manageVideos: false,
      manageCertificates: false,
    });
    setIsSecretaryModalOpen(true);
  };

  const handleOpenEditSecretary = (sec: Secretary) => {
    setEditingSecretaryId(sec.id);
    setSecName(sec.name || '');
    setSecEmail(sec.email || '');
    setSecPhone(sec.phone || '');
    setSecPassword(sec.password || '');
    setSecBranchId(sec.branchId || 'all');
    setSecStatus(sec.status || 'active');
    setSecPermissions(sec.permissions || {
      viewAppointments: true,
      confirmAppointments: true,
      rejectAppointments: true,
      sendWhatsapp: true,
      editAppointments: true,
      manageConsultations: true,
      managePatients: true,
      manageClinics: false,
      manageServices: false,
      manageGallery: false,
      manageVideos: false,
      manageCertificates: false,
    });
    setIsSecretaryModalOpen(true);
  };

  const handleSaveSecretary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secName.trim() || !secPhone.trim()) {
      alert('يرجى كتابة الاسم ورقم الموبايل للسكرتيرة.');
      return;
    }

    const newSecretary: Secretary = {
      id: editingSecretaryId || `sec-${Date.now()}`,
      name: secName.trim(),
      email: secEmail.trim(),
      phone: secPhone.trim(),
      password: secPassword.trim() || undefined,
      branchId: secBranchId === 'all' ? undefined : secBranchId,
      status: secStatus,
      permissions: secPermissions,
      createdAt: new Date().toISOString()
    };

    let updatedSecretaries: Secretary[] = [];
    const currentSecretaries = formData.secretaries || [];
    if (editingSecretaryId) {
      updatedSecretaries = currentSecretaries.map(s => s.id === editingSecretaryId ? newSecretary : s);
    } else {
      updatedSecretaries = [...currentSecretaries, newSecretary];
    }

    const updatedDoc = {
      ...formData,
      secretaries: updatedSecretaries
    };

    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setIsSecretaryModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleDeleteSecretary = (secId: string) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذه السكرتيرة؟')) {
      const currentSecretaries = formData.secretaries || [];
      const updatedSecretaries = currentSecretaries.filter(s => s.id !== secId);
      const updatedDoc = {
        ...formData,
        secretaries: updatedSecretaries
      };
      setFormData(updatedDoc);
      onUpdateDoctor(updatedDoc);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState('تم الحفظ');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const triggerSaveNotification = (msg: string = 'تم الحفظ') => {
    setSavedSuccessMessage(msg);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  // Helper handler for Social Media Links
  const handleSocialChange = (key: keyof Doctor['socials'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socials: {
        ...(prev.socials || {}),
        [key]: value
      }
    }));
    setSavedSuccess(false);
  };

  const handleToggleSocialMedia = () => {
    const currentVal = formData.features?.socialMediaLinks ?? true;
    const updated = {
      ...formData,
      features: {
        ...formData.features,
        socialMediaLinks: !currentVal
      }
    };
    setFormData(updated);
    onUpdateDoctor(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  // Helper handler for Branch Google Maps Location URLs
  const handleBranchMapUrlChange = (branchId: string, mapUrl: string) => {
    setFormData(prev => ({
      ...prev,
      branches: (prev.branches || []).map(b => b.id === branchId ? { ...b, mapUrl } : b)
    }));
    setSavedSuccess(false);
  };
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerAvatarInputRef = useRef<HTMLInputElement>(null);
  const [showAdvancedAccountSettings, setShowAdvancedAccountSettings] = useState(false);

  const handleHeaderAvatarUpload = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({
        ...prev,
        headerAvatar: reader.result as string
      }));
      setSavedSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveHeaderAvatar = () => {
    setFormData(prev => ({
      ...prev,
      headerAvatar: undefined
    }));
    setSavedSuccess(false);
  };

  // --- Clinic / Branch Modal State ---
  const [isClinicModalOpen, setIsClinicModalOpen] = useState(false);
  const [editingBranchId, setEditingBranchId] = useState<string | null>(null);

  const [clinicName, setClinicName] = useState('');
  const [clinicAddress, setClinicAddress] = useState('');
  const [clinicPhone, setClinicPhone] = useState('');
  const [clinicPrice, setClinicPrice] = useState('');
  const [clinicMapUrl, setClinicMapUrl] = useState('');
  const [clinicError, setClinicError] = useState<string | null>(null);
  const [clinicSummaryHours, setClinicSummaryHours] = useState('');
  const [clinicSchedule, setClinicSchedule] = useState<WorkingHour[]>(() => 
    DEFAULT_WEEK_DAYS.map(day => ({
      day,
      isAvailable: ['السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'].includes(day),
      start: '04:00 مساءً',
      end: '09:00 مساءً'
    }))
  );

  // Handle Text Input Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'experience' ? parseInt(value) || 0 : value
    }));
    setSavedSuccess(false);
  };

  // Handle Image File Upload (Convert to Data URL)
  const handleImageUpload = (file: File) => {
    setUploadError(null);
    
    // Validate File Type
    if (!file.type.startsWith('image/')) {
      setUploadError('يرجى اختيار ملف صورة صالحة (PNG, JPG, WEBP, GIF)');
      return;
    }

    // Validate File Size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 5 ميجابايت');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        setFormData(prev => ({
          ...prev,
          avatar: result
        }));
        setSavedSuccess(false);
      }
      setIsUploading(false);
    };

    reader.onerror = () => {
      setUploadError('حدث خطأ أثناء قراءة ملف الصورة. يرجى المحاولة مرة أخرى.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  // Drag and Drop Handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  // File Input Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageUpload(e.target.files[0]);
    }
  };

  // Remove Photo
  const handleRemoveAvatar = () => {
    setFormData(prev => ({
      ...prev,
      avatar: ''
    }));
    setSavedSuccess(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Save Changes
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    let updatedDoc = { ...formData };
    const cleanPass = newPassword.trim();
    const cleanConfirm = confirmPassword.trim();

    if (cleanPass) {
      const validationError = validateDoctorPassword(cleanPass);
      if (validationError) {
        setPasswordStatus({ type: 'error', message: validationError });
        return;
      }
      if (cleanPass !== cleanConfirm) {
        setPasswordStatus({ type: 'error', message: 'كلمة المرور وتأكيدها غير متطابقين' });
        return;
      }
      updatedDoc.password = cleanPass;
      setFormData(updatedDoc);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordStatus({ type: 'success', message: 'تم حفظ وتحديث بيانات الحساب وكلمة المرور بنجاح!' });
      setTimeout(() => setPasswordStatus(null), 4000);
    }

    onUpdateDoctor(updatedDoc);
    triggerSaveNotification('تم الحفظ');
  };

  // --- Clinic Management Actions ---
  const handleOpenAddClinic = () => {
    setEditingBranchId(null);
    setClinicName('');
    setClinicAddress('');
    setClinicPhone(formData.phone || '');
    setClinicPrice('');
    setClinicMapUrl('');
    setClinicError(null);
    setClinicSummaryHours('السبت إلى الخميس: 4 عصراً - 9 مساءً');
    setClinicSchedule(
      DEFAULT_WEEK_DAYS.map(day => ({
        day,
        isAvailable: day !== 'الجمعة',
        start: '04:00 مساءً',
        end: '09:00 مساءً'
      }))
    );
    setIsClinicModalOpen(true);
  };

  const handleOpenEditClinic = (branch: Branch) => {
    setEditingBranchId(branch.id);
    setClinicName(branch.name || '');
    setClinicAddress(branch.address || '');
    setClinicPhone(branch.phone || '');
    setClinicPrice(branch.price ? String(branch.price) : '');
    setClinicMapUrl(branch.mapUrl || '');
    setClinicError(null);
    setClinicSummaryHours(branch.workingHours || '');
    
    // Prepare Schedule
    if (branch.workingHoursList && branch.workingHoursList.length > 0) {
      // Map existing or complete missing days
      const existingMap = new Map(branch.workingHoursList.map(item => [item.day, item]));
      const fullList = DEFAULT_WEEK_DAYS.map(day => {
        if (existingMap.has(day)) {
          return existingMap.get(day)!;
        }
        return {
          day,
          isAvailable: false,
          start: '04:00 مساءً',
          end: '09:00 مساءً'
        };
      });
      setClinicSchedule(fullList);
    } else {
      setClinicSchedule(
        DEFAULT_WEEK_DAYS.map(day => ({
          day,
          isAvailable: true,
          start: '04:00 مساءً',
          end: '09:00 مساءً'
        }))
      );
    }

    setIsClinicModalOpen(true);
  };

  const handleSaveClinic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clinicName.trim()) return;

    if (!clinicMapUrl.trim()) {
      setClinicError('يرجى إدخال رابط موقع العيادة على خرائط جوجل (Google Maps Link) فهو حقل إجباري');
      return;
    }
    setClinicError(null);

    const newBranch: Branch = {
      id: editingBranchId || `branch-${Date.now()}`,
      name: clinicName.trim(),
      address: clinicAddress.trim(),
      phone: clinicPhone.trim(),
      price: clinicPrice.trim(),
      mapUrl: clinicMapUrl.trim(),
      workingHours: clinicSummaryHours.trim(),
      workingHoursList: clinicSchedule
    };

    let updatedBranches: Branch[] = [];
    if (editingBranchId) {
      updatedBranches = formData.branches.map(b => b.id === editingBranchId ? newBranch : b);
    } else {
      updatedBranches = [...formData.branches, newBranch];
    }

    const updatedDoc = {
      ...formData,
      branches: updatedBranches
    };

    setFormData(updatedDoc);
    onUpdateDoctor(updatedDoc);
    setIsClinicModalOpen(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 4000);
  };

  const handleDeleteClinic = (branchId: string) => {
    if (window.confirm('هل أنت تأكد من رغبتك في حذف هذه العيادة ومواعيدها؟')) {
      const updatedBranches = formData.branches.filter(b => b.id !== branchId);
      const updatedDoc = {
        ...formData,
        branches: updatedBranches
      };
      setFormData(updatedDoc);
      onUpdateDoctor(updatedDoc);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    }
  };

  const handleDayToggle = (index: number) => {
    setClinicSchedule(prev => prev.map((item, i) => i === index ? { ...item, isAvailable: !item.isAvailable } : item));
  };

  const handleDayTimeChange = (index: number, field: 'start' | 'end', value: string) => {
    setClinicSchedule(prev => prev.map((item, i) => i === index ? { ...item, [field]: value } : item));
  };

  return (
    <div className={`w-full min-h-screen flex flex-col md:flex-row text-right font-sans dir-rtl overflow-x-hidden transition-colors duration-200 ${
      isDarkMode ? 'bg-[#000000] text-white doctor-dark-mode' : 'bg-neutral-100 text-neutral-900'
    }`}>
      {/* Dark Mode Custom CSS Rules */}
      {isDarkMode && (
        <style>{`
          .doctor-dark-mode {
            background-color: #000000 !important;
            color: #ffffff !important;
          }
          .doctor-dark-mode aside {
            background-color: #0d0e12 !important;
            border-color: #222634 !important;
            color: #ffffff !important;
          }
          .doctor-dark-mode main {
            background-color: #000000 !important;
            color: #ffffff !important;
          }
          .doctor-dark-mode .border-neutral-200,
          .doctor-dark-mode .border-neutral-300,
          .doctor-dark-mode .border-neutral-100 {
            border-color: #222634 !important;
          }
          .doctor-dark-mode .bg-white,
          .doctor-dark-mode .bg-neutral-50,
          .doctor-dark-mode .bg-neutral-100,
          .doctor-dark-mode .bg-neutral-50\\/80 {
            background-color: #0d0e12 !important;
            color: #ffffff !important;
            border-color: #222634 !important;
          }
          .doctor-dark-mode main .bg-white,
          .doctor-dark-mode main .bg-neutral-50,
          .doctor-dark-mode main .rounded-2xl,
          .doctor-dark-mode main .rounded-3xl,
          .doctor-dark-mode main .rounded-xl {
            border: 1px solid #222634 !important;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5) !important;
          }
          .doctor-dark-mode h1,
          .doctor-dark-mode h2,
          .doctor-dark-mode h3,
          .doctor-dark-mode h4,
          .doctor-dark-mode h5,
          .doctor-dark-mode h6,
          .doctor-dark-mode .text-neutral-900,
          .doctor-dark-mode .text-neutral-800,
          .doctor-dark-mode .text-black,
          .doctor-dark-mode .text-\\[\\#10244A\\] {
            color: #ffffff !important;
          }
          .doctor-dark-mode .text-neutral-700,
          .doctor-dark-mode .text-neutral-600,
          .doctor-dark-mode .text-neutral-500 {
            color: #a1a1aa !important;
          }
          .doctor-dark-mode input:not([type="checkbox"]):not([type="radio"]),
          .doctor-dark-mode textarea,
          .doctor-dark-mode select {
            background-color: #161822 !important;
            color: #ffffff !important;
            border-color: #2e3448 !important;
          }
          .doctor-dark-mode input::placeholder,
          .doctor-dark-mode textarea::placeholder {
            color: #71717a !important;
          }
          .doctor-dark-mode .fixed.inset-0 .bg-white {
            background-color: #0d0e12 !important;
            border: 1px solid #2e3448 !important;
          }
          .doctor-dark-mode .hover\\:bg-neutral-100:hover,
          .doctor-dark-mode .hover\\:bg-neutral-50:hover {
            background-color: #1a1d29 !important;
          }
          .doctor-dark-mode tr:hover {
            background-color: #161822 !important;
          }
          .doctor-dark-mode th {
            background-color: #0d0e12 !important;
            color: #e4e4e7 !important;
          }
          .doctor-dark-mode td {
            border-color: #222634 !important;
            color: #f4f4f5 !important;
          }
          .doctor-dark-mode .md\\:hidden.bg-white {
            background-color: #0d0e12 !important;
            border-color: #222634 !important;
            color: #ffffff !important;
          }
        `}</style>
      )}
      {/* Mobile / Tablet Top Header Bar (md:hidden) */}
      <div className="md:hidden bg-white text-neutral-900 px-4 py-3 flex items-center justify-between border-b border-neutral-200 sticky top-0 z-30 w-full shadow-xs">
        {/* Right side (RTL): Doctor's Name & Avatar */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-[#10244A]/10 border border-[#10244A]/20 flex items-center justify-center text-[#10244A] overflow-hidden shrink-0">
            {formData.avatar ? (
              <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-4 h-4 text-[#10244A]" />
            )}
          </div>
          <div className="flex flex-col text-right truncate">
            <span className="font-extrabold text-xs sm:text-sm text-neutral-900 truncate">
              {loggedSecretary ? loggedSecretary.name : `د. ${formData.name || 'البروفايل'}`}
            </span>
            <span className="text-[9px] text-[#10244A] font-bold truncate">
              {loggedSecretary ? 'سكرتارية العيادة' : (formData.jobTitle || 'لوحة التحكم')}
            </span>
          </div>
        </div>

        {/* Left side (RTL): Menu Button & Bell */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(true)}
            className="md:hidden relative p-2 text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center border border-neutral-200"
            aria-label="الإشعارات"
          >
            <Bell className="w-5 h-5 text-neutral-800" strokeWidth={2.5} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-xs">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center border border-neutral-200"
            aria-label="الأقسام"
          >
            <Menu className="w-6 h-6 text-neutral-800" strokeWidth={2.75} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Overlay (md:hidden) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-64 max-w-[75vw] bg-white text-neutral-800 p-4 flex flex-col justify-between z-50 shadow-2xl overflow-y-auto h-full dir-rtl ml-auto border-l border-neutral-200">
            <div className="space-y-6 w-full">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#10244A]/10 border border-[#10244A]/20 flex items-center justify-center text-[#10244A] overflow-hidden shrink-0">
                    {formData.avatar ? (
                      <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-4 h-4 text-[#10244A]" />
                    )}
                  </div>
                  <div className="flex flex-col text-right overflow-hidden">
                    <h3 className="font-extrabold text-sm text-neutral-900 truncate">{formData.name || 'دكتور بروفايل'}</h3>
                    <span className="text-[9px] text-[#10244A] font-extrabold uppercase mt-0.5">
                      {loggedSecretary ? `سكرتارية: ${loggedSecretary.name}` : (formData.jobTitle || 'لوحة تحكم الطبيب')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-1 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Nav Items */}
              <nav className="flex flex-col gap-1.5 text-xs font-bold w-full">
                {!loggedSecretary && (
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('appearance'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                      activeTab === 'appearance' ? 'bg-[#0B2545] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Palette className={`w-4 h-4 flex-shrink-0 ${activeTab === 'appearance' ? 'text-white' : 'text-[#0B2545]'}`} />
                      <span>المظهر الرئيسي</span>
                    </div>
                  </button>
                )}

                {(!loggedSecretary || loggedSecretary.permissions?.viewAppointments !== false) && (
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('bookings'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                      activeTab === 'bookings' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className={`w-4 h-4 flex-shrink-0 ${activeTab === 'bookings' ? 'text-white' : 'text-[#10244A]'}`} />
                      <span>طلبات الحجز</span>
                    </div>
                    {pendingBookingsCount > 0 ? (
                      <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-full font-black animate-pulse">
                        {pendingBookingsCount} جديد
                      </span>
                    ) : (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'bookings' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                        {doctorAppointments.length}
                      </span>
                    )}
                  </button>
                )}

                {(!loggedSecretary || loggedSecretary.permissions?.manageConsultations !== false) && (
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('consultations'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                      activeTab === 'consultations' ? 'bg-[#009bb9] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Stethoscope className={`w-4 h-4 flex-shrink-0 ${activeTab === 'consultations' ? 'text-white' : 'text-[#009bb9]'}`} />
                      <span>إدارة الكشوفات</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'consultations' ? 'bg-white/20 text-white' : 'bg-[#009bb9]/10 text-[#009bb9]'}`}>
                      {patientRecords.length} مريض
                    </span>
                  </button>
                )}

                {!loggedSecretary && (
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('secretaries'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                      activeTab === 'secretaries' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Users className={`w-4 h-4 flex-shrink-0 ${activeTab === 'secretaries' ? 'text-white' : 'text-[#10244A]'}`} />
                      <span>إدارة السكرتارية</span>
                    </div>
                    {formData.secretaries && formData.secretaries.length > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'secretaries' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                        {formData.secretaries.length}
                      </span>
                    )}
                  </button>
                )}

                {/* Schedules */}
                {(!loggedSecretary || !!loggedSecretary.permissions?.manageClinics) && (
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('schedules'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                      activeTab === 'schedules' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Clock className={`w-4 h-4 flex-shrink-0 ${activeTab === 'schedules' ? 'text-white' : 'text-[#10244A]'}`} />
                      <span>المواعيد والعيادات</span>
                    </div>
                    {formData.branches.length > 0 && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'schedules' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                        {formData.branches.length}
                      </span>
                    )}
                  </button>
                )}

                {/* Services */}
                {(!loggedSecretary || loggedSecretary.permissions?.manageServices) && (
                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => { setActiveTab('services'); setIsMobileMenuOpen(false); }}
                      className={`flex-1 flex items-center justify-between px-4 py-3 rounded-full transition-all text-right cursor-pointer ${
                        activeTab === 'services' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className={`w-4 h-4 flex-shrink-0 ${activeTab === 'services' ? 'text-white' : 'text-[#10244A]'}`} />
                        <span>الخدمات الطبية</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'services' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                        {formData.services?.length || 0}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleServices(); }}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        (formData.features?.servicesAndPrices ?? true) ? 'text-emerald-600 hover:bg-neutral-100' : 'text-rose-500 hover:bg-neutral-100 opacity-60'
                      }`}
                      title="إظهار / إخفاء القسم"
                    >
                      {(formData.features?.servicesAndPrices ?? true) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Reviews */}
                {(!loggedSecretary || !!loggedSecretary.permissions?.managePatients) && (
                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => { setActiveTab('reviews'); setIsMobileMenuOpen(false); }}
                      className={`flex-1 flex items-center justify-between px-4 py-3 rounded-full transition-all text-right cursor-pointer ${
                        activeTab === 'reviews' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Star className={`w-4 h-4 flex-shrink-0 ${activeTab === 'reviews' ? 'text-white' : 'text-[#10244A]'}`} />
                        <span>تقييمات المرضى</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'reviews' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                        {formData.reviews?.length || 0}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleReviews(); }}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        (formData.features?.patientReviews ?? true) ? 'text-emerald-600 hover:bg-neutral-100' : 'text-rose-500 hover:bg-neutral-100 opacity-60'
                      }`}
                      title="إظهار / إخفاء القسم"
                    >
                      {(formData.features?.patientReviews ?? true) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Gallery */}
                {(!loggedSecretary || loggedSecretary.permissions?.manageGallery) && (
                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => { setActiveTab('gallery'); setIsMobileMenuOpen(false); }}
                      className={`flex-1 flex items-center justify-between px-4 py-3 rounded-full transition-all text-right cursor-pointer ${
                        activeTab === 'gallery' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <ImageIcon className={`w-4 h-4 flex-shrink-0 ${activeTab === 'gallery' ? 'text-white' : 'text-[#10244A]'}`} />
                        <span>معرض الصور</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'gallery' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                        {formData.galleryItems?.length || 0}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleGallery(); }}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        (formData.features?.photoGallery ?? true) ? 'text-emerald-600 hover:bg-neutral-100' : 'text-rose-500 hover:bg-neutral-100 opacity-60'
                      }`}
                      title="إظهار / إخفاء القسم"
                    >
                      {(formData.features?.photoGallery ?? true) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Videos */}
                {(!loggedSecretary || loggedSecretary.permissions?.manageVideos) && (
                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => { setActiveTab('videos'); setIsMobileMenuOpen(false); }}
                      className={`flex-1 flex items-center justify-between px-4 py-3 rounded-full transition-all text-right cursor-pointer ${
                        activeTab === 'videos' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Video className={`w-4 h-4 flex-shrink-0 ${activeTab === 'videos' ? 'text-white' : 'text-[#10244A]'}`} />
                        <span>مكتبة الفيديوهات</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'videos' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                        {formData.videos?.length || 0}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleVideos(); }}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        (formData.features?.videosSection ?? true) ? 'text-emerald-600 hover:bg-neutral-100' : 'text-rose-500 hover:bg-neutral-100 opacity-60'
                      }`}
                      title="إظهار / إخفاء القسم"
                    >
                      {(formData.features?.videosSection ?? true) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Certificates */}
                {(!loggedSecretary || loggedSecretary.permissions?.manageCertificates) && (
                  <div className="flex items-center gap-1">
                    <button 
                      type="button"
                      onClick={() => { setActiveTab('certificates'); setIsMobileMenuOpen(false); }}
                      className={`flex-1 flex items-center justify-between px-4 py-3 rounded-full transition-all text-right cursor-pointer ${
                        activeTab === 'certificates' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Award className={`w-4 h-4 flex-shrink-0 ${activeTab === 'certificates' ? 'text-white' : 'text-[#10244A]'}`} />
                        <span>الشهادات والاعتمادات</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'certificates' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                        {formData.certificates?.length || 0}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleToggleCertificates(); }}
                      className={`p-2 rounded-full transition-colors cursor-pointer ${
                        (formData.features?.addCertificates ?? true) ? 'text-emerald-600 hover:bg-neutral-100' : 'text-rose-500 hover:bg-neutral-100 opacity-60'
                      }`}
                      title="إظهار / إخفاء القسم"
                    >
                      {(formData.features?.addCertificates ?? true) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                {/* Contact */}
                {(!loggedSecretary || !!loggedSecretary.permissions?.sendWhatsapp) && (
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('contact'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                      activeTab === 'contact' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Share2 className={`w-4 h-4 flex-shrink-0 ${activeTab === 'contact' ? 'text-white' : 'text-[#10244A]'}`} />
                      <span>التواصل والروابط</span>
                    </div>
                  </button>
                )}

                {!loggedSecretary && (
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('perks'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                      activeTab === 'perks' ? 'bg-[#0B2545] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className={`w-4 h-4 flex-shrink-0 ${activeTab === 'perks' ? 'text-white' : 'text-[#0B2545]'}`} />
                      <span>مزايا إضافية</span>
                    </div>
                  </button>
                )}

                {!loggedSecretary && (
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('account'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                      activeTab === 'account' ? 'bg-[#0B2545] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Settings className={`w-4 h-4 flex-shrink-0 ${activeTab === 'account' ? 'text-white' : 'text-[#0B2545]'}`} />
                      <span>إعدادات الحساب</span>
                    </div>
                  </button>
                )}

                {!loggedSecretary && (
                  <button 
                    type="button"
                    onClick={() => { setActiveTab('subscription'); setIsMobileMenuOpen(false); }}
                    className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                      activeTab === 'subscription' ? 'bg-[#0B2545] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreditCard className={`w-4 h-4 flex-shrink-0 ${activeTab === 'subscription' ? 'text-white' : 'text-[#0B2545]'}`} />
                      <span>إدارة الاشتراك</span>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'subscription' ? 'bg-white/20 text-white' : 'bg-[#0B2545]/10 text-[#0B2545]'}`}>
                      {formData.isPaidSubscription ? 'نشط' : (isDoctorTrialActive(formData) ? 'تجريبي' : 'منتهي')}
                    </span>
                  </button>
                )}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="pt-6 border-t border-neutral-200 space-y-3 mt-6">
              <button 
                type="button"
                onClick={onLogout}
                className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>تسجيل الخروج</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Doctor / Secretary Sidebar for Desktop (hidden md:flex) */}
      <aside className="hidden md:flex md:w-56 lg:w-72 bg-white border-l border-neutral-200 text-neutral-800 p-4 lg:p-6 flex-col justify-between z-10 shadow-sm shrink-0 self-stretch">
        <div className="space-y-6 w-full">
          
          {/* Header Branding */}
          <div className="flex items-center justify-between gap-2 pb-6 border-b border-neutral-200">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-[#10244A]/10 border border-[#10244A]/20 flex items-center justify-center text-[#10244A] overflow-hidden shrink-0">
                {formData.avatar ? (
                  <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-[#10244A]" />
                )}
              </div>
              <div className="flex flex-col text-right overflow-hidden">
                <h3 className="font-extrabold text-sm text-neutral-900 truncate">{formData.name || 'دكتور بروفايل'}</h3>
                <span className="text-[9px] text-[#10244A] font-extrabold uppercase mt-0.5">
                  {loggedSecretary ? `سكرتارية: ${loggedSecretary.name}` : (formData.jobTitle || 'لوحة تحكم الطبيب')}
                </span>
              </div>
            </div>

            {/* Desktop Notification Bell */}
            <button
              type="button"
              onClick={() => setIsNotificationsOpen(true)}
              className="relative p-2 text-neutral-800 hover:bg-neutral-100 active:bg-neutral-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center border border-neutral-200 shrink-0"
              aria-label="الإشعارات"
            >
              <Bell className="w-5 h-5 text-neutral-800" strokeWidth={2.5} />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-xs">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1.5 text-xs font-bold w-full">
            {!loggedSecretary && (
              <button 
                type="button"
                onClick={() => setActiveTab('appearance')}
                className={`flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                  activeTab === 'appearance' ? 'bg-[#0B2545] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 truncate">
                  <Palette className={`w-4 h-4 flex-shrink-0 ${activeTab === 'appearance' ? 'text-white' : 'text-[#0B2545]'}`} />
                  <span className="truncate">المظهر الرئيسي</span>
                </div>
              </button>
            )}

            {(!loggedSecretary || loggedSecretary.permissions?.viewAppointments !== false) && (
              <button 
                type="button"
                onClick={() => setActiveTab('bookings')}
                className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                  activeTab === 'bookings' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className={`w-4 h-4 flex-shrink-0 ${activeTab === 'bookings' ? 'text-white' : 'text-[#10244A]'}`} />
                  <span>طلبات الحجز</span>
                </div>
                {pendingBookingsCount > 0 ? (
                  <span className="text-[10px] bg-amber-500 text-black px-2 py-0.5 rounded-full font-black animate-pulse">
                    {pendingBookingsCount} جديد
                  </span>
                ) : (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'bookings' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                    {doctorAppointments.length}
                  </span>
                )}
              </button>
            )}

            {(!loggedSecretary || loggedSecretary.permissions?.manageConsultations !== false) && (
              <button 
                type="button"
                onClick={() => setActiveTab('consultations')}
                className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                  activeTab === 'consultations' ? 'bg-[#009bb9] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Stethoscope className={`w-4 h-4 flex-shrink-0 ${activeTab === 'consultations' ? 'text-white' : 'text-[#009bb9]'}`} />
                  <span>إدارة الكشوفات</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'consultations' ? 'bg-white/20 text-white' : 'bg-[#009bb9]/10 text-[#009bb9]'}`}>
                  {patientRecords.length} مريض
                </span>
              </button>
            )}

            {!loggedSecretary && (
              <button 
                type="button"
                onClick={() => setActiveTab('secretaries')}
                className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                  activeTab === 'secretaries' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Users className={`w-4 h-4 flex-shrink-0 ${activeTab === 'secretaries' ? 'text-white' : 'text-[#10244A]'}`} />
                  <span>إدارة السكرتارية</span>
                </div>
                {formData.secretaries && formData.secretaries.length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'secretaries' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                    {formData.secretaries.length}
                  </span>
                )}
              </button>
            )}

            {/* Schedules */}
            {(!loggedSecretary || !!loggedSecretary.permissions?.manageClinics) && (
              <button 
                type="button"
                onClick={() => setActiveTab('schedules')}
                className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                  activeTab === 'schedules' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-4 h-4 flex-shrink-0 ${activeTab === 'schedules' ? 'text-white' : 'text-[#10244A]'}`} />
                  <span>المواعيد والعيادات</span>
                </div>
                {formData.branches.length > 0 && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'schedules' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                    {formData.branches.length}
                  </span>
                )}
              </button>
            )}

            {/* Services */}
            {(!loggedSecretary || loggedSecretary.permissions?.manageServices) && (
              <div className="flex items-center gap-1">
                <button 
                  type="button"
                  onClick={() => setActiveTab('services')}
                  className={`flex-1 flex items-center justify-between px-4 py-3 rounded-full transition-all text-right cursor-pointer ${
                    activeTab === 'services' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className={`w-4 h-4 flex-shrink-0 ${activeTab === 'services' ? 'text-white' : 'text-[#10244A]'}`} />
                    <span>الخدمات الطبية</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'services' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                    {formData.services?.length || 0}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleToggleServices(); }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    (formData.features?.servicesAndPrices ?? true) ? 'text-emerald-600 hover:bg-neutral-100' : 'text-rose-500 hover:bg-neutral-100 opacity-60'
                  }`}
                  title="إظهار / إخفاء القسم"
                >
                  {(formData.features?.servicesAndPrices ?? true) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Reviews */}
            {(!loggedSecretary || !!loggedSecretary.permissions?.managePatients) && (
              <div className="flex items-center gap-1">
                <button 
                  type="button"
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 flex items-center justify-between px-4 py-3 rounded-full transition-all text-right cursor-pointer ${
                    activeTab === 'reviews' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Star className={`w-4 h-4 flex-shrink-0 ${activeTab === 'reviews' ? 'text-white' : 'text-[#10244A]'}`} />
                    <span>تقييمات المرضى</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'reviews' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                    {formData.reviews?.length || 0}
                  </span>
                </button>
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleToggleReviews(); }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    (formData.features?.patientReviews ?? true) ? 'text-emerald-600 hover:bg-neutral-100' : 'text-rose-500 hover:bg-neutral-100 opacity-60'
                  }`}
                  title="إظهار / إخفاء القسم"
                >
                  {(formData.features?.patientReviews ?? true) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Gallery */}
            {(!loggedSecretary || loggedSecretary.permissions?.manageGallery) && (
              <div className="flex items-center gap-1">
                <button 
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className={`flex-1 flex items-center justify-between px-4 py-3 rounded-full transition-all text-right cursor-pointer ${
                    activeTab === 'gallery' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ImageIcon className={`w-4 h-4 flex-shrink-0 ${activeTab === 'gallery' ? 'text-white' : 'text-[#10244A]'}`} />
                    <span>معرض الصور</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'gallery' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                    {formData.galleryItems?.length || 0}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleToggleGallery(); }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    (formData.features?.photoGallery ?? true) ? 'text-emerald-600 hover:bg-neutral-100' : 'text-rose-500 hover:bg-neutral-100 opacity-60'
                  }`}
                  title="إظهار / إخفاء القسم"
                >
                  {(formData.features?.photoGallery ?? true) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Videos */}
            {(!loggedSecretary || loggedSecretary.permissions?.manageVideos) && (
              <div className="flex items-center gap-1">
                <button 
                  type="button"
                  onClick={() => setActiveTab('videos')}
                  className={`flex-1 flex items-center justify-between px-4 py-3 rounded-full transition-all text-right cursor-pointer ${
                    activeTab === 'videos' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Video className={`w-4 h-4 flex-shrink-0 ${activeTab === 'videos' ? 'text-white' : 'text-[#10244A]'}`} />
                    <span>مكتبة الفيديوهات</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'videos' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                    {formData.videos?.length || 0}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleToggleVideos(); }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    (formData.features?.videosSection ?? true) ? 'text-emerald-600 hover:bg-neutral-100' : 'text-rose-500 hover:bg-neutral-100 opacity-60'
                  }`}
                  title="إظهار / إخفاء القسم"
                >
                  {(formData.features?.videosSection ?? true) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Certificates */}
            {(!loggedSecretary || loggedSecretary.permissions?.manageCertificates) && (
              <div className="flex items-center gap-1">
                <button 
                  type="button"
                  onClick={() => setActiveTab('certificates')}
                  className={`flex-1 flex items-center justify-between px-4 py-3 rounded-full transition-all text-right cursor-pointer ${
                    activeTab === 'certificates' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Award className={`w-4 h-4 flex-shrink-0 ${activeTab === 'certificates' ? 'text-white' : 'text-[#10244A]'}`} />
                    <span>الشهادات والاعتمادات</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'certificates' ? 'bg-white/20 text-white' : 'bg-[#10244A]/10 text-[#10244A]'}`}>
                    {formData.certificates?.length || 0}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleToggleCertificates(); }}
                  className={`p-2 rounded-full transition-colors cursor-pointer ${
                    (formData.features?.addCertificates ?? true) ? 'text-emerald-600 hover:bg-neutral-100' : 'text-rose-500 hover:bg-neutral-100 opacity-60'
                  }`}
                  title="إظهار / إخفاء القسم"
                >
                  {(formData.features?.addCertificates ?? true) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}

            {/* Contact */}
            {(!loggedSecretary || !!loggedSecretary.permissions?.sendWhatsapp) && (
              <button 
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`flex items-center justify-between px-4 py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                  activeTab === 'contact' ? 'bg-[#10244A] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Share2 className={`w-4 h-4 flex-shrink-0 ${activeTab === 'contact' ? 'text-white' : 'text-[#10244A]'}`} />
                  <span>التواصل والروابط</span>
                </div>
              </button>
            )}

            {!loggedSecretary && (
              <button 
                type="button"
                onClick={() => setActiveTab('perks')}
                className={`flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                  activeTab === 'perks' ? 'bg-[#0B2545] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 truncate">
                  <Sparkles className={`w-4 h-4 flex-shrink-0 ${activeTab === 'perks' ? 'text-white' : 'text-[#0B2545]'}`} />
                  <span className="truncate">مزايا إضافية</span>
                </div>
              </button>
            )}

            {!loggedSecretary && (
              <button 
                type="button"
                onClick={() => setActiveTab('account')}
                className={`flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                  activeTab === 'account' ? 'bg-[#0B2545] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 truncate">
                  <Settings className={`w-4 h-4 flex-shrink-0 ${activeTab === 'account' ? 'text-white' : 'text-[#0B2545]'}`} />
                  <span className="truncate">إعدادات الحساب</span>
                </div>
              </button>
            )}

            {!loggedSecretary && (
              <button 
                type="button"
                onClick={() => setActiveTab('subscription')}
                className={`flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full transition-all text-right w-full cursor-pointer ${
                  activeTab === 'subscription' ? 'bg-[#0B2545] text-white font-extrabold shadow-md' : 'text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <div className="flex items-center gap-2 sm:gap-3 truncate">
                  <CreditCard className={`w-4 h-4 flex-shrink-0 ${activeTab === 'subscription' ? 'text-white' : 'text-[#0B2545]'}`} />
                  <span className="truncate">إدارة الاشتراك</span>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${activeTab === 'subscription' ? 'bg-white/20 text-white' : 'bg-[#0B2545]/10 text-[#0B2545]'}`}>
                  {formData.isPaidSubscription ? 'نشط' : (isDoctorTrialActive(formData) ? 'تجريبي' : 'منتهي')}
                </span>
              </button>
            )}
          </nav>
        </div>

        {/* Logout */}
        <div className="pt-6 border-t border-neutral-200 space-y-3 mt-8">
          <button 
            type="button"
            onClick={onLogout}
            className="w-full py-2.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 w-full max-w-7xl mx-auto min-w-0 overflow-x-hidden">
        

        
        

        {/* Global Success Notification */}
        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-3 animate-fadeIn shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{savedSuccessMessage || 'تم الحفظ'}</span>
          </div>
        )}

        {/* Rejected Account Alert */}
        {formData.approvalStatus === 'rejected' && (
          <div className="mb-6 p-6 rounded-2xl bg-red-50 border border-red-200 text-right space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-black text-red-900">⚠️ تم رفض طلب انضمامك وتنشيط حسابك من قبل الإدارة</h3>
                <p className="text-neutral-600 text-xs font-semibold mt-0.5">يمكنك مراجعة السبب الموضح أدناه، وتعديل بيانات ملفك وإعادة إرسال الطلب للمراجعة والتدقيق فورا.</p>
              </div>
            </div>
            
            {formData.rejectionReason && (
              <div className="bg-white border border-red-200 p-4 rounded-xl">
                <span className="block text-xs font-black text-red-800 mb-1">سبب الرفض الموضح من الإدارة:</span>
                <p className="text-xs font-semibold text-neutral-700 leading-relaxed">{formData.rejectionReason}</p>
              </div>
            )}

            <div className="flex items-center justify-start gap-3">
              <button
                type="button"
                onClick={() => {
                  const updatedDoc = {
                    ...formData,
                    approvalStatus: 'pending' as const
                  };
                  setFormData(updatedDoc);
                  onUpdateDoctor(updatedDoc);
                  setSavedSuccess(true);
                  setTimeout(() => setSavedSuccess(false), 4000);
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-sm transition-all cursor-pointer"
              >
                🔄 تعديل وإعادة إرسال طلب المراجعة الآن
              </button>
            </div>
          </div>
        )}

        {/* Pending Account Alert */}
        {formData.approvalStatus === 'pending' && (
          <div className="mb-6 p-5 rounded-2xl bg-amber-50 border border-amber-200 text-right flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-xl shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-amber-900">📝 حسابك قيد المراجعة والتدقيق والتوثيق حالياً</h3>
                <p className="text-neutral-600 text-xs font-semibold">تتم الآن مراجعة بيانات ملفك المهني واشتراكك من قبل الإدارة لتفعيل الحساب بالكامل على المنصة.</p>
              </div>
            </div>
            <span className="hidden md:inline-block text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-full font-black animate-pulse">
              انتظار المراجعة
            </span>
          </div>
        )}

        {/* Suspended Account Alert */}
        {formData.approvalStatus === 'suspended' && (
          <div className="mb-6 p-5 rounded-2xl bg-red-50 border border-red-200 text-right flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl shrink-0">
                <XCircle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-black text-red-900">🚫 تم إيقاف حسابك مؤقتاً من قبل الإدارة</h3>
                <p className="text-neutral-600 text-xs font-semibold">حسابك معطل مؤقتاً حالياً. يرجى التواصل مع الدعم الفني للمنصة لمعرفة التفاصيل وتنشيط اشتراكك.</p>
              </div>
            </div>
            <span className="hidden md:inline-block text-[10px] bg-red-100 text-red-800 border border-red-200 px-3 py-1 rounded-full font-black">
              حساب موقوف
            </span>
          </div>
        )}

        {/* 0. SUBSCRIPTION MANAGEMENT SECTION (قسم إدارة الاشتراك والباقة) */}
        {activeTab === 'subscription' && !loggedSecretary && (
          <div className="animate-fadeIn max-w-3xl mx-auto py-2">
            {renderProfileQuickBar()}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
              
              {/* Header Title */}
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                  إدارة الاشتراك والباقة
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                  متابعة تفاصيل خطة الاشتراك، الأيام المتبقية، وتجديد أو ترقية الباقة
                </p>
              </div>

              {/* Status Box */}
              <div className="p-6 sm:p-7 rounded-2xl bg-neutral-50/90 border border-neutral-200/90 space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/80 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-neutral-900">
                        {formData.subscriptionType === '6months'
                          ? 'اشتراك الباقة النصف سنوية (6 أشهر)'
                          : formData.isPaidSubscription
                          ? 'اشتراك الباقة السنوية (سنة كاملة)'
                          : 'فترة تجريبية مجانية (7 أيام)'}
                      </h3>
                    </div>
                    <p className="text-xs text-neutral-500 font-semibold mt-0.5">
                      {formData.isPaidSubscription
                        ? 'عضوية معتمدة ومفعلة بكامل المزايا والخصائص الاحترافية'
                        : isDoctorTrialActive(formData)
                        ? 'فترة تجريبية كاملة المميزات متاحة لحسابك'
                        : 'انتهت الفترة التجريبية، يرجى تفعيل الاشتراك لتشغيل بروفايلك'}
                    </p>
                  </div>

                  <div className="shrink-0">
                    {formData.isPaidSubscription ? (
                      <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black inline-flex items-center gap-1.5 shadow-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>اشتراك نشط ومفعل</span>
                      </span>
                    ) : isDoctorTrialActive(formData) ? (
                      <span className="px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-black inline-flex items-center gap-1.5 shadow-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>فترة تجريبية ({getDoctorRemainingTrialDays(formData)} يوم متبقي)</span>
                      </span>
                    ) : (
                      <span className="px-3.5 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-800 text-xs font-black inline-flex items-center gap-1.5 shadow-xs">
                        <AlertCircle className="w-3.5 h-3.5 text-red-600" />
                        <span>الاشتراك منتهي</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-neutral-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-neutral-500 block">📅 تاريخ بدء الحساب:</span>
                    <span className="text-xs sm:text-sm font-bold text-neutral-900">
                      {formData.registeredAt
                        ? new Date(formData.registeredAt).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })
                        : 'غير محدد'}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-neutral-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-neutral-500 block">⏳ تاريخ انتهاء الصلاحية:</span>
                    <span className="text-xs sm:text-sm font-bold text-neutral-900">
                      {getDoctorExpiryDate(formData).toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-neutral-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-neutral-500 block">⌛ الأيام المتبقية:</span>
                    <span className="text-xs sm:text-sm font-black text-[#0051A8]">
                      {getDoctorDaysRemaining(formData)} يوم
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-neutral-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-neutral-500 block">🔄 التجديد التلقائي:</span>
                    <span className="text-xs sm:text-sm font-black text-rose-600 block pt-0.5">
                      غير مفعل
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. MY INVOICES SECTION (فواتيري) */}
              <div className="space-y-4 pt-6 border-t border-neutral-200/80">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="text-right">
                    <h3 className="text-base sm:text-lg font-black text-neutral-900 flex items-center gap-2">
                      <span>🧾 فواتيري</span>
                      <span className="text-xs bg-blue-50 text-[#0051A8] border border-blue-200 px-2.5 py-0.5 rounded-full font-black">
                        {(formData.invoices || []).length} فاتورة
                      </span>
                    </h3>
                    <p className="text-xs text-neutral-500 font-semibold mt-0.5">
                      سجل فواتير الاشتراكات المعتمدة لحسابك، إمكانية المعاينة وتحميل الفاتورة الرسمية فوراً
                    </p>
                  </div>
                </div>

                {(!formData.invoices || formData.invoices.length === 0) ? (
                  <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-neutral-200/70 flex items-center justify-center mx-auto text-neutral-500 shadow-2xs">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-xs sm:text-sm text-neutral-800">لا توجد فواتير صادرة لحسابك حتى الآن</h4>
                      <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                        يتم إصدار الفاتورة الرسمية وتصلك هنا في نفس اللحظة فور قيام الإدارة بتفعيل أو تجديد باقة الاشتراك الخاصة بك.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {formData.invoices.map((inv) => (
                      <div 
                        key={inv.id || inv.invoiceNumber}
                        className="p-4 sm:p-5 rounded-2xl bg-white hover:bg-neutral-50/50 border border-neutral-200/90 transition-all shadow-2xs space-y-3 text-right"
                      >
                        {/* Top Header: Invoice Number (Right) and Action Icons (Left) */}
                        <div className="flex items-center justify-between gap-3">
                          
                          {/* Right: Icon + Invoice Number */}
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200/70 flex items-center justify-center text-neutral-700 shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <h4 className="text-sm sm:text-base font-black text-neutral-900 font-mono tracking-tight">
                              {inv.invoiceNumber}
                            </h4>
                          </div>

                          {/* Left: Action Icon Buttons (Icons only, no text) */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedInvoice(inv);
                                setIsInvoiceModalOpen(true);
                              }}
                              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-all cursor-pointer active:scale-95 shadow-2xs"
                              title="معاينة الفاتورة"
                              aria-label="معاينة الفاتورة"
                            >
                              <Eye className="w-4 h-4" />
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
                          </div>

                        </div>

                        {/* Bottom Row: 4 Divided Columns (تاريخ الإصدار، مدة الاشتراك، المبلغ، طريقة الدفع) */}
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
                    ))}
                  </div>
                )}
              </div>

              {/* Renewal / Upgrade CTA */}
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/90 text-center space-y-4">
                <div className="space-y-1">
                  <h4 className="text-sm sm:text-base font-bold text-neutral-900">
                    هل ترغب في الاشتراك أو تجديد اشتراكك؟
                  </h4>
                  <p className="text-xs text-neutral-500 font-medium max-w-md mx-auto">
                    تواصل مباشرة مع فريق إدارة المنصة عبر الواتساب
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                  <a
                    href={`https://wa.me/${landingConfig?.dashboardSettings?.contactAdminWhatsappNumber || '201111777251'}?text=${encodeURIComponent((landingConfig?.dashboardSettings?.contactAdminMessage || 'مرحباً إدارة دكتور بروفايل، أود الاستفسار عن تجديد/ترقية اشتراكي للطبيب: {doctorName}').replace('{doctorName}', formData.name))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>{landingConfig?.dashboardSettings?.contactAdminButtonText || 'تواصل مع الإدارة'}</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 1. ACCOUNT SETTINGS SECTION (إعدادات الحساب والملف المهني) */}
        {activeTab === 'account' && !loggedSecretary && (
          <form onSubmit={handleSubmit} className="animate-fadeIn max-w-3xl mx-auto py-2">
            {renderProfileQuickBar()}
            {/* MODERN MAIN CARD */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
              
              {/* Header Title */}
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                  إعدادات الحساب والملف الشخصي
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                  تعديل البيانات الشخصية، المؤهلات الطبية، ومعلومات التواصل
                </p>
              </div>

              {/* Centered Avatar / Profile Image */}
              <div className="flex flex-col items-center justify-center text-center">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white shadow-md bg-neutral-900 text-white flex items-center justify-center overflow-hidden cursor-pointer relative group transition-transform hover:scale-105"
                >
                  {formData.avatar ? (
                    <img 
                      src={formData.avatar} 
                      alt="Doctor Profile Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-neutral-300">
                      <User className="w-10 h-10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <Upload className="w-5 h-5 mb-0.5" />
                    <span className="text-[10px] font-bold">تغيير الصورة</span>
                  </div>
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/png, image/jpeg, image/jpg, image/webp" 
                  className="hidden" 
                />

                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs sm:text-sm font-bold text-neutral-700 hover:text-black transition-colors cursor-pointer"
                  >
                    {formData.avatar ? 'تغيير الصورة الشخصية' : 'إضافة صورة شخصية'}
                  </button>
                  {formData.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      (حذف)
                    </button>
                  )}
                </div>

                {isUploading && (
                  <span className="text-xs text-blue-600 font-bold animate-pulse mt-1">
                    جاري معالجة ورفع الصورة...
                  </span>
                )}

                {uploadError && (
                  <div className="mt-2 p-2 rounded-xl bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* SECTION 1: Personal & Professional Data */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-neutral-100 text-neutral-800">
                  <User className="w-4 h-4 text-neutral-700" />
                  <h3 className="text-sm font-bold">البيانات الأساسية والمهنية</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Doctor Full Name */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                      اسم الطبيب بالكامل (بالعربية) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="مثال: د. محمد جابر السعدني"
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                      />
                    </div>
                  </div>

                  {/* Username / Profile Slug */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                      رابط البروفايل (اسم المستخدم بالإنجليزية) <span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-stretch border border-neutral-300 rounded-xl overflow-hidden focus-within:border-neutral-600 transition-all bg-white" dir="ltr">
                      <div className="bg-neutral-100 border-r border-neutral-300 px-3.5 flex items-center gap-1.5 text-neutral-600 text-xs sm:text-sm font-medium shrink-0 select-none">
                        <Globe className="w-4 h-4 text-neutral-500" />
                        <span>dr-profile.com/dr/</span>
                      </div>
                      <input
                        type="text"
                        name="nameEn"
                        value={formData.nameEn}
                        onChange={handleChange}
                        required
                        placeholder="mohamed-jaber"
                        className="w-full px-3.5 py-3 text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none bg-transparent"
                      />
                    </div>
                    <div className="text-[11px] sm:text-xs text-neutral-500 flex items-center justify-start gap-1 mt-1" dir="rtl">
                      <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span>يمكنك تغييره لاحقاً ليكون الرابط المباشر لموقعك أو بروفايلك</span>
                    </div>
                  </div>

                  {/* Primary Specialty */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                      التخصص الرئيسي <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-neutral-600 transition-all text-right"
                    >
                      {INITIAL_SPECIALTIES.map(spec => (
                        <option key={spec.id} value={spec.id} className="bg-white text-neutral-900">
                          {spec.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Years of Experience */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                      سنوات الخبرة العملية
                    </label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience || 0}
                      onChange={handleChange}
                      min="0"
                      max="60"
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-neutral-600 transition-all text-right"
                    />
                  </div>

                  {/* Scientific / Job Title */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                      اللقب العلمي والتخصص الدقيق
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="مثال: استشاري زراعة وتجميل الأسنان - زميل الجمعية الألمانية"
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                    />
                  </div>

                </div>
              </div>

              {/* SECTION 2: Contact Information */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-neutral-100 text-neutral-800">
                  <Phone className="w-4 h-4 text-neutral-700" />
                  <h3 className="text-sm font-bold">بيانات التواصل المباشر</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                      رقم الهاتف للاتصال <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      dir="ltr"
                      placeholder="01012345678"
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                      رقم الواتساب <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      required
                      dir="ltr"
                      placeholder="201012345678"
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      dir="ltr"
                      placeholder="doctor@example.com"
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-left"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 3: Bio */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-neutral-100 text-neutral-800">
                  <FileText className="w-4 h-4 text-neutral-700" />
                  <h3 className="text-sm font-bold">النبذة التعريفية</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                    نبذة عنك وعن خبراتك ومؤهلاتك الطبية (تظهر في قسم "من نحن")
                  </label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="اكتب نبذة مختصرة عن مؤهلاتك العلمية، خبراتك الطبية، وأبرز الخدمات التي تقدمها للمرضى..."
                    className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all leading-relaxed resize-y text-right"
                  />
                </div>
              </div>

              {/* SECTION 4: Visual Identity & Header Brand */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2 pb-1 border-b border-neutral-100 text-neutral-800">
                  <Sparkles className="w-4 h-4 text-neutral-700" />
                  <h3 className="text-sm font-bold">الهوية البصرية ولون المظهر</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Header display name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                      الاسم المختصر في الشريط العلوي (الهيدر)
                    </label>
                    <input
                      type="text"
                      name="headerDisplayName"
                      value={formData.headerDisplayName || ''}
                      onChange={handleChange}
                      placeholder={`الافتراضي: ${getTwoWordName(formData.name || 'د. محمد جابر')}`}
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                    />
                  </div>

                  {/* Header Logo Upload */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                      شعار الهيدر المخصص (اختياري)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        ref={headerAvatarInputRef}
                        onChange={(e) => e.target.files?.[0] && handleHeaderAvatarUpload(e.target.files[0])}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => headerAvatarInputRef.current?.click()}
                        className="flex-1 px-4 py-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        <span>{formData.headerAvatar ? 'تغيير صورة الهيدر' : 'رفع صورة للهيدر'}</span>
                      </button>
                      {formData.headerAvatar && (
                        <button
                          type="button"
                          onClick={handleRemoveHeaderAvatar}
                          className="px-3 py-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
                        >
                          إلغاء
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION 5: Password & Security (تغيير كلمة المرور وأمان الحساب) */}
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between pb-1 border-b border-neutral-100 text-neutral-800">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-neutral-700" />
                    <h3 className="text-sm font-bold">تغيير كلمة المرور</h3>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-semibold">
                    أمان الحساب
                  </span>
                </div>

                <div className="bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-4 sm:p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                        كلمة المرور الجديدة
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => {
                            setNewPassword(e.target.value);
                            if (passwordStatus) setPasswordStatus(null);
                          }}
                          placeholder="أدخل كلمة المرور الجديدة"
                          className="w-full px-4 py-3 pl-11 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(prev => !prev)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-1 cursor-pointer"
                          title={showNewPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-neutral-800 text-right">
                        تأكيد كلمة المرور الجديدة
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (passwordStatus) setPasswordStatus(null);
                          }}
                          placeholder="أعد كتابة كلمة المرور للتأكيد"
                          className="w-full px-4 py-3 pl-11 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(prev => !prev)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition-colors p-1 cursor-pointer"
                          title={showConfirmPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Feedback Status Alert */}
                  {passwordStatus && (
                    <div
                      className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                        passwordStatus.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {passwordStatus.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                      <span>{passwordStatus.message}</span>
                    </div>
                  )}

                  {/* Action row */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-neutral-200/60">
                    <p className="text-[11px] text-neutral-500 font-medium text-right">
                      🔒 يمكنك استخدام كلمة المرور الجديدة لتسجيل الدخول إلى حسابك ولوحة التحكم في أي وقت.
                    </p>
                    <button
                      type="button"
                      onClick={handleUpdatePassword}
                      className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>تحديث كلمة المرور</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t border-neutral-100 text-center">
                <button
                  type="submit"
                  className="px-10 py-3.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 mx-auto"
                >
                  <Save className="w-5 h-5" />
                  <span>حفظ وتحديث بيانات الحساب</span>
                </button>
              </div>

            </div>
          </form>
        )}

        {/* 1.5. APPEARANCE SECTION (قسم المظهر الرئيسي) */}
        {activeTab === 'appearance' && !loggedSecretary && (
          <div className="animate-fadeIn max-w-5xl mx-auto py-2">
            {renderProfileQuickBar()}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-8 md:p-10 shadow-xs space-y-8">
              
              {/* Header Title */}
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                  المظهر الرئيسي
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                  تخصيص لون الهوية البصرية والمظهر العام للبروفايل
                </p>
              </div>

              {/* Theme Color Selector Box */}
              <div className="p-5 sm:p-6 bg-neutral-50/80 border border-neutral-200/90 rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm transition-colors duration-300"
                      style={{ backgroundColor: formData.themeColor || '#1E3A8A' }}
                    >
                      <Palette className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-extrabold text-neutral-900">الهوية البصرية</div>
                      <div className="text-[11px] text-neutral-500 font-medium">يشمل الشريط العلوي (الهيدر)، الفوتر، الأزرار، وشارات التمييز التفاعلية</div>
                    </div>
                  </div>

                  {/* Current color badge */}
                  <div className="flex items-center gap-2 px-3.5 py-1.5 bg-white border border-neutral-200 rounded-xl self-start sm:self-auto shadow-2xs">
                    <span 
                      className="w-4 h-4 rounded-full border border-neutral-200 shrink-0 transition-colors duration-300 shadow-2xs" 
                      style={{ backgroundColor: formData.themeColor || '#1E3A8A' }}
                    />
                    <span className="text-xs font-bold text-neutral-700 font-mono uppercase">
                      {formData.themeColor || '#1E3A8A'}
                    </span>
                  </div>
                </div>

                {/* 1. Solid Colors Section (الألوان السادة) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black text-neutral-900 text-right">
                      الألوان السادة
                    </label>
                    <span className="text-[11px] font-bold text-neutral-500">
                      الوان للهوية البصرية
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                    {SOLID_THEME_COLORS.map((item) => {
                      const isSelected = !formData.themeTemplate && (formData.themeColor || '#1E3A8A').toLowerCase() === item.color.toLowerCase();
                      return (
                        <button
                          key={item.color}
                          type="button"
                          onClick={() => {
                            const updated = { ...formData, themeColor: item.color, themeTemplate: '' };
                            setFormData(updated);
                            onUpdateDoctor(updated);
                            triggerSaveNotification('تم الحفظ');
                          }}
                          className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2 cursor-pointer text-right ${
                            isSelected 
                              ? 'border-neutral-900 bg-white shadow-md ring-2 ring-neutral-900/15 scale-[1.02]' 
                              : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/80 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span 
                              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 shadow-xs transition-transform" 
                              style={{ backgroundColor: item.color }}
                            >
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                              ) : (
                                <span className="text-[11px]">{item.icon}</span>
                              )}
                            </span>
                            <span className={`text-xs truncate ${isSelected ? 'font-black text-neutral-900' : 'font-bold text-neutral-700'}`}>
                              {item.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Ready Theme Templates Section (قوالب جاهزة) */}
                <div className="space-y-4 pt-4 border-t border-neutral-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <h4 className="text-sm font-black text-neutral-900">قوالب جاهزة</h4>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-full">جاهزة للاستخدام</span>
                      </div>
                      <p className="text-[11px] text-neutral-500 font-medium mt-0.5">
                        🎨 تصميم متكامل بالألوان والخلفية والرسومات الطبية الهادئة
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {READY_THEME_TEMPLATES.map((tpl) => {
                      const isSelected = formData.themeTemplate === tpl.id;
                      return (
                        <div
                          key={tpl.id}
                          onClick={() => {
                            const updated = { ...formData, themeColor: tpl.primaryColor, themeTemplate: tpl.id };
                            setFormData(updated);
                            onUpdateDoctor(updated);
                            triggerSaveNotification('تم الحفظ');
                          }}
                          className={`p-3 rounded-2xl border transition-all cursor-pointer text-right flex flex-col justify-between relative overflow-hidden ${
                            isSelected 
                              ? 'border-neutral-900 bg-white shadow-md ring-2 ring-neutral-900/20 scale-[1.02]' 
                              : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/70 shadow-xs'
                          }`}
                        >
                          {/* Active Check Indicator */}
                          {isSelected && (
                            <div className="absolute top-2 left-2 w-5 h-5 bg-neutral-900 text-white rounded-full flex items-center justify-center shadow-xs z-10">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}

                          {/* Template Icon & Name (Full Name Displayed) */}
                          <div className="flex items-center gap-2 pr-0.5">
                            <span className="text-xl shrink-0 p-1.5 bg-neutral-100 rounded-xl" title="رمز الزخارف والخلفية">
                              {tpl.icon}
                            </span>
                            <div className="font-black text-xs sm:text-sm text-neutral-900 leading-snug">
                              {tpl.name}
                            </div>
                          </div>

                          {/* Color Swatches Only */}
                          <div className="mt-3 pt-2 border-t border-neutral-100/80 flex items-center justify-center gap-2">
                            <span 
                              className="w-4.5 h-4.5 rounded-full border border-black/10 shadow-2xs inline-block" 
                              style={{ backgroundColor: tpl.primaryColor }}
                              title="اللون الأساسي"
                            />
                            <span 
                              className="w-4.5 h-4.5 rounded-full border border-black/10 shadow-2xs inline-block" 
                              style={{ backgroundColor: tpl.accentColor }}
                              title="لون الإبراز"
                            />
                            {tpl.secondaryColor && (
                              <span 
                                className="w-4.5 h-4.5 rounded-full border border-black/10 shadow-2xs inline-block" 
                                style={{ backgroundColor: tpl.secondaryColor }}
                                title="اللون الثانوي"
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Live Interactive Doctor Profile Preview Section (Header, Buttons & Footer) */}
                {(() => {
                  const activePreviewTemplate = getThemeTemplate(formData.themeTemplate);
                  const previewThemeColor = formData.themeColor || (activePreviewTemplate ? activePreviewTemplate.primaryColor : '#1E3A8A');
                  const previewTextColor = getThemeTextColor(previewThemeColor);
                  const previewDocName = formData.headerDisplayName || formData.name || doctor.name || 'د. محمد علي';
                  const previewAvatar = formData.headerAvatar || formData.avatar || doctor.avatar;

                  return (
                    <div className="pt-4 border-t border-neutral-200/90 space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs sm:text-sm font-extrabold text-neutral-900 flex items-center gap-2">
                          <Eye className="w-4 h-4 text-neutral-600" />
                          <span>معاينة حية ومباشرة للشريط العلوي والفوتر والأزرار:</span>
                        </div>
                      </div>

                      {/* Preview Container Window */}
                      <div className={`relative rounded-2xl border-2 border-neutral-300/80 ${activePreviewTemplate ? activePreviewTemplate.bgClass : 'bg-slate-100'} overflow-hidden shadow-inner p-3 sm:p-4`}>
                        
                        {/* Desktop / Laptop Single Screen Preview (Visible on md+ screens) */}
                        <div className="hidden md:block space-y-4 p-3 sm:p-5 bg-white/90 rounded-2xl border border-neutral-200/80 shadow-xs">
                          {/* 1. Header Preview */}
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-bold text-neutral-500 flex items-center justify-between px-1">
                              <span>1. شكل الشريط العلوي العائم (Header):</span>
                              <span className="text-[9px] bg-neutral-200/80 text-neutral-600 px-2 py-0.5 rounded-full font-medium">عائم وثابت</span>
                            </div>
                            <div 
                              style={{ backgroundColor: previewThemeColor, color: previewTextColor }}
                              className={`w-full rounded-2xl px-4 py-2.5 flex items-center justify-between shadow-md border transition-colors duration-300 ${
                                previewTextColor === '#0F172A' ? 'border-black/10' : 'border-white/10'
                              }`}
                            >
                              {/* Right: Avatar + Name */}
                              <div className="flex items-center gap-2.5">
                                <div 
                                  className="w-9 h-9 rounded-full overflow-hidden border-2 shadow-xs shrink-0 flex items-center justify-center"
                                  style={{ 
                                    borderColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                                    backgroundColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                                  }}
                                >
                                  {previewAvatar ? (
                                    <img src={previewAvatar} alt="Doctor" className="w-full h-full object-cover" />
                                  ) : (
                                    <User className="w-4.5 h-4.5" style={{ color: previewTextColor, opacity: 0.8 }} />
                                  )}
                                </div>
                                <div className="text-right">
                                  <div className="font-extrabold text-xs sm:text-sm leading-tight" style={{ color: previewTextColor }}>
                                    {previewDocName}
                                  </div>
                                  <div className="text-[10px] opacity-80" style={{ color: previewTextColor }}>
                                    {formData.specialty || 'استشاري العيادة'}
                                  </div>
                                </div>
                              </div>

                              {/* Center: Navigation Links */}
                              <div className="hidden md:flex items-center gap-1.5 font-bold text-xs">
                                <span 
                                  style={{ 
                                    backgroundColor: previewTextColor === '#0F172A' ? '#0F172A' : '#FFFFFF',
                                    color: previewTextColor === '#0F172A' ? '#FFFFFF' : previewThemeColor
                                  }}
                                  className="px-3 py-1 rounded-xl shadow-xs"
                                >
                                  الرئيسية
                                </span>
                                <span className="px-2.5 py-1 opacity-85 hover:opacity-100" style={{ color: previewTextColor }}>
                                  الخدمات
                                </span>
                                <span className="px-2.5 py-1 opacity-85 hover:opacity-100" style={{ color: previewTextColor }}>
                                  المعرض
                                </span>
                                <span className="px-2.5 py-1 opacity-85 hover:opacity-100" style={{ color: previewTextColor }}>
                                  الشهادات
                                </span>
                                <span className="px-2.5 py-1 opacity-85 hover:opacity-100" style={{ color: previewTextColor }}>
                                  الآراء
                                </span>
                              </div>

                              {/* Left: Lang & Quick book */}
                              <div className="flex items-center gap-2">
                                <span 
                                  style={{ 
                                    color: previewTextColor,
                                    borderColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                                    backgroundColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                                  }}
                                  className="w-8 h-8 rounded-xl border flex items-center justify-center shadow-xs text-xs"
                                >
                                  <Globe className="w-3.5 h-3.5" style={{ color: previewTextColor }} />
                                </span>
                                <span 
                                  style={{ 
                                    backgroundColor: previewTextColor === '#0F172A' ? '#0F172A' : '#FFFFFF',
                                    color: previewTextColor === '#0F172A' ? '#FFFFFF' : previewThemeColor
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl font-extrabold text-xs shadow-xs flex items-center gap-1.5"
                                >
                                  <Calendar className="w-3.5 h-3.5" style={{ color: previewTextColor === '#0F172A' ? '#FFFFFF' : previewThemeColor }} />
                                  <span>حجز سريع</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* 2. Interactive Buttons & Controls Showcase */}
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-bold text-neutral-500 px-1">
                              2. شكل أزرار الحجز والفروع والمواعيد:
                            </div>
                            <div className="bg-slate-50 border border-neutral-200/90 rounded-2xl p-3.5 sm:p-4 shadow-2xs space-y-3">
                              
                              {/* Branch Tabs Sample */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-200/70">
                                <span className="text-xs font-bold text-neutral-700">أزرار اختيار الفروع:</span>
                                <div className="flex items-center gap-2">
                                  <span 
                                    style={{ backgroundColor: previewThemeColor, color: previewTextColor }}
                                    className="px-4 py-1.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-1.5"
                                  >
                                    <Building2 className="w-3.5 h-3.5" style={{ color: previewTextColor }} />
                                    <span>الفرع الرئيسي (محدد)</span>
                                  </span>
                                  <span className="px-4 py-1.5 rounded-xl text-xs font-bold bg-white text-neutral-600 border border-neutral-200/80">
                                    فرع المهندسين
                                  </span>
                                </div>
                              </div>

                              {/* Booking Time Slots Sample */}
                              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-200/70">
                                <span className="text-xs font-bold text-neutral-700">أزرار اختيار الأيام والمواعيد:</span>
                                <div className="flex items-center gap-2">
                                  <div 
                                    style={{ backgroundColor: previewThemeColor, borderColor: previewThemeColor, color: previewTextColor }}
                                    className="p-2 rounded-xl border text-center shadow-xs flex flex-col items-center min-w-[110px]"
                                  >
                                    <span className="font-extrabold text-[11px] leading-tight" style={{ color: previewTextColor }}>
                                      الأحد (محدد)
                                    </span>
                                    <span className="text-[9px] font-medium opacity-90" style={{ color: previewTextColor }}>
                                      05:00 م - 09:00 م
                                    </span>
                                  </div>
                                  <div className="p-2 rounded-xl border border-neutral-200 bg-white text-neutral-700 text-center flex flex-col items-center min-w-[110px]">
                                    <span className="font-extrabold text-[11px] leading-tight">
                                      الثلاثاء
                                    </span>
                                    <span className="text-[9px] font-medium text-neutral-500">
                                      06:00 م - 10:00 م
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons Row */}
                              <div className="flex flex-wrap items-center gap-3 pt-1">
                                <button 
                                  type="button"
                                  style={{ backgroundColor: previewThemeColor, color: previewTextColor }}
                                  className="flex-1 py-2.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm shadow-md flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-default"
                                >
                                  <Calendar className="w-4 h-4" style={{ color: previewTextColor }} />
                                  <span>تأكيد الحجز فوراً</span>
                                </button>
                                <button 
                                  type="button"
                                  className="py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm border border-neutral-300 bg-white text-neutral-800 flex items-center justify-center gap-2 hover:bg-neutral-100 transition-colors cursor-default"
                                >
                                  <Phone className="w-4 h-4 text-neutral-600" />
                                  <span>الاتصال بالعيادة</span>
                                </button>
                              </div>

                            </div>
                          </div>

                          {/* 3. Footer Preview */}
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-bold text-neutral-500 px-1">
                              3. شكل الفوتر السفلي (Footer):
                            </div>
                            <div 
                              style={{ backgroundColor: previewThemeColor, color: previewTextColor }}
                              className={`w-full rounded-2xl p-4 text-center space-y-3 shadow-md border transition-colors duration-300 ${
                                previewTextColor === '#0F172A' ? 'border-black/10' : 'border-white/10'
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                <div className="text-right">
                                  <div className="font-black text-xs sm:text-sm" style={{ color: previewTextColor }}>
                                    {formData.whiteLabel ? `${previewDocName}` : `منصة عيادتي - ${previewDocName}`}
                                  </div>
                                  <div className="text-[10px] opacity-75 mt-0.5" style={{ color: previewTextColor }}>
                                    جميع الحقوق محفوظة © {new Date().getFullYear()}
                                  </div>
                                </div>

                                {/* Social Icons */}
                                <div className="flex items-center gap-2">
                                  {[
                                    { Icon: Facebook, name: 'فيسبوك' },
                                    { Icon: Twitter, name: 'تويتر' },
                                    { Icon: Instagram, name: 'إنستغرام' },
                                    { Icon: Globe, name: 'الموقع' },
                                  ].map((item, idx) => (
                                    <span
                                      key={idx}
                                      style={{ 
                                        color: previewTextColor,
                                        borderColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                                        backgroundColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                                      }}
                                      className="w-7 h-7 rounded-full border flex items-center justify-center shadow-xs"
                                    >
                                      <item.Icon className="w-3.5 h-3.5" />
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Mobile Phone Single Screen Preview (Visible on smaller mobile screens) */}
                        <div className="block md:hidden max-w-[340px] mx-auto rounded-[32px] border-4 border-neutral-800 bg-white p-3 space-y-3 shadow-2xl">
                          
                          {/* Phone Speaker & Camera Notch */}
                          <div className="w-24 h-4 bg-neutral-800 rounded-b-xl mx-auto -mt-3 mb-1 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-neutral-700 ml-2" />
                            <div className="w-8 h-1 rounded-full bg-neutral-700" />
                          </div>

                          {/* 1. Mobile Header */}
                          <div 
                            style={{ backgroundColor: previewThemeColor, color: previewTextColor }}
                            className={`w-full rounded-xl p-2.5 flex items-center justify-between shadow-sm border ${
                              previewTextColor === '#0F172A' ? 'border-black/10' : 'border-white/10'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div 
                                className="w-7 h-7 rounded-full overflow-hidden border shadow-xs shrink-0 flex items-center justify-center"
                                style={{ 
                                  borderColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                                  backgroundColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                                }}
                              >
                                {previewAvatar ? (
                                  <img src={previewAvatar} alt="Doctor" className="w-full h-full object-cover" />
                                ) : (
                                  <User className="w-3.5 h-3.5" style={{ color: previewTextColor, opacity: 0.8 }} />
                                )}
                              </div>
                              <div className="text-right truncate">
                                <div className="font-black text-[11px] truncate" style={{ color: previewTextColor }}>
                                  {previewDocName}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span 
                                style={{ 
                                  color: previewTextColor,
                                  borderColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                                  backgroundColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                                }}
                                className="w-6 h-6 rounded-lg border flex items-center justify-center text-[10px]"
                              >
                                <Globe className="w-3 h-3" style={{ color: previewTextColor }} />
                              </span>
                              <span 
                                style={{ color: previewTextColor }}
                                className="p-1"
                              >
                                <Menu className="w-4 h-4" style={{ color: previewTextColor }} />
                              </span>
                            </div>
                          </div>

                          {/* 2. Mobile Buttons & Controls */}
                          <div className="bg-slate-50 border border-neutral-200/80 rounded-xl p-2.5 space-y-2">
                            {/* Branch Pills */}
                            <div className="flex items-center gap-1.5">
                              <span 
                                style={{ backgroundColor: previewThemeColor, color: previewTextColor }}
                                className="flex-1 py-1 px-2 rounded-lg text-[10px] font-black text-center shadow-xs"
                              >
                                الفرع الرئيسي
                              </span>
                              <span className="flex-1 py-1 px-2 rounded-lg text-[10px] font-bold bg-white text-neutral-600 border border-neutral-200 text-center">
                                فرع ثان
                              </span>
                            </div>

                            {/* Schedule Pill */}
                            <div 
                              style={{ backgroundColor: previewThemeColor, color: previewTextColor }}
                              className="p-1.5 rounded-lg text-center shadow-xs"
                            >
                              <div className="font-black text-[10px]" style={{ color: previewTextColor }}>
                                الأحد (محدد)
                              </div>
                              <div className="text-[8px] opacity-90" style={{ color: previewTextColor }}>
                                05:00 م - 09:00 م
                              </div>
                            </div>

                            {/* Booking CTA Button */}
                            <button 
                              type="button"
                              style={{ backgroundColor: previewThemeColor, color: previewTextColor }}
                              className="w-full py-2 px-3 rounded-lg font-extrabold text-[11px] shadow-sm flex items-center justify-center gap-1.5 cursor-default"
                            >
                              <Calendar className="w-3.5 h-3.5" style={{ color: previewTextColor }} />
                              <span>تأكيد الحجز فوراً</span>
                            </button>
                          </div>

                          {/* 3. Mobile Footer */}
                          <div 
                            style={{ backgroundColor: previewThemeColor, color: previewTextColor }}
                            className={`w-full rounded-xl p-2.5 text-center space-y-1.5 shadow-sm border ${
                              previewTextColor === '#0F172A' ? 'border-black/10' : 'border-white/10'
                            }`}
                          >
                            <div className="text-[10px] font-bold" style={{ color: previewTextColor }}>
                              {previewDocName}
                            </div>
                            <div className="flex items-center justify-center gap-1.5">
                              {[Facebook, Twitter, Instagram, Globe].map((IconComp, idx) => (
                                <span
                                  key={idx}
                                  style={{ 
                                    color: previewTextColor,
                                    borderColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                                    backgroundColor: previewTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                                  }}
                                  className="w-5 h-5 rounded-full border flex items-center justify-center"
                                >
                                  <IconComp className="w-2.5 h-2.5" />
                                </span>
                              ))}
                            </div>
                            <div className="text-[8px] opacity-75" style={{ color: previewTextColor }}>
                              جميع الحقوق محفوظة © {new Date().getFullYear()}
                            </div>
                          </div>

                          {/* Phone Home Indicator bar */}
                          <div className="w-24 h-1 bg-neutral-400 rounded-full mx-auto mt-1" />
                        </div>

                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Save Button */}
              <div className="pt-4 border-t border-neutral-100 flex flex-col items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={(e) => handleSubmit(e as unknown as React.FormEvent)}
                  className="px-12 py-3.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 mx-auto"
                >
                  <Save className="w-5 h-5" />
                  <span>حفظ</span>
                </button>

                {savedSuccess && (
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs sm:text-sm font-black rounded-xl animate-fadeIn shadow-2xs">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                    <span>تم الحفظ</span>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 1.6. PERKS / EXTRA FEATURES SECTION (قسم مزايا إضافية) */}
        {activeTab === 'perks' && !loggedSecretary && (
          <div className="animate-fadeIn max-w-5xl mx-auto py-2">
            {renderProfileQuickBar()}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-8 md:p-10 shadow-xs space-y-8">
              
              {/* Header Title */}
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                  مزايا إضافية
                </h2>
              </div>

              {/* Feature Card 1: Account Verification (معاينة توثيق الحساب) */}
              <div className="p-6 sm:p-7 bg-neutral-50/80 border border-neutral-200/90 rounded-2xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Right side: Info & Toggle Switch */}
                  <div className="space-y-4 flex-1 text-right">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 text-[#1877F2] rounded-2xl border border-blue-200 shrink-0">
                        <ShieldCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-base sm:text-lg font-black text-neutral-900">معاينة توثيق الحساب</h3>
                          <span className="px-3 py-0.5 bg-blue-100 text-blue-800 text-xs font-black rounded-full border border-blue-200">
                            250 ج.م
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setDemoVerified(!demoVerified)}
                        className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${
                          Boolean(demoVerified) ? 'bg-blue-600' : 'bg-neutral-300'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                          Boolean(demoVerified) ? 'translate-x-0' : '-translate-x-6'
                        }`} />
                      </button>
                      <div className="space-y-0.5 text-right">
                        <span className="text-xs sm:text-sm font-black text-neutral-900 block">معاينة توثيق الحساب (الشارة الزرقاء)</span>
                        <span className="text-[11px] text-neutral-500 font-medium">تشغيل أو إيقاف عرض علامة التوثيق في المعاينة</span>
                      </div>
                    </div>

                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-semibold space-y-1 text-right">
                      <div className="font-black">💡 تنبيه إداري:</div>
                      <p>التفعيل الفعلي لعلامة التوثيق يتطلب تقديم طلب التوثيق وموافقة الإدارة، وهذه المعاينة نموذج توضيحي فقط. يتطلب التوثيق تقديم إثبات رسمي.</p>
                    </div>
                  </div>

                  {/* Left side: Live Mini Preview matching user screenshot */}
                  <div className="w-full md:w-80 bg-white border border-neutral-200 rounded-3xl p-4 shadow-sm space-y-3 text-right">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between px-1">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-[#1877F2] text-[10px] font-black rounded-full">بروفايل الطبيب</span>
                      <span>معاينة حية مصغرة</span>
                    </div>

                    {/* Card container matching screenshot layout */}
                    <div className="bg-white border border-neutral-200/90 rounded-2xl overflow-hidden shadow-xs">
                      {/* Avatar Image filling top */}
                      <div className="w-full h-48 bg-neutral-100 overflow-hidden">
                        <img 
                          src={formData.avatar || "https://images.unsplash.com/photo-1594824813566-f56f4d2ad22c?w=400"} 
                          alt={formData.name} 
                          className="w-full h-full object-cover object-center" 
                        />
                      </div>

                      {/* Content block below image */}
                      <div className="p-4 text-center space-y-1">
                        <div className="flex items-center justify-center gap-1.5">
                          <h4 className="font-black text-base text-neutral-900 truncate">
                            {formData.name || "هاجر اسلام السيد"}
                          </h4>
                          {Boolean(demoVerified) && (
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1877F2] fill-current shrink-0">
                              <title>موثق</title>
                              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.407-.17-.867-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.015 3.422-2.28c.407.17 .867.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.62 3.71l-3.27-3.27 1.1-1.1 2.17 2.17 5.85-5.85 1.11 1.11-6.96 6.94z" />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 font-medium">
                          {formData.jobTitle || formData.specialty || "طبيبة اسنان"}
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-3 border-t border-neutral-200 flex justify-end text-[11px] text-neutral-500 font-medium text-right">
                  <a
                    href="https://wa.me/201111777251?text=%D8%B7%D9%84%D8%A8%20%D8%AA%D9%88%D8%AB%D9%8A%D9%82%20%D8%A7%D9%84%D8%AD%D8%B3%D8%A7%D8%A8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shrink-0"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>طلب التوثيق عبر الواتساب (250 ج.م)</span>
                  </a>
                </div>
              </div>

              {/* Feature Card 2: White Label / Platform Rights (معاينة إخفاء حقوق المنصة) */}
              <div className="p-6 sm:p-7 bg-neutral-50/80 border border-neutral-200/90 rounded-2xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  {/* Right side: Info & Toggle Switch */}
                  <div className="space-y-4 flex-1 text-right">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl border border-purple-200 shrink-0">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h3 className="text-base sm:text-lg font-black text-neutral-900">معاينة إخفاء حقوق المنصة</h3>
                          <span className="px-3 py-0.5 bg-purple-100 text-purple-800 text-xs font-black rounded-full border border-purple-200">
                            350 ج.م سنوياً
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setDemoHideRights(!demoHideRights)}
                        className={`w-14 h-8 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${
                          Boolean(demoHideRights) ? 'bg-purple-600' : 'bg-neutral-300'
                        }`}
                      >
                        <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${
                          Boolean(demoHideRights) ? 'translate-x-0' : '-translate-x-6'
                        }`} />
                      </button>
                      <div className="space-y-0.5 text-right">
                        <span className="text-xs sm:text-sm font-black text-neutral-900 block">اخفاء حقوق المنصة</span>
                        <span className="text-[11px] text-neutral-500 font-medium">تشغيل أو إيقاف ظهور عبارة وشعار منصة دكتور بروفايل في المعاينة</span>
                      </div>
                    </div>
                  </div>

                  {/* Left side: Live Mini Preview matching user screenshot */}
                  <div className="w-full md:w-80 bg-white border border-neutral-200 rounded-3xl p-4 shadow-sm space-y-3 text-right">
                    <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center justify-between px-1">
                      <span className="px-2.5 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-black rounded-full">أسفل الصفحة</span>
                      <span>معاينة فوتر البروفايل</span>
                    </div>

                    <div className="bg-[#0B2545] rounded-2xl p-5 text-center space-y-3 shadow-inner overflow-hidden">
                      {!Boolean(demoHideRights) && (
                        <div className="flex justify-center">
                          <img 
                            src="https://k.top4top.io/p_38573eitn0.png" 
                            alt="Dr Profile Logo" 
                            className="w-28 h-auto object-contain brightness-0 invert" 
                          />
                        </div>
                      )}
                      <div className="text-[10px] text-white/90 font-medium">
                        جميع الحقوق محفوظة © 2026 {Boolean(demoHideRights) ? (formData.name ? `• ${formData.name}` : '') : ''}
                      </div>
                      <div className="flex items-center justify-center gap-2 pt-1">
                        <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white">f</div>
                        <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white">𝕏</div>
                        <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white">in</div>
                        <div className="w-6 h-6 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] text-white">▶</div>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="pt-3 border-t border-neutral-200 flex justify-end text-[11px] text-neutral-500 font-medium text-right">
                  <a
                    href="https://wa.me/201111777251?text=%D8%B7%D9%84%D8%A8%20%D8%A5%D8%AE%D9%81%D8%A7%D8%A1%20%D8%AD%D9%82%D9%88%D9%82%20%D8%A7%D9%84%D9%85%D9%86%D8%B5%D8%A9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shrink-0"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>طلب إخفاء الحقوق عبر الواتساب (350 ج.م سنوياً)</span>
                  </a>
                </div>
              </div>

              {/* Feature Card 3: Direct WhatsApp Support / Contact Banner */}
              <div className="p-5 sm:p-6 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-right shadow-2xs">
                <div className="flex items-center gap-3.5">
                  <div className="p-3.5 bg-emerald-600 text-white rounded-2xl shadow-xs shrink-0">
                    <WhatsAppIcon className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-black text-neutral-900 text-base">طلب أو استفسار المزايا الإضافية</h4>
                    <p className="text-xs text-neutral-600 font-medium">تواصل معنا مباشرة عبر واتساب لطلب التوثيق أو إخفاء حقوق المنصة</p>
                  </div>
                </div>
                <a
                  href="https://wa.me/201111777251"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black rounded-xl transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span>تواصل واتساب</span>
                </a>
              </div>

            </div>
          </div>
        )}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn">
            {renderProfileQuickBar()}
            {/* SINGLE CONSOLIDATED CARD FOR BOOKINGS */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-5">
              
              {/* Top Banner Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200 w-full">
                <div className="w-full min-w-0">
                  <h2 className="text-base sm:text-lg font-extrabold text-black flex items-center gap-2 mb-0.5 w-full">
                    <Calendar className="w-5 h-5 text-black shrink-0" />
                    <span>طلبات الحجز والمواعيد</span>
                  </h2>
                  <p className="text-neutral-500 text-[11px] sm:text-xs leading-normal break-words w-full">
                    متابعة وتأكيد طلبات الحجز والتواصل عبر الواتساب.
                  </p>
                </div>

                <div className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-none text-emerald-800 text-xs font-bold shrink-0">
                  <Clock className="w-4 h-4 text-black shrink-0" />
                  <span>{pendingBookingsCount} طلب جديد بانتظار التأكيد</span>
                </div>
              </div>

              {/* STATS CARDS ROW (كروت إحصائيات المواعيد) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                
                {/* 1. إجمالي الطلبات */}
                <div className="p-4 bg-white border border-blue-100 rounded-2xl shadow-2xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-900">إجمالي الطلبات</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-blue-950 block">
                      {doctorAppointments.length}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600">جميع الحجوزات</span>
                  </div>
                </div>

                {/* 2. قيد الانتظار */}
                <div className="p-4 bg-white border border-amber-100 rounded-2xl shadow-2xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900">قيد الانتظار</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-amber-950 block">
                      {pendingBookingsCount}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600">بانتظار التأكيد</span>
                  </div>
                </div>

                {/* 3. المؤكدة */}
                <div className="p-4 bg-white border border-sky-100 rounded-2xl shadow-2xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-sky-900">المؤكدة</span>
                    <div className="w-8 h-8 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-sky-950 block">
                      {approvedBookingsCount}
                    </span>
                    <span className="text-[10px] font-bold text-sky-600">تم تأكيدها</span>
                  </div>
                </div>

                {/* 4. المكتملة */}
                <div className="p-4 bg-white border border-emerald-100 rounded-2xl shadow-2xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900">المكتملة</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-emerald-950 block">
                      {completedBookingsCount}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">تمت بالعيادة</span>
                  </div>
                </div>

                {/* 5. الملغاة */}
                <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-2xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-neutral-800">الملغاة</span>
                    <div className="w-8 h-8 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center shrink-0">
                      <XCircle className="w-4 h-4 text-neutral-600" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-neutral-900 block">
                      {cancelledBookingsCount}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-500">ملغاة من المريض</span>
                  </div>
                </div>

                {/* 6. المرفوضة */}
                <div className="p-4 bg-white border border-red-100 rounded-2xl shadow-2xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-900">المرفوضة</span>
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-red-950 block">
                      {rejectedBookingsCount}
                    </span>
                    <span className="text-[10px] font-bold text-red-600">مرفوضة من العيادة</span>
                  </div>
                </div>

              </div>

              {/* Filter & Control Bar - Grid Select Dropdowns (Matching Admin Panel) */}
              <div className="bg-white p-5 md:p-6 rounded-3xl border border-neutral-200/70 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-[#009bb9]/10 text-[#009bb9] flex items-center justify-center">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-neutral-900">تصفية وفرز طلبات الحجز</h4>
                      <p className="text-[11px] text-neutral-400 font-semibold">تصفية دقيقة حسب حالة الحجز والفرع والبحث وتاريخ الحجز</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Download File Button جنب الفلتر */}
                    <button
                      type="button"
                      onClick={handleDownloadBookingsReport}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      title="تحميل ملف المواعيد كتقرير CSV"
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل ملف المواعيد</span>
                    </button>

                    {/* Reset Filters button if any filter active */}
                    {(bookingStatusFilter !== 'all' || bookingDateFilter !== 'all' || bookingSearchTerm !== '' || bookingBranchFilter !== 'all') && (
                      <button
                        type="button"
                        onClick={() => {
                          setBookingStatusFilter('all');
                          setBookingDateFilter('all');
                          setBookingSearchTerm('');
                          setBookingBranchFilter('all');
                          setCustomStartDate('');
                          setCustomEndDate('');
                        }}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>إعادة ضبط</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Grid of 4 Filters (حالة الحساب/الحجز، الفرع/العيادة، البحث، تاريخ الحجز) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
                  
                  {/* 1. حالة الحجز */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[11px] font-extrabold text-neutral-700 flex items-center gap-1.5 justify-start">
                      <Activity className="w-3.5 h-3.5 text-emerald-600" />
                      <span>حالة الحجز:</span>
                    </label>
                    <div className="relative">
                      <select
                        value={bookingStatusFilter}
                        onChange={(e) => setBookingStatusFilter(e.target.value as any)}
                        className={`w-full px-3.5 py-2.5 bg-neutral-50 hover:bg-white border rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-all text-right cursor-pointer ${
                          bookingStatusFilter !== 'all' ? 'border-emerald-600 bg-emerald-50/40 font-black text-emerald-800' : 'border-neutral-200'
                        }`}
                      >
                        <option value="all">جميع الحالات ({doctorAppointments.length})</option>
                        <option value="pending">قيد الانتظار ({pendingBookingsCount})</option>
                        <option value="approved">مؤكد ({approvedBookingsCount})</option>
                        <option value="completed">مكتمل ({completedBookingsCount})</option>
                        <option value="cancelled">ملغي ({cancelledBookingsCount})</option>
                        <option value="rejected">مرفوض ({rejectedBookingsCount})</option>
                      </select>
                    </div>
                  </div>

                  {/* 2. الفرع / العيادة */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[11px] font-extrabold text-neutral-700 flex items-center gap-1.5 justify-start">
                      <Stethoscope className="w-3.5 h-3.5 text-[#009bb9]" />
                      <span>الفرع / العيادة:</span>
                    </label>
                    <div className="relative">
                      <select
                        value={bookingBranchFilter}
                        onChange={(e) => setBookingBranchFilter(e.target.value)}
                        className={`w-full px-3.5 py-2.5 bg-neutral-50 hover:bg-white border rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right cursor-pointer ${
                          bookingBranchFilter !== 'all' ? 'border-[#009bb9] bg-[#009bb9]/5 font-black text-[#009bb9]' : 'border-neutral-200'
                        }`}
                      >
                        <option value="all">جميع الفروع والعيادات</option>
                        {formData.branches.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 3. البحث باسم المريض أو الهاتف */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[11px] font-extrabold text-neutral-700 flex items-center gap-1.5 justify-start">
                      <MapPin className="w-3.5 h-3.5 text-amber-600" />
                      <span>البحث / الملاحظات:</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={bookingSearchTerm}
                        onChange={(e) => setBookingSearchTerm(e.target.value)}
                        placeholder="ابحث باسم المريض أو الهاتف..."
                        className={`w-full px-3.5 py-2.5 bg-neutral-50 hover:bg-white border rounded-xl text-xs font-bold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right ${
                          bookingSearchTerm.trim() !== '' ? 'border-amber-500 bg-amber-50/40 font-black text-amber-900' : 'border-neutral-200'
                        }`}
                      />
                      {bookingSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setBookingSearchTerm('')}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1 text-neutral-400 hover:text-neutral-700 rounded-full cursor-pointer"
                          title="مسح"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 4. تاريخ التسجيل / الحجز */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-[11px] font-extrabold text-neutral-700 flex items-center gap-1.5 justify-start">
                      <CalendarDays className="w-3.5 h-3.5 text-purple-600" />
                      <span>تاريخ الحجز:</span>
                    </label>
                    <div className="relative">
                      <select
                        value={bookingDateFilter}
                        onChange={(e) => setBookingDateFilter(e.target.value as any)}
                        className={`w-full px-3.5 py-2.5 bg-neutral-50 hover:bg-white border rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#009bb9] focus:bg-white transition-all text-right cursor-pointer ${
                          bookingDateFilter !== 'all' ? 'border-purple-500 bg-purple-50/40 font-black text-purple-800' : 'border-neutral-200'
                        }`}
                      >
                        <option value="all">الكل (جميع تواريخ الحجز)</option>
                        <option value="today">اليوم 📅</option>
                        <option value="this_week">هذا الأسبوع</option>
                        <option value="this_month">هذا الشهر</option>
                        <option value="custom">تحديد نطاق زمني مخصص...</option>
                      </select>
                    </div>
                  </div>

                </div>

                {/* Custom Date Range Pickers if 'custom' selected */}
                {bookingDateFilter === 'custom' && (
                  <div className="flex flex-wrap items-center gap-3 p-3 bg-purple-50/60 border border-purple-200 rounded-2xl mt-2">
                    <span className="text-[11px] font-black text-purple-900">تحديد الفترة:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-600 shrink-0">من:</span>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#0051A8]"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-600 shrink-0">إلى:</span>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold text-neutral-900 focus:outline-none focus:border-[#0051A8]"
                      />
                    </div>

                    {(customStartDate || customEndDate) && (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomStartDate('');
                          setCustomEndDate('');
                        }}
                        className="px-3 py-1.5 bg-white hover:bg-neutral-100 text-neutral-700 border border-neutral-200 font-extrabold text-[11px] rounded-xl transition-colors cursor-pointer shrink-0"
                      >
                        مسح التحديد
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Bookings List Cards */}
              {filteredBookings.length === 0 ? (
                <div className="p-8 bg-neutral-50 border border-neutral-200 rounded-2xl text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center mx-auto">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-black">لا توجد طلبات حجز حالياً في هذا القسم</h3>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1 leading-relaxed">
                    {bookingSearchTerm 
                      ? 'لم نجد أي نتائج تطابق عملية البحث الخاصة بك.' 
                      : 'عندما يقوم المرضى بتقديم طلبات حجز عبر رابط بروفايلك الطبي، ستظهر كافة بياناتهم هنا مباشرة لتأكيدها.'}
                  </p>
                </div>
                {bookingSearchTerm && (
                  <button
                    type="button"
                    onClick={() => setBookingSearchTerm('')}
                    className="px-4 py-2 bg-neutral-100 border border-neutral-200 text-neutral-800 text-xs font-bold rounded-xl"
                  >
                    إلغاء البحث
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((apt) => {
                  const branchObj = formData.branches?.find(b => b.id === apt.branchId);
                  const serviceObj = formData.services?.find(s => s.id === apt.serviceId);

                  return (
                    <div 
                      key={apt.id} 
                      className={`p-6 bg-white border rounded-none space-y-5 transition-all shadow-sm hover:shadow-md hover:border-neutral-300 ${
                        apt.status === 'pending'
                          ? 'border-amber-400 bg-white'
                          : apt.status === 'approved'
                          ? 'border-emerald-400 bg-white'
                          : 'border-neutral-300 bg-white opacity-80'
                      }`}
                    >
                      {/* Top Row: Patient Name & Status Badge */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-none bg-[#10244A] text-white flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
                            {apt.patientName ? apt.patientName.charAt(0) : 'م'}
                          </div>
                          <div>
                            <h4 className="text-base font-bold text-black flex items-center gap-2">
                              <span>{apt.patientName}</span>
                            </h4>
                            <div className="flex items-center gap-3 pt-1 text-xs text-neutral-600 flex-wrap">
                              <a 
                                href={`tel:${apt.patientPhone}`} 
                                className="flex items-center gap-1 hover:text-[#009bb9] font-semibold"
                                dir="ltr"
                              >
                                <Phone className="w-3.5 h-3.5 text-[#009bb9]" />
                                <span>{apt.patientPhone}</span>
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0 self-start sm:self-auto">
                          {apt.status === 'pending' && (
                            <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-black flex items-center gap-1.5 animate-pulse">
                              <Clock className="w-3.5 h-3.5 text-amber-700" />
                              <span>قيد الانتظار</span>
                            </span>
                          )}
                          {apt.status === 'approved' && (
                            <span className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-300 text-[#0051A8] text-xs font-black flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#0051A8]" />
                              <span>مؤكد</span>
                            </span>
                          )}
                          {apt.status === 'completed' && (
                            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                              <span>مكتمل</span>
                            </span>
                          )}
                          {apt.status === 'cancelled' && (
                            <span className="px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-800 text-xs font-black flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 text-neutral-600" />
                              <span>ملغي</span>
                            </span>
                          )}
                          {apt.status === 'rejected' && (
                            <span className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs font-black flex items-center gap-1.5">
                              <XCircle className="w-3.5 h-3.5 text-red-700" />
                              <span>مرفوض</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs bg-white p-4 rounded-none border border-neutral-200">
                        <div>
                          <span className="text-neutral-500 block mb-0.5 font-medium">📅 الموعد المطلوب:</span>
                          <span className="font-extrabold text-black text-sm flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-[#0051A8] shrink-0" />
                            <span>{apt.date} • {apt.time}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-neutral-500 block mb-0.5 font-medium">🏥 الفرع / العيادة:</span>
                          <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                            <Building2 className="w-4 h-4 text-neutral-600 shrink-0" />
                            <span>{branchObj ? branchObj.name : 'الفرع الرئيسي'}</span>
                          </span>
                        </div>

                        <div>
                          <span className="text-neutral-500 block mb-0.5 font-medium">🕒 تم استلام الطلب:</span>
                          <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-neutral-600 shrink-0" />
                            <span>
                              {apt.createdAt
                                ? (isNaN(new Date(apt.createdAt).getTime())
                                    ? apt.createdAt
                                    : new Date(apt.createdAt).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' }))
                                : 'تاريخ غير مدون'}
                            </span>
                          </span>
                        </div>

                        {apt.notes && (
                          <div className="sm:col-span-2 lg:col-span-3 pt-2 border-t border-neutral-200">
                            <span className="text-neutral-500 block mb-0.5 font-medium">📝 ملاحظات المريض:</span>
                            <p className="text-neutral-700 bg-neutral-50 p-2.5 rounded-none border border-neutral-200 italic">
                              "{apt.notes}"
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        
                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          {/* Approve Button */}
                          {apt.status !== 'approved' && (!loggedSecretary || loggedSecretary.permissions?.confirmAppointments !== false) && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'approved')}
                              className="px-3.5 py-1.5 bg-[#0051A8] hover:bg-[#003B7A] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>تأكيد الحجز</span>
                            </button>
                          )}

                          {/* Complete Button */}
                          {apt.status !== 'completed' && (!loggedSecretary || loggedSecretary.permissions?.confirmAppointments !== false) && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'completed')}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>اكتمل الكشف</span>
                            </button>
                          )}

                          {/* Cancel Button */}
                          {apt.status !== 'cancelled' && (!loggedSecretary || loggedSecretary.permissions?.rejectAppointments !== false) && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'cancelled')}
                              className="px-3.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-800 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>إلغاء الحجز</span>
                            </button>
                          )}

                          {/* Reject Button */}
                          {apt.status !== 'rejected' && (!loggedSecretary || loggedSecretary.permissions?.rejectAppointments !== false) && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'rejected')}
                              className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>رفض الطلب</span>
                            </button>
                          )}

                          {/* Re-open Pending Button */}
                          {apt.status !== 'pending' && (!loggedSecretary || loggedSecretary.permissions?.confirmAppointments !== false) && (
                            <button
                              type="button"
                              onClick={() => handleUpdateAppointmentStatus(apt.id, 'pending')}
                              className="px-3.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-xs rounded-xl transition-all cursor-pointer border border-amber-200"
                            >
                              إعادة لقيد الانتظار
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                          {/* Send WhatsApp confirmation */}
                          {(!loggedSecretary || loggedSecretary.permissions?.sendWhatsapp !== false) && (
                            <button
                              type="button"
                              onClick={() => handleSendWhatsAppConfirmation(apt)}
                              className="px-4 py-2 bg-[#0B2545]/5 hover:bg-[#0B2545]/10 border border-[#0B2545]/20 text-[#0B2545] font-bold text-xs rounded-none transition-all flex items-center gap-1.5 cursor-pointer"
                            >
                              <WhatsAppIcon className="w-4 h-4 text-[#0051A8]" />
                              <span>تأكيد الحجز عبر واتساب</span>
                            </button>
                          )}

                          {/* Delete Request */}
                          {(!loggedSecretary || loggedSecretary.permissions?.rejectAppointments !== false) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAppointment(apt.id)}
                              className="p-2 bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-800 rounded-none transition-all cursor-pointer"
                              title="حذف الطلب"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            </div>

          </div>
        )}

        {/* 2.4 CONSULTATIONS MANAGEMENT SECTION (قسم إدارة الكشوفات) */}
        {activeTab === 'consultations' && (!loggedSecretary || loggedSecretary.permissions?.manageConsultations !== false) && (
          <div className="animate-fadeIn max-w-6xl mx-auto py-2 space-y-6">
            {renderProfileQuickBar()}

            <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 sm:p-8 shadow-xs space-y-8 text-right">
              
              {/* Header Title & Action Button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900 flex items-center gap-2">
                    <Stethoscope className="w-7 h-7 text-[#009bb9]" />
                    <span>إدارة الكشوفات</span>
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
                    سجل الكشوفات وإحصائيات العيادة
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleOpenConsultationModal('consultation')}
                    className="px-5 py-2.5 bg-[#009bb9] hover:bg-[#00829d] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>تسجيل حالة جديدة</span>
                  </button>
                  <div className="hidden sm:block px-3.5 py-2 bg-neutral-100 text-neutral-800 font-bold text-xs rounded-xl border border-neutral-200">
                    المرضى: <span className="font-black text-[#009bb9]">{patientRecords.length}</span>
                  </div>
                </div>
              </div>

              {/* STATS CARDS ROW (كشف - متابعة - طوارئ - استشارة - الرسوم) */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                
                {/* 1. كشف */}
                <div className="p-4 bg-white border border-blue-100 rounded-2xl shadow-2xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-900">كشف</span>
                    <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                      <Stethoscope className="w-4 h-4 text-blue-600" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-blue-950 block">
                      {patientRecords.reduce((acc, p) => acc + (p.consultations?.filter(c => c.type === 'consultation' || !c.type).length || 0), 0)}
                    </span>
                    <span className="text-[10px] font-bold text-blue-600">حالات كشف</span>
                  </div>
                </div>

                {/* 2. متابعة */}
                <div className="p-4 bg-white border border-emerald-100 rounded-2xl shadow-2xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-900">متابعة</span>
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                      <Activity className="w-4 h-4 text-emerald-600" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-emerald-950 block">
                      {patientRecords.reduce((acc, p) => acc + (p.consultations?.filter(c => c.type === 'followup').length || 0), 0)}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">متابعة دورية</span>
                  </div>
                </div>

                {/* 3. طوارئ */}
                <div className="p-4 bg-white border border-red-100 rounded-2xl shadow-2xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-red-900">طوارئ</span>
                    <div className="w-8 h-8 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center shrink-0">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-red-950 block">
                      {patientRecords.reduce((acc, p) => acc + (p.consultations?.filter(c => c.type === 'emergency').length || 0), 0)}
                    </span>
                    <span className="text-[10px] font-bold text-red-600">حالة عاجلة</span>
                  </div>
                </div>

                {/* 4. استشارة */}
                <div className="p-4 bg-white border border-purple-100 rounded-2xl shadow-2xs space-y-2.5 text-right">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-900">استشارة</span>
                    <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center shrink-0">
                      <MessageSquare className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                  <div>
                    <span className="text-2xl font-black text-purple-950 block">
                      {patientRecords.reduce((acc, p) => acc + (p.consultations?.filter(c => c.type === 'advisory').length || 0), 0)}
                    </span>
                    <span className="text-[10px] font-bold text-purple-600">استشارة طبية</span>
                  </div>
                </div>

                {/* 5. الرسوم */}
                <div className="p-4 bg-white border border-amber-100 rounded-2xl shadow-2xs space-y-2.5 text-right col-span-2 sm:col-span-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-900">إجمالي الرسوم</span>
                    <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                      <DollarSign className="w-4 h-4 text-amber-600" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xl font-black text-amber-950 block" dir="ltr">
                      {patientRecords.reduce((acc, p) => {
                        const patientFees = (p.consultations || []).reduce((fAcc, c) => fAcc + (parseFloat(String(c.fee || '0')) || 0), 0);
                        return acc + patientFees;
                      }, 0).toLocaleString('ar-EG')} ج.م
                    </span>
                    <span className="text-[10px] font-bold text-amber-700">تقديري</span>
                  </div>
                </div>

              </div>

              {/* FILTER & SEARCH BAR (قسم الفلترة والبحث مطابق للتصميم المرفق) */}
              <div className="p-4 sm:p-5 bg-neutral-50/90 border border-neutral-200/90 rounded-3xl space-y-4">
                
                {/* Header of Filter Bar with Download Button */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-200/70 pb-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#009bb9]" />
                    <span className="text-xs font-black text-neutral-900">فلترة وتصفية سجلات الكشوفات:</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Download Report Button جنب الفلتر */}
                    <button
                      type="button"
                      onClick={handleDownloadConsultationsReport}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-98"
                      title="تحميل ملف الكشوفات كتقرير Excel"
                    >
                      <Download className="w-4 h-4" />
                      <span>تحميل ملف الكشوفات</span>
                    </button>

                    {/* Reset Filters button */}
                    {(consultationTypeFilter !== 'all' || consultationDateFilter !== 'all' || consultationGenderFilter !== 'all' || patientSearchTerm !== '') && (
                      <button
                        type="button"
                        onClick={() => {
                          setConsultationTypeFilter('all');
                          setConsultationDateFilter('all');
                          setConsultationGenderFilter('all');
                          setConsultationCustomStartDate('');
                          setConsultationCustomEndDate('');
                          setPatientSearchTerm('');
                        }}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>إعادة ضبط</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 4 FILTER INPUTS IN A ROW (مطابق للتصميم المرفق) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                  
                  {/* 1. نوع الكشف / الخدمة */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-[#009bb9]" />
                      <span>نوع الكشف / الخدمة:</span>
                    </label>
                    <select
                      value={consultationTypeFilter}
                      onChange={(e) => setConsultationTypeFilter(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#009bb9] shadow-2xs cursor-pointer"
                    >
                      <option value="all">الكل (جميع الأنواع)</option>
                      <option value="consultation">كشف</option>
                      <option value="followup">متابعة</option>
                      <option value="emergency">طوارئ</option>
                      <option value="advisory">استشارة</option>
                    </select>
                  </div>

                  {/* 2. التاريخ / الفترة */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>تاريخ التسجيل / الكشف:</span>
                    </label>
                    <select
                      value={consultationDateFilter}
                      onChange={(e) => setConsultationDateFilter(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#009bb9] shadow-2xs cursor-pointer"
                    >
                      <option value="all">الكل (جميع تواريخ الكشوفات)</option>
                      <option value="today">اليوم</option>
                      <option value="this_week">هذا الأسبوع</option>
                      <option value="this_month">هذا الشهر</option>
                      <option value="custom">تاريخ مخصص...</option>
                    </select>
                  </div>

                  {/* 3. الجنس / النوع */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-600" />
                      <span>الجنس / النوع:</span>
                    </label>
                    <select
                      value={consultationGenderFilter}
                      onChange={(e) => setConsultationGenderFilter(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#009bb9] shadow-2xs cursor-pointer"
                    >
                      <option value="all">الكل (جميع الأنواع)</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>

                  {/* 4. البحث بالاسم / الهاتف */}
                  <div className="space-y-1.5 text-right">
                    <label className="text-xs font-black text-neutral-800 flex items-center gap-1.5">
                      <Search className="w-3.5 h-3.5 text-amber-600" />
                      <span>البحث بالاسم / الهاتف:</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={patientSearchTerm}
                        onChange={(e) => setPatientSearchTerm(e.target.value)}
                        placeholder="اكتب اسم المريض أو رقم الهاتف..."
                        className="w-full pl-8 pr-3.5 py-2.5 bg-white border border-neutral-200 rounded-2xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#009bb9] shadow-2xs"
                      />
                      {patientSearchTerm && (
                        <button
                          type="button"
                          onClick={() => setPatientSearchTerm('')}
                          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                {/* Custom Date Pickers if custom selected */}
                {consultationDateFilter === 'custom' && (
                  <div className="p-3 bg-white border border-neutral-200 rounded-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fadeIn">
                    <div className="space-y-1 text-right">
                      <label className="text-xs font-bold text-neutral-700 block">من تاريخ:</label>
                      <input
                        type="date"
                        value={consultationCustomStartDate}
                        onChange={(e) => setConsultationCustomStartDate(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#009bb9]"
                      />
                    </div>
                    <div className="space-y-1 text-right">
                      <label className="text-xs font-bold text-neutral-700 block">إلى تاريخ:</label>
                      <input
                        type="date"
                        value={consultationCustomEndDate}
                        onChange={(e) => setConsultationCustomEndDate(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-none focus:border-[#009bb9]"
                      />
                    </div>
                  </div>
                )}

              </div>

              {/* PATIENTS PROFILES LIST (بروفايل المريض) */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-neutral-900 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-[#10244A]" />
                    <span>سجل المرضى ({filteredPatientRecords.length})</span>
                  </h3>
                </div>

                {filteredPatientRecords.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {filteredPatientRecords.map((patient) => (
                      <div
                        key={patient.id}
                        className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all space-y-5 text-right"
                      >
                        {/* Patient Profile Header: Name on the Right (يمين), Action Icons below it on the Left (شمال) */}
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3.5 border-b border-neutral-100 pb-3.5">
                          
                          {/* Static Person Icon + Name + Consultation Type on the RIGHT side */}
                          <div className="flex items-center gap-3 flex-wrap justify-start w-full md:w-auto">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#10244A]/10 to-[#009bb9]/10 border border-[#009bb9]/20 flex items-center justify-center shrink-0 shadow-2xs">
                              <User className="w-5 h-5 text-[#10244A]" />
                            </div>

                            <div className="flex items-center gap-2 flex-wrap justify-start">
                              {/* الاسم */}
                              <h3 className="text-base font-black text-neutral-900 ml-1">{patient.patientName}</h3>
                              
                              {/* نوع الكشف فقط جنب الاسم */}
                              {(() => {
                                const types = Array.from(new Set((patient.consultations || []).map(c => c.type || 'consultation')));
                                if (types.length === 0) types.push('consultation');
                                return types.map(t => (
                                  <span key={t} className={`px-3 py-1 text-xs font-black rounded-xl border ${
                                    t === 'consultation' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                                    t === 'followup' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' :
                                    t === 'emergency' ? 'bg-red-50 text-red-800 border-red-200' :
                                    'bg-purple-50 text-purple-800 border-purple-200'
                                  }`}>
                                    {t === 'consultation' ? 'كشف' : t === 'followup' ? 'متابعة' : t === 'emergency' ? 'طوارئ' : 'استشارة'}
                                  </span>
                                ));
                              })()}

                            </div>
                          </div>

                          {/* ICON ONLY BUTTONS: [Pencil Edit] [Eye Details] [Trash Delete] - On Mobile underneath to the LEFT (شمال) */}
                          <div className="flex items-center justify-end gap-2.5 w-full md:w-auto shrink-0 pt-1.5 md:pt-0">
                            
                            {/* 1. Edit (رمز بس) */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditPatientModal(patient)}
                              className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl border border-amber-200/90 transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center"
                              title="تعديل بيانات المريض"
                            >
                              <Edit3 className="w-4 h-4 text-amber-700" />
                            </button>

                            {/* 2. Eye Details (رمز بس) */}
                            <button
                              type="button"
                              onClick={() => toggleExpandPatient(patient.id)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center ${
                                expandedPatientIds.includes(patient.id)
                                  ? 'bg-[#009bb9] text-white border-[#009bb9]'
                                  : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200/90'
                              }`}
                              title={expandedPatientIds.includes(patient.id) ? 'إخفاء الملاحظات' : 'عرض الملاحظات'}
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            {/* 3. Delete */}
                            <button
                              type="button"
                              onClick={() => handleDeletePatientRecord(patient.id)}
                              className="p-2.5 text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200/90 transition-all cursor-pointer shadow-2xs active:scale-95 flex items-center justify-center"
                              title="حذف ملف المريض"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>
                        </div>

                        {/* EXPANDED DETAILS (يظهر عند الضغط على العين) */}
                        {expandedPatientIds.includes(patient.id) && (() => {
                          const latestC = (patient.consultations && patient.consultations.length > 0) ? patient.consultations[0] : null;
                          const cDate = latestC?.date || (patient.createdAt ? patient.createdAt.slice(0, 10) : '2026-08-16');
                          const cTime = latestC?.time || '07:00 م';
                          const totalFee = (patient.consultations || []).reduce((acc, c) => acc + (parseFloat(String(c.fee || '0')) || 0), 0);
                          const feeDisplay = latestC?.fee ? latestC.fee : (totalFee > 0 ? String(totalFee) : '400');

                          return (
                            <div className="space-y-3 animate-fadeIn pt-1">
                              
                              {/* --- وضع الهاتف فقط (Mobile Layout: سطر أول تاريخ، سطر ثاني رقم، سطر ثالث النوع والسن والرسوم) --- */}
                              <div className="space-y-2.5 md:hidden">
                                {/* 1. السطر الأول كامل: التاريخ والوقت */}
                                <div className="p-3 bg-white border border-neutral-200 rounded-2xl flex items-center justify-between shadow-2xs text-xs text-right">
                                  <span className="text-xs font-bold text-neutral-500 flex items-center gap-1.5">
                                    <Calendar className="w-4 h-4 text-[#009bb9]" />
                                    <span>التاريخ:</span>
                                  </span>
                                  <div className="font-black text-neutral-900 text-xs flex items-center gap-1.5" dir="ltr">
                                    <span>{cDate}</span>
                                    <span className="text-neutral-400">•</span>
                                    <span>{cTime}</span>
                                  </div>
                                </div>

                                {/* 2. السطر الثاني كامل: الرقم */}
                                <div className="p-3 bg-white border border-neutral-200 rounded-2xl flex items-center justify-between shadow-2xs text-xs text-right">
                                  <span className="text-xs font-bold text-neutral-500 flex items-center gap-1.5">
                                    <Phone className="w-4 h-4 text-emerald-600" />
                                    <span>الرقم:</span>
                                  </span>
                                  <span className="font-black text-neutral-900 text-xs tracking-wider" dir="ltr">
                                    {patient.patientPhone || '01012345678'}
                                  </span>
                                </div>

                                {/* 3. النوع والسن والرسوم سطر واحد في وضع الهاتف */}
                                <div className="grid grid-cols-3 gap-2 text-xs text-right">
                                  {/* النوع */}
                                  <div className="p-2.5 bg-white border border-neutral-200 rounded-2xl flex flex-col justify-center items-center text-center space-y-0.5 shadow-2xs">
                                    <span className="text-[11px] font-bold text-neutral-500 flex items-center gap-1">
                                      <User className="w-3.5 h-3.5 text-purple-600" />
                                      <span>النوع:</span>
                                    </span>
                                    <span className="font-black text-neutral-900 text-xs">
                                      {patient.gender || 'ذكر'}
                                    </span>
                                  </div>

                                  {/* السن */}
                                  <div className="p-2.5 bg-white border border-neutral-200 rounded-2xl flex flex-col justify-center items-center text-center space-y-0.5 shadow-2xs">
                                    <span className="text-[11px] font-bold text-neutral-500 flex items-center gap-1">
                                      <Activity className="w-3.5 h-3.5 text-indigo-600" />
                                      <span>السن:</span>
                                    </span>
                                    <span className="font-black text-neutral-900 text-xs">
                                      {patient.age ? `${patient.age} سنة` : '38 سنة'}
                                    </span>
                                  </div>

                                  {/* الرسوم */}
                                  <div className="p-2.5 bg-white border border-amber-200 rounded-2xl flex flex-col justify-center items-center text-center space-y-0.5 shadow-2xs">
                                    <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                                      <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                                      <span>الرسوم:</span>
                                    </span>
                                    <span className="font-black text-amber-900 text-xs">
                                      {parseFloat(String(feeDisplay)).toLocaleString('ar-EG')} ج.م
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* --- وضع الكمبيوتر فقط (Desktop Layout: التاريخ، الرقم، النوع، السن، الرسوم في سطر واحد 5 أعمدة) --- */}
                              <div className="hidden md:grid md:grid-cols-5 gap-2.5 text-xs text-right">
                                {/* 1. التاريخ والوقت */}
                                <div className="p-3 bg-white border border-neutral-200 rounded-2xl flex flex-col justify-center space-y-1 shadow-2xs">
                                  <span className="text-[11px] font-bold text-neutral-500 flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-[#009bb9]" />
                                    <span>التاريخ:</span>
                                  </span>
                                  <div className="font-black text-neutral-900 text-xs flex items-center gap-1 flex-wrap" dir="ltr">
                                    <span>{cDate}</span>
                                    <span className="text-neutral-400">•</span>
                                    <span>{cTime}</span>
                                  </div>
                                </div>

                                {/* 2. الرقم */}
                                <div className="p-3 bg-white border border-neutral-200 rounded-2xl flex flex-col justify-center space-y-1 shadow-2xs">
                                  <span className="text-[11px] font-bold text-neutral-500 flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>الرقم:</span>
                                  </span>
                                  <span className="font-black text-neutral-900 text-xs truncate" dir="ltr">
                                    {patient.patientPhone || '01012345678'}
                                  </span>
                                </div>

                                {/* 3. النوع */}
                                <div className="p-3 bg-white border border-neutral-200 rounded-2xl flex flex-col justify-center space-y-1 shadow-2xs">
                                  <span className="text-[11px] font-bold text-neutral-500 flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-purple-600" />
                                    <span>النوع:</span>
                                  </span>
                                  <span className="font-black text-neutral-900 text-xs">
                                    {patient.gender || 'ذكر'}
                                  </span>
                                </div>

                                {/* 4. السن */}
                                <div className="p-3 bg-white border border-neutral-200 rounded-2xl flex flex-col justify-center space-y-1 shadow-2xs">
                                  <span className="text-[11px] font-bold text-neutral-500 flex items-center gap-1">
                                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                                    <span>السن:</span>
                                  </span>
                                  <span className="font-black text-neutral-900 text-xs">
                                    {patient.age ? `${patient.age} سنة` : '38 سنة'}
                                  </span>
                                </div>

                                {/* 5. الرسوم */}
                                <div className="p-3 bg-white border border-amber-200 rounded-2xl flex flex-col justify-center space-y-1 shadow-2xs">
                                  <span className="text-[11px] font-bold text-amber-700 flex items-center gap-1">
                                    <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                                    <span>الرسوم:</span>
                                  </span>
                                  <span className="font-black text-amber-900 text-xs">
                                    {parseFloat(String(feeDisplay)).toLocaleString('ar-EG')} ج.م
                                  </span>
                                </div>
                              </div>

                              {/* 4. ملاحظات عامة عن المريض بخلفية بيضاء (مشترك للكمبيوتر والهاتف) */}
                              <div className="p-4 bg-white border border-neutral-200 rounded-2xl text-xs space-y-1.5 shadow-2xs text-right">
                                <div className="font-extrabold text-neutral-900 flex items-center gap-1.5">
                                  <Info className="w-4 h-4 text-[#009bb9]" />
                                  <span>ملاحظات عامة عن المريض:</span>
                                </div>
                                <p className="text-neutral-700 font-bold leading-relaxed pr-5 whitespace-pre-line">
                                  {patient.notes?.trim() ? patient.notes : 'لا توجد ملاحظات مسجلة لهذا المريض.'}
                                </p>
                              </div>

                            </div>
                          );
                        })()}

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-10 bg-neutral-50 border border-dashed border-neutral-300 rounded-3xl text-center space-y-3">
                    <User className="w-10 h-10 text-neutral-400 mx-auto" />
                    <div className="font-black text-neutral-800 text-base">لا توجد نتائج لمرضى مطابقة للبحث</div>
                    <p className="text-xs text-neutral-500 font-medium">يمكنك إضافة كشف أو متابعة جديدة من الأزرار العلوية</p>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 2.5 SECRETARIES MANAGEMENT SECTION (قسم إدارة السكرتارية) */}
        {activeTab === 'secretaries' && !loggedSecretary && (
          <div className="animate-fadeIn max-w-3xl mx-auto py-2">
            {renderProfileQuickBar()}
            {/* SINGLE CONSOLIDATED CARD FOR SECRETARIES */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
              
              {/* Header Banner */}
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                  إدارة فريق السكرتارية
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                  إضافة السكرتيرات المساعدات وتحديد صلاحيات الوصول وإدارة الحسابات
                </p>
              </div>

              {/* Add Secretary Button */}
              <div className="flex items-center justify-center pt-1">
                <button
                  type="button"
                  onClick={handleOpenAddSecretary}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>إضافة سكرتيرة جديدة</span>
                </button>
              </div>

              {/* Table Container */}
              <div className="border border-neutral-200 rounded-2xl overflow-hidden">
                <div className="p-4 sm:p-5 bg-neutral-50 border-b border-neutral-200 flex items-center justify-between">
                  <h3 className="text-xs sm:text-sm font-bold text-neutral-800 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-neutral-600" />
                    <span>قائمة السكرتارية المعتمدة ({formData.secretaries?.length || 0})</span>
                  </h3>
                </div>

              {(!formData.secretaries || formData.secretaries.length === 0) ? (
                <div className="p-10 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-neutral-100 border border-neutral-200 text-neutral-400 flex items-center justify-center mx-auto">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-neutral-900">لا توجد سكرتيرة مضافة حالياً</h4>
                    <p className="text-xs text-neutral-500 max-w-md mx-auto mt-1">
                      اضغط على زر "إضافة سكرتيرة جديدة" للبدء في إضافة المساعدات وتخصيص صلاحياتهن.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleOpenAddSecretary}
                    className="px-5 py-2 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    إضافة سكرتيرة
                  </button>
                </div>
              ) : (
                <>
                  {/* Mobile & Tablet Card View */}
                  <div className="lg:hidden divide-y divide-neutral-200">
                    {formData.secretaries.map((sec) => {
                      const activePermsCount = sec.permissions 
                        ? Object.values(sec.permissions).filter(Boolean).length 
                        : 0;
                      const branchObj = formData.branches?.find(b => b.id === sec.branchId);

                      return (
                        <div key={sec.id} className="p-4 sm:p-5 bg-white space-y-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold shrink-0 text-sm">
                                {sec.name ? sec.name.charAt(0) : 'س'}
                              </div>
                              <div className="min-w-0">
                                <div className="text-neutral-900 font-bold text-sm truncate">{sec.name}</div>
                                {sec.email && (
                                  <div className="text-xs text-neutral-500 truncate">{sec.email}</div>
                                )}
                              </div>
                            </div>
                            <div>
                              {sec.status === 'active' ? (
                                <span className="px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs inline-flex items-center gap-1 shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  <span>نشطة</span>
                                </span>
                              ) : (
                                <span className="px-2.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 font-bold text-xs inline-flex items-center gap-1 shrink-0">
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                  <span>موقوفة</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                            <div className="flex items-center gap-2 font-bold text-neutral-800 dir-ltr justify-end">
                              <a href={`tel:${sec.phone}`} className="hover:underline flex items-center gap-1">
                                <span>{sec.phone}</span>
                                <Phone className="w-3.5 h-3.5 text-neutral-500" />
                              </a>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-neutral-200 text-neutral-800 font-bold text-[11px]">
                                <ShieldCheck className="w-3 h-3 text-neutral-600" />
                                <span>سكرتيرة ({activePermsCount} صلاحية)</span>
                              </span>
                              {branchObj && (
                                <span className="text-[11px] text-neutral-600 flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  <span>فرع: {branchObj.name}</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 pt-1">
                            <button
                              type="button"
                              onClick={() => handleOpenEditSecretary(sec)}
                              className="flex-1 sm:flex-initial px-3 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Edit3 className="w-3.5 h-3.5 shrink-0" />
                              <span>تعديل الصلاحيات والبيانات</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSecretary(sec.id)}
                              className="px-3 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5 shrink-0" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-xs font-bold">
                          <th className="p-4 sm:px-6">الاسم</th>
                          <th className="p-4 sm:px-6">رقم الموبايل / التواصل</th>
                          <th className="p-4 sm:px-6">الصلاحية</th>
                          <th className="p-4 sm:px-6">الحالة</th>
                          <th className="p-4 sm:px-6 text-center">إجراءات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200 text-xs sm:text-sm font-semibold">
                        {formData.secretaries.map((sec) => {
                          const activePermsCount = sec.permissions 
                            ? Object.values(sec.permissions).filter(Boolean).length 
                            : 0;
                          const branchObj = formData.branches?.find(b => b.id === sec.branchId);

                          return (
                            <tr key={sec.id} className="hover:bg-neutral-50/80 transition-colors">
                              <td className="p-4 sm:px-6 font-bold text-neutral-900">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                                    {sec.name ? sec.name.charAt(0) : 'س'}
                                  </div>
                                  <div>
                                    <div className="text-neutral-900 font-bold">{sec.name}</div>
                                    {sec.email && (
                                      <div className="text-[11px] text-neutral-500 font-normal">{sec.email}</div>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4 sm:px-6 dir-ltr text-right font-bold text-neutral-800">
                                <a href={`tel:${sec.phone}`} className="hover:underline flex items-center gap-1">
                                  <span>{sec.phone}</span>
                                  <Phone className="w-3.5 h-3.5 text-neutral-500" />
                                </a>
                              </td>
                              <td className="p-4 sm:px-6">
                                <div className="space-y-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-neutral-800 font-bold text-xs">
                                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-600" />
                                    <span>سكرتيرة</span>
                                    <span className="text-[10px] bg-neutral-200 px-1.5 py-0.5 rounded-md font-bold text-neutral-900">
                                      ({activePermsCount} صلاحية)
                                    </span>
                                  </span>
                                  {branchObj && (
                                    <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                                      <Building2 className="w-3 h-3 text-neutral-500" />
                                      <span>فرع: {branchObj.name}</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 sm:px-6">
                                {sec.status === 'active' ? (
                                  <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-xs inline-flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span>نشطة</span>
                                  </span>
                                ) : (
                                  <span className="px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-800 font-bold text-xs inline-flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                    <span>موقوفة</span>
                                  </span>
                                )}
                              </td>
                              <td className="p-4 sm:px-6 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditSecretary(sec)}
                                    className="p-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl transition-all cursor-pointer"
                                    title="تعديل البيانات والصلاحيات"
                                  >
                                    <Edit3 className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSecretary(sec.id)}
                                    className="p-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl transition-all cursor-pointer"
                                    title="حذف"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            </div>

          </div>
        )}

        {/* PROFILE CONTENT SECTIONS (الخدمات - المعرض - الفيديوهات - الشهادات - آراء المرضى) */}
        {(activeTab === 'content' || activeTab === 'services' || activeTab === 'gallery' || activeTab === 'videos' || activeTab === 'certificates' || activeTab === 'reviews') && (
          <div className="animate-fadeIn max-w-3xl mx-auto py-2">
            {renderProfileQuickBar()}
            {/* SINGLE CONSOLIDATED CARD FOR CONTENT */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
              
              {/* SECTION 1: الخدمات (Services) */}
              {(activeTab === 'content' || activeTab === 'services') && (!loggedSecretary || loggedSecretary.permissions?.manageServices) && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                    الخدمات الطبية والأسعار
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                    إضافة وتعديل الخدمات الطبية المعروضة، تحديد الأسعار ورفع الصور التوضيحية
                  </p>
                </div>

                {/* Toggle Button */}
                <div className="flex items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={handleToggleServices}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      (formData.features?.servicesAndPrices ?? true)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {(formData.features?.servicesAndPrices ?? true) ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                        <span>قسم الخدمات: مفعل (On)</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-red-600" />
                        <span>قسم الخدمات: معطل (Off)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Add New Service Form */}
                <form onSubmit={handleAddService} className="bg-neutral-50/70 border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-800 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-neutral-600" />
                    <span>{editingServiceId ? 'تعديل بيانات الخدمة' : 'إضافة خدمة جديدة'}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-800 text-right">اسم/عنوان الخدمة *</label>
                      <input 
                        type="text"
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        placeholder="مثال: فحص واستشارة شاملة"
                        required
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-800 text-right">سعر الخدمة (جنيه) [اختياري]</label>
                      <input 
                        type="number"
                        value={newServicePrice}
                        onChange={(e) => setNewServicePrice(e.target.value)}
                        placeholder="مثال: 500"
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-800 text-right">وصف الخدمة</label>
                    <textarea 
                      value={newServiceDesc}
                      onChange={(e) => setNewServiceDesc(e.target.value)}
                      placeholder="اكتب شرحاً مختصراً للخدمة..."
                      rows={2}
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all leading-relaxed resize-none text-right"
                    />
                  </div>

                  {/* Upload Image File */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-800 text-right">رفع صورة توضيحية للخدمة (اختياري)</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleServiceImageUpload(e.target.files[0])}
                        className="text-xs text-neutral-500 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-900 file:text-white hover:file:bg-black cursor-pointer"
                      />
                      {newServiceImage && (
                        <div className="w-12 h-12 rounded-xl overflow-hidden border border-neutral-200 shrink-0">
                          <img src={newServiceImage} alt="Service" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      type="submit"
                      disabled={!newServiceName.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{editingServiceId ? 'حفظ تعديلات الخدمة' : 'إضافة الخدمة للقائمة'}</span>
                    </button>
                    {editingServiceId && (
                      <button 
                        type="button"
                        onClick={handleCancelEditService}
                        className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer border border-neutral-200"
                      >
                        إلغاء التعديل
                      </button>
                    )}
                  </div>
                </form>

                {/* Added Services List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-700 text-right">الخدمات المضافة حالياً ({formData.services?.length || 0}):</h4>
                  {(!formData.services || formData.services.length === 0) ? (
                    <p className="text-xs text-neutral-500 italic p-6 bg-neutral-50 rounded-2xl text-center border border-neutral-200">لا توجد خدمات مضافة حتى الآن.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {formData.services.map((srv) => (
                        <div key={srv.id} className="p-4 bg-white border border-neutral-200/90 rounded-2xl flex flex-col justify-between gap-3 shadow-xs hover:border-neutral-300 transition-all">
                          <div className="space-y-2 text-right">
                            {srv.imageUrl && (
                              <img src={srv.imageUrl} alt={srv.name} className="w-full h-28 object-cover rounded-xl mb-1" />
                            )}
                            <h5 className="text-sm font-bold text-neutral-900">{srv.name}</h5>
                            {srv.description && <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">{srv.description}</p>}
                            {srv.price && <span className="inline-block text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">{srv.price} جنيه</span>}
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 w-full">
                            <button 
                              type="button"
                              onClick={() => handleEditServiceStart(srv)}
                              className="flex-1 text-xs font-bold text-neutral-700 flex items-center justify-center gap-1 cursor-pointer py-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>تعديل</span>
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteService(srv.id)}
                              className="flex-1 text-xs font-bold text-red-600 flex items-center justify-center gap-1 cursor-pointer py-2 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* SECTION 2: معرض الصور (Gallery) */}
              {(activeTab === 'content' || activeTab === 'gallery') && (!loggedSecretary || loggedSecretary.permissions?.manageGallery) && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                    معرض صور العيادة
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                    رفع صور العيادة، غرف الفحص، الأجهزة الحديثة ونتائج الحالات
                  </p>
                </div>

                {/* Toggle Button */}
                <div className="flex items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={handleToggleGallery}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      (formData.features?.photoGallery ?? true)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {(formData.features?.photoGallery ?? true) ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                        <span>قسم معرض الصور: مفعل (On)</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-red-600" />
                        <span>قسم معرض الصور: معطل (Off)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Add New Gallery Photo Form */}
                <form onSubmit={handleAddGalleryItem} className="bg-neutral-50/70 border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-800 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-neutral-600" />
                    <span>{editingGalleryId ? 'تعديل صورة في المعرض' : 'رفع صورة جديدة للمعرض'}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-800 text-right">وصف الصورة</label>
                      <input 
                        type="text"
                        value={newGalleryTitle}
                        onChange={(e) => setNewGalleryTitle(e.target.value)}
                        placeholder="مثال: غرف الفحص والأجهزة الطبية"
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-800 text-right">اختيار صورة من جهازك</label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleGalleryImageUpload(e.target.files[0])}
                        required={!newGalleryImage}
                        className="text-xs text-neutral-500 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-900 file:text-white hover:file:bg-black cursor-pointer"
                      />
                    </div>
                  </div>

                  {newGalleryImage && (
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xs text-neutral-600 font-bold">المعاينة:</span>
                      <img src={newGalleryImage} alt="Gallery Preview" className="w-20 h-20 object-cover rounded-xl border border-neutral-200" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      type="submit"
                      disabled={!newGalleryImage}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>حفظ</span>
                    </button>
                    {editingGalleryId && (
                      <button 
                        type="button"
                        onClick={handleCancelEditGallery}
                        className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer border border-neutral-200"
                      >
                        إلغاء التعديل
                      </button>
                    )}
                  </div>
                </form>

                {/* Added Gallery Photos Grid */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-700 text-right">الصور المضافة ({formData.galleryItems?.length || 0}):</h4>
                  {(!formData.galleryItems || formData.galleryItems.length === 0) ? (
                    <p className="text-xs text-neutral-500 italic p-6 bg-neutral-50 rounded-2xl text-center border border-neutral-200">لا توجد صور مضافة في المعرض حتى الآن.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {formData.galleryItems.map((item) => (
                        <div key={item.id} className="p-4 bg-white border border-neutral-200/90 rounded-2xl flex flex-col justify-between gap-3 shadow-xs hover:border-neutral-300 transition-all">
                          <div className="w-full h-44 sm:h-48 overflow-hidden rounded-xl bg-neutral-100 relative">
                            <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-neutral-900 text-center line-clamp-1 px-1">{item.title}</span>
                          <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 w-full">
                            <button 
                              type="button"
                              onClick={() => handleEditGalleryStart(item)}
                              className="flex-1 text-xs font-bold text-neutral-700 flex items-center justify-center gap-1.5 cursor-pointer py-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5 shrink-0" />
                              <span>تعديل</span>
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteGalleryItem(item.id)}
                              className="flex-1 text-xs font-bold text-red-600 flex items-center justify-center gap-1.5 cursor-pointer py-2 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5 shrink-0" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* SECTION 3: الفيديوهات (Videos) */}
              {(activeTab === 'content' || activeTab === 'videos') && (!loggedSecretary || loggedSecretary.permissions?.manageVideos) && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                    مكتبة الفيديوهات
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                    إضافة روابط فيديوهات يوتيوب للعمليات والشروحات الطبية
                  </p>
                </div>

                {/* Toggle Button */}
                <div className="flex items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={handleToggleVideos}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      (formData.features?.videosSection ?? true)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {(formData.features?.videosSection ?? true) ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                        <span>قسم الفيديوهات: مفعل (On)</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-red-600" />
                        <span>قسم الفيديوهات: معطل (Off)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Add Video Form */}
                <form onSubmit={handleAddVideo} className="bg-neutral-50/70 border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-800 flex items-center gap-2">
                    <Video className="w-4 h-4 text-neutral-600" />
                    <span>{editingVideoIndex !== null ? 'تعديل فيديو يوتيوب' : 'إضافة فيديو يوتيوب جديد'}</span>
                  </h4>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-800 text-right">رابط فيديو يوتيوب (YouTube Link) *</label>
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                      <input 
                        type="url"
                        value={newVideoUrl}
                        onChange={(e) => setNewVideoUrl(e.target.value)}
                        dir="ltr"
                        placeholder="https://www.youtube.com/watch?v=XXXXXX أو https://youtu.be/XXXXXX"
                        required
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-left"
                      />
                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                        <button 
                          type="submit"
                          disabled={!newVideoUrl.trim()}
                          className="flex-1 sm:flex-initial px-6 py-3 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{editingVideoIndex !== null ? 'حفظ التعديل' : 'إضافة الفيديو'}</span>
                        </button>
                        {editingVideoIndex !== null && (
                          <button 
                            type="button"
                            onClick={handleCancelEditVideo}
                            className="px-4 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer border border-neutral-200"
                          >
                            إلغاء
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </form>

                {/* Added Videos List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-700 text-right">الفيديوهات المضافة ({formData.videos?.length || 0}):</h4>
                  {(!formData.videos || formData.videos.length === 0) ? (
                    <p className="text-xs text-neutral-500 italic p-6 bg-neutral-50 rounded-2xl text-center border border-neutral-200">لا توجد فيديوهات مضافة حتى الآن.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {formData.videos.map((vUrl, idx) => {
                        let embedUrl = vUrl;
                        const match = vUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/);
                        if (match && match[1]) {
                          embedUrl = `https://www.youtube.com/embed/${match[1]}`;
                        }

                        return (
                          <div key={idx} className="p-4 bg-white border border-neutral-200/90 rounded-2xl space-y-3 shadow-xs">
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black">
                              <iframe 
                                src={embedUrl}
                                title={`Video ${idx + 1}`}
                                className="w-full h-full border-0"
                                allowFullScreen
                              />
                            </div>
                            <div className="flex items-center justify-between text-xs pt-1">
                              <span className="text-neutral-600 font-bold truncate dir-ltr max-w-[150px] sm:max-w-[180px]">{vUrl}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button 
                                  type="button"
                                  onClick={() => handleEditVideoStart(idx, vUrl)}
                                  className="text-neutral-700 font-bold flex items-center gap-1 cursor-pointer px-3 py-1.5 bg-neutral-50 hover:bg-neutral-100 rounded-lg border border-neutral-200 transition-all text-xs"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                  <span>تعديل</span>
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteVideo(idx)}
                                  className="text-red-600 font-bold flex items-center gap-1 cursor-pointer px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 transition-all text-xs"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>حذف</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* SECTION 4: الشهادات (Certificates) */}
              {(activeTab === 'content' || activeTab === 'certificates') && (!loggedSecretary || loggedSecretary.permissions?.manageCertificates) && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                    الشهادات والاعتمادات
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                    رفع شهادات التخصص، المؤتمرات، والتراخيص الطبية المعتمدة
                  </p>
                </div>

                {/* Toggle Button */}
                <div className="flex items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={handleToggleCertificates}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      (formData.features?.addCertificates ?? true)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {(formData.features?.addCertificates ?? true) ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                        <span>قسم الشهادات: مفعل (On)</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-red-600" />
                        <span>قسم الشهادات: معطل (Off)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Add Certificate Form */}
                <form onSubmit={handleAddCertificate} className="bg-neutral-50/70 border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-800 flex items-center gap-2">
                    <Award className="w-4 h-4 text-neutral-600" />
                    <span>{editingCertId ? 'تعديل بيانات الشهادة' : 'رفع شهادة جديدة'}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-800 text-right">عنوان/اسم الشهادة *</label>
                      <input 
                        type="text"
                        value={newCertTitle}
                        onChange={(e) => setNewCertTitle(e.target.value)}
                        placeholder="مثال: شهادة البورد التخصصي في الطب البشري"
                        required
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-800 text-right">تحميل صورة الشهادة *</label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleCertImageUpload(e.target.files[0])}
                        required={!newCertImage}
                        className="text-xs text-neutral-500 file:mr-0 file:ml-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-900 file:text-white hover:file:bg-black cursor-pointer"
                      />
                    </div>
                  </div>

                  {newCertImage && (
                    <div className="flex items-center gap-3 pt-2">
                      <span className="text-xs text-neutral-600 font-bold">معاينة الشهادة:</span>
                      <img src={newCertImage} alt="Cert Preview" className="w-24 h-16 object-cover rounded-xl border border-neutral-200" />
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      type="submit"
                      disabled={!newCertTitle.trim() || !newCertImage}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{editingCertId ? 'حفظ تعديلات الشهادة' : 'إضافة الشهادة'}</span>
                    </button>
                    {editingCertId && (
                      <button 
                        type="button"
                        onClick={handleCancelEditCert}
                        className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer border border-neutral-200"
                      >
                        إلغاء التعديل
                      </button>
                    )}
                  </div>
                </form>

                {/* Added Certificates List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-700 text-right">الشهادات المضافة ({formData.certificates?.length || 0}):</h4>
                  {(!formData.certificates || formData.certificates.length === 0) ? (
                    <p className="text-xs text-neutral-500 italic p-6 bg-neutral-50 rounded-2xl text-center border border-neutral-200">لا توجد شهادات مضافة حتى الآن.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {formData.certificates.map((cert: any) => (
                        <div key={cert.id || cert} className="p-4 bg-white border border-neutral-200/90 rounded-2xl flex flex-col justify-between gap-3 shadow-xs hover:border-neutral-300 transition-all">
                          {typeof cert !== 'string' && cert.imageUrl && (
                            <img src={cert.imageUrl} alt={cert.title} className="w-full h-32 object-cover rounded-xl" />
                          )}
                          <h5 className="text-xs sm:text-sm font-bold text-neutral-900 leading-snug text-right">{typeof cert === 'string' ? cert : cert.title}</h5>
                          {typeof cert !== 'string' ? (
                            <div className="flex items-center gap-1.5 pt-2 border-t border-neutral-100 w-full">
                              <button 
                                type="button"
                                onClick={() => handleEditCertificateStart(cert)}
                                className="flex-1 text-xs font-bold text-neutral-700 flex items-center justify-center gap-1 cursor-pointer py-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-all"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>تعديل</span>
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleDeleteCertificate(cert.id)}
                                className="flex-1 text-xs font-bold text-red-600 flex items-center justify-center gap-1 cursor-pointer py-2 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-all"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>حذف</span>
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* SECTION 5: آراء المرضى (Patient Reviews) */}
              {(activeTab === 'content' || activeTab === 'reviews') && (!loggedSecretary || loggedSecretary.permissions?.managePatients || loggedSecretary.permissions?.manageServices) && (
              <div className="space-y-6">
                <div className="text-center space-y-1">
                  <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                    تقييمات وآراء المرضى
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                    إدارة آراء وتجارب المرضى، التقييم بالنجوم وإضافة تعليقاتهم
                  </p>
                </div>

                {/* Toggle Button */}
                <div className="flex items-center justify-center pt-1">
                  <button
                    type="button"
                    onClick={handleToggleReviews}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all cursor-pointer ${
                      (formData.features?.patientReviews ?? true)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-red-50 border-red-200 text-red-800'
                    }`}
                  >
                    {(formData.features?.patientReviews ?? true) ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-emerald-600" />
                        <span>قسم آراء المرضى: مفعل (On)</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-red-600" />
                        <span>قسم آراء المرضى: معطل (Off)</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Add Review Form */}
                <form onSubmit={handleAddReview} className="bg-neutral-50/70 border border-neutral-200 rounded-2xl p-5 sm:p-6 space-y-4">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-800 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-neutral-600" />
                    <span>{editingReviewId ? 'تعديل رأي المريض' : 'إضافة رأي مريض جديد'}</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1.5 min-w-0">
                      <label className="block text-xs font-bold text-neutral-800 text-right">اسم المريض *</label>
                      <input 
                        type="text"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        placeholder="مثال: أحمد محمود"
                        required
                        className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all text-right"
                      />
                    </div>

                    <div className="space-y-1.5 min-w-0">
                      <label className="block text-xs font-bold text-neutral-800 text-right">تحديد النجوم (1 - 5) *</label>
                      <div className="flex items-center gap-1.5 pt-2 flex-wrap min-w-0">
                        <div className="flex items-center gap-1 shrink-0">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewReviewRating(star)}
                              className="p-0.5 cursor-pointer transition-transform hover:scale-110"
                            >
                              <Star className={`w-5 h-5 ${star <= newReviewRating ? 'text-amber-500 fill-amber-500' : 'text-neutral-300'}`} />
                            </button>
                          ))}
                        </div>
                        <span className="text-xs font-bold text-amber-600 shrink-0">({newReviewRating} نجوم)</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 min-w-0 sm:col-span-2 lg:col-span-1">
                      <label className="block text-xs font-bold text-neutral-800 text-right">صورة المريض (اختياري)</label>
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={(e) => e.target.files?.[0] && handleReviewAvatarUpload(e.target.files[0])}
                        className="w-full text-xs text-neutral-500 file:mr-0 file:ml-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-neutral-900 file:text-white hover:file:bg-black cursor-pointer block max-w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-800 text-right">وصف التجربة / رأي المريض *</label>
                    <textarea 
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      placeholder="اكتب تفاصيل رأي وتجربة المريض..."
                      rows={2}
                      required
                      className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-600 transition-all leading-relaxed resize-none text-right"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      type="submit"
                      disabled={!newReviewName.trim() || !newReviewComment.trim()}
                      className="px-6 py-2.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{editingReviewId ? 'حفظ تعديلات الرأي' : 'إضافة رأي المريض'}</span>
                    </button>
                    {editingReviewId && (
                      <button 
                        type="button"
                        onClick={handleCancelEditReview}
                        className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer border border-neutral-200"
                      >
                        إلغاء التعديل
                      </button>
                    )}
                  </div>
                </form>

                {/* Added Reviews List */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-700 text-right">آراء المرضى المضافة ({formData.reviews?.length || 0}):</h4>
                  {(!formData.reviews || formData.reviews.length === 0) ? (
                    <p className="text-xs text-neutral-500 italic p-6 bg-neutral-50 rounded-2xl text-center border border-neutral-200">لا توجد آراء مضافة حتى الآن.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {formData.reviews.map((rev) => (
                        <div key={rev.id} className="p-4 bg-white border border-neutral-200/90 rounded-2xl flex flex-col justify-between gap-3 shadow-xs hover:border-neutral-300 transition-all">
                          <div className="space-y-2.5 min-w-0 text-right">
                            <div className="flex items-center gap-3 min-w-0 pb-2 border-b border-neutral-100">
                              {rev.avatar ? (
                                <img src={rev.avatar} alt={rev.patientName} className="w-10 h-10 rounded-full object-cover border border-neutral-200 shrink-0 shadow-xs" />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-800 font-bold flex items-center justify-center text-sm shrink-0">
                                  {rev.patientName.charAt(0)}
                                </div>
                              )}
                              <div className="min-w-0 flex-1 space-y-1">
                                <h5 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">{rev.patientName}</h5>
                                <div className="flex items-center gap-0.5">
                                  {[...Array(rev.rating || 5)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-neutral-700 leading-relaxed bg-neutral-50 p-3 rounded-xl border border-neutral-100 italic line-clamp-3">
                              "{rev.comment}"
                            </p>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 w-full shrink-0">
                            <button 
                              type="button"
                              onClick={() => handleEditReviewStart(rev)}
                              className="flex-1 text-xs font-bold text-neutral-700 flex items-center justify-center gap-1.5 cursor-pointer py-2 px-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 transition-all"
                            >
                              <Edit3 className="w-3.5 h-3.5 shrink-0" />
                              <span>تعديل</span>
                            </button>
                            <button 
                              type="button"
                              onClick={() => handleDeleteReview(rev.id)}
                              className="flex-1 text-xs font-bold text-red-600 flex items-center justify-center gap-1.5 cursor-pointer py-2 px-3 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5 shrink-0" />
                              <span>حذف</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              )}

              {/* Bottom Global Save */}
              <div className="pt-4 border-t border-neutral-100 text-center">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-10 py-3.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 mx-auto"
                >
                  <Save className="w-5 h-5" />
                  <span>حفظ التغييرات النهائية</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* 2. CLINICS AND SCHEDULES SECTION (قسم المواعيد والعيادات) */}
        {activeTab === 'schedules' && (!loggedSecretary || loggedSecretary.permissions?.manageClinics) && (
          <div className="animate-fadeIn max-w-3xl mx-auto py-2">
            {renderProfileQuickBar()}
            {/* MAIN CARD FOR SCHEDULES */}
            <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8">
              
              {/* Header */}
              <div className="text-center space-y-1">
                <h2 className="text-xl sm:text-2xl font-black text-neutral-900">
                  المواعيد والعيادات
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                  إدارة الفروع والعيادات، تحديد أسعار الكشف وجداول أوقات العمل
                </p>
              </div>

              {/* Add Clinic Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleOpenAddClinic}
                  className="px-6 py-3 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer inline-flex items-center justify-center gap-2 active:scale-95"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>إضافة عيادة جديدة</span>
                </button>
              </div>

              {/* CLINICS LIST */}
              {formData.branches.length === 0 ? (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-10 text-center flex flex-col items-center justify-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-neutral-200 text-neutral-400 flex items-center justify-center">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-1">لا توجد عيادات مضافة حتى الآن</h3>
                    <p className="text-neutral-500 text-xs sm:text-sm max-w-md">
                      قم بإضافة عيادتك الأولى وتحديد مواعيد استقبال المرضى والعنوان ورقم التليفون لتبدأ بحجز المواعيد.
                    </p>
                  </div>

                </div>
              ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.branches.map((branch, index) => (
                  <div 
                    key={branch.id} 
                    className="bg-white border border-neutral-200/90 hover:border-neutral-300 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col justify-between transition-all"
                  >
                    <div className="space-y-4 text-right">
                      {/* Card Header */}
                      <div className="flex items-start justify-between gap-3 border-b border-neutral-100 pb-3">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-neutral-900">{branch.name}</h3>
                          {branch.price && (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                              <DollarSign className="w-3 h-3" />
                              <span>سعر الكشف: {branch.price} جنيه</span>
                            </span>
                          )}
                        </div>

                        {/* Card Actions */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditClinic(branch)}
                            className="p-2 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-xl border border-neutral-200 transition-all cursor-pointer"
                            title="تعديل العيادة والمواعيد"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClinic(branch.id)}
                            className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 transition-all cursor-pointer"
                            title="حذف العيادة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Address & Phone */}
                      <div className="space-y-2 text-xs sm:text-sm">
                        {branch.address && (
                          <div className="flex items-start gap-2 text-neutral-700">
                            <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                            <span>{branch.address}</span>
                          </div>
                        )}
                        {branch.phone && (
                          <div className="flex items-center gap-2 text-neutral-700" dir="ltr">
                            <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                            <span className="text-right">{branch.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Working Hours Summary */}
                      {branch.workingHours && (
                        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200/80 text-xs text-neutral-800 flex items-start gap-2">
                          <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-neutral-900 block mb-0.5">مواعيد الحضور:</span>
                            <span>{branch.workingHours}</span>
                          </div>
                        </div>
                      )}

                      {/* Detailed Weekly Schedule Badge List */}
                      {branch.workingHoursList && branch.workingHoursList.length > 0 && (
                        <div className="pt-1">
                          <span className="text-xs font-bold text-neutral-700 block mb-2">جدول الأيام والأوقات:</span>
                          <div className="grid grid-cols-1 gap-2 text-xs">
                            {branch.workingHoursList.map((wh) => (
                              <div 
                                key={wh.day}
                                className={`p-2 rounded-xl border flex items-center justify-between ${
                                  wh.isAvailable 
                                    ? 'bg-emerald-50/60 border-emerald-200 text-emerald-900' 
                                    : 'bg-neutral-100 border-neutral-200 text-neutral-400'
                                }`}
                              >
                                <span className="font-bold">{wh.day}</span>
                                {wh.isAvailable ? (
                                  <span className="font-semibold">{wh.start} - {wh.end}</span>
                                ) : (
                                  <span className="text-[10px] font-bold text-red-600">مغلق</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    </div>

                    <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
                      <span>عيادة متاحة بالبروفايل</span>
                      <button
                        type="button"
                        onClick={() => handleOpenEditClinic(branch)}
                        className="text-neutral-900 font-bold hover:underline cursor-pointer"
                      >
                        تعديل التفاصيل والمواعيد
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

            {/* Bottom Global Save */}
            <div className="pt-4 border-t border-neutral-100 text-center">
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="px-10 py-3.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white font-bold text-sm sm:text-base rounded-xl inline-flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer active:scale-95 mx-auto"
              >
                <Save className="w-5 h-5" />
                <span>حفظ التغييرات النهائية</span>
              </button>
            </div>

            </div>

          </div>
        )}

        {/* 3. CONTACT AND SOCIAL LINKS SECTION (قسم التواصل والروابط) */}
        {activeTab === 'contact' && (!loggedSecretary || !!loggedSecretary.permissions?.sendWhatsapp) && (
          <div className="space-y-6 animate-fadeIn">
            {renderProfileQuickBar()}
            {/* SOCIAL LINKS CARD (مطابق تماماً للتصميم الهادئ المطلوب) */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              
              {/* Header with Title & Subtitle */}
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  اضافة روابط التواصل الاجتماعي
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  يمكنك اضافة روابط التواصل الاجتماعي الخاصة بك
                </p>
              </div>

              {/* Minimalist Calm Inputs matching the user image */}
              <div className="space-y-3.5 pt-2">
                {/* Facebook */}
                <div>
                  <input
                    type="text"
                    value={formData.socials?.facebook || ''}
                    onChange={(e) => handleSocialChange('facebook', e.target.value)}
                    placeholder="فيسبوك"
                    className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50/40 hover:bg-neutral-50/80 focus:bg-white border border-neutral-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 transition-all text-right"
                  />
                </div>

                {/* Instagram */}
                <div>
                  <input
                    type="text"
                    value={formData.socials?.instagram || ''}
                    onChange={(e) => handleSocialChange('instagram', e.target.value)}
                    placeholder="انستجرام"
                    className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50/40 hover:bg-neutral-50/80 focus:bg-white border border-neutral-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 transition-all text-right"
                  />
                </div>

                {/* Twitter */}
                <div>
                  <input
                    type="text"
                    value={formData.socials?.twitter || ''}
                    onChange={(e) => handleSocialChange('twitter', e.target.value)}
                    placeholder="تويتر"
                    className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50/40 hover:bg-neutral-50/80 focus:bg-white border border-neutral-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 transition-all text-right"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <input
                    type="text"
                    value={formData.socials?.linkedin || ''}
                    onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                    placeholder="لينكدان"
                    className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50/40 hover:bg-neutral-50/80 focus:bg-white border border-neutral-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 transition-all text-right"
                  />
                </div>

                {/* TikTok */}
                <div>
                  <input
                    type="text"
                    value={formData.socials?.tiktok || ''}
                    onChange={(e) => handleSocialChange('tiktok', e.target.value)}
                    placeholder="تيك توك"
                    className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50/40 hover:bg-neutral-50/80 focus:bg-white border border-neutral-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 transition-all text-right"
                  />
                </div>

                {/* YouTube */}
                <div>
                  <input
                    type="text"
                    value={formData.socials?.youtube || ''}
                    onChange={(e) => handleSocialChange('youtube', e.target.value)}
                    placeholder="يوتيوب"
                    className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50/40 hover:bg-neutral-50/80 focus:bg-white border border-neutral-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 transition-all text-right"
                  />
                </div>

                {/* Snapchat */}
                <div>
                  <input
                    type="text"
                    value={formData.socials?.snapchat || ''}
                    onChange={(e) => handleSocialChange('snapchat', e.target.value)}
                    placeholder="سناب شات"
                    className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50/40 hover:bg-neutral-50/80 focus:bg-white border border-neutral-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 transition-all text-right"
                  />
                </div>

                {/* Telegram */}
                <div>
                  <input
                    type="text"
                    value={formData.socials?.telegram || ''}
                    onChange={(e) => handleSocialChange('telegram', e.target.value)}
                    placeholder="تيليجرام"
                    className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50/40 hover:bg-neutral-50/80 focus:bg-white border border-neutral-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 transition-all text-right"
                  />
                </div>
              </div>

              {/* Bottom Footer Bar with Save Button (مطابق للصورة) */}
              <div className="bg-neutral-50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 sm:p-5 rounded-b-3xl flex items-center justify-end border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ</span>
                </button>
              </div>

            </div>

            {/* DIRECT PHONE & WHATSAPP CARD (بنفس النمط الهادئ والبسيط) */}
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900">
                  أرقام الاتصال المباشر والواتساب
                </h2>
                <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                  تعديل رقم الهاتف المباشر ورقم الواتساب لاستقبال اتصالات وحجوزات المرضى
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2">رقم الهاتف للاتصال</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="رقم الهاتف"
                    className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50/40 hover:bg-neutral-50/80 focus:bg-white border border-neutral-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 transition-all text-right"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-2">رقم الواتساب</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="رقم الواتساب (مثال: 201012345678)"
                    className="w-full px-4 py-3 sm:py-3.5 bg-neutral-50/40 hover:bg-neutral-50/80 focus:bg-white border border-neutral-200 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 transition-all text-right"
                  />
                </div>
              </div>

              <div className="bg-neutral-50 -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 p-4 sm:p-5 rounded-b-3xl flex items-center justify-end border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => handleSubmit()}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ</span>
                </button>
              </div>
            </div>



          </div>
        )}

          </main>

      {/* MODAL: ADD / EDIT CLINIC & WORKING HOURS */}
      {isClinicModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-neutral-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6 dir-rtl text-right">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-black text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-black">
                    {editingBranchId ? 'تعديل بيانات العيادة والمواعيد' : 'إضافة عيادة جديدة ومواعيدها'}
                  </h3>
                  <p className="text-xs text-neutral-500">أدخل تفاصيل ومواعيد العيادة بدقة</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsClinicModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-black bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveClinic} className="space-y-6">
              
              {/* SECTION A: CLINIC BASIC INFO */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-[#009bb9] flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span>البيانات الأساسية للعيادة</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Clinic Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-800">
                      اسم العيادة / الفرع <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      placeholder="مثال: عيادة المهندسين أو الفرع الرئيسي"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-800">
                      رقم تليفون الحجز بالعيادة
                    </label>
                    <input
                      type="tel"
                      value={clinicPhone}
                      onChange={(e) => setClinicPhone(e.target.value)}
                      placeholder="01012345678"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-800">
                      العنوان التفصيلي للعيادة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clinicAddress}
                      onChange={(e) => setClinicAddress(e.target.value)}
                      placeholder="مثال: 45 شارع مصدق - أمام بنك مصر - الدور الثالث"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Detection Price */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-800">
                      سعر الكشف (اختياري)
                    </label>
                    <input
                      type="text"
                      value={clinicPrice}
                      onChange={(e) => setClinicPrice(e.target.value)}
                      placeholder="مثال: 300 جنيه"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                  {/* Summary Text for Hours */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-800">
                      ملخص المواعيد بكلمات بسيطة
                    </label>
                    <input
                      type="text"
                      value={clinicSummaryHours}
                      onChange={(e) => setClinicSummaryHours(e.target.value)}
                      placeholder="مثال: السبت والأربعاء من 4 عصراً إلى 9 مساءً"
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-black"
                    />
                  </div>

                </div>
              </div>

              {/* SECTION: GOOGLE MAPS LOCATION URL */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <h4 className="text-sm font-bold text-[#009bb9] flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  <span>رابط موقع العيادة على خرائط Google Maps</span>
                </h4>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-800">
                    رابط الخريطة (Google Maps Link) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    <input
                      type="url"
                      required
                      value={clinicMapUrl}
                      onChange={(e) => {
                        setClinicMapUrl(e.target.value);
                        if (clinicError) setClinicError(null);
                      }}
                      dir="ltr"
                      placeholder="https://maps.google.com/?q=loc:30.0444,31.2357"
                      className={`w-full px-3.5 py-2.5 bg-neutral-50 border rounded-xl text-sm font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black text-left ${
                        clinicError ? 'border-red-500 bg-red-50/30' : 'border-neutral-200'
                      }`}
                    />

                    {clinicMapUrl && (
                      <a
                        href={clinicMapUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>تجربة اللوكيشن</span>
                      </a>
                    )}
                  </div>
                  {clinicError && (
                    <p className="text-xs font-bold text-red-600 mt-1.5 flex items-center gap-1 animate-fadeIn">
                      <span>⚠️</span>
                      <span>{clinicError}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* SECTION B: WEEKLY SCHEDULE MANAGER */}
              <div className="space-y-4 pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#009bb9] flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>جدول مواعيد الأيام والساعات تفصيلياً</span>
                  </h4>
                  <span className="text-[11px] text-neutral-500">حدد أيام عمل العيادة وساعاتها</span>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {clinicSchedule.map((item, index) => (
                    <div 
                      key={item.day}
                      className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                        item.isAvailable 
                          ? 'bg-white border-neutral-200 shadow-sm' 
                          : 'bg-neutral-50 border-neutral-200 opacity-60'
                      }`}
                    >
                      {/* Day Name & Toggle */}
                      <label className="flex items-center gap-2.5 cursor-pointer shrink-0">
                        <input 
                          type="checkbox"
                          checked={item.isAvailable}
                          onChange={() => handleDayToggle(index)}
                          className="w-4 h-4 rounded text-black focus:ring-black accent-black cursor-pointer"
                        />
                        <span className={`text-xs font-bold ${item.isAvailable ? 'text-black' : 'text-neutral-400 line-through'}`}>
                          {item.day}
                        </span>
                      </label>

                      {/* Time Controls */}
                      {item.isAvailable ? (
                        <div className="flex items-center gap-2 w-full sm:w-auto text-xs">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-neutral-500">من:</span>
                            <input 
                              type="text"
                              value={item.start}
                              onChange={(e) => handleDayTimeChange(index, 'start', e.target.value)}
                              placeholder="04:00 مساءً"
                              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-semibold text-xs w-28 text-center focus:outline-none focus:border-black"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-neutral-500">إلى:</span>
                            <input 
                              type="text"
                              value={item.end}
                              onChange={(e) => handleDayTimeChange(index, 'end', e.target.value)}
                              placeholder="09:00 مساءً"
                              className="px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-900 font-semibold text-xs w-28 text-center focus:outline-none focus:border-black"
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
                          مغلق / إجازة
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsClinicModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs sm:text-sm rounded-xl border border-neutral-200 transition-all cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ العيادة والمواعيد</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SECRETARY */}
      {isSecretaryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-neutral-200 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl relative dir-rtl text-right">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-neutral-900 text-white flex items-center justify-center font-bold">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-neutral-900">
                    {editingSecretaryId ? 'تعديل بيانات ورخص السكرتيرة' : 'إضافة سكرتيرة جديدة'}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    أدخل بيانات السكرتيرة وحدد الصلاحيات المتاحة لها في اللوحة
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsSecretaryModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveSecretary} className="space-y-6">
              
              {/* Personal Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    الاسم الكامل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={secName}
                    onChange={(e) => setSecName(e.target.value)}
                    placeholder="مثال: سارة أحمد محمود"
                    className="w-full px-4 py-2.5 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all"
                  />
                </div>

                {/* Mobile Phone */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    رقم الموبايل / الواتساب <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={secPhone}
                    onChange={(e) => setSecPhone(e.target.value)}
                    placeholder="مثال: 01012345678"
                    className="w-full px-4 py-2.5 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all dir-ltr text-right"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    type="email"
                    value={secEmail}
                    onChange={(e) => setSecEmail(e.target.value)}
                    placeholder="sec@clinic.com"
                    className="w-full px-4 py-2.5 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all dir-ltr text-right"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    كلمة المرور للدخول
                  </label>
                  <input
                    type="text"
                    value={secPassword}
                    onChange={(e) => setSecPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-400 transition-all"
                  />
                </div>

                {/* Branch Assignment */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    الفرع المسؤول عنه
                  </label>
                  <select
                    value={secBranchId}
                    onChange={(e) => setSecBranchId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-neutral-50/50 hover:bg-neutral-50 focus:bg-white border border-neutral-200 rounded-xl text-xs sm:text-sm font-medium text-neutral-900 focus:outline-none focus:border-neutral-400 transition-all"
                  >
                    <option value="all">جميع الفروع والعيادات</option>
                    {formData.branches.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1.5">
                    حالة حساب السكرتيرة
                  </label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <input
                        type="radio"
                        name="secStatus"
                        checked={secStatus === 'active'}
                        onChange={() => setSecStatus('active')}
                        className="accent-emerald-600"
                      />
                      <span>نشطة (مسموح بالدخول)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-red-800 bg-red-50 px-3 py-1.5 rounded-xl border border-red-200">
                      <input
                        type="radio"
                        name="secStatus"
                        checked={secStatus === 'inactive'}
                        onChange={() => setSecStatus('inactive')}
                        className="accent-red-600"
                      />
                      <span>موقوفة مؤقتاً</span>
                    </label>
                  </div>
                </div>

              </div>

              {/* Permissions Section */}
              <div className="space-y-3 pt-4 border-t border-neutral-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-neutral-600" />
                    <span>تحديد صلاحيات السكرتيرة:</span>
                  </label>
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <button
                      type="button"
                      onClick={() => setSecPermissions({
                        viewAppointments: true,
                        confirmAppointments: true,
                        rejectAppointments: true,
                        sendWhatsapp: true,
                        editAppointments: true,
                        manageConsultations: true,
                        managePatients: true,
                        manageClinics: true,
                        manageServices: true,
                        manageGallery: true,
                        manageVideos: true,
                        manageCertificates: true,
                      })}
                      className="text-neutral-700 hover:text-black hover:underline cursor-pointer"
                    >
                      تحديد الكل
                    </button>
                    <span className="text-neutral-300">•</span>
                    <button
                      type="button"
                      onClick={() => setSecPermissions({
                        viewAppointments: false,
                        confirmAppointments: false,
                        rejectAppointments: false,
                        sendWhatsapp: false,
                        editAppointments: false,
                        manageConsultations: false,
                        managePatients: false,
                        manageClinics: false,
                        manageServices: false,
                        manageGallery: false,
                        manageVideos: false,
                        manageCertificates: false,
                      })}
                      className="text-neutral-500 hover:text-neutral-800 hover:underline cursor-pointer"
                    >
                      إلغاء الكل
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-neutral-50/70 p-4 rounded-2xl border border-neutral-200">
                  {[
                    { key: 'viewAppointments', label: 'طلبات الحجز', icon: '📅' },
                    { key: 'manageConsultations', label: 'إدارة الكشوفات', icon: '🩺' },
                    { key: 'manageClinics', label: 'المواعيد والعيادات', icon: '🏥' },
                    { key: 'sendWhatsapp', label: 'التواصل والروابط', icon: '💬' },
                    { key: 'manageServices', label: 'الخدمات الطبية', icon: '✨' },
                    { key: 'manageGallery', label: 'معرض الصور', icon: '🖼️' },
                    { key: 'manageVideos', label: 'مكتبة الفيديوهات', icon: '🎥' },
                    { key: 'manageCertificates', label: 'الشهادات والاعتمادات', icon: '📜' },
                    { key: 'managePatients', label: 'آراء وتقييمات المرضى', icon: '⭐' },
                  ].map((perm) => {
                    const permKey = perm.key as keyof SecretaryPermissions;
                    const isChecked = !!secPermissions[permKey];

                    return (
                      <label
                        key={perm.key}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-white border-neutral-300 text-neutral-900 shadow-xs font-bold'
                            : 'bg-white/60 border-neutral-200 text-neutral-500 hover:text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span>{perm.icon}</span>
                          <span className="text-xs">{perm.label}</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const val = e.target.checked;
                            setSecPermissions(prev => {
                              const updated = { ...prev, [permKey]: val };
                              if (permKey === 'viewAppointments') {
                                updated.confirmAppointments = val;
                                updated.rejectAppointments = val;
                                updated.editAppointments = val;
                              }
                              return updated;
                            });
                          }}
                          className="w-4 h-4 accent-neutral-900 rounded cursor-pointer"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setIsSecretaryModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs sm:text-sm rounded-xl border border-neutral-200 transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ بيانات السكرتيرة</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Invoice Modal for View / Download */}
      <InvoiceModal
        invoice={selectedInvoice}
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedInvoice(null);
        }}
      />


      {/* Notifications Drawer/Modal */}
      {isNotificationsOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div 
            className="fixed inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsNotificationsOpen(false)}
          />
          <div className="relative w-full sm:w-[400px] h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-left">
            <div className="p-4 sm:p-5 border-b border-neutral-100 flex items-center justify-between bg-neutral-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#10244A]/10 flex items-center justify-center text-[#10244A]">
                  <Bell className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-900">مركز الإشعارات</h3>
                  <p className="text-[10px] text-neutral-500 font-bold mt-0.5">آخر التحديثات والإعلانات الهامة</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setIsNotificationsOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {doctorInvoicesList.length === 0 && activeBanners.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-3 text-neutral-400">
                  <Bell className="w-12 h-12 opacity-20" />
                  <p className="text-sm font-bold">لا توجد إشعارات جديدة</p>
                </div>
              ) : (
                <>
                  {/* Doctor Invoices Notifications */}
                  {doctorInvoicesList.map((inv) => {
                    const invId = inv.id || inv.invoiceNumber;
                    const isUnread = !readInvoiceIds.includes(invId);
                    const invTitle = inv.planDuration || inv.notes || 'فاتورة رسمية جديدة';

                    return (
                      <div 
                        key={`inv-notif-${invId}`}
                        onClick={() => {
                          if (isUnread) {
                            setReadInvoiceIds(prev => {
                              const next = [...prev, invId];
                              try { localStorage.setItem('read_invoice_ids', JSON.stringify(next)); } catch (e) {}
                              return next;
                            });
                          }
                          setActiveTab('subscription');
                          setSelectedInvoice(inv);
                          setIsInvoiceModalOpen(true);
                          setIsNotificationsOpen(false);
                        }}
                        className={`relative p-4 rounded-2xl border transition-all cursor-pointer text-right hover:scale-[1.01] active:scale-[0.99] ${
                          isUnread 
                            ? 'bg-blue-50/90 border-blue-200 shadow-2xs hover:bg-blue-100/80' 
                            : 'bg-neutral-50 border-neutral-200/80 opacity-75 hover:opacity-100'
                        }`}
                      >
                        {isUnread && (
                          <div className="absolute top-3 left-3 w-2.5 h-2.5 rounded-full bg-blue-600 shadow-xs animate-ping" />
                        )}
                        
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#0051A8] text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          
                          <div className="space-y-1 flex-1 pr-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="font-black text-xs text-neutral-900 leading-snug">
                                فاتورة جديدة: {invTitle}
                              </h4>
                              <span className="text-[9px] text-neutral-400 font-bold whitespace-nowrap shrink-0">
                                {inv.date || (inv.createdAt ? new Date(inv.createdAt).toLocaleDateString('ar-EG') : '')}
                              </span>
                            </div>
                            
                            <p className="text-[11px] text-neutral-600 font-semibold leading-relaxed">
                              تم إصدار فاتورة برقم <span className="font-mono font-bold text-neutral-900">{inv.invoiceNumber}</span> بمبلغ <span className="font-black text-emerald-700">{inv.amount} {inv.currency || 'ج.م'}</span>. انقر هنا للمعاينة والتنزيل.
                            </p>

                            <div className="pt-1 flex items-center gap-1.5 text-[10px] font-black text-[#0051A8]">
                              <span>عرض الفاتورة بالتفاصيل</span>
                              <span>←</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Admin Banner Notifications */}
                  {activeBanners.map(banner => {
                    const isUnread = !dismissedBannerIds.includes(banner.id);
                    const icon = banner.icon === 'crown' ? '👑' : banner.icon === 'gift' ? '🎁' : banner.icon === 'bell' ? '🔔' : banner.icon === 'alert' ? '⚠️' : banner.icon === 'star' ? '⭐' : '✨';
                    
                    return (
                      <div 
                        key={banner.id}
                        className={`relative p-4 rounded-2xl border transition-all text-right ${isUnread ? 'bg-[#10244A]/5 border-[#10244A]/20 shadow-sm' : 'bg-neutral-50 border-neutral-100 opacity-70'}`}
                      >
                        {isUnread && (
                          <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                        )}
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-xl shrink-0 shadow-sm">
                            {banner.imageUrl ? (
                              <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover rounded-xl" />
                            ) : (
                              <span>{icon}</span>
                            )}
                          </div>
                          <div className="space-y-1 pr-1 flex-1">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-extrabold text-xs text-neutral-900 leading-tight">{banner.title}</h4>
                              {(banner.sentDate || banner.createdAt) && (
                                <span className="text-[9px] text-neutral-400 font-bold whitespace-nowrap shrink-0 mt-0.5">
                                  {new Date(banner.sentDate || banner.createdAt!).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </div>
                            {banner.description && (
                              <p className="text-[10px] sm:text-xs text-neutral-600 font-semibold leading-relaxed mt-1">
                                {banner.description}
                              </p>
                            )}
                            {banner.buttonText && banner.buttonUrl && (
                              <div className="mt-3 inline-block">
                                <a
                                  href={banner.buttonUrl.startsWith('#') ? undefined : banner.buttonUrl}
                                  target={banner.buttonUrl.startsWith('http') ? '_blank' : undefined}
                                  rel="noopener noreferrer"
                                  onClick={(e) => {
                                    if (banner.buttonUrl?.startsWith('#')) {
                                      e.preventDefault();
                                      const tab = banner.buttonUrl.substring(1) as any;
                                      setActiveTab(tab);
                                      setIsNotificationsOpen(false);
                                    }
                                  }}
                                  className="inline-block px-4 py-2 bg-[#10244A] text-white text-[10px] font-extrabold rounded-xl hover:bg-[#0B2545] transition-colors"
                                >
                                  {banner.buttonText}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {isUnread && (
                          <button
                            type="button"
                            onClick={() => {
                              const newDismissed = [...dismissedBannerIds, banner.id];
                              setDismissedBannerIds(newDismissed);
                              try {
                                localStorage.setItem('dismissed_banners', JSON.stringify(newDismissed));
                              } catch (e) {}
                            }}
                            className="mt-3 w-full py-1.5 text-center text-[10px] font-bold text-neutral-500 hover:text-neutral-900 border-t border-neutral-200 transition-colors cursor-pointer"
                          >
                            تحديد كمقروء
                          </button>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CONSULTATION / FOLLOWUP MODAL */}
      {isConsultationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 text-right max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl border ${
                  consultationModalType === 'consultation' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                  consultationModalType === 'followup' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                  consultationModalType === 'emergency' ? 'bg-red-50 border-red-200 text-red-700' :
                  'bg-purple-50 border-purple-200 text-purple-700'
                }`}>
                  {consultationModalType === 'consultation' ? <Stethoscope className="w-6 h-6" /> :
                   consultationModalType === 'followup' ? <Activity className="w-6 h-6" /> :
                   consultationModalType === 'emergency' ? <AlertCircle className="w-6 h-6" /> :
                   <MessageSquare className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-black text-neutral-900">
                    {consultationModalType === 'consultation' ? 'تسجيل كشف جديد' :
                     consultationModalType === 'followup' ? 'تسجيل متابعة جديدة' :
                     consultationModalType === 'emergency' ? 'تسجيل حالة طوارئ' :
                     'تسجيل استشارة جديدة'}
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    إدخال بيانات الحالة والتشخيص والروشتة والرسوم
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsConsultationModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveConsultationSubmit} className="space-y-5">
              
              {/* Consultation Type Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-800 block">نوع الكشف / الخدمة:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setConsultationModalType('consultation');
                      setConsultationFeeInput('300');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      consultationModalType === 'consultation'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <Stethoscope className="w-4 h-4" />
                    <span>كشف</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConsultationModalType('followup');
                      setConsultationFeeInput('100');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      consultationModalType === 'followup'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    <span>متابعة</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConsultationModalType('emergency');
                      setConsultationFeeInput('500');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      consultationModalType === 'emergency'
                        ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>طوارئ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setConsultationModalType('advisory');
                      setConsultationFeeInput('200');
                    }}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      consultationModalType === 'advisory'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>استشارة</span>
                  </button>
                </div>
              </div>

              {/* Select Patient Option */}
              <div className="space-y-1.5">
                <label className="text-xs font-black text-neutral-800 block">اختيار المريض:</label>
                <select
                  value={selectedPatientForConsultation}
                  onChange={(e) => handlePatientSelectChange(e.target.value)}
                  className="w-full px-4 py-3 bg-neutral-50 border border-neutral-300 rounded-xl text-sm font-bold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                >
                  <option value="new">➕ إضافة مريض جديد</option>
                  {patientRecords.map(p => (
                    <option key={p.id} value={p.id}>
                      👤 {p.patientName} - {p.patientPhone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Personal Data Fields */}
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-4">
                <h4 className="text-xs font-black text-neutral-700 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#009bb9]" />
                  <span>بيانات بروفايل المريض:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">الاسم بالكامل *</label>
                    <input
                      type="text"
                      required
                      value={patientNameInput}
                      onChange={(e) => setPatientNameInput(e.target.value)}
                      placeholder="اسم المريض"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">رقم الهاتف *</label>
                    <input
                      type="tel"
                      required
                      value={patientPhoneInput}
                      onChange={(e) => setPatientPhoneInput(e.target.value)}
                      placeholder="رقم الموبايل"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">العمر</label>
                    <input
                      type="text"
                      value={patientAgeInput}
                      onChange={(e) => setPatientAgeInput(e.target.value)}
                      placeholder="مثال: 35"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">النوع</label>
                    <select
                      value={patientGenderInput}
                      onChange={(e) => setPatientGenderInput(e.target.value as 'ذكر' | 'أنثى')}
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                    >
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">ملاحظات بروفايل المريض (الحساسية والأمراض المزمنة)</label>
                  <input
                    type="text"
                    value={patientGeneralNotesInput}
                    onChange={(e) => setPatientGeneralNotesInput(e.target.value)}
                    placeholder="ملاحظات عامة ثابتة في بروفايل المريض..."
                    className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                  />
                </div>
              </div>

              {/* Consultation / Followup Fields */}
              <div className="p-4 bg-cyan-50/40 border border-cyan-100 rounded-2xl space-y-4">
                <h4 className="text-xs font-black text-cyan-900 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#009bb9]" />
                  <span>تفاصيل {consultationModalType === 'consultation' ? 'الكشف الطبي' : 'المتابعة'}:</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">التاريخ</label>
                    <input
                      type="date"
                      value={consultationDateInput}
                      onChange={(e) => setConsultationDateInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">الوقت</label>
                    <input
                      type="text"
                      value={consultationTimeInput}
                      onChange={(e) => setConsultationTimeInput(e.target.value)}
                      placeholder="06:00 م"
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">الرسوم (ج.م)</label>
                    <input
                      type="text"
                      value={consultationFeeInput}
                      onChange={(e) => setConsultationFeeInput(e.target.value)}
                      placeholder="300"
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsConsultationModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className={`px-8 py-2.5 text-white font-black text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                    consultationModalType === 'consultation' ? 'bg-[#009bb9] hover:bg-[#00829d]' : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Save className="w-4 h-4" />
                  <span>{consultationModalType === 'consultation' ? 'حفظ الكشف' : 'حفظ المتابعة'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* EDIT PATIENT PROFILE MODAL */}
      {isEditPatientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 text-right">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-neutral-900">تعديل بيانات بروفايل المريض</h3>
                  <p className="text-xs text-neutral-500 font-medium">تحديث بيانات اسم ورقم المريض والملاحظات</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditPatientModalOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveEditPatientSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">الاسم بالكامل *</label>
                <input
                  type="text"
                  required
                  value={editPatientNameInput}
                  onChange={(e) => setEditPatientNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">رقم الهاتف *</label>
                <input
                  type="tel"
                  required
                  value={editPatientPhoneInput}
                  onChange={(e) => setEditPatientPhoneInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                  dir="ltr"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">العمر</label>
                  <input
                    type="text"
                    value={editPatientAgeInput}
                    onChange={(e) => setEditPatientAgeInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">النوع</label>
                  <select
                    value={editPatientGenderInput}
                    onChange={(e) => setEditPatientGenderInput(e.target.value as 'ذكر' | 'أنثى')}
                    className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                  >
                    <option value="ذكر">ذكر</option>
                    <option value="أنثى">أنثى</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">ملاحظات بروفايل المريض العامة</label>
                <textarea
                  rows={3}
                  value={editPatientNotesInput}
                  onChange={(e) => setEditPatientNotesInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl text-xs font-semibold text-neutral-900 focus:outline-none focus:border-[#009bb9]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditPatientModalOpen(false)}
                  className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#009bb9] hover:bg-[#00829d] text-white font-black text-xs rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  <span>حفظ التعديلات</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* DELETE PATIENT CONFIRMATION MODAL */}
      {patientToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-2xl max-w-md w-full p-6 space-y-5 text-right">
            <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">
              <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-neutral-900">تأكيد حذف ملف المريض</h3>
                <p className="text-xs text-neutral-500 font-medium">سيتم مسح سجل المريض وكشوفاته نهائياً</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-neutral-700 font-bold leading-relaxed">
              هل أنت متأكد من رغبتك في حذف ملف المريض <span className="text-red-600 font-black">"{patientToDelete.name}"</span>؟
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPatientToDelete(null)}
                className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmDeletePatient}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>نعم، حذف نهائياً</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
