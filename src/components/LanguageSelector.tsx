import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';

interface LanguageSelectorProps {
  currentLang?: 'ar' | 'en';
  className?: string;
}

export default function LanguageSelector({ currentLang = 'ar', className = '' }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectLanguage = (lang: 'ar' | 'en') => {
    localStorage.setItem('app_lang', lang);
    window.dispatchEvent(new CustomEvent('languageChange', { detail: lang }));
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-right ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between gap-2.5 px-3 py-1.5 bg-white border border-slate-300 rounded-lg shadow-sm hover:bg-slate-50 transition-all cursor-pointer text-slate-700 font-bold text-xs sm:text-sm select-none"
        title="تغيير اللغة / Change Language"
      >
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        <span className="font-almarai leading-none">{currentLang === 'en' ? 'English' : 'العربية'}</span>
        <Globe className="w-4 h-4 text-slate-700" />
      </button>

      {isOpen && (
        <div className={`absolute top-full mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50 overflow-hidden font-almarai text-xs sm:text-sm ${currentLang === 'en' ? 'right-0' : 'left-0'}`}>
          <button
            type="button"
            onClick={() => selectLanguage('ar')}
            className={`w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${currentLang === 'ar' ? 'text-[#0284c7] font-extrabold bg-blue-50/50' : 'text-slate-700 font-bold'}`}
          >
            <span>العربية</span>
            {currentLang === 'ar' && <Check className="w-3.5 h-3.5 text-[#0284c7]" />}
          </button>
          <button
            type="button"
            onClick={() => selectLanguage('en')}
            className={`w-full px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${currentLang === 'en' ? 'text-[#0284c7] font-extrabold bg-blue-50/50' : 'text-slate-700 font-bold'}`}
          >
            <span>English</span>
            {currentLang === 'en' && <Check className="w-3.5 h-3.5 text-[#0284c7]" />}
          </button>
        </div>
      )}
    </div>
  );
}
