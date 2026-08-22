import React, { useRef, useState, useEffect } from 'react';
import { Doctor, Branch } from '../types';
import { Download, Check, X, RefreshCw } from 'lucide-react';

interface DoctorCardExportProps {
  doctor: Doctor;
  branches: Branch[];
  isOpen: boolean;
  onClose: () => void;
}

export const DoctorCardExport: React.FC<DoctorCardExportProps> = ({
  doctor,
  branches,
  isOpen,
  onClose,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const displayBranches = branches && branches.length > 0 ? branches : [
    {
      id: 'default-branch-1',
      name: 'فرع العيادة الرئيسي',
      address: doctor.address || 'العنوان الرئيسي للعيادة',
      phone: doctor.phone || '+201000000000',
      workingHours: 'جميع أيام الأسبوع',
      mapUrl: ''
    }
  ];

  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    setExportSuccess(false);

    try {
      await new Promise((r) => setTimeout(r, 100));

      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;

      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const image = canvas.toDataURL('image/png', 1.0);
      const cleanName = doctor.name.replace(/^دكتور\s*|^د\.\s*/, '').trim();
      const link = document.createElement('a');
      link.href = image;
      link.download = `بطاقة_دكتور_${cleanName.replace(/\s+/g, '_')}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export profile card:', err);
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  const cleanName = doctor.name.replace(/^دكتور\s*|^د\.\s*/, '').trim();

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-md bg-transparent flex flex-col items-center my-auto">
        
        {/* Modal Controls Top Bar */}
        <div className="w-full max-w-[400px] flex items-center justify-between mb-3 text-white">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadImage}
              disabled={isExporting}
              className="px-4 py-2 bg-[#10244A] hover:bg-[#1a3870] text-white text-xs font-black rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer border border-white/20"
            >
              {isExporting ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : exportSuccess ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              <span>{exportSuccess ? 'تم التحميل بنجاح!' : 'تنزيل البطاقة (PNG)'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Card Component to Capture (Starts directly with Doctor Name & Title - No Logo, No Photo) */}
        <div 
          ref={cardRef}
          className="w-[360px] sm:w-[400px] bg-white rounded-[32px] p-6 sm:p-7 shadow-2xl border border-slate-100 text-center font-sans text-neutral-900 dir-rtl select-none"
        >
          {/* Doctor Title & Name */}
          <div className="space-y-1.5 mb-4">
            <div className="text-lg font-bold text-neutral-900">
              دكتور
            </div>
            
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#00a8cc]">
                {cleanName}
              </span>
            </div>

            <div className="text-xs sm:text-sm font-bold text-neutral-800 leading-snug px-3 pt-1">
              {doctor.jobTitle || doctor.title}
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
                <div className="text-xs sm:text-sm text-neutral-700 font-medium leading-relaxed">
                  {b.address}
                </div>
                <div className="text-xs sm:text-sm text-neutral-900 font-bold dir-ltr text-right">
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
    </div>
  );
};

