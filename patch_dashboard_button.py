import re

with open('src/components/Dashboard.tsx', 'r') as f:
    content = f.read()

target = r"""                  <a
                    href=\{`https://wa.me/201000000000\?text=\$\{encodeURIComponent\(`مرحباً إدارة دكتور بروفايل، أود الاستفسار عن تجديد/ترقية اشتراكي للطبيب: \$\{formData\.name\}`\)\}`\}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-gradient-to-r from-\[#0B2545\] via-\[#003B7A\] to-\[#0051A8\] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>تواصل مع الإدارة</span>
                  </a>"""

replacement = r"""                  <a
                    href={`https://wa.me/${landingConfig?.dashboardSettings?.contactAdminWhatsappNumber || '201000000000'}?text=${encodeURIComponent((landingConfig?.dashboardSettings?.contactAdminMessage || 'مرحباً إدارة دكتور بروفايل، أود الاستفسار عن تجديد/ترقية اشتراكي للطبيب: {doctorName}').replace('{doctorName}', formData.name))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-3 bg-gradient-to-r from-[#0B2545] via-[#003B7A] to-[#0051A8] hover:opacity-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>{landingConfig?.dashboardSettings?.contactAdminButtonText || 'تواصل مع الإدارة'}</span>
                  </a>"""

content = re.sub(target, replacement, content)

with open('src/components/Dashboard.tsx', 'w') as f:
    f.write(content)
