/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { subscribeDoctorById } from '../lib/firebase';
import { Doctor, Appointment, Review, DoctorFeatures, DEFAULT_DOCTOR_FEATURES, DoctorCertificate, Branch, Service, getThemeTextColor, getThemeTemplate } from '../types';
import { DoctorCardExport } from './DoctorCardExport';
import { 
  profileTranslations, 
  translateMedicalJobTitle,
  translateBranchName,
  translateClinicAddress,
  translateDayName,
  translateTimeSlot
} from './profileTranslations';
import { 
  Stethoscope, Calendar, MapPin, Clock, Phone, MessageSquare, Mail, Building2, ShieldCheck, HeartPulse,
  Star, Image, ChevronLeft, ChevronRight, ArrowRight, ArrowLeft, ExternalLink, CheckCircle, Award,
  Share2, Download, Facebook, Instagram, Linkedin, Twitter, Youtube, Check, Globe,
  Eye, X, Target, Heart, RefreshCw, Activity, Sparkles, Menu, Video, Play, Film, ChevronDown, User
} from 'lucide-react';

const getTwoWordName = (fullName: string) => {
  if (!fullName) return 'دكتور';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 2) return fullName;
  if (['د.', 'دكتور', 'دكتورة', 'أ.د', 'أ.د.', 'استشاري', 'استشارية', 'د'].includes(parts[0])) {
    return parts.slice(0, 3).join(' ');
  }
  return parts.slice(0, 2).join(' ');
};

const TikTokIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.87 2.89 2.89 0 0 1-2.89-2.87 2.89 2.89 0 0 1 2.89-2.88c.28 0 .55.04.81.12v-3.5a6.37 6.37 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.7a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.05a8.27 8.27 0 0 0 4.76 1.5v-3.4a4.84 4.84 0 0 1-1-.46z"/>
  </svg>
);

const TelegramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.35-.01-1.02-.2-1.52-.37-.62-.2-1.11-.31-1.07-.65.02-.18.27-.36.75-.55 2.94-1.28 4.9-2.12 5.88-2.53 2.8-1.16 3.38-1.36 3.76-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
  </svg>
);

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    width="24" 
    height="24" 
    fill="currentColor" 
    className={className}
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.99c-.002 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c-.001 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

function ThemePatternWatermark({ 
  patternType, 
  primaryColor 
}: { 
  patternType?: 'blue_medical' | 'cyan_calm' | 'green_health' | 'purple_tech' | 'pink_care' | 'black_clinical' | 'navy_royal' | 'amber_warm' | 'teal_deep' | 'lavender_prestige' | string;
  primaryColor: string;
}) {
  if (!patternType) return null;

  // 1. Blue Medical (الأزرق الطبي): Stethoscope, ECG pulse, Heart, Capsules & Medical Tools
  if (patternType === 'blue_medical' || patternType === 'medical') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none opacity-[0.9]">
        {/* Top-Right: Stethoscope + ECG Sinus Wave + Medical Capsule */}
        <svg className="absolute top-4 -right-8 w-[420px] h-[420px]" viewBox="0 0 350 350" fill="none" stroke="#2563EB" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.07">
          <path d="M 230 40 C 230 25, 260 25, 260 40 L 260 90 C 260 120, 200 120, 200 90 L 200 40 C 200 25, 230 25, 230 40" />
          <circle cx="200" cy="38" r="4" fill="none" />
          <circle cx="260" cy="38" r="4" fill="none" />
          <path d="M 230 110 L 230 150 C 230 210, 310 210, 310 150 C 310 100, 250 140, 250 200 L 250 230" />
          <circle cx="250" cy="245" r="16" />
          <circle cx="250" cy="245" r="8" strokeDasharray="3 3" />
          <path d="M 20 180 L 60 180 L 75 180 L 85 160 L 95 205 L 108 125 L 122 220 L 135 170 L 148 190 L 158 180 L 220 180" />
          <rect x="50" y="60" width="70" height="28" rx="14" transform="rotate(-30 85 74)" />
          <line x1="85" y1="60" x2="85" y2="88" transform="rotate(-30 85 74)" strokeDasharray="2 2" />
        </svg>

        {/* Top-Left: Cardio Heart + Diagnostic Lines */}
        <svg className="absolute top-32 -left-10 w-[380px] h-[380px]" viewBox="0 0 320 320" fill="none" stroke="#2563EB" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.065">
          <path d="M 160 90 C 130 40, 60 50, 60 110 C 60 165, 160 220, 160 220 C 160 220, 260 165, 260 110 C 260 50, 190 40, 160 90 Z" />
          <path d="M 90 125 L 120 125 L 135 95 L 150 160 L 165 110 L 178 135 L 190 125 L 230 125" />
          <circle cx="90" cy="260" r="18" />
          <line x1="75" y1="250" x2="105" y2="270" strokeDasharray="3 2" />
        </svg>

        {/* Center / Mid-Page Right: Diagnostic Pipette & ECG rhythm */}
        <svg className="absolute top-[40%] -right-12 w-[400px] h-[360px]" viewBox="0 0 350 300" fill="none" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 20 140 L 80 140 L 95 120 L 110 170 L 125 90 L 140 180 L 155 130 L 170 150 L 180 140 L 260 140" />
          <rect x="220" y="50" width="16" height="60" rx="3" transform="rotate(35 228 80)" />
          <line x1="228" y1="40" x2="228" y2="50" transform="rotate(35 228 80)" />
          <line x1="228" y1="110" x2="228" y2="130" transform="rotate(35 228 80)" />
          <circle cx="100" cy="220" r="24" strokeDasharray="4 3" />
        </svg>

        {/* Lower-Page Left: Medical Heart & Wellness Ring */}
        <svg className="absolute top-[65%] -left-8 w-[380px] h-[380px]" viewBox="0 0 320 320" fill="none" stroke="#2563EB" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 160 100 C 130 55, 70 65, 70 120 C 70 170, 160 220, 160 220 C 160 220, 250 170, 250 120 C 250 65, 190 55, 160 100 Z" />
          <circle cx="160" cy="140" r="85" strokeDasharray="5 5" />
          <rect x="80" y="240" width="60" height="24" rx="12" transform="rotate(-20 110 252)" />
        </svg>

        {/* Bottom Page: Smooth wide ECG line */}
        <svg className="absolute bottom-6 right-1/4 w-[480px] h-48" viewBox="0 0 450 160" fill="none" stroke="#2563EB" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.065">
          <path d="M 10 80 L 90 80 L 110 80 L 125 60 L 140 110 L 155 30 L 175 135 L 190 70 L 205 95 L 220 80 L 320 80 L 335 65 L 345 100 L 358 50 L 372 115 L 385 80 L 440 80" />
        </svg>
      </div>
    );
  }

  // 2. Cyan Calm (السماوي الهادئ): Lungs, Stethoscope, ECG pulse, Drops
  if (patternType === 'cyan_calm' || patternType === 'calm') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none opacity-[0.9]">
        {/* Top-Right: Anatomical Lungs + Drops */}
        <svg className="absolute top-4 -right-8 w-[430px] h-[430px]" viewBox="0 0 360 360" fill="none" stroke="#0891B2" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.07">
          <path d="M 180 30 L 180 90 M 174 45 L 186 45 M 174 60 L 186 60 M 174 75 L 186 75" />
          <path d="M 180 90 C 170 105, 145 115, 130 125 M 180 90 C 190 105, 215 115, 230 125" />
          <path d="M 185 100 C 210 95, 260 110, 265 160 C 270 210, 250 250, 225 255 C 200 260, 185 240, 185 210 C 185 170, 180 130, 185 100 Z" />
          <path d="M 175 100 C 150 95, 100 110, 95 160 C 90 210, 110 250, 135 255 C 160 260, 175 240, 175 210 C 175 170, 180 130, 175 100 Z" />
          <path d="M 60 60 C 60 60, 40 90, 40 105 C 40 120, 50 130, 60 130 C 70 130, 80 120, 80 105 C 80 90, 60 60, 60 60 Z" />
        </svg>

        {/* Top-Left: Gentle Stethoscope & Ripples */}
        <svg className="absolute top-28 -left-10 w-[380px] h-[380px]" viewBox="0 0 320 320" fill="none" stroke="#0891B2" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.065">
          <path d="M 10 160 L 50 160 L 65 145 L 80 180 L 95 120 L 110 200 L 125 150 L 138 170 L 150 160 L 220 160" />
          <circle cx="160" cy="160" r="90" strokeDasharray="5 5" />
          <circle cx="160" cy="160" r="50" />
        </svg>

        {/* Middle: Liquid Medical Drops & Flow */}
        <svg className="absolute top-[45%] -right-10 w-[360px] h-[320px]" viewBox="0 0 300 280" fill="none" stroke="#0891B2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 150 40 C 150 40, 120 80, 120 105 C 120 125, 135 140, 150 140 C 165 140, 180 125, 180 105 C 180 80, 150 40, 150 40 Z" />
          <path d="M 30 180 C 80 140, 140 220, 200 180 C 240 150, 270 200, 290 180" />
        </svg>

        {/* Lower Left & Bottom Waves */}
        <svg className="absolute top-[70%] -left-8 w-[400px] h-[300px]" viewBox="0 0 350 250" fill="none" stroke="#0891B2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 0 100 C 70 50, 130 150, 200 100 C 270 50, 310 130, 350 100" />
          <circle cx="100" cy="100" r="40" strokeDasharray="3 3" />
        </svg>
      </div>
    );
  }

  // 3. Green Health (الأخضر الصحي): Heart, Stethoscope, Capsules, Leaves
  if (patternType === 'green_health' || patternType === 'green') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none opacity-[0.9]">
        {/* Top-Right: Medicinal Leaves + Stethoscope */}
        <svg className="absolute top-4 -right-8 w-[430px] h-[430px]" viewBox="0 0 360 360" fill="none" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.07">
          <path d="M 220 80 C 260 60, 310 90, 310 140 C 260 150, 220 130, 220 80 Z" />
          <path d="M 220 80 L 310 140 M 250 95 L 265 110 M 270 115 L 290 125" strokeDasharray="2 2" />
          <path d="M 200 100 C 170 80, 140 110, 150 150 C 190 160, 210 130, 200 100 Z" />
          <path d="M 210 160 C 210 220, 150 240, 150 280 C 150 310, 190 320, 210 300 L 250 260" />
          <circle cx="258" cy="252" r="14" />
          <rect x="60" y="120" width="60" height="24" rx="12" transform="rotate(-40 90 132)" />
        </svg>

        {/* Top-Left: Natural Heart & Thermometer */}
        <svg className="absolute top-32 -left-8 w-[380px] h-[380px]" viewBox="0 0 320 320" fill="none" stroke="#059669" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.065">
          <path d="M 150 80 C 120 40, 60 50, 60 105 C 60 155, 150 205, 150 205 C 150 205, 240 155, 240 105 C 240 50, 180 40, 150 80 Z" />
          <path d="M 230 200 L 230 270 C 230 278, 220 285, 210 285 C 200 285, 190 278, 190 270 L 190 200 C 190 190, 230 190, 230 200 Z" />
          <circle cx="210" cy="272" r="8" />
        </svg>

        {/* Mid & Lower Page Health Contours */}
        <svg className="absolute top-[50%] -right-10 w-[380px] h-[300px]" viewBox="0 0 340 260" fill="none" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <circle cx="120" cy="130" r="70" strokeDasharray="4 4" />
          <rect x="180" y="60" width="55" height="22" rx="11" transform="rotate(30 207 71)" />
        </svg>

        <svg className="absolute top-[75%] -left-8 w-[440px] h-[250px]" viewBox="0 0 400 200" fill="none" stroke="#059669" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 20 100 C 100 40, 160 160, 240 100 C 320 40, 370 140, 400 100" />
        </svg>
      </div>
    );
  }

  // 4. Purple Tech (البنفسجي الطبي): Brain, Cells, DNA, Neurons
  if (patternType === 'purple_tech' || patternType === 'modern') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none opacity-[0.9]">
        {/* Top-Right: Brain Convolutions & Synapses */}
        <svg className="absolute top-4 -right-8 w-[430px] h-[430px]" viewBox="0 0 360 360" fill="none" stroke="#7C3AED" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.07">
          <path d="M 180 60 C 230 50, 290 80, 290 140 C 290 180, 270 200, 270 230 C 270 260, 230 280, 190 275 C 185 275, 180 270, 180 260 C 180 270, 175 275, 170 275 C 130 280, 90 260, 90 230 C 90 200, 70 180, 70 140 C 70 80, 130 50, 180 60 Z" />
          <path d="M 180 60 L 180 260 M 180 90 C 140 100, 110 110, 115 140 M 180 90 C 220 100, 250 110, 245 140" strokeDasharray="3 3" />
          <circle cx="50" cy="80" r="8" />
          <path d="M 50 80 L 80 100 M 50 80 L 30 110 M 50 80 L 20 60" />
        </svg>

        {/* Top-Left: DNA Double Helix */}
        <svg className="absolute top-28 -left-8 w-[380px] h-[380px]" viewBox="0 0 320 320" fill="none" stroke="#7C3AED" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.065">
          <path d="M 80 40 C 120 70, 120 110, 80 140 C 40 170, 40 210, 80 240 C 120 270, 120 310, 80 340" />
          <path d="M 80 40 C 40 70, 40 110, 80 140 C 120 170, 120 210, 80 240 C 40 270, 40 310, 80 340" />
          <line x1="60" y1="70" x2="100" y2="70" />
          <line x1="50" y1="90" x2="110" y2="90" />
          <circle cx="210" cy="110" r="30" />
          <circle cx="210" cy="110" r="10" strokeDasharray="3 3" />
        </svg>

        {/* Middle & Lower Cells */}
        <svg className="absolute top-[50%] -right-8 w-[360px] h-[300px]" viewBox="0 0 320 260" fill="none" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <circle cx="100" cy="100" r="45" />
          <circle cx="100" cy="100" r="18" strokeDasharray="3 2" />
          <path d="M 160 80 L 280 80 L 295 60 L 305 100 L 315 70 L 330 80" />
        </svg>

        <svg className="absolute top-[75%] -left-8 w-[450px] h-[200px]" viewBox="0 0 420 160" fill="none" stroke="#7C3AED" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 10 80 L 100 80 L 115 60 L 125 110 L 138 30 L 150 135 L 165 75 L 175 95 L 185 80 L 350 80" />
        </svg>
      </div>
    );
  }

  // 5. Pink Care (الوردي الطبي): Heart, Cells, Eye, Care Elements
  if (patternType === 'pink_care' || patternType === 'soft') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none opacity-[0.9]">
        {/* Top-Right: Aesthetic Eye + Serum Pipette */}
        <svg className="absolute top-4 -right-8 w-[430px] h-[430px]" viewBox="0 0 360 360" fill="none" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.07">
          <path d="M 160 100 C 200 65, 270 65, 310 100 C 270 135, 200 135, 160 100 Z" />
          <circle cx="235" cy="100" r="20" />
          <circle cx="235" cy="100" r="9" strokeDasharray="2 2" />
          <rect x="230" y="180" width="34" height="60" rx="8" />
          <circle cx="80" cy="80" r="26" />
        </svg>

        {/* Top-Left: Graceful Heart */}
        <svg className="absolute top-28 -left-8 w-[380px] h-[380px]" viewBox="0 0 320 320" fill="none" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.065">
          <path d="M 150 70 C 120 30, 50 40, 50 100 C 50 155, 150 210, 150 210 C 150 210, 250 155, 250 100 C 250 40, 180 30, 150 70 Z" />
          <circle cx="80" cy="250" r="20" />
        </svg>

        {/* Mid & Lower Soft Waves */}
        <svg className="absolute top-[52%] -right-8 w-[360px] h-[280px]" viewBox="0 0 320 240" fill="none" stroke="#DB2777" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <circle cx="160" cy="120" r="60" strokeDasharray="4 4" />
          <path d="M 40 180 C 100 130, 180 230, 260 170" />
        </svg>

        <svg className="absolute top-[75%] -left-8 w-[450px] h-[200px]" viewBox="0 0 420 160" fill="none" stroke="#DB2777" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 10 80 C 80 40, 140 120, 210 80 C 280 40, 340 120, 410 80" />
        </svg>
      </div>
    );
  }

  // 6. Black Clinical (الأسود الوقور): Slate / Black Clinical Matrix, ECG & Stethoscope
  if (patternType === 'black_clinical') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none opacity-[0.9]">
        {/* Top-Right: Diagnostic ECG & Stethoscope in crisp charcoal/slate line art */}
        <svg className="absolute top-4 -right-8 w-[430px] h-[430px]" viewBox="0 0 360 360" fill="none" stroke="#0F172A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.07">
          <path d="M 230 40 C 230 25, 260 25, 260 40 L 260 90 C 260 120, 200 120, 200 90 L 200 40" />
          <path d="M 230 110 L 230 150 C 230 210, 310 210, 310 150 C 310 100, 250 140, 250 200 L 250 230" />
          <circle cx="250" cy="245" r="16" />
          <circle cx="250" cy="245" r="8" strokeDasharray="3 3" />
          <path d="M 20 180 L 60 180 L 75 180 L 85 160 L 95 205 L 108 125 L 122 220 L 135 170 L 148 190 L 158 180 L 220 180" />
        </svg>

        {/* Top-Left: Pure Precision Geometric Diagnostic Circle & Heart */}
        <svg className="absolute top-28 -left-8 w-[380px] h-[380px]" viewBox="0 0 320 320" fill="none" stroke="#0F172A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.065">
          <path d="M 160 90 C 130 40, 60 50, 60 110 C 60 165, 160 220, 160 220 C 160 220, 260 165, 260 110 C 260 50, 190 40, 160 90 Z" />
          <circle cx="160" cy="160" r="95" strokeDasharray="6 4" />
        </svg>

        {/* Mid-Page & Lower Diagnostics */}
        <svg className="absolute top-[50%] -right-8 w-[380px] h-[280px]" viewBox="0 0 340 240" fill="none" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 10 120 L 80 120 L 95 90 L 110 160 L 125 70 L 140 150 L 155 110 L 170 130 L 180 120 L 300 120" />
          <rect x="230" y="40" width="60" height="24" rx="12" transform="rotate(25 260 52)" />
        </svg>

        <svg className="absolute top-[75%] -left-8 w-[450px] h-[200px]" viewBox="0 0 420 160" fill="none" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 10 80 L 90 80 L 110 80 L 125 60 L 140 110 L 155 30 L 175 135 L 190 70 L 205 95 L 220 80 L 400 80" />
        </svg>
      </div>
    );
  }

  // 7. Navy Royal (الكحلي الملكي): Classic Deep Navy clinical badges, Heart & Stethoscope
  if (patternType === 'navy_royal') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none opacity-[0.9]">
        <svg className="absolute top-4 -right-8 w-[430px] h-[430px]" viewBox="0 0 360 360" fill="none" stroke="#10244A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.07">
          <circle cx="180" cy="180" r="120" strokeDasharray="6 6" />
          <circle cx="180" cy="180" r="80" />
          <path d="M 60 180 L 120 180 L 135 150 L 150 210 L 165 130 L 180 220 L 195 170 L 210 190 L 220 180 L 300 180" />
        </svg>

        <svg className="absolute top-28 -left-8 w-[380px] h-[380px]" viewBox="0 0 320 320" fill="none" stroke="#10244A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.065">
          <path d="M 160 90 C 130 40, 60 50, 60 110 C 60 165, 160 220, 160 220 C 160 220, 260 165, 260 110 C 260 50, 190 40, 160 90 Z" />
          <rect x="70" y="240" width="60" height="24" rx="12" />
        </svg>

        <svg className="absolute top-[52%] -right-8 w-[380px] h-[280px]" viewBox="0 0 340 240" fill="none" stroke="#10244A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 10 120 C 80 70, 160 170, 240 120 C 290 90, 320 140, 340 120" />
        </svg>

        <svg className="absolute top-[75%] -left-8 w-[450px] h-[200px]" viewBox="0 0 420 160" fill="none" stroke="#10244A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 10 80 L 100 80 L 115 60 L 125 110 L 138 30 L 150 135 L 165 75 L 175 95 L 185 80 L 400 80" />
        </svg>
      </div>
    );
  }

  // 8. Amber Warm (العنبري الدافئ): Warm Sun, Natural Vitality & Heart
  if (patternType === 'amber_warm') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none opacity-[0.9]">
        <svg className="absolute top-4 -right-8 w-[430px] h-[430px]" viewBox="0 0 360 360" fill="none" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.07">
          <circle cx="180" cy="180" r="70" />
          <circle cx="180" cy="180" r="100" strokeDasharray="4 4" />
          <path d="M 180 50 L 180 70 M 180 290 L 180 310 M 50 180 L 70 180 M 290 180 L 310 180" />
          <path d="M 60 180 L 120 180 L 135 150 L 150 210 L 165 140 L 180 220 L 195 170 L 210 190 L 220 180 L 300 180" />
        </svg>

        <svg className="absolute top-28 -left-8 w-[380px] h-[380px]" viewBox="0 0 320 320" fill="none" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.065">
          <path d="M 150 80 C 120 40, 60 50, 60 105 C 60 155, 150 205, 150 205 C 150 205, 240 155, 240 105 C 240 50, 180 40, 150 80 Z" />
          <rect x="70" y="240" width="55" height="22" rx="11" transform="rotate(-25 97 251)" />
        </svg>

        <svg className="absolute top-[52%] -right-8 w-[360px] h-[280px]" viewBox="0 0 320 240" fill="none" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 20 120 C 80 60, 160 180, 240 120 C 290 80, 310 140, 320 120" />
        </svg>

        <svg className="absolute top-[75%] -left-8 w-[450px] h-[200px]" viewBox="0 0 420 160" fill="none" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 10 80 L 90 80 L 110 80 L 125 60 L 140 110 L 155 30 L 175 135 L 190 70 L 205 95 L 220 80 L 400 80" />
        </svg>
      </div>
    );
  }

  // 9. Teal Deep (البترولي العميق): Balanced Petrol / Teal Clinical Waves & Drops
  if (patternType === 'teal_deep') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none opacity-[0.9]">
        <svg className="absolute top-4 -right-8 w-[430px] h-[430px]" viewBox="0 0 360 360" fill="none" stroke="#0F766E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.07">
          <path d="M 60 180 C 120 120, 180 240, 240 180 C 300 120, 330 200, 360 180" />
          <circle cx="180" cy="180" r="70" strokeDasharray="5 5" />
          <path d="M 180 80 C 180 80, 160 110, 160 125 C 160 135, 170 145, 180 145 C 190 145, 200 135, 200 125 C 200 110, 180 80, 180 80 Z" />
        </svg>

        <svg className="absolute top-28 -left-8 w-[380px] h-[380px]" viewBox="0 0 320 320" fill="none" stroke="#0F766E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.065">
          <path d="M 160 90 C 130 40, 60 50, 60 110 C 60 165, 160 220, 160 220 C 160 220, 260 165, 260 110 C 260 50, 190 40, 160 90 Z" />
          <rect x="70" y="240" width="60" height="24" rx="12" />
        </svg>

        <svg className="absolute top-[52%] -right-8 w-[360px] h-[280px]" viewBox="0 0 320 240" fill="none" stroke="#0F766E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 10 120 L 70 120 L 85 95 L 100 150 L 115 80 L 130 160 L 145 110 L 160 130 L 170 120 L 280 120" />
        </svg>

        <svg className="absolute top-[75%] -left-8 w-[450px] h-[200px]" viewBox="0 0 420 160" fill="none" stroke="#0F766E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 10 80 C 70 40, 130 120, 200 80 C 270 40, 330 120, 400 80" />
        </svg>
      </div>
    );
  }

  // 10. Lavender Prestige (اللافندر الراقي): Delicate Cellular Matrix, Soft Curves & Pulse
  if (patternType === 'lavender_prestige') {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-0 select-none opacity-[0.9]">
        <svg className="absolute top-4 -right-8 w-[430px] h-[430px]" viewBox="0 0 360 360" fill="none" stroke="#9333EA" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.07">
          <circle cx="180" cy="180" r="90" strokeDasharray="5 5" />
          <circle cx="180" cy="180" r="45" />
          <circle cx="100" cy="100" r="25" />
          <circle cx="260" cy="100" r="20" strokeDasharray="3 3" />
        </svg>

        <svg className="absolute top-28 -left-8 w-[380px] h-[380px]" viewBox="0 0 320 320" fill="none" stroke="#9333EA" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.065">
          <path d="M 150 70 C 120 30, 50 40, 50 100 C 50 155, 150 210, 150 210 C 150 210, 250 155, 250 100 C 250 40, 180 30, 150 70 Z" />
          <rect x="70" y="240" width="55" height="22" rx="11" transform="rotate(-20 97 251)" />
        </svg>

        <svg className="absolute top-[52%] -right-8 w-[360px] h-[280px]" viewBox="0 0 320 240" fill="none" stroke="#9333EA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 10 120 L 80 120 L 95 90 L 110 160 L 125 70 L 140 150 L 155 110 L 170 130 L 180 120 L 300 120" />
        </svg>

        <svg className="absolute top-[75%] -left-8 w-[450px] h-[200px]" viewBox="0 0 420 160" fill="none" stroke="#9333EA" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.06">
          <path d="M 10 80 C 80 40, 140 120, 210 80 C 280 40, 340 120, 410 80" />
        </svg>
      </div>
    );
  }

  return null;
}

interface DoctorProfileProps {
  doctorId?: string; // Add optional doctorId
  doctor?: Doctor | null | undefined;
  appointments: Appointment[];
  onAddAppointment: (newApt: Appointment) => void;
  onAddReview: (doctorId: string, newReview: Review) => void;
  onBackToPortal: () => void;
  isEmbeddedPreview?: boolean;
}

export default function DoctorProfile({ 
  doctorId, doctor: initialDoctor, appointments, onAddAppointment, onAddReview, onBackToPortal, isEmbeddedPreview = false
}: DoctorProfileProps) {
  const [doctor, setDoctor] = useState<Doctor | null | undefined>(initialDoctor);

  useEffect(() => {
    let isMounted = true;
    
    // 1. Try Firestore
    const unsub = subscribeDoctorById(doctorId, (docData) => {
      if (isMounted) {
        if (docData) {
          setDoctor(docData);
        } else {
          // If Firestore returns null, try Supabase fallback
          fetchFromSupabase(doctorId).then(supaData => {
            if (isMounted && supaData) setDoctor(supaData);
          });
        }
      }
    });

    // 2. Fallback timeout for Supabase
    const timer = setTimeout(() => {
      if (isMounted && !doctor) {
        fetchFromSupabase(doctorId).then(supaData => {
          if (isMounted && supaData) setDoctor(supaData);
        });
      }
    }, 3000);

    return () => {
      isMounted = false;
      unsub();
      clearTimeout(timer);
    };
  }, [doctorId]);

  // Helper to fetch from Supabase
  const fetchFromSupabase = async (id: string): Promise<Doctor | null> => {
    try {
      const { getSupabaseClient } = await import('../lib/supabase');
      const client = getSupabaseClient();
      if (!client) return null;
      
      const { data, error } = await client.from('doctors').select('*').eq('id', id).single();
      if (error || !data) return null;
      
      // Map Supabase row to Doctor type (same mapping as fetchDoctorsFromSupabase)
      return {
        id: data.id,
        name: data.name,
        nameEn: data.name_en || data.nameEn || data.id,
        specialty: data.specialty,
        jobTitle: data.job_title || data.jobTitle || '',
        email: data.email || '',
        phone: data.phone || '',
        whatsapp: data.whatsapp || '',
        avatar: data.avatar || '',
        bio: data.bio || '',
        experience: data.experience || 0,
        branches: Array.isArray(data.branches) ? data.branches : [],
        services: Array.isArray(data.services) ? data.services : [],
        workingHours: Array.isArray(data.working_hours) ? data.working_hours : [],
        gallery: Array.isArray(data.gallery) ? data.gallery : [],
        galleryItems: Array.isArray(data.gallery_items) ? data.gallery_items : [],
        videos: Array.isArray(data.videos) ? data.videos : [],
        reviews: Array.isArray(data.reviews) ? data.reviews : [],
        socials: data.socials || {},
        secretaries: Array.isArray(data.secretaries) ? data.secretaries : [],
        isActiveSubscription: data.is_active_subscription ?? true,
        registeredAt: data.registered_at || new Date().toISOString(),
        subscriptionEndDate: data.subscription_end_date || '',
        approvalStatus: data.approval_status || 'approved',
        rejectionReason: data.rejection_reason || '',
        subscriptionType: data.subscription_type || '6months',
        isVerified: data.is_verified ?? false,
        whiteLabel: data.white_label ?? false,
        features: data.features || {},
        certificates: Array.isArray(data.certificates) ? data.certificates : [],
        siteType: data.site_type || 'profile',
        headerDisplayName: data.header_display_name || '',
        headerAvatar: data.header_avatar || ''
      } as Doctor;
    } catch (e) {
      console.error('Supabase fallback error:', e);
      return null;
    }
  };

  if (!doctor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50">
         <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
         <p className="mt-4 text-xl font-bold text-gray-700">جاري تحميل البيانات...</p>
      </div>
    );
  }
  
  const docFeatures = doctor.features || DEFAULT_DOCTOR_FEATURES;
  const activeTemplate = getThemeTemplate(doctor.themeTemplate);
  const primaryColor = doctor.themeColor || (activeTemplate ? activeTemplate.primaryColor : '#10244A');
  const themeTextColor = getThemeTextColor(primaryColor);

  // Language toggle state ('ar' | 'en') with persistent storage
  const [currentLang, setCurrentLang] = useState<'ar' | 'en'>(() => {
    try {
      return (localStorage.getItem('doctor_profile_lang') as 'ar' | 'en') || 'ar';
    } catch {
      return 'ar';
    }
  });

  const t = profileTranslations[currentLang];

  const toggleLanguage = () => {
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    setCurrentLang(nextLang);
    try {
      localStorage.setItem('doctor_profile_lang', nextLang);
    } catch {}
  };

  // Interactive active section scroll-highlight state
  const [activeSection, setActiveSection] = useState('about-section');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Certificate Image Lightbox State
  const [selectedCertForPreview, setSelectedCertForPreview] = useState<DoctorCertificate | null>(null);
  // Clinic Photo Lightbox Preview State
  const [selectedClinicPhoto, setSelectedClinicPhoto] = useState<{ url: string; title: string } | null>(null);

  // Clinic Gallery Photos (4 large top photos, 4 smaller bottom photos)
  const clinicLargePhotos = [
    {
      id: 'c1',
      title: 'الاستقبال الرئيسي ومدخل العيادة',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'c2',
      title: 'غرفة الكشف والتجهيزات الطبية',
      imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'c3',
      title: 'غرفة المناظير والجراحة المعقمة',
      imageUrl: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=1200'
    },
    {
      id: 'c4',
      title: 'منطقة الانتظار والعناية بالأطفال',
      imageUrl: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1200'
    }
  ];

  const clinicSmallPhotos = [
    {
      id: 'cs1',
      title: 'الممرات الداخلية والتعقيم',
      imageUrl: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'cs2',
      title: 'أجهزة التشخيص والمناظير الدقيقة',
      imageUrl: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'cs3',
      title: 'غرفة المتابعة والعناية المركزة',
      imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800'
    },
    {
      id: 'cs4',
      title: 'وحدة الفحوصات والتحاليل الطبية',
      imageUrl: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=800'
    }
  ];

  // Selected Branch for Contact Section
  const [selectedBranchId, setSelectedBranchId] = useState(doctor.branches[0]?.id || 'b1');

  const activeBranch = doctor.branches.find(b => b.id === selectedBranchId) || doctor.branches[0] || {
    id: 'b1',
    name: 'فرع العيادة الرئيسي',
    address: 'العنوان غير محدد بالتفصيل',
    phone: doctor.phone || '٠١١٤١٥٤١٠٣٠',
    workingHours: 'الأحد - الثلاثاء - الخميس من ٨-١٠ مساءً'
  };

  const certs: DoctorCertificate[] = (doctor.certificates && doctor.certificates.length > 0)
    ? doctor.certificates.map((cert: any, idx: number) => {
        if (typeof cert === 'string') {
          return {
            id: `cert-${idx}`,
            title: cert,
            imageUrl: createAvatarDataUrl(cert)
          };
        }
        return cert;
      })
    : [];

  // Mobile Certificate Slider State
  const [activeCertIndex, setActiveCertIndex] = useState(0);
  // Desktop Certificate Slider State
  const [desktopCertStartIndex, setDesktopCertStartIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  // Reviews Slider & Auto-play State
  const [activeReviewIndex, setActiveReviewIndex] = useState(0);
  const [reviewTouchStartX, setReviewTouchStartX] = useState<number | null>(null);

  // Memoized reviews to display
  const reviewsToDisplay = React.useMemo(() => {
    return (doctor.reviews && doctor.reviews.length > 0) ? doctor.reviews : [];
  }, [doctor.reviews]);

  // Gallery Photos to display (supporting galleryItems or gallery strings)
  const galleryPhotosToDisplay = React.useMemo(() => {
    if (doctor.galleryItems && doctor.galleryItems.length > 0) {
      return doctor.galleryItems;
    }
    if (doctor.gallery && doctor.gallery.length > 0) {
      return doctor.gallery.map((url, idx) => ({
        id: `gal-${idx}`,
        title: `صورة العيادة #${idx + 1}`,
        imageUrl: url
      }));
    }
    return [];
  }, [doctor.galleryItems, doctor.gallery]);

  // Videos to display (YouTube embed conversion)
  const videosToDisplay = React.useMemo(() => {
    if (doctor.videos && doctor.videos.length > 0) {
      return doctor.videos.map((vUrl, idx) => {
        let embedUrl = vUrl;
        if (vUrl.includes('youtube.com/embed/')) {
          embedUrl = vUrl;
        } else {
          const match = vUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/);
          if (match && match[1]) {
            embedUrl = `https://www.youtube.com/embed/${match[1]}`;
          }
        }
        return {
          id: `vid-${idx}`,
          title: `فيديو #${idx + 1}`,
          embedUrl
        };
      });
    }
    return [];
  }, [doctor.videos]);

  // Services to display
  const servicesToDisplay = React.useMemo(() => {
    return (doctor.services && doctor.services.length > 0) ? doctor.services : [];
  }, [doctor.services]);

  // Auto-play reviews every 4 seconds
  useEffect(() => {
    if (!reviewsToDisplay || reviewsToDisplay.length <= 1) return;
    const timer = setInterval(() => {
      setActiveReviewIndex((prev) => (prev + 1) % reviewsToDisplay.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [reviewsToDisplay]);

  // Profile Download Handler & Card Reference
  const [isCardExportOpen, setIsCardExportOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [cardImgSrc, setCardImgSrc] = useState<string>(doctor.avatar);
  const [qrImgSrc, setQrImgSrc] = useState<string>('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCardImgSrc(doctor.avatar);
  }, [doctor.avatar]);

  const getBranchWorkingHoursText = (b: Branch) => {
    if (b.workingHoursList && b.workingHoursList.length > 0) {
      const avail = b.workingHoursList.filter(wh => wh.isAvailable);
      if (avail.length > 0) {
        const days = avail.map(wh => wh.day).join('، ');
        const time = `${avail[0].start} - ${avail[0].end}`;
        return `${days} (${time})`;
      }
    }
    if (doctor.workingHours && doctor.workingHours.length > 0) {
      const avail = doctor.workingHours.filter(wh => wh.isAvailable);
      if (avail.length > 0) {
        const days = avail.map(wh => wh.day).join('، ');
        const time = `${avail[0].start} - ${avail[0].end}`;
        return `${days} (${time})`;
      }
    }
    return 'السبت إلى الأربعاء (7:00 م - 10:00 م)';
  };

  const createAvatarDataUrl = (name: string): string => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      if (!ctx) return '';

      const grad = ctx.createLinearGradient(0, 0, 300, 300);
      grad.addColorStop(0, '#e0f2fe');
      grad.addColorStop(1, '#bae6fd');
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(0, 0, 300, 300, 40);
      } else {
        ctx.rect(0, 0, 300, 300);
      }
      ctx.fill();

      const cleanName = (name || 'دكتور').replace(/^دكتور\s*|^د\.\s*/, '').trim();
      const initial = cleanName.charAt(0) || 'د';
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 110px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(initial, 150, 150);

      return canvas.toDataURL('image/png');
    } catch (e) {
      return '';
    }
  };

  const convertImageToBase64 = async (url: string, fallbackName: string = ''): Promise<string> => {
    if (!url) return createAvatarDataUrl(fallbackName);
    if (url.startsWith('data:')) return url;

    return new Promise<string>((resolve) => {
      let isDone = false;
      const finish = (res: string) => {
        if (!isDone) {
          isDone = true;
          resolve(res || createAvatarDataUrl(fallbackName));
        }
      };

      // 1-second timeout safety guarantee
      const timer = setTimeout(() => {
        finish(createAvatarDataUrl(fallbackName));
      }, 1000);

      // Try image loading with crossOrigin
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        clearTimeout(timer);
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || 300;
          canvas.height = img.naturalHeight || 300;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const data = canvas.toDataURL('image/png');
            if (data && data.length > 300) {
              finish(data);
              return;
            }
          }
        } catch (e) {
          // Canvas taint fallback
        }
        finish(createAvatarDataUrl(fallbackName));
      };
      img.onerror = () => {
        clearTimeout(timer);
        finish(createAvatarDataUrl(fallbackName));
      };
      img.src = url;
    });
  };

  const safeDrawImageOnCanvas = (
    ctx: CanvasRenderingContext2D,
    src: string,
    drawFn: (img: HTMLImageElement) => void
  ): Promise<void> => {
    return new Promise<void>((resolve) => {
      if (!src) return resolve();
      let done = false;
      const finish = () => {
        if (!done) {
          done = true;
          resolve();
        }
      };
      const timer = setTimeout(finish, 600);
      const img = new window.Image();
      img.onload = () => {
        clearTimeout(timer);
        try {
          drawFn(img);
        } catch (e) {
          console.warn('Canvas draw error:', e);
        }
        finish();
      };
      img.onerror = () => {
        clearTimeout(timer);
        finish();
      };
      img.src = src;
    });
  };

  const downloadCanvasFallback = async () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 600;

      const branches = displayBranches && displayBranches.length > 0 ? displayBranches : [
        {
          id: 'default-branch',
          name: 'الفرع الرئيسي',
          address: doctor.branches?.[0]?.address || 'العنوان الرئيسي للعيادة',
          phone: doctor.phone || '+201000000000',
          workingHours: ''
        }
      ];

      const specialty = doctor.jobTitle || '';
      const branchCount = branches.length;
      const clinicsBoxHeight = 55 + (branchCount * 85);
      const headerContentHeight = specialty ? 120 : 85;
      const totalHeight = 40 + headerContentHeight + clinicsBoxHeight + 40;
      canvas.height = totalHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Canvas Background (White)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 600, totalHeight);

      // 2. Outer Card Border with Rounded Corners
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 2;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(16, 16, 568, totalHeight - 32, 28);
      } else {
        ctx.rect(16, 16, 568, totalHeight - 32);
      }
      ctx.fill();
      ctx.stroke();

      // 3. Doctor Title & Name (Starts directly with "دكتور")
      let currentY = 42;

      // "دكتور"
      ctx.fillStyle = '#111827';
      ctx.font = 'bold 22px "Cairo", "Tajawal", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText('دكتور', 300, currentY);

      currentY += 36;

      // Doctor Name (No verification badge)
      const cleanDoctorName = doctor.name.replace(/^دكتور\s*|^د\.\s*/, '').trim();
      ctx.fillStyle = '#00a8cc';
      ctx.font = '900 32px "Cairo", "Tajawal", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(cleanDoctorName, 300, currentY);

      currentY += 46;

      // Job Title / Specialty
      if (specialty) {
        ctx.fillStyle = '#374151';
        ctx.font = 'bold 18px "Cairo", "Tajawal", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(specialty, 300, currentY);
        currentY += 40;
      } else {
        currentY += 10;
      }

      // 4. Clinics Box ("العيادات:")
      const boxX = 40;
      const boxY = currentY;
      const boxW = 520;

      ctx.fillStyle = '#f4f4f6';
      ctx.beginPath();
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(boxX, boxY, boxW, clinicsBoxHeight, 20);
      } else {
        ctx.rect(boxX, boxY, boxW, clinicsBoxHeight);
      }
      ctx.fill();

      // Clinics Title Header
      let innerY = boxY + 20;
      ctx.fillStyle = '#111827';
      ctx.font = '900 22px "Cairo", "Tajawal", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('العيادات:', boxX + boxW - 25, innerY);

      innerY += 36;

      // Render each branch
      branches.forEach((b, idx) => {
        // Branch Name
        ctx.fillStyle = '#111827';
        ctx.font = '900 19px "Cairo", "Tajawal", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(b.name, boxX + boxW - 25, innerY);

        // Address
        ctx.fillStyle = '#374151';
        ctx.font = '500 15px "Cairo", "Tajawal", sans-serif';
        ctx.fillText(b.address, boxX + boxW - 25, innerY + 26);

        // Phone
        ctx.fillStyle = '#111827';
        ctx.font = 'bold 15px "Cairo", "Tajawal", sans-serif';
        ctx.fillText(b.phone || doctor.phone || '', boxX + boxW - 25, innerY + 50);

        innerY += 82;

        if (idx < branches.length - 1) {
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(boxX + 25, innerY - 12);
          ctx.lineTo(boxX + boxW - 25, innerY - 12);
          ctx.stroke();
        }
      });

      // 5. Trigger Immediate File Download
      const fileName = `بطاقة_دكتور_${cleanDoctorName.replace(/\s+/g, '_')}.png`;
      const imageUri = canvas.toDataURL('image/png', 1.0);

      const link = document.createElement('a');
      link.href = imageUri;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (e) {
      console.error('Canvas download error:', e);
    }
  };

  const handleDownloadProfile = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadSuccess(false);

    try {
      await downloadCanvasFallback();
    } catch (err) {
      console.error('Failed to download profile card image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const [shareSuccess, setShareSuccess] = useState(false);

  const handleShareLocation = async () => {
    const shareData = {
      title: doctor.name,
      text: `الملف التعريفي والعيادة للطبيب ${doctor.name} - ${doctor.jobTitle}`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2500);
      }
    } catch (_err) {
      // User cancelled share or browser clipboard fallback failed silently
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = touchStartX - currentX;

    // Swipe threshold of 50px
    if (diff > 50) {
      // Swiped left (show next in standard LTR viewport representation)
      setActiveCertIndex((prev) => (prev + 1) % certs.length);
      setTouchStartX(null);
    } else if (diff < -50) {
      // Swiped right (show previous in standard LTR viewport representation)
      setActiveCertIndex((prev) => (prev - 1 + certs.length) % certs.length);
      setTouchStartX(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStartX(null);
  };

  // Review Touch Swipe Handlers for Mobile
  const handleReviewTouchStart = (e: React.TouchEvent) => {
    setReviewTouchStartX(e.touches[0].clientX);
  };

  const handleReviewTouchMove = (e: React.TouchEvent) => {
    if (reviewTouchStartX === null) return;
    const currentX = e.touches[0].clientX;
    const diff = reviewTouchStartX - currentX;

    if (diff > 40) {
      setActiveReviewIndex((prev) => (prev + 1) % reviewsToDisplay.length);
      setReviewTouchStartX(null);
    } else if (diff < -40) {
      setActiveReviewIndex((prev) => (prev - 1 + reviewsToDisplay.length) % reviewsToDisplay.length);
      setReviewTouchStartX(null);
    }
  };

  const handleReviewTouchEnd = () => {
    setReviewTouchStartX(null);
  };

  // Branch Selector State inside the Doctor side card
  const [activeCardBranchId, setActiveCardBranchId] = useState(doctor.branches[0]?.id || '');

  // Booking Form State
  const [selectedBranch, setSelectedBranch] = useState(doctor.branches[0]?.id || '');
  const [selectedService, setSelectedService] = useState(doctor.services[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientWhatsapp, setPatientWhatsapp] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [phoneError, setPhoneError] = useState('');
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [latestBooking, setLatestBooking] = useState<Appointment | null>(null);

  // Review Form State
  const [revName, setRevName] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revComment, setRevComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [showVerifiedBadgeMessage, setShowVerifiedBadgeMessage] = useState(false);

  // Verification & White Label validity calculation
  const isDoctorVerified = Boolean(doctor.isVerified) && (!doctor.verificationEndDate || new Date(doctor.verificationEndDate).getTime() >= new Date().setHours(0,0,0,0));
  const isDoctorWhiteLabel = Boolean(doctor.whiteLabel) && (!doctor.whiteLabelEndDate || new Date(doctor.whiteLabelEndDate).getTime() >= new Date().setHours(0,0,0,0));

  // Intersection Observer for highlighting the active section in the top header
  useEffect(() => {
    const sections = ['about-section', 'services-section', 'clinic-section', 'videos-section', 'certificates-section', 'reviews-section', 'booking-section'];
    
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -40% 0px',
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Filter out available working days for selector
  const availableWorkingHours = doctor.workingHours.filter(wh => wh.isAvailable);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    if (!patientName.trim()) {
      alert(currentLang === 'en' ? 'Please enter the patient name' : 'يرجى إدخال اسم المريض');
      return;
    }
    if (!patientPhone.trim()) {
      alert(currentLang === 'en' ? 'Please enter your phone number' : 'يرجى إدخال رقم الهاتف');
      return;
    }

    const cleanPhone = patientPhone.trim().replace(/[\s\+\-\(\)]/g, '');
    const isDigitsOnly = /^[0-9\u0660-\u0669]+$/.test(cleanPhone);

    if (!isDigitsOnly) {
      setPhoneError(currentLang === 'en' ? 'Phone number must contain digits only' : 'رقم الهاتف يجب أن يحتوي على أرقام فقط');
      return;
    }

    // Determine fallback branch, date and time if not clicked manually
    const activeBranchId = selectedBranch || displayBranches[0]?.id || 'main-clinic';
    const firstAvailableSlot = currentBranchSlots.find(s => s.isAvailable) || currentBranchSlots[0];

    const finalDate = selectedDate.trim() || firstAvailableSlot?.day || new Date().toISOString().split('T')[0];
    const finalTime = selectedTime.trim() || (firstAvailableSlot ? `${firstAvailableSlot.start} - ${firstAvailableSlot.end}` : (currentLang === 'en' ? 'During clinic hours' : 'خلال ساعات العمل'));
    const finalWhatsapp = patientWhatsapp.trim() || patientPhone.trim();
    const finalService = selectedService || doctor.services[0]?.id || 'general';

    const newApt: Appointment = {
      id: `apt-${Date.now()}`,
      doctorId: doctor.id,
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      whatsappNumber: finalWhatsapp,
      branchId: activeBranchId,
      serviceId: finalService,
      date: finalDate,
      time: finalTime,
      status: 'pending',
      notes: patientNotes.trim(),
      createdAt: new Date().toISOString()
    };

    onAddAppointment(newApt);
    setLatestBooking(newApt);
    setBookingSuccess(true);

    // Reset Form
    setPatientName('');
    setPatientPhone('');
    setPatientWhatsapp('');
    setPatientNotes('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revName.trim() || !revComment.trim()) {
      alert('يرجى ملء اسمك وترك تعليق');
      return;
    }

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      patientName: revName,
      rating: revRating,
      comment: revComment,
      date: new Date().toISOString().split('T')[0]
    };

    onAddReview(doctor.id, newRev);
    setReviewSuccess(true);
    setRevName('');
    setRevComment('');
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  const handleNotifyViaWhatsApp = () => {
    if (!latestBooking) return;
    
    const serviceName = doctor.services.find(s => s.id === latestBooking.serviceId)?.name || '';
    const branchName = doctor.branches.find(b => b.id === latestBooking.branchId)?.name || '';
    
    const text = `مرحباً د. ${doctor.name}، أود تأكيد رغبتي في حجز موعد عيادة عبر موقعك الإلكتروني:
- المريض: ${latestBooking.patientName}
- الهاتف: ${latestBooking.patientPhone}
- الخدمة: ${serviceName}
- العيادة/الفرع: ${branchName}
- التاريخ والوقت: ${latestBooking.date} الساعة ${latestBooking.time}
بانتظار تأكيدكم الكريم للموعد.`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${doctor.whatsapp}?text=${encoded}`, '_blank');
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(targetId);
    }
  };

  // Find the address of the selected active branch inside the doctor's side card
  const displayBranches = React.useMemo(() => {
    if (doctor.branches && doctor.branches.length > 0) return doctor.branches;
    return [{
      id: 'main-clinic',
      name: currentLang === 'en' ? 'Main Clinic' : 'العيادة الرئيسية',
      address: doctor.address ? (currentLang === 'en' ? translateClinicAddress(doctor.address) : doctor.address) : (currentLang === 'en' ? 'Main Address' : 'العنوان الرئيسي'),
      phone: doctor.phone || '',
      workingHoursList: doctor.workingHours || []
    }];
  }, [doctor.branches, doctor.address, doctor.phone, doctor.workingHours, currentLang]);

  const activeCardBranchIdValue = activeCardBranchId || displayBranches[0]?.id;
  const selectedBranchObj = displayBranches.find(b => b.id === activeCardBranchIdValue) || displayBranches[0];

  // Currently selected branch object for the booking form schedule
  const currentBookingBranchId = selectedBranch || displayBranches[0]?.id;
  const currentBookingBranchObj = displayBranches.find(b => b.id === currentBookingBranchId) || displayBranches[0];

  const currentBranchSlots = React.useMemo(() => {
    if (currentBookingBranchObj?.workingHoursList && currentBookingBranchObj.workingHoursList.length > 0) {
      const avail = currentBookingBranchObj.workingHoursList.filter(wh => wh.isAvailable);
      if (avail.length > 0) return avail;
    }
    if (doctor.workingHours && doctor.workingHours.filter(wh => wh.isAvailable).length > 0) {
      return doctor.workingHours.filter(wh => wh.isAvailable);
    }
    return [];
  }, [currentBookingBranchObj, doctor.workingHours]);

  return (
    <div 
      className={`w-full ${isEmbeddedPreview ? 'min-h-full pb-4 pt-1' : 'min-h-screen'} font-sans selection:bg-[#009bb9] selection:text-white ${activeTemplate ? activeTemplate.bgClass : 'bg-slate-50'} text-[#0F172A] relative overflow-x-hidden`} 
      style={{ fontFamily: currentLang === 'ar' ? "'Tajawal', sans-serif" : "system-ui, -apple-system, sans-serif" }} 
      dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Decorative Static Motif / Visual Pattern for Ready Theme Templates */}
      <ThemePatternWatermark 
        patternType={activeTemplate?.patternType} 
        primaryColor={primaryColor} 
      />
      
      {/* Premium Floating Fixed Header for the Public site */}
      <header 
        style={{ backgroundColor: primaryColor, color: themeTextColor }}
        className={`${isEmbeddedPreview ? 'sticky top-2 z-30' : 'fixed top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-50'} max-w-7xl mx-auto rounded-2xl backdrop-blur-md px-3.5 sm:px-6 py-2.5 flex items-center justify-between transition-colors duration-300 shadow-md border ${themeTextColor === '#0F172A' ? 'border-black/10' : 'border-white/10'}`}
      >
        
        {/* Right side: Doctor Avatar + Two-Word Name */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div 
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 shadow-xs shrink-0 flex items-center justify-center"
            style={{ 
              borderColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
              backgroundColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
            }}
          >
            {doctor.headerAvatar || doctor.avatar ? (
              <div className="w-full h-full flex items-center justify-center bg-white">
                <img 
                  src={doctor.headerAvatar || doctor.avatar} 
                  alt={doctor.headerDisplayName || doctor.name} 
                  loading="eager"
                  decoding="async"
                  className="w-full h-full object-contain object-center high-quality-img"
                />
              </div>
            ) : (
              <User className="w-5 h-5" style={{ color: themeTextColor, opacity: 0.8 }} />
            )}
          </div>
          <div className={`flex flex-col ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
            <span 
              className="font-extrabold text-xs sm:text-sm md:text-base leading-tight"
              style={{ color: themeTextColor }}
            >
              {currentLang === 'en' 
                ? (doctor.nameEn || doctor.headerDisplayName || doctor.name) 
                : (doctor.headerDisplayName || getTwoWordName(doctor.name))}
            </span>
          </div>
        </div>

        {/* Center: Scroll Navigation (Desktop) */}
        <nav className="hidden lg:flex flex-wrap items-center justify-center gap-1 lg:gap-2 font-black text-xs lg:text-sm py-0.5">
          {docFeatures.aboutAndBio && (
            <a 
              href="#about-section" 
              onClick={(e) => handleLinkClick(e, 'about-section')}
              style={{ 
                backgroundColor: activeSection === 'about-section' ? (themeTextColor === '#0F172A' ? '#0F172A' : '#FFFFFF') : undefined,
                color: activeSection === 'about-section' ? (themeTextColor === '#0F172A' ? '#FFFFFF' : primaryColor) : themeTextColor,
                opacity: activeSection === 'about-section' ? 1 : 0.9
              }}
              className="inline-block px-1 transition-all duration-200 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-xl font-black shadow-2xs hover:opacity-100"
            >
              {t.home}
            </a>
          )}
          {docFeatures.servicesAndPrices && (
            <a 
              href="#services-section" 
              onClick={(e) => handleLinkClick(e, 'services-section')}
              style={{ 
                backgroundColor: activeSection === 'services-section' ? (themeTextColor === '#0F172A' ? '#0F172A' : '#FFFFFF') : undefined,
                color: activeSection === 'services-section' ? (themeTextColor === '#0F172A' ? '#FFFFFF' : primaryColor) : themeTextColor,
                opacity: activeSection === 'services-section' ? 1 : 0.9
              }}
              className="inline-block px-1 transition-all duration-200 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-xl font-black shadow-2xs hover:opacity-100"
            >
              {t.services}
            </a>
          )}
          {docFeatures.photoGallery && (
            <a 
              href="#clinic-section" 
              onClick={(e) => handleLinkClick(e, 'clinic-section')}
              style={{ 
                backgroundColor: activeSection === 'clinic-section' ? (themeTextColor === '#0F172A' ? '#0F172A' : '#FFFFFF') : undefined,
                color: activeSection === 'clinic-section' ? (themeTextColor === '#0F172A' ? '#FFFFFF' : primaryColor) : themeTextColor,
                opacity: activeSection === 'clinic-section' ? 1 : 0.9
              }}
              className="inline-block px-1 transition-all duration-200 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-xl font-black shadow-2xs hover:opacity-100"
            >
              {t.gallery}
            </a>
          )}
          {(docFeatures.videosSection ?? true) && (
            <a 
              href="#videos-section" 
              onClick={(e) => handleLinkClick(e, 'videos-section')}
              style={{ 
                backgroundColor: activeSection === 'videos-section' ? (themeTextColor === '#0F172A' ? '#0F172A' : '#FFFFFF') : undefined,
                color: activeSection === 'videos-section' ? (themeTextColor === '#0F172A' ? '#FFFFFF' : primaryColor) : themeTextColor,
                opacity: activeSection === 'videos-section' ? 1 : 0.9
              }}
              className="inline-block px-1 transition-all duration-200 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-xl font-black shadow-2xs hover:opacity-100"
            >
              {t.videos}
            </a>
          )}
          {docFeatures.addCertificates && (
            <a 
              href="#certificates-section" 
              onClick={(e) => handleLinkClick(e, 'certificates-section')}
              style={{ 
                backgroundColor: activeSection === 'certificates-section' ? (themeTextColor === '#0F172A' ? '#0F172A' : '#FFFFFF') : undefined,
                color: activeSection === 'certificates-section' ? (themeTextColor === '#0F172A' ? '#FFFFFF' : primaryColor) : themeTextColor,
                opacity: activeSection === 'certificates-section' ? 1 : 0.9
              }}
              className="inline-block px-1 transition-all duration-200 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-xl font-black shadow-2xs hover:opacity-100"
            >
              {t.certificates}
            </a>
          )}
          {docFeatures.patientReviews && (
            <a 
              href="#reviews-section" 
              onClick={(e) => handleLinkClick(e, 'reviews-section')}
              style={{ 
                backgroundColor: activeSection === 'reviews-section' ? (themeTextColor === '#0F172A' ? '#0F172A' : '#FFFFFF') : undefined,
                color: activeSection === 'reviews-section' ? (themeTextColor === '#0F172A' ? '#FFFFFF' : primaryColor) : themeTextColor,
                opacity: activeSection === 'reviews-section' ? 1 : 0.9
              }}
              className="inline-block px-1 transition-all duration-200 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-xl font-black shadow-2xs hover:opacity-100"
            >
              {t.reviews}
            </a>
          )}
          {(docFeatures.easyBooking ?? true) && (
            <a 
              href="#booking-section" 
              onClick={(e) => handleLinkClick(e, 'booking-section')}
              style={{ 
                backgroundColor: activeSection === 'booking-section' ? (themeTextColor === '#0F172A' ? '#0F172A' : '#FFFFFF') : undefined,
                color: activeSection === 'booking-section' ? (themeTextColor === '#0F172A' ? '#FFFFFF' : primaryColor) : themeTextColor,
                opacity: activeSection === 'booking-section' ? 1 : 0.9
              }}
              className="inline-block px-1 transition-all duration-200 px-2.5 py-1 lg:px-3.5 lg:py-1.5 rounded-xl font-black shadow-2xs hover:opacity-100"
            >
              {t.booking}
            </a>
          )}
        </nav>

        {/* Left side: Language Toggle (Icon Only), Quick Book Button & Mobile/Tablet Menu Toggle */}
        <div className="flex items-center gap-2">
          {/* Language Switcher: ONLY icon (Globe), NO text */}
          <button
            type="button"
            onClick={toggleLanguage}
            style={{ 
              color: themeTextColor,
              borderColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
              backgroundColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl hover:opacity-90 active:scale-95 flex items-center justify-center transition-all duration-200 border cursor-pointer shadow-xs"
            title={t.toggleLangTitle}
            aria-label={t.toggleLangTitle}
          >
            <Globe className="w-4 h-4 sm:w-4.5 sm:h-4.5" style={{ color: themeTextColor }} />
          </button>

          {/* Quick Book Button */}
          {(docFeatures.easyBooking ?? true) && (
            <a 
              href="#booking-section"
              onClick={(e) => handleLinkClick(e, 'booking-section')}
              style={{ 
                backgroundColor: themeTextColor === '#0F172A' ? '#0F172A' : '#FFFFFF',
                color: themeTextColor === '#0F172A' ? '#FFFFFF' : primaryColor
              }}
              className="hidden lg:inline-flex items-center justify-center gap-2 px-5 py-2 hover:opacity-95 text-xs sm:text-sm font-black rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Calendar className="w-4 h-4" style={{ color: themeTextColor === '#0F172A' ? '#FFFFFF' : primaryColor }} />
              <span>{t.quickBook}</span>
            </a>
          )}

          {/* Mobile & Tablet 3-bar Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 transition-all flex items-center justify-center cursor-pointer bg-transparent border-0 outline-none focus:outline-none"
            aria-label={currentLang === 'ar' ? 'القائمة' : 'Menu'}
          >
            {isMobileMenuOpen ? (
              <X className="w-7 h-7" style={{ color: themeTextColor }} />
            ) : (
              <Menu className="w-7 h-7" style={{ color: themeTextColor }} />
            )}
          </button>
        </div>
      </header>

      {/* Mobile & Tablet Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className={`fixed inset-x-4 top-20 z-50 lg:hidden bg-white/98 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-2xl p-5 space-y-3 ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-extrabold text-sm" style={{ color: primaryColor }}>{t.navTitle}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleLanguage}
                style={{ color: primaryColor }}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 active:scale-95 flex items-center justify-center transition-all border border-slate-200 cursor-pointer"
                title={t.toggleLangTitle}
                aria-label={t.toggleLangTitle}
              >
                <Globe className="w-4 h-4" style={{ color: primaryColor }} />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 font-bold text-xs" style={{ color: primaryColor }}>
            {docFeatures.aboutAndBio && (
              <a 
                href="#about-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'about-section');
                  setIsMobileMenuOpen(false);
                }}
                style={{ 
                  backgroundColor: activeSection === 'about-section' ? primaryColor : undefined,
                  color: activeSection === 'about-section' ? themeTextColor : undefined
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'about-section' ? 'font-black shadow-xs' : 'hover:bg-slate-100'
                }`}
              >
                {t.home}
              </a>
            )}
            {docFeatures.servicesAndPrices && (
              <a 
                href="#services-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'services-section');
                  setIsMobileMenuOpen(false);
                }}
                style={{ 
                  backgroundColor: activeSection === 'services-section' ? primaryColor : undefined,
                  color: activeSection === 'services-section' ? themeTextColor : undefined
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'services-section' ? 'font-black shadow-xs' : 'hover:bg-slate-100'
                }`}
              >
                {t.services}
              </a>
            )}
            {docFeatures.photoGallery && (
              <a 
                href="#clinic-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'clinic-section');
                  setIsMobileMenuOpen(false);
                }}
                style={{ 
                  backgroundColor: activeSection === 'clinic-section' ? primaryColor : undefined,
                  color: activeSection === 'clinic-section' ? themeTextColor : undefined
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'clinic-section' ? 'font-black shadow-xs' : 'hover:bg-slate-100'
                }`}
              >
                {t.gallery}
              </a>
            )}
            {(docFeatures.videosSection ?? true) && (
              <a 
                href="#videos-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'videos-section');
                  setIsMobileMenuOpen(false);
                }}
                style={{ 
                  backgroundColor: activeSection === 'videos-section' ? primaryColor : undefined,
                  color: activeSection === 'videos-section' ? themeTextColor : undefined
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'videos-section' ? 'font-black shadow-xs' : 'hover:bg-slate-100'
                }`}
              >
                {t.videos}
              </a>
            )}
            {docFeatures.addCertificates && (
              <a 
                href="#certificates-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'certificates-section');
                  setIsMobileMenuOpen(false);
                }}
                style={{ 
                  backgroundColor: activeSection === 'certificates-section' ? primaryColor : undefined,
                  color: activeSection === 'certificates-section' ? themeTextColor : undefined
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'certificates-section' ? 'font-black shadow-xs' : 'hover:bg-slate-100'
                }`}
              >
                {t.certificates}
              </a>
            )}
            {docFeatures.patientReviews && (
              <a 
                href="#reviews-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'reviews-section');
                  setIsMobileMenuOpen(false);
                }}
                style={{ 
                  backgroundColor: activeSection === 'reviews-section' ? primaryColor : undefined,
                  color: activeSection === 'reviews-section' ? themeTextColor : undefined
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'reviews-section' ? 'font-black shadow-xs' : 'hover:bg-slate-100'
                }`}
              >
                {t.reviews}
              </a>
            )}
            {(docFeatures.easyBooking ?? true) && (
              <a 
                href="#booking-section" 
                onClick={(e) => {
                  handleLinkClick(e, 'booking-section');
                  setIsMobileMenuOpen(false);
                }}
                style={{ 
                  backgroundColor: activeSection === 'booking-section' ? primaryColor : undefined,
                  color: activeSection === 'booking-section' ? themeTextColor : undefined
                }}
                className={`p-3 rounded-xl transition-all ${
                  activeSection === 'booking-section' ? 'font-black shadow-xs' : 'hover:bg-slate-100'
                }`}
              >
                {t.booking}
              </a>
            )}
          </div>
        </div>
      )}

      {/* Main Grid Wrapper */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 items-start">
          
          {/* Right Column (Sticky Profile Side Card) */}
          <div className="lg:col-span-1 lg:sticky lg:top-28 z-20">
            <div className="bg-slate-50 border border-slate-200/80 rounded-[32px] overflow-hidden flex flex-col items-center text-center p-4 sm:p-5 shadow-xs">
              
              {/* Doctor Avatar Card - Scaled up & elegant rounded corners */}
              <div className="relative w-full aspect-square max-w-[320px] rounded-[32px] overflow-hidden bg-neutral-100 shrink-0 shadow-md border-2 border-white ring-1 ring-slate-200/80">
                <img 
                  src={doctor.avatar} 
                  alt={doctor.name} 
                  loading="eager"
                  decoding="async"
                  width="800"
                  height="800"
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105 high-quality-img"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Card Padding Container for Content */}
              <div className="pt-5 w-full flex flex-col items-center text-center gap-5">
                
                {/* 1. Name with custom interactive Twitter-like verification rosette */}
                <div className="relative w-full flex flex-col items-center">
                  {showVerifiedBadgeMessage && isDoctorVerified && (
                    <div className="absolute bottom-full mb-3 bg-white text-[#10244A] text-[11px] font-black py-2 px-3.5 rounded-xl z-30 flex items-center gap-1.5 inline-block px-1 animate-bounce-short shadow-md border border-neutral-200">
                      <span>{t.verifiedDoctor}</span>
                    </div>
                  )}

                  <h2 className="text-xl md:text-2xl font-black flex items-center gap-1.5 justify-center" style={{ color: primaryColor }}>
                    {currentLang === 'en' ? (doctor.nameEn || doctor.name) : doctor.name}
                    {isDoctorVerified && (
                      <button 
                        onMouseEnter={() => setShowVerifiedBadgeMessage(true)}
                        onMouseLeave={() => setShowVerifiedBadgeMessage(false)}
                        onClick={() => {
                          setShowVerifiedBadgeMessage(true);
                          setTimeout(() => setShowVerifiedBadgeMessage(false), 3000);
                        }}
                        className="inline-flex items-center justify-center transition-transform active:scale-90 focus:outline-none animate-premium-badge cursor-pointer"
                        title={t.verifiedDoctor}
                      >
                        <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1877F2] fill-current shrink-0 transition-colors">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.99-3.818-3.99-.48 0-.94.1-1.348.27C14.825 2.515 13.512 1.5 12 1.5s-2.825 1.015-3.422 2.28c-.407-.17-.867-.27-1.348-.27-2.108 0-3.818 1.78-3.818 3.99 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.58.875 2.95 2.148 3.6-.154.435-.238.905-.238 1.4 0 2.21 1.71 3.99 3.818 3.99.48 0 .94-.1 1.348-.27.597 1.265 1.91 2.28 3.422 2.28s2.825-1.015 3.422-2.28c.407.17 .867.27 1.348.27 2.108 0 3.818-1.78 3.818-3.99 0-.495-.084-.965-.238-1.4 1.273-.65 2.148-2.02 2.148-3.6zm-12.62 3.71l-3.27-3.27 1.1-1.1 2.17 2.17 5.85-5.85 1.11 1.11-6.96 6.94z" />
                        </svg>
                      </button>
                    )}
                  </h2>
                </div>

                {/* 2. Specialization (التخصص) */}
                <p className="text-xs md:text-sm text-black/70 font-normal leading-relaxed px-2">
                  {currentLang === 'en' 
                    ? (doctor.jobTitleEn || translateMedicalJobTitle(doctor.jobTitle || doctor.specialty)) 
                    : doctor.jobTitle}
                </p>

                {/* 3. Rating & Stars (النجوم والتقييم) */}
                {(() => {
                  const reviewsCount = doctor.reviews.length;
                  const avgRating = reviewsCount > 0 
                    ? (doctor.reviews.reduce((acc, r) => acc + r.rating, 0) / reviewsCount).toFixed(1)
                    : '4.9';
                  return (
                    <div className="flex items-center justify-center gap-1.5 bg-amber-50/60 px-3.5 py-1 rounded-full">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        ))}
                      </div>
                      <span className="text-xs font-black text-amber-800 pr-1">{avgRating}</span>
                      <span className="text-[10px] text-neutral-400 font-bold">({reviewsCount || 12} {t.ratingCount})</span>
                    </div>
                  );
                })()}

                {/* 4. Social & Action Icons under Doctor Name */}
                <div className="w-full flex items-center justify-center gap-2.5 pt-1.5 pb-0.5 flex-wrap">
                  {doctor.whatsapp && doctor.whatsapp.trim() !== '' && (
                    <a 
                      href={`https://wa.me/${doctor.whatsapp.trim()}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#25D366] hover:border-[#25D366] hover:text-white hover:scale-110 transition-all duration-300"
                      title={t.whatsappClinic}
                    >
                      <WhatsAppIcon className="w-4.5 h-4.5" />
                    </a>
                  )}
                  {(doctor.features?.socialMediaLinks ?? true) && (
                    <>
                      {doctor.socials?.facebook && doctor.socials.facebook.trim() !== '' && (
                        <a 
                          href={doctor.socials.facebook.trim()} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white hover:scale-110 transition-all duration-300"
                          title={t.facebookPage}
                        >
                          <Facebook className="w-4 h-4" />
                        </a>
                      )}
                      {doctor.socials?.instagram && doctor.socials.instagram.trim() !== '' && (
                        <a 
                          href={doctor.socials.instagram.trim()} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:text-white hover:scale-110 transition-all duration-300"
                          title={t.instagramAccount}
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      )}
                      {doctor.socials?.tiktok && doctor.socials.tiktok.trim() !== '' && (
                        <a 
                          href={doctor.socials.tiktok.trim()} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-black hover:border-black hover:text-white hover:scale-110 transition-all duration-300"
                          title={t.tiktokAccount}
                        >
                          <TikTokIcon className="w-4 h-4" />
                        </a>
                      )}
                      {doctor.socials?.youtube && doctor.socials.youtube.trim() !== '' && (
                        <a 
                          href={doctor.socials.youtube.trim()} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#FF0000] hover:border-[#FF0000] hover:text-white hover:scale-110 transition-all duration-300"
                          title={t.youtubeChannel}
                        >
                          <Youtube className="w-4 h-4" />
                        </a>
                      )}
                      {doctor.socials?.linkedin && doctor.socials.linkedin.trim() !== '' && (
                        <a 
                          href={doctor.socials.linkedin.trim()} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#0A66C2] hover:border-[#0A66C2] hover:text-white hover:scale-110 transition-all duration-300"
                          title={t.linkedinAccount}
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {doctor.socials?.twitter && doctor.socials.twitter.trim() !== '' && (
                        <a 
                          href={doctor.socials.twitter.trim()} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:text-white hover:scale-110 transition-all duration-300"
                          title={t.twitterAccount}
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {doctor.socials?.telegram && doctor.socials.telegram.trim() !== '' && (
                        <a 
                          href={doctor.socials.telegram.trim()} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#0088cc] hover:border-[#0088cc] hover:text-white hover:scale-110 transition-all duration-300"
                          title={t.telegramAccount}
                        >
                          <TelegramIcon className="w-4 h-4" />
                        </a>
                      )}
                      {doctor.socials?.website && doctor.socials.website.trim() !== '' && (
                        <a 
                          href={doctor.socials.website.trim()} 
                          target="_blank" 
                          rel="noreferrer"
                          className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200/80 text-neutral-800 flex items-center justify-center shadow-xs hover:bg-[#10244A] hover:border-[#10244A] hover:text-white hover:scale-110 transition-all duration-300"
                          title={t.website}
                        >
                          <Globe className="w-4 h-4" />
                        </a>
                      )}
                    </>
                  )}
                  <button 
                    onClick={handleShareLocation}
                    type="button"
                    className={`w-10 h-10 rounded-full border text-neutral-800 flex items-center justify-center shadow-xs transition-all duration-300 cursor-pointer ${
                      shareSuccess 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'bg-slate-100 border-slate-200/80 hover:bg-[#10244A] hover:border-[#10244A] hover:text-white hover:scale-110'
                    }`}
                    title={t.shareLocation}
                  >
                    {shareSuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button 
                    onClick={handleDownloadProfile}
                    disabled={isDownloading}
                    type="button"
                    className={`w-10 h-10 rounded-full border text-neutral-800 flex items-center justify-center shadow-xs transition-all duration-300 cursor-pointer ${
                      downloadSuccess 
                        ? 'bg-emerald-600 border-emerald-600 text-white' 
                        : 'bg-slate-100 border-slate-200/80 hover:bg-[#10244A] hover:border-[#10244A] hover:text-white hover:scale-110'
                    }`}
                    title={t.downloadProfile}
                  >
                    {isDownloading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : downloadSuccess ? (
                      <Check className="w-4 h-4 text-white" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Clinic Location & Maps Widget (بديل الباركود) */}
                {displayBranches.length > 0 && (
                  <div className={`w-full bg-slate-50 border border-slate-200/80 p-3.5 sm:p-4 rounded-[24px] ${currentLang === 'ar' ? 'text-right' : 'text-left'} space-y-2.5 sm:space-y-3 mt-2`}>
                    {/* Clinic Tabs Selector - Sleeker fitted width */}
                    <div className="flex flex-wrap justify-center items-center gap-1.5 sm:gap-2 p-1.5 bg-neutral-100 rounded-2xl">
                      {displayBranches.map((b) => {
                        const isActive = (activeCardBranchId || displayBranches[0]?.id) === b.id;
                        const branchDisplayName = currentLang === 'en' ? (b.nameEn || translateBranchName(b.name)) : b.name;
                        return (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => {
                              setActiveCardBranchId(b.id);
                              setSelectedBranch(b.id);
                            }}
                            style={{ 
                              backgroundColor: isActive ? primaryColor : undefined,
                              color: isActive ? themeTextColor : undefined
                            }}
                            className={`py-1.5 sm:py-2 px-4 rounded-xl text-xs font-black transition-all text-center cursor-pointer leading-snug break-words flex items-center justify-center min-h-[34px] sm:min-h-[38px] max-w-[85%] ${
                              isActive
                                ? 'shadow-xs'
                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-white/70'
                            }`}
                            title={branchDisplayName}
                          >
                            {branchDisplayName}
                          </button>
                        );
                      })}
                    </div>

                    {/* Selected Branch Info & Map Box */}
                    {selectedBranchObj && (
                      <div className="space-y-2.5">
                        {/* Address */}
                        <div className={`flex items-start ${currentLang === 'ar' ? 'justify-end text-right' : 'justify-start text-left'} gap-2 bg-neutral-50 p-2.5 sm:p-3 rounded-xl`}>
                          <div className="flex-1 space-y-0.5">
                            <span className="block text-xs font-black text-slate-900 leading-tight">
                              {currentLang === 'en' ? (selectedBranchObj.nameEn || translateBranchName(selectedBranchObj.name)) : selectedBranchObj.name}
                            </span>
                            <p className="text-xs font-normal text-black/70 leading-snug">
                              {currentLang === 'en' ? (selectedBranchObj.addressEn || translateClinicAddress(selectedBranchObj.address)) : selectedBranchObj.address}
                            </p>
                          </div>
                          <MapPin className="w-4 h-4 shrink-0 mt-[1px]" style={{ color: primaryColor }} />
                        </div>

                        {/* Embedded Map - Reduced height by 20-25% (h-32 on mobile) */}
                        <div className="relative rounded-xl overflow-hidden h-32 sm:h-36 w-full bg-neutral-100">
                          <iframe 
                            title={`Map ${selectedBranchObj.name}`}
                            src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedBranchObj.name + ' ' + selectedBranchObj.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            className="w-full h-full border-0"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Primary Booking/Call Buttons (تحت الخريطة) */}
                <div className="w-full grid grid-cols-2 gap-2.5 pt-1">
                  <a 
                    href="#booking-section"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('booking-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}
                    style={{ backgroundColor: primaryColor, color: themeTextColor }}
                    className="w-full py-3 hover:opacity-95 text-xs font-black rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-3.5 h-3.5" style={{ color: themeTextColor }} />
                    <span>{t.booking}</span>
                  </a>
                  <a 
                    href={`tel:${doctor.phone}`}
                    className="w-full py-3 bg-white hover:bg-neutral-50 text-neutral-700 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 border border-slate-200/80 shadow-xs"
                  >
                    <Phone className="w-3.5 h-3.5 text-neutral-500" />
                    <span>{t.callNow}</span>
                  </a>
                </div>

              </div>

            </div>
          </div>

          {/* Left Column (Main Information, Services, Clinic, Reviews, Booking) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Section 1: Doctor Bio & Features / "عن الدكتور" */}
            {docFeatures.aboutAndBio && (() => {
              const doctorNameOnly = doctor.name.replace(/^(الأستاذ\s+)?(الدكتور\s+\/|د\.\s*)/, '');
              return (
                <section id="about-section" className={`scroll-mt-28 bg-slate-50 border border-slate-200/80 rounded-[32px] p-6 md:p-8 ${currentLang === 'ar' ? 'text-right' : 'text-left'} space-y-4`}>
                  
                  {/* Headers */}
                  <div className={`space-y-2 ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
                    <div className="flex items-center justify-start">
                      <span 
                        className="font-black text-sm pb-0.5 inline-block"
                        style={{ color: primaryColor, borderBottom: `2px solid ${primaryColor}` }}
                      >
                        {t.aboutDoctor}
                      </span>
                    </div>
                    
                    <h2 className="text-base sm:text-lg font-extrabold tracking-tight" style={{ color: primaryColor }}>
                      {t.drPrefix} {currentLang === 'en' ? (doctor.nameEn || doctor.name) : doctorNameOnly}
                    </h2>

                    {/* Bio Description - 2 to 3 lines */}
                    <p className="text-black/70 text-xs sm:text-sm font-normal leading-relaxed pt-1 max-w-3xl line-clamp-3">
                      {(currentLang === 'en' ? (doctor.bioEn || doctor.bio) : doctor.bio) || t.noBio}
                    </p>
                  </div>

                </section>
              );
            })()}

            {/* Section 2: Services List (الخدمات) */}
            {docFeatures.servicesAndPrices && (
              <section id="services-section" className="scroll-mt-28 space-y-8">
                
                {/* Centered Main Title */}
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: primaryColor }}>
                    {t.services}
                  </h2>
                </div>

                {servicesToDisplay.length > 0 ? (
                  /* Cards Grid */
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-6">
                    {servicesToDisplay.map((srv, idx) => {
                      const imgSrc = (srv as any).imageUrl;

                      return (
                        <div 
                          key={srv.id || idx}
                          className="w-full bg-white border border-slate-200/90 rounded-[18px] sm:rounded-[28px] p-2.5 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col text-center group"
                        >
                          {/* Service Top Image */}
                          {imgSrc ? (
                            <div className="w-full aspect-[16/9] rounded-[14px] sm:rounded-[18px] overflow-hidden bg-slate-100">
                              <img 
                                src={imgSrc} 
                                alt={srv.name} 
                                loading="lazy"
                                decoding="async"
                                width="320"
                                height="180"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 high-quality-img" 
                              />
                            </div>
                          ) : (
                            <div className="w-full aspect-[16/9] rounded-[14px] sm:rounded-[18px] overflow-hidden bg-blue-50/60 flex items-center justify-center text-blue-600">
                              <Stethoscope className="w-8 h-8 opacity-70" />
                            </div>
                          )}

                          {/* Service Bottom Text Content */}
                          <div className="pt-2.5 pb-1.5 px-1.5 sm:pt-3 sm:pb-2 sm:px-2 flex flex-col items-center justify-center gap-1.5">
                            <h3 className="text-sm sm:text-base md:text-lg font-black leading-snug text-center" style={{ color: primaryColor }}>
                              {srv.name}
                            </h3>
                            {srv.description && (
                              <p className="text-xs sm:text-sm text-black/70 font-normal leading-relaxed text-center line-clamp-3">
                                {srv.description}
                              </p>
                            )}
                            {srv.price && (
                              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mt-1">
                                {srv.price} {t.currency}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-500 font-bold text-sm">
                    {t.noServices}
                  </div>
                )}
              </section>
            )}

            {/* Section 3: Clinic Gallery (معرض الصور) */}
            {docFeatures.photoGallery && (
              <section id="clinic-section" className={`scroll-mt-28 space-y-8 ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
                
                <div className="text-center space-y-2 max-w-2xl mx-auto">
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tight" style={{ color: primaryColor }}>
                    {t.gallery}
                  </h2>
                </div>

                {galleryPhotosToDisplay.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                    {galleryPhotosToDisplay.map((photo, idx) => (
                      <div 
                        key={photo.id || idx}
                        onClick={() => setSelectedClinicPhoto({ url: photo.imageUrl, title: photo.title })}
                        className="bg-slate-50 border border-slate-200/80 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer group"
                      >
                        <div className="relative w-full h-60 sm:h-72 md:h-80 overflow-hidden bg-neutral-100 rounded-none">
                          <img 
                            src={photo.imageUrl} 
                            alt={photo.title} 
                            loading="lazy"
                            decoding="async"
                            width="600"
                            height="500"
                            className="w-full h-full object-cover rounded-none pointer-events-none select-none group-hover:scale-105 transition-transform duration-500 high-quality-img" 
                          />
                        </div>

                        <div className="p-4 flex-1 flex items-center justify-center text-center bg-slate-50 border-t border-slate-200/80">
                          <h3 className="text-base sm:text-lg font-black leading-snug" style={{ color: primaryColor }}>
                            {photo.title}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-500 font-bold text-sm">
                    {t.noGallery}
                  </div>
                )}

              </section>
            )}

            {/* Section 4: Videos Section (الفيديوهات) */}
            {(docFeatures.videosSection ?? true) && (
              <section id="videos-section" className={`scroll-mt-28 bg-slate-50 border border-slate-200/80 rounded-[32px] p-6 md:p-8 space-y-6 ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
                
                {/* Header */}
                <div className="space-y-2 text-center border-b border-slate-200/70 pb-4">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-black tracking-tight text-center" style={{ color: primaryColor }}>
                    {t.videos}
                  </h2>
                </div>

                {videosToDisplay.length > 0 ? (
                  /* Videos Grid */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 pt-2">
                    {videosToDisplay.map((vid, idx) => (
                      <div 
                        key={vid.id || idx}
                        className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
                      >
                        {/* YouTube Player Container */}
                        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden rounded-t-2xl">
                          <iframe 
                            src={vid.embedUrl} 
                            title={vid.title} 
                            className="w-full h-full border-0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          />
                        </div>

                        {/* Card Title */}
                        <div className={`p-4 bg-white ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
                          <h3 className="font-extrabold text-sm sm:text-base leading-snug" style={{ color: primaryColor }}>
                            {vid.title}
                          </h3>
                        </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl text-slate-500 font-bold text-sm">
                    {t.noVideos}
                  </div>
                )}

              </section>
            )}

            {/* Section 5: Certificates & Accreditations (الشهادات) */}
            {docFeatures.addCertificates && (
              <section id="certificates-section" className={`scroll-mt-28 bg-slate-50 border border-slate-200/80 rounded-[32px] p-6 md:p-10 space-y-6 ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
                
                <div className="text-center space-y-1.5 border-b border-neutral-100 pb-4">
                  <h3 className="text-xl md:text-2xl font-black text-center" style={{ color: primaryColor }}>{t.certificates}</h3>
                </div>

                {certs.length > 0 ? (
                  <>
                    {/* Desktop View (sm and larger) */}
                    <div className="hidden sm:block relative max-w-[814px] mx-auto pt-2 group/carousel">
                      {/* Navigation Arrows for Desktop (Inside Container) */}
                      {certs.length > 3 && (
                        <>
                          <button
                            type="button"
                            onClick={() => setDesktopCertStartIndex((prev) => (prev > 0 ? prev - 1 : certs.length - 3))}
                            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-[#10244A] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
                            aria-label="Previous Certificate"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDesktopCertStartIndex((prev) => (prev < certs.length - 3 ? prev + 1 : 0))}
                            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 flex items-center justify-center text-[#10244A] hover:bg-neutral-100 active:scale-95 transition-all cursor-pointer backdrop-blur-xs"
                            aria-label="Next Certificate"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {/* Viewport for Desktop Carousel */}
                      <div className="overflow-hidden w-full rounded-[24px]">
                        <div 
                          className="flex gap-8 transition-transform duration-500 ease-out"
                          style={{ 
                            transform: `translateX(${desktopCertStartIndex * (250 + 32)}px)` 
                          }}
                        >
                          {certs.map((cert) => (
                            <div 
                              key={cert.id}
                              onClick={() => setSelectedCertForPreview(cert)}
                              className={`group bg-neutral-50 hover:bg-white rounded-[24px] overflow-hidden transition-all duration-300 ${currentLang === 'ar' ? 'text-right' : 'text-left'} w-[250px] h-[306px] shrink-0 flex flex-col cursor-pointer relative`}
                            >
                              {/* Image occupying 100% height & width of the card */}
                              <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-100">
                                <img 
                                  src={cert.imageUrl} 
                                  alt={cert.title} 
                                  loading="lazy"
                                  decoding="async"
                                  width="250"
                                  height="306"
                                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                  draggable="false"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-300" />
                              </div>

                              <div className={`absolute bottom-0 inset-x-0 p-4.5 z-10 flex flex-col gap-1 ${currentLang === 'ar' ? 'text-right' : 'text-left'} bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12`}>
                                <h4 className="text-sm font-black text-white leading-snug whitespace-normal break-words drop-shadow-md">
                                  {cert.title}
                                </h4>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Bullet Indicators (Dots) for Desktop */}
                      {certs.length > 3 && (
                        <div className="flex justify-center gap-1.5 mt-4">
                          {Array.from({ length: certs.length - 2 }).map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setDesktopCertStartIndex(idx)}
                              style={{ backgroundColor: desktopCertStartIndex === idx ? primaryColor : undefined }}
                              className={`h-1 rounded-full transition-all duration-300 ${
                                desktopCertStartIndex === idx ? 'w-4' : 'w-1.5 bg-neutral-200 hover:bg-neutral-300'
                              }`}
                              aria-label={`Slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Mobile View (Touch Slider & Auto-play) */}
                    <div className="block sm:hidden relative">
                      <div 
                        className="relative overflow-hidden w-full max-w-[230px] h-[302px] mx-auto rounded-[24px] bg-neutral-50/30 p-0.5"
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                      >
                        <div 
                          className="flex h-full transition-transform duration-500 ease-out"
                          dir="ltr"
                          style={{ 
                            width: `${certs.length * 100}%`,
                            transform: `translateX(-${activeCertIndex * (100 / certs.length)}%)`
                          }}
                        >
                          {certs.map((cert) => (
                            <div 
                              key={cert.id} 
                              style={{ width: `${100 / certs.length}%` }} 
                              className="h-full shrink-0 p-0.5 flex justify-center items-center"
                              dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                            >
                              <div 
                                onClick={() => setSelectedCertForPreview(cert)}
                                className={`w-full h-full bg-neutral-50 rounded-[24px] overflow-hidden group transition-all duration-300 ${currentLang === 'ar' ? 'text-right' : 'text-left'} flex flex-col cursor-pointer relative`}
                              >
                                <div className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-100">
                                  <img 
                                    src={cert.imageUrl} 
                                    alt={cert.title} 
                                    loading="lazy"
                                    decoding="async"
                                    width="230"
                                    height="302"
                                    className="w-full h-full object-cover"
                                    draggable="false"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                                </div>

                                <div className={`absolute bottom-0 inset-x-0 p-4 z-10 flex flex-col gap-1 ${currentLang === 'ar' ? 'text-right' : 'text-left'} bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-10`}>
                                  <h4 className="text-xs font-black text-white leading-snug whitespace-normal break-words drop-shadow-md">
                                    {cert.title}
                                  </h4>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {certs.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCertIndex((prev) => (prev - 1 + certs.length) % certs.length);
                              }}
                              className="absolute left-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-md border border-neutral-100 flex items-center justify-center text-[#10244A] active:scale-90 transition-transform"
                              aria-label="Previous Certificate"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveCertIndex((prev) => (prev + 1) % certs.length);
                              }}
                              className="absolute right-1.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-md border border-neutral-100 flex items-center justify-center text-[#10244A] active:scale-90 transition-transform"
                              aria-label="Next Certificate"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>

                      {certs.length > 1 && (
                        <div className="flex justify-center gap-1.5 mt-3">
                          {certs.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveCertIndex(idx)}
                              style={{ backgroundColor: activeCertIndex === idx ? primaryColor : undefined }}
                              className={`h-1 rounded-full transition-all duration-300 ${
                                activeCertIndex === idx ? 'w-4' : 'w-1 bg-neutral-200 hover:bg-neutral-300'
                              }`}
                              aria-label={`Slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center bg-white border border-slate-200/80 rounded-2xl text-slate-500 font-bold text-sm">
                    {t.noCertificates}
                  </div>
                )}
              </section>
            )}

            {/* Section 6: Patient Reviews (الآراء) */}
            {docFeatures.patientReviews && (
              <section id="reviews-section" className="scroll-mt-28 space-y-6">
                
                <div className="text-center space-y-1">
                  <h3 className="text-2xl md:text-3xl font-black text-center" style={{ color: primaryColor }}>
                    {t.reviews}
                  </h3>
                </div>

                {reviewsToDisplay.length > 0 ? (
                  <>
                    {/* Desktop View (Grid Layout) */}
                    <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                      {reviewsToDisplay.map((rev, idx) => (
                        <div 
                          key={rev.id || idx}
                          className="w-full bg-white border border-slate-200/90 rounded-[28px] p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col items-center text-center group"
                        >
                          {/* Top Circular Avatar */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-xs shrink-0 my-1">
                            <img 
                              src={rev.avatar || createAvatarDataUrl(rev.patientName || 'Patient')} 
                              alt={rev.patientName} 
                              loading="lazy"
                              decoding="async"
                              width="80"
                              height="80"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                            />
                          </div>

                          {/* Details & Review text */}
                          <div className="pt-3 pb-1 px-1 flex flex-col items-center justify-between flex-1 space-y-1.5">
                            <h3 className="text-base md:text-lg font-black leading-snug text-center" style={{ color: primaryColor }}>
                              {rev.patientName}
                            </h3>

                            {/* Rating Stars */}
                            <div className="flex items-center justify-center gap-1 my-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                    i < (rev.rating || 5) 
                                      ? 'text-amber-400 fill-amber-400' 
                                      : 'text-slate-200 fill-slate-200'
                                  }`} 
                                />
                              ))}
                            </div>

                            {/* Comment */}
                            <p className="text-xs md:text-sm font-normal text-black/70 leading-snug text-center line-clamp-3">
                              "{rev.comment}"
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mobile View */}
                    <div className="block sm:hidden relative">
                      <div 
                        className="relative overflow-hidden w-full max-w-[270px] mx-auto p-1"
                        dir="ltr"
                        onTouchStart={handleReviewTouchStart}
                        onTouchMove={handleReviewTouchMove}
                        onTouchEnd={handleReviewTouchEnd}
                      >
                        {/* Sliding Track */}
                        <div 
                          className="flex transition-transform duration-500 ease-out"
                          style={{ 
                            width: `${reviewsToDisplay.length * 100}%`,
                            transform: `translateX(-${activeReviewIndex * (100 / reviewsToDisplay.length)}%)`
                          }}
                        >
                          {reviewsToDisplay.map((rev, idx) => (
                            <div 
                              key={rev.id || idx} 
                              style={{ width: `${100 / reviewsToDisplay.length}%` }} 
                              className="shrink-0 p-1 flex justify-center items-center"
                              dir={currentLang === 'ar' ? 'rtl' : 'ltr'}
                            >
                              {/* Individual Review Card */}
                              <div className="w-full bg-white border border-slate-200/90 rounded-[24px] p-4.5 shadow-xs flex flex-col items-center text-center justify-between space-y-2 min-h-[220px]">
                                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 border-2 border-slate-100 shadow-xs shrink-0 my-0.5">
                                  <img 
                                    src={rev.avatar || createAvatarDataUrl(rev.patientName || 'Patient')} 
                                    alt={rev.patientName} 
                                    loading="lazy"
                                    decoding="async"
                                    width="64"
                                    height="64"
                                    className="w-full h-full object-cover" 
                                  />
                                </div>

                                <h3 className="text-sm font-black leading-snug" style={{ color: primaryColor }}>
                                  {rev.patientName}
                                </h3>

                                <div className="flex items-center justify-center gap-1 my-0.5">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3.5 h-3.5 ${
                                        i < (rev.rating || 5) 
                                          ? 'text-amber-400 fill-amber-400' 
                                          : 'text-slate-200 fill-slate-200'
                                      }`} 
                                    />
                                  ))}
                                </div>

                                <p className="text-xs font-normal text-black/70 leading-relaxed px-1 line-clamp-4">
                                  "{rev.comment}"
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {reviewsToDisplay.length > 1 && (
                          <>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveReviewIndex((prev) => (prev - 1 + reviewsToDisplay.length) % reviewsToDisplay.length);
                              }}
                              style={{ color: primaryColor }}
                              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-md border border-neutral-200/80 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                              aria-label="Previous Review"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveReviewIndex((prev) => (prev + 1) % reviewsToDisplay.length);
                              }}
                              style={{ color: primaryColor }}
                              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white/95 shadow-md border border-neutral-200/80 flex items-center justify-center active:scale-90 transition-transform cursor-pointer"
                              aria-label="Next Review"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>

                      {reviewsToDisplay.length > 1 && (
                        <div className="flex justify-center gap-1.5 mt-3">
                          {reviewsToDisplay.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveReviewIndex(idx)}
                              style={{ backgroundColor: activeReviewIndex === idx ? primaryColor : undefined }}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                activeReviewIndex === idx ? 'w-5' : 'w-1.5 bg-neutral-200 hover:bg-neutral-300'
                              }`}
                              aria-label={`Review Slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-500 font-bold text-sm">
                    {t.noReviews}
                  </div>
                )}
              </section>
            )}

            {/* Section 7: Clinical Booking Engine (الحجز) */}
            {(docFeatures.easyBooking ?? true) && (
              <section id="booking-section" className="scroll-mt-28 space-y-6">
                
                <div className="text-center space-y-1.5">
                  <h3 className="text-xl md:text-2xl font-black text-center" style={{ color: primaryColor }}>{t.booking}</h3>
                </div>

                {displayBranches.length > 0 ? (
                  <div className="bg-slate-50 border border-slate-200/90 rounded-[28px] sm:rounded-[32px] md:rounded-[40px] p-3 sm:p-6 md:p-8 transition-all">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 md:gap-8 items-stretch" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
                      
                      {/* Clinics & Schedules Panel */}
                      <div className="lg:col-span-5 order-1 lg:order-2 bg-white border border-slate-200/80 rounded-[22px] sm:rounded-[28px] p-3.5 sm:p-5 md:p-6 flex flex-col items-center justify-start text-center space-y-3 md:space-y-5 shadow-xs">
                        {/* Dark Circle Clock Icon */}
                        <div 
                          className="w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0 shadow-xs" 
                          style={{ backgroundColor: primaryColor, color: themeTextColor }}
                        >
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: themeTextColor }} />
                        </div>

                        {/* Section 1: Clinics */}
                        <div className="space-y-1.5 sm:space-y-2.5 w-full">
                          <h4 className="font-black text-sm sm:text-base md:text-lg tracking-tight" style={{ color: primaryColor }}>
                            {t.clinics}
                          </h4>

                          <div className="relative w-full max-w-[210px] mx-auto">
                            <select 
                              value={selectedBranch || displayBranches[0]?.id}
                              onChange={(e) => {
                                setSelectedBranch(e.target.value);
                                setActiveCardBranchId(e.target.value);
                                setSelectedDate('');
                                setSelectedTime('');
                              }}
                              className={`w-full px-3 py-1.5 sm:px-4 sm:py-2.5 bg-slate-50 border border-slate-200/90 rounded-full text-xs font-extrabold text-center cursor-pointer focus:outline-none shadow-2xs appearance-none ${currentLang === 'ar' ? 'pr-7 pl-7' : 'pl-7 pr-7'}`}
                              style={{ color: primaryColor }}
                            >
                              {displayBranches.map((b) => (
                                <option key={b.id} value={b.id}>
                                  {currentLang === 'en' ? (b.nameEn || translateBranchName(b.name)) : b.name}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className={`w-4 h-4 text-slate-500 absolute ${currentLang === 'ar' ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                          </div>
                        </div>

                        {/* Section 2: Schedules */}
                        <div className="pt-0.5 w-full space-y-2 sm:space-y-3.5">
                          <h4 className="font-black text-sm sm:text-base md:text-lg tracking-tight" style={{ color: primaryColor }}>
                            {t.times}
                          </h4>

                          {/* Grid of Day Slots for Selected Branch */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2.5 w-full max-w-[460px] md:max-w-[720px] lg:max-w-[460px] mx-auto">
                            {currentBranchSlots.map((wh, idx) => {
                              const isSelected = selectedDate === wh.day;
                              return (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => {
                                    setSelectedDate(wh.day);
                                    setSelectedTime(`${wh.start} - ${wh.end}`);
                                  }}
                                  style={{
                                    backgroundColor: isSelected ? primaryColor : undefined,
                                    borderColor: isSelected ? primaryColor : undefined,
                                    color: isSelected ? themeTextColor : undefined
                                  }}
                                  className={`px-4 py-2.5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-row items-center justify-between ${
                                    isSelected 
                                      ? 'shadow-sm font-bold scale-[1.02]' 
                                      : 'bg-slate-50 border-slate-200/90 text-slate-800 hover:bg-slate-100 shadow-2xs'
                                  }`}
                                >
                                  <span 
                                    className="font-extrabold text-[10px] sm:text-xs leading-tight mb-0.5"
                                    style={{ color: isSelected ? themeTextColor : undefined }}
                                  >
                                    {currentLang === 'en' ? translateDayName(wh.day) : wh.day}
                                  </span>
                                  <span 
                                    dir="ltr" className="text-[9px] sm:text-[10px] font-semibold inline-block px-1"
                                    style={{ 
                                      color: isSelected 
                                        ? (themeTextColor === '#0F172A' ? '#0F172A' : 'rgba(255,255,255,0.9)') 
                                        : undefined 
                                    }}
                                  >
                                    {currentLang === 'en' ? translateTimeSlot(`${wh.start} - ${wh.end}`) : `${wh.start} - ${wh.end}`}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                      </div>

                      {/* Patient Form Inputs */}
                      <form 
                        onSubmit={handleBookingSubmit} 
                        className="lg:col-span-7 order-2 lg:order-1 bg-white rounded-[28px] p-5 sm:p-6 md:p-8 flex flex-col justify-between space-y-5 border border-slate-200/80 shadow-xs"
                      >
                        <div className="space-y-4">
                          {/* Full Name */}
                          <div className="w-full">
                            <input 
                              type="text" 
                              value={patientName}
                              onChange={(e) => setPatientName(e.target.value)}
                              placeholder={t.fullName}
                              className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-200/90 rounded-full text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white placeholder:text-slate-400 ${currentLang === 'ar' ? 'text-right' : 'text-left'} transition-all shadow-2xs`}
                              required
                            />
                          </div>

                          {/* Mobile Phone */}
                          <div className="w-full">
                            <input 
                              type="text" 
                              inputMode="numeric"
                              value={patientPhone}
                              onChange={(e) => {
                                setPatientPhone(e.target.value);
                                if (phoneError) setPhoneError('');
                              }}
                              placeholder={t.phone}
                              className={`w-full px-5 py-3.5 bg-slate-50 border ${
                                phoneError ? 'border-red-500 focus:border-red-600' : 'border-slate-200/90'
                              } rounded-full text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white placeholder:text-slate-400 ${currentLang === 'ar' ? 'text-right' : 'text-left'} transition-all shadow-2xs`}
                              required
                            />
                            {phoneError && (
                              <p className={`text-red-500 text-xs font-bold mt-1.5 px-3 ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
                                {phoneError}
                              </p>
                            )}
                          </div>

                          {/* WhatsApp Phone */}
                          <div className="w-full">
                            <input 
                              type="text" 
                              inputMode="numeric"
                              value={patientWhatsapp}
                              onChange={(e) => setPatientWhatsapp(e.target.value.replace(/\D/g, ''))}
                              placeholder={`${t.whatsappBooking} (${currentLang === 'en' ? 'Optional' : 'اختياري'})`}
                              className={`w-full px-5 py-3.5 bg-slate-50 border border-slate-200/90 rounded-full text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white placeholder:text-slate-400 ${currentLang === 'ar' ? 'text-right' : 'text-left'} transition-all shadow-2xs`}
                            />
                          </div>

                          {/* Date Selector Input */}
                          <div className="relative w-full">
                            <input 
                              type="text" 
                              value={selectedDate ? `${selectedDate} ${selectedTime ? `(${selectedTime})` : ''}` : ''}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              placeholder={t.datePlaceholder}
                              className={`w-full px-5 py-3.5 ${currentLang === 'ar' ? 'pr-10 text-right' : 'pl-10 text-left'} bg-slate-50 border border-slate-200/90 rounded-full text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white placeholder:text-slate-400 transition-all shadow-2xs`}
                            />
                            <Calendar className={`w-4 h-4 text-slate-400 absolute ${currentLang === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 pointer-events-none`} />
                          </div>

                          {/* Additional Notes */}
                          <div className="w-full">
                            <textarea 
                              value={patientNotes}
                              onChange={(e) => setPatientNotes(e.target.value)}
                              placeholder={t.notesPlaceholder}
                              rows={4}
                              className={`w-full p-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs font-semibold text-slate-800 focus:outline-none focus:bg-white placeholder:text-slate-400 ${currentLang === 'ar' ? 'text-right' : 'text-left'} transition-all shadow-2xs resize-none`}
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                          type="submit"
                          style={{ backgroundColor: primaryColor, color: themeTextColor }}
                          className="w-full py-3.5 md:py-4 hover:opacity-95 font-extrabold text-sm rounded-full transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-2"
                        >
                          <Calendar className="w-4 h-4" style={{ color: themeTextColor }} />
                          <span>{t.confirmBooking}</span>
                        </button>
                      </form>

                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-500 font-bold text-sm">
                    {t.noSlots}
                  </div>
                )}
              </section>
            )}

          </div>

        </div>

      </main>

      {/* Shared Footer */}
      <footer 
        style={{ backgroundColor: primaryColor, color: themeTextColor }}
        className={`w-full py-7 md:py-9 border-t scroll-mt-24 ${themeTextColor === '#0F172A' ? 'border-black/10' : 'border-white/10'}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center space-y-5 md:space-y-6">
          
          {/* Clickable Resized Logo Image with Hover Animation (Navigates to Main Portal) */}
          <button 
            onClick={onBackToPortal}
            className="group cursor-pointer outline-none focus:outline-none transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 active:scale-95 my-1"
            title={t.backToHome}
          >
            <img 
              src="https://k.top4top.io/p_38573eitn0.png" 
              alt="لوجو منصة بروفايلي" 
              loading="lazy"
              decoding="async"
              width="160"
              height="64"
              className="h-14 sm:h-16 md:h-20 w-auto object-contain filter drop-shadow-md group-hover:drop-shadow-2xl transition-all duration-300 group-hover:brightness-110"
            />
          </button>

          {/* Copyright Notice */}
          <p 
            className="text-[11px] font-semibold"
            style={{ color: themeTextColor, opacity: 0.75 }}
          >
            {currentLang === 'en'
              ? `${t.allRightsReserved} © ${new Date().getFullYear()} - Dr. Profile Platform`
              : `جميع الحقوق محفوظة © ${new Date().getFullYear()} - منصة دكتور بروفايل`}
          </p>

          {/* Centered Social Media Icons (Enlarged circles with 25% border transparency) */}
          {(doctor.features?.socialMediaLinks ?? true) && (
            <div className="flex items-center justify-center gap-3.5 pt-1 flex-wrap">
              {doctor.socials?.facebook && doctor.socials.facebook.trim() !== '' && (
                <a 
                  href={doctor.socials.facebook.trim()} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    color: themeTextColor,
                    borderColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                    backgroundColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                  }}
                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-white hover:text-[#1877F2] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                  title={t.facebookPage}
                >
                  <Facebook className="w-4.5 h-4.5" />
                </a>
              )}
              {doctor.socials?.twitter && doctor.socials.twitter.trim() !== '' && (
                <a 
                  href={doctor.socials.twitter.trim()} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    color: themeTextColor,
                    borderColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                    backgroundColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                  }}
                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-white hover:text-[#1DA1F2] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                  title={t.twitterAccount}
                >
                  <Twitter className="w-4.5 h-4.5" />
                </a>
              )}
              {doctor.socials?.instagram && doctor.socials.instagram.trim() !== '' && (
                <a 
                  href={doctor.socials.instagram.trim()} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    color: themeTextColor,
                    borderColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                    backgroundColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                  }}
                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-white hover:text-[#dc2743] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                  title={t.instagramAccount}
                >
                  <Instagram className="w-4.5 h-4.5" />
                </a>
              )}
              {doctor.socials?.youtube && doctor.socials.youtube.trim() !== '' && (
                <a 
                  href={doctor.socials.youtube.trim()} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    color: themeTextColor,
                    borderColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                    backgroundColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                  }}
                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-white hover:text-[#FF0000] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                  title={t.youtubeChannel}
                >
                  <Youtube className="w-4.5 h-4.5" />
                </a>
              )}
              {doctor.socials?.linkedin && doctor.socials.linkedin.trim() !== '' && (
                <a 
                  href={doctor.socials.linkedin.trim()} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    color: themeTextColor,
                    borderColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                    backgroundColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                  }}
                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-white hover:text-[#0A66C2] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                  title={t.linkedinAccount}
                >
                  <Linkedin className="w-4.5 h-4.5" />
                </a>
              )}
              {doctor.socials?.tiktok && doctor.socials.tiktok.trim() !== '' && (
                <a 
                  href={doctor.socials.tiktok.trim()} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    color: themeTextColor,
                    borderColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                    backgroundColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                  }}
                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-white hover:text-black hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                  title={t.tiktokAccount}
                >
                  <TikTokIcon className="w-4.5 h-4.5" />
                </a>
              )}
              {doctor.socials?.telegram && doctor.socials.telegram.trim() !== '' && (
                <a 
                  href={doctor.socials.telegram.trim()} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    color: themeTextColor,
                    borderColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                    backgroundColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                  }}
                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-white hover:text-[#0088cc] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                  title={t.telegramAccount}
                >
                  <TelegramIcon className="w-4.5 h-4.5" />
                </a>
              )}
              {doctor.socials?.website && doctor.socials.website.trim() !== '' && (
                <a 
                  href={doctor.socials.website.trim()} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    color: themeTextColor,
                    borderColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.25)' : 'rgba(255,255,255,0.25)',
                    backgroundColor: themeTextColor === '#0F172A' ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.1)'
                  }}
                  className="w-10 h-10 rounded-full border flex items-center justify-center hover:bg-white hover:text-[#10244A] hover:border-white hover:scale-110 transition-all duration-300 shadow-xs" 
                  title={t.website}
                >
                  <Globe className="w-4.5 h-4.5" />
                </a>
              )}
            </div>
          )}

        </div>
      </footer>

      {/* Certificate Fullscreen Lightbox Modal */}
      {selectedCertForPreview && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in" 
          onClick={() => setSelectedCertForPreview(null)}
        >
          <div 
            className={`relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl ${currentLang === 'ar' ? 'text-right' : 'text-left'} animate-scale-up`} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-neutral-100 bg-neutral-50">
              <button 
                onClick={() => setSelectedCertForPreview(null)}
                className="p-2 hover:bg-neutral-200 text-neutral-500 hover:text-black rounded-full transition-colors cursor-pointer"
                title={t.close}
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="font-black text-sm md:text-base flex items-center gap-2" style={{ color: primaryColor }}>
                <Award className="w-4 h-4 text-[#009bb9]" />
                <span>{selectedCertForPreview.title}</span>
              </h3>
            </div>
            
            {/* Modal Image Wrapper with certificate proportions */}
            <div className="p-6 md:p-8 flex items-center justify-center bg-neutral-950/5 max-h-[70vh] overflow-y-auto">
              <img 
                src={selectedCertForPreview.imageUrl} 
                alt={selectedCertForPreview.title} 
                className="max-h-[60vh] object-contain rounded-xl shadow-lg border-4 border-white transition-all"
              />
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center text-xs text-neutral-500 font-bold">
              <span>{t.verificationProtocol}</span>
              <span className="text-[#009bb9] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {t.verifiedAccredited}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Clinic Photo Lightbox Preview Modal */}
      {selectedClinicPhoto && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn" 
          onClick={() => setSelectedClinicPhoto(null)}
        >
          <div 
            className={`relative bg-white rounded-none shadow-2xl max-w-4xl w-full overflow-hidden ${currentLang === 'ar' ? 'text-right' : 'text-left'} animate-scaleUp`} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0d4f3c] text-white flex justify-between items-center">
              <button 
                onClick={() => setSelectedClinicPhoto(null)}
                className="p-1.5 rounded-none hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label={t.close}
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{selectedClinicPhoto.title}</span>
              </h3>
            </div>
            
            {/* Modal Image Wrapper */}
            <div className="p-4 sm:p-6 flex items-center justify-center bg-neutral-900 max-h-[75vh] overflow-hidden">
              <img 
                src={selectedClinicPhoto.url} 
                alt={selectedClinicPhoto.title} 
                className="max-h-[65vh] object-contain rounded-none shadow-md"
              />
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-3 bg-neutral-50 border-t border-neutral-100 flex justify-between items-center text-xs text-neutral-500 font-bold">
              <span>{t.clinicEquipment}</span>
              <span className="text-[#0d4f3c] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                {t.clinicOf} {currentLang === 'en' ? (doctor.nameEn || doctor.name) : doctor.name}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Offscreen Card Template matching user's exact screenshot */}
      <div 
        style={{ 
          position: 'fixed', 
          left: '-9999px', 
          top: '-9999px', 
          width: '400px', 
          zIndex: -9999, 
          opacity: 0, 
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        <div 
          ref={cardRef}
          id="downloadable-doctor-card"
          className="w-[400px] bg-white rounded-[32px] p-7 shadow-2xl border border-slate-100 text-center font-sans text-neutral-900 dir-rtl select-none"
          style={{ fontFamily: "'Tajawal', 'Cairo', sans-serif" }}
        >
          {/* Doctor Title & Name */}
          <div className="space-y-1.5 mb-4">
            <div className="text-lg font-bold text-neutral-900">
              دكتور
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-3xl font-extrabold text-[#00a8cc]">
                {doctor.name.replace(/^دكتور\s*|^د\.\s*/, '').trim()}
              </span>
            </div>

            <div className="text-sm font-bold text-neutral-800 leading-snug px-3 pt-1">
              {doctor.jobTitle}
            </div>
          </div>

          {/* Clinics Box */}
          <div className="w-full bg-[#f4f4f6] rounded-[24px] p-5 text-right space-y-4">
            <div className="text-base font-black text-neutral-900 text-right">
              العيادات:
            </div>

            {displayBranches.map((b, idx) => (
              <div key={b.id || idx} className="space-y-1">
                <div className="text-base font-black text-neutral-900">
                  {b.name}
                </div>
                <div className="text-sm text-neutral-700 font-medium leading-relaxed">
                  {b.address}
                </div>
                <div className="text-sm text-neutral-900 font-bold dir-ltr text-right">
                  {b.phone || doctor.phone}
                </div>
                {idx < displayBranches.length - 1 && (
                  <div className="w-full border-t border-slate-200/90 my-3" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Digital Business Card Export Modal */}
      <DoctorCardExport 
        doctor={doctor} 
        branches={displayBranches} 
        isOpen={isCardExportOpen} 
        onClose={() => setIsCardExportOpen(false)} 
      />

      {/* Booking Success Popup Modal (رسالة منبثقة بتفاصيل الحجز) */}
      {bookingSuccess && latestBooking && (
        <div 
          className={`fixed inset-0 z-[9999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fade-in ${currentLang === 'ar' ? 'dir-rtl' : 'dir-ltr'}`} 
          onClick={() => setBookingSuccess(false)}
        >
          <div 
            className={`bg-white rounded-2xl sm:rounded-3xl max-w-md w-full p-4 sm:p-6 ${currentLang === 'ar' ? 'text-right' : 'text-left'} space-y-4 sm:space-y-5 shadow-2xl relative animate-scale-up border border-slate-100 max-h-[90vh] overflow-y-auto`} 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              type="button"
              onClick={() => setBookingSuccess(false)}
              className={`absolute ${currentLang === 'ar' ? 'left-3 sm:left-4' : 'right-3 sm:right-4'} top-3 sm:top-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer`} 
              title={t.close}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Header Icon & Title */}
            <div className="text-center space-y-2 pt-1 sm:pt-2">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle className="w-7 h-7 sm:w-10 sm:h-10" />
              </div>
              <h3 className="text-base sm:text-xl font-black" style={{ color: primaryColor }}>
                {t.bookingSent}
              </h3>
              <p className="text-slate-600 text-[11px] sm:text-xs font-semibold leading-relaxed max-w-sm mx-auto">
                {t.bookingSentDesc}
              </p>
            </div>

            {/* Details Box */}
            <div className={`bg-slate-50 border border-slate-200/80 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-[11px] sm:text-xs space-y-2 sm:space-y-2.5 ${currentLang === 'ar' ? 'text-right' : 'text-left'}`}>
              <h4 className="font-extrabold text-xs sm:text-sm pb-1.5 border-b border-slate-200 flex items-center gap-1.5" style={{ color: primaryColor }}>
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t.bookingDetails}</span>
              </h4>

              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">{t.patientName}</span>
                <span className="font-extrabold text-slate-800 text-xs sm:text-sm">{latestBooking.patientName}</span>
              </div>

              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">{t.patientPhone}</span>
                <span className="font-bold text-slate-800" dir="ltr">{latestBooking.patientPhone}</span>
              </div>

              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">{t.patientWhatsapp}</span>
                <span className="font-bold text-slate-800" dir="ltr">{latestBooking.whatsappNumber || latestBooking.patientPhone}</span>
              </div>

              {displayBranches.find(b => b.id === latestBooking.branchId) && (
                <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                  <span className="text-slate-500 font-medium">{t.clinicBranch}</span>
                  <span className="font-bold text-slate-800">
                    {(() => {
                      const br = displayBranches.find(b => b.id === latestBooking.branchId);
                      if (!br) return '';
                      return currentLang === 'en' ? (br.nameEn || translateBranchName(br.name)) : br.name;
                    })()}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center py-0.5 border-b border-slate-200/60">
                <span className="text-slate-500 font-medium">{t.selectedTime}</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {currentLang === 'en' 
                    ? `${translateDayName(latestBooking.date)} (${translateTimeSlot(latestBooking.time)})` 
                    : `${latestBooking.date} (${latestBooking.time})`}
                </span>
              </div>

              {latestBooking.notes && (
                <div className="pt-0.5">
                  <span className="text-slate-500 font-medium block mb-0.5">{t.notes}</span>
                  <p className="text-slate-700 bg-white p-2 rounded-lg border border-slate-200 text-[10px] sm:text-[11px] leading-relaxed">
                    {latestBooking.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-1">
              <button 
                type="button"
                onClick={() => setBookingSuccess(false)}
                style={{ backgroundColor: primaryColor, color: themeTextColor }}
                className="w-full py-2.5 sm:py-3 hover:opacity-95 font-extrabold text-xs sm:text-sm rounded-full transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{t.done}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
