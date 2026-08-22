import re

with open('src/types.ts', 'r') as f:
    content = f.read()

target = r"  createSite: \{"

replacement = r"""  dashboardSettings: {
    contactAdminButtonText: 'تواصل مع الإدارة',
    contactAdminWhatsappNumber: '201000000000',
    contactAdminMessage: 'مرحباً إدارة دكتور بروفايل، أود الاستفسار عن تجديد/ترقية اشتراكي للطبيب: {doctorName}'
  },
  createSite: {"""

content = re.sub(target, replacement, content)

with open('src/types.ts', 'w') as f:
    f.write(content)
