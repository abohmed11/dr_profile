/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LandingPageConfig } from '../types';
import { Sparkles, Target, ShieldCheck, HeartHandshake, Award, Stethoscope, ArrowRight, ArrowLeft } from 'lucide-react';

export type LegalDocType = 'about' | 'terms' | 'privacy' | 'disclaimer';

interface LegalPageProps {
  initialDoc?: LegalDocType;
  onNavigate?: (view: string) => void;
  currentLang?: 'ar' | 'en';
  landingConfig?: LandingPageConfig;
}

export default function LegalPage({ initialDoc = 'about', onNavigate, currentLang = 'ar', landingConfig }: LegalPageProps) {
  const isEn = currentLang === 'en';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [initialDoc]);

  const customAbout = landingConfig?.importantPages?.about;
  const customTerms = landingConfig?.importantPages?.terms;
  const customPrivacy = landingConfig?.importantPages?.privacy;
  const customDisclaimer = landingConfig?.importantPages?.disclaimer;

  const termsEmail = customTerms?.contactEmail || landingConfig?.importantPages?.termsEmail || 'drprofileweb@gmail.com';
  const privacyEmail = customPrivacy?.contactEmail || landingConfig?.importantPages?.privacyEmail || 'drprofileweb@gmail.com';
  const disclaimerEmail = customDisclaimer?.contactEmail || landingConfig?.importantPages?.disclaimerEmail || 'drprofileweb@gmail.com';

  const defaultTermsSectionsAr = [
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
        `لأي استفسارات أو ملاحظات بخصوص شروط الاستخدام، يمكنك التواصل مع فريق دكتور بروفايل عبر البريد الإلكتروني ${termsEmail} . سيتم مراجعة أي طلبات أو شكاوى وفق سياسات المنصة وضوابطها القانونية.`
      ]
    }
  ];

  const defaultTermsSectionsEn = [
    {
      heading: '1. Platform Nature & Scope',
      content: 'Dr Profile is a software technology solution designed for medical digital branding and appointment coordination. The platform is not a healthcare facility and does not provide direct medical advice or diagnostics.'
    },
    {
      heading: '2. Doctor Account & Legal Responsibility',
      content: 'Registered medical practitioners agree to provide accurate and updated information regarding their identity, specialties, certificates, and clinic locations. Doctors bear full legal and medical responsibility for all content and prices listed on their profiles.'
    },
    {
      heading: '3. Acceptable Use Policy',
      content: 'You agree not to use the platform for unlawful purposes, misrepresent qualifications, impersonate other medical professionals, or attempt to disrupt platform functionality or scrape data.'
    },
    {
      heading: '4. Subscriptions & Billing',
      content: 'The platform offers monthly and annual subscription plans with a free trial. Renewal and cancellation details are outlined in the pricing policy.'
    },
    {
      heading: '5. Modifications & Termination',
      content: 'Dr Profile reserves the right to modify these terms at any time. We also reserve the right to suspend or terminate accounts that violate these terms.'
    }
  ];

  const defaultPrivacySectionsAr = [
    {
      heading: 'أولًا: البيانات التي نجمعها من الأطباء',
      intro: 'قد نجمع البيانات الأساسية التي يقدمها الطبيب عند إنشاء حسابه أو بروفايله، مثل:',
      bullets: [
        'الاسم.',
        'التخصص.',
        'رقم الهاتف.',
        'البريد الإلكتروني.',
        'بيانات العيادات والفروع وعناوينها.',
        'الخدمات والأسعار ومواعيد العمل.',
        'الصور والمحتوى الذي يختار الطبيب إضافته إلى بروفايله.',
        'روابط وسائل التواصل الاجتماعي ووسائل الاتصال التي يضيفها الطبيب.'
      ]
    },
    {
      heading: 'ثانيًا: البيانات التي قد تُجمع من الزوار أو المرضى',
      paragraphs: [
        'عند استخدام نماذج الحجز أو التواصل الموجودة في بروفايل الطبيب، قد يتم جمع بيانات أساسية يقدمها الزائر، مثل الاسم ورقم الهاتف والبريد الإلكتروني وبيانات الحجز أو سبب الزيارة إذا كان النموذج يتضمن ذلك.',
        'تُستخدم هذه البيانات بالقدر اللازم لتنفيذ طلب الحجز أو التواصل مع الطبيب أو العيادة.'
      ]
    },
    {
      heading: 'ثالثًا: كيفية استخدام البيانات',
      intro: 'نستخدم البيانات بالقدر اللازم من أجل:',
      bullets: [
        'تقديم خدمات المنصة وتشغيل البروفايلات الطبية.',
        'إدارة الحسابات والمواعيد والحجوزات.',
        'تمكين الطبيب من إدارة وتحديث بيانات بروفايله.',
        'تحسين أداء المنصة وتجربة المستخدم.',
        'تقديم الدعم الفني ومعالجة طلبات المستخدمين.',
        'إرسال الإشعارات المتعلقة بالخدمة أو الحساب.',
        'الاستجابة للطلبات الرسمية والالتزامات القانونية عند الحاجة.'
      ]
    },
    {
      heading: 'رابعًا: مشاركة البيانات مع أطراف ثالثة',
      paragraphs: [
        'لا نقوم ببيع البيانات الشخصية للأطباء أو الزوار.',
        'وقد تتم مشاركة أو إتاحة البيانات بالقدر اللازم في الحالات التالية:'
      ],
      numbered: [
        'بناءً على موافقة صاحب البيانات عندما تكون الموافقة مطلوبة.',
        'عند الحاجة لتشغيل خدمة أو تكامل تقني ضروري لتقديم خدمات المنصة.',
        'عند وجود التزام قانوني أو طلب رسمي من جهة مختصة.',
        'عند الحاجة لحماية أمن المنصة أو حقوقها أو حقوق المستخدمين.'
      ]
    },
    {
      heading: 'خامسًا: أمن المعلومات والاحتفاظ بالبيانات',
      paragraphs: [
        'نتخذ إجراءات تقنية وتنظيمية مناسبة للمساعدة في حماية البيانات من الوصول غير المصرح به أو الفقد أو التعديل أو سوء الاستخدام.',
        'ومع ذلك، لا يمكن ضمان حماية مطلقة لأي بيانات يتم نقلها أو تخزينها عبر الإنترنت.',
        'يتم الاحتفاظ بالبيانات طوال فترة الحاجة إليها لتقديم الخدمات أو وفقًا للمتطلبات القانونية، وبعد انتهاء الحاجة إليها قد يتم حذفها أو إخفاء ما يحدد هوية صاحبها وفق الإجراءات المتاحة والمتطلبات القانونية.'
      ]
    },
    {
      heading: 'سادسًا: ارتباط السياسة بخدمات المنصة',
      paragraphs: [
        'تنطبق هذه السياسة على الخدمات الرقمية التي تقدمها منصة دكتور بروفايل، بما في ذلك البروفايلات الطبية، نماذج الحجز، لوحة التحكم، إدارة المواعيد، وأي خدمات أو تكاملات أخرى يتم تفعيلها داخل المنصة.',
        'قد تخضع بعض الخدمات لسياسات أو شروط إضافية يتم توضيحها للمستخدم عند تفعيلها.'
      ]
    },
    {
      heading: 'سابعًا: حقوقك وكيفية التواصل',
      paragraphs: [
        `يحق للطبيب طلب تحديث بياناته أو تعديلها أو حذفها، أو طلب الحصول على نسخة من بياناته، وذلك في حدود ما تسمح به القوانين واللوائح المعمول بها.`,
        `للتواصل مع فريق دكتور بروفايل بخصوص الخصوصية أو البيانات، يرجى مراسلتنا عبر البريد الإلكتروني: ${privacyEmail}`
      ]
    }
  ];

  const defaultPrivacySectionsEn = [
    {
      heading: '1. Data Collected from Doctors',
      intro: 'We may collect basic data provided by doctors when creating an account or profile, including:',
      bullets: [
        'Name.',
        'Specialty.',
        'Phone number.',
        'Email address.',
        'Clinic & branch locations and addresses.',
        'Services, pricing, and working hours.',
        'Photos and content chosen by the doctor.',
        'Social media links and contact channels.'
      ]
    },
    {
      heading: '2. Data Collected from Visitors & Patients',
      paragraphs: [
        'When using booking or contact forms on a doctor profile, basic visitor data may be collected such as name, phone number, email, and booking reasons if included in the form.',
        'This data is strictly used to process booking requests or communicate with the doctor/clinic.'
      ]
    },
    {
      heading: '3. How We Use Your Data',
      intro: 'We use data as necessary to:',
      bullets: [
        'Provide platform services and power medical profiles.',
        'Manage accounts, appointments, and bookings.',
        'Enable doctors to manage and update profile information.',
        'Improve platform performance and user experience.',
        'Offer technical support and resolve user requests.',
        'Send service or account notifications.',
        'Respond to legal obligations or official requests when required.'
      ]
    },
    {
      heading: '4. Sharing Data with Third Parties',
      paragraphs: [
        'We do not sell personal data of doctors or visitors.',
        'Data may be shared or processed in the following necessary situations:'
      ],
      numbered: [
        'Based on data owner consent when consent is required.',
        'When needed for technical integrations essential to platform services.',
        'Upon legal obligations or official regulatory requests.',
        'When required to protect platform security, rights, or user safety.'
      ]
    },
    {
      heading: '5. Information Security & Data Retention',
      paragraphs: [
        'We implement appropriate technical and organizational measures to safeguard data against unauthorized access, loss, alteration, or misuse.',
        'However, absolute security cannot be guaranteed for data transmitted or stored over the internet.',
        'Data is retained as long as necessary to provide services or per legal requirements, after which it may be erased or anonymized.'
      ]
    },
    {
      heading: '6. Scope & Platform Services Integration',
      paragraphs: [
        'This policy applies to digital services provided by Dr Profile, including doctor profiles, booking forms, dashboard, appointment management, and connected integrations.',
        'Certain services may be subject to additional terms clarified upon activation.'
      ]
    },
    {
      heading: '7. Your Rights & Contact Information',
      paragraphs: [
        `Doctors have the right to request updates, modifications, erasure, or copies of their stored data within legal boundaries.`,
        `To contact Dr Profile regarding privacy or data, please email: ${privacyEmail}`
      ]
    }
  ];

  const defaultDisclaimerSectionsAr = [
    {
      heading: 'أولًا: عدم تقديم خدمات طبية',
      paragraphs: [
        'دكتور بروفايل لا يقدم تشخيصات أو استشارات أو علاجات طبية، ولا يحل محل الطبيب أو العيادة أو أي جهة طبية مختصة.',
        'جميع المعلومات والمحتويات الطبية التي ينشرها الطبيب في بروفايله يتم إدخالها وإدارتها من خلال الطبيب نفسه، ولا تمثل بالضرورة رأيًا أو توصية طبية صادرة عن المنصة.'
      ]
    },
    {
      heading: 'ثانيًا: مسؤولية المحتوى المنشور',
      paragraphs: [
        'يتحمل الطبيب المسؤولية الكاملة عن صحة ودقة المعلومات والصور والخدمات والأسعار وأي محتوى يقوم بإضافته إلى بروفايله.',
        'المنصة لا تتحمل مسؤولية الأخطاء أو المعلومات غير الدقيقة التي قد يتم نشرها من خلال حساب الطبيب.'
      ]
    },
    {
      heading: 'ثالثًا: عدم ضمان النتائج الطبية',
      paragraphs: [
        'لا تضمن المنصة أي نتائج علاجية أو تحسن صحي ناتج عن الخدمات الطبية التي يقدمها الطبيب.',
        'أي تشخيص أو توصية أو خطة علاجية يقدمها الطبيب تكون مسؤوليته المهنية الخاصة، ويجب على المريض الرجوع إلى الطبيب المختص للحصول على التقييم والاستشارة الطبية المناسبة.'
      ]
    },
    {
      heading: 'رابعًا: دقة وحداثة المعلومات',
      paragraphs: [
        'نسعى إلى توفير أدوات تساعد الأطباء على تحديث بياناتهم، إلا أن المنصة لا تضمن أن جميع المعلومات المنشورة في بروفايلات الأطباء تظل محدثة أو مكتملة في جميع الأوقات.',
        'ويحق للمنصة إزالة أو تعديل أو تعطيل أي محتوى يخالف شروط الاستخدام أو القوانين واللوائح المعمول بها.'
      ]
    },
    {
      heading: 'خامسًا: التعامل بين الطبيب والمريض',
      paragraphs: [
        'تتم العلاقة الطبية وأي اتفاقات أو تعاملات مالية أو علاجية بين الطبيب والمريض بشكل مباشر بين الطرفين.',
        'ويتحمل الطبيب مسؤولية الخدمات الطبية التي يقدمها، كما يتحمل المريض مسؤولية اختيار الطبيب وطلب الخدمة الطبية المناسبة له.',
        'ولا تتحمل المنصة مسؤولية النتائج الطبية أو الاتفاقات أو الالتزامات التي تنشأ بين الطبيب والمريض.'
      ]
    },
    {
      heading: 'سادسًا: حق إزالة المحتوى أو الحساب',
      paragraphs: [
        'تحتفظ منصة دكتور بروفايل بحقها في إزالة أو تعطيل أي محتوى أو حساب يخالف شروط الاستخدام أو السياسات المعمول بها أو القوانين واللوائح ذات الصلة.',
        'ويجوز اتخاذ هذه الإجراءات عند الحاجة لحماية المستخدمين أو المنصة أو سلامة المجتمع الرقمي.'
      ]
    },
    {
      heading: 'سابعًا: كيفية التواصل',
      paragraphs: [
        `للاستفسارات أو الإبلاغ عن محتوى مخالف أو مشكلة متعلقة بأحد البروفايلات، يمكن التواصل مع فريق دكتور بروفايل عبر البريد الإلكتروني: ${disclaimerEmail}`
      ]
    }
  ];

  const defaultDisclaimerSectionsEn = [
    {
      heading: '1. No Direct Medical Services',
      paragraphs: [
        'Dr Profile does not provide direct diagnoses, consultations, or medical treatments, and does not replace qualified physicians or medical facilities.',
        'All medical content on profiles is managed by the doctors themselves and does not constitute a recommendation by the platform.'
      ]
    },
    {
      heading: '2. Published Content Responsibility',
      paragraphs: [
        'Doctors bear full responsibility for the accuracy of information, images, pricing, and services listed on their profiles.',
        'The platform is not liable for errors or inaccurate details published on doctor accounts.'
      ]
    },
    {
      heading: '3. No Guarantee of Medical Outcomes',
      paragraphs: [
        'The platform does not guarantee therapeutic outcomes or health improvements resulting from doctor services.',
        'Any diagnosis or treatment plan is the sole professional responsibility of the attending physician.'
      ]
    },
    {
      heading: '4. Accuracy & Timeliness of Information',
      paragraphs: [
        'We provide tools to update profiles, but do not guarantee all information remains complete at all times.',
        'The platform reserves the right to modify or disable content violating policy or applicable laws.'
      ]
    },
    {
      heading: '5. Doctor-Patient Relationship',
      paragraphs: [
        'The medical relationship and financial/treatment agreements occur directly between doctor and patient.',
        'The platform carries no liability for agreements, medical results, or commitments formed between parties.'
      ]
    },
    {
      heading: '6. Right to Remove Content or Accounts',
      paragraphs: [
        'Dr Profile reserves the right to disable or delete any violating account or content to protect platform safety and users.'
      ]
    },
    {
      heading: '7. Contact Us',
      paragraphs: [
        `For inquiries or reporting violating content, contact us via email: ${disclaimerEmail}`
      ]
    }
  ];

  const docData = {
    about: {
      id: 'about' as LegalDocType,
      path: '/about',
      badgeAr: customAbout?.badgeAr || 'من نحن',
      badgeEn: customAbout?.badgeEn || 'About Us',
      titleAr: customAbout?.titleAr || 'من نحن',
      titleEn: customAbout?.titleEn || 'About Us',
      subtitleAr: customAbout?.headlineAr || 'نساعد الأطباء على بناء حضور طبي رقمي احترافي بسهولة واحترافية.',
      subtitleEn: customAbout?.headlineEn || 'Empowering doctors to build a professional medical digital presence with ease and excellence.',
      isAboutPage: true,
      sectionsAr: [
        {
          heading: customAbout?.storyTitleAr || 'قصتنا',
          icon: 'story',
          paragraphs: [
            customAbout?.storyTextAr || 'دكتور بروفايل منصة متخصصة تساعد الأطباء على إنشاء بروفايل طبي احترافي يعرض خبراتهم وتخصصاتهم وخدماتهم، ويمنحهم حضورًا رقميًا مميزًا يسهل الوصول إليه ومشاركته مع المرضى.',
            customAbout?.storyText2Ar || 'نؤمن أن لكل طبيب خبرة تستحق أن تظهر بصورة احترافية، لذلك صممنا المنصة لتوفر تجربة بسيطة ومرنة دون الحاجة إلى خبرة تقنية.'
          ]
        },
        {
          heading: customAbout?.offeringsTitleAr || 'ما نقدمه',
          icon: 'offerings',
          intro: customAbout?.offeringsIntroAr || 'نوفر للأطباء أدوات متكاملة لإنشاء وإدارة بروفايلهم الطبي بسهولة، تشمل:',
          bullets: customAbout?.offeringsItemsAr || [
            'تصميم بروفايل طبي احترافي ومتوافق مع الهواتف الذكية.',
            'عرض التخصصات، الخدمات، وسنوات الخبرة.',
            'إضافة وسائل التواصل والموقع الجغرافي للعيادة.',
            'رابط مخصص وسهل المشاركة مع المرضى.',
            'لوحة تحكم بسيطة لتحديث البيانات في أي وقت.'
          ]
        },
        {
          heading: customAbout?.visionTitleAr || 'رؤيتنا',
          icon: 'vision',
          paragraphs: [
            customAbout?.visionTextAr || 'أن نكون الخيار الأول للأطباء في العالم العربي لبناء وتطوير هويتهم الرقمية بكفاءة واحترافية.'
          ]
        },
        {
          heading: customAbout?.valuesTitleAr || 'قيمنا',
          icon: 'values',
          valueCards: customAbout?.valuesItemsAr || [
            { title: 'الاحترافية', desc: 'تقديم حلول رقمية تليق بالمكانة الطبية.' },
            { title: 'البساطة', desc: 'تجربة استخدام سهلة ومرنة للأطباء والمرضى.' },
            { title: 'الثقة والأمان', desc: 'الحفاظ على خصوصية البيانات وحمايتها.' },
            { title: 'التطوير المستمر', desc: 'تحديث خدماتنا باستمرار لتلبية احتياجات الأطباء.' }
          ]
        }
      ],
      sectionsEn: [
        {
          heading: customAbout?.storyTitleEn || 'Our Story',
          icon: 'story',
          paragraphs: [
            customAbout?.storyTextEn || 'Dr Profile is a specialized platform that helps medical practitioners build a professional medical profile highlighting their expertise, specialties, and clinic services, giving them a distinguished digital presence that is easy for patients to access and share.',
            customAbout?.storyText2En || 'We believe every doctor’s medical expertise deserves to be showcased professionally, which is why we built our platform to offer a simple, seamless, and flexible experience requiring zero technical expertise.'
          ]
        },
        {
          heading: customAbout?.offeringsTitleEn || 'What We Offer',
          icon: 'offerings',
          intro: customAbout?.offeringsIntroEn || 'We provide physicians and clinics with comprehensive tools to easily launch and manage their medical profile, including:',
          bullets: customAbout?.offeringsItemsEn || [
            'Professional, mobile-responsive medical profile design.',
            'Display specialties, clinic services, and years of medical expertise.',
            'Add direct contact channels and clinic Google Maps location.',
            'Custom dedicated URL that is effortless to share with patients.',
            'Simple, powerful dashboard to update information at any time.'
          ]
        },
        {
          heading: customAbout?.visionTitleEn || 'Our Vision',
          icon: 'vision',
          paragraphs: [
            customAbout?.visionTextEn || 'To be the number one choice for medical practitioners across the Arab world to build, grow, and empower their digital presence with peak efficiency and professionalism.'
          ]
        },
        {
          heading: customAbout?.valuesTitleEn || 'Our Values',
          icon: 'values',
          valueCards: customAbout?.valuesItemsEn || [
            { title: 'Professionalism', desc: 'Delivering digital solutions worthy of medical prestige.' },
            { title: 'Simplicity', desc: 'An effortless, flexible experience for doctors and patients alike.' },
            { title: 'Trust & Security', desc: 'Safeguarding patient data and maintaining strict privacy standards.' },
            { title: 'Continuous Growth', desc: 'Constantly upgrading our platform to serve the evolving needs of medical professionals.' }
          ]
        }
      ]
    },
    terms: {
      id: 'terms' as LegalDocType,
      path: '/terms',
      badgeAr: customTerms?.badgeAr || 'وثائق قانونية',
      badgeEn: customTerms?.badgeEn || 'Legal Document',
      titleAr: customTerms?.titleAr || 'شروط استخدام منصة دكتور بروفايل',
      titleEn: customTerms?.titleEn || 'Terms of Use for Dr Profile Platform',
      subtitleAr: customTerms?.subtitleAr || 'هذا المستند يوضح شروط وأحكام استخدامك لخدمات منصة دكتور بروفايل («المنصة»). باستخدامك للمنصة فأنت تقر بالالتزام الكامل بكل ما ورد أدناه.',
      subtitleEn: customTerms?.subtitleEn || 'This document sets forth the terms and conditions for using Dr Profile platform services. By using the platform, you agree to comply with all provisions below.',
      sectionsAr: (customTerms?.sections && customTerms.sections.length > 0)
        ? customTerms.sections.map(s => ({
            heading: s.headingAr,
            intro: s.introAr,
            paragraphs: s.paragraphsAr,
            bullets: s.bulletsAr
          }))
        : defaultTermsSectionsAr,
      sectionsEn: (customTerms?.sections && customTerms.sections.length > 0)
        ? customTerms.sections.map(s => ({
            heading: s.headingEn || s.headingAr,
            intro: s.introEn,
            paragraphs: s.paragraphsEn,
            bullets: s.bulletsEn,
            content: s.paragraphsEn?.join('\n')
          }))
        : defaultTermsSectionsEn
    },
    privacy: {
      id: 'privacy' as LegalDocType,
      path: '/privacy',
      badgeAr: customPrivacy?.badgeAr || 'وثائق قانونية',
      badgeEn: customPrivacy?.badgeEn || 'Legal Document',
      titleAr: customPrivacy?.titleAr || 'سياسة الخصوصية وحماية البيانات',
      titleEn: customPrivacy?.titleEn || 'Privacy and Data Protection Policy',
      subtitleAr: customPrivacy?.subtitleAr || 'نلتزم في منصة دكتور بروفايل بالتعامل مع بيانات الأطباء والزوار بطريقة مناسبة وبما يتوافق مع القوانين واللوائح المعمول بها. توضح هذه السياسة أنواع البيانات التي قد يتم جمعها وكيفية استخدامها وحمايتها.',
      subtitleEn: customPrivacy?.subtitleEn || 'At Dr Profile platform, we are committed to handling doctor and visitor data appropriately and in compliance with applicable laws and regulations. This policy explains the types of data collected, used, and protected.',
      sectionsAr: (customPrivacy?.sections && customPrivacy.sections.length > 0)
        ? customPrivacy.sections.map(s => ({
            heading: s.headingAr,
            intro: s.introAr,
            paragraphs: s.paragraphsAr,
            bullets: s.bulletsAr
          }))
        : defaultPrivacySectionsAr,
      sectionsEn: (customPrivacy?.sections && customPrivacy.sections.length > 0)
        ? customPrivacy.sections.map(s => ({
            heading: s.headingEn || s.headingAr,
            intro: s.introEn,
            paragraphs: s.paragraphsEn,
            bullets: s.bulletsEn,
            content: s.paragraphsEn?.join('\n')
          }))
        : defaultPrivacySectionsEn
    },
    disclaimer: {
      id: 'disclaimer' as LegalDocType,
      path: '/disclaimer',
      badgeAr: customDisclaimer?.badgeAr || 'وثائق قانونية',
      badgeEn: customDisclaimer?.badgeEn || 'Legal Document',
      titleAr: customDisclaimer?.titleAr || 'إخلاء المسؤولية والتنبيه الطبي',
      titleEn: customDisclaimer?.titleEn || 'Disclaimer & Medical Notice',
      subtitleAr: customDisclaimer?.subtitleAr || 'منصة دكتور بروفايل هي منصة تقنية تتيح للأطباء إنشاء وإدارة بروفايلاتهم الطبية وحضورهم الرقمي، بالإضافة إلى إدارة المواعيد وطلبات الحجز والتواصل مع المرضى. يوضح هذا المستند حدود مسؤولية المنصة والطبيب تجاه المحتوى والخدمات المقدمة من خلال بروفايل الطبيب.',
      subtitleEn: customDisclaimer?.subtitleEn || 'Dr Profile is a technical platform for doctors to manage medical profiles and appointment requests. This document sets out the limitations of liability for the platform and doctors.',
      sectionsAr: (customDisclaimer?.sections && customDisclaimer.sections.length > 0)
        ? customDisclaimer.sections.map(s => ({
            heading: s.headingAr,
            intro: s.introAr,
            paragraphs: s.paragraphsAr,
            bullets: s.bulletsAr
          }))
        : defaultDisclaimerSectionsAr,
      sectionsEn: (customDisclaimer?.sections && customDisclaimer.sections.length > 0)
        ? customDisclaimer.sections.map(s => ({
            heading: s.headingEn || s.headingAr,
            intro: s.introEn,
            paragraphs: s.paragraphsEn,
            bullets: s.bulletsEn,
            content: s.paragraphsEn?.join('\n')
          }))
        : defaultDisclaimerSectionsEn
    }
  };

  const activeKey: LegalDocType = (initialDoc && docData[initialDoc]) ? initialDoc : 'about';
  const currentDoc = docData[activeKey];
  const sections = isEn ? currentDoc.sectionsEn : currentDoc.sectionsAr;

  return (
    <div className="w-full min-h-[85vh] bg-slate-50/50 py-10 md:py-16 font-almarai" dir={isEn ? 'ltr' : 'rtl'}>
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Card */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-10 md:p-14 shadow-sm space-y-8">
          
          {/* Document Title Header */}
          <div className="space-y-4 border-b border-slate-100 pb-8 text-center sm:text-start">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#10244A]/5 border border-[#10244A]/15 text-[#10244A] text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-[#0051A8]" />
              <span>{isEn ? currentDoc.badgeEn : currentDoc.badgeAr}</span>
            </div>
            
            <h1 className="text-2xl sm:text-4xl font-black text-[#10244A] tracking-tight">
              {isEn ? currentDoc.titleEn : currentDoc.titleAr}
            </h1>

            <p className="text-base sm:text-xl text-slate-800 font-extrabold leading-relaxed pt-1">
              {isEn ? currentDoc.subtitleEn : currentDoc.subtitleAr}
            </p>
          </div>

          {/* Sections List */}
          {sections && sections.length > 0 && (
            <div className="space-y-10 pt-2">
              {sections.map((sec: any, idx: number) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-lg sm:text-2xl font-black text-[#10244A] flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-[#0051A8] inline-block shrink-0"></span>
                    {sec.heading}
                  </h2>
                  
                  <div className={`space-y-4 ${isEn ? 'pl-4 border-l-2' : 'pr-4 border-r-2'} border-slate-100`}>
                    {sec.intro && (
                      <p className="text-slate-800 text-base sm:text-lg font-bold leading-relaxed">
                        {sec.intro}
                      </p>
                    )}

                    {sec.paragraphs && (
                      <div className="space-y-3.5">
                        {sec.paragraphs.map((para: string, pIdx: number) => (
                          <p key={pIdx} className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed text-justify">
                            {para}
                          </p>
                        ))}
                      </div>
                    )}

                    {sec.bullets && (
                      <ul className="space-y-2.5 text-slate-700 text-base sm:text-lg font-normal pt-1">
                        {sec.bullets.map((bullet: string, bIdx: number) => (
                          <li key={bIdx} className="flex items-start gap-2.5 leading-relaxed">
                            <span className="w-2 h-2 rounded-full bg-[#0051A8] mt-2.5 shrink-0"></span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {sec.numbered && (
                      <ol className="list-decimal list-inside space-y-2 text-slate-700 text-base sm:text-lg font-normal pt-1">
                        {sec.numbered.map((item: string, nIdx: number) => (
                          <li key={nIdx} className="leading-relaxed">
                            {item}
                          </li>
                        ))}
                      </ol>
                    )}

                    {/* Values Cards Grid for "قيمنا" */}
                    {sec.valueCards && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {sec.valueCards.map((val: any, vIdx: number) => (
                          <div 
                            key={vIdx} 
                            className="bg-slate-50 hover:bg-blue-50/40 border border-slate-200/90 hover:border-[#0051A8]/30 rounded-2xl p-4 sm:p-5 transition-all duration-200"
                          >
                            <h3 className="text-base sm:text-lg font-black text-[#10244A] mb-1.5 flex items-center gap-2">
                              <span className="text-[#0051A8]">✦</span>
                              {val.title}
                            </h3>
                            <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                              {val.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {sec.content && !sec.paragraphs && !sec.bullets && !sec.valueCards && (
                      <p className="text-slate-700 text-base sm:text-lg font-normal leading-relaxed text-justify">
                        {sec.content}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action CTA Box at Bottom */}
          <div className="pt-8 border-t border-slate-150 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-start">
              <h4 className="text-sm sm:text-base font-extrabold text-[#10244A]">
                {isEn ? 'Ready to launch your medical profile?' : 'جاهز لبدء حضورك الطبي الرقمي؟'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {isEn ? 'Start free now with no technical knowledge required.' : 'ابدأ مجاناً الآن بدون أي خبرة تقنية أو تعقيد.'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onNavigate) {
                  onNavigate('create');
                } else {
                  window.location.href = '/register';
                }
              }}
              className="w-full sm:w-auto px-6 py-3 bg-[#0051A8] hover:bg-[#003B7A] text-white font-black text-sm rounded-xl transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{isEn ? 'Create Free Profile' : 'أنشئ حسابك مجاناً'}</span>
              {isEn ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
