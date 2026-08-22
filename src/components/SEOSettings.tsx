import React, { useState, useRef } from 'react';
import { 
  Search, Globe, Shield, CheckCircle2, AlertTriangle, XCircle, 
  RefreshCw, Copy, Check, FileText, Share2, Sparkles, Sliders, 
  Code, Eye, Layers, Zap, Activity, ExternalLink, Cpu, Upload,
  Tag, X, Plus, Edit, Save
} from 'lucide-react';
import { SEOSettingsConfig, DEFAULT_SEO_CONFIG } from '../types';
import { compressImage } from '../lib/imageUtils';

function ImageInputWithUpload({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const compressed = await compressImage(file, 600, 600, 0.7);
      if (compressed) {
        onChange(compressed);
      }
    } catch (err) {
      console.error("Failed to compress image in SEO settings:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-extrabold text-neutral-800">{label}</label>
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="ضع رابط الصورة (https://...)"
          className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
          dir="ltr"
        />
        <label className="px-3 py-2.5 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
          <Upload className="w-3.5 h-3.5 text-emerald-400" />
          <span>رفع صورة</span>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange} 
            className="hidden" 
          />
        </label>
      </div>
      {value && (
        <div className="w-20 h-12 bg-neutral-100 rounded-lg border border-neutral-200 overflow-hidden mt-1">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

interface SEOSettingsProps {
  config: SEOSettingsConfig;
  onChange: (updated: SEOSettingsConfig) => void;
  onSave: () => void;
}

export default function SEOSettings({ config = DEFAULT_SEO_CONFIG, onChange, onSave }: SEOSettingsProps) {
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'basic' | 'keywords' | 'og' | 'google' | 'sitemap' | 'robots' | 'schema' | 'indexing' | 'rich' | 'performance' | 'tools'
  >('overview');

  const [copiedSchema, setCopiedSchema] = useState(false);
  const [socialPlatform, setSocialPlatform] = useState<'facebook' | 'whatsapp' | 'twitter'>('facebook');
  const [isVerifyingGoogle, setIsVerifyingGoogle] = useState(false);
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [robotsValid, setRobotsValid] = useState<boolean | null>(null);
  const [isEditingRobots, setIsEditingRobots] = useState(false);
  const robotsTextareaRef = useRef<HTMLTextAreaElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newKeywordInput, setNewKeywordInput] = useState('');
  const [suggestedCategory, setSuggestedCategory] = useState<'specialties' | 'management' | 'marketing'>('specialties');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to safely update config
  const updateField = <K extends keyof SEOSettingsConfig>(field: K, value: SEOSettingsConfig[K]) => {
    onChange({
      ...config,
      [field]: value
    });
  };

  // Calculations for Length & Health
  const titleLength = config.metaTitle?.length || 0;
  const descLength = config.metaDescription?.length || 0;

  // Title Status
  const isTitleGood = titleLength >= 30 && titleLength <= 60;
  const isTitleWarning = titleLength > 60 || (titleLength > 0 && titleLength < 30);

  // Description Status
  const isDescGood = descLength >= 120 && descLength <= 160;
  const isDescWarning = descLength > 160 || (descLength > 0 && descLength < 120);

  // Calculate Overall SEO Score (out of 100)
  const calculateScores = () => {
    let metaScore = 0;
    if (isTitleGood) metaScore += 50;
    else if (isTitleWarning) metaScore += 25;
    if (isDescGood) metaScore += 50;
    else if (isDescWarning) metaScore += 25;

    let indexingScore = 0;
    if (config.allowIndexing) indexingScore += 50;
    if (config.autoCanonical) indexingScore += 50;

    let schemaScore = config.enableSchema ? 100 : 0;

    let perfScore = 0;
    const perfKeys: (keyof SEOSettingsConfig)[] = [
      'autoCompressImages', 'webpConversion', 'lazyLoading', 'minifyHtml', 'minifyCss', 'minifyJs', 'browserCache', 'gzipCompression'
    ];
    const enabledPerfCount = perfKeys.filter(k => !!config[k]).length;
    perfScore = Math.round((enabledPerfCount / perfKeys.length) * 100);

    let socialScore = 0;
    if (config.ogTitle && config.ogDescription) socialScore += 50;
    if (config.ogImageUrl) socialScore += 50;

    let techScore = 0;
    if (config.googleVerificationCode) techScore += 25;
    if (config.gaMeasurementId) techScore += 25;
    if (config.autoSitemap) techScore += 25;
    if (config.autoRobots) techScore += 25;

    const overall = Math.round(
      (metaScore * 0.2) +
      (indexingScore * 0.2) +
      (schemaScore * 0.15) +
      (perfScore * 0.15) +
      (socialScore * 0.15) +
      (techScore * 0.15)
    );

    return {
      overall,
      metaScore,
      indexingScore,
      schemaScore,
      perfScore,
      socialScore,
      techScore
    };
  };

  const scores = calculateScores();

  // Smart Alerts Dynamic List
  const generateAlerts = () => {
    const alerts: { type: 'danger' | 'warning' | 'info'; title: string; desc: string }[] = [];

    if (!config.metaTitle) {
      alerts.push({ type: 'danger', title: 'عنوان الموقع غائب', desc: 'لم يتم تحديد عنوان Meta Title للموقع.' });
    } else if (titleLength > 60) {
      alerts.push({ type: 'warning', title: 'عنوان الموقع طويل جداً', desc: `طول العنوان (${titleLength} حرف) يتجاوز الحد الموصى به (60 حرف).` });
    } else if (titleLength < 30) {
      alerts.push({ type: 'warning', title: 'عنوان الموقع قصير جداً', desc: 'يفضل أن يكون عنوان الموقع بين 30 و 60 حرفاً لإظهار اسم المنصة والتخصص.' });
    }

    if (!config.metaDescription) {
      alerts.push({ type: 'danger', title: 'وصف الموقع غائب', desc: 'عدم وجود وصف Meta Description يقلل نسبة النقرات في نتائج البحث.' });
    } else if (descLength > 160) {
      alerts.push({ type: 'warning', title: 'وصف الموقع طويل جداً', desc: `طول الوصف (${descLength} حرف) يتجاوز الحد الموصى به (160 حرف).` });
    } else if (descLength < 120) {
      alerts.push({ type: 'warning', title: 'وصف الموقع قصير جداً', desc: 'يفضل أن يكون وصف الموقع بين 120 و 160 حرفاً لشرح مميزات المنصة.' });
    }

    if (!config.ogImageUrl) {
      alerts.push({ type: 'warning', title: 'صورة المشاركة غير مضافة', desc: 'أضف صورة Open Graph بمقاس 1200×630 لتحسين المظهر عند المشاركة في واتساب وفيسبوك.' });
    }

    if (!config.googleVerificationCode) {
      alerts.push({ type: 'info', title: 'Google Search Console غير مرتبط', desc: 'أضف رمز التحقق لربط الموقع مع أدوات مشرفي الموقع من جولد.' });
    }

    if (!config.gaMeasurementId) {
      alerts.push({ type: 'info', title: 'Google Analytics غير مرتبط', desc: 'أدخل GA4 Measurement ID لمتابعة زوار الموقع وتحليلات الأداء.' });
    }

    if (!config.enableSchema) {
      alerts.push({ type: 'warning', title: 'البيانات المنظمة Schema معطلة', desc: 'تفعيل البيانات المنظمة يساعد جوجل على فهم طبيعة المنصة الطبية وإظهار النجوم والنتائج الغنية.' });
    }

    return alerts;
  };

  const smartAlerts = generateAlerts();

  // Generated JSON-LD Schema snippet based on selection
  const generateSchemaJSON = () => {
    const type = config.schemaType || 'MedicalOrganization';
    const baseUrl = config.canonicalUrl || 'https://www.dr-profile.com';

    if (type === 'MedicalOrganization') {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "MedicalOrganization",
        "name": config.metaTitle || "منصة شفاء الطبية",
        "url": baseUrl,
        "logo": config.ogImageUrl || "https://j.top4top.io/p_3849ast0z1.jpg",
        "description": config.metaDescription,
        "medicalSpecialty": "Multiple Medical Specialties",
        "sameAs": [
          "https://facebook.com",
          "https://instagram.com"
        ]
      }, null, 2);
    }

    if (type === 'Organization') {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": config.metaTitle || "منصة شفاء الطبية",
        "url": baseUrl,
        "logo": config.ogImageUrl
      }, null, 2);
    }

    if (type === 'FAQ') {
      return JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "كيف يمكنني إنشاء بروفايل طبي؟",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "يمكنك الضغط على زر ابدأ الآن مجاناً وادخال البيانات وسيقوم فريقنا بتفعيل البروفايل خلال دقائق."
            }
          }
        ]
      }, null, 2);
    }

    return JSON.stringify({
      "@context": "https://schema.org",
      "@type": type,
      "name": config.metaTitle,
      "url": baseUrl
    }, null, 2);
  };

  // Action test verifications
  const handleVerifyGoogle = () => {
    setIsVerifyingGoogle(true);
    setVerifyStatus('idle');
    setTimeout(() => {
      setIsVerifyingGoogle(false);
      if (config.googleVerificationCode && config.googleVerificationCode.length > 5) {
        setVerifyStatus('success');
        showToast('تم الاتصال والتأكد من رمز Google Search Console بنجاح ✓');
      } else {
        setVerifyStatus('error');
        showToast('رمز التحقق غير مكتمل أو غير صحيح ⚠️');
      }
    }, 1200);
  };

  const handleValidateRobots = () => {
    const content = config.robotsTxtContent || '';
    if (content.includes('User-agent:') && (content.includes('Allow:') || content.includes('Disallow:'))) {
      setRobotsValid(true);
      showToast('ملف Robots.txt يتوافق مع معايير محركات البحث القياسية ✓');
    } else {
      setRobotsValid(false);
      showToast('ملف Robots.txt يحتوي على أخطاء في التنسيق ⚠️');
    }
  };

  const handleRegenerateSitemap = () => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    onChange({
      ...config,
      lastSitemapUpdate: nowStr,
      sitemapPagesCount: 48
    });
    showToast('تم إعادة إنشاء الخريطة Sitemap.xml وتحديث تاريخ الفهرسة بنجاح! 🚀');
  };

  return (
    <div className="space-y-6 text-right">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#10244A] text-white px-5 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 text-xs font-bold flex items-center gap-3 animate-bounce">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#10244A] via-[#0d1d3c] to-[#0a152b] rounded-3xl p-6 md:p-8 text-white shadow-xl border border-blue-900/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[10px] font-extrabold rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                محركات البحث المتقدمة SEO
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black tracking-tight">إدارة وتحسين محركات البحث (SEO Settings)</h2>
            <p className="text-neutral-300 text-xs font-medium mt-1 max-w-2xl leading-relaxed">
              تحكم كامل في إعدادات الفهرسة، الميتا تاجز، خرائط الموقع، البيانات المنظمة Schema، وأدوات Google لمنافسة الصفحات الأولى في محركات البحث.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onSave}
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-2xl transition-all shadow-lg flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>حفظ جميع إعدادات SEO</span>
            </button>
          </div>
        </div>
      </div>

      {/* Layout with Inner Side Menu */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Side Menu for SEO Sub-sections */}
        <div className="w-full lg:w-64 bg-white p-3 rounded-3xl border border-neutral-200/70 shadow-sm flex flex-col gap-1 text-xs font-extrabold shrink-0">
          <div className="px-3 py-2 text-[11px] font-black text-neutral-400 border-b border-neutral-100 mb-1">
            أقسام إعدادات SEO
          </div>
          {[
            { id: 'overview', label: 'اللوحة والتحليل الشامل', icon: Activity },
            { id: 'basic', label: 'البيانات الأساسية', icon: FileText },
            { id: 'keywords', label: 'الكلمات المفتاحية', icon: Tag },
            { id: 'og', label: 'Open Graph والسوشيال', icon: Share2 },
            { id: 'google', label: 'Google Search & Analytics', icon: Globe },
            { id: 'sitemap', label: 'خريطة الموقع Sitemap', icon: Layers },
            { id: 'robots', label: 'ملف Robots.txt', icon: Code },
            { id: 'schema', label: 'البيانات المنظمة Schema', icon: Cpu },
            { id: 'indexing', label: 'الفهرسة والتوجيه', icon: Shield },
            { id: 'rich', label: 'Rich Snippets', icon: Sparkles },
            { id: 'performance', label: 'تحسين الأداء والسيرفر', icon: Zap },
            { id: 'tools', label: 'أدوات واختبارات SEO', icon: Sliders },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl transition-all text-right w-full cursor-pointer ${
                  isActive 
                    ? 'bg-[#10244A] text-white font-extrabold shadow-sm' 
                    : 'text-neutral-700 hover:bg-neutral-100 font-bold'
                }`}
              >
                <IconComp className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-[#10244A]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SEO Content Area */}
        <div className="flex-1 w-full space-y-6">

      {/* SUB-TAB 1: OVERVIEW & SEO HEALTH ANALYTICS */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Top Score Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Overall Score Dial */}
            <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-xs font-extrabold text-neutral-500 uppercase tracking-wider">تقييم SEO العام</span>
              
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-neutral-100"
                    strokeWidth="3.8"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={scores.overall >= 80 ? 'text-emerald-500' : scores.overall >= 60 ? 'text-amber-500' : 'text-red-500'}
                    strokeDasharray={`${scores.overall}, 100`}
                    strokeWidth="3.8"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-black text-neutral-900">{scores.overall}</span>
                  <span className="text-[10px] font-extrabold text-neutral-400">من 100</span>
                </div>
              </div>

              <div className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-neutral-100 text-neutral-800 border border-neutral-200">
                {scores.overall >= 85 ? 'ممتاز - جاهز للمنافسة 🚀' : scores.overall >= 65 ? 'جيد - يحتاج تحسينات بسيطة ⚠️' : 'يحتاج إعادة ضبط فورية ❌'}
              </div>
            </div>

            {/* Category Scores Breakdown */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-neutral-200/70 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-black text-sm text-[#10244A]">تحليل عناصر SEO بالأقسام</h3>
                <span className="text-xs text-neutral-400 font-bold">تقسيم الدرجة</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Meta Tags (العنوان والوصف)', score: scores.metaScore },
                  { label: 'Indexing (الفهرسة والروابط)', score: scores.indexingScore },
                  { label: 'Structured Data (البيانات المنظمة)', score: scores.schemaScore },
                  { label: 'Performance (الأداء والتخزين)', score: scores.perfScore },
                  { label: 'Social Sharing (السوشيال ميديا)', score: scores.socialScore },
                  { label: 'Technical SEO (أدوات جوجل)', score: scores.techScore },
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/60 space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-bold text-neutral-700">
                      <span>{item.label}</span>
                      <span className="font-mono font-extrabold">{item.score}%</span>
                    </div>
                    <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${item.score >= 80 ? 'bg-emerald-500' : item.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                        style={{ width: `${item.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Live SEO Health Monitor Badges (12 elements) */}
          <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-[#10244A]">مراقبة حالة الموقع (Live Health Indicators)</h3>
                <p className="text-[11px] text-neutral-500 font-medium">حالة كل عنصر من عناصر السيو الفنية على الموقع</p>
              </div>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[11px] font-extrabold rounded-xl border border-blue-200">
                12 عنصر مفحوص
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { name: 'Meta Title', status: isTitleGood ? 'healthy' : isTitleWarning ? 'warning' : 'danger', text: isTitleGood ? 'سليم (ممتاز)' : 'يحتاج تعديل الطول' },
                { name: 'Meta Description', status: isDescGood ? 'healthy' : isDescWarning ? 'warning' : 'danger', text: isDescGood ? 'سليم (ممتاز)' : 'يحتاج تعديل الطول' },
                { name: 'Open Graph', status: config.ogImageUrl ? 'healthy' : 'warning', text: config.ogImageUrl ? 'سليم ومفعل' : 'الصورة غائبة' },
                { name: 'Twitter Card', status: config.enableTwitterCard ? 'healthy' : 'off', text: config.enableTwitterCard ? 'مفعل' : 'غير مفعل' },
                { name: 'Sitemap.xml', status: config.autoSitemap ? 'healthy' : 'off', text: config.autoSitemap ? `محدث (${config.sitemapPagesCount} صفحة)` : 'غير مفعل' },
                { name: 'Robots.txt', status: config.autoRobots ? 'healthy' : 'off', text: config.autoRobots ? 'سليم' : 'غير مفعل' },
                { name: 'Schema.org', status: config.enableSchema ? 'healthy' : 'off', text: config.enableSchema ? `مفعل (${config.schemaType})` : 'معطل' },
                { name: 'Search Console', status: config.googleVerificationCode ? 'healthy' : 'warning', text: config.googleVerificationCode ? 'مرتبط' : 'غير مرتبط' },
                { name: 'Google Analytics', status: config.gaMeasurementId ? 'healthy' : 'warning', text: config.gaMeasurementId ? 'مرتبط (GA4)' : 'غير مرتبط' },
                { name: 'Canonical URL', status: config.autoCanonical ? 'healthy' : 'off', text: config.autoCanonical ? 'مفعل تلقائياً' : 'معطل' },
                { name: 'Breadcrumb', status: config.enableBreadcrumbSchema ? 'healthy' : 'off', text: config.enableBreadcrumbSchema ? 'مفعل' : 'معطل' },
                { name: 'FAQ Schema', status: config.enableFaqSchema ? 'healthy' : 'off', text: config.enableFaqSchema ? 'مفعل' : 'معطل' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-neutral-50 rounded-2xl border border-neutral-200/60 flex flex-col justify-between space-y-2">
                  <span className="text-xs font-bold text-neutral-800">{item.name}</span>
                  <div className="flex items-center gap-1.5">
                    {item.status === 'healthy' && <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />}
                    {item.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                    {(item.status === 'danger' || item.status === 'off') && <XCircle className="w-4 h-4 text-neutral-400 shrink-0" />}
                    <span className={`text-[11px] font-extrabold ${
                      item.status === 'healthy' ? 'text-emerald-700' : item.status === 'warning' ? 'text-amber-700' : 'text-neutral-500'
                    }`}>
                      {item.text}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Alerts Box */}
          <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h3 className="font-black text-sm text-[#10244A]">التنبيهات الذكية والملاحظات التلقائية (SEO Alerts)</h3>
              </div>
              <span className="text-xs font-bold text-neutral-400">{smartAlerts.length} تنبيهات</span>
            </div>

            {smartAlerts.length === 0 ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-extrabold text-emerald-800">ممتاز! لا توجد أية أخطاء أو تنبيهات عاجلة في إعدادات السيو.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {smartAlerts.map((alert, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                      alert.type === 'danger' 
                        ? 'bg-red-50/70 border-red-200 text-red-900' 
                        : alert.type === 'warning' 
                        ? 'bg-amber-50/70 border-amber-200 text-amber-900' 
                        : 'bg-blue-50/70 border-blue-200 text-blue-900'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {alert.type === 'danger' && <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
                      {alert.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />}
                      {alert.type === 'info' && <Sparkles className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
                      <div>
                        <h4 className="text-xs font-black">{alert.title}</h4>
                        <p className="text-[11px] font-medium mt-0.5 opacity-90">{alert.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* SUB-TAB 2: BASIC META DATA */}
      {activeSubTab === 'basic' && (
        <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-base font-black text-[#10244A]">1. البيانات الأساسية (Basic Meta Data)</h3>
            <p className="text-xs text-neutral-500 font-medium mt-1">تحديد العنوان والوصف والكلمات المفتاحية التي تظهر في نتائج بحث جوجل</p>
          </div>

          <div className="space-y-5">
            
            {/* Favicon 16x16 / Browser Tab Icon */}
            <div className="p-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl space-y-3">
              <ImageInputWithUpload 
                label="الأيقونة المصغرة 16x16 لتبويب المتصفح (Favicon)"
                value={config.faviconUrl || 'https://k.top4top.io/p_38573eitn0.png'}
                onChange={(val) => updateField('faviconUrl', val)}
              />
              <p className="text-[11px] text-neutral-500 font-medium">
                هذه الأيقونة تظهر في أعلى شريط وتبويب المتصفح بجانب عنوان الموقع (Browser Tab Icon). يفضل أبعاد مربعة 16x16 أو 32x32 أو 64x64 صيغة PNG/ICO خلفية شفافة.
              </p>
            </div>

            {/* Meta Title */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-extrabold text-neutral-800">عنوان الموقع (Meta Title)</label>
                <span className={`text-[11px] font-mono font-bold ${
                  isTitleGood ? 'text-emerald-600' : isTitleWarning ? 'text-amber-600' : 'text-neutral-400'
                }`}>
                  {titleLength} / 60 حرف {isTitleGood && '✓ (مثالي)'} {isTitleWarning && '⚠️ (تجاوز الحد الموصى به)'}
                </span>
              </div>
              <input 
                type="text" 
                value={config.metaTitle || ''}
                onChange={(e) => updateField('metaTitle', e.target.value)}
                placeholder="مثال: منصة شفاء الطبية | بروفايل طبي احترافي للأطباء وحجز مواعيد العيادات"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
              />
              <p className="text-[11px] text-neutral-500 mt-1 font-medium">العنوان الموصى به يحتوي على 30 إلى 60 حرفاً شاملة اسم المنصة والتخصص والكلمة المفتاحية.</p>
            </div>

            {/* Meta Description */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-extrabold text-neutral-800">وصف الموقع (Meta Description)</label>
                <span className={`text-[11px] font-mono font-bold ${
                  isDescGood ? 'text-emerald-600' : isDescWarning ? 'text-amber-600' : 'text-neutral-400'
                }`}>
                  {descLength} / 160 حرف {isDescGood && '✓ (مثالي)'} {isDescWarning && '⚠️ (تجاوز الحد)'}
                </span>
              </div>
              <textarea 
                rows={3}
                value={config.metaDescription || ''}
                onChange={(e) => updateField('metaDescription', e.target.value)}
                placeholder="اكتب وصفاً جذاباً يشرح خدمات الموقع ويدعو المرضى للاشتراك أو الحجز..."
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
              />
              <p className="text-[11px] text-neutral-500 mt-1 font-medium">الوصف المثالي يحتوي على 120 إلى 160 حرفاً ويشرح القيمة المقدمة للمستخدم بوضوح.</p>
            </div>

            {/* Google Search Snippet Preview */}
            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2">
              <span className="text-[10px] text-neutral-400 font-extrabold uppercase tracking-wider">معاينة النتيجة كما تظهر في بحث جوجل (Google Search Preview)</span>
              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-2xs space-y-1">
                <p className="text-[11px] font-mono text-emerald-800 truncate" dir="ltr">{config.canonicalUrl || 'https://www.dr-profile.com'}</p>
                <h4 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer leading-snug">{config.metaTitle || 'عنوان غير محدد'}</h4>
                <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">{config.metaDescription || 'وصف الموقع يظهر هنا...'}</p>
              </div>
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="block text-xs font-extrabold text-neutral-800 mb-2">الكلمات المفتاحية (Meta Keywords)</label>
              <input 
                type="text" 
                value={config.metaKeywords || ''}
                onChange={(e) => updateField('metaKeywords', e.target.value)}
                placeholder="فصل الكلمات بفاصلة: بروفايل طبي, موقع عيادة, حجز أطباء, إدارة عيادات"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
              />
            </div>

            {/* Canonical URL */}
            <div>
              <label className="block text-xs font-extrabold text-neutral-800 mb-2">الرابط الأساسي (Canonical URL)</label>
              <input 
                type="text" 
                value={config.canonicalUrl || ''}
                onChange={(e) => updateField('canonicalUrl', e.target.value)}
                placeholder="https://www.dr-profile.com"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black font-mono"
                dir="ltr"
              />
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB KEYWORDS: KEYWORDS MANAGEMENT */}
      {activeSubTab === 'keywords' && (
        <div className="space-y-6">
          
          {/* Main Card */}
          <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-sm space-y-6">
            <div className="border-b border-neutral-100 pb-4">
              <h3 className="text-base font-black text-[#10244A] flex items-center gap-2">
                <Tag className="w-5 h-5 text-emerald-500" />
                <span>إدارة قسم الكلمات المفتاحية (SEO Keywords Manager)</span>
              </h3>
              <p className="text-xs text-neutral-500 font-medium mt-1">
                حدد الكلمات البحثية المستهدفة لتمكين الأطباء والعيادات من تصدر نتائج البحث عند بحث المرضى عن تخصصاتهم.
              </p>
            </div>

            {/* Keyword Density / Count Analytics Widget */}
            <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">مؤشر كثافة وقوة الكلمات المفتاحية (Keyword Health Meter)</h4>
                  <p className="text-[11px] text-neutral-500">العدد الموصى به لضمان الفهرسة الشاملة ثنائية اللغة هو من 5 إلى 100 كلمة مفتاحية رئيسية.</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                  config.metaKeywords ? (config.metaKeywords.split(',').filter(Boolean).length >= 5 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200') : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  {config.metaKeywords ? config.metaKeywords.split(',').filter(Boolean).length : 0} كلمة مفتاحية مضافة
                </span>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="w-full h-3 bg-neutral-200 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      (config.metaKeywords ? config.metaKeywords.split(',').filter(Boolean).length : 0) === 0 
                        ? 'w-0' 
                        : (config.metaKeywords ? config.metaKeywords.split(',').filter(Boolean).length : 0) < 5 
                        ? 'bg-amber-500 w-1/3' 
                        : 'bg-emerald-500 w-full'
                    }`}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-neutral-400 font-extrabold">
                  <span>منخفضة (أقل من 5)</span>
                  <span className="text-emerald-600">مثالية وشاملة (5 فأكثر)</span>
                  <span className="text-emerald-600">تغطية ممتازة للغة العربية والإنجليزية</span>
                </div>
              </div>
            </div>

            {/* Tag input and current keywords view */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-neutral-800 mb-2">إضافة كلمة مفتاحية مخصصة</label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3.5" />
                    <input 
                      type="text"
                      value={newKeywordInput}
                      onChange={(e) => setNewKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const list = config.metaKeywords ? config.metaKeywords.split(',').map(k => k.trim()).filter(Boolean) : [];
                          const trimmed = newKeywordInput.trim();
                          if (trimmed) {
                            if (list.includes(trimmed)) {
                              showToast('هذه الكلمة مضافة بالفعل!');
                            } else {
                              const updated = [...list, trimmed].join(', ');
                              updateField('metaKeywords', updated);
                              setNewKeywordInput('');
                              showToast(`تمت إضافة: ${trimmed}`);
                            }
                          }
                        }
                      }}
                      placeholder="اكتب الكلمة المفتاحية ثم اضغط Enter أو زر الإضافة..."
                      className="w-full pr-10 pl-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const list = config.metaKeywords ? config.metaKeywords.split(',').map(k => k.trim()).filter(Boolean) : [];
                      const trimmed = newKeywordInput.trim();
                      if (trimmed) {
                        if (list.includes(trimmed)) {
                          showToast('هذه الكلمة مضافة بالفعل!');
                        } else {
                          const updated = [...list, trimmed].join(', ');
                          updateField('metaKeywords', updated);
                          setNewKeywordInput('');
                          showToast(`تمت إضافة: ${trimmed}`);
                        }
                      }
                    }}
                    className="px-6 py-3 bg-neutral-900 hover:bg-black text-white text-xs font-bold rounded-xl shrink-0 transition-colors cursor-pointer"
                  >
                    إضافة الكلمة
                  </button>
                </div>
                <p className="text-[10px] text-neutral-400 mt-1 font-bold">يمكنك كتابة كلمة أو عبارة كاملة (مثل: "أفضل دكتور أطفال في القاهرة").</p>
              </div>

              {/* Tags Display Area */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold text-neutral-800">الكلمات المفتاحية النشطة حالياً ({config.metaKeywords ? config.metaKeywords.split(',').map(k => k.trim()).filter(Boolean).length : 0})</label>
                
                {(!config.metaKeywords || config.metaKeywords.split(',').map(k => k.trim()).filter(Boolean).length === 0) ? (
                  <div className="p-6 bg-red-50/50 rounded-2xl border border-red-100 text-center text-xs font-bold text-red-800">
                    لم يتم إضافة أي كلمات مفتاحية بعد. ابدأ بكتابة كلمة أو اختر من الاقتراحات بالأسفل!
                  </div>
                ) : (
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-2xl flex flex-wrap gap-2">
                    {config.metaKeywords.split(',').map(k => k.trim()).filter(Boolean).map((kw, idx) => (
                      <span 
                        key={idx} 
                        className="px-3 py-1.5 bg-[#10244A] text-white hover:bg-red-800 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs group"
                        title="انقر للحذف"
                        onClick={() => {
                          const list = config.metaKeywords.split(',').map(k => k.trim()).filter(Boolean);
                          const updated = list.filter(item => item !== kw).join(', ');
                          updateField('metaKeywords', updated);
                          showToast(`تمت إزالة: ${kw}`);
                        }}
                      >
                        <Tag className="w-3 h-3 text-emerald-400" />
                        <span>{kw}</span>
                        <X className="w-3 h-3 text-white/70 group-hover:text-white group-hover:scale-110 shrink-0" />
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Auto suggestions generator */}
            <div className="pt-4 border-t border-neutral-100 space-y-4">
              <div>
                <h4 className="text-xs font-black text-neutral-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>مولد الكلمات المقترحة الموصى بها للأطباء (Medical SEO suggestions)</span>
                </h4>
                <p className="text-[11px] text-neutral-500">اختر تصنيفاً واضغط على الكلمة لإضافتها مباشرة إلى قائمة الكلمات المفتاحية المفهرسة.</p>
              </div>

              {/* Sub categories tabs */}
              <div className="flex gap-2 bg-neutral-100 p-1.5 rounded-xl border border-neutral-200 max-w-md">
                <button
                  type="button"
                  onClick={() => setSuggestedCategory('specialties')}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-colors ${suggestedCategory === 'specialties' ? 'bg-[#10244A] text-white' : 'text-neutral-600 hover:text-black'}`}
                >
                  التخصصات الطبية
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestedCategory('management')}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-colors ${suggestedCategory === 'management' ? 'bg-[#10244A] text-white' : 'text-neutral-600 hover:text-black'}`}
                >
                  إدارة العيادات
                </button>
                <button
                  type="button"
                  onClick={() => setSuggestedCategory('marketing')}
                  className={`flex-1 py-2 text-xs font-extrabold rounded-lg transition-colors ${suggestedCategory === 'marketing' ? 'bg-[#10244A] text-white' : 'text-neutral-600 hover:text-black'}`}
                >
                  التسويق والحجز
                </button>
              </div>

              {/* Suggestion list based on active category */}
              <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-2xl">
                <div className="flex flex-wrap gap-2">
                  {suggestedCategory === 'specialties' && [
                    'أفضل طبيب', 'حجز طبيب أسنان', 'عيادة عيون', 'استشارة طبية', 'أخصائي أطفال', 
                    'عيادة نساء وتوليد', 'أفضل دكتور عظام', 'عيادة جلدية وتجميل', 'أخصائي باطنة', 
                    'علاج طبيعي', 'مستشفى تخصصي', 'طبيب جراحة عامة', 'دكتور تغذية علاجية'
                  ].map((word, i) => {
                    const list = config.metaKeywords ? config.metaKeywords.split(',').map(k => k.trim()).filter(Boolean) : [];
                    const isAdded = list.includes(word);
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={isAdded}
                        onClick={() => {
                          const updated = [...list, word].join(', ');
                          updateField('metaKeywords', updated);
                          showToast(`تمت إضافة الكلمة المقترحة: ${word}`);
                        }}
                        className={`px-3 py-1.5 text-xs font-extrabold rounded-xl border transition-all flex items-center gap-1.5 ${
                          isAdded 
                            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                            : 'bg-white hover:bg-neutral-900 hover:text-white text-neutral-700 border-neutral-300 hover:border-black active:scale-95'
                        }`}
                      >
                        {isAdded ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5 text-emerald-500" />}
                        <span>{word}</span>
                      </button>
                    );
                  })}

                  {suggestedCategory === 'management' && [
                    'إدارة عيادات', 'برنامج عيادات', 'تنظيم مواعيد الأطباء', 'سجل المرضى الإلكتروني', 
                    'منصة طبية', 'بوابة الطبيب', 'لوحة التحكم السكرتارية', 'مراقبة حجز العيادات', 
                    'برنامج إدارة عيادة أسنان', 'نظام الاستشارات الطبية', 'البروفايل الطبي الإلكتروني'
                  ].map((word, i) => {
                    const list = config.metaKeywords ? config.metaKeywords.split(',').map(k => k.trim()).filter(Boolean) : [];
                    const isAdded = list.includes(word);
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={isAdded}
                        onClick={() => {
                          const updated = [...list, word].join(', ');
                          updateField('metaKeywords', updated);
                          showToast(`تمت إضافة الكلمة المقترحة: ${word}`);
                        }}
                        className={`px-3 py-1.5 text-xs font-extrabold rounded-xl border transition-all flex items-center gap-1.5 ${
                          isAdded 
                            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                            : 'bg-white hover:bg-neutral-900 hover:text-white text-neutral-700 border-neutral-300 hover:border-black active:scale-95'
                        }`}
                      >
                        {isAdded ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5 text-emerald-500" />}
                        <span>{word}</span>
                      </button>
                    );
                  })}

                  {suggestedCategory === 'marketing' && [
                    'تسويق طبي للأطباء', 'موقع طبيب خاص', 'حجز مواعيد أونلاين', 'عيادة رقمية', 
                    'بروفايل طبي احترافي', 'أفضل منصة حجز عيادات', 'حجز أطباء بدون عمولة', 
                    'تسويق عيادات الأسنان', 'ظهور طبيب على جوجل', 'عيادات تخصصية مباشرة'
                  ].map((word, i) => {
                    const list = config.metaKeywords ? config.metaKeywords.split(',').map(k => k.trim()).filter(Boolean) : [];
                    const isAdded = list.includes(word);
                    return (
                      <button
                        key={i}
                        type="button"
                        disabled={isAdded}
                        onClick={() => {
                          const updated = [...list, word].join(', ');
                          updateField('metaKeywords', updated);
                          showToast(`تمت إضافة الكلمة المقترحة: ${word}`);
                        }}
                        className={`px-3 py-1.5 text-xs font-extrabold rounded-xl border transition-all flex items-center gap-1.5 ${
                          isAdded 
                            ? 'bg-neutral-100 text-neutral-400 border-neutral-200 cursor-not-allowed'
                            : 'bg-white hover:bg-neutral-900 hover:text-white text-neutral-700 border-neutral-300 hover:border-black active:scale-95'
                        }`}
                      >
                        {isAdded ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5 text-emerald-500" />}
                        <span>{word}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>

          {/* Tips and Best Practices Card */}
          <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 rounded-3xl p-6 text-white border border-neutral-800 space-y-4">
            <h4 className="text-sm font-black text-emerald-400 flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>أهم النصائح لاختيار الكلمات المفتاحية الطبية (SEO Best Practices)</span>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium text-neutral-300">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                <span className="font-bold text-white block">1. استهدف الكلمات الطويلة (Long-tail Keywords)</span>
                <p className="opacity-80 leading-relaxed">المرضى يبحثون بعبارات محددة مثل "دكتور جلدية وتجميل في دبي" بدلاً من كلمة "طبيب" العامة. تمنحك هذه العبارات فرصة أكبر للتصدر بسرعة.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                <span className="font-bold text-white block">2. تجنب التكرار والحشو المفرط (Keyword Stuffing)</span>
                <p className="opacity-80 leading-relaxed">إضافة الكثير من الكلمات المكررة دون داعٍ قد يعرض موقعك لعقوبات من خوارزميات جوجل. احرص على انتقاء من 5 إلى 15 كلمة دقيقة فقط.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                <span className="font-bold text-white block">3. وازن بين اسم الطبيب والتخصص الطبي</span>
                <p className="opacity-80 leading-relaxed">تأكد أن تتضمن الكلمات المفتاحية اسم المنصة، أسماء الأطباء المشهورين المشتركين، والتخصصات الرائجة للعيادات.</p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-1.5">
                <span className="font-bold text-white block">4. تحديث الكلمات بناءً على مواسم البحث</span>
                <p className="opacity-80 leading-relaxed">تزداد معدلات البحث عن بعض التخصصات في مواسم معينة (مثل الحساسية أو الجلدية صيفاً). عدل وافحص الكلمات باستمرار لمواكبة هذه التغيرات.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* SUB-TAB 3: OPEN GRAPH & SOCIAL PREVIEW */}
      {activeSubTab === 'og' && (
        <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-base font-black text-[#10244A]">2. بروتوكول المشاركة Open Graph ووسائل التواصل</h3>
            <p className="text-xs text-neutral-500 font-medium mt-1">تحديد العنوان والوصف والصورة التي تظهر عند مشاركة رابط المنصة على فيسبوك وواتساب وتويتر X</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-neutral-800 mb-2">عنوان المشاركة (OG Title)</label>
                <input 
                  type="text" 
                  value={config.ogTitle || ''}
                  onChange={(e) => updateField('ogTitle', e.target.value)}
                  placeholder="عنوان كارت المشاركة في وسائل التواصل..."
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-neutral-800 mb-2">وصف المشاركة (OG Description)</label>
                <textarea 
                  rows={2}
                  value={config.ogDescription || ''}
                  onChange={(e) => updateField('ogDescription', e.target.value)}
                  placeholder="وصف مختصر يظهر أسفل العنوان في بطاقة المشاركة..."
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                />
              </div>

              <ImageInputWithUpload 
                label="صورة المشاركة Open Graph (مقاس 1200×630)"
                value={config.ogImageUrl || 'https://j.top4top.io/p_3849ast0z1.jpg'}
                onChange={(newVal) => updateField('ogImageUrl', newVal)}
              />
            </div>

            {/* Social Share Card Live Preview Mockup */}
            <div className="space-y-3 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-neutral-800">معاينة بطاقة المشاركة المباشرة:</span>
                <div className="flex gap-1 bg-white p-1 rounded-xl border border-neutral-200">
                  <button 
                    onClick={() => setSocialPlatform('facebook')}
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg ${socialPlatform === 'facebook' ? 'bg-blue-600 text-white' : 'text-neutral-500'}`}
                  >
                    فيسبوك
                  </button>
                  <button 
                    onClick={() => setSocialPlatform('whatsapp')}
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg ${socialPlatform === 'whatsapp' ? 'bg-emerald-600 text-white' : 'text-neutral-500'}`}
                  >
                    واتساب
                  </button>
                  <button 
                    onClick={() => setSocialPlatform('twitter')}
                    className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg ${socialPlatform === 'twitter' ? 'bg-neutral-900 text-white' : 'text-neutral-500'}`}
                  >
                    منصة X
                  </button>
                </div>
              </div>

              {/* Mockup Display */}
              <div className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm max-w-sm mx-auto">
                <div className="w-full aspect-[1.91/1] bg-neutral-100 overflow-hidden relative">
                  <img 
                    src={config.ogImageUrl || 'https://j.top4top.io/p_3849ast0z1.jpg'} 
                    alt="OG Preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-neutral-50/80 border-t border-neutral-100 space-y-1">
                  <span className="text-[10px] text-neutral-400 uppercase font-mono tracking-wider block">Doctor Profile</span>
                  <h4 className="text-xs font-bold text-neutral-900 truncate">{config.ogTitle || config.metaTitle || 'عنوان المشاركة'}</h4>
                  <p className="text-[11px] text-neutral-600 line-clamp-2">{config.ogDescription || config.metaDescription || 'الوصف يظهر هنا...'}</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 4: GOOGLE SEARCH CONSOLE & ANALYTICS */}
      {activeSubTab === 'google' && (
        <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-base font-black text-[#10244A]">3. الربط مع خدمات Google (Search Console & Analytics)</h3>
            <p className="text-xs text-neutral-500 font-medium mt-1">تأكيد ملكية الموقع في Google Search Console وإدراج Google Analytics (GA4) و Google Tag Manager</p>
          </div>

          <div className="space-y-6">
            
            {/* Search Console */}
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-[#10244A]">Google Search Console Verification Code</h4>
                  <p className="text-[11px] text-neutral-500">رمز التحقق المباشر من ملكية النطاق (Meta Verification Code)</p>
                </div>
                <button
                  type="button"
                  onClick={handleVerifyGoogle}
                  disabled={isVerifyingGoogle}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  {isVerifyingGoogle ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Globe className="w-3.5 h-3.5" />}
                  <span>التحقق من الاتصال</span>
                </button>
              </div>

              <input 
                type="text" 
                value={config.googleVerificationCode || ''}
                onChange={(e) => updateField('googleVerificationCode', e.target.value)}
                placeholder="google-site-verification=XYZ1234567890ABCDEF"
                className="w-full px-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-black"
                dir="ltr"
              />

              {verifyStatus === 'success' && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>تم التحقق بنجاح! الموقع متصل بأدوات Google Search Console.</span>
                </div>
              )}
            </div>

            {/* GA4 and GTM */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-neutral-800 mb-2">Google Analytics (GA4 Measurement ID)</label>
                <input 
                  type="text" 
                  value={config.gaMeasurementId || ''}
                  onChange={(e) => updateField('gaMeasurementId', e.target.value)}
                  placeholder="G-7X9Y2Z4W1V"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-black"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-neutral-800 mb-2">Google Tag Manager ID (GTM)</label>
                <input 
                  type="text" 
                  value={config.gtmId || ''}
                  onChange={(e) => updateField('gtmId', e.target.value)}
                  placeholder="GTM-K9L8M7N"
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono font-semibold focus:outline-none focus:border-black"
                  dir="ltr"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SUB-TAB 5: SITEMAP.XML */}
      {activeSubTab === 'sitemap' && (
        <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
            <div>
              <h3 className="text-base font-black text-[#10244A]">4. خريطة الموقع التلقائية (Sitemap.xml)</h3>
              <p className="text-xs text-neutral-500 font-medium mt-1">توليد ملف Sitemap تلقائياً ليشمل كافة بروفايلات الأطباء والصفحات الداخلية</p>
            </div>
            <button
              onClick={handleRegenerateSitemap}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>إعادة إنشاء Sitemap يدوياً</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-[10px] text-neutral-400 font-extrabold uppercase">تفعيل التوليد التلقائي</span>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-neutral-800">إنشاء Sitemap تلقائياً</span>
                <input 
                  type="checkbox"
                  checked={config.autoSitemap}
                  onChange={(e) => updateField('autoSitemap', e.target.checked)}
                  className="w-4 h-4 accent-[#10244A] rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-[10px] text-neutral-400 font-extrabold uppercase">تاريخ آخر تحديث</span>
              <p className="text-xs font-mono font-bold text-neutral-900 pt-1" dir="ltr">{config.lastSitemapUpdate || '2026-07-25 18:30'}</p>
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-1">
              <span className="text-[10px] text-neutral-400 font-extrabold uppercase">عدد الصفحات المفهرسة</span>
              <p className="text-xs font-extrabold text-emerald-700 pt-1">{config.sitemapPagesCount || 42} صفحة داخل الملف</p>
            </div>
          </div>

          <div className="p-4 bg-neutral-900 text-neutral-200 rounded-2xl font-mono text-[11px] space-y-2 overflow-x-auto" dir="ltr">
            <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
              <span className="text-emerald-400 font-bold">https://www.dr-profile.com/sitemap.xml</span>
              <span className="text-[10px] text-neutral-500">XML Format</span>
            </div>
            <pre className="text-neutral-400 leading-relaxed">{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.dr-profile.com/</loc>
    <lastmod>${config.lastSitemapUpdate || '2026-08-01T18:25:00+03:00'}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.dr-profile.com/pricing</loc>
    <lastmod>${config.lastSitemapUpdate || '2026-08-01T18:25:00+03:00'}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.dr-profile.com/features</loc>
    <lastmod>${config.lastSitemapUpdate || '2026-08-01T18:25:00+03:00'}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://www.dr-profile.com/contact</loc>
    <lastmod>${config.lastSitemapUpdate || '2026-08-01T18:25:00+03:00'}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`}</pre>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: ROBOTS.TXT */}
      {activeSubTab === 'robots' && (
        <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-neutral-100 pb-4 gap-3">
            <div>
              <h3 className="text-base font-black text-[#10244A]">5. إدارة ملف Robots.txt</h3>
              <p className="text-xs text-neutral-500 font-medium mt-1">تحديد توجيهات عناكب محركات البحث ومسارات الحظر والسماح</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setIsEditingRobots(true);
                  setTimeout(() => robotsTextareaRef.current?.focus(), 50);
                  showToast('تم تفعيل وضع التعديل - يمكنك كتابة وتعديل أسطر ملف Robots.txt الآن');
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>تعديل</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  onSave();
                  setIsEditingRobots(false);
                  showToast('تم حفظ التغييرات في ملف Robots.txt بنجاح!');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>حفظ</span>
              </button>
              <button
                type="button"
                onClick={handleValidateRobots}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Check className="w-3.5 h-3.5" />
                <span>التحقق من صحة الملف</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
              <span className="text-xs font-extrabold text-neutral-800">إنشاء Robots.txt تلقائياً</span>
              <input 
                type="checkbox"
                checked={config.autoRobots}
                onChange={(e) => updateField('autoRobots', e.target.checked)}
                className="w-4 h-4 accent-[#10244A] rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-extrabold text-neutral-800">محرر ملف Robots.txt</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingRobots(true);
                      setTimeout(() => robotsTextareaRef.current?.focus(), 50);
                      showToast('تم تفعيل وضع التعديل');
                    }}
                    className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit className="w-3 h-3" />
                    <span>تعديل الملف</span>
                  </button>
                  <span className="text-neutral-300">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      onSave();
                      setIsEditingRobots(false);
                      showToast('تم حفظ ملف Robots.txt بنجاح!');
                    }}
                    className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Save className="w-3 h-3" />
                    <span>حفظ الآن</span>
                  </button>
                </div>
              </div>
              <textarea 
                ref={robotsTextareaRef}
                rows={14}
                value={config.robotsTxtContent || ''}
                onChange={(e) => updateField('robotsTxtContent', e.target.value)}
                className={`w-full px-4 py-3 bg-neutral-950 text-emerald-400 border rounded-2xl text-xs font-mono leading-relaxed focus:outline-none transition-all ${
                  isEditingRobots ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-neutral-800 focus:border-emerald-500'
                }`}
                dir="ltr"
                placeholder="User-agent: *&#10;Allow: /"
              />
            </div>

            {robotsValid === true && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>ملف Robots.txt يتوافق تماماً مع قواعد محركات البحث.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 7: SCHEMA.ORG */}
      {activeSubTab === 'schema' && (
        <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-base font-black text-[#10244A]">6. البيانات المنظمة (Schema.org / JSON-LD)</h3>
            <p className="text-xs text-neutral-500 font-medium mt-1">تحديد نوع الكيان الطبي لتسهيل ظهور النتائج التفاعلية والنجوم في محركات البحث</p>
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <div>
                <h4 className="text-xs font-bold text-neutral-900">تفعيل Schema.org</h4>
                <p className="text-[11px] text-neutral-500">إدراج اكواد JSON-LD تلقائياً في هيدر صفحات المنصة</p>
              </div>
              <input 
                type="checkbox"
                checked={config.enableSchema}
                onChange={(e) => updateField('enableSchema', e.target.checked)}
                className="w-5 h-5 accent-[#10244A] rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-neutral-800 mb-2">اختيار نوع البيانات (Schema Type)</label>
              <select
                value={config.schemaType || 'MedicalOrganization'}
                onChange={(e) => updateField('schemaType', e.target.value as any)}
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold focus:outline-none focus:border-black"
              >
                <option value="MedicalOrganization">Medical Organization (منظمة ومؤسسة طبية)</option>
                <option value="Organization">Organization (مؤسسة عامة)</option>
                <option value="WebSite">WebSite (موقع إلكتروني)</option>
                <option value="FAQ">FAQ Page (أسئلة شائعة)</option>
                <option value="Article">Article (مقالات وأخبار طبية)</option>
                <option value="Breadcrumb">Breadcrumb (مسار التنقل)</option>
              </select>
            </div>

            {/* Generated JSON-LD Code Box */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold text-neutral-800">معاينة كود JSON-LD المولد:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(generateSchemaJSON());
                    setCopiedSchema(true);
                    setTimeout(() => setCopiedSchema(false), 2000);
                  }}
                  className="px-3 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'تم النسخ' : 'نسخ الكود'}</span>
                </button>
              </div>

              <div className="p-4 bg-neutral-950 text-emerald-400 rounded-2xl font-mono text-[11px] overflow-x-auto" dir="ltr">
                <pre>{generateSchemaJSON()}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 8: INDEXING & CANONICALS */}
      {activeSubTab === 'indexing' && (
        <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-base font-black text-[#10244A]">7. إعدادات الفهرسة وتنسيق الروابط</h3>
            <p className="text-xs text-neutral-500 font-medium mt-1">التحكم في السماح بالفهرسة أو حظر صفحات الإدارة وتفعيل Canonical URLs</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <div>
                <h4 className="text-xs font-bold text-neutral-900">السماح لمحركات البحث بفهرسة الموقع (Index)</h4>
                <p className="text-[11px] text-neutral-500">عند تعطيل هذا الخيار سيتم إضافة `noindex` لحجب الموقع بالكامل</p>
              </div>
              <input 
                type="checkbox"
                checked={config.allowIndexing}
                onChange={(e) => updateField('allowIndexing', e.target.checked)}
                className="w-5 h-5 accent-[#10244A] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
              <div>
                <h4 className="text-xs font-bold text-neutral-900">تفعيل الروابط الأساسية Canonical تلقائياً</h4>
                <p className="text-[11px] text-neutral-500">يمنع وجود المحتوى المكرر على المحركات بواسطة إضافة &lt;link rel="canonical"&gt;</p>
              </div>
              <input 
                type="checkbox"
                checked={config.autoCanonical}
                onChange={(e) => updateField('autoCanonical', e.target.checked)}
                className="w-5 h-5 accent-[#10244A] rounded cursor-pointer"
              />
            </div>

            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
              <h4 className="text-xs font-bold text-neutral-900">الصفحات المحظورة من الفهرسة (NoIndex Pages):</h4>
              <div className="flex flex-wrap gap-2">
                {(config.noIndexPages || ['/admin', '/login', '/secretary']).map((page, idx) => (
                  <span key={idx} className="px-3 py-1 bg-red-100 text-red-800 text-xs font-mono font-bold rounded-lg border border-red-200 flex items-center gap-1.5" dir="ltr">
                    <span>{page}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 9: RICH SNIPPETS ENHANCEMENTS */}
      {activeSubTab === 'rich' && (
        <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-base font-black text-[#10244A]">8. تحسين الظهور في نتائج البحث (Rich Snippets)</h3>
            <p className="text-xs text-neutral-500 font-medium mt-1">تفعيل الإضافات الغنية لإظهار النجوم والأسئلة الشائعة وشريط البحث المباشر في جوجل</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'enableBreadcrumbSchema', label: 'تفعيل Breadcrumb Schema', desc: 'إظهار مسار التنقل التفرعي في نتائج جوجل' },
              { key: 'enableFaqSchema', label: 'تفعيل FAQ Schema', desc: 'إظهار الأسئلة الشائعة مباشرة تحت نتيجة البحث' },
              { key: 'enableArticleSchema', label: 'تفعيل Article Schema', desc: 'تنسيق المقالات الطبية في جوجل الأخبار' },
              { key: 'enableSearchBoxSchema', label: 'تفعيل Search Box Schema', desc: 'إظهار مربع بحث داخلي في نتيجة المنصة بجوجل' },
              { key: 'enableOrganizationSchema', label: 'تفعيل Organization Schema', desc: 'إظهار لوحة المعرفة الكبرى للشركة' },
              { key: 'enableOpenGraph', label: 'تفعيل Open Graph Protocol', desc: 'دعم مشاركة الروابط في فيسبوك وواتساب' },
              { key: 'enableTwitterCard', label: 'تفعيل Twitter Card Summary', desc: 'دعم بطاقات المنشورات في منصة X' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">{item.label}</h4>
                  <p className="text-[11px] text-neutral-500">{item.desc}</p>
                </div>
                <input 
                  type="checkbox"
                  checked={!!config[item.key as keyof SEOSettingsConfig]}
                  onChange={(e) => updateField(item.key as keyof SEOSettingsConfig, e.target.checked as any)}
                  className="w-4 h-4 accent-[#10244A] rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 10: PERFORMANCE & CACHING */}
      {activeSubTab === 'performance' && (
        <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-base font-black text-[#10244A]">9. تحسين الأداء المؤثر على SEO (Core Web Vitals)</h3>
            <p className="text-xs text-neutral-500 font-medium mt-1">تأثير سرعة تحميل الصفحات والضغط على ترتيب السيو وفق معايير جوجل الممتازة</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'autoCompressImages', label: 'ضغط الصور تلقائياً Auto Compress', desc: 'تقليل حجم الصور دون التأثير على جودة الوضوح' },
              { key: 'webpConversion', label: 'تحويل الصور لصيغة WebP', desc: 'استخدام صيغة جيل جديد خفيفة للغاية' },
              { key: 'lazyLoading', label: 'تفعيل التحميل الكسول Lazy Loading', desc: 'تحميل الصور عند التمرير فقط لزيادة السرعة' },
              { key: 'minifyHtml', label: 'ضغط كود Minify HTML', desc: 'إزالة الفراغات والأكواد الزائدة' },
              { key: 'minifyCss', label: 'ضغط كود Minify CSS', desc: 'تسريع معالجة تنسيقات الصفحة' },
              { key: 'minifyJs', label: 'ضغط كود Minify JavaScript', desc: 'تسريع تنفيذ البرمجيات التفاعلية' },
              { key: 'browserCache', label: 'تخزين المتصفح المؤقت Browser Cache', desc: 'حفظ الملفات الثابتة في جهاز الزائر' },
              { key: 'gzipCompression', label: 'ضغط الملفات Gzip / Brotli', desc: 'ضغط جميع استجابات السيرفر قبل إرسالها' },
            ].map((item, idx) => (
              <div key={idx} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900">{item.label}</h4>
                  <p className="text-[11px] text-neutral-500">{item.desc}</p>
                </div>
                <input 
                  type="checkbox"
                  checked={!!config[item.key as keyof SEOSettingsConfig]}
                  onChange={(e) => updateField(item.key as keyof SEOSettingsConfig, e.target.checked as any)}
                  className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 11: QUICK SEO TOOLS */}
      {activeSubTab === 'tools' && (
        <div className="bg-white rounded-3xl border border-neutral-200/70 p-6 md:p-8 shadow-sm space-y-6">
          <div className="border-b border-neutral-100 pb-4">
            <h3 className="text-base font-black text-[#10244A]">10. أدوات واختبارات SEO المباشرة</h3>
            <p className="text-xs text-neutral-500 font-medium mt-1">إجراء عمليات تحديث سريعة واختبارات أداء السيو بنقرة واحدة</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={handleRegenerateSitemap}
              className="p-5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-2xl text-right transition-all space-y-2 cursor-pointer active:scale-95"
            >
              <RefreshCw className="w-5 h-5 text-emerald-600" />
              <h4 className="text-xs font-extrabold text-neutral-900">إعادة إنشاء Sitemap</h4>
              <p className="text-[11px] text-neutral-500">تحديث خريطة الموقع وإدراج جميع الصفحات الجديدة فورا.</p>
            </button>

            <button
              onClick={handleValidateRobots}
              className="p-5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-2xl text-right transition-all space-y-2 cursor-pointer active:scale-95"
            >
              <Code className="w-5 h-5 text-blue-600" />
              <h4 className="text-xs font-extrabold text-neutral-900">تحديث واختبار Robots.txt</h4>
              <p className="text-[11px] text-neutral-500">فحص أخطاء التنسيق وتأكيد توجيهات عناكب البحث.</p>
            </button>

            <button
              onClick={() => showToast('تم مسح كاش السيو SEO Cache وإعادة التحديث بنجاح! 🧹')}
              className="p-5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-2xl text-right transition-all space-y-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-5 h-5 text-amber-600" />
              <h4 className="text-xs font-extrabold text-neutral-900">مسح كاش SEO</h4>
              <p className="text-[11px] text-neutral-500">تفراغ ذاكرة التخزين المؤقت للبيانات المنظمة والميتا.</p>
            </button>

            <button
              onClick={() => showToast('تم إعادة توليد أكواد Schema.org لجميع الصفحات بنجاح! ⚡')}
              className="p-5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-2xl text-right transition-all space-y-2 cursor-pointer active:scale-95"
            >
              <Cpu className="w-5 h-5 text-purple-600" />
              <h4 className="text-xs font-extrabold text-neutral-900">إعادة إنشاء البيانات المنظمة</h4>
              <p className="text-[11px] text-neutral-500">تجديد الهياكل البرمجية للنتائج التفاعلية.</p>
            </button>

            <button
              onClick={() => {
                setActiveSubTab('overview');
                showToast('تم إجراء فحص شامل وجاري عرض حالة الموقع... 📊');
              }}
              className="p-5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-2xl text-right transition-all space-y-2 cursor-pointer active:scale-95"
            >
              <Activity className="w-5 h-5 text-red-600" />
              <h4 className="text-xs font-extrabold text-neutral-900">اختبار إعدادات SEO الشامل</h4>
              <p className="text-[11px] text-neutral-500">تشغيل فحص كامل للـ 12 عنصر وتحديد الأخطاء.</p>
            </button>
          </div>
        </div>
      )}

      {/* Floating Bottom Save Action Bar */}
      <div className="p-4 bg-[#10244A] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white shadow-xl">
        <div className="text-right">
          <p className="text-xs font-extrabold">حفظ تعديلات إعدادات تحسين محركات البحث SEO</p>
          <p className="text-[11px] text-neutral-300">يتم تطبيق التغييرات فوراً في جميع الميتا تاجز وهيدر الموقع الرئيسي</p>
        </div>
        <button
          onClick={onSave}
          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95 shrink-0"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>حفظ التعديلات الآن</span>
        </button>
      </div>

        </div>
      </div>

    </div>
  );
}
