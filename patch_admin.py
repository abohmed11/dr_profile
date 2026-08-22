import re

with open('src/components/AdminPanel.tsx', 'r') as f:
    content = f.read()

# 1. Update LandingSubTab
tab_target = r"type LandingSubTab = 'hero' \| 'features' \| 'pricing' \| 'clientWorks' \| 'contact' \| 'login' \| 'createSite' \| 'footer';"
tab_replacement = r"type LandingSubTab = 'hero' | 'features' | 'pricing' | 'clientWorks' | 'contact' | 'login' | 'createSite' | 'footer' | 'dashboardSettings';"
content = re.sub(tab_target, tab_replacement, content)

# 2. Ensure initial state doesn't crash but wait, it's fine.

# 3. Add to the menu array
menu_target = r"""                \{ id: 'contact' as const, label: 'تواصل معنا', icon: Phone \},
                \{ id: 'login' as const, label: 'تسجيل الدخول', icon: Lock \},
                \{ id: 'createSite' as const, label: 'ابدأ الآن مجاناً', icon: UserPlus \},
                \{ id: 'footer' as const, label: 'الفوتر', icon: Layers \},"""

menu_replacement = """                { id: 'contact' as const, label: 'تواصل معنا', icon: Phone },
                { id: 'login' as const, label: 'تسجيل الدخول', icon: Lock },
                { id: 'createSite' as const, label: 'ابدأ الآن مجاناً', icon: UserPlus },
                { id: 'dashboardSettings' as const, label: 'لوحة الطبيب (الاشتراكات)', icon: Settings },
                { id: 'footer' as const, label: 'الفوتر', icon: Layers },"""

content = re.sub(menu_target, menu_replacement, content)

# 4. Add the section
section_target = r"""            \{\/\* Sub-section 6: تسجيل الدخول \*\/\}\n\s*\{landingSubTab === 'login' && \("""
section_replacement = """            {/* Sub-section Dashboard Settings: لوحة الطبيب */}
            {landingSubTab === 'dashboardSettings' && (
              <div className="bg-white rounded-3xl border border-neutral-200/60 p-6 md:p-8 shadow-sm space-y-6 text-right">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <span className="text-xs text-neutral-400 font-bold">تعديل نصوص زر الإدارة في لوحة الطبيب (الاشتراكات)</span>
                  <h3 className="text-base font-black text-[#10244A]">قسم لوحة الطبيب</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">نص زر تواصل مع الإدارة (Contact Admin Button)</label>
                    <input 
                      type="text" 
                      value={localLanding.dashboardSettings?.contactAdminButtonText || 'تواصل مع الإدارة'}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        dashboardSettings: { ...(localLanding.dashboardSettings || {}), contactAdminButtonText: e.target.value }
                      } as any)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">رقم الواتساب للتواصل مع الإدارة (WhatsApp Number)</label>
                    <input 
                      type="text" 
                      value={localLanding.dashboardSettings?.contactAdminWhatsappNumber || '201000000000'}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        dashboardSettings: { ...(localLanding.dashboardSettings || {}), contactAdminWhatsappNumber: e.target.value }
                      } as any)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black text-left"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-neutral-700 mb-2">رسالة الواتساب الافتراضية (استخدم {doctorName} لاسم الطبيب)</label>
                    <textarea 
                      rows={3}
                      value={localLanding.dashboardSettings?.contactAdminMessage || 'مرحباً إدارة دكتور بروفايل، أود الاستفسار عن تجديد/ترقية اشتراكي للطبيب: {doctorName}'}
                      onChange={(e) => setLocalLanding({
                        ...localLanding,
                        dashboardSettings: { ...(localLanding.dashboardSettings || {}), contactAdminMessage: e.target.value }
                      } as any)}
                      className="w-full px-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-black resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sub-section 6: تسجيل الدخول */}
            {landingSubTab === 'login' && ("""

content = re.sub(section_target, section_replacement, content)

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(content)

