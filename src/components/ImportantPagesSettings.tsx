/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LandingPageConfig, 
  ImportantPagesConfig, 
  GenericLegalPageConfig, 
  LegalSectionItem, 
  DEFAULT_LANDING_CONFIG 
} from '../types';
import { 
  FileText, ShieldCheck, HeartHandshake, AlertTriangle, Plus, Trash2, 
  ExternalLink, Save, Check, Eye, Globe, Mail, BookOpen,
  ArrowUp, ArrowDown, RefreshCw, HelpCircle
} from 'lucide-react';

interface ImportantPagesSettingsProps {
  config: LandingPageConfig;
  onChange: (updatedConfig: LandingPageConfig) => void;
  onSave?: () => void;
  onPreviewPage?: (path: string) => void;
}

type TabType = 'about' | 'terms' | 'privacy' | 'disclaimer' | 'contact' | 'preview';

export default function ImportantPagesSettings({
  config,
  onChange,
  onSave,
  onPreviewPage
}: ImportantPagesSettingsProps) {
  const [activeSubTab, setActiveSubTab] = useState<TabType>('about');
  const [langTab, setLangTab] = useState<'ar' | 'en'>('ar');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const importantPages: ImportantPagesConfig = config.importantPages || DEFAULT_LANDING_CONFIG.importantPages || {};
  const about = importantPages.about || DEFAULT_LANDING_CONFIG.importantPages?.about!;

  // Helper for updating About
  const updateAboutField = (field: keyof typeof about, value: any) => {
    const updated: LandingPageConfig = {
      ...config,
      importantPages: {
        ...importantPages,
        about: {
          ...about,
          [field]: value
        }
      }
    };
    onChange(updated);
  };

  // Helper for updating root emails
  const updateRootField = (field: keyof ImportantPagesConfig, value: any) => {
    const updated: LandingPageConfig = {
      ...config,
      importantPages: {
        ...importantPages,
        [field]: value
      }
    };
    onChange(updated);
  };

  // Helper for updating generic legal pages (terms, privacy, disclaimer)
  const updateGenericPage = (pageKey: 'terms' | 'privacy' | 'disclaimer', updater: (current: GenericLegalPageConfig) => GenericLegalPageConfig) => {
    const fallbackDefault = (DEFAULT_LANDING_CONFIG.importantPages && DEFAULT_LANDING_CONFIG.importantPages[pageKey]) || {
      badgeAr: 'وثائق قانونية',
      badgeEn: 'Legal Document',
      titleAr: '',
      titleEn: '',
      subtitleAr: '',
      subtitleEn: '',
      sections: []
    };

    const currentPageConfig: GenericLegalPageConfig = importantPages[pageKey] || fallbackDefault;
    const newPageConfig = updater(currentPageConfig);

    const updated: LandingPageConfig = {
      ...config,
      importantPages: {
        ...importantPages,
        [pageKey]: newPageConfig
      }
    };
    onChange(updated);
  };

  // Reset generic page to default
  const handleResetToDefault = (pageKey: 'terms' | 'privacy' | 'disclaimer') => {
    const defaultData = DEFAULT_LANDING_CONFIG.importantPages?.[pageKey];
    if (defaultData) {
      updateGenericPage(pageKey, () => JSON.parse(JSON.stringify(defaultData)));
    }
  };

  // Offering items helper for About
  const addOfferingItem = (lang: 'ar' | 'en') => {
    const key = lang === 'ar' ? 'offeringsItemsAr' : 'offeringsItemsEn';
    const currentList = about[key] || [];
    const newItem = lang === 'ar' ? 'ميزة أو خدمة جديدة تضاف للبروفايل' : 'New profile feature or service offering';
    updateAboutField(key, [...currentList, newItem]);
  };

  const updateOfferingItem = (lang: 'ar' | 'en', index: number, val: string) => {
    const key = lang === 'ar' ? 'offeringsItemsAr' : 'offeringsItemsEn';
    const currentList = [...(about[key] || [])];
    currentList[index] = val;
    updateAboutField(key, currentList);
  };

  const removeOfferingItem = (lang: 'ar' | 'en', index: number) => {
    const key = lang === 'ar' ? 'offeringsItemsAr' : 'offeringsItemsEn';
    const currentList = (about[key] || []).filter((_, idx) => idx !== index);
    updateAboutField(key, currentList);
  };

  // Values items helper for About
  const addValueItem = (lang: 'ar' | 'en') => {
    const key = lang === 'ar' ? 'valuesItemsAr' : 'valuesItemsEn';
    const currentList = about[key] || [];
    const newItem = lang === 'ar' 
      ? { title: 'قيمة جديدة', desc: 'وصف موجز وواضح عن القيمة والمبدأ الأساسي.' }
      : { title: 'New Core Value', desc: 'A concise and clear description of this core principle.' };
    updateAboutField(key, [...currentList, newItem]);
  };

  const updateValueItem = (lang: 'ar' | 'en', index: number, field: 'title' | 'desc', val: string) => {
    const key = lang === 'ar' ? 'valuesItemsAr' : 'valuesItemsEn';
    const currentList = [...(about[key] || [])];
    currentList[index] = {
      ...currentList[index],
      [field]: val
    };
    updateAboutField(key, currentList);
  };

  const removeValueItem = (lang: 'ar' | 'en', index: number) => {
    const key = lang === 'ar' ? 'valuesItemsAr' : 'valuesItemsEn';
    const currentList = (about[key] || []).filter((_, idx) => idx !== index);
    updateAboutField(key, currentList);
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleOpenPreview = (path: string) => {
    if (onPreviewPage) {
      onPreviewPage(path);
    } else {
      window.open(path, '_blank');
    }
  };

  // Render Generic Legal Page Editor (Terms, Privacy, Disclaimer)
  const renderGenericLegalEditor = (pageKey: 'terms' | 'privacy' | 'disclaimer', pagePath: string, pageLabel: string) => {
    const fallbackDefault = (DEFAULT_LANDING_CONFIG.importantPages && DEFAULT_LANDING_CONFIG.importantPages[pageKey]) || {
      badgeAr: 'وثائق قانونية',
      badgeEn: 'Legal Document',
      titleAr: pageLabel,
      titleEn: pageLabel,
      subtitleAr: '',
      subtitleEn: '',
      sections: []
    };

    const pageData: GenericLegalPageConfig = importantPages[pageKey] || fallbackDefault;
    const sections: LegalSectionItem[] = pageData.sections || [];

    const handleFieldChange = (field: keyof GenericLegalPageConfig, val: any) => {
      updateGenericPage(pageKey, (curr) => ({
        ...curr,
        [field]: val
      }));
    };

    const addSection = () => {
      const newSec: LegalSectionItem = {
        id: `sec_${Date.now()}`,
        headingAr: 'بند جديد',
        headingEn: 'New Section',
        introAr: '',
        introEn: '',
        paragraphsAr: ['اكتب نص الفقرة هنا...'],
        paragraphsEn: ['Write paragraph text here...'],
        bulletsAr: [],
        bulletsEn: []
      };
      handleFieldChange('sections', [...sections, newSec]);
    };

    const removeSection = (secIdx: number) => {
      handleFieldChange('sections', sections.filter((_, idx) => idx !== secIdx));
    };

    const moveSection = (secIdx: number, direction: 'up' | 'down') => {
      const targetIdx = direction === 'up' ? secIdx - 1 : secIdx + 1;
      if (targetIdx < 0 || targetIdx >= sections.length) return;
      const reordered = [...sections];
      const temp = reordered[secIdx];
      reordered[secIdx] = reordered[targetIdx];
      reordered[targetIdx] = temp;
      handleFieldChange('sections', reordered);
    };

    const updateSectionField = (secIdx: number, field: keyof LegalSectionItem, val: any) => {
      const updatedList = [...sections];
      updatedList[secIdx] = {
        ...updatedList[secIdx],
        [field]: val
      };
      handleFieldChange('sections', updatedList);
    };

    // Paragraph helpers
    const addParagraph = (secIdx: number, lang: 'ar' | 'en') => {
      const field = lang === 'ar' ? 'paragraphsAr' : 'paragraphsEn';
      const currentList = sections[secIdx][field] || [];
      const newText = lang === 'ar' ? 'فقرة جديدة توضح بنود هذا القسم...' : 'New paragraph explaining this section...';
      updateSectionField(secIdx, field, [...currentList, newText]);
    };

    const updateParagraph = (secIdx: number, lang: 'ar' | 'en', pIdx: number, val: string) => {
      const field = lang === 'ar' ? 'paragraphsAr' : 'paragraphsEn';
      const currentList = [...(sections[secIdx][field] || [])];
      currentList[pIdx] = val;
      updateSectionField(secIdx, field, currentList);
    };

    const removeParagraph = (secIdx: number, lang: 'ar' | 'en', pIdx: number) => {
      const field = lang === 'ar' ? 'paragraphsAr' : 'paragraphsEn';
      const currentList = (sections[secIdx][field] || []).filter((_, idx) => idx !== pIdx);
      updateSectionField(secIdx, field, currentList);
    };

    // Bullets helpers
    const addBullet = (secIdx: number, lang: 'ar' | 'en') => {
      const field = lang === 'ar' ? 'bulletsAr' : 'bulletsEn';
      const currentList = sections[secIdx][field] || [];
      const newText = lang === 'ar' ? 'نقطة فرعية جديدة...' : 'New bullet point item...';
      updateSectionField(secIdx, field, [...currentList, newText]);
    };

    const updateBullet = (secIdx: number, lang: 'ar' | 'en', bIdx: number, val: string) => {
      const field = lang === 'ar' ? 'bulletsAr' : 'bulletsEn';
      const currentList = [...(sections[secIdx][field] || [])];
      currentList[bIdx] = val;
      updateSectionField(secIdx, field, currentList);
    };

    const removeBullet = (secIdx: number, lang: 'ar' | 'en', bIdx: number) => {
      const field = lang === 'ar' ? 'bulletsAr' : 'bulletsEn';
      const currentList = (sections[secIdx][field] || []).filter((_, idx) => idx !== bIdx);
      updateSectionField(secIdx, field, currentList);
    };

    return (
      <div className="space-y-6">
        {/* Language switcher & action bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-neutral-600">لغة التحرير:</span>
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
              <button
                type="button"
                onClick={() => setLangTab('ar')}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  langTab === 'ar' ? 'bg-[#10244A] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                العربية
              </button>
              <button
                type="button"
                onClick={() => setLangTab('en')}
                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  langTab === 'en' ? 'bg-[#10244A] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleResetToDefault(pageKey)}
              className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              title="استعادة النصوص الافتراضية المعتمدة"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>استعادة النص الافتراضي</span>
            </button>
            
            <button
              type="button"
              onClick={() => handleOpenPreview(pagePath)}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#0051A8] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-blue-200"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة الصفحة ({pagePath})</span>
            </button>
          </div>
        </div>

        {/* Section 1: Page Header & Subtitle */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0051A8] flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 className="text-base font-black text-[#10244A]">الترويسة والعنوان الرئيسي للصفحة</h3>
              <p className="text-xs text-neutral-500 font-semibold">الشارة العلوية، عنوان الصفحة، والمقدمة التوضيحية</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-800">
                الشارة العلوية (Badge) {langTab === 'ar' ? '(بالعربية)' : '(English)'}
              </label>
              <input
                type="text"
                value={langTab === 'ar' ? (pageData.badgeAr || '') : (pageData.badgeEn || '')}
                onChange={(e) => handleFieldChange(langTab === 'ar' ? 'badgeAr' : 'badgeEn', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder={langTab === 'ar' ? 'مثال: وثائق قانونية' : 'e.g. Legal Document'}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-800">
                عنوان الصفحة الرئيسي {langTab === 'ar' ? '(بالعربية)' : '(English)'}
              </label>
              <input
                type="text"
                value={langTab === 'ar' ? (pageData.titleAr || '') : (pageData.titleEn || '')}
                onChange={(e) => handleFieldChange(langTab === 'ar' ? 'titleAr' : 'titleEn', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder={langTab === 'ar' ? 'مثال: شروط استخدام منصة دكتور بروفايل' : 'e.g. Terms of Use'}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-extrabold text-neutral-800">
              الوصف / المقدمة التمهيدية {langTab === 'ar' ? '(بالعربية)' : '(English)'}
            </label>
            <textarea
              rows={3}
              value={langTab === 'ar' ? (pageData.subtitleAr || '') : (pageData.subtitleEn || '')}
              onChange={(e) => handleFieldChange(langTab === 'ar' ? 'subtitleAr' : 'subtitleEn', e.target.value)}
              className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
              placeholder="اكتب نبذة أو مقدمة توضيحية أعلى الصفحة..."
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="block text-xs font-extrabold text-neutral-800">
              البريد المخصص للتواصل في هذه الصفحة
            </label>
            <input
              type="email"
              value={pageData.contactEmail || ''}
              onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
              className="w-full max-w-md px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
              placeholder="drprofileweb@gmail.com"
            />
            <p className="text-[11px] text-neutral-400 font-medium">إذا تم تركه فارغاً سيتم استخدام البريد العام الافتراضي.</p>
          </div>
        </div>

        {/* Section 2: Legal Document Sections */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0051A8] flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-base font-black text-[#10244A]">بنود ومحتوى الصفحة ({sections.length} بنود)</h3>
                <p className="text-xs text-neutral-500 font-semibold">تحرير العناوين، الفقرات، والنقاط لكل بند قانوني</p>
              </div>
            </div>

            <button
              type="button"
              onClick={addSection}
              className="px-4 py-2 bg-[#10244A] hover:bg-[#003B7A] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة بند / قسم جديد</span>
            </button>
          </div>

          {sections.length === 0 ? (
            <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-dashed border-neutral-300">
              <p className="text-xs font-bold text-neutral-500">لا توجد بنود مخصصة حالياً. انقر على «إضافة بند / قسم جديد» أو استعد المحتوى الافتراضي.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {sections.map((sec, secIdx) => {
                const headingVal = langTab === 'ar' ? (sec.headingAr || '') : (sec.headingEn || '');
                const introVal = langTab === 'ar' ? (sec.introAr || '') : (sec.introEn || '');
                const paragraphsList = langTab === 'ar' ? (sec.paragraphsAr || []) : (sec.paragraphsEn || []);
                const bulletsList = langTab === 'ar' ? (sec.bulletsAr || []) : (sec.bulletsEn || []);

                return (
                  <div 
                    key={sec.id || `sec_${secIdx}`} 
                    className="p-5 sm:p-6 bg-neutral-50/80 rounded-2xl border border-neutral-200 space-y-4 relative group"
                  >
                    {/* Header bar of the section */}
                    <div className="flex items-center justify-between gap-2 border-b border-neutral-200/80 pb-3 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-[#10244A] text-white text-xs font-black flex items-center justify-center">
                          {secIdx + 1}
                        </span>
                        <h4 className="text-sm font-black text-[#10244A]">
                          {headingVal || `البند رقم ${secIdx + 1}`}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={secIdx === 0}
                          onClick={() => moveSection(secIdx, 'up')}
                          className="p-1.5 bg-white hover:bg-neutral-200 disabled:opacity-30 rounded-lg text-neutral-700 transition-all cursor-pointer"
                          title="تحريك لأعلى"
                        >
                          <ArrowUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          disabled={secIdx === sections.length - 1}
                          onClick={() => moveSection(secIdx, 'down')}
                          className="p-1.5 bg-white hover:bg-neutral-200 disabled:opacity-30 rounded-lg text-neutral-700 transition-all cursor-pointer"
                          title="تحريك لأسفل"
                        >
                          <ArrowDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeSection(secIdx)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all cursor-pointer ml-1"
                          title="حذف هذا البند"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Section Heading & Optional Intro */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-neutral-700">
                          عنوان البند {langTab === 'ar' ? '(بالعربية)' : '(English)'}
                        </label>
                        <input
                          type="text"
                          value={headingVal}
                          onChange={(e) => updateSectionField(secIdx, langTab === 'ar' ? 'headingAr' : 'headingEn', e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#10244A]"
                          placeholder={langTab === 'ar' ? 'مثال: أولًا: تعريف المنصة ودورها' : 'e.g. 1. Platform Nature & Scope'}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] font-bold text-neutral-700">
                          مقدمة البند التمهيدية (اختياري) {langTab === 'ar' ? '(بالعربية)' : '(English)'}
                        </label>
                        <input
                          type="text"
                          value={introVal}
                          onChange={(e) => updateSectionField(secIdx, langTab === 'ar' ? 'introAr' : 'introEn', e.target.value)}
                          className="w-full px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                          placeholder={langTab === 'ar' ? 'مقدمة قبل النقاط أو الفقرات (إن وجدت)...' : 'Introductory text...'}
                        />
                      </div>
                    </div>

                    {/* Paragraphs list */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-neutral-700">
                          فقرات البند ({paragraphsList.length} فقرات) {langTab === 'ar' ? '(بالعربية)' : '(English)'}
                        </label>
                        <button
                          type="button"
                          onClick={() => addParagraph(secIdx, langTab)}
                          className="text-[11px] font-extrabold text-[#0051A8] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>إضافة فقرة</span>
                        </button>
                      </div>

                      {paragraphsList.map((para, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2">
                          <textarea
                            rows={2}
                            value={para}
                            onChange={(e) => updateParagraph(secIdx, langTab, pIdx, e.target.value)}
                            className="flex-1 px-3.5 py-2 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                            placeholder="اكتب نص الفقرة..."
                          />
                          <button
                            type="button"
                            onClick={() => removeParagraph(secIdx, langTab, pIdx)}
                            className="p-2 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer mt-1"
                            title="حذف الفقرة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Bullets list */}
                    <div className="space-y-2 pt-2 border-t border-neutral-200/50">
                      <div className="flex items-center justify-between">
                        <label className="block text-[11px] font-bold text-neutral-700">
                          النقاط الفرعية المسردة ({bulletsList.length} نقاط) (اختياري) {langTab === 'ar' ? '(بالعربية)' : '(English)'}
                        </label>
                        <button
                          type="button"
                          onClick={() => addBullet(secIdx, langTab)}
                          className="text-[11px] font-extrabold text-[#0051A8] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>إضافة نقطة فرعية</span>
                        </button>
                      </div>

                      {bulletsList.map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#0051A8] shrink-0"></span>
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => updateBullet(secIdx, langTab, bIdx, e.target.value)}
                            className="flex-1 px-3.5 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                            placeholder="نص النقطة الفرعية..."
                          />
                          <button
                            type="button"
                            onClick={() => removeBullet(secIdx, langTab, bIdx)}
                            className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                            title="حذف النقطة"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Title */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0051A8] shrink-0 shadow-xs">
            <FileText className="w-7 h-7 text-[#0051A8]" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#10244A] tracking-tight">إدارة جميع الروابط المهمة والصفحات القانونية</h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-semibold mt-1">
              التحكم الشامل في محتوى صفحة من نحن، شروط الاستخدام، سياسة الخصوصية، إخلاء المسؤولية، وإيميلات التواصل.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={() => handleOpenPreview(activeSubTab === 'terms' ? '/terms' : activeSubTab === 'privacy' ? '/privacy' : activeSubTab === 'disclaimer' ? '/disclaimer' : '/about')}
            className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4 text-neutral-600" />
            <span>معاينة الصفحة الحالية</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md cursor-pointer active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>حفظ التعديلات</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-extrabold flex items-center gap-2 shadow-xs animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>تم حفظ بيانات ونصوص الروابط المهمة بنجاح وتحديثها في الموقع!</span>
        </div>
      )}

      {/* Main Sub-tabs selection */}
      <div className="flex items-center gap-2 border-b border-neutral-200 pb-3 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveSubTab('about')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'about'
              ? 'bg-[#10244A] text-white shadow-sm'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>من نحن (About Us)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('terms')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'terms'
              ? 'bg-[#10244A] text-white shadow-sm'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>شروط الاستخدام (Terms)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('privacy')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'privacy'
              ? 'bg-[#10244A] text-white shadow-sm'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>سياسة الخصوصية (Privacy)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('disclaimer')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'disclaimer'
              ? 'bg-[#10244A] text-white shadow-sm'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>إخلاء المسؤولية (Disclaimer)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('contact')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'contact'
              ? 'bg-[#10244A] text-white shadow-sm'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>بريد التواصل</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('preview')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'preview'
              ? 'bg-[#10244A] text-white shadow-sm'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>روابط المعاينة</span>
        </button>
      </div>

      {/* TAB 1: ABOUT US PAGE CONTENT */}
      {activeSubTab === 'about' && (
        <div className="space-y-6">
          
          {/* Language Switcher for About Us */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-neutral-600">لغة التحرير:</span>
              <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setLangTab('ar')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    langTab === 'ar' ? 'bg-[#10244A] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  العربية
                </button>
                <button
                  type="button"
                  onClick={() => setLangTab('en')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    langTab === 'en' ? 'bg-[#10244A] text-white shadow-xs' : 'text-neutral-700 hover:text-neutral-900'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleOpenPreview('/about')}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-[#0051A8] text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-blue-200"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>معاينة صفحة من نحن (/about)</span>
            </button>
          </div>

          {/* Section 1: Page Header & Hero */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0051A8] flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <h3 className="text-base font-black text-[#10244A]">الترويسة والعنوان الرئيسي للصفحة</h3>
                <p className="text-xs text-neutral-500 font-semibold">الشارة، العنوان الرئيسي، والشعار التعريفي في أعلى الصفحة</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-800">
                  الشارة العلوية (Badge) {langTab === 'ar' ? '(بالعربية)' : '(English)'}
                </label>
                <input
                  type="text"
                  value={langTab === 'ar' ? (about.badgeAr || '') : (about.badgeEn || '')}
                  onChange={(e) => updateAboutField(langTab === 'ar' ? 'badgeAr' : 'badgeEn', e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                  placeholder="من نحن"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-800">
                  عنوان الصفحة {langTab === 'ar' ? '(بالعربية)' : '(English)'}
                </label>
                <input
                  type="text"
                  value={langTab === 'ar' ? (about.titleAr || '') : (about.titleEn || '')}
                  onChange={(e) => updateAboutField(langTab === 'ar' ? 'titleAr' : 'titleEn', e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                  placeholder="من نحن"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-800">
                العنوان الجذاب / الشعار (Headline) {langTab === 'ar' ? '(بالعربية)' : '(English)'}
              </label>
              <textarea
                rows={2}
                value={langTab === 'ar' ? (about.headlineAr || '') : (about.headlineEn || '')}
                onChange={(e) => updateAboutField(langTab === 'ar' ? 'headlineAr' : 'headlineEn', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder="نساعد الأطباء على بناء حضور طبي رقمي احترافي بسهولة واحترافية."
              />
            </div>
          </div>

          {/* Section 2: Our Story */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0051A8] flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h3 className="text-base font-black text-[#10244A]">قسم «قصتنا» (Our Story)</h3>
                <p className="text-xs text-neutral-500 font-semibold">عنوان القصة والفقرات التوضيحية عن فكرة المنصة</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-800">
                عنوان قسم القصة {langTab === 'ar' ? '(بالعربية)' : '(English)'}
              </label>
              <input
                type="text"
                value={langTab === 'ar' ? (about.storyTitleAr || '') : (about.storyTitleEn || '')}
                onChange={(e) => updateAboutField(langTab === 'ar' ? 'storyTitleAr' : 'storyTitleEn', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder="قصتنا"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-800">
                الفقرة الأولى {langTab === 'ar' ? '(بالعربية)' : '(English)'}
              </label>
              <textarea
                rows={3}
                value={langTab === 'ar' ? (about.storyTextAr || '') : (about.storyTextEn || '')}
                onChange={(e) => updateAboutField(langTab === 'ar' ? 'storyTextAr' : 'storyTextEn', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder="دكتور بروفايل منصة متخصصة تساعد الأطباء..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-800">
                الفقرة الثانية (تكميلية) {langTab === 'ar' ? '(بالعربية)' : '(English)'}
              </label>
              <textarea
                rows={3}
                value={langTab === 'ar' ? (about.storyText2Ar || '') : (about.storyText2En || '')}
                onChange={(e) => updateAboutField(langTab === 'ar' ? 'storyText2Ar' : 'storyText2En', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder="نؤمن أن لكل طبيب خبرة تستحق أن تظهر بصورة احترافية..."
              />
            </div>
          </div>

          {/* Section 3: What We Offer */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0051A8] flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h3 className="text-base font-black text-[#10244A]">قسم «ما نقدمه» (What We Offer)</h3>
                <p className="text-xs text-neutral-500 font-semibold">عنوان القسم ومقدمته مع قائمة النقاط والميزات المقدمة للأطباء</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-800">
                  عنوان القسم {langTab === 'ar' ? '(بالعربية)' : '(English)'}
                </label>
                <input
                  type="text"
                  value={langTab === 'ar' ? (about.offeringsTitleAr || '') : (about.offeringsTitleEn || '')}
                  onChange={(e) => updateAboutField(langTab === 'ar' ? 'offeringsTitleAr' : 'offeringsTitleEn', e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                  placeholder="ما نقدمه"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-extrabold text-neutral-800">
                  المقدمة التمهيدية {langTab === 'ar' ? '(بالعربية)' : '(English)'}
                </label>
                <input
                  type="text"
                  value={langTab === 'ar' ? (about.offeringsIntroAr || '') : (about.offeringsIntroEn || '')}
                  onChange={(e) => updateAboutField(langTab === 'ar' ? 'offeringsIntroAr' : 'offeringsIntroEn', e.target.value)}
                  className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                  placeholder="نوفر للأطباء أدوات متكاملة..."
                />
              </div>
            </div>

            {/* Offerings list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-neutral-800">
                  قائمة الخدمات والمميزات ({langTab === 'ar' ? (about.offeringsItemsAr?.length || 0) : (about.offeringsItemsEn?.length || 0)})
                </label>
                <button
                  type="button"
                  onClick={() => addOfferingItem(langTab)}
                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#0051A8] text-xs font-extrabold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة عنصر</span>
                </button>
              </div>

              {((langTab === 'ar' ? about.offeringsItemsAr : about.offeringsItemsEn) || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-neutral-100 text-neutral-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateOfferingItem(langTab, idx, e.target.value)}
                    className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                    placeholder="نص الخدمة / الميزة..."
                  />
                  <button
                    type="button"
                    onClick={() => removeOfferingItem(langTab, idx)}
                    className="p-2 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                    title="حذف هذا العنصر"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Our Vision */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0051A8] flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h3 className="text-base font-black text-[#10244A]">قسم «رؤيتنا» (Our Vision)</h3>
                <p className="text-xs text-neutral-500 font-semibold">عنوان ورسالة الرؤية المستقبلية للمنصة</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-800">
                عنوان الرؤية {langTab === 'ar' ? '(بالعربية)' : '(English)'}
              </label>
              <input
                type="text"
                value={langTab === 'ar' ? (about.visionTitleAr || '') : (about.visionTitleEn || '')}
                onChange={(e) => updateAboutField(langTab === 'ar' ? 'visionTitleAr' : 'visionTitleEn', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder="رؤيتنا"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-800">
                نص الرؤية {langTab === 'ar' ? '(بالعربية)' : '(English)'}
              </label>
              <textarea
                rows={3}
                value={langTab === 'ar' ? (about.visionTextAr || '') : (about.visionTextEn || '')}
                onChange={(e) => updateAboutField(langTab === 'ar' ? 'visionTextAr' : 'visionTextEn', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder="أن نكون الخيار الأول للأطباء في العالم العربي..."
              />
            </div>
          </div>

          {/* Section 5: Our Values */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-neutral-200 shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-neutral-100">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0051A8] flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <h3 className="text-base font-black text-[#10244A]">قسم «قيمنا» (Our Values)</h3>
                <p className="text-xs text-neutral-500 font-semibold">كروت القيم الأساسية (العنوان والوصف لكل قيمة)</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-extrabold text-neutral-800">
                عنوان قسم القيم {langTab === 'ar' ? '(بالعربية)' : '(English)'}
              </label>
              <input
                type="text"
                value={langTab === 'ar' ? (about.valuesTitleAr || '') : (about.valuesTitleEn || '')}
                onChange={(e) => updateAboutField(langTab === 'ar' ? 'valuesTitleAr' : 'valuesTitleEn', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder="قيمنا"
              />
            </div>

            {/* Value Cards list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-extrabold text-neutral-800">
                  كروت القيم ({langTab === 'ar' ? (about.valuesItemsAr?.length || 0) : (about.valuesItemsEn?.length || 0)})
                </label>
                <button
                  type="button"
                  onClick={() => addValueItem(langTab)}
                  className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-[#0051A8] text-xs font-extrabold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>إضافة قيمة جديدة</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {((langTab === 'ar' ? about.valuesItemsAr : about.valuesItemsEn) || []).map((card, idx) => (
                  <div key={idx} className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#0051A8]">قيمة رقم {idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => removeValueItem(langTab, idx)}
                        className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                        title="حذف هذه القيمة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-neutral-600">عنوان القيمة</label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) => updateValueItem(langTab, idx, 'title', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-bold focus:outline-none focus:border-[#10244A]"
                        placeholder="مثال: الاحترافية"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-neutral-600">وصف القيمة</label>
                      <textarea
                        rows={2}
                        value={card.desc}
                        onChange={(e) => updateValueItem(langTab, idx, 'desc', e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                        placeholder="شرح موجز للقيمة..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: TERMS OF USE PAGE */}
      {activeSubTab === 'terms' && renderGenericLegalEditor('terms', '/terms', 'شروط الاستخدام')}

      {/* TAB 3: PRIVACY POLICY PAGE */}
      {activeSubTab === 'privacy' && renderGenericLegalEditor('privacy', '/privacy', 'سياسة الخصوصية')}

      {/* TAB 4: DISCLAIMER PAGE */}
      {activeSubTab === 'disclaimer' && renderGenericLegalEditor('disclaimer', '/disclaimer', 'إخلاء المسؤولية')}

      {/* TAB 5: CONTACT EMAILS */}
      {activeSubTab === 'contact' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0051A8] flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#10244A]">عناوين البريد الإلكتروني الافتراضية للصفحات القانونية</h3>
              <p className="text-xs text-neutral-500 font-semibold">تظهر في أسفل كل صفحة للتواصل والاستفسارات القانونية</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-neutral-800">بريد الشروط والأحكام</label>
              <input
                type="email"
                value={importantPages.termsEmail || 'drprofileweb@gmail.com'}
                onChange={(e) => updateRootField('termsEmail', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder="drprofileweb@gmail.com"
              />
              <span className="text-[11px] text-neutral-400 font-medium">يظهر في صفحة /terms</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-neutral-800">بريد سياسة الخصوصية</label>
              <input
                type="email"
                value={importantPages.privacyEmail || 'drprofileweb@gmail.com'}
                onChange={(e) => updateRootField('privacyEmail', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder="drprofileweb@gmail.com"
              />
              <span className="text-[11px] text-neutral-400 font-medium">يظهر في صفحة /privacy</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-extrabold text-neutral-800">بريد إخلاء المسؤولية</label>
              <input
                type="email"
                value={importantPages.disclaimerEmail || 'drprofileweb@gmail.com'}
                onChange={(e) => updateRootField('disclaimerEmail', e.target.value)}
                className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#10244A]"
                placeholder="drprofileweb@gmail.com"
              />
              <span className="text-[11px] text-neutral-400 font-medium">يظهر في صفحة /disclaimer</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: LIVE PREVIEW & DIRECT LINKS */}
      {activeSubTab === 'preview' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-neutral-200 shadow-xs space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-neutral-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#10244A]">معاينة الصفحات والروابط المهمة المباشرة</h3>
              <p className="text-xs text-neutral-500 font-semibold">افتح أي صفحة للاطلاع على شكلها وتنسيقها المباشر كما يراها الزائر</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* About Us Card */}
            <div className="p-5 bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 rounded-2xl transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-50 text-[#0051A8] flex items-center justify-center font-black">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#10244A]">صفحة «من نحن» (About Us)</h4>
                  <span className="text-xs text-neutral-500 font-bold">المسار: /about</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPreview('/about')}
                className="px-4 py-2 bg-[#10244A] hover:bg-[#003B7A] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>معاينة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Terms of Use Card */}
            <div className="p-5 bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 rounded-2xl transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#10244A]">شروط الاستخدام (Terms)</h4>
                  <span className="text-xs text-neutral-500 font-bold">المسار: /terms</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPreview('/terms')}
                className="px-4 py-2 bg-neutral-800 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>معاينة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Privacy Policy Card */}
            <div className="p-5 bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 rounded-2xl transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-black">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#10244A]">سياسة الخصوصية (Privacy)</h4>
                  <span className="text-xs text-neutral-500 font-bold">المسار: /privacy</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPreview('/privacy')}
                className="px-4 py-2 bg-neutral-800 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>معاينة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Disclaimer Card */}
            <div className="p-5 bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 rounded-2xl transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-black">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-[#10244A]">إخلاء المسؤولية (Disclaimer)</h4>
                  <span className="text-xs text-neutral-500 font-bold">المسار: /disclaimer</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleOpenPreview('/disclaimer')}
                className="px-4 py-2 bg-neutral-800 hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>معاينة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Save Button at the Bottom */}
      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleSave}
          className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-2xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/10 cursor-pointer active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>حفظ جميع تعديلات الروابط المهمة</span>
        </button>
      </div>

    </div>
  );
}
