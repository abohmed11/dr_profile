/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, ShieldCheck, FileText, Lock, AlertTriangle, Award, CheckCircle2 } from 'lucide-react';

export type LegalDocType = 'terms' | 'privacy' | 'disclaimer';

interface LegalModalProps {
  docType: LegalDocType | null;
  onClose: () => void;
  currentLang?: 'ar' | 'en';
}

export default function LegalModal({ docType, onClose, currentLang = 'ar' }: LegalModalProps) {
  if (!docType) return null;

  const isEn = currentLang === 'en';

  const docData = {
    terms: {
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      titleAr: 'شروط الاستخدام',
      titleEn: 'Terms of Use',
      subtitleAr: 'هذا المستند يوضح شروط وأحكام استخدامك لخدمات منصة دكتور بروفايل («المنصة»). باستخدامك للمنصة فأنت تقر بالالتزام الكامل بكل ما ورد أدناه.',
      subtitleEn: 'This document sets forth the terms and conditions for using Dr Profile platform services. By using the platform, you agree to comply with all provisions below.',
      updatedAr: 'آخر تحديث: أغسطس 2026',
      updatedEn: 'Last Updated: August 2026',
      sectionsAr: [
        {
          heading: 'أولًا: تعريف المنصة ودورها',
          paragraphs: [
            'دكتور بروفايل هو وسيط تقني يتيح للأطباء إنشاء بروفايل رقمي وإدارة محتواهم الطبي وخدماتهم على الإنترنت. لا تُقدّم المنصة أي تشخيصات أو استشارات أو خدمات طبية مباشرة، ولا تُعد جهة مانحة للترخيص المهني أو بديلاً عن الجهات التنظيمية المختصة.'
          ]
        },
        {
          heading: 'ثانيًا: حساب الطبيب ومسؤولياته',
          paragraphs: [
            'الطبيب المستخدم مسؤول مسؤولية كاملة عن صحة ودقة كل البيانات، والصور، ووسائل التواصل، والمواعيد، وأي محتوى ينشره ضمن موقعه.',
            'يتوجب على الطبيب تحديث بياناته بشكل دوري والالتزام بأحدث المعايير المهنية والأخلاقية المعمول بها في نطاقه الجغرافي.',
            'يُمنع انتحال صفة طبيب أو استخدام بيانات أو مستندات غير صحيحة أو مضللة، ويُعد ذلك مخالفة جسيمة تتيح للمنصة اتخاذ الإجراءات اللازمة.',
            'أي تعامل بين الطبيب والمريض يتم خارج نطاق المنصة أو من خلالها يخضع للطرفين وحدهما، ويتحمل الطبيب كامل المسؤولية المهنية والقانونية عنه.'
          ]
        },
        {
          heading: 'ثالثًا: حقوق المنصة وإدارتها',
          paragraphs: [
            'يحق للمنصة تعليق أو حذف أي حساب يثبت مخالفته لهذه الشروط أو تقديمه معلومات أو خدمات مضللة أو غير مطابقة للحقيقة.',
            'يحق للمنصة طلب أي مستندات أو معلومات إضافية للتحقق من صحة البيانات المهنية للطبيب.',
            'تحتفظ المنصة بالحق في تعديل الخدمات، أو تحديث الشروط، أو إضافة بنود جديدة في أي وقت. وسيتم إبلاغ المستخدمين بالتعديلات الجوهرية عبر القنوات المتاحة.',
            'استمرارك في استخدام المنصة بعد أي تحديثات يُعد موافقة ضمنية على الشروط المعدّلة.'
          ]
        },
        {
          heading: 'رابعًا: حدود المسؤولية والتنبيهات',
          paragraphs: [
            'المنصة ليست مسؤولة عن الأخطاء الطبية أو الاستشارات أو التشخيصات أو الرسائل المتبادلة بين الطبيب والمرضى. كما لا تتحمل المنصة أي التزام تجاه نتائج العلاج أو جودة الخدمة الطبية المقدمة من الطبيب.',
            'لا يقدم المحتوى المنشور بواسطة الأطباء على مواقعهم أي توصية علاجية من المنصة، ولا يُعد بديلاً عن زيارة الطبيب المختص أو الحصول على استشارة طبية مباشرة.'
          ]
        },
        {
          heading: 'خامسًا: الامتثال للقوانين واللوائح',
          paragraphs: [
            'يلتزم الطبيب بجميع القوانين واللوائح المنظمة لممارسة مهنة الطب في جمهورية مصر العربية وأي سلطات تنظيمية أخرى ذات علاقة. ويُعد أي استخدام غير قانوني أو غير مصرح به للمنصة مخالفة تستوجب إيقاف الخدمة واتخاذ الإجراءات اللازمة.'
          ]
        },
        {
          heading: 'سادسًا: التواصل والتعديلات',
          paragraphs: [
            'لأي استفسارات أو ملاحظات بخصوص شروط الاستخدام، يمكنك التواصل مع فريق دكتور بروفايل عبر البريد الإلكتروني drprofileweb@gmail.com . سيتم مراجعة أي طلبات أو شكاوى وفق سياسات المنصة وضوابطها القانونية.'
          ]
        }
      ],
      sectionsEn: [
        {
          heading: '1. Platform Scope & Role',
          content: 'Dr Profile is a technical intermediary enabling doctors to create digital profiles and manage medical content online. The platform does not provide direct medical advice, diagnostics, or professional licenses.'
        },
        {
          heading: '2. Doctor Account & Responsibilities',
          content: 'Doctors bear full responsibility for data accuracy, clinic details, and schedules. Impersonation or fraudulent credentials constitute severe violations.'
        },
        {
          heading: '3. Platform Rights',
          content: 'The platform reserves the right to suspend or delete violating accounts, request credential verifications, and update terms as needed.'
        },
        {
          heading: '4. Limitation of Liability',
          content: 'The platform is not liable for medical practice, diagnoses, or treatment outcomes. Content on profiles does not constitute medical recommendations.'
        },
        {
          heading: '5. Legal Compliance',
          content: 'Doctors agree to comply with medical practice laws in Egypt and relevant regulatory authorities.'
        },
        {
          heading: '6. Contact & Modifications',
          content: 'For inquiries, contact drprofileweb@gmail.com. Submissions are reviewed per platform legal policies.'
        }
      ]
    },
    privacy: {
      icon: <Lock className="w-6 h-6 text-emerald-600" />,
      titleAr: 'سياسة الخصوصية وحماية البيانات',
      titleEn: 'Privacy and Data Protection Policy',
      subtitleAr: 'نلتزم في منصة دكتور بروفايل بالتعامل مع بيانات الأطباء والزوار بطريقة مناسبة وبما يتوافق مع القوانين واللوائح المعمول بها.',
      subtitleEn: 'At Dr Profile platform, we are committed to handling doctor and visitor data appropriately.',
      updatedAr: 'آخر تحديث: أغسطس 2026',
      updatedEn: 'Last Updated: August 2026',
      sectionsAr: [
        {
          heading: 'أولًا: البيانات التي نجمعها من الأطباء',
          content: 'قد نجمع البيانات الأساسية التي يقدمها الطبيب عند إنشاء حسابه أو بروفايله، مثل: الاسم، التخصص، رقم الهاتف، البريد الإلكتروني، بيانات العيادات والفروع وعناوينها، الخدمات والأسعار ومواعيد العمل، الصور والمحتوى وروايط وسائل التواصل.'
        },
        {
          heading: 'ثانيًا: البيانات التي قد تُجمع من الزوار أو المرضى',
          content: 'عند استخدام نماذج الحجز أو التواصل، قد يتم جمع بيانات مثل الاسم ورقم الهاتف والبريد الإلكتروني وبيانات الحجز. تُستخدم هذه البيانات بالقدر اللازم لتنفيذ طلب الحجز أو التواصل.'
        },
        {
          heading: 'ثالثًا: كيفية استخدام البيانات',
          content: 'نستخدم البيانات لتقديم خدمات المنصة، إدارة الحسابات والمواعيد، تحسين أداء المنصة، تقديم الدعم الفني، إرسال الإشعارات، والاستجابة للالتزامات القانونية.'
        },
        {
          heading: 'رابعًا: مشاركة البيانات مع أطراف ثالثة',
          content: 'لا نقوم ببيع البيانات الشخصية للأطباء أو الزوار. تتم مشاركة البيانات فقط بناءً على الموافقة، لتشغيل خدمات ضرورية، عند وجود التزام قانوني، أو لحماية أمن المنصة.'
        },
        {
          heading: 'خامسًا: أمن المعلومات والاحتفاظ بالبيانات',
          content: 'نتخذ إجراءات تقنية وتنظيمية حماية البيانات. يتم الاحتفاظ بالبيانات طوال فترة الحاجة إليها لتقديم الخدمات أو وفقًا للمتطلبات القانونية.'
        },
        {
          heading: 'سادسًا: ارتباط السياسة بخدمات المنصة',
          content: 'تنطبق هذه السياسة على جميع الخدمات الرقمية التي تقدمها المنصة، بما في ذلك البروفايلات، نماذج الحجز، ولوحة التحكم.'
        },
        {
          heading: 'سابعًا: حقوقك وكيفية التواصل',
          content: 'يحق للطبيب طلب تحديث أو تعديل أو حذف بياناته عبر البريد الإلكتروني: drprofileweb@gmail.com'
        }
      ],
      sectionsEn: [
        {
          heading: '1. Data Collected from Doctors',
          content: 'Basic information provided when creating a profile including name, specialty, phone, email, clinic branches, services, working hours, and social media links.'
        },
        {
          heading: '2. Data Collected from Visitors',
          content: 'Basic details provided during booking or contact (name, phone, email) used strictly to fulfill booking requests or communications.'
        },
        {
          heading: '3. How We Use Data',
          content: 'Data is used to operate platform services, manage appointments, improve performance, provide support, and comply with legal requirements.'
        },
        {
          heading: '4. Data Sharing',
          content: 'We do not sell personal data. Sharing only occurs with user consent, essential service integrations, or legal requirements.'
        },
        {
          heading: '5. Security & Retention',
          content: 'Appropriate technical security measures are enforced. Data is retained as required for services or legal compliance.'
        },
        {
          heading: '6. Scope of Policy',
          content: 'Applies to all digital services offered by Dr Profile including profiles, booking forms, and dashboards.'
        },
        {
          heading: '7. Your Rights & Contact',
          content: 'Users can request data modification or deletion by emailing drprofileweb@gmail.com'
        }
      ]
    },
    disclaimer: {
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
      titleAr: 'إخلاء المسؤولية والتنبيه الطبي',
      titleEn: 'Disclaimer & Medical Notice',
      subtitleAr: 'منصة دكتور بروفايل هي منصة تقنية تتيح للأطباء إنشاء وإدارة بروفايلاتهم الطبية وحضورهم الرقمي، بالإضافة إلى إدارة المواعيد وطلبات الحجز والتواصل مع المرضى.',
      subtitleEn: 'Dr Profile is a technical platform for doctors to manage medical profiles and appointment requests.',
      updatedAr: 'آخر تحديث: أغسطس 2026',
      updatedEn: 'Last Updated: August 2026',
      sectionsAr: [
        {
          heading: 'أولًا: عدم تقديم خدمات طبية',
          content: 'دكتور بروفايل لا يقدم تشخيصات أو استشارات أو علاجات طبية، ولا يحل محل الطبيب أو العيادة أو أي جهة طبية مختصة. جميع المعلومات والمحتويات الطبية يتم إدخالها من الطبيب نفسه.'
        },
        {
          heading: 'ثانيًا: مسؤولية المحتوى المنشور',
          content: 'يتحمل الطبيب المسؤولية الكاملة عن صحة ودقة المعلومات والصور والخدمات والأسعار وأي محتوى يقوم بإضافته إلى بروفايله.'
        },
        {
          heading: 'ثالثًا: عدم ضمان النتائج الطبية',
          content: 'لا تضمن المنصة أي نتائج علاجية أو تحسن صحي ناتج عن الخدمات الطبية التي يقدمها الطبيب. أي تشخيص أو علاج هو مسؤولية الطبيب المهنية.'
        },
        {
          heading: 'رابعًا: دقة وحداثة المعلومات',
          content: 'نسعى لتقديم أدوات مساعدة للأطباء لتحديث بياناتهم، ولكن المنصة لا تضمن بقاء كل المعلومات محدثة في كل الأوقات. ويحق للمنصة تعديل أو إزالة أي محتوى مخالف.'
        },
        {
          heading: 'خامسًا: التعامل بين الطبيب والمريض',
          content: 'تتم العلاقة الطبية وأي اتفاقات علاجية أو مالية بشكل مباشر بين الطبيب والمريض دون أدنى مسؤولية على المنصة.'
        },
        {
          heading: 'سادسًا: حق إزالة المحتوى أو الحساب',
          content: 'تحتفظ المنصة بحقها في تعطيل أو إزالة أي محتوى أو حساب يخالف شروط الاستخدام أو اللوائح المعمول بها.'
        },
        {
          heading: 'سابعًا: كيفية التواصل',
          content: 'للاستفسارات أو الإبلاغ عن محتوى مخالف، يمكن التواصل عبر البريد الإلكتروني: drprofileweb@gmail.com'
        }
      ],
      sectionsEn: [
        {
          heading: '1. No Direct Medical Services',
          content: 'Dr Profile does not provide direct medical advice, diagnosis, or treatments. Content is managed directly by doctors.'
        },
        {
          heading: '2. Content Responsibility',
          content: 'Doctors bear sole responsibility for the accuracy of their listed services, prices, and information.'
        },
        {
          heading: '3. No Outcome Guarantees',
          content: 'The platform does not guarantee medical treatment outcomes or health improvements.'
        },
        {
          heading: '4. Information Accuracy',
          content: 'While tools are provided to update information, the platform does not guarantee perpetual completeness and reserves the right to remove non-compliant content.'
        },
        {
          heading: '5. Doctor-Patient Direct Relationship',
          content: 'Medical and financial interactions occur directly between doctor and patient with no platform liability.'
        },
        {
          heading: '6. Content Removal Rights',
          content: 'The platform reserves the right to suspend or remove violating content or accounts.'
        },
        {
          heading: '7. Contact Information',
          content: 'For inquiries or reports, contact us at drprofileweb@gmail.com'
        }
      ]
    }
  };

  const activeDoc = docData[docType];
  if (!activeDoc) return null;

  const sections = isEn ? activeDoc.sectionsEn : activeDoc.sectionsAr;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dir-rtl text-right"
        dir={isEn ? 'ltr' : 'rtl'}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-2xl shrink-0">
              {activeDoc.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#10244A] font-almarai">
                  {isEn ? activeDoc.titleEn : activeDoc.titleAr}
                </h2>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span>{isEn ? 'Official Policy' : 'وثيقة رسمية'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isEn ? activeDoc.subtitleEn : activeDoc.subtitleAr}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-all cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 leading-relaxed font-almarai text-sm sm:text-base">
          <div className="text-xs font-bold text-blue-600 bg-blue-50/70 border border-blue-100 px-3 py-1.5 rounded-xl inline-block">
            {isEn ? activeDoc.updatedEn : activeDoc.updatedAr}
          </div>

          <div className="space-y-5">
            {sections.map((sec, idx) => (
              <div key={idx} className="p-4 sm:p-5 bg-slate-50/60 border border-slate-100 rounded-2xl space-y-2">
                <h3 className="text-base sm:text-lg font-black text-[#10244A]">
                  {sec.heading}
                </h3>
                <p className="text-slate-600 font-medium leading-relaxed text-xs sm:text-sm">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Action */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
          <div className="text-xs font-bold text-slate-500">
            {isEn ? 'Platform: Dr Profile Medical' : 'منصة دكتور بروفايل الطبية'}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#10244A] hover:bg-[#0051A8] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {isEn ? 'Close Window' : 'إغلاق النافذة'}
          </button>
        </div>
      </div>
    </div>
  );
}
